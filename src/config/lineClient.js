const { createClient, middleware } = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};

const client = createClient(config);

module.exports = { config, client, middleware };