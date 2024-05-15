import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Please provide a title.'],
        minLength:[5,"Title should be at least 5 characters"],
        maxLenght:[30,"Title should not exceed more than 30 characters"]
    },
    description:{
        type:String,
        required:[true,"Please provide description of the post!"]
    },
    pic:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
   
    postedOn:{
        type:Date,
        default:Date.now
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },posterName:{
        type:String,
        ref:"User",
        required:true
    }

});

export const Post=mongoose.model("Post",postSchema);