import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('authorization').split(' ')[1];
    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.userId = decryptedToken.userId;
    const user = await User.findById(req.body.userId);
    req.body.role = user.role;
    next();
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

export default authMiddleware;
