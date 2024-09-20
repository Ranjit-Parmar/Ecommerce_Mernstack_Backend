import express from 'express';
import { addToCartController, myCartController, updateCartItems, deleteCartItems } from '../controllers/addToCartController.js';
import { authentication } from '../middlewares/authentication.js';


const app = express.Router();


app.get('/myCart',authentication, myCartController);
app.post('/addToCart',authentication, addToCartController);
app.patch('/updateCart/:id',authentication, updateCartItems);
app.delete('/deleteCartItem/:id',authentication, deleteCartItems);


export default app;