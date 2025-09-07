import mongoose , {Schema} from  "mongoose"

const budgetSchema = new Schema(
    {
       category: {type: String, required: true, trim: true},
       amount : {type: Number, required: true},
       month : {type: String, required: true},
       user : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
      
    },
    {
        timestamps: true
    }
)

export const Budget = mongoose.models.Budget || mongoose.model("Budget",budgetSchema)