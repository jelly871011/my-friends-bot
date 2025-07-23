import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
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
            validator: function(v) {
              return v.length > 0; // 至少一個興趣
            },
            message: '至少需要一個興趣'
        }
    },
    catchphrases: {  // 口頭禪
        type: [String],
        default: [],
        trim: true,
        validate: {
            validator: function(v) {
                return v.length > 0; // 至少一個口頭禪
            },
            message: '至少需要一個口頭禪'
        }
    },
}, { timestamps: true });

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;
