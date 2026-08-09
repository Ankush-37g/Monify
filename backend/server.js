import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./database/db.js"
import { initCronJobs } from "./utils/cronJobs.js"  // Import initialization function

//to load environment variables from .env file into process.env
dotenv.config({
   path: "./.env"
})

const app = express()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is running on port : ${process.env.PORT}`)
        // Initialize cron jobs after server starts
        initCronJobs();
        console.log("Cron jobs initialized successfully");
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed ...",error)
})

    
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "5mb"}))

app.use(express.urlencoded({extended: true, limit:"5mb"}))

app.use(express.static("public"))

app.use(cookieParser())



import { userRouter } from "./routes/UserRoutes.js"
import { incomeRouter } from "./routes/IncomeRoutes.js"
import { errorHandler } from "./middleware/ErrorHandler.js"
import { expenseRouter } from "./routes/ExpenseRoutes.js"
import { budgetRouter } from "./routes/BudgetRoutes.js"
import { aiRouter } from "./routes/AiRoutes.js"


app.use('/api/user',userRouter)
app.use('/api/income',incomeRouter)
app.use('/api/expense',expenseRouter)
app.use('/api/budget',budgetRouter)
app.use('/api/ai',aiRouter)

app.get('/',(req,res)=> {res.send("Api working")})

app.use(errorHandler)






