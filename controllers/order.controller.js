import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/**
 * @desc    Get all orders for authenticated user
 * @route   GET /api/v1/orders
 * @access  Private
 */
export const getAllOrders = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Status filter
    const status = req.query.status;
    const query = { user: req.user._id };
    if (status) {
      query.status = status;
    }

    // Get orders with pagination and sorting
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: 'products.product',
        select: 'name price image description category isFeatured discount rating',
        model: Product
      });

    // Count total orders for pagination info
    const totalOrders = await Order.countDocuments(query);

    // Transform orders data
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      user: {
        _id: order.user,
        name: req.user.name,
        email: req.user.email
      },
      products: order.products.map(item => ({
        _id: item.product?._id || item.product,
        productId: item.product?._id || item.product,
        name: item.product?.name || 'Product not available',
        description: item.product?.description || '',
        price: item.price, // Use the price at time of purchase
        category: item.product?.category || '',
        image: item.product?.image || '/images/product-placeholder.jpg',
        quantity: item.quantity,
        isFeatured: item.product?.isFeatured || false,
        discount: item.product?.discount || 0,
        rating: item.product?.rating || 0,
        totalPrice: item.price * item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus || 'paid',
      shippingAddress: order.shippingAddress || {},
      stripeSessionId: order.stripeSessionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery || null
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      total: totalOrders,
      page,
      pages: Math.ceil(totalOrders / limit),
      data: formattedOrders
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching orders",
      error: error.message 
    });
  }
};

export const getAllOrdersAsAdmin = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Sorting options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Advanced filtering options for admin
    const { status, paymentStatus, userId, dateFrom, dateTo, minAmount, maxAmount } = req.query;
    const query = {};
    
    // Status filter
    if (status) {
      query.status = Array.isArray(status) ? { $in: status } : status;
    }
    
    // Payment status filter
    if (paymentStatus) {
      query.paymentStatus = Array.isArray(paymentStatus) ? { $in: paymentStatus } : paymentStatus;
    }
    
    // User filter
    if (userId) {
      query.user = userId;
    }
    
    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }
    
    // Amount range filter
    if (minAmount || maxAmount) {
      query.totalAmount = {};
      if (minAmount) query.totalAmount.$gte = parseFloat(minAmount);
      if (maxAmount) query.totalAmount.$lte = parseFloat(maxAmount);
    }

    // Get orders with pagination and sorting
    const orders = await Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: 'products.product',
        select: 'name price image description category isFeatured discount rating',
        model: Product
      })
      .populate({
        path: 'user',
        select: 'name email',
        model: User
      });

    // Count total orders for pagination info
    const totalOrders = await Order.countDocuments(query);

    // Transform orders data with additional admin info
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
      user: {
        _id: order.user?._id || order.user,
        name: order.user?.name || 'Unknown User',
        email: order.user?.email || 'unknown@example.com'
      },
      products: order.products.map(item => ({
        _id: item.product?._id || item.product,
        productId: item.product?._id || item.product,
        name: item.product?.name || 'Product not available',
        description: item.product?.description || '',
        price: item.price, // Use the price at time of purchase
        category: item.product?.category || '',
        image: item.product?.image || '/images/product-placeholder.jpg',
        quantity: item.quantity,
        isFeatured: item.product?.isFeatured || false,
        discount: item.product?.discount || 0,
        rating: item.product?.rating || 0,
        totalPrice: item.price * item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus || 'pending',
      shippingAddress: order.shippingAddress || {},
      stripeSessionId: order.stripeSessionId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery || null,
      // Additional admin-only fields
      paymentMethod: order.paymentMethod || 'unknown',
      adminNotes: order.adminNotes || '',
      fulfillmentStatus: order.fulfillmentStatus || 'unfulfilled'
    }));

    // Additional admin statistics
    const stats = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          avgOrderValue: { $avg: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      total: totalOrders,
      page,
      pages: Math.ceil(totalOrders / limit),
      data: formattedOrders,
      stats: stats[0] || {
        totalRevenue: 0,
        avgOrderValue: 0,
        pendingOrders: 0,
        completedOrders: 0
      }
    });

  } catch (error) {
    console.error("Admin Error fetching orders:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching orders",
      error: error.message 
    });
  }
};
/**
 * @desc    Get single order details
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate({
      path: 'products.product',
      select: 'name price image description category',
      model: Product
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const formattedOrder = {
      _id: order._id,
      orderNumber: `ORD-${order._id.toString().slice(-8).toUpperCase()}`,
          user: {
        _id: order.user,
        name: req.user.name,
        email: req.user.email
      },
      products: order.products.map(item => ({
        _id: item.product?._id || item.product,
        name: item.product?.name || 'Product not available',
        price: item.price,
        image: item.product?.image || '/images/product-placeholder.jpg',
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
      trackingInfo: {
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        estimatedDelivery: order.estimatedDelivery,
        shippedDate: order.shippedDate
      }
    };

    res.status(200).json({
      success: true,
      data: formattedOrder
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message
    });
  }
};

/**
 * @desc    Update order status (admin only)
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update status and tracking info
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    
    // Set shipped date if status changed to 'shipped'
    if (status === 'shipped' && !order.shippedDate) {
      order.shippedDate = new Date();
    }

    await order.save();

    // TODO: Send status update email to customer

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: {
        status: order.status,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        shippedDate: order.shippedDate
      }
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

/**
 * @desc    Cancel an order
 * @route   PUT /api/v1/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage"
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();

    // TODO: Process refund if payment was made
    // TODO: Send cancellation email to customer
    // TODO: Restore product inventory if needed

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        orderId: order._id,
        status: order.status,
        cancelledAt: order.cancelledAt
      }
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};

// In your order controller
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update order payment status
    await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      { paymentStatus: 'paid' }
    );
  }

  res.json({ received: true });
};


export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 } // Sort by date ascending
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order stats",
      error: error.message
    });
  }
}