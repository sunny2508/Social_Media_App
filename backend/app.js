import cookieParser from 'cookie-parser';
import express from 'express'
import userRoutes from './Routes/userRoutes.js'
import postRoutes from './Routes/postRoutes.js'
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'

const app = express();


app.use(cors({
    origin:['https://social-media-app-nu-red.vercel.app','http://localhost:5173'],
    credentials:true
}));

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET_KEY,
})


app.use(express.json({limit:"10mb"}));
app.use(cookieParser());
app.use(express.urlencoded({extended:true,limit:"10mb"}));

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/posts',postRoutes)

export default app;