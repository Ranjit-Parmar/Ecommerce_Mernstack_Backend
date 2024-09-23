

const globalErrorHandler = (error,req,res,next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    

    if(error.code === 11000){
       error.message = "there is already user exist with this email id";
       error.status = 500
       res.status(error.statusCode).json({
        status : error.status,
        message : error.message,
    })  
     }   

    if(error.name === "ValidationError"){
        const errors =  Object.values(error.errors).map((i)=> i.message)
        const errorMessages = errors.join(', ');
        const msg = `Invalid input data: ${errorMessages}`
        
        res.status(error.statusCode).json({
            status : error.status,
            message : msg,
        })                
    }

    if(error.name === "CastError"){
        res.status(500).json({
            status : "error",
            message : "Invalid Id"
        })
    }

    if(error.name === "TokenExpiredError"){
        res.status(500).json({
            status : "error",
            message : "Token has expired! Please login again",
        }) 
    }else{

        res.status(error.statusCode).json({
           status : error.status,
           stack : error.stack,
           message : error.message,
           error
       })     
    }

   
    
}

export default globalErrorHandler;