import { User } from '../models/UserModel.js';
import { ApiError } from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import { Income } from '../models/IncomeModel';
import { ApiResponse } from '../utils/ApiResponse';

const addIncome = asyncHandler( async(req, res)=> {

    const user = await User.findById(req.user._id)

    if (!user) {
       throw new ApiError(404, "User not found");
    }
     
    const {incomeSource, amount, date} = req.body
    
    if(!incomeSource || !amount || !date)
    {
      throw new ApiError("400", "All fields are required");
    }
    
    const income = await Income.create({
        incomeSource,
        amount,
        date,
        user: user._id
    })

    return res.status(201)
              .json(new ApiResponse(201,income,"Income added Successfully"));

})

const deleteIncome = asyncHandler( async(req, res)=> {

      const {id} = req.body

      if(!id)
      {
        throw new ApiError(400,"Id is required")
      }
     
      await Income.findByIdAndDelete(id)

      return res
        .status(200)
        .json(new ApiResponse(200,"Income Removed Successfully"))
})

const listIncomes = asyncHandler( async (req, res) =>{
 
    const incomes = await Income.find({}); 

    return res
    .status(200)
    .json(new ApiResponse(200,incomes))

     
})

export {addIncome,deleteIncome,listIncomes}