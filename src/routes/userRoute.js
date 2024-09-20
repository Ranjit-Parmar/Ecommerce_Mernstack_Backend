import express from 'express';
import {LoginUser, activeUser, createUser, logOutUser} from '../controllers/userController.js'
import {getAllUser, getSingleUser, deleteUser, updateUser, forgotPassword, passwordReset} from '../controllers/userController.js'
import { singleUpload } from '../middlewares/multer.js';
import { authentication } from '../middlewares/authentication.js';
import { authorization } from '../middlewares/authentication.js';



const router = express.Router();

router.post("/create-user", singleUpload, createUser)
.post("/login", LoginUser)
.get("/logout", logOutUser)
.put('/:id', singleUpload ,updateUser)
.get("/active-user", authentication, activeUser)
.get("/getuser", authentication, authorization, getAllUser)
.get("/:id", getSingleUser)
.delete("/:id", deleteUser)
.post("/forgotPassword",forgotPassword)
.post("/forgotPassword/reset/:id",passwordReset);



export default router;