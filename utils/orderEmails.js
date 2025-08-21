import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransporter({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const getStatusMessage = (status) => {
    const messages = {
        pending: "Your order has been received and is being processed.",
        processing: "Your order is currently being prepared for shipment.",
        shipped: "Great news! Your order has been shipped and is on its way.",
        delivered: "Your order has been successfully delivered. Thank you for your purchase!",
        cancelled: "Your order has been cancelled. If you have any questions, please contact us."
    };
    return messages[status] || "Your order status has been updated.";
};

const formatProducts = (products) => {
    return products.map(item => {
        const product = item.product || item;
        return `• ${product.name || 'Product'} - Quantity: ${item.quantity} - $${item.price}`;
    }).join('\n');
};

export const sendOrderStatusEmail = async (order, userEmail, userName) => {
    const transporter = createTransporter();
    const orderNumber = `ORD-${order._id.toString().slice(-8).toUpperCase()}`;
    const statusMessage = getStatusMessage(order.status);
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Order Update: ${orderNumber} - ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #333; text-align: center;">Order Status Update</h2>
                <p>Dear ${userName},</p>
                <p>${statusMessage}</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #555; margin-top: 0;">Order Details:</h3>
                    <p><strong>Order Number:</strong> ${orderNumber}</p>
                    <p><strong>Status:</strong> <span style="color: #007bff; font-weight: bold;">${order.status.toUpperCase()}</span></p>
                    <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
                    ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #555;">Products:</h3>
                    <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
                        ${formatProducts(order.products)}
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #666;">Thank you for choosing us!</p>
                    <p style="color: #999; font-size: 12px;">If you have any questions, please contact our support team.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order status email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending order status email:', error);
    }
};

export const sendPaymentSuccessEmail = async (order, userEmail, userName) => {
    const transporter = createTransporter();
    const orderNumber = `ORD-${order._id.toString().slice(-8).toUpperCase()}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `Payment Confirmed - Order ${orderNumber}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #28a745; margin: 0;">✅ Payment Successful!</h2>
                </div>
                
                <p>Dear ${userName},</p>
                <p>Great news! Your payment has been successfully processed and your order is confirmed.</p>
                
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="color: #155724; margin-top: 0;">Order Confirmation:</h3>
                    <p style="margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
                    <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: #28a745; font-weight: bold;">PAID</span></p>
                    <p style="margin: 5px 0;"><strong>Amount Paid:</strong> $${order.totalAmount}</p>
                    <p style="margin: 5px 0;"><strong>Order Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                </div>
                
                <div style="margin: 20px 0;">
                    <h3 style="color: #555;">Items Ordered:</h3>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                        ${formatProducts(order.products)}
                    </div>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h4 style="color: #856404; margin-top: 0;">What's Next?</h4>
                    <p style="margin: 5px 0; color: #856404;">• Your order is now being processed</p>
                    <p style="margin: 5px 0; color: #856404;">• You'll receive shipping updates via email</p>
                    <p style="margin: 5px 0; color: #856404;">• Expected processing time: 1-2 business days</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #666;">Thank you for your purchase!</p>
                    <p style="color: #999; font-size: 12px;">Keep this email for your records.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment success email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending payment success email:', error);
    }
};

export const sendPaymentFailedEmail = async (userEmail, userName, sessionId, amount) => {
    const transporter = createTransporter();
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Payment Failed - Action Required',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #dc3545; margin: 0;">❌ Payment Failed</h2>
                </div>
                
                <p>Dear ${userName},</p>
                <p>We're sorry, but your payment could not be processed at this time.</p>
                
                <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <h3 style="color: #721c24; margin-top: 0;">Payment Details:</h3>
                    <p style="margin: 5px 0;"><strong>Session ID:</strong> ${sessionId}</p>
                    <p style="margin: 5px 0;"><strong>Amount:</strong> $${amount}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">FAILED</span></p>
                </div>
                
                <div style="background-color: #cce7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
                    <h4 style="color: #004085; margin-top: 0;">What You Can Do:</h4>
                    <p style="margin: 5px 0; color: #004085;">• Check your payment method details</p>
                    <p style="margin: 5px 0; color: #004085;">• Ensure sufficient funds are available</p>
                    <p style="margin: 5px 0; color: #004085;">• Try a different payment method</p>
                    <p style="margin: 5px 0; color: #004085;">• Contact your bank if the issue persists</p>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.CLIENT_URL}/checkout" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Try Again</a>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #666;">Need help? Contact our support team.</p>
                    <p style="color: #999; font-size: 12px;">We're here to assist you with your purchase.</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment failed email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending payment failed email:', error);
    }
};

// Legacy function for backward compatibility
const sendOrderEmail = async (order) => {
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nuevo pedido de ${order.name} - ${order.email}`,
        text: `Nuevo pedido de ${order.name} - ${order.email}
        Productos: ${order.products.map(product => product.name).join(", ")}
        Total: $${order.total}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email enviado");
    } catch (error) {
        console.log(error);
    }
};

export default sendOrderEmail;