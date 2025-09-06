import Router from "express"
import { verifyJWT } from "../middleware/AuthMiddleware.js"
import { addBudget,deleteBudget,listBudgets } from "../controllers/BudgetController.js"

const budgetRouter = Router()

budgetRouter.post('/add',verifyJWT,addBudget)

budgetRouter.post('/delete',verifyJWT,deleteBudget)

budgetRouter.post('/list',verifyJWT,listBudgets)

export {budgetRouter}