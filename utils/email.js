const nodemailer = require("nodemailer");

// const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const sendEmail = async (options) => {
  //Creating a transporter
  const transporter = nodemailer.createTransport({
    // host: "sandbox.smtp.mailtrap.io",
    // port: 2525,
    service: "Gmail",
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  //   Configure mail options
  const mailOptions = {
    from: "MashobTechie <sheriffdeenmakinde@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
