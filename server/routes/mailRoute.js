import { Router } from "express";
import mailOptions from "../constants/mailConstants.js";
import transporter from "../config/mailConfig.js";

const router = Router();

router.post("/send-mail", async (req, res) => {
  const { receiverMail, subject, message } = req.body;
  console.log(receiverMail,subject,message);
  transporter.sendMail(mailOptions(receiverMail, subject, message), (error, info) => {
    if (error) {
      res.send({
        success: false,
        message: error.message,
      });
    } else {
      res.send({
        success: true,
        message: "Email sent successfully",
      });
    }
  });
});

export default router;