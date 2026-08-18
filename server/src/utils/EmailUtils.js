const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (recipientEmails, subject, htmlContent) => {
    const recipientEmailsStr = Array.isArray(recipientEmails)
        ? recipientEmails.join(", ")
        : recipientEmails;

    const mailDetails = {
        from: process.env.EMAIL_USER,
        to: recipientEmailsStr,
        subject: subject,
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailDetails);
        console.log("Email sent successfully: ", info.messageId);
        return info;
    } catch (err) {
        console.log("Unable to send email: ", err.message || err);
    }
};

module.exports = { sendEmail };
