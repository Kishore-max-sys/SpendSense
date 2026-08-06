const transporter=require("./transporter");

const sendOtp=async(email,otp) =>{
        await transporter.sendMail({
                from:process.env.EMAIL_USER,
                to:email,
                subject:"SpendSense - Password Reset OTP",
                html:`
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
                `
        });
}

module.exports=sendOtp;