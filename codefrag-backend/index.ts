import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connect';
import authRoutes from './routes/authRoutes';
const app = express();
const PORT = 5000;
dotenv.config();
app.use(cors());
app.use(express.json());  
app.use('/api/auth', authRoutes);
connectDB();


app.get('/', (req: Request, res: Response) => {
  res.send('CodeFrag backend is running');
});
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is connected' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});