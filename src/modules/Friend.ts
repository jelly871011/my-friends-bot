import mongoose, { Document, Types } from 'mongoose';

export interface IFriend extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string | null;
    interests: string[];
    catchphrases: string[];
    birthday: Date | null;
    profileImageName?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const friendSchema = new mongoose.Schema<IFriend>(

    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        interests: {
            type: [String],
            default: [],
            trim: true,
            validate: {
                validator: function (v) {
                    return v.length > 0; // 至少一個興趣
                },
                message: '至少需要一個興趣',
            },
        },
        catchphrases: {
            // 口頭禪
            type: [String],
            default: [],
            trim: true,
            validate: {
                validator: function (v) {
                    return v.length > 0; // 至少一個口頭禪
                },
                message: '至少需要一個口頭禪',
            },
        },
        birthday: {
            type: Date,
            default: null,
        },
        profileImageName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

const Friend = mongoose.model<IFriend>('Friend', friendSchema);

export default Friend;
