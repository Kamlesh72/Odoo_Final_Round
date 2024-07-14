import { Router } from "express";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) throw new Error("Fill all data");
    const user = await User.findOne({ email });
    if (user) throw new Error("User already exists");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, name, password: hashedPassword });
    await newUser.save();
    res.send({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Fill all data");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Password");
    console.log(user);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      message: "User Logged in successfully",
      token,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Get Current User
router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      success: true,
      message: "User fetched Successfully",
      data: user,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/get-chats", async (req, res) => {
  try {
    const { productId, buyer, seller } = req.body;
    let filters = { productId };
    if (buyer) filters.buyer = buyer;
    if (seller) filters.seller = seller;
    const chat = await Chat.find(filters);
    if (chat) {
      return res.send({
        success: true,
        message: "Message Success",
        chat,
      });
    }
    res.send({
      success: true,
      message: "Message Success",
      chat: [],
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { productId, buyer, buyerName, seller, messageSenderId, message } =
      req.body;
    console.log(req.body);
    const chat = await Chat.findOneAndUpdate(
      { productId, buyer, seller },
      {
        $push: {
          messages: {
            messageSenderId,
            message,
          },
        },
      }
    );
    if (!chat) {
      await new Chat({
        productId,
        buyer,
        buyerName,
        seller,
        messages: [
          {
            messageSenderId,
            message,
          },
        ],
      }).save();
    }
    res.send({
      success: true,
      message: "Message Success",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

export default router;
