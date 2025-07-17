const express = require('express');
const { handleEvent } = require('./webhook/handler');
const { config, client, middleware } = require('./config/lineClient');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/webhook', middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then(() => res.json({ success: true }))
        .catch((error) => {
            res.status(500).end();
        });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
