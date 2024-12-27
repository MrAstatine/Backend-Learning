import mongoose, {isValidObjectId} from 'mongoose';
import {Like} from "../models/like.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getLikedVideos=asyncHandler(async(req,res)=>{
    const likedVideos= await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video:{$exsists:true, $ne:null}
            }
        },{
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as: "video",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        avatar:1,
                                        username:1,
                                        fullname:1
                                    }
                                }
                            ]
                        }
                    },{
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    },{
                        $project:{
                            owner:1,
                            views:1,
                            duration:1,
                            title:1,
                            thumbnail:1,
                            videoFile:1
                        }
                    }
                ]
            }
        },{
            $unwind:"$video"
        },{
            $project:{
                likedBy:1,
                video:1
            }
        }
    ])
    return res.status(200)
    .json( new ApiResponse( 200,likedVideos,"Videos fetched") );
})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment id");
    }
    const user= req.user._id;
    const likeComment= await Like.findOne({
        $and:[{$comment:commentId},{likedBy:user}]
    })
    if(!likeComment){
        const comment= await Like.create({
            comment:commentId,
            likedBy:user
        })
        if(!comment){
            throw new ApiError(500,"Failed to create like");
        }
        return res.status(200)
        .json(new ApiResponse(200, comment,"Comment Liked"))
    }
    const unlikeComment= await Like.findByIdAndDelete(likeComment._id);
    if(!unlikeComment){
        throw new ApiError(500, "Error in deleting like of comment");
    }
    return res.status(200)
    .json( new ApiResponse(200, unlikeComment,"Comment Unliked"))
})

const toggleTweetLike=asyncHandler(async(req,res)=>{
    const {tweetId}= req.parmas;
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweet id");
    }
    const user= req.user._id;
    const likeTweet= await Like.findOne({
        $and:[{$tweet:tweetId},{likedBy:user}]
    })
    if(!likeTweet){
        const like= await Like.create({ 
            tweet:tweetId,
            likedBy:user
        })
        if(!like){
            throw new ApiError(500,"Failed to create like");
        }
        return res.status(200)
        .json( new ApiResponse(200, like,"Tweet Liked"))
    }
    const unlikeTweet= await Like.findByIdAndDelete(likeTweet._id);
    if(!unlikeTweet){
        throw new ApiError(500, "Error in deleting like of tweet");
    }
    return res.status(200)
    .json(new ApiResponse(200, unlikeTweet,"Tweet Unliked"))
})

const toggleVideoLike=asyncHandler(async(req,res)=>{    
    const {videoId}=req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video id");
    }
    const user=req.user._id;
    const likedVideo= await Like.findOne({
        $and:[{video:videoId},{likedBy:user}]
    })
    if(!likedVideo){
        const like= await Like.create({
            video:videoId,
            likedBy:user
        })
        if(!like){
            throw new ApiError(500,"Failed to create like")
        }
        return res.status(200)
        .json(new ApiResponse(200,like,"Video liked successfully"))
    }
    const unlikeVideo= await Like.findByIdAndDelete(likedVideo._id);
    if(!unlikeVideo){
        throw new ApiError(500,"Failed to unlike video")
    }
    return res.status(200)
    .json(new ApiResponse(200,unlikeVideo,"Video unliked successfully"))
})
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}