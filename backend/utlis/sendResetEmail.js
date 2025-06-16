const nodemailer = require("nodemailer");

async function sendResetEmail(toEmail, resetLink) {
  // Use Ethereal for testing
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "utkarshgupta.976274@gmail.com",
      pass: "akws mtly fegv haps",
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
