const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtp = async (email, otp) => {
  await resend.emails.send({
    // Resend's free tier requires this sender address unless you verify
    // your own domain with them — swap once you've done that.
    from: "SpendSense <onboarding@resend.dev>",
    to: email,
    subject: "SpendSense - Password Reset OTP",
    html: `
      <h2>SpendSense</h2>

      <p>Hello,</p>

      <p>We received a request to reset your password.</p>

      <h1 style="letter-spacing:5px;color:#2563eb;">
      ${otp}
      </h1>

      <p>This OTP is valid for 10 minutes.</p>

      <p>If you didn't request this password reset, you can safely ignore this email.</p>

      <hr>

      <p>Expense Tracker Team</p>
    `,
  });
};

module.exports = sendOtp;