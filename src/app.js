import 'dotenv/config';
import express from 'express';
import { handleEvent } from './webhook/handler.js';
import { config, middleware } from './config/lineClient.js';
import connectDB from './config/db.js';
import friendRoutes from './routes/friend.js';
import { errorHandler } from './middleward/errorHandler.js';

const app = express();

connectDB();

app.post('/webhook', middleware(config), async (req, res, next) => {
    try {
        await Promise.all(req.body.events.map(handleEvent));

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/friends', friendRoutes);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
