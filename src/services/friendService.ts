import { NextFunction } from 'express';
import Friend from '../modules/Friend.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export const getFriends = async () => {
    return await Friend.find();
};

export const findFriendByName = async (name: string) => {
    return await Friend.findOne({
        name: new RegExp(`^${name}`, 'i'),
    });
};

export const getSingleFriend = async (name: string) => {
    const friend = await findFriendByName(name);

    if (!friend) {
        throw new NotFoundError('Friend');
    }

    return friend;
};

export const getFriendById = async (id: string) => {
    return await Friend.findById(id);
};

export const updateFriendArrayField = async (
    name: string,
    field: 'interests' | 'catchphrases',
    newItems: string[],
    _next?: NextFunction,
) => {
    if (!Array.isArray(newItems)) {
        throw new ValidationError('資料必須為陣列');
    }

    if (!newItems.length) {
        throw new ValidationError('資料不能為空');
    }

    const friend = await findFriendByName(name);

    if (!friend) throw new NotFoundError('Friend');

    const existingItems: string[] = Array.isArray(friend[field]) ? friend[field] : [];
    const duplicateItems = newItems.filter((item) =>
        existingItems.some(
            (existingItem: string) =>
                existingItem.trim().toLowerCase() === item.trim().toLowerCase(),
        ),
    );

    if (duplicateItems.length) {
        throw new ValidationError('資料已存在', { duplicates: duplicateItems } as any);
    }

    const updatedItems = [...new Set([...existingItems, ...newItems])];

    return await Friend.findOneAndUpdate(
        { _id: friend._id },
        { $set: { [field]: updatedItems } },
        { new: true, runValidators: true },
    );
};
