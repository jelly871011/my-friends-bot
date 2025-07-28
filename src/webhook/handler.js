import { client } from '../config/lineClient.js';
import { getRandomResponse, keywordResponse } from '../utils/responses.js';
import { isCommand } from '../utils/commandParser.js';
import { handleCommand } from './commandRouter.js';

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

    if (!message) return Promise.resolve(null);

    if (message.type === 'text') {
        const { text } = message;

        try {
            if (isCommand(text)) {
                replyMessage = await handleCommand(text);
            } else {
                const response = keywordResponse(text);

                replyMessage = response
                    ? response
                    : getRandomResponse(text);
            }
        } catch (error) {
            console.error('處理訊息時發生錯誤:', error);
            replyMessage = `發生錯誤：${error.message}`;
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
