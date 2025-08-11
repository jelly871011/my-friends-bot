import { client } from '../config/lineClient.js';
import { getRandomResponse, keywordResponse } from '../utils/responses.js';
import { isCommand } from '../utils/commandParser.js';
import { handleCommand } from './commandRouter.js';

const handleMessage = async (event) => {
    const { message } = event;
    let replyMessageObject = null;

    if (!message || message.type !== 'text') {
        return Promise.resolve(null);
    }
    
    const { text } = message;

    try {
        if (isCommand(text)) {
            replyMessageObject = await handleCommand(text);
        } else {
            const responseText = keywordResponse(text) || getRandomResponse(text);
            
            if (responseText) {
                replyMessageObject = {
                    type: 'text',
                    text: responseText,
                };
            }
        }
    } catch (error) {
        console.error('處理訊息時發生錯誤:', error);

        replyMessageObject = {
            type: 'text',
            text: `發生錯誤：${error.message}`,
        };
    }

    if (replyMessageObject) {
        try {
            await client.replyMessage(event.replyToken, replyMessageObject);
        } catch (error) {
            console.error('發送 LINE 訊息失敗:', error);
        }
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