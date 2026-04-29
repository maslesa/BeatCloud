import mongoose from "mongoose";
import { logger } from "./logger";


export const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        logger.info('Successfully connected to MongoDB.');
    } catch (error) {
        logger.error('Error connecting to MongoDB\n', error);
        process.exit(1);
    }
}