dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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
import  {customError}  from './utils/customError.js';
import asyncErrorHandler from './utils/asyncErrorHandler.js';
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
// app.use(
//     cors({
        
//         origin: "https://shoppingecommerce-omega.vercel.app",
//         // origin:  "https://localhost:5173",
//         methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//         credentials: true,
//     })
// );
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://shoppingecommerce-omega.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});

// app.use(cors({
//   // origin: "https://shopping-app-three-ashy.vercel.app",
//   origin: "https://shoppingecommerce-omega.vercel.app",
//   methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'], 
//   credentials: true,
//   }))

const __dirname = path.resolve(); 
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

// app.all("*",asyncErrorHandler(async(req,res,next)=>{
//     const err = new customError(`can't find ${req.originalUrl} on the server`,404);
//     next(err);
// }))

app.use(express.static(path.join(__dirname, "../ecommerce_frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../ecommerce_frontend/build","index.html"));
});

app.use(globalErrorHandler);


app.listen(port, ()=>{
    console.log("server is running on port ",port);
})
