const nodemailer = require("nodemailer");

// Send an email using nodemailer
const sendEmail = async (options) => {
    // 1) Create transporter (the service that will send the email)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // 2) Define email options (from, to, subject, and content)
    const mailOpts = {
        from: `E-Shop <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // 3) Send the email
    await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;