import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { type } from "express/lib/response";

const videoSchema=new Schema({
    videoFile:{
        type: String,       //cloudinary url comes here
        required :[true,"Video is required"]
    },
    thumbnail:{
        type:String,
        required: true,
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    duration:{
        type:Number, //when saved in cloudinary it sends back duration of video to us. We have to use that
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean, //tells if video is publicaly available
        default:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true,
})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model("Video",videoSchema);