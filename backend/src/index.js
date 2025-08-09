import express from 'express';
import cors from 'cors';
import urlRoutes from './routes/url.js';
import dotenv from 'dotenv';
dotenv.config()

const app = express();
// frontend - 3000
// backend - 3001
// ipfs - 5001
const PORT = 3001

// allowing reqs from frontend origin
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // if using cookies or auth headers
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', urlRoutes);

app.listen(PORT, ()=>{console.log(`backend server running at http://localhost:${PORT}`)})
export default app;