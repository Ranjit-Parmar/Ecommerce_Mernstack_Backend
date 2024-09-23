import multer from "multer"

export const multipleUpload = multer().array('photo');
export const singleUpload = multer().single('photo');
 