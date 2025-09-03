import 'dotenv/config';
import mongoose from 'mongoose';

if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error('MONGO_CONNECTION_STRING is not defined in environment variables');
}

if (!process.env.MONGODB_NAME) {
    throw new Error('MONGODB_NAME is not defined in environment variables');
}

const MONGODB_URI = process.env.MONGO_CONNECTION_STRING;
const DB_NAME = process.env.MONGODB_NAME;

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
});

export default connectDB;
