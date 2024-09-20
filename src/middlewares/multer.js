import multer from "multer"
import { v4 as uuidv4 } from 'uuid';


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//       const extName = file.originalname.split(".").pop();
//       const randomString = uuidv4();
//       console.log(req);
      
      
//       cb(null, file.fieldname + randomString + "." + extName)
//     }
//   })
  
//  export const multipleUpload = multer({ storage: storage }).array('photo');
//  export const singleUpload = multer({ storage: storage }).single('photo');

export const multipleUpload = multer().array('photo');
export const singleUpload = multer().single('photo');
 