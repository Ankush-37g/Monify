import {Router} from "express"
import { upload } from "../middleware/MulterMiddleware.js"
import { signUp,loginUser,refreshAccessToken } from "../controllers/UserControllers.js"
const router = Router()

router.post(
    '/signup',

    upload.fields([{name:"profilePhoto", maxCount: 1}]),

    signUp)
     
router.post('/login',loginUser)
router.post('/refresh-token',refreshAccessToken)

