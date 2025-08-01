import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '../src/routes/routes'; // move your routes outside `src/`
import mongoDBConnect from '../src/config/mogoDB';

const app = express();

// Connect DB
mongoDBConnect();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://chef-gpt-ai-client.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// Routes
app.use('/api', router);

// Export as handler for Vercel
import { createServer } from 'http';
const server = createServer(app);
export default server;
