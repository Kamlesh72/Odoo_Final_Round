import { Router } from 'express';
import Notification from '../models/notificationModel.js';
import { createNotification } from '../utils/notificationHandler.js';
const router = Router();

router.post('/send-notification', async (req, res) => {
  try {
    const { senderMail, receiverMail, senderName, receiverName, message } =
      req.body;
    await createNotification(
      senderMail,
      receiverMail,
      senderName,
      receiverName,
      message
    );
    console.log('notification created successfully');
    res.send({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.post('/get-notifications', async (req, res) => {
  try {
    const { receiverMail } = req.body;

    if (!receiverMail) {
      return res.status(400).json({
        success: false,
        message: 'Receiver email is required',
      });
    }

    // Query notifications based on receiverMail
    const notifications = await Notification.find({receiverMail});

    console.log('Notifications received successfully');

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
