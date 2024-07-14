import Notification from '../models/notificationModel.js';

export const createNotification = async (
  senderMail,
  receiverMail,
  senderName,
  receiverName,
  message
) => {
  try {
    console.log(senderMail, receiverMail, senderName, receiverName, message);
    const newNotification = new Notification({
      senderMail,
      receiverMail,
      senderName,
      receiverName,
      message,
    });
    await newNotification.save();
  } catch (error) {
    console.log(error.message);
  }
};
