import { Document, Types } from 'mongoose';

export interface IFriend extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    interests: string[];
    catchphrases: string[];
    birthday: Date;
    profileImageName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FriendInfo {
    _id: string;
    name: string;
    description?: string;
    interests: string[];
    catchphrases: string[];
    birthday: string;
    profileImageName?: string;
    daysUntil?: number;
    nextBirthday?: string;
}

export interface BirthdayFriend {
    name: string;
    daysUntil: number;
    birthday: string;
    nextBirthday: string;
}
