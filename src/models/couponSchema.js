import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code : {
        type : String,
        require : true,
        uppercase : true,
        unique: true
    },
    discount : {
        type : Number,
        require : true
    },
    expire : {
        type : Date,
        require : true,
    }

},{timestamps:true});


export const Coupon = mongoose.model("Coupon",couponSchema);
