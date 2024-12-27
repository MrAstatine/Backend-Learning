import mongoose,{isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description}=req.body;
    if(!name || !description){
        throw new ApiError(400,"Please provide name and description");
    }
    const exsistingPlaylist= await Playlist.findOne({
        $and:[{$name:name},{$owner:req.user._id}]
    });
    if(exsistingPlaylist){
        throw new ApiError(400,"Playlist with this name already exists");
    }
    const playlist= await Playlist.create({
        name,
        description,
        owner: req.user._id
    })
    if(!playlist){
        throw new ApiError(500,"Failed to create playlist");
    }
    return res.status(200)
    .json(new ApiResponse(200,"Playlist created successfully",playlist))
})

const getUserPlaylists=asyncHandler(async(req,res)=>{
    const {userId}=req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id");
    }
    const userPlaylist= await Playlist.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },{
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
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
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },{
                        $addFields:{
                            $owner:{
                                $first:"$owner",
                            }
                        }
                    },{
                        $project:{
                            title:1,
                            thumbnail:1,
                            description:1,
                            owner:1
                        }
                    }
                ]
            }
        },{
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"createdBy",
                pipeline:[
                    {
                        $project:{
                            avatar:1,
                            fullname:1,
                            username:1
                        }
                    }
                ]
            }
        },{
            $addFields:{
                $createdBy:{
                    $first:"$createdBy"
                }
            }
        },{
            $project:{
                video:1,
                createdBy:1,
                name:1,
                description:1
            }
        }
    ]).toArray();
    if(userPlaylist.lenght===0){
        throw new ApiError(400, "Userplaylist not found");
    }
    return res.status(200)
    .json(new ApiResponse(200, userPlaylist,"User playlist found"));
})

const getPlaylistById=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params;
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Playlist id is required");
    }
    const playlist= await Playlist.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(playlistId)
            }
        },{
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"createdBy",
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
                $createdBy:{
                    $first:"$createdBy"
                }
            }
        },{
            $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
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
                                        username:1,
                                        fullname:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },{
                        $addFields:{
                            $owner:{
                                $first:"$owner"
                            }
                        }
                    },{
                        $project:{
                            thumbnail:1,
                            title:1,
                            duration:1,
                            views:1,
                            owner:1,
                            createdAt:1,
                            updatedAt:1
                        }
                    }
                ]
            }
        },{
            $project:{
                videos:1,
                description:1,
                createdAt:1,
                name:1
            }
        }
    ])
    if(!playlist){
        throw new ApiError(500,"Problem in finding playlist")
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist,"Playlist found"));
})

const addVideoToPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params;
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid playlist or video id");
    }
    const playlist= await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found");
    }
    if(playlist.owner.toString() != req.user._id){
        throw new ApiError(401,"You are not the owner of this playlist");
    }
    const videoExsist= playlist.videos.filter(
        (video)=> video.toString() === videoId
    )
    if(videoExsist.lenght > 0){
        throw new ApiError(400,"Video already exist in this playlist");
    }
    const addVideo= await Playlist.findByIdAndUpdate(playlistId,
        {
            $set:{
                video:[...playlist.videos, videoId]
            }
        },{
            new:true
        }
    );
    if(!addVideo){
        throw new ApiError(500,"Problem in adding video to playlist");
    }
    return res.status(200)
    .json(new ApiResponse(200,addVideo,"Video added to playlist"));
})

const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const {playlistId,videoId}=req.params;
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid input");
    }
    const playlist= await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found");
    }
    if(playlist.owner.toString() != req.user._id){
        throw new ApiError(401,"You are not the owner of this playlist");
    }
    const videoExsist= playlist.videos.filter(
        (video)=> video.toString() === videoId
    )
    if(videoExsist.lenght === 0){
        throw new ApiError(400,"Video does not exist in this playlist");
    }
    const modifiedPlaylistVideos= playlist.videos.filter(
        (video)=> video.toString() !== videoId
    )
    const removeVideo= await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            video: modifiedPlaylistVideos
        }
    },{
        new:true
    })
    if(!removeVideo){
        throw new ApiError(500,"Problem in removing video from playlist");
    }
    return res.status(200)
    .json(new ApiResponse(200, removeVideo,"Video removed"));
})

const deletePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params;
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid input");
    }
    const playlist= await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found");
    }
    if(playlist.owner.toString() != req.user._id){
        throw new ApiError(401,"You are not the owner of this playlist");
    }
    const delPlaylist= await Playlist.findByIdAndDelete(playlist._id);
    if(!delPlaylist){
        throw new ApiError(500,"Problem in deleting playlist");
    }
    return res.status(200)
    .json(new ApiResponse(200, delPlaylist,"Playlist deleted"));
})

const updatePlaylist=asyncHandler(async(req,res)=>{
    const {playlistId}=req.params;
    const {name,description}=req.body;
    if(!name || !description || !isValidObjectId(playlistId)){
        throw new ApiError(400,"Invalid input");
    }
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"Playlist not found");
    }
    if(playlist.owner.toString() != req.user._id){
        throw new ApiError(401,"You are not the owner of this playlist");
    }
    const updatedPlaylist= await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name,
            description
        }
    },{
        new:true
    })
    if(!updatedPlaylist){
        throw new ApiError(500,"Problem in updating playlist");
    }
    return res.status(200)
    .json(new ApiResponse( 200, updatedPlaylist,"Playlist updated"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}