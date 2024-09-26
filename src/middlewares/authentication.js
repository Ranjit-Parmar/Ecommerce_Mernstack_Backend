import { User } from "../models/userSchema.js"
import { verifyAccessToken } from "../utils/JwtToken.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { customError } from "../utils/customError.js";

export const authentication = asyncErrorHandler(async(req,res,next) => {

    
    // checking if user has access token or not?
    
    const token =  req.cookies?.token;
    
    if(!token){
        const err = new customError("you are not logged in, please login",401);
       return next(err);
    }

        // if user hase token then verify token
        const verifyUser = await verifyAccessToken(token);
    
        // find user is exist based on token id
        req.user = await User.findById(verifyUser.id);
    
        next()
    

   
    
})



// check authorization
export const authorization = asyncErrorHandler(async(req,res,next)=>{
    
    if(!(req.user.role === "admin")){
        const err = new customError("you are not authorized user to access this route",401);
        return next(err);
    }
        next();
    
})