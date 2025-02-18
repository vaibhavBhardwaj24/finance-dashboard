import mongoose from "mongoose";
const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "Housing",
      "Food",
      "Transport",
      "Health",
      "Entertainment",
      "Savings",
      "Miscellaneous",
    ],
    required: true,
    default: "Miscellaneous",
  },
  timestamp: { type: Date, default: Date.now },
});
const Expense =
  mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

export default Expense;
