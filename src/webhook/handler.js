const { client } = require('../config/lineClient');

const handleTextMessage = async (event) => {
    const { replyToken, message } = event;

    try {
        await client.replyMessage(replyToken, {
            type: 'text',
            text: `我學你說: ${message.text}`,
        });
    } catch (error) {
        return Promise.reject(error);
    }
};

const handleFollowEvent = async (event) => {
    const { replyToken, userId } = event;

    try {
        await client.pushMessage(userId, {
            type: 'text',
            text: '歡迎來到阿卡～～',
        })
    } catch (error) {
        return Promise.reject(error);
    }
};

const handleEvent = async (event) => {
    try {
        if (event.type === 'message') {
            return handleTextMessage(event);
        }

        if (event.type === 'follow') {
            return handleFollowEvent(event);
        }

        return Promise.resolve(null);
    } catch (error) {
        return Promise.reject(error);
    }
};

module.exports = { handleEvent };
    