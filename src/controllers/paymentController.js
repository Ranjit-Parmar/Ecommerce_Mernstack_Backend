dotenv.config();
import dotenv from 'dotenv';
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import {customError} from '../utils/customError.js'
import { Stripe } from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const makePaymentController = asyncErrorHandler(async(req,res,next)=>{

const { amount } = req.body;

  if (!amount) return next(new customError("Please enter amount", 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });

})


export const stripeApiKey = asyncErrorHandler(async(req,res,next)=>{
    res.json({
        success : true,
        stripeApiKey : process.env.STRIPE_PUBLISHABLE_KEY
    })
})



export const paymentSuccessController = asyncErrorHandler(async(req,res,next)=>{
    res.status(200).json({
        success : true,
        message : 'payment successfull'
    })
})

export const paymentCancelController = asyncErrorHandler(async(req,res,next)=>{
    res.status(400).json({
        success : false,
        message : 'payment failed (Bad Request)'
    })
})