export const ERROR_MESSAGES = {
    // 通用錯誤
    GENERAL: {
        INVALID_INPUT: '無效的輸入參數',
        PROCESSING_ERROR: '處理指令時發生錯誤，請稍後再試',
        NOT_FOUND: '找不到相關資料',
        UNAUTHORIZED: '未經授權的操作',
        VALIDATION_ERROR: '驗證失敗，請檢查輸入內容'
    },
    // 朋友相關
    FRIEND: {
        NOT_FOUND: '找不到這位朋友的資料',
        NO_FRIENDS: '目前沒有朋友資料',
        NAME_REQUIRED: '請指定朋友名稱',
        INVALID_NAME: '無效的朋友名稱',
    },
    // 興趣相關
    INTEREST: {
        ADD_SUCCESS: (name, interests) => `已為 ${name} 新增興趣：${interests.join('、')}`,
        ADD_FAILED: '新增興趣失敗',
        REQUIRED: '請提供興趣',
        INVALID: '無效的興趣內容',
        EXAMPLE: (name) => `例如：「${name} 新增興趣 發呆」`
    },
    // 口頭禪相關
    CATCHPHRASE: {
        ADD_SUCCESS: (name, phrases) => `已為 ${name} 新增口頭禪：${phrases.join('、')}`,
        ADD_FAILED: '新增口頭禪失敗',
        REQUIRED: '請提供口頭禪',
        INVALID: '無效的口頭禪內容',
        EXAMPLE: (name) => `例如：「${name} 新增口頭禪 好懶」`
    },
    // 指令相關
    COMMAND: {
        NOT_SUPPORTED: (command) => `不支援的指令：「${command}」`,
        INVALID_FORMAT: '指令格式錯誤',
        MISSING_ARGS: '缺少必要參數'
    }
};

export const INFO_MESSAGES = {
    HELP: {
        TITLE: '📝 可用指令：',
        COMMAND_FORMAT: '指令格式：',
        EXAMPLE: '範例：',
        HINT: '可以使用英文縮寫，例如：h=幫助, ls=查看所有朋友, v=查看這個朋友, i=興趣, c=口頭禪'
    },
    FRIEND: {
        LIST_EMPTY: '目前沒有朋友資料',
        DETAIL_TITLE: (name) => `👤 ${name} 的資料：`,
        DESCRIPTION: (desc) => `- 介紹：${desc || '無'}`,
        BIRTHDAY: (date) => {
            if (!date) return '- 生日：未設定';

            const d = new Date(date);

            return `- 生日：${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
        },
        INTERESTS: (interests) => `- 興趣：${interests?.join('、') || '無'}`,
        CATCHPHRASES: (phrases) => `- 口頭禪：${phrases?.join('、') || '無'}`
    }
};
