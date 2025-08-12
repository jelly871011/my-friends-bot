import { parseCommand } from "../utils/commandParser.js";
import {
    getFriends,
    getSingleFriend,
    updateFriendArrayField
} from '../services/friendService.js';
import { 
    ERROR_MESSAGES, 
    INFO_MESSAGES 
} from '../utils/messages.js';
import {
    getBirthdayFriendsToday,
    getBirthdayCountdown 
} from "../services/birthdayService.js";
import { 
    friendInfoCard,
    friendsListCarousel,
    birthdayCountdownCard,
    helpCard
} from "../utils/flexTemplates.js";

const formatFriendsList = (friends) => {
    if (!friends || !friends.length) return INFO_MESSAGES.FRIEND.LIST_EMPTY;

    return friends
        .map((friend) => [
            INFO_MESSAGES.FRIEND.DETAIL_TITLE(friend.name),
            INFO_MESSAGES.FRIEND.DESCRIPTION(friend.description),
            INFO_MESSAGES.FRIEND.BIRTHDAY(friend.birthday),
            INFO_MESSAGES.FRIEND.INTERESTS(friend.interests),
            INFO_MESSAGES.FRIEND.CATCHPHRASES(friend.catchphrases)
        ].join('\n'))
        .join('\n\n');
};

const formatFriendsToCarousel = (friends) => {
    if (!friends || !friends.length) {
        return {
            type: 'text',
            text: INFO_MESSAGES.FRIEND.LIST_EMPTY
        };
    }
    
    return friendsListCarousel(friends);
};

const createArrayUpdateHandler = (field, messages) => 
    async (name, args) => {
        if (!name) return ERROR_MESSAGES.FRIEND.NAME_REQUIRED;

        if (!args?.length) return `${messages.REQUIRED}，${messages.EXAMPLE(name)}`;

        try {
            await updateFriendArrayField(name, field, args);

            return messages.ADD_SUCCESS(name, args);
        } catch (error) {
            console.error(`${messages.ADD_FAILED}:`, error);

            return `${messages.ADD_FAILED}：${error.message || ERROR_MESSAGES.GENERAL.PROCESSING_ERROR}`;
        }
    };

const COMMON_HANDLERS = {
    '查看所有朋友': async () => {
        try {
            const friends = await getFriends();

            if (!friends) return;

            return friendsListCarousel(friends);
        } catch (err) {
            console.error('查詢朋友時發生錯誤:', err);

            return {
                type: 'text',
                text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR
            };
        }
    },
    '查看這個朋友': async (name) => {
        if (!name) return {
            type: 'text',
            text: ERROR_MESSAGES.FRIEND.NAME_REQUIRED
        }
        
        try {
            const friend = await getSingleFriend(name);

            if (!friend) return;

            return {
                type: 'flex',
                altText: `${friend.name} 的資料`,
                contents: friendInfoCard(friend)
            };
        } catch (error) {
            if (error.name === 'NotFoundError') {
                return {
                    type: 'text',
                    text: ERROR_MESSAGES.FRIEND.NOT_FOUND
                };
            }

            console.error('查詢朋友時發生錯誤:', error);

            return {
                type: 'text',
                text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR
            };
        }
    },
    '查看隨機朋友': async () => {
        const friends = await getFriends();

        if (!friends || !friends.length) {
            return {
                type: 'text',
                text: INFO_MESSAGES.FRIEND.LIST_EMPTY
            };
        }

        const randomFriend = friends[Math.floor(Math.random() * friends.length)];

        return {
            type: 'flex',
            altText: `${randomFriend.name} 的資料`,
            contents: friendInfoCard(randomFriend)
        };
    },
    '新增興趣': createArrayUpdateHandler(
        'interests', 
        {
            REQUIRED: ERROR_MESSAGES.INTEREST.REQUIRED,
            EXAMPLE: ERROR_MESSAGES.INTEREST.EXAMPLE,
            ADD_SUCCESS: ERROR_MESSAGES.INTEREST.ADD_SUCCESS,
            ADD_FAILED: ERROR_MESSAGES.INTEREST.ADD_FAILED
        }
    ),
    '新增口頭禪': createArrayUpdateHandler(
        'catchphrases',
        {
            REQUIRED: ERROR_MESSAGES.CATCHPHRASE.REQUIRED,
            EXAMPLE: ERROR_MESSAGES.CATCHPHRASE.EXAMPLE,
            ADD_SUCCESS: ERROR_MESSAGES.CATCHPHRASE.ADD_SUCCESS,
            ADD_FAILED: ERROR_MESSAGES.CATCHPHRASE.ADD_FAILED
        }
    ),
    '今天生日的朋友': async () => {
        try {
            const friends = await getBirthdayFriendsToday();

            if (!friends?.length) return INFO_MESSAGES.BIRTHDAY.NO_BIRTHDAY_TODAY;

            return friends.map((friend) => 
                INFO_MESSAGES.BIRTHDAY.TODAY(friend.name)
            ).join('\n');
        } catch (error) {
            console.error('處理今天生日的朋友時出錯:', error);

            return ERROR_MESSAGES.BIRTHDAY.FETCH_ERROR;
        }
    },
    '生日倒數': async () => {
        try {
            const upcomingBirthdays = await getBirthdayCountdown();

            if (!upcomingBirthdays?.length) {
                return {
                    type: 'text',
                    text: INFO_MESSAGES.BIRTHDAY.NO_UPCOMING
                };
            }
            
            return {
                type: 'flex',
                altText: `生日倒數`,
                contents: birthdayCountdownCard(upcomingBirthdays)
            };
        } catch (error) {
            console.error('處理生日倒數時出錯:', error);

            return {
                type: 'text',
                text: ERROR_MESSAGES.BIRTHDAY.COUNTDOWN_ERROR
            };
        }
    }
};

export const handleCommand = async (text) => {
    try {
        const command = parseCommand(text);

        if (command.action === '幫助') {
            return helpCard();
        }

        if (command.message) {
            return command.message;
        }

        const handler = COMMON_HANDLERS[command.action];

        if (!handler) {
            return ERROR_MESSAGES.COMMAND.NOT_SUPPORTED(command.action);
        }

        const result = await handler(command.name, command.args || []);

        return typeof result === 'string' 
            ? { type: 'text', text: result }
            : result;
    } catch (error) {
        console.error('處理指令時發生錯誤:', error);

        return error.message || ERROR_MESSAGES.GENERAL.PROCESSING_ERROR;
    }
};