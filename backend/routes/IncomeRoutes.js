import Router from "express"
import { verifyJWT } from "../middleware/AuthMiddleware.js"
import { addIncome, addRecurringIncome, deleteIncome, listIncomes } from "../controllers/IncomeController.js"


const incomeRouter = Router()

incomeRouter.post('/add',verifyJWT,addIncome)

incomeRouter.post('/delete',verifyJWT,deleteIncome)

incomeRouter.post('/list',verifyJWT,listIncomes)

incomeRouter.post('/update',verifyJWT,addRecurringIncome)

export {incomeRouter}

 