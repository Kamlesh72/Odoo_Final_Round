import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import db from './config/dbConfig.js';
import usersRoute from './routes/usersRoute.js';
import booksRoute from './routes/booksRoute.js';
import mailRoute from './routes/mailRoute.js';
import notificationRoute from './routes/notificationRoute.js';

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;
db();

app.use(express.json());
app.use('/api/users', usersRoute);
app.use('/api/books', booksRoute);
app.use('/api/mail', mailRoute);
app.use('/api/notifications', notificationRoute);

app.listen(port, () => console.log(`Server running on PORT ${port}`));
