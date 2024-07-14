const mailOptions = (receiverMail, subject, message) => {
  return {
    from: process.env.EMAIL_USER,
    to: receiverMail,
    subject: subject,
    text: message,
  };
};
export default mailOptions;
