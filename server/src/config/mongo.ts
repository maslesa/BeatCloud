import mongoose from "mongoose";


export const connectToMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.error('Error connecting to MongoDB\n', error);
        process.exit(1);
    }
}