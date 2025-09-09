 import mongoose ,{Schema} from "mongoose"

 const incomeSchema = new Schema(
    {

        incomeSource : {type: String, required: true,trim: true},
        amount: {type: Number, required: true, min: 0 },
        date: {type: Date,default: Date.now},
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

        //For recurring incomes
        isRecurring: {type: Boolean, default: false},
        frequency: {
                     type: "String",
                     enum : ["daily","weekly","monthly","yearly"],
                     default: null
                   },
        nextDate: {type: Date, default: null}

    },
    {
        timestamps: true
    }
 )

export const Income = mongoose.models.Income || mongoose.model("Income",incomeSchema)