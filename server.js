import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.routes.js';
import productRoute from './routes/product.routes.js';
import cartRoutes from './routes/carts.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import analyticsRoutes from './routes/analytic.routes.js';
import cors from 'cors';


const app = express();
dotenv.config();
app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/coupons',couponRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

