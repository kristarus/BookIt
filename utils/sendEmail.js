import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  console.log(process.env.SMTP_EMAIL_USER, process.env.SMTP_EMAIL_PASS);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL_USER, // generated ethereal user
      pass: process.env.SMTP_EMAIL_PASS, // generated ethereal password
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  // send mail with defined transport object
  const lalala = await transporter.sendMail(message);
};

export default sendEmail;
