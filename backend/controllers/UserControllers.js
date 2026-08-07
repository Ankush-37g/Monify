import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/UserModel.js";
import validator from "validator"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import bcrypt from "bcrypt"
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only true in prod (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      path: "/", // ensures cookie is sent for all routes
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
};

const generateAccessAndRefreshTokens = async(userId)=> {
    
      try {
         
          const user = await User.findById(userId) 
          
          const accessToken = user.generateAccessToken()
 
          const refreshToken = user.generateRefreshToken()

          user.refreshToken = refreshToken

          await user.save({validateBeforeSave: false})

          return {accessToken,refreshToken}

      } catch (error) {
            
          throw new ApiError(500,"Something went wrong while generating access and refresh token")
      }
}

const googleAuth = asyncHandler(async (req, res) => {

      const { token } = req.body; // frontend sends access_token from Google

      if (!token) {

         throw new ApiError(400, "Google token missing");
      }

      // Verify token with Google
      const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub,email, name, picture } = payload;

      // Check if user already exists
      let user = await User.findOne({ email });

      if (!user) {
      // New user → Create in DB
      user = await User.create({
            name,
            email,
            googleId: sub, 
            authProvider: "google",
            profilePhoto: picture,
            
      });
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens( user._id );

      // const options = {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production", 
      // };

      return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
            new ApiResponse(
            200,
            { user: await User.findById(user._id).select("-password -refreshToken") },
            "Google Auth successful"
            )
      );
});


const signUp = asyncHandler( async(req,res) => {
     
      const {name,email,password} = req.body;

      if(!name || !email || !password)
      {
        throw new ApiError(400,"All fields are required");
      }

      const existedUser = await User.findOne({email})

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

      let profilePhoto = ""

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

      const createdUser = await User.findById(user._id).select(-password);

      if(!createdUser)
      {
          throw new ApiError(500,"Something went wrong while registering the user")
      }

      return res.status(201).json(

            new ApiResponse(200,{user: createdUser},"User signUp Successfully")
      )
})

const loginUser = asyncHandler( async (req,res) => {


      const {email,password} =  req.body

      if(!email)
      {
           throw new ApiError(400,"Email is required")
      }

      const user = await User.findOne({email})
            
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


      return res
      .status(200)
      .cookie("accessToken",accessToken,cookieOptions)
      .cookie("refreshToken",refreshToken,cookieOptions)
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

const logoutUser = asyncHandler( async (req, res) => {
      
      await User.findByIdAndUpdate(

            req.user._id,
            {
                  $set: { refreshToken: undefined}
            },
            {
                  new: true
            }
      )

      return res
      .status(200)
      .clearCookie("accessToken",cookieOptions)
      .clearCookie("refreshToken",cookieOptions)
      .json(new ApiResponse(200,{},"User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {

      const storedRefreshToken = req.cookies.refreshToken;

      if (!storedRefreshToken) {
      throw new ApiError(400, "Unauthorized access");
      }

      try {
            const decodedToken = jwt.verify(
                  storedRefreshToken,
                  process.env.REFRESH_TOKEN_SECRET
            );

            const user = await User.findById(decodedToken._id);

            if (!user) {
                  throw new ApiError(401, "Invalid refresh token");
            }

            if (storedRefreshToken !== user.refreshToken) {
                  throw new ApiError(401, "RefreshToken mismatch");
            }

            
            const accessToken = user.generateAccessToken(user._id);

            return res
                  .status(200)
                  .cookie("accessToken", accessToken, cookieOptions)
                  .json(new ApiResponse(200, null, "Access Token refreshed"));

      } catch (error) {

           throw new ApiError(401, error?.message || "Invalid refresh token");
      }
});

const resetPassword = asyncHandler( async(req,res) => {

      const { email, newPassword, confirmNewPassword } = req.body

      const user = await User.findOne({email})

      if(!user)
      {
            throw new ApiError(400,"Email Id does not")
      }

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

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authorized");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req.user },
        "User fetched successfully"
      )
    );
});


const pingServer = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, null, "Server is alive"));
});

export {signUp,loginUser,refreshAccessToken,resetPassword,googleAuth,logoutUser,getCurrentUser,pingServer}