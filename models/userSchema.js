import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema=new mongoose.Schema({


    name:{
        type:String,
        required:[true,"Please enter your full name"],
        minLength:[3,"Name must contain at least 3 characters!"],
        maxLength:[15,"Name should not exceed more than 15 characters!"]
    },
    email:{
        type:String,
        required:[true,"Please enter your valid email!"],
        validate:[validator.isEmail,"Please provide a valid e-mail address!"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password!"],
        minLength:[6,"Password must contain at least 6 characters!"],
        maxLength:[20,"Password should not exceed 20 characters!"],
        select:[false]
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }


});

//Encrypting the password when the user registers or modifies the password

userSchema.pre("save",async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password=await bcrypt.hash(this.password,10);

});


//Compairing the user password entered by the user with the user saved password

userSchema.methods.comparePassword=async function (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password);

};

//Generating JWT token when user registers or logins

userSchema.methods.getJWTToken=function(){
    return jwt.sign(
        {id:this._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn:process.env.JWT_EXPIRE}
    )
}


export const User=mongoose.model("User",userSchema);