import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload';

import { dbConnection } from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';

import userRouter from './routes/userRoutes.js'
import postRouter from './routes/postRoutes.js'




const app=express();

dotenv.config({
    path:"./config/config.env"
});

app.use(cors({
    origin:'https://streamscpe.netlify.app',
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));



app.use(cookieParser())
app.use(express.json());

app.use(express.urlencoded(
    {extended:true}
));

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

app.use('/api/v1/user',userRouter);
app.use('/api/v1/post',postRouter);



dbConnection();


app.use(errorMiddleware);


export default app;