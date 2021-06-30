const nodemailer = require('nodemailer');
const catchAsync = require('../../utils/catchAsync');

exports.sendEmail = catchAsync(async (params = {}) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;
  let transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: 'Bhushan Dhage bhushan89038@gmail.com',
    to: params.reciever,
    subject: params.subject || '',
    text: params.messege || '',
    html: params.html,
  });
  console.log(info);
});
