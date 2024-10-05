import {v2 as cloudinary} from "cloudinary";

import fs from "fs"; //fs is file system
//it helps to read write remove  files from  the file system as u want in sync mode or  async
//nothing installed for this.  it comes with node.js

 cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
 })
//data in config  is for cloudinary account and is a secret information.
//thus the values r stored in env variables  so that they are not exposed in the code

const uploadOnCloudinary= async (localFilePath=>{
    //local file path is the path of the file in ur local machine
    try{
        if(!localFilePath){
            return null;
        }
        const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",  //takes all types of files
        })
        console.log("File uploaded on cloudinary ",response.url);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath)    
        //removes the locally saved temporary file as upload is done
    }
})


export {uploadOnCloudinary};