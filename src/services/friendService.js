import Friend from "../modules/Friend.js";
import {  ValidationError, NotFoundError } from "../utils/errors.js";

export const getFriends = async () => {
    return await Friend.find();
};

export const findFriendByName = async (name) => {
    return await Friend.findOne({  
        name: new RegExp(`^${name}`, 'i')  
    });
};

export const getSingleFriend = async (name) => {
    const friend = await findFriendByName(name); 

    if (!friend) {
        throw new NotFoundError('Friend');
    }

    return friend;
};

export const updateFriendArrayField = async (name, field, newItems, next) => {
    if (!Array.isArray(newItems)) {
        throw new ValidationError('資料必須為陣列');
    }

    if (!newItems.length) {
        throw new ValidationError('資料不能為空');
    }

    const friend = await findFriendByName(name);

    if (!friend) throw new NotFoundError('Friend');

    const existingItems = friend[field] || [];
    const duplicateItems = newItems.filter(item => 
        existingItems.some(existingItem => 
            existingItem.trim().toLowerCase() === item.trim().toLowerCase()
        )
    );

    if (duplicateItems.length) {
        throw new ValidationError('資料已存在', { duplicates: duplicateItems });
    }

    const updatedItems = [...new Set([...existingItems, ...newItems])];

    return await Friend.findOneAndUpdate(
        { _id: friend._id },
        { $set: { [field]: updatedItems } },
        { new: true, runValidators: true }
    );
};