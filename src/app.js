import 'dotenv/config';
import express from 'express';
import { handleEvent } from './webhook/handler.js';
import { config, client, middleware } from './config/lineClient.js';

const app = express();

app.post('/webhook', middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then(() => res.json({ success: true }))
        .catch((error) => {
            res.status(500).end();
        });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
