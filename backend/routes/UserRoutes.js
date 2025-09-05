import {Router} from "express"
import { upload } from "../middleware/MulterMiddleware.js"
import { signUp,loginUser,refreshAccessToken, resetPassword, googleAuth,logoutUser } from "../controllers/UserControllers.js"
import { verifyJWT } from "../middleware/AuthMiddleware.js"


const userRouter = Router()

userRouter.post(
    '/signup',

    upload.fields([{name:"profilePhoto", maxCount: 1}]),

    signUp)
     
userRouter.post('/login',loginUser)

userRouter.post('/resetPassword',resetPassword)

userRouter.post('/refresh-token',refreshAccessToken)

userRouter.post('/google', googleAuth)

userRouter.post('/logout',verifyJWT,logoutUser)

export {userRouter}

