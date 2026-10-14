require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./db/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        // Check if database is empty and auto-seed initial data
        const Place = require('./models/place.model');
        const count = await Place.countDocuments();
        if (count === 0) {
            console.log('[Server] Database is empty. Running initial seed data...');
            const { seedData } = require('./seed');
            await seedData();
        } else {
            console.log(`[Server] Database contains ${count} places. Ready!`);
        }

        const server = app.listen(PORT, () => {
            console.log(`=======================================================`);


            console.log(`🚀 TRIPSYNC BACKEND SYSTEM RUNNING`);
            console.log(`📡 URL: http://localhost:${PORT}`);
            console.log(`🌐 API Base: http://localhost:${PORT}/api/v1`);
            console.log(`🕒 Started at: ${new Date().toLocaleString()}`);
            console.log(`=======================================================`);
        });

        process.on('unhandledRejection', (err) => {
            console.error('[Process] Unhandled Rejection:', err);
        });

        process.on('uncaughtException', (err) => {
            console.error('[Process] Uncaught Exception:', err);
        });
    } catch (error) {
        console.error('[Process] Fatal startup error:', error.message);
        process.exit(1);
    }
};

startServer();
