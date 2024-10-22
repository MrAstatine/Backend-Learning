//require ('dotenv').config({path:'./env'});
//this could hv been done but it distrupts consistency of code  so v do something else
import {app} from  './app.js';

import dotenv from "dotenv";
dotenv.config({
    path: './.env'
})
/*
import mongoose from "mongoose";
import {DB_NAME} from "./constants";
*/
//these 2 imports r used with below codes 
/*function connectDB(){}
connectDB()*///this would hv been done but v r trying iffy.


/*
import express from "express"
const app=express();
;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error is here",error);
            throw error
        })
        console.log("Connected to MongoDB");
        console.log('App is listening  on port ${process.env.PORT}')
    } catch(error){
        console.error("ERROR:",error)
        throw error;
    }
    
}) ()
//this one has all connections to DB done in the same module
//this is an overall good thing but file is crowded now
//another method is to write code in different file in DB folder or connection folder or anywhere and then import here nd then work on it 
*/

import connectDB from "./db/index.js";
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port:${process.env.PORT}`);
    }) 
    app.on("error",()=>{
        console.log("Error is omnipresent",error);
        throw error;  
    })
})
.catch((err)=>{
    console.log("MONGO DB not connected.  Error in  connectDB",err);

})