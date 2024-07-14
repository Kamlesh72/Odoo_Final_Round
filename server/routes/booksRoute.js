import { Router } from "express";
import Product from "../models/projectModel.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinaryConfig.js";
import multer from "multer";
import CONSTANTS from "../constants/Constants.js";

const router = Router();

// Add Product
router.post("/product", authMiddleware, async (req, res) => {
  try {
    req.body.status = "approved";
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.send({
      success: true,
      message: "Product Added Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Get all products
router.post("/all-products", async (req, res) => {
  try {
    const { seller, _id, department } = req.body;
    let filters = {};
    if (seller) {
      filters.seller = seller;
    }
    if (department) {
      filters.department = department;
      if (req.body.department?.length === 0)
        filters.department = CONSTANTS.AllDepartments;
    } else {
      filters.department = CONSTANTS.AllDepartments;
    }
    if (_id) {
      filters._id = _id;
    }

    const products = await Product.find(filters).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: products,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Edit a product
router.put("/product/:id", authMiddleware, async (req, res) => {
  try {
    req.body.status = "approved";
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send({
      success: true,
      message: "Product Updated Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

// Delete a product
router.delete("/product/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
});

router.patch('/assign-book/:id', authMiddleware, async (req, res) => {
  try {
    const { assignedTo } = await Book.findById(req.params.id);

    console.log(req.body.email);
    await Book.findByIdAndUpdate(req.params.id, { assignedTo: [...assignedTo, req.body.email] });
    res.send({
      success: true,
      message: "Book Assigned Successfully",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
})

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
      const productId = req.body.productId;
      await Product.findByIdAndUpdate(productId, {
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
