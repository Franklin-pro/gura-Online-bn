import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
const mailOptions = {
  from: `"gura online shop" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Password Reset Request",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Password Reset Request</h2>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <div style="margin: 20px 0;">
        <a href="${resetUrl}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #dc2626;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
        ">Reset Password</a>
      </div>
      <p style="color: #666; font-size: 14px;">
        If you didn't request this, please ignore this email. This link will expire in 1 hour.
      </p>
    </div>
  `,
  text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`
};
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendPasswordResetEmail;