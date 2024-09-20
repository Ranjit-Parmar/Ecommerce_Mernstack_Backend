import express from 'express';
import { GetAllOrders, createOrder, getSingleOrder, updateOrder, deleteOrder, getMyOrders } from '../controllers/orderController.js';
import { authentication, authorization } from '../middlewares/authentication.js';


const app = express.Router();

app.post("/newOrder",authentication, createOrder);
app.get("/allOrders",authentication, authorization, GetAllOrders);
app.route("/:id").get(authentication, authorization, getSingleOrder).put(authentication, authorization, updateOrder).delete(authentication, authorization, deleteOrder);
app.get("/myOrders/:id",authentication,getMyOrders);

export default app;
