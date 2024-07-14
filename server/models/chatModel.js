import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  buyer: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  messages: {
    type: Array,
    default: [],
  },
});

const Chat = mongoose.model("chats", chatSchema);

export default Chat;
