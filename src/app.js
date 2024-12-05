import dotenv from 'dotenv';
dotenv.config({path:'ecommerce_backend/.env'});
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import addToCartRoute from './routes/addToCartRoute.js'
import orderRoute from './routes/orderRoute.js';
import couponRoute from './routes/couponRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import {connectDb} from './utils/conn.js'
import globalErrorHandler from './middlewares/errorController.js'
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

process.on("uncaughtException",(err)=>{
    console.log(err.name, err.message)
    console.log("uncaught execption occured! Shutting down...")
    process.exit(1);

  })

  
  const port = process.env.PORT || 3000;
  const app = express();  
  
  
connectDb();
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(morgan('dev'));
app.use(
    cors({
        
        origin: [process.env.CLIENT_URL],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

const __dirname = path.resolve(); 

app.use(express.static((__dirname, "../ecommerce_frontend/build")));

app.use("/uploads",express.static("uploads"));

// user routing
app.use('/api/v1/user', userRoute);

// product routing
app.use('/api/v1/product', productRoute);

// add to cart routing
app.use('/api/v1/cart', addToCartRoute);

// order routing
app.use('/api/v1/order', orderRoute);

//  coupon routing
app.use('/api/v1/coupon', couponRoute);

//  payment routing
app.use('/api/v1/payment', paymentRoute);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../ecommerce_frontend/build', 'index.html'));
});

app.use(globalErrorHandler);

app.listen(port, ()=>{
    console.log("server is running on port ",port);
})
