import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        require : [true, "please provide the name"],
    },
    description : {
        type : String,
        require : [true, "please add the description"]
    },
    category : {
        type : String,
        require : [true, "please mention the category"]
    },
    gender : {
        type : String,
        require : [true, "please mention the gender"]
    },
    price : {
        type : Number,
        require : [true, "please describe add the price"]
    },
    stock : {
        type : Number,
        require : [true, "please describe the stock"]
    },
    size : {
        'S' : {type: Number, default: 0},
        'M' : {type: Number, default: 0},
        'L' : {type: Number, default: 0},
        'XL' : {type: Number, default: 0},
        'XXL' : {type: Number, default: 0}

    },
    ratings : {
       type : Number,
       default : 0
    },

    reviews: [{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment:{
            type: String
        },
        rating: Number
    }],
    photo : [{
        public_id:{
            type: String,
            require: true
        },
        url:{
            type: String,
            require: true
        }
    }]

},
{
    timestamps: true
})



export const Product =  mongoose.model("Product", productSchema);



