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
app.use(express.static("public"));
//now v configure cookie-parser
app.use(cookieParser());
//app.use(cookieParser(process.env.COOKIE_SECRET))      //made by BlackBox  


//routes written below were added later on
import  userRouter from "./routes/user.routes.js";
import  healthcheckRouter from "./routes/health.routes.js";
import  tweetRouter from "./routes/tweet.routes.js";
import  dashboardRouter from "./routes/dashboard.routes.js";
import  likeRouter from "./routes/like.routes.js";
import  commentRouter from "./routes/comment.routes.js";
import  playlistRouter from "./routes/playlist.routes.js";
import  videoRouter from "./routes/video.routes.js";
import  subscriptionRouter from "./routes/subscription.routes.js";
//routes declaration
//app.use("/user",userRouter); //now when user goes to user we give control to userRouter
//this was basic and can b used

//v should add api and version and all as it is good practice
app.use("/api/v1/users",userRouter);
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/tweet",tweetRouter);
app.use("/api/v1/subscription",subscriptionRouter);
app.use("/api/v1/video",videoRouter);
app.use("/api/v1/playlist",playlistRouter);
app.use("/api/v1/comment",commentRouter);
app.use("/api/v1/like",likeRouter);
app.use("/api/v1/dashboard",dashboardRouter);

export {app};