import cloudinary from "../../utilis/cloudinary.js";
import Book from "../../models/book/bookModel.js";

// @desc  CreateBook
// @route POST /api/book
// @access Private
const createBook = async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // save to the DB

    const book = await Book.create({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    if (book) {
      res.status(200).json(book);
    }
  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc  GetBook
// @route Get /api/book
// @access Private
const getBook = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in getting books", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc  DeleteBook
// @route Get /api/book
// @access Private
const deleteBook = async () => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
      }
    }

    await book.deleteOne();
  } catch (error) {
    console.log("Error in delete books", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get recommended books by the logged in user

const myProfile = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.error("Get user books error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export { createBook, getBook, deleteBook, myProfile };
