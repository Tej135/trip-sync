const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/tripsync';
    
    try {
        console.log(`[DB] Attempting connection to MongoDB at: ${mongoUri}`);
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2500,
        });
        console.log(`[DB] Successfully connected to MongoDB: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.warn(`[DB] Direct connection to ${mongoUri} failed (${err.message}). Starting MongoMemoryServer fallback...`);
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            mongoMemoryServer = await MongoMemoryServer.create({
                instance: {
                    dbName: 'tripsync'
                }
            });
            const memoryUri = mongoMemoryServer.getUri();
            console.log(`[DB] MongoMemoryServer spun up at: ${memoryUri}`);
            const conn = await mongoose.connect(memoryUri);
            console.log(`[DB] Successfully connected to In-Memory MongoDB.`);
            return conn;
        } catch (memErr) {
            console.error(`[DB] Failed to initialize MongoMemoryServer: ${memErr.message}`);
            throw memErr;
        }
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        if (mongoMemoryServer) {
            await mongoMemoryServer.stop();
        }
    } catch (err) {
        console.error('[DB] Error during disconnect:', err.message);
    }
};

module.exports = {
    connectDB,
    disconnectDB
};
