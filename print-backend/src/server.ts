import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import errorHandler from './middleware/errorHandler';
import shopRoutes from './routes/shops';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import reviewRoutes from './routes/reviews';
import { signToken } from './config/jwt';
import customerRoutes from './routes/customer';






// Must be after all routes



dotenv.config();
connectDB();

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  socket.on('join_shop', (shopId: string) => {
    socket.join(shopId);
    console.log(`Shop ${shopId} is online`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.set('io', io);

// Routes — will be added soon
// app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use(errorHandler);
app.use('/api/shops', shopRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/customer', customerRoutes);


app.get('/api/test/user-token', (req, res) => {
  const token = signToken({ id: '507f1f77bcf86cd799439011', role: 'user' });
  res.json({ token });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));