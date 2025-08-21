import Coupon from "../models/coupons.model.js"
import Order from "../models/order.model.js";
import { stripe } from "../libs/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				// ✅ IMPORTANT: Save the product key, not id
				products: JSON.stringify(
					products.map((p) => ({
						product: p.productId, // ✅ This matches schema
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};


export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId, shippingAddress } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      const products = JSON.parse(session.metadata.products);

      // Validate products
      if (!products || !Array.isArray(products) || products.some(p => !p.product)) {
        throw new Error('Invalid products data in session metadata');
      }

      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.product,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
        shippingAddress: shippingAddress,
        status: "processing",
        paymentStatus: "paid"
      });

      await newOrder.save();
      
      // Populate order with user and product details for email
      const populatedOrder = await Order.findById(newOrder._id)
        .populate('user', 'name email')
        .populate('products.product', 'name price');

      // Send payment success email
      const { sendPaymentSuccessEmail } = await import('../utils/orderEmails.js');
      await sendPaymentSuccessEmail(populatedOrder, populatedOrder.user.email, populatedOrder.user.name);

      res.status(200).json({
        success: true,
        message: "Payment successful, order created, and coupon deactivated if used.",
        transactionId: newOrder._id,
        amountPaid: newOrder.totalAmount,
        cartItems: [],
      });
    } else {
      // Send payment failed email
      const { sendPaymentFailedEmail } = await import('../utils/orderEmails.js');
      const userEmail = session.customer_email || req.user?.email;
      const userName = req.user?.name || 'Customer';
      const amount = session.amount_total ? (session.amount_total / 100) : 0;
      
      if (userEmail) {
        await sendPaymentFailedEmail(userEmail, userName, sessionId, amount);
      }
      
      res.status(400).json({ message: "Payment not completed." });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    
    // Send payment failed email on error
    try {
      const { sendPaymentFailedEmail } = await import('../utils/orderEmails.js');
      const userEmail = req.user?.email;
      const userName = req.user?.name || 'Customer';
      
      if (userEmail) {
        await sendPaymentFailedEmail(userEmail, userName, req.body.sessionId || 'unknown', 0);
      }
    } catch (emailError) {
      console.error('Error sending payment failed email:', emailError);
    }
    
    res.status(500).json({ message: "Error processing successful checkout", error: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}

