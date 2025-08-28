import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/UserModel.js";
import validator from "validator"
import {uploadOnCloudinary} from '../utils/cloudinary.js'

const generateAccessAndRefreshTokens = async(userId)=> {
    
      try {
         
          const user = await User.findById(userId)
          
          const accessToken = user.generateAccessToken

          const refreshToken = user.generateRefreshToken

          user.refreshToken = refreshToken

          await user.save({validateBeforeSave: false})

          return {accessToken,refreshToken}

      } catch (error) {
            
            throw new ApiError(500,"Something went wrong while generating access and refresh token")
      }
}

const signUp = asyncHandler( async(req,res) => {
     
      const {name,email,password} = req.body;

      if(!name || !email || !password)
      {
        throw new ApiError(400,"All fields are required");
      }

      const existedUser =  User.findOne({email})

      if(existedUser)
      {
         throw new ApiError(400,"User already exists");
      }

      if(!validator.isEmail(email))
      {
         throw new ApiError(400,"Enter valid email");
      }

      if(!validator.isStrongPassword(password))
      {
         throw new ApiError(400, "Enter strong password ")
      }

      const profilePhotoLocalPath = req.files?.profilePhoto?.[0]?.path

      const profilePhoto = ""

      if(profilePhotoLocalPath)
      {
          profilePhoto = await uploadOnCloudinary(profilePhotoLocalPath)
      }

      const user = await User.create({
            name,
            email,
            password,
            profilePhoto : profilePhoto?.url || ""
      })

      const createdUser = await User.findById(user._id);

      if(!createdUser)
      {
          throw new ApiError(500,"Something went wrong while registering the user")
      }

      return res.status(201).json(

            new ApiResponse(200,createdUser,"User signUp Successfully")
      )
})

const loginUser = asyncHandler( async (req,res) => {


      const {email,password} =  req.body

      if(!email)
      {
           throw new ApiError(400,"Email is required")
      }

      const user = await User.findOne(email)
            
      if(!user)
      {
            throw new ApiError(400,"User does not exist")
      }

      const isPasswordValid = await user.isPasswordCorrect(password)

      if(!isPasswordValid)
      {
            throw new ApiError(401,"Invalid user credentials")
      }

      const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

      const options = {
            httpOnly: true,
            secure: true,
      }

      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
            new ApiResponse(
                  200,
                  {
                        user: loggedInUser,
                  },
                  "User logged In Successfully"
            )
      )

})

const refreshAccessToken = asyncHandler( async (req,res)=> {

      const storedRefreshToken = req.cookies.refreshToken
      
      if(!storedRefreshToken)
      {
            throw new ApiError(400,"Unauthorized access")
      }

      try {
          
            const decodedToken = jwt.verify(

                  storedRefreshToken,
                  process.env.REFRESH_TOKEN_SECRET
            )

            const user = await User.findById(decodedToken._id)

            if(!user)
            {
                throw new ApiError(401,"Invalid refresh token")
            }

            if(storedRefreshToken != user.refreshToken)
            {
                throw new ApiError(401,"RefreshToken mismatch")
            }

            const options = {

                  httpOnly : true,
                  secure: true
            }

            const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

            return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                  new ApiResponse(
                        200,
                        null,
                        "Access Token refreshed"
                  )
            )


      } catch (error) {
            
            throw new ApiError(401, error?.message || "Invalid refresh token")
      }
  
})

const resetPassword = asyncHandler( async(req,res) => {

      const { newPassword, confirmNewPassword } = req.body

      const user = User.findById(req.user._id)

      const match = bcrypt.compare(newPassword,confirmNewPassword)

      if(!match)
      {
         throw new ApiError(400,"Passwords not matching")
      }

      user.password = newPassword

      await user.save({validateBeforeSave: false})

      return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"))

})

export {signUp,loginUser,refreshAccessToken,resetPassword}