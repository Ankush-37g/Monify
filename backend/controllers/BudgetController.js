import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Budget } from "../models/BudgetModel.js";
import { User } from "../models/UserModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addBudget = asyncHandler( async(req, res)=>{
      
      const user = await User.findById(req.user._id)
    
      if (!user) 
      {
           throw new ApiError(404, "User not found");
      }

      const {category, amount, monthYear} = req.body

      if(!category || !amount || !monthYear)
      {
          throw new ApiError(400, "All fields are required")
      }
      
      const budget = await Budget.create({
            category,
            amount,
            monthYear,
            user: user._id
      })

      return res.status(201)
                .json(new ApiResponse(201,budget,"Budget added Successfully"));

})

const deleteBudget = asyncHandler( async(req, res)=> {

      const {id} = req.body

      if(!id)
      {
        throw new ApiError(400,"BugetId is required")
      }
     
      await Budget.findByIdAndDelete(id)

      return res
            .status(200)
            .json(new ApiResponse(200,"Budget deleted Successfully"))
})

const listBudgets = asyncHandler( async(req, res)=>{
      
      const budgets = await Budget.findBy({user: req.user._id})

      return res
            .status(200)
            .json(new ApiResponse(200,budgets))
       
})

export {addBudget,deleteBudget,listBudgets}


