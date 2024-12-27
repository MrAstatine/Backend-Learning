import mongoose from "mongoose";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {Video} from "../models/video.model.js";
import {Like} from "../models/like.model.js";
import {Subscription} from "../models/subscription.model.js";

const getChannelStats=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const videoCount=await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },{
            $group:{
                _id:"$videoFile",
                totalVideos:{
                    $sum:1
                },
                totalViews:{
                    $sum:"$views"
                }
            }
        },{
            $project:{
                _id:0,
                totalVideos:1,
                totalViews:1
            }
        }
    ])
    const subCount=await Subscription.aggregate([
        {
            $match:{
                channel: new mongoose.Types.ObjectId(userId)
            }
        },{
            $group:{
                _id:null,
                totalSubscribers:{
                    $sum:1
                },
            }
        },{
            $project:{
                _id:0,
                totalSubscribers:1
            }
        }
    ])
    const likeCount=await Like.aggregate([
        {
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videoInfo"
            }
        },{
            $lookup:{
                from:"tweets",
                localField:"tweet",
                foreignField:"_id",
                as:"tweetInfo"
            }
        },{
            $lookup:{
                from:"comments",
                localField:"comment",
                foreignField:"_id",
                as:"commentInfo"
            }
        },{
            $match:{
                $or:[
                    {"videoInfo.owner":userId},
                    {"tweetInfo.owner":userId},
                    {"commentInfo.owner":userId}
                ]
            }
        },{
            $group:{
                _id:null,
                totalLike:{$sum:1}
            }
        },{
            $project:{
                _id:0,
                totalLike:1
            }
        }
    ])
    const info= {
        totalViews:videoCount[0].totalViews,
        totalLikes:likeCount[0].totalLike,
        totalSubscribers:subCount[0].totalSubscribers,
        totalVideos:videoCount[0].totalVideos
    }
    return res.status(200)
    .json(new ApiResponse(200,info,"Channel stats fetched"));
})

const getChannelVideos=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const videos= await Video.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },{
            $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                duration:1,
                views:1,
                isPublished:1,
                owner:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200,videos,"Channel videos fetched"));
})

export {getChannelStats,getChannelVideos};