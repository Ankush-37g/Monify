import { User } from '../models/UserModel.js';
import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { Expense } from '../models/ExpenseModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addExpense = asyncHandler( async(req, res)=> {

    const user = await User.findById(req.user._id)

    if (!user) {
       throw new ApiError(404, "User not found");
    }
     
    const {expenseCategory, amount, date} = req.body
    
    if(!expenseCategory || !amount || !date)
    {
      throw new ApiError("400", "All fields are required");
    }
    
    const expense = await Expense.create({
        expenseCategory,
        amount,
        date,
        user: user._id
    })

    return res.status(201)
              .json(new ApiResponse(201,expense,"Expense added Successfully"));

})

const deleteExpense = asyncHandler( async(req, res)=> {

      const {id} = req.body

      if(!id)
      {
        throw new ApiError(400,"Id is required")
      }
     
      await Expense.findByIdAndDelete(id)

      return res
        .status(200)
        .json(new ApiResponse(200,"Expense Removed Successfully"))
})

const listExpenses = asyncHandler( async (req, res) =>{
 
    const expenses = await Expense.find({user: req.user._id}).sort({ date: -1 }); 

    return res
    .status(200)
    .json(new ApiResponse(200,expenses))

     
})

export {addExpense,deleteExpense,listExpenses}