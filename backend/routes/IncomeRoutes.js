import Router from "express"
import { verifyJWT } from "../middleware/AuthMiddleware.js"
import { addIncome, deleteIncome } from "../controllers/IncomeController.js"


const incomeRouter = Router()

incomeRouter.post('/add',verifyJWT,addIncome)

incomeRouter.post('/delete',verifyJWT,deleteIncome)

