import express from "express";
import BookLoan from "../models/BookLoan.js";
import Book from "../models/Book.js";
import authToken from "../middleware/authToken.js";

const router = express.Router();

// Middleware to check if the user has permission to manage book loans
const canManageBookLoans = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin" || role === "referent" || role === "simple") {
    next();
  } else {
    res.status(403).json({ message: "Access denied (canManageLoans)" });
  }
};

// Protected routes (authentication required)
router.use(authToken);

// Create a new book loan
router.post("/", canManageBookLoans, async (req, res) => {
  const { book, userId, returnDate } = req.body;
  const newBookLoan = new BookLoan({ book, userId, returnDate });
  try {
    const savedBookLoan = await newBookLoan.save();
    res.status(201).json(savedBookLoan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all book loans
router.get("/", canManageBookLoans, async (req, res) => {
  try {
    const bookLoans = await BookLoan.find();
    res.json(bookLoans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book loans by userId
router.get("/:userId", canManageBookLoans, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching book loans for userId: ${userId}`); // Log the userId being fetched
    const bookLoans = await BookLoan.find({ userId }).populate("book");
    res.json(bookLoans);
  } catch (err) {
    console.error(`Error fetching book loans for userId ${userId}:`, err); // Log the error
    res.status(500).json({ message: err.message });
  }
});

// Update a book loan
router.put("/:id", canManageBookLoans, async (req, res) => {
  const { book, userId, returnDate } = req.body;
  try {
    const updatedBookLoan = await BookLoan.findByIdAndUpdate(
      req.params.id,
      { book, userId, returnDate },
      { new: true }
    );
    if (updatedBookLoan) {
      res.json(updatedBookLoan);
    } else {
      res.status(404).json({ message: "Book loan not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book loan
router.delete("/:id", canManageBookLoans, async (req, res) => {
  try {
    const deletedBookLoan = await BookLoan.findByIdAndDelete(req.params.id);
    if (deletedBookLoan) {
      res.json({ message: "Book loan deleted" });
    } else {
      res.status(404).json({ message: "Book loan not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
