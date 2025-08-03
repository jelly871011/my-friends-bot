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
        const friends = await getFriends();

        return formatFriendsList(friends);
    },
    '查看這個朋友': async (name) => {
        if (!name) return ERROR_MESSAGES.FRIEND.NAME_REQUIRED;
        
        try {
            const friend = await getSingleFriend(name);

            return formatFriendsList([friend]);
        } catch (error) {
            if (error.name === 'NotFoundError') {
                return ERROR_MESSAGES.FRIEND.NOT_FOUND;
            }

            console.error('查詢朋友時發生錯誤:', error);

            return ERROR_MESSAGES.GENERAL.PROCESSING_ERROR;
        }
    },
    '隨機查看朋友': async () => {
        const friends = await getFriends();

        if (!friends || !friends.length) return INFO_MESSAGES.FRIEND.LIST_EMPTY;

        const randomFriend = friends[Math.floor(Math.random() * friends.length)];

        return formatFriendsList([randomFriend]);
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
                return INFO_MESSAGES.BIRTHDAY.NO_UPCOMING;
            }
            
            const [nextBirthday, ...rest] = upcomingBirthdays;
            const top5 = [nextBirthday, ...rest.slice(0, 4)];

            return [
                INFO_MESSAGES.BIRTHDAY.UPCOMING_TITLE,
                INFO_MESSAGES.BIRTHDAY.NEXT_BIRTHDAY(
                    nextBirthday.name,
                    nextBirthday.nextBirthday
                ),
                ...top5.map((friend) => 
                    INFO_MESSAGES.BIRTHDAY.COUNTDOWN(
                        friend.name,
                        friend.daysUntil
                    )
                ),
                INFO_MESSAGES.BIRTHDAY.UPCOMING_COUNT(top5.length)
            ].join('\n');
        } catch (error) {
            console.error('處理生日倒數時出錯:', error);

            return ERROR_MESSAGES.BIRTHDAY.COUNTDOWN_ERROR;
        }
    }
};

export const handleCommand = async (text) => {
    try {
        const command = parseCommand(text);

        if (command.action === '幫助') {
            return command.message;
        }

        if (command.message) {
            return command.message;
        }

        const handler = COMMON_HANDLERS[command.action];

        if (!handler) {
            return ERROR_MESSAGES.COMMAND.NOT_SUPPORTED(command.action);
        }

        return await handler(command.name, command.args || []);
    } catch (error) {
        console.error('處理指令時發生錯誤:', error);

        return error.message || ERROR_MESSAGES.GENERAL.PROCESSING_ERROR;
    }
};