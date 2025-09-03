import { commands, commandAliases, noNameCommands } from './commonData.js';
import { ERROR_MESSAGES } from './messages.js';

// Type assertion for command aliases
const commandAliasesTyped: { [key: string]: string } = commandAliases;

// 格式: [名字] 動作 [參數1, 參數2, ...]
const COMMAND_REGEX = /^\s*((\S+)\s+)?(\S+)(?:\s+([\s\S]*))?$/;

const normalizedCommandCache = new Map();

const normalizeCommand = (command: string) => {
    if (!command) return null;

    if (normalizedCommandCache.has(command)) {
        return normalizedCommandCache.get(command);
    }

    const cmd = command.toLowerCase();
    const normalized = commandAliasesTyped[cmd] || command;

    normalizedCommandCache.set(command, normalized);

    return normalized;
};

const isValidCommand = (action: string) => {
    const normalizedCommand = normalizeCommand(action);
    return commands.includes(normalizedCommand);
};

export const isCommand = (text: string) => {
    if (!text || typeof text !== 'string') return false;

    const match = text.trim().match(COMMAND_REGEX);

    if (!match) return false;

    const [, , , action] = match;

    return action ? isValidCommand(action) : false;
};

export const parseCommand = (text: string) => {
    if (!text || typeof text !== 'string') {
        return { message: ERROR_MESSAGES.GENERAL.INVALID_INPUT };
    }

    const match = text.trim().match(COMMAND_REGEX);

    if (!match) {
        return { message: ERROR_MESSAGES.COMMAND.INVALID_FORMAT };
    }

    const [, , name, action, args = ''] = match;
    const normalizedAction = normalizeCommand(action);

    if (!normalizedAction || !isValidCommand(normalizedAction)) {
        return { message: ERROR_MESSAGES.COMMAND.NOT_SUPPORTED(action) };
    }

    if (noNameCommands.includes(normalizedAction)) {
        return { action: normalizedAction };
    }

    if (!name) {
        return {
            message: ERROR_MESSAGES.FRIEND.NAME_REQUIRED,
        };
    }

    return {
        name: name.trim(),
        action: normalizedAction,
        args: args
            .split(',')
            .map((arg) => arg.trim())
            .filter(Boolean),
    };
};
