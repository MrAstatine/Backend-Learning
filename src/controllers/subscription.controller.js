import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {Subscription} from "../models/subscription.model.js";
import {User} from "../models/user.model.js";
import mongoose, {isValidObjectId} from "mongoose";

const toggleSubscription= asyncHandler(async(req,res)=>{
    const {channelId}= req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id");
    }
    const subscribed= await Subscription.findOne({
        $and:[{channel:channelId},{subscriber:req.user._id}]
    })
    if(!subscribed){
        const subscribe= await Subscription.create({
            subscriber:req.user._id,
            channel:channelId
        })
        if(!subscribe){
            throw new ApiError(500, "Error in creating a subscription file");
        }
        return res.status(200)
        .json(new ApiResponse(200, subscribe,"User has subscribed to the channel")) 
    }
    const unsubscribe= await Subscription.findByIdAndDelete(subscribed._id);
    if(!unsubscribe){
        throw new ApiError(500, "Error in deleting a subscription file");
    }
    return res.status(200)
    .json(200, unsubscribe, "User has unsubscribed from the channel")
})

const getUserChannelSubscribers= asyncHandler(async(req,res)=>{
    const subscriberId=req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id");
    }
    const subsList= await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(subscriberId)
            }
        },{
            $lookup:{
                from:"users",
                localfield:"subscribers",
                foreignfield:"_id",
                as:"subscriber",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullname:1,
                            avatar:1
                        }
                    }
                ]
            }
        },{
            $addFields:{
                subscriber:{
                    $first:"$subscriber"
                }
            }
        },{
            $project:{
                subscriber:1,
                createdAt:1
            }
        }
    ])
    if(!subsList){
        throw new ApiError(404, "Error fetching subscriber list");
    }
    return res.status(200)
    .json(new ApiResponse(200,subsList,"Subscriber list fetched"))
})

const getSubscribedChannel= asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id");
    }
    const channelList= await Subscription.aggregate([
        {
            $match:{
                subscriber: new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                from:"users",
                localfield:"channel",
                foreignfield:"_id", 
                as:"channel",
                pipeline:[
                    {
                        $project:{
                            fullname:1,
                            username:1,
                            avatar:1       
                        }
                    }
                ]
            }
        },{
            $addFields:{
                channel:{
                    $first:"$channel"
                }
            }
        },{
            $project:{
                channel:1,
                createdAt:1
            }
        }
    ])
    if(!channelList){
        throw new ApiError(400,"Error in fetching channel list")
    }
    return res.status(200)
    .json(new ApiResponse(200,channelList,"Channel list fetched"))      
})

export {
    toggleSubscription,
    getSubscribedChannel,
    getUserChannelSubscribers
};