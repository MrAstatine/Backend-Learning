import {Video} from "../models/video.model.js"
import mongoose from 'mongoose';
import {Comment} from "../models/comment.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { json } from "express/lib/response.js";

const getVideoComments= asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const {page=1, limit=10}= req.query;
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    const options={page,limit};
    const comments= await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId),
            }
        },{
            $lookup:{
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'createdBy',
                pipeline:{
                    $project:{
                        username:1,
                        fullname:1,
                        avatar:1
                    }
                }
            }
        },{
            $addFields:{
                createdBy:{
                    $first:"$createdBy"
                }
            }
        },{
            $unwind:"$createdBy"
        },{
            $project:{
                content:1,
                createdBy:1
            }
        },{
            $skip:(page-1) *limit
        },{
            $limit:parseInt(limit)
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200,comments,"Comments fetched successfully"));
})

const addComment= asyncHandler(async(req,res)=>{
    const {videoId}= req.params;
    const {content}= req.body;
    const user=req.user._id;
    if(!content){
        throw new ApiError(400,"Content of comment is missing");
    }
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    const comment= await Comment.create({
        content,
        video:videoId,
        owner:user
    })
    if(!comment){
        throw new ApiError(500,"Failed to create comment");
    } 
    return res.status(200)
    .json(new ApiResponse(200,comment,"Comment added successfully"));
})

const updateComment=asyncHandler(async(req,res)=>{
    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"Content of comment is missing");
    }
    const {commentId}=req.params;
    const user=req.user._id;
    const ogComment= await Comment.findById(commentId);
    if(!ogComment){
        throw new ApiError(404,"Comment not found");
    }
    if(ogComment.owner!=user){
        throw new ApiError(403,"You are not the owner of this comment");
    }
    const updatedComment= await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content
        }
    },{
        new:true
    })
    if(!updatedComment){
        throw new ApiError(500,"Failed to update comment");
    }
    return res.status(200)
    .json(new ApiResponse(200,updatedComment,"Comment updated successfully"));
})

const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const user=req.user._id;
    const comment= await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }
    if(comment.owner!=user){
        throw new ApiError(403,"You are not the owner of this comment");
    }
    const deleteComment= await Comment.findByIdAndDelete(commentId);
    if(!deleteComment){
        throw new ApiError(500,"Failed to delete comment");
    }
    return res.status(200)
    .json(new ApiResponse(200,deleteComment,"Comment deleted successfully"));
})

export {getVideoComments,addComment,updateComment,deleteComment};