import {Router} from "express"
import { upload } from "../middleware/MulterMiddleware.js"
import { signUp,loginUser,refreshAccessToken, resetPassword, googleAuth,logoutUser ,getCurrentUser} from "../controllers/UserControllers.js"
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

//protected route
userRouter.post('/logout',verifyJWT,logoutUser)

userRouter.get("/me", verifyJWT, getCurrentUser);

export {userRouter}

