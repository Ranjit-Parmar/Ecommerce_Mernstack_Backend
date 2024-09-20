import mongoose from 'mongoose';


export const connectDb = () => {
    mongoose.connect(process.env.MONGOURL).then((c)=>console.log(`connected to ${c.connection.host}`))
      .catch((e)=>console.log(e));
} 

process.on("unhandledRejection",(err)=>{
  console.log(err.name, err.message)
})
