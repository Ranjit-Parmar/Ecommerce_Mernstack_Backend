import { Order } from "../models/orderSchema.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { customError } from "../utils/customError.js";
import { updateProductStock } from "../utils/updateProductStock.js";


// Create Order Admin

export const createOrder = asyncErrorHandler(async (req, res, next) => {

    const { shippingInfo,
        orderItems,
        user,
        paymentInfo,
        itemPrice,
        discount,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;


      const newOrder = await Order.create({
            shippingInfo,
            orderItems,
            user,
            paymentInfo,
            itemPrice,
            discount,
            taxPrice,
            shippingPrice,
            totalPrice
        })

    res.status(201).json({
        success: true,
        newOrder
    })
})



// Get All Order Admin 

export const GetAllOrders = asyncErrorHandler(async(req,res,next)=>{

    const value = req.query;
    const today = new Date();
    
    let query = {};
    
    if(value.orderStatus){
        query.orderStatus = value.orderStatus;
    }

    if(value.search){
        query._id = value.search;        
    }

    if(value.duration === "lastFiveDaysOrder"){

        const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
        query.createdAt = {
            $gte : fiveDaysAgo,
            $lte : today
        }
    }
    if(value.duration === "lastSevenDaysOrder"){

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = {
            $gte : sevenDaysAgo,
            $lte : today
        }
    }
    if(value.duration === "lastFifteenDaysOrder"){

        const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
        query.createdAt = {
            $gte : fifteenDaysAgo,
            $lte : today
        }
    }
   
    const getAllOrders = await Order.find(query).populate('user');
   
   
    if(!getAllOrders){
        const err = new customError("no order found",404);
        return next(err);
    }

    res.status(200).json({
        success : true,
        length: getAllOrders.length,
        getAllOrders        
    })

})


// Get Single Order Admin

export const getSingleOrder = asyncErrorHandler(async(req,res,next)=>{
    const id = req.params.id;
    
    const getSingleOrder = await Order.findById(id);
    if(!getSingleOrder){
        const err = new customError("order not found",404);
        return next(err);
    }

    res.status(200).json({
        success: true,
        getSingleOrder
    })

})


// Update Order Admin

export const updateOrder = asyncErrorHandler(async(req,res,next)=>{

    
    const id = req.params.id;
    const {orderStatus} = req.body;

    const orderExists = await Order.findById(id);

    if(!orderExists){
        const err = new customError("order is not found",404);
        return next(err);
    }
    console.log(orderExists);

    if(orderStatus==="delivered"){
        updateProductStock(orderExists.orderItems.product,orderExists.orderItems.quantity,orderExists.orderItems.size);
    }

    const updateOrder = await Order.findByIdAndUpdate(id,{orderStatus},{new:true});
    res.status(200).json({
        success: true,
        updateOrder
    })


})


// Delete Order Admin

export const deleteOrder = asyncErrorHandler(async(req,res,next)=>{
    const id = req.params.id;


    const orderExists = await Order.findById(id);

    if(!orderExists){
        const err = new customError("order not found",404);
        return next(err);
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
        success : true,
        message : "order deleted successfully"
    })
})



// Get My Orders User

export const getMyOrders = asyncErrorHandler(async(req,res,next)=>{
    const id = req.params.id;
    
    const getMyOrder = await Order.find({user:id}).populate('orderItems.product');
    

    if(!getMyOrder){
        const err = customError("no order found",404);
        return next(err);
    }
   

    res.status(200).json({
        length : getMyOrder.length,
        success : true,
        getMyOrder
    })


})

