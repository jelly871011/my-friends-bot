const greetings = [
    '欸！我先走囉！',
    '今天過得好嗎？',
    '你是不是很閒啊？？',
    '今天午餐好吃嗎？還在上班，好懶喔',
    '你是誰啊？'
];

const generalResponses = [
    "我聽到了：{text}",
    "你說：{text}，對吧？",
    "嗯... {text}... 有意思！",
    "我記住了：{text}",
    "「{text}」... 這是什麼意思呢？",
    "你說：{text}，我聽到了！",
    "{text}... 這是個好問題！",
    "讓我思考一下「{text}」的含義...",
    "「{text}」... 真是有趣的想法！",
    "我明白你在說「{text}」"
];

const specialResponses = [
    '你知道嗎？阿卡已經第九年了，明年邁入第十年喔！！',
    '七人幫的中文名稱是「阿卡」，英文名稱是「A CA」',
    '想知道七人幫的由來嗎？我們再熟一點就知道了',
];

const specialKeywords = [
    '阿卡',
    'A CA',
    '七人幫'
];

const greetingKeywords = [
    '你好',
    'hi',
    '嗨',
    '早安',
    '午安',
    '晚安',
];

const getRandomIndex = (length) => {
    return Math.floor(Math.random() * length);
}

const getRandomResponse = () => {
    return generalResponses[getRandomIndex(generalResponses.length)];
}

const keywordResponse = (text) => {
    if (specialKeywords.some((keyword) => text.includes(keyword))) {
        return specialResponses[getRandomIndex(specialResponses.length)];
    }

    if (greetingKeywords.some((keyword) => text.includes(keyword))) {
        return greetings[getRandomIndex(greetings.length)];
    }

    return null;
};

export {
    getRandomResponse,
    keywordResponse,
}

