import { client } from '../config/lineClient.js';
import { getRandomResponse, keywordResponse } from '../utils/responses.js';
import { isCommand } from '../utils/commandParser.js';
import { handleCommand } from './commandRouter.js';
import { getFriends } from '../services/friendService.js';
import { friendsListCarousel } from '../utils/flexTemplates.js';
import { ERROR_MESSAGES } from '../utils/messages.js';

const parsePostbackData = (data) => {
    if (!data || typeof data !== 'string') return {};

    const params = new URLSearchParams(data);
    const obj = {};

    for (const [k, v] of params) {
        obj[k] = obj[k]
            ? [].concat(obj[k], v)
            : v;
    }

    return obj;
};

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

const handlePostback = async (event) => {
    const { postback } = event;

    if (!postback) return Promise.resolve(null);

    let replyMessageObject = null;

    try {
        const data = typeof postback.data === 'string' ? postback.data : '';
        const params = parsePostbackData(data);
        const action = params.action;

        if (action === 'page') {
            const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
            const friends = await getFriends();

            if (!friends || !friends.length) {
                replyMessageObject = { type: 'text', text: ERROR_MESSAGES.FRIEND.LIST_EMPTY };
            } else {
                replyMessageObject = friendsListCarousel(friends, page);
            }
        }
    } catch (error) {
        console.error('處理 postback 時發生錯誤:', error);

        replyMessageObject = { type: 'text', text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR };
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
        if (event.type === 'postback') {
            return handlePostback(event);
        }

        return Promise.resolve(null);
    } catch (error) {
        return Promise.reject(error);
    }
};

export { handleEvent };