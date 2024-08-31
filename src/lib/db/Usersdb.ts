import mongoose, { ConnectOptions } from "mongoose";


const connectUserDb = async (): Promise<void> => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined in the environment variables");
        process.exit(1); 
    }

    try {
        const conn = await mongoose.connect(MONGO_URI, {
            dbName: "cinema", 
            bufferCommands: true,
        } as ConnectOptions);
        console.log(`MongoDB users connected userdb: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectUserDb;

