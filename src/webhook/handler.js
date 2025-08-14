import { client } from '../config/lineClient.js';
import { getRandomResponse, keywordResponse } from '../utils/responses.js';
import { isCommand } from '../utils/commandParser.js';
import { handleCommand } from './commandRouter.js';
import { handlePostback as routePostback } from './postbackRouter.js';
import { getPendingAction, clearPendingAction } from './sessionState.js';
import { updateFriendArrayField } from '../services/friendService.js';
import { ERROR_MESSAGES } from '../utils/messages.js';

const handlePendingAction = async (text, pending, userId) => {
    if (!pending || !userId) return null;

    const items = text
        .split(/[、，,]/)
        .map((s) => s.trim())
        .filter(Boolean);

    const { action, friendName } = pending;
    const addInterest = (action === 'add_interest');
    let replyMessageObject = null;

    if (!items.length) {
        replyMessageObject = { type: 'text', text: '請直接輸入要新增的內容（可用、或，分隔多個）' };
    } else {
        try {
            const field = addInterest ? 'interests' : 'catchphrases';

            await updateFriendArrayField(friendName, field, items);

            const successMsg = addInterest
                ? ERROR_MESSAGES.INTEREST.ADD_SUCCESS(friendName, items)
                : ERROR_MESSAGES.CATCHPHRASE.ADD_SUCCESS(friendName, items);

            replyMessageObject = { type: 'text', text: successMsg };
        } catch (err) {
            const failMsg = addInterest
                ? `${ERROR_MESSAGES.INTEREST.ADD_FAILED}：${err.message || ''}`
                : `${ERROR_MESSAGES.CATCHPHRASE.ADD_FAILED}：${err.message || ''}`;

            replyMessageObject = { type: 'text', text: failMsg.trim() };
        } finally {
            clearPendingAction(userId);
        }
    }

    return replyMessageObject;
};

const handleMessage = async (event) => {
    const { message, source } = event;
    let replyMessageObject = null;

    if (!message || message.type !== 'text') {
        return Promise.resolve(null);
    }

    try {
        const { text } = message;
        const userId = source?.userId || null;
        const pending = userId
            ? getPendingAction(userId)
            : null;

        if (pending && userId) {
            replyMessageObject = await handlePendingAction(text, pending, userId);
        }

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
    const { postback, replyToken, source } = event;

    if (!postback) return Promise.resolve(null);

    try {
        const replyMessageObject = await routePostback(postback, source);

        if (replyMessageObject) {
            await client.replyMessage(replyToken, replyMessageObject);
        }
    } catch (error) {
        console.error('處理 postback 時發生錯誤:', error);

        try {
            await client.replyMessage(replyToken, { type: 'text', text: '處理指令時發生錯誤，請稍後再試' });
        } catch (sendError) {
            console.error('發送 LINE 訊息失敗:', sendError);
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