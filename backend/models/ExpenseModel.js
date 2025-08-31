 import mongoose ,{Schema} from mongoose

 const expenseSchema = new Schema(
    {
        expenseCategory : {type: String, required: true, trim: true},
        amount: {type: Number, required: true, min: 0 },
        date: {type: Date, default: Date.now},
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
    },
    {
        timestamps: true
    }
)

export const Expense = mongoose.models("Expense") || mongoose.model("Expense",expenseSchema)

