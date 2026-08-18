const otpGenerationTemplate = (userDetails, otp) => {
    const subject = "Reset Password OTP";

    const body = `
    <html>
      <body>
        <h3>Hi ${userDetails?.name || 'User'},</h3>
        <p>Your OTP to reset password is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 3 minutes.</p>
      </body>
    </html>
    `;

    return { subject, body };
};

module.exports = { otpGenerationTemplate };