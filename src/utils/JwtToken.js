import jwt from 'jsonwebtoken';


export const generateAccessToken = async(_id) => {
       return await jwt.sign({id:_id},process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_EXPIRE
       })
}


export const verifyAccessToken = async(token) => {
    return await jwt.verify(token,process.env.JWT_SECRET_KEY);
}