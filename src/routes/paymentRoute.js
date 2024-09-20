import express from 'express';
import { makePaymentController, paymentCancelController, paymentSuccessController, stripeApiKey } from '../controllers/paymentController.js';

const app = express.Router();

app.post('/make_payment',makePaymentController);
app.get('/get_stripe_api_key',stripeApiKey);
app.get('/success',paymentSuccessController);
app.get('/cancel',paymentCancelController);

export default app;


