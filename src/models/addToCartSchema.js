import mongoose from 'mongoose';

const addToCartSchema = new mongoose.Schema({
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        },
        quantity : {
            type : Number,
            default : 1
        },
        selectedSize : {
            type : String,
            require : [true, 'please select a size']
        },
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
})


export const addToCart = mongoose.model('addToCart', addToCartSchema);