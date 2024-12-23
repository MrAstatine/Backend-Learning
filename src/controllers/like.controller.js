import mongoose, {isValidObjectId} from 'mongoose';
import {Like} from "../models/like.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getLikedVideos=asyncHandler(async(req,res)=>{

})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
})

const toggleTweetLiike=asyncHandler(async(req,res)=>{
    const {tweetId}= req.parmas;
})

const toggleVideoLike=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
})
export {
    toggleCommentLike,
    toggleTweetLiike,
    toggleVideoLike,
    getLikedVideos
}