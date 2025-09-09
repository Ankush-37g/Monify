import nodemailer from "nodemailer"
import {User} from '../models/UserModel.js'
import { asyncHandler } from "./asyncHandler.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = asyncHandler( async (to, subject, text) => {
      
      const user  = await User.findById(to)
      if (!user || !user.email) return;
      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to,
         subject,
         text
      })

      console.log(`Email sent to ${to}`)
})

export default sendEmail