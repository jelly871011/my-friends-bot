import { client } from '../config/lineClient.js';
import { getRandomResponse, keywordResponse } from '../uitls/responses.js';

const handleReplyMessage = async (replyToken, text) => {
    try {
        await client.replyMessage(replyToken, {
            type: 'text',
            text,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

const handleMessage = async (event) => {
    const { message } = event;
    let replyMessage = null;

    if (message.type === 'text') {
        const response = keywordResponse(message.text);

        if (response) {
            replyMessage = response;
        } else {
            replyMessage = getRandomResponse();
        }
    }

    if (replyMessage) {
        await handleReplyMessage(event.replyToken, replyMessage);
    }

    return Promise.resolve(null);
};

const handleEvent = async (event) => {
    try {
        if (event.type === 'message') {
            return handleMessage(event);
        }

        return Promise.resolve(null);
    } catch (error) {
        return Promise.reject(error);
    }
};

export { handleEvent };
