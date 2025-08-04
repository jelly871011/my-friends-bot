import { commands, help, commandAliases, noNameCommands } from "./commonData.js";
import { INFO_MESSAGES, ERROR_MESSAGES } from "./messages.js";

// 格式: [名字] 動作 [參數1, 參數2, ...]
const COMMAND_REGEX = /^\s*((\S+)\s+)?(\S+)(?:\s+([\s\S]*))?$/;

const normalizedCommandCache = new Map();

const normalizeCommand = (command) => {
    if (!command) return null;

    if (normalizedCommandCache.has(command)) {
        return normalizedCommandCache.get(command);
    }

    const normalized = commandAliases[command.toLowerCase()] || command;

    normalizedCommandCache.set(command, normalized);

    return normalized;
};

const getHelpMessage = () => {
    const helpText = help.map(item => 
        `🔹 ${INFO_MESSAGES.HELP.COMMAND_FORMAT} ${item.command}\n   ${item.description}\n   ${INFO_MESSAGES.HELP.EXAMPLE} ${item.example}`
    ).join('\n\n');

    return `${INFO_MESSAGES.HELP.TITLE}\n\n${helpText}\n\n💡 ${INFO_MESSAGES.HELP.HINT}`;
};

const isValidCommand = (action) => {
    const normalizedCommand = normalizeCommand(action);
    return commands.includes(normalizedCommand);
};

export const isCommand = (text) => {
    if (!text || typeof text !== 'string') return false;
    
    const match = text.trim().match(COMMAND_REGEX);
    if (!match) return false;
    
    const [_, __, name, action] = match;
    return action ? isValidCommand(action) : false;
};

export const parseCommand = (text) => {
    if (!text || typeof text !== 'string') {
        return { message: ERROR_MESSAGES.GENERAL.INVALID_INPUT };
    }

    const match = text.trim().match(COMMAND_REGEX);

    if (!match) {
        return { message: ERROR_MESSAGES.COMMAND.INVALID_FORMAT };
    }

    const [_, __, name, action, args = ''] = match;
    const normalizedAction = normalizeCommand(action);

    if (!normalizedAction || !isValidCommand(normalizedAction)) {
        return { message: ERROR_MESSAGES.COMMAND.NOT_SUPPORTED(action) };
    }

    if (noNameCommands.includes(normalizedAction) ) {
        return { action: normalizedAction };
    }

    if (!name) {
        return { 
            message: ERROR_MESSAGES.FRIEND.NAME_REQUIRED 
        };
    }

    return {
        name: name.trim(),
        action: normalizedAction,
        args: args.split(',').map((arg) => arg.trim()).filter(Boolean)
    };
};