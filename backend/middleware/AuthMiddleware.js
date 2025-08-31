import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";

// Middleware to verify JSON Web Token (JWT)
//in this middleware res is not in use so we c replace it with underscore _
export const verifyJWT = asyncHandler(async (req, _ , next) => {

    try {
        // Attempt to retrieve the token from either cookies or the 'Authorization' header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
    
        // If token is missing, throw an Unauthorized (401) error
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        // Verify the token's validity using the secret key from environment variables
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        // Use the decoded token to find the associated user in the database
        // Exclude sensitive fields like 'password' and 'refreshToken'
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        // If no matching user is found, throw an Unauthorized (401) error
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
    
        // Attach the user object to the request for use in next middlewares or route handlers
        req.user = user;
    
        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
         
        throw new ApiError(401,error?.message || "Invalid message token")
    }
});