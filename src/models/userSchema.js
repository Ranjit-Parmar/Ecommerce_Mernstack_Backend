import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter name"]
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: [true, "Email already exist"],
            lowercase: true,
            validate: [validator.default.isEmail, "Invalid Email Id"]
        },
        password: {
            type: String,
            require: [true, "Please enter password"],
            minLength: [3, "Password should be atleast 3 char long"],
            select : false

        },
        photo: {
            public_id:{
                type: String,
            },
            url:{
                type: String,
            }
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        }, 
        passwordResetToken: String,
        passwordResetExpire: Date 
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }else{
        // password encryption
       this.password = await bcrypt.hash(this.password, 12);
       next();
    }
})

//  compare password
userSchema.methods.compareLoginPassword = async function(inputPass,dbPass){
    return await bcrypt.compare(inputPass,dbPass);    
  }


  userSchema.methods.generatePasswordResetToken = async function(){
    const data = crypto.randomBytes(20).toString('hex');
   const token = crypto.createHash('sha256').update(data).digest('hex');
   this.passwordResetToken = token;
   this.passwordResetExpire = Date.now() + 2 * 60 * 1000;
   return data;
  }

export const User = mongoose.model("User", userSchema);