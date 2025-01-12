import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose,{isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.model.js";
//import {User} from "../models/user.model.js";
import cookieParser from "cookie-parser";

const createTweet=asyncHandler(async(req,res)=>{
    const {content} = req.body;
    if(!content){
        throw new ApiError(400,"Content is required");
    }
    const tweet= await Tweet.create({
        content,
        owner:req.user._id 
    })
    if(!tweet){
        throw new ApiError(500,"Error in creating tweet");
    }
    return res.status(201)
    .json(new ApiResponse(201,tweet,"Tweet created succesfully"));
})

const getUserTweets=asyncHandler(async(req,res)=>{
    const {userId}=req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id");
    }        
    const tweets= await Tweet.find({owner:userId});
    if(tweets.length===0){
        throw new ApiError(404,"No tweets found");
    }
    return res.status(200)
    .json(new ApiResponse(200,tweets,"User tweets fetched"))
})

const updateTweet=asyncHandler(async(req,res)=>{
    const {content}= req.body;
    if(!content){
        throw new ApiError(400,"Content is required");
    }
    const {tweetId}=req.params;
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }
    if(tweet.owner.toString()!==req.user._id){
        throw new ApiError(403,"You are not the owner of this tweet");
    }
    const modifiedTweet= await Tweet.findByIdAndUpdate(tweetId,{
        $set:{
            content
        }
    },{new:true})
    if(!modifiedTweet){
        throw new ApiError(500,"Error in updating tweet");
    }
    return res.status(200)
    .json(new ApiResponse(200,modifiedTweet,"Tweet updated"))
})

const deleteTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params;
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id");
    }
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404,"Tweet not found");
    }
    if(tweet.owner.toString()!==req.user._id){
        throw new ApiError(400,"You are not owner of this tweet");
    }
    const response =await Tweet.findByIdAndDelete(tweetId);
    if(!response){
        throw new ApiError(500,"Error in deleting tweet");
    }
    return res.status(200)
    .json(200,response, "Tweet deleted")
})
export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}