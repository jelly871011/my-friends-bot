import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_CONNECTION_STRING, { dbName: process.env.MONGODB_NAME }
        );
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

export default connectDB;
