import { client } from '../config/lineClient.js';
import type { MessageEvent, PostbackEvent, WebhookEvent, EventSource } from '@line/bot-sdk';
import { getRandomResponse, keywordResponse } from '../utils/responses.js';
import { isCommand } from '../utils/commandParser.js';
import { handleCommand } from './commandRouter.js';
import { handlePostback as routePostback } from './postbackRouter.js';
import { getPendingAction, clearPendingAction } from './sessionState.js';
import { updateFriendArrayField } from '../services/friendService.js';
import { ERROR_MESSAGES, INFO_MESSAGES } from '../utils/messages.js';

type TextMessage = { type: 'text'; text: string };
const handlePendingAction = async (
    text: string,
    pending: { action: string; friendName: string },
    userId: string,
): Promise<TextMessage | null> => {
    if (!pending || !userId) return null;

    const items = text
        .split(/[、，,]/)
        .map((s) => s.trim())
        .filter(Boolean);

    const { action, friendName } = pending;
    const addInterest = action === 'add_interest';
    let replyMessageObject: TextMessage | null = null;

    if (!items.length) {
        replyMessageObject = { type: 'text', text: '請直接輸入要新增的內容（可用、或，分隔多個）' };
    } else {
        try {
            const field = addInterest ? 'interests' : 'catchphrases';
            await updateFriendArrayField(
                friendName,
                field,
                items,
                undefined as unknown as import('express').NextFunction,
            );
            const successMsg = addInterest
                ? INFO_MESSAGES.INTEREST.ADD_SUCCESS(friendName, items)
                : INFO_MESSAGES.CATCHPHRASE.ADD_SUCCESS(friendName, items);
            replyMessageObject = { type: 'text', text: successMsg };
        } catch (err) {
            let msg = '';
            if (err instanceof Error) {
                msg = err.message;
            }
            const failMsg = addInterest
                ? `${ERROR_MESSAGES.INTEREST.ADD_FAILED}：${msg}`
                : `${ERROR_MESSAGES.CATCHPHRASE.ADD_FAILED}：${msg}`;
            replyMessageObject = { type: 'text', text: failMsg.trim() };
        } finally {
            clearPendingAction(userId);
        }
    }
    return replyMessageObject;
};

const handleReply = async (event: MessageEvent & { source: EventSource }): Promise<TextMessage> => {
    const { message, source } = event;

    if (message.type !== 'text') {
        return { type: 'text', text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR };
    }

    const text = message.text;
    const userId = source?.userId || '';
    const pending = userId ? getPendingAction(userId) : null;
    if (pending && userId) {
        const reply = await handlePendingAction(text, pending, userId);
        return reply ?? { type: 'text', text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR };
    }

    if (isCommand(text)) {
        // handleCommand 回傳型別需與 TextMessage 相容
        const result = await handleCommand(text);
        if (result && typeof result === 'object') {
            return result;
        }

        return { type: 'text', text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR };
    }

    const responseText = keywordResponse(text) || getRandomResponse(text);

    return responseText
        ? { type: 'text', text: responseText }
        : { type: 'text', text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR };
};

const handleMessage = async (event: MessageEvent & { replyToken: string }) => {
    const { message, replyToken } = event;
    if (!message || message.type !== 'text') {
        return Promise.resolve(null);
    }
    try {
        const replyMessageObject = await handleReply(event);
        await client.replyMessage(replyToken, replyMessageObject);
        return Promise.resolve(null);
    } catch (error) {
        console.error('處理訊息時發生錯誤:', error);
        let msg = '';
        if (error instanceof Error) {
            msg = error.message;
        }
        try {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: `發生錯誤：${msg}`,
            });
        } catch (sendError) {
            console.error('發送 LINE 訊息失敗:', sendError);
        }
        return Promise.resolve(null);
    }
};

const handlePostback = async (event: PostbackEvent) => {
    const { postback, replyToken, source } = event;
    if (!postback) return Promise.resolve(null);
    try {
        const replyMessageObject = await routePostback(postback, source);

        if (replyMessageObject) {
            await client.replyMessage(replyToken, replyMessageObject as TextMessage);
        }
    } catch (error) {

        console.error('處理 postback 時發生錯誤:', error);

        try {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '處理指令時發生錯誤，請稍後再試',
            });
        } catch (sendError) {
            console.error('發送 LINE 訊息失敗:', sendError);
        }
    }

    return Promise.resolve(null);
};

const handleEvent = async (event: WebhookEvent) => {
    try {
        if (event.type === 'message') {
            return handleMessage(event as MessageEvent & { replyToken: string });
        }

        if (event.type === 'postback') {
            return handlePostback(event as PostbackEvent);
        }

        return Promise.resolve(null);
    } catch (error) {
        return Promise.reject(error);
    }
};

export { handleEvent };
