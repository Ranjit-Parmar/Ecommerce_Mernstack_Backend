import { addToCart } from '../models/addToCartSchema.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js'
import { customError } from '../utils/customError.js';


export const myCartController = asyncErrorHandler(async(req,res,next)=>{

    const userId = req.user._id;

    const cartItem = await addToCart.find({user:userId}).populate('product');

    if(!cartItem){
        const err = new customError('Your cart is empty', 404);
        return next(err);
    }


    res.status(200).json({
        success : true,
        length: cartItem.length,
        cartItem
    })
})


export const addToCartController = asyncErrorHandler(async(req,res,next)=>{


    const addedProduct = await addToCart.create({...req.body,user:req.user._id});
    const cartProduct = await addedProduct.populate('product');
   
    res.status(201).json({
        success : true,
        message : 'product added to cart',
        cartProduct
    })
})

export const updateCartItems = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;   

        const userCartProducts = await addToCart.findByIdAndUpdate(id,req.body,{
            new : true
        })
       
     const updatedCartItem = await userCartProducts.populate('product');

       res.status(200).json({
        success : true,
        message : 'product update successfully',
        updatedCartItem
       })


})

export const deleteCartItems = asyncErrorHandler(async(req,res,next)=>{
   
    const {id} = req.params;

    const userCartProducts = await addToCart.findByIdAndDelete(id)


   res.status(200).json({
    success : true,
    message : 'product deleted successfully',
    userCartProducts
   })


})