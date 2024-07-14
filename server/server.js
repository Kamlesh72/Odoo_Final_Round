import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import db from './config/dbConfig.js';
import usersRoute from './routes/usersRoute.js';
import booksRoute from './routes/booksRoute.js';

const app = express();
app.use(cors());
const port = process.env.PORT || 8080;
db();

app.use(express.json());
app.use('/api/users', usersRoute);
app.use('/api/books', booksRoute);

app.listen(port, () => console.log(`Server running on PORT ${port}`));
