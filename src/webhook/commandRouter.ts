import { parseCommand } from '../utils/commandParser.js';
import { getFriends, getSingleFriend, updateFriendArrayField } from '../services/friendService.js';
import { ERROR_MESSAGES, INFO_MESSAGES } from '../utils/messages.js';
import { getBirthdayFriendsToday, getBirthdayCountdown } from '../services/birthdayService.js';
import {
    friendInfoCard,
    friendsListCarousel,
    birthdayCountdownCard,
    helpCard,
} from '../utils/flexTemplates.js';
import { FriendInfo } from '../types/friend.js';

interface ArrayUpdateMessages {
    REQUIRED: string;
    EXAMPLE: (name: string) => string;
    ADD_SUCCESS: (name: string, args: string[]) => string;
    ADD_FAILED: string;
}

type ArrayField = 'interests' | 'catchphrases';

const createArrayUpdateHandler =
    (field: ArrayField, messages: ArrayUpdateMessages) => async (name: string, args: string[]) => {
        if (!name) return ERROR_MESSAGES.FRIEND.NAME_REQUIRED;

        if (!args?.length) return `${messages.REQUIRED}，${messages.EXAMPLE(name)}`;

        try {
            await updateFriendArrayField(name, field, args);

            return messages.ADD_SUCCESS(name, args);
        } catch (error: any) {
            console.error(`${messages.ADD_FAILED}:`, error);

            return `${messages.ADD_FAILED}：${error.message || ERROR_MESSAGES.GENERAL.PROCESSING_ERROR}`;
        }
    };

// Helper function to convert IFriend to FriendInfo
const toFriendInfo = (friend: any): FriendInfo => {
    const birthday = friend.birthday ? new Date(friend.birthday).toISOString().split('T')[0] : '';
    return {
        _id: friend._id.toString(),
        name: friend.name,
        description: friend.description || undefined,
        interests: friend.interests || [],
        catchphrases: friend.catchphrases || [],
        birthday,
        profileImageName: friend.profileImageName || undefined
    };
};

// Helper function to convert to BirthdayFriend (commented out as it's not currently used)
// const toBirthdayFriend = (friend: IFriend, daysUntil: number, nextBirthday: Date): BirthdayFriend => ({
//     name: friend.name,
//     daysUntil,
//     birthday: friend.birthday ? new Date(friend.birthday).toISOString().split('T')[0] : '',
//     nextBirthday: format(nextBirthday, 'yyyy-MM-dd')
// });

type CommandHandler = (name?: string, args?: string[]) => Promise<any>;

const COMMON_HANDLERS: Record<string, CommandHandler> = {
    查看所有朋友: async () => {
        try {
            const friends = await getFriends();

            if (!friends) return;

            const friendInfos = friends.map(toFriendInfo);
            return friendsListCarousel(friendInfos);
        } catch (err) {
            console.error('查詢朋友時發生錯誤:', err);

            return {
                type: 'text',
                text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR,
            };
        }
    },
    查看這個朋友: async (name?: string) => {
        if (!name) {
            return {
                type: 'text',
                text: ERROR_MESSAGES.FRIEND.NAME_REQUIRED,
            };
        }
        if (!name)
            return {
                type: 'text',
                text: ERROR_MESSAGES.FRIEND.NAME_REQUIRED,
            };

        try {
            const friend = await getSingleFriend(name);

            if (!friend) return;

            return {
                type: 'flex',
                altText: `${friend.name} 的資料`,
                contents: friendInfoCard(toFriendInfo(friend)),
            };
        } catch (error: any) {
            if (error.name === 'NotFoundError') {
                return {
                    type: 'text',
                    text: ERROR_MESSAGES.FRIEND.NOT_FOUND,
                };
            }

            console.error('查詢朋友時發生錯誤:', error);

            return {
                type: 'text',
                text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR,
            };
        }
    },
    查看隨機朋友: async () => {
        const friends = await getFriends();

        if (!friends || !friends.length) {
            return {
                type: 'text',
                text: INFO_MESSAGES.FRIEND.LIST_EMPTY,
            };
        }

        const randomFriend = friends[Math.floor(Math.random() * friends.length)];

        return {
            type: 'flex',
            altText: `${randomFriend.name} 的資料`,
            contents: friendInfoCard(toFriendInfo(randomFriend)),
        };
    },
    新增興趣: async (name?: string, args?: string[]) => {
        if (!name || !args) {
            return ERROR_MESSAGES.FRIEND.NAME_REQUIRED;
        }
        const handler = createArrayUpdateHandler('interests', {
            REQUIRED: ERROR_MESSAGES.INTEREST.REQUIRED,
            EXAMPLE: INFO_MESSAGES.INTEREST.EXAMPLE,
            ADD_SUCCESS: INFO_MESSAGES.INTEREST.ADD_SUCCESS,
            ADD_FAILED: ERROR_MESSAGES.INTEREST.ADD_FAILED,
        });
        return handler(name, args);
    },
    新增口頭禪: async (name?: string, args?: string[]) => {
        if (!name || !args) {
            return ERROR_MESSAGES.FRIEND.NAME_REQUIRED;
        }
        const handler = createArrayUpdateHandler('catchphrases', {
            REQUIRED: ERROR_MESSAGES.CATCHPHRASE.REQUIRED,
            EXAMPLE: INFO_MESSAGES.CATCHPHRASE.EXAMPLE,
            ADD_SUCCESS: INFO_MESSAGES.CATCHPHRASE.ADD_SUCCESS,
            ADD_FAILED: ERROR_MESSAGES.CATCHPHRASE.ADD_FAILED,
        });
        return handler(name, args);
    },
    今天生日的朋友: async () => {
        try {
            const friends = await getBirthdayFriendsToday();

            if (!friends?.length) return INFO_MESSAGES.BIRTHDAY.NO_BIRTHDAY_TODAY;

            return friends.map((friend) => INFO_MESSAGES.BIRTHDAY.TODAY(friend.name)).join('\n');
        } catch (error) {
            console.error('處理今天生日的朋友時出錯:', error);

            return ERROR_MESSAGES.BIRTHDAY.FETCH_ERROR;
        }
    },
    生日倒數: async () => {
        try {
            const upcomingBirthdays = (await getBirthdayCountdown()).map(bd => ({
                ...bd,
                birthday: bd.birthday.toISOString().split('T')[0]
            }));

            if (!upcomingBirthdays.length) {
                return {
                    type: 'text',
                    text: INFO_MESSAGES.BIRTHDAY.NO_UPCOMING,
                };
            }

            return {
                type: 'flex',
                altText: '生日倒數',
                contents: birthdayCountdownCard(upcomingBirthdays),
            };
        } catch (error) {
            console.error('處理生日倒數時出錯:', error);

            return {
                type: 'text',
                text: ERROR_MESSAGES.BIRTHDAY.COUNTDOWN_ERROR,
            };
        }
    },
};

export const handleCommand = async (text: string) => {
    try {
        const command = parseCommand(text);

        if (command.action === '幫助') {
            return helpCard();
        }

        if (command.message) {
            return command.message;
        }

        const handler = command.action in COMMON_HANDLERS 
            ? COMMON_HANDLERS[command.action as keyof typeof COMMON_HANDLERS] 
            : null;

        if (!handler) {
            return ERROR_MESSAGES.COMMAND.NOT_SUPPORTED(command.action);
        }

        const result = await handler(command.name, command.args || []);

        return typeof result === 'string' ? { type: 'text', text: result } : result;
    } catch (error: any) {
        console.error('處理指令時發生錯誤:', error);

        return error.message || ERROR_MESSAGES.GENERAL.PROCESSING_ERROR;
    }
};
