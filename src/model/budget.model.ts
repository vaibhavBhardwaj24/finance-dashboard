import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  budget: { type: Number, required: true },
});
const Budget = mongoose.models.Budget || mongoose.model("Budget", BudgetSchema);
export default Budget;
