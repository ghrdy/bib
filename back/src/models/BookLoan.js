import mongoose from "mongoose";

const bookLoanSchema = new mongoose.Schema({
  bookTitle: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  loanDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: Date,
});

export default mongoose.model("BookLoan", bookLoanSchema);
