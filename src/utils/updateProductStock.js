import { Product } from "../models/productSchema.js";

export const updateProductStock = async(product,quantity,size) => {

    try{
        const getProduct = await Product.findById(product);
       
        getProduct.stock = getProduct.stock - quantity;
    
       for(let key in getProduct.size){
       if(key === size){
        getProduct.size = {...getProduct.size,[size]: getProduct.size[size] - quantity}
       }
       }

          await getProduct.save({runvalidators:false}); 
    
    }catch(err){
        console.log(err.message);
    }

}