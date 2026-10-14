const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Trip title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    originCity: {
        type: String,
        required: true,
        trim: true
    },
    destinationCity: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    destinationState: {
        type: String,
        default: ''
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },
    dailyActiveWindow: {
        startTime: { type: String, default: '09:00 AM' },
        endTime: { type: String, default: '06:00 PM' }
    },
    totalBudget: {
        type: Number,
        required: true,
        min: 0
    },
    travelPersonality: {
        type: String,
        enum: ['EXPLORER', 'RELAXED', 'CONTENT_CREATOR', 'FAMILY', 'BUDGET_BACKPACKER'],
        default: 'EXPLORER'
    },
    budgetAllocations: {
        transit: { type: Number, default: 0 },
        accommodation: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        tickets: { type: Number, default: 0 },
        emergencyBuffer: { type: Number, default: 0 }
    },
    selectedPlaces: [{
        place: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Place',
            required: true
        },
        priority: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now }
    }],
    collaborators: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['EDITOR', 'VIEWER'],
            default: 'EDITOR'
        },
        joinedAt: { type: Date, default: Date.now }
    }],
    status: {
        type: String,
        enum: ['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
        default: 'PLANNING'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    offlineBookletPath: {
        type: String,
        default: ''
    }
}, { timestamps: true });

tripSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model('Trip', tripSchema);
