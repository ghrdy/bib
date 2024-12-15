import mongoose from "mongoose";

const bookLoanSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Livre",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loanDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    required: true,
  },
});

export default mongoose.model("BookLoan", bookLoanSchema);
