import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {uploadOnCloudinary, deleteFromCloudinary} from "..utils/cloudinary.js"
import {User} from "../models/user.model.js";   
import mongoose, {isValidObjectId} from 'mongoose';
import {Video} from "../models/video.model.js";

const getAllVideos=asyncHandler(async(req,res)=>{   
    const {page=1, limit =10,query= " ", sortBy, sortType, userId}=req.query
    const videos= await Video.aggregate([
        {
            $match:{
                $or:[
                    {
                        title:{$regex:query, $options:"i"}
                    },{
                        description:{$regex:query, $options:"i"}
                    }
                ]
            }
        },{
            $lookup:{
                from :"users",
                localfield:"owner",
                foreignfield:"_id",
                as:"createdBy",
            }
        },{
            $unwind:"$createdBy"
        },{
            $project:{
                thumbnail:1,
                videofile:1,
                title:1,
                description:1,
                createdBy:{
                    fullname:1,
                    avatar:1,
                    username:1
                }
            }
        },{
            $sort:{
                [sortBy]:sortType==="asc"?1:-1
            }
        },{
            $skip:(page-1)*limit
        },{
            $limit:parseInt(limit)
        }
    ])
    if(!videos){
        throw new ApiError(400,"Didn't get videos")
    }
    return res.status(200)
    .json(new ApiResponse(200,videos,"Got the videos"))
})

const publishAVideo=asyncHandler(async(req,res)=>{
    const {title,description}=req.body;
    if(!title ||!description){
        throw new ApiError(400,"Please fill in all fields")
    }
    const videoFileLocalPath= req.files?.videoFile[0]?.path;
    if(!videoFileLocalPath){
        throw new ApiError(400,"Please upload a video file")
    }
    const videoFile= await uploadOnCloudinary(videoFileLocalPath);
    if(!videoFile.url){
        throw new ApiError(500,"Failed to upload video file")
    }
    const thumbnailLocalPath= req.file?.thumbnail[0]?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(400, "Please upload a thumbnail")
    }
    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath);
    if(!thumbnail.url){
        throw new ApiError(500, "Error in uploading thumbnail")
    }
    const video= await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    })
    if(!video){
        throw new ApiError(500, "Failed to create video")
    }
    return res.status(200).json(new ApiResponse(200, video,"Video created"))
})

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, video,"Got video"));
})

const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const {title, description}=req.body;
    const newThumbnailLocalPath=req.file?.path;
    if(!title || !description || !newThumbnailLocalPath){
        throw new ApiError(400, "Please provide title, description and thumbnail")
    }
    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    if(!video.owner=== req.user._id){
        throw new ApiError(403, "You are not the owner of this video")
    }
    const deleteThumbnailResponse=await deleteFromCloudinary(video.thumbnail);
    if(deleteThumbnailResponse.result!=="ok"){
        throw new ApiError(500, "Error in deleting thumbnail")
    }
    const newThumbnail= await uploadToCloudinary(newThumbnailLocalPath);
    if(!newThumbnail.url){
        throw new ApiError(500, "Error in uploading thumbnail")
    } 
    const updatedVideo=await Video.findByIdAndUpdate(videoId,{
        $set:{
            title,
            description,
            thumbnail:newThumbnail.url
        }
    },{
        new:true
    })
    if(!updatedVideo){
        throw new ApiError(500, "Error in updating video")
    }
    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully "))
})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    if(video.owner!==req.user._id){
        throw new ApiError(400,"You are not the owner");
    }
    const cloudinaryDeleteVideoResponse= await deleteFromCloudinary(video.videoFile);
    if(cloudinaryDeleteVideoResponse.result!=="ok"){
        throw new ApiError(500, "Error in deleting video")
    }
    const cloudinaryDeleteThumbnailResponse= await deleteFromCloudinary(video.thumbnail);
    if(cloudinaryDeleteThumbnailResponse.result!=="ok"){
        throw new ApiError(500, "Error in deleting thumbnail")
    }
    const deleteVideo= await Video.findByIdAndDelete(videoId);
    if(!deleteVideo){
        throw new ApiError(500, "Error in deleting video")
    }
    return res.status(200,deleteVideo,"Video deleted");
})

const togglePublishStatus=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    if(video.owner!== req.user._id){
        throw new ApiError(400, "You are not the owner");
    }
    const modifyVideoPublishedStatus= await Video.findByIdAndUpdate(videoId,{
        $set:{
            isPublished: !video.isPublished
        }
    },{
        new:true
    })
    if(!modifyVideoPublishedStatus){
        throw new ApiError(500, "Error in modifying video published status")
    }
    return res.status(200).json(new ApiResponse(200,modifyVideoPublishedStatus,"Video status toggled"));
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}