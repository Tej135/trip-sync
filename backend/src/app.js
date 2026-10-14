const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Core middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CORS configuration for frontend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'online',
        system: 'TripSync Enterprise Core API',
        timestamp: new Date().toISOString()
    });
});

// API Routes Mounting (All under /api/v1/)
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/transport', require('./routes/transport.routes'));
app.use('/api/v1/places', require('./routes/place.routes'));
app.use('/api/v1/reviews', require('./routes/review.routes'));
app.use('/api/v1/trips', require('./routes/trip.routes'));
app.use('/api/v1/itinerary', require('./routes/itinerary.routes'));
app.use('/api/v1/itineraries', require('./routes/itinerary.routes'));
app.use('/api/v1/accommodations', require('./routes/accommodation.routes'));
app.use('/api/v1/restaurants', require('./routes/restaurant.routes'));
app.use('/api/v1/stories', require('./routes/story.routes'));
app.use('/api/v1/experts', require('./routes/expert.routes'));
app.use('/api/v1/events', require('./routes/event.routes'));
app.use('/api/v1/expenses', require('./routes/expense.routes'));
app.use('/api/v1/emergency', require('./routes/emergency.routes'));
app.use('/api/v1/packing', require('./routes/packing.routes'));
app.use('/api/v1/compare', require('./routes/compare.routes'));
app.use('/api/v1/booklet', require('./routes/booklet.routes'));
app.use('/api/v1/chat', require('./routes/chatbot.routes'));

// Fallback 404 handler for unknown routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.originalUrl} not found on this server.`
    });
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
