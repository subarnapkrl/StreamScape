import {catchAsyncError} from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import {Post} from '../models/postSchema.js';
import cloudinary from 'cloudinary'

export const addPost=catchAsyncError(async(req,res,next)=>{

    if(!req.files || Object.keys(req.files).length===0 || !req.files.pic){
        return next(new ErrorHandler("Photo is required",400));
    }

    const {pic}=req.files;

    const allowedFormats=["image/png","image/jpeg","image/webp"];

    if(!allowedFormats.includes(pic.mimetype)){
        return next(new ErrorHandler("Invalid file type. Please include 'JPEG','PNG' or 'WEBP' format only",400))
    }

    const cloudinaryResponse=await cloudinary.uploader.upload(pic.tempFilePath);

    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error:",cloudinaryResponse.error || "Unkonwn cloudinary error.");
        return next(new ErrorHandler("Failed to upload picture",500))
    };


    const {title,description}=req.body;

    if(!title || !description){
        return next(new ErrorHandler("Please provide full details.",400))
    }

    const postedBy=req.user._id;
    const posterName=req.user.name;

    const post=await Post.create({
        title,
        description,
        pic:{
            public_id:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        },
        postedBy,
        posterName
    });

    res.status(200).json({
        success:true,
        message:"Post added successfully!",
        post
    })
})

export const getAllPosts=catchAsyncError(async (req,res,next)=>{
    

    const posts=await Post.find();

    res.status(200).json({
        success:true,
        posts
    })
});


export const updatePost=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;

    let post=await Post.findById(id);

    if(!post){
        return next(new ErrorHandler("No post found!",400))
    }

    post=await Post.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(201).json({
        success:true,
        message:"Post Updated Successully!"
    })

});

export const deletePost=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;

    let post=await Post.findById(id);

    if(!post){
        return next(new ErrorHandler("OOps, no such post found!",400))
    }

    await post.deleteOne();

    res.status(201).json({
        success:true,
        message:"Post deleted successfully!"
    })
});

export const getSinglePost=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;

    try{
        const post=await Post.findById(id);
        if(!post){
            return next(new ErrorHandler("OOPS, no post found!",400))
        }

        res.status(200).json({
            success:true,
            post
        })
    }catch(error){
        return next(new ErrorHandler(`Invalid ID / CastError`, 404));

    }
});

export const getMyPosts=catchAsyncError(async(req,res,next)=>{
    const myPosts=await Post.find({postedBy:req.user._id})

    res.status(200).json({
        success:true,
        myPosts
    })
})

export const getPostbyId=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;

    const posts=await Post.find({postedBy:id});

    res.status(200).json({
        success:true,
        posts
    })
})
