import { Client, middleware } from '@line/bot-sdk';

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.LINE_CHANNEL_SECRET;

if (!channelAccessToken || !channelSecret) {
    throw new Error('Missing required LINE configuration.');
}

const config = {
    channelAccessToken,
    channelSecret,
};

const client = new Client(config);

export { config, client, middleware };
