import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587, // or 465 for secure
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'postmaster@omniscienttechie.me', // Note the change from EMAIL_HOST to EMAIL_USER
    pass: 'd4db7295db7d0d4f39a1f689c199bf81-fe9cf0a8-dab1c5ea',
  },
});

export default transporter;
