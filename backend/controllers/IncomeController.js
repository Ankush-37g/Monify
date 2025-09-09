import { User } from '../models/UserModel.js';
import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { Income } from '../models/IncomeModel.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addIncome = asyncHandler( async(req, res)=> {

    const user = await User.findById(req.user._id)

    if (!user) {
       throw new ApiError(404, "User not found");
    }
     
    const {incomeSource, amount, date, isRecurring, frequency} = req.body
    
    if(!incomeSource || !amount || !date)
    {
      throw new ApiError(400, "All fields are required");
    }

    let nextDate = null

    if(isRecurring && frequency)
    {
       const currentDate = new Date(date)

       if(frequency === "daily")
       {
          nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
       }
       else if(frequency === "weekly")
       {
         nextDate = new Date(currentDate.setDate(currentDate.getDate() + 7))
       }
       else if(frequency === "monthly")
       {
         nextDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
       }
       else if(frequency === "yearly")
       {
         nextDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1))
       }
   
    }

    const income = await Income.create({
        incomeSource,
        amount,
        date,
        user: user._id,
        isRecurring : isRecurring || null,
        frequency: isRecurring ? frequency : null,
        nextDate:  isRecurring ? nextDate : null
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
 
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 }); 

    return res
    .status(200)
    .json(new ApiResponse(200,incomes))

     
})

const addRecurringIncome = asyncHandler( async(req, res)=> {
    
     const today = new Date()

     const recurringIncomes = await Income.find({
          isRecurring: true,
          nextDate: {$lte : today}
     })

     for( const income of recurringIncomes)
     {
        await Income.create({
            incomeSource: income.incomeSource,
            amount: income.amount,
            date: today,
            user: income.user,
            isRecurring: false
        })

        let newDate = new Date(income.nextDate);
        
        if (income.frequency === "monthly") newDate.setMonth(newDate.getMonth() + 1);
        else if (income.frequency === "weekly") newDate.setDate(newDate.getDate() + 7);
        else if (income.frequency === "daily") newDate.setDate(newDate.getDate() + 1);
        else if (income.frequency === "yearly") newDate.setFullYear(newDate.getFullYear() + 1);

        income.nextDate = newDate;
        await income.save();

     }

     return res.status(200)
                    .json(new ApiResponse(200,recurringIncomes, "Recurring income processed successfully"))

      
})

export {addIncome,deleteIncome,listIncomes,addRecurringIncome}