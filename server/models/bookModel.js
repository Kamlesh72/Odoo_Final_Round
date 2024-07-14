import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: false,
    },
    genre: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    assignedTo: {
      type: Array,
      default: [],
    },
    images: {
      type: Array,
      default: ['https://birkhauser.com/product-not-found.png'],
    },
  },
  { timestamps: true }
);

const Book = mongoose.model('books', bookSchema);

export default Book;
