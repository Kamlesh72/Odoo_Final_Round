import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    senderMail: {
      type: String,
      required: true,
    },
    receiverMail: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('notifications', notificationSchema);

export default Notification;