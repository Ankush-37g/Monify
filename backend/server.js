import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./database/db.js"

//to load environment variables from .env file into process.env
dotenv.config({
   path: "./.env"
})

const app = express()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 6000 , ()=>{
        console.log(`Server is running on port : ${process.env.PORT}`)
    })
})
.catch((error)=>{

  console.log("MongoDB connection failed ...",error)
})

    
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "20kb"}))

app.use(express.urlencoded({extended: true, limit:"20kb"}))

app.use(express.static("public"))

app.use(cookieParser())

import { userRouter } from "./routes/UserRoutes.js"
import { incomeRouter } from "./routes/IncomeRoutes.js"

app.use('/api/user',userRouter)
app.use('/api/income',incomeRouter)






