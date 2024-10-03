import express from "express";
import cors  from "cors";
import cookieParser from "cookie-parser"

//now everything imported. so v configure them 
const app=express();
//first configure cors as it is easy
//app.use(cors());      //this is baic configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
//this takes data as json and limit is 16kb

//app.use(express.urlencoded())     //basic
app.use(express.urlencoded({extended:true,limit: "16kb"})) 
//this takes data from URL  and extended is true so it can take nested object s

//now v configure cookie-parser
app.use(cookieParser());
//app.use(cookieParser(process.env.COOKIE_SECRET))      //made by BlackBox  



export {app};