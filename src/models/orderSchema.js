import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        address:{
            type: String,
            require:[true, "please enter address"]
        },
        city:{
            type: String,
            require:[true, "please enter city"]
        },
        pincode:{
            type: Number,
            require:[true, "please enter state"]
        },
        state:{
            type: String,
            require:[true, "please enter city"]
        },
        mobile:{
            type: Number,
            require:[true, "please enter mobile number"]
        }
    },
    orderItems: {
            // name:{
            //     type: String,
            //     require: true
            // },
            // price:{
            //     type: Number,
            //     require: true
            // },
            quantity:{
                type: Number,
                require: true
            },
            size : {
                type: String,
                require: true
            },
            product:{
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                require: true
            },
        },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true
    },
    paymentInfo:{
        id:{
            type: String,
            require: true
        },
        status:{
            type: String,
            require: true
        }
    },
    paidAt:{
        type: Date,
        require: true,
        default:Date.now()
    },
    itemPrice:{
        type: Number,
        default: 0
    },
    discount:{
        type: Number,
        default: 0
    },
    taxPrice:{
        type: Number,
        default: 0
    },
    shippingPrice:{
        type: Number,
        default: 0
    },
    totalPrice:{
        type: Number,
        default: 0
    },
    orderStatus:{
        type: String,
        require: true,
        enum: ["processing","delivered","pending","cancel"],
        default: "processing"
    },
    deliveredAt: Date,
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

export const Order = mongoose.model("Order", orderSchema);