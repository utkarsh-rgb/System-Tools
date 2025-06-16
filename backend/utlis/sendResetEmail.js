const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

async function sendResetEmail(toEmail, resetLink) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports like 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"Password Reset" <no-reply@example.com>',
    to: toEmail,
    subject: "Password Reset Request",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `<p>Click the following link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
  });

  console.log("Reset email sent: %s", info.messageId);
}

module.exports = sendResetEmail;
