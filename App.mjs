import express from 'express';
import authRoutes from './Routes/authRoutes.mjs';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;

