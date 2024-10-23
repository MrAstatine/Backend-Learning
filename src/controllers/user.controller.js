import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js";
import {User} from  "../models/user.model.js";
import {uploadOnCloudinary} from  "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { use } from "bcrypt/promises.js";

const generateAccessandRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();
        user.refreshToken=refreshToken; //this adds refreshToken  to the user document and thus gets saved in db 
        await user.save({validateBeforeSave:false}); //updates the  user document in db and puts  the new refreshToken in it
        //if u use save without the iside stuff then password also gets kicked in. it will validate that password should be present.
        //by putting  validateBeforeSave:false we are telling mongoose to not validate the document before saving it.
        return{accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something  went wrong in genrating refresh and access token");

    }
}

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
    const exsisted_user= await User.findOne({
        $or:[{username},{email}]  //check for both username and email

    })
    if(exsisted_user){
        throw new ApiError(409,"User with  this username or email already exsist");
    }
    //check for images
    const avatarLocalPath=req.files?.avatar[0]?.path;
    //const coverImageLocalPath=req.files?.coverImage[0]?.path; 
    //if above used then erorr when  no image is sent

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        coverImageLocalPath=req.files.coverImage[0].path;
    }
    
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
        username:username.toLowerCase() 
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

const loginUser=asyncHandler(async(req,res)=>{
    //take data from req.body
    //check if username or email is available, as login will b based on either but code is similar for both
    //find the  user. if user not there then tell that user does not exsist
    //if user found then check password
    //if password good then access and refresh token generated and sent to user
    //both tokens sent as cookies and then repsonse sent that user logged in successfully

    //taking data
    const {email,username,password}=req.body;
    if(!username || !email){
        throw new ApiError(400, "username or email is required");
    }

    //check exsistence
    const user=await User.findOne({
        $or:[{username},{email}] //this is a mongodb syntax of finding either username or email in whole data
    })
    if(!user){
        throw new ApiError(404,"user does not exsist");
    }

    //check  password
    const isPasswordValid =await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"password given is wrong");
    }

    //make access and refresh token
    const {accessToken,refreshToken}=await generateAccessandRefreshTokens(user._id);
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken");

    //send as cookies
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser, accessToken,refreshToken
            //this allows usr to save his tokens. not good practise but is a thing u can do
        },"User logged in successfully")
    )
})

const  logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{ //$set is mogodb thing that changes values
            refreshToken:undefined,
        }
    },{
        new:true //this gives new updated value in response
    })//the above part removes token
    //below part is for cookies. tokens removed from db,and below part removes them from cookies

    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
})

export {
    registerUser,
    loginUser,
    logoutUser
};