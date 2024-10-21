import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js";
import {User} from  "../models/user.model.js";
import {uploadOnCloudinary} from  "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    /*res.status(200).json({
        message:"i changed the message"
    })*/
    //get user details from frontend
    //validation -not empty
    //check if user  already exists:username and email
    //check for images: check for avatar; if exsists then send to cloudinary
    //create user object -create entry in db
    //remove  password and refersh token field from response
    //check for user response
    //return response

    //get user detail
    const {fullName,email,username,password} =req.body
    //console.log("email ",email);
    //this confirms that the data is coming from the frontend

    //validation
    /*if(fullName===""){
        throw new ApiError(400,"fullname not given");
    }*/ //can use this one as it is simple. repeat and do this for all fields
    
    //new method involves .some() . 
    if([fullName,email,username,password].some((field)=>field?.trim==="")){
        throw new ApiError(400,"Some field was empty");        
    }

    //check if already exsist
    const exsisted_user=User.findOne({
        $or:[{username},{email}]  //check for both username and email

    })
    if(exsisted_user){
        throw new ApiError(409,"User with  this username or email already exsist");
    }
    //check for images
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path; 
    //check if avatar has been saved. can do similar for  cover image
    if(!avatarLocalPath){
        throw new  ApiError(400,"Avatar file required");
    }
    //upload om cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"avatar not uploaded to cloudinary");
    }
    //entry in db
    const user=await User.create({
        fullName, 
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email, password,
        username:username.toLowerCase(); 
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken");
    if(!createdUser){
        throw new ApiError(404,"error in registering the user");
    }
    //user is made. now send res
    return  res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    );

})

export {registerUser};