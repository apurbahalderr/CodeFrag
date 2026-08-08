import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
const app = express();
const PORT = 5000;
dotenv.config();
app.use(cors());
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req: Request, res: Response) => {
  res.send('CodeFrag backend is running');
});
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is connected' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});