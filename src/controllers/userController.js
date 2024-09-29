import { User } from '../models/userSchema.js';
import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { customError } from '../utils/customError.js';
import { generateAccessToken } from '../utils/JwtToken.js';
import  nodemailer from 'nodemailer';
import crypto from 'crypto';
import { deleteImageHelper, uploadImagesHelper } from '../utils/uploadImages.js';



    // Register User
export const createUser = asyncErrorHandler(async (req, res, next) => {

    const { name, email, password } = req.body;
    const photo = req.file;

    // checking user input
    if (!name || !email || !password) {
        next(new customError("please provide all the fields", 400));
    }

    // checking user is already exist?

    const user = await User.findOne({email});
    if(user){
        const err = new customError("user with this email is already exists in database", 409);
        return next(err);
    }

    // create user
    const userData = await User.create({
        name,
        email,
        password,
        photo: photo?.path
    })

    // generate token
    const jwt_token = await generateAccessToken(userData._id)
    
    
    const options = {
        expires: new Date(
          Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        sameSite : 'none',
        secure : true,
        httpOnly: true,
      };
    

    
    res.cookie("token",jwt_token,options).status(201).json({
        success: true,
        message: "user created successfully",
        userData
    })

});



// Login User
export const LoginUser = asyncErrorHandler(async (req, res, next) => {
    
    const { email, password } = req.body;
    
    // checking user input
    if (!email || !password) {
        const err = new customError("Please provide all the fields", 400)
        return next(err);
    }

    // find user in database
    const userData = await User.findOne({ email }).select('+password');


    if (!userData) {
        const err = new customError("you are not register user! Please Signup", 401);
        return next(err);
    }

    // if user is exist then check password
    const decryptPass = await userData.compareLoginPassword(password, userData.password);

    if (!decryptPass) {
        const err = new customError("Invalid credential", 401);
        return next(err);
    }

    // if password is matched then generate token
    const jwt_token = await generateAccessToken(userData._id)
    
    const options = {
        expires: new Date(
            Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        sameSite : 'none',
        secure : true,
        httpOnly: true,
      };
    
      
    res.cookie("token",jwt_token,options).status(200).json({
        success: true,
        message: 'user login successfully',
        userData,
    })

})

// ACTIVE USER

export const  activeUser = asyncErrorHandler(async(req,res,next)=>{
    const activeUser = req.user;
    if(!activeUser){
        res.status(401).json({
            success : false,
            message : 'token expire! please login'
        })
    }else{
        res.status(200).json({
            success : true,
            activeUser
        })
    }
})

// LOG OUT USER

export const logOutUser = asyncErrorHandler(async(req,res,next)=>{
    
    res.clearCookie('token',{
        httpOnly : true,
        sameSite : "none",
        secure : true,

    }).status(200).json({
        success : true,
        message : 'logout successfully'
    })
    
     
})



// ........................................................................................
                                        // ADMIN ROUTES ONLY

// Get All Users 
export const getAllUser = asyncErrorHandler(async (req, res, next) => {
    // find all users

    const value = req.query;

        let search = {} 
        
        if(value.search){
            search.email = {
                $regex :  value.search?`${value.search}`:'',
                $options : 'i'
            }
        }
        if(value.role){
            search.role = `${value.role}`
        }
        
        
        const getUserData = await User.find(search);
       

   

    res.status(200).json({
        success: true,
        length : getUserData.length,
        allUsers: getUserData
    })
})



// Get Signle User
export const getSingleUser = asyncErrorHandler(async(req,res,next)=>{

    const id = req.params.id;
    
    // find use with given ID
    const getSingleUserData = await User.findById(id);


    if(!getSingleUserData){
        const err = new customError("user is not found",404);
        return next(err);
    }
    
    res.status(200).json({
        success : true,
        user : getSingleUserData
    })

})



// Delete User

export const deleteUser = asyncErrorHandler(async(req,res,next)=>{
    const id = req.params.id;
    
    // find use with given ID
    const userExist = await User.findById(id);

    if(!userExist){
        const err = new customError("user is not found", 404);
        return next(err);
    }

    
     // delete photo from the cloudinary

    if(userExist?.photo?.public_id) {
     await deleteImageHelper(userExist?.photo?.public_id);
    }else{

        // deleting user
         await User.findByIdAndDelete(id);
    
        res.status(200).json({
            success : true,
            message : "user is deleted successfully"
        })
    }
    
     
})

// Update User

export const updateUser = asyncErrorHandler(async(req,res,next)=>{    

    const id = req.params.id;
    
    const {name, email, password, role, photo} = req.body;
    
    // find use with given ID
    const userExist = await User.findById(id);
    const updateUserData = {};
    if(name){
        updateUserData.name = name
    }
    if(email){
        updateUserData.email = email
    }
    if(password){
        userExist.password = password
        await userExist.save();
    } 
    if(role){
        updateUserData.role = role
    }
    if(photo){
        if(userExist?.photo?.public_id){
            await deleteImageHelper(userExist?.photo?.public_id);
        }
        const imageData = await uploadImagesHelper(photo);
        updateUserData.photo = imageData
    }

    if(!userExist){
        const err = new customError("user is not found",404);
        return next(err);
    }
    
     
    await User.findByIdAndUpdate(id, updateUserData,{new:true});
    
    res.status(200).json({
        success : true,
        message : "user is updated successfully",
    })
})

// FORGOT PASSWORD

export const forgotPassword = asyncErrorHandler(async(req,res,next)=>{
    const {email} = req.body;
    
    if(!email){
        const err = new customError("please provide email",400);
        return next(err);
        }
        // check if user is registered user or not
        const userExists = await User.findOne({email});
    
    
    if(!userExists){
        const err = new customError("user is not foud",404);
        return next(err);
    }

    const token = await userExists.generatePasswordResetToken();

    await userExists.save();    
    
    const option = {
        email : userExists.email,
        text : `https://shoppingecommerce-omega.vercel.app/forgotPassword/reset/${token}`,
        html : `<a href="https://shoppingecommerce-omega.vercel.app/forgotPassword/reset/${token}">Click Here</a>`
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        // host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "rjtpmr@gmail.com",
            pass: "vksksahpvfqfzxuf"
        },
    });
    
    const message = {
        from : "rjtpmr@gmail.com",
        to: option.email,
        subject: "password reset",
        text: option.text,
        html : option.html
 }
     transporter.sendMail(message,(error,response)=>{
            if(error){
                
                const err = new customError(error.message, 500);
                return next(err);
            }

        res.status(200).json({
            success : true,
            message : response.messageId
        })
     })               
        
    
})


// RESET PASSWORD

export const passwordReset = asyncErrorHandler(async(req,res,next)=>{
    const token = req.params.id;

    const { password } = req.body;

    const verifyUserToken = crypto.createHash("sha256").update(token).digest("hex");

    const userExists = await User.findOne({passwordResetToken:verifyUserToken}).select("+password")
    

    // check if token is still valid or not
    if(userExists.passwordResetExpire > Date.now()){
        userExists.password = password
        userExists.passwordResetToken = undefined,
        userExists.passwordResetExpire = undefined
        await userExists.save();
        res.status(200).json({
            success : true,
            message : "password reset successfully"
        })

    }else{
        userExists.passwordResetToken = undefined,
        userExists.passwordResetExpire = undefined
        await userExists.save();
        const err = new customError("your reset token has expired! please try again",400);
        return next(err);
    }
    
})


