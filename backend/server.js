import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
const frontendOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((origin) => origin.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost for development
    if (origin === 'http://localhost:5173' || origin === 'http://127.0.0.1:5173') {
      return callback(null, true);
    }

    // Allow configured FRONTEND_URL origins
    if (frontendOrigins.length > 0 && frontendOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any Vercel preview or production deployment
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Allow any Render deployment
    if (origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }

    // Reject other origins
    console.warn(`CORS rejected: ${origin}`);
    callback(new Error(`CORS policy does not allow access from ${origin}`), false);
  },
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Stripe config route
app.get('/api/config/stripe', (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder' });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});