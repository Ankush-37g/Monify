import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

//to load environment variables from .env file into process.env
dotenv.config({
   path: "./.env"
})

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "20kb"}))

app.use(express.urlencoded({extended: true, limit:"20kb"}))

app.use(express.static("public"))

app.use(cookieParser())


