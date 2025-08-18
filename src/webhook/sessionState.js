// 允許從環境變數設定預設 TTL（秒），預設 60 秒
const { SESSION_TTL_SECONDS = '60' } = process.env;
const DEFAULT_TTL = parseInt(SESSION_TTL_SECONDS, 10) || 60;
const state = new Map();

const now = () => Date.now();

const isExpired = (entry) => {
    if (!entry || typeof entry.expireAt !== 'number') return true;

    return now() >= entry.expireAt;
};

export const setPendingAction = (userId, payload) => {
    if (!userId || !payload) return;

    const ttlSec = DEFAULT_TTL;
    const expireAt = now() + ttlSec * 1000;

    state.set(userId, { payload, expireAt });
};

export const getPendingAction = (userId) => {
    if (!userId) return null;

    const entry = state.get(userId);

    if (!entry) return null;

    if (isExpired(entry)) {
        state.delete(userId);

        return null;
    }

    return entry.payload;
};

export const clearPendingAction = (userId) => {
    if (!userId) return;

    state.delete(userId);
};

// 每分鐘掃描一次，清除過期的 session
setInterval(() => {
    const nowTime = now();

    for (const [userId, entry] of state.entries()) {
        if (!entry || entry?.expireAt <= nowTime) {
            state.delete(userId);
        }
    }
}, DEFAULT_TTL * 1000);
