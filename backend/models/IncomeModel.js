 import mongoose ,{Schema} from "mongoose"

 const incomeSchema = new Schema(
    {

    incomeSource : {type: String, required: true,trim: true},
    amount: {type: Number, required: true, min: 0 },
    date: {type: Date,default: Date.now},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}

    },
    {
        timestamps: true
    }
)

export const Income = mongoose.models.Income || mongoose.model("Income",incomeSchema)