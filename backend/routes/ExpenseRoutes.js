import Router from "express"
import { verifyJWT } from "../middleware/AuthMiddleware.js"
import { addExpense, deleteExpense, listExpenses } from "../controllers/ExpenseController.js"

const expenseRouter = Router()

expenseRouter.post('/add',verifyJWT,addExpense)

expenseRouter.post('/delete',verifyJWT,deleteExpense)

expenseRouter.post('/list',verifyJWT,listExpenses)

expenseRouter.post('/update',verifyJWT,)


export {expenseRouter}

