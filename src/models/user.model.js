import { type } from "express/lib/response";
import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { use } from "bcrypt/promises";

const  userSchema= new Schema({
    username:{
        type:String,
        required:true,
        unique:true,    //makes sure that every user is unique
        lowercase: true,
        trim: true,     //removes whitespace from front and end of string
        index: true,    //this allows searching for it by giving index
    },
    email:{
        type: String,
        required:true,
        lowercase:true,
        trim: true,
        unique:true,
    },
    fullname:{
        type:String,
        required:true,
        trim: true,
        index: true,
    },
    avatar:{
        type:String,        //cloudinary url comes here
        required:true,        
    },
    coverImage:{
        type:String,        //cloudinary url comes here
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }   //this makes an array out of the video  id
    ],
    password:{
        type:String,
        required :[true,"Password is required"]         //this has a custom error message
    },
    refreshToken:{
        type:String,
    }
},{
    timestamps:true,  //this adds createdAt and updatedAt fields to the schema
})

userSchema.pre("save",async function(next){
    if(this.isModified("password")){    //this makes sure that when password is changed only then it encryptes and not allt the time something changes
        //we gonna take whatever is being stored; from it take p/w, encrypt it and then store it
        this.password=bcrypt.hash(this.password,10);    //this.password tells what to encrypt and 10 is no. of rounds
        next();
    }
})
//this is like event listener. this pre hook works when something is saved, and then a function is called.
//nvr write shorthand code of a function in a hook cause u don't have reference to 'this'.
//this things takes time so make it async 

userSchema.methods.isPasswordCorrect=async function(password){   //here v r adding a custom method named isPasswordCorrect
    return await bcrypt.compare(password,this.password);    //returns true or false. does comparison between given password and stored password
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({      //sign method of jwt makes token
        _id: this._id,
        email:this.email,
        username: this.username,
        fullname:this.fullname
        //keys here is the name given in payload and values comes from db
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIN: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({      
        _id: this._id,
        email:this.email,
        username: this.username,
        fullname:this.fullname
    },      //it is same as access token
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIN: process.env.REFRESH_TOKEN_EXPIRY 
    }
) 
}

export const User=mongoose.model("User",userSchema);