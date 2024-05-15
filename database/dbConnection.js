import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"Blogged"
    }).then(()=>{
        console.log("Database connected successfully!")
    }).catch((error)=>{
        console.log(`Error:-${error}`)
    })
}