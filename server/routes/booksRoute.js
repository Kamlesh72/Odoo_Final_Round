import { Router } from 'express';
import Book from '../models/bookModel.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import cloudinary from '../config/cloudinaryConfig.js';
import multer from 'multer';
import BookHistory from '../models/bookHistoryModel.js';
import User from '../models/userModel.js';
import { ObjectId } from 'mongodb';

const router = Router();

// Add Book
router.post('/book', authMiddleware, async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.send({
      success: true,
      message: 'Book Added Successfully',
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// get single book by id
router.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.send({
      success: true,
      data: book,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Get all books
router.get('/all-books', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
    const sortOrder = order === 'asc' ? 1 : -1;
    const books = await Book.find()
      .sort({ [sortBy]: sortOrder })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
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
router.put('/book/:id', authMiddleware, async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: 'Book Updated Successfully',
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Delete a book
router.delete('/book/:id', authMiddleware, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: 'Book Deleted Successfully',
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
  '/upload-image',
  authMiddleware,
  multer({ storage: storage }).single('file'),
  async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'odooFinal',
      }); // Sending image to cloudinary
      const bookId = req.body.bookId;
      await Book.findByIdAndUpdate(bookId, {
        $push: {
          images: result.secure_url,
        },
      });
      res.send({
        success: true,
        message: 'Image Uploaded Successfully',
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

router.post('/add-history', async (req, res) => {
  try {
    const { bookId, assignedTo, fromDate, toDate } = req.body;
    const user = await User.findById(new ObjectId(assignedTo));
    if (!user) {
      throw new Error('User not found');
    }
    const userName = user.name;
    const userEmail = user.email;

    const bookHistory = new BookHistory({
      bookId,
      assignedTo: user._id,
      userName,
      userEmail,
      fromDate,
      toDate,
    });

    bookHistory.save();
    res.send({
      success: true,
      message: 'Book Assigned Successfully',
    });
  } catch (error) {
    console.log(error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get('/all-history', async (req, res) => {
  try {
    // console.log(123);
    const history = await BookHistory.find();
    res.send({
      success: true,
      data: history,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

router.put('/update-book/:bookid', async (req, res) => {
  try {
    const assignedTo = req.body.assignedTo;
    const bookId = req.params.bookid;

    const bookHistory = await BookHistory.findOne({
      bookId,
      assignedTo: assignedTo,
    });

    if (!bookHistory) {
      return res.status(404).send({
        success: false,
        message: 'Book history not found',
      });
    }

    const now = new Date();
    const returnDate = new Date(bookHistory.toDate);
    const daysOverdue = Math.max((now - returnDate) / (1000 * 60 * 60 * 24), 0);

    const gracePeriod = 15; // days
    const dailyPenaltyRate = 5; // Rs per day

    let totalPenalty = 0;

    if (daysOverdue > gracePeriod) {
      const overdueDays = daysOverdue - gracePeriod;
      totalPenalty = overdueDays * dailyPenaltyRate;
    }

    await BookHistory.updateOne(
      { bookId, assignedTo: assignedTo },
      { $set: { penalty: totalPenalty } }
    );

    res.send({
      success: true,
      message: 'Penalty calculated and updated successfully',
      penalty: totalPenalty,
    });
  } catch (error) {
    console.error('Error calculating penalty:', error.message);
    res.send({
      success: false,
      message: error.message,
    });
  }
});


// Assign a book to a user
router.patch('/assign-book/:bookId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const book = await Book.findById(req.params.bookId);

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (book.quantity - book.assignedTo.length <= 0) {
      return res.send({
        success: false,
        message: "Book out of stock",
      });
    }

    let assigned = book.assignedTo.find(f => f.email === user.email && f.status === 'BOOKED');
    if (assigned) {
      assigned.status = 'ASSIGNED';
      assigned.when = new Date();
    } else {
      book.assignedTo.push({ email: user.email, status: 'ASSIGNED', when: new Date() });
    }

    await book.save();
    res.send({
      success: true,
      message: 'Book Assigned Successfully',
      data: book // Include the updated book data in the response
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Receive a book from a user
router.patch('/receive-book/:bookId', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    const assignedIndex = book.assignedTo.findIndex(f => f.email === user.email && f.status === 'ASSIGNED');
    if (assignedIndex > -1) {
      book.assignedTo.splice(assignedIndex, 1);
      await book.save();
      return res.send({
        success: true,
        message: "Book Received Successfully",
      });
    }

    res.send({
      success: false,
      message: "Book not assigned to user",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Book a book for a user
router.post('/booked/:bookId', authMiddleware, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    const user = await User.findOne({ email: req.body.email });

    if (!user || !book) {
      return res.send({
        success: false,
        message: "User or book not found",
      });
    }

    if (book.quantity - book.assignedTo.length <= 0) {
      return res.send({
        success: false,
        message: "Book out of stock",
      });
    }

    if (book.assignedTo.some(a => a.email === user.email && a.status === 'BOOKED')) {
      return res.send({
        success: false,
        message: "Book Already Booked by User",
      });
    }

    book.assignedTo.push({ email: user.email, status: "BOOKED", bookedAt: new Date(), historyId: null });
    await book.save();
    res.send({
      success: true,
      message: "Book Booked Successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

export default router;
