import { v2 as cloudinary } from 'cloudinary';

export const uploadImagesHelper = async (files) => {
    let arrayFiles = [];
    const imageDataArr = []  

    if(typeof files === "string"){
        arrayFiles.push(files)
    }else{
        arrayFiles = files
    };

    for (let i = 0; i < arrayFiles.length; i++) {
        try {
            const uploadResult = await cloudinary.uploader.upload(arrayFiles[i],{
                invalidate : true
            })
            if (uploadResult) {
                imageDataArr.push({
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url
                })
            }
        } catch (err) {
            console.log(err);
        }
    }
    return imageDataArr;
}



export const deleteImageHelper = async (publicId) => {  
    console.log(publicId);
     
    
   const promise = publicId &&  publicId?.map((val)=>{
    return new Promise((resolve,reject)=>{
            cloudinary.uploader.destroy(val,(error,result)=>{
                if(error){
                    return reject(error);
                }else{
                   return resolve(result);
                }
            })
    })
   })

   await Promise.all(promise);
}