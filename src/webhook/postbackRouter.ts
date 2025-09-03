import { getFriends, getFriendById } from '../services/friendService.js';
import { friendsListCarousel } from '../utils/flexTemplates.js';
import { ERROR_MESSAGES } from '../utils/messages.js';
import { setPendingAction } from './sessionState.js';

export const parsePostbackData = (data: string): Record<string, string> => {
    if (!data || typeof data !== 'string') return {};

    const params = new URLSearchParams(data);
    const obj: Record<string, string> = {};

    for (const [k, v] of params) {
        obj[k] = v;
    }

    return obj;
};

// 共用：處理新增興趣/口頭禪的 pending 設定與提示訊息
const handleAddFieldPending = async ({
    action,
    id,
    userId,
}: {
    action: string;
    id: string;
    userId: string;
}) => {
    const addInterest = action === 'add_interest';

    if (!id) {
        const label = addInterest ? '新增興趣' : '新增口頭禪';

        return { type: 'text', text: `請回到卡片重新點選「${label}」按鈕。` };
    }

    if (!userId) {
        return { type: 'text', text: '請回到卡片重新點選按鈕。' };
    }

    const friend = await getFriendById(id);

    if (!friend) {
        return { type: 'text', text: ERROR_MESSAGES.FRIEND.NOT_FOUND };
    }

    if (userId) {
        setPendingAction(userId, {
            action,
            friendId: friend._id.toString(),
            friendName: friend.name,
        });
    }

    if (addInterest) {
        return {
            type: 'text',
            text: `你想為「${friend.name}」新增興趣。\n請直接輸入想新增的興趣內容（可用、或，分隔多個）\n範例：睡覺、發呆`,
        };
    }

    return {
        type: 'text',
        text: `你想為「${friend.name}」新增口頭禪。\n請直接輸入想新增的口頭禪（可用、或，分隔多個）\n範例：好懶、蛤？`,
    };
};

interface Postback {
    data?: string;
}

interface Source {
    userId?: string;
}

export const handlePostback = async (postback: Postback, source: Source) => {
    if (!postback) return null;

    try {
        const data = typeof postback.data === 'string' ? postback.data : '';

        const params = parsePostbackData(data);
        const { action } = params;
        const userId = source?.userId || null;

        if (action === 'page') {
            const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
            const friends = await getFriends();

            if (!friends || !friends.length) {
                return {
                    type: 'text',
                    text: ERROR_MESSAGES.FRIEND.NO_FRIENDS,
                };
            }

            return friendsListCarousel(friends as any, page);
        }

        if (action === 'add_interest' || action === 'add_catchphrase') {
            return handleAddFieldPending({ action, id: params.id, userId: userId ?? '' });
        }

        return null;
    } catch (error) {
        console.error('postbackRouter 發生錯誤:', error);

        return { type: 'text', text: ERROR_MESSAGES.GENERAL.PROCESSING_ERROR };
    }
};
