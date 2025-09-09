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
     
    const {expenseCategory, amount, date, isRecurring, frequency} = req.body
    
    if(!expenseCategory || !amount || !date)
    {
      throw new ApiError("400", "All fields are required");
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
    
    const expense = await Expense.create({
        expenseCategory,
        amount,
        date,
        user: user._id,
        isRecurring : isRecurring || null,
        frequency: isRecurring ? frequency : null,
        nextDate:  isRecurring ? nextDate : null
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

const addRecurringExpense = asyncHandler( async(req, res)=> {
    
     const today = new Date()

     const recurringExpenses = await Expense.find({
          isRecurring: true,
          nextDate: {$lte : today}
     })

     for( const expense of recurringExpenses)
     {
        await Expense.create({
            expenseCategory: expense.expenseCategory,
            amount: expense.amount,
            date: today,
            user: expense.user,
            isRecurring: false
        })

        let newDate = new Date(income.nextDate);
        
        if (expense.frequency === "monthly") newDate.setMonth(newDate.getMonth() + 1);
        else if (expense.frequency === "weekly") newDate.setDate(newDate.getDate() + 7);
        else if (expense.frequency === "daily") newDate.setDate(newDate.getDate() + 1);
        else if (expense.frequency === "yearly") newDate.setFullYear(newDate.getFullYear() + 1);

        expense.nextDate = newDate;
        await expense.save();

     }

     return res.status(200)
               .json(new ApiResponse(200,recurringExpenses, "Recurring income processed successfully"))

      
})

export {addExpense,deleteExpense,listExpenses}