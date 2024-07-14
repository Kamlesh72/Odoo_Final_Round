import { Router } from "express";
import Book from "../models/bookModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from "multer";

const router = Router();

// Add Book
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.send({
      success: true,
      message: "Book Added Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Get all books
router.get("/all-books", async (req, res) => {
  try {
    const books = await Book.find();
    res.send({
      success: true,
      data: books,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Edit a book
router.put("/book/:id", authMiddleware, async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Book Updated Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Delete a book
router.delete("/book/:id", authMiddleware, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Book Deleted Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Upload Image to cloudinary
const storage = multer.diskStorage({
  // Getting image from system
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
router.post(
  "/upload-image",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "odooFinal",
      }); // Sending image to cloudinary
      const bookId = req.body.productId;
      await Book.findByIdAndUpdate(bookId, {
        $push: {
          images: result.secure_url,
        },
      });
      res.send({
        success: true,
        message: "Image Uploaded Successfully",
        data: result.secure_url,
      });
    } catch (err) {
      console.log(err);
      res.send({
        success: false,
        message: err.message,
      });
    }
  }
);

export default router;
