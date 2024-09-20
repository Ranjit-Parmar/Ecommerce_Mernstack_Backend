import express from 'express';
import { createCoupon, getCoupons, getSingleCoupon, deleteCoupon, updateCoupon } from '../controllers/couponController.js';

const app = express.Router();

app.get("/getCoupons",getCoupons);
app.get("/:id",getSingleCoupon);
app.get("/getSingleCoupon/?code",getSingleCoupon);
app.post("/createCoupon",createCoupon);
app.delete("/deleteCoupon/:id",deleteCoupon);
app.put("/updateCoupon/:id",updateCoupon);

export default app;