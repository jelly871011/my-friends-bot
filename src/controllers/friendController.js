import { ValidationError } from '../utils/errors.js';
import { friendData } from '../utils/commonData.js';
import {
    getFriends as getFriendsService,
    getSingleFriend as getSingleFriendService,
    updateFriendArrayField,
} from '../services/friendService.js';

export const getFriends = async (req, res, next) => {
    try {
        const friends = await getFriendsService();

        res.status(200).json(friends);
    } catch (error) {
        next(error);
    }
};

export const getSingleFriend = async (req, res, next) => {
    try {
        const { name } = req.params;
        const friend = await getSingleFriendService(name);

        res.status(200).json(friend);
    } catch (error) {
        next(error);
    }
};

const updateArrayField = (field) => async (req, res, next) => {
    try {
        const { name } = req.params;
        const newItems = req.body[field];

        if (!newItems) {
            const fieldName = friendData[field] || field;

            return next(new ValidationError(`請提供要更新的${fieldName}資料`));
        }

        const updatedFriend = await updateFriendArrayField(name, field, newItems, next);

        res.status(200).json(updatedFriend);
    } catch (error) {
        next(error);
    }
};

export const updateInterests = updateArrayField('interests');

export const updateCatchphrases = updateArrayField('catchphrases');
