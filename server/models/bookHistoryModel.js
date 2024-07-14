import mongoose from 'mongoose';

const bookHistorySchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'books',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  penalty: {
    type: Number,
    required: true,
    default: 0,
  },
});

const BookHistory = mongoose.model('bookHistory', bookHistorySchema);
export default BookHistory;
