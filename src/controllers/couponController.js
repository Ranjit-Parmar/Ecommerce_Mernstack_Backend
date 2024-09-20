import { Coupon } from "../models/couponSchema.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { customError } from "../utils/customError.js";

export const createCoupon = asyncErrorHandler(async(req,res,next)=>{


    const {code, discount, expire} = req.body;

    if(!code, !discount, !expire){
        const err = new customError("please provide all the fields",400);
        return next(err);
    }

    await Coupon.create({
        code,
        discount,
        expire
    })

    res.status(200).json({
        success : true,
        message : "coupon created succesfully"
    })
})


export const getCoupons = asyncErrorHandler(async(req,res,next)=>{

    const value = req.query;
    let query = {};
    
    if(value.isActive === 'active'){
        query.expire = {'$gt': Date.now()}
       
    }
    if(value.isActive === 'expire'){
        query.expire = {'$lt': Date.now()}
    }
    
    
    if(value.search){
        query.code = {
            $regex : `${value.search}`,
            $options : 'i'
        }
    }
    if(value.code){
        query.code = value.code
        const getAllCoupons = await Coupon.findOne(query);
    
    if(!getAllCoupons || null){
        const err = new customError("coupons not found",404);
        return next(err);
    }

    res.status(200).json({
        success : true,
        getAllCoupons
    })
    }

    
    const getAllCoupons = await Coupon.find(query);
    
    if(!getAllCoupons || null){
        const err = new customError("coupons not found",404);
        return next(err);
    }

    res.status(200).json({
        success : true,
        getAllCoupons
    })
})


export const getSingleCoupon = asyncErrorHandler(async(req,res,next) => {
    
    const id = req.params.id;

    const coupon = await Coupon.findById(id);
    if(!coupon){
        const err = new customError('Invalid Coupon Code',400);
        return next(err);
    }

    res.status(200).json({
        success : true,
        coupon
    })
})


export const deleteCoupon = asyncErrorHandler(async(req,res,next)=>{
    const id = req.params.id;

    const couponExists = await Coupon.findById(id);

    if(!couponExists){
        const err = new customError("coupon not found",404);
        return next(err);
    }

    await Coupon.findByIdAndDelete(id);

    res.status(200).json({
        success : true,
        message : "coupon deleted successfully"
    })
})


export const updateCoupon = asyncErrorHandler(async(req,res,next)=>{
    const id = req.params.id;

    const {code, discount, expire} = req.body;

    const couponExists = await Coupon.findById(id);

    if(!couponExists){
        const err = new customError("coupon not found",404);
        return next(err);
    }

    await Coupon.findByIdAndUpdate(id,{code, discount, expire}, {new:true});

    res.status(200).json({
        success : true,
        message : "coupon updated successfully"
    })
})
