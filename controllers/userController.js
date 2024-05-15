import {catchAsyncError} from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import { User } from '../models/userSchema.js';
import { sendToken } from '../utils/jwtToken.js';


export const register=catchAsyncError(async (req,res,next)=>{

    const {name,email,password}=req.body;

    if(!name||!email||!password){
        
        return next(new ErrorHandler("Please fill full registration form!"));

    }

    const isEmail=await User.findOne({email});

    if(isEmail){
        return next(new ErrorHandler("Email already exists!"));

    }


    const user=await User.create({
        name,
        email,
       
        password
    });

    // res.status(200).json(
    //     {
    //         success:true,
    //         message:"User registered",
    //         user
    //     }
    // )

    sendToken(user,200,res,"User Registered Successfully")
});


export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password ){
        return next(new ErrorHandler("Please provide email, password ",400))
    }

    const user=await User.findOne({email}).select('+password');

    if(!user){
        return next( new ErrorHandler("Please provide valid email and password",400));
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Please provide valid email and password",400));
    }

     // Set the Access-Control-Allow-Origin header
    sendToken(user,200,res,"User logged in successfully!")
});


export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(201)
    .cookie("token","",{
        httpOnly:true,
        expires:new Date(Date.now()),
         secure:true,
        sameSite:"None"
    })
    .json({
        success:true,
        message:"User logged out successfully!"
    })
})

export const getUser=catchAsyncError(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user
    })
})

export const getAllUser=catchAsyncError(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users
    })
})

export const getOneUser=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params;
    
    const oneUser=await User.findById(id);
    
    res.status(200).json({
        success:true,
        oneUser
    })
})