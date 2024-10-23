import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from  "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT=asyncHandler(async(req, _ ,next)=>{ 
    //v gave _ instead of res as v don't use res in this whole section. so it's a waste so replaced by _. dosen't make a difference  in code but good practice to avoid unused variables. function will work same if used res instead of _
    try {
        const token=req.cookie?.accessToken || req.header("Authoriation")?.replace("Bearer ","");
        //this wil give token either from  cookie or from header
        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        //this takes token and secret key from env and returns decoded token
        
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(401,"Invalid access token");
        }
    
        req.user=user; //adding new object in req. name can b anything instead of .user, can make .banana
        next();
    } catch (error) {
        throw new ApiError(error.status,error?.message||"invalid access token");

    }
})