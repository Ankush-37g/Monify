import mongoose , {Schema} from  "mongoose"

const budgetSchema = new Schema(
    {
       user : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
       category: {type: String, required: true, trim: true},
       amount : {type: Number, required: true},
       monthYear : {type: String, required: true}
    },
    {
        timestamps: true
    }
)

export const Budget = mongoose.models.Budget || mongoose.model("Budget",budgetSchema)