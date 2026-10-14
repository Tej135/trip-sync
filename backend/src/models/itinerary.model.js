const mongoose = require('mongoose');

const itinerarySlotSchema = new mongoose.Schema({
    slotType: {
        type: String,
        enum: ['MEAL', 'TRANSIT', 'PLACE_VISIT', 'REST_BUFFER', 'EVENT', 'LOCAL_EXPERT'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true // e.g. "09:00 AM"
    },
    endTime: {
        type: String,
        required: true // e.g. "11:30 AM"
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    transitDetails: {
        mode: { type: String, default: 'WALK' }, // AUTO, CAB, METRO, WALK, BUS
        distanceKm: { type: Number, default: 1 },
        estimatedFare: { type: Number, default: 0 },
        deepLink: { type: String, default: '' },
        instructions: { type: String, default: '' }
    },
    mealDetails: {
        recommendedDish: { type: String, default: '' },
        cuisine: { type: String, default: '' },
        zomatoUrl: { type: String, default: '' }
    },
    notes: {
        type: String,
        default: ''
    },
    cost: {
        type: Number,
        default: 0
    },
    safetyCheck: {
        isAfterDark: { type: Boolean, default: false },
        warning: { type: String, default: '' }
    }
});

const dayItinerarySchema = new mongoose.Schema({
    dayNumber: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    theme: {
        type: String,
        default: 'Exploration & Heritage'
    },
    weatherSummary: {
        condition: { type: String, default: 'Sunny' },
        tempC: { type: Number, default: 28 },
        rainProbability: { type: Number, default: 10 },
        aqi: { type: Number, default: 85 }
    },
    totalDistanceKm: {
        type: Number,
        default: 0
    },
    estimatedDayCost: {
        type: Number,
        default: 0
    },
    slots: [itinerarySlotSchema]
});

const itinerarySchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
        unique: true,
        index: true
    },
    days: [dayItinerarySchema],
    totalEstimatedCost: {
        type: Number,
        default: 0
    },
    isWithinBudget: {
        type: Boolean,
        default: true
    },
    whatIfHistory: [{
        changeType: { type: String }, // 'EXTEND_DAY', 'BUDGET_INCREASE', 'WAKE_UP_LATE', 'RAIN_SWAP'
        prompt: { type: String },
        appliedAt: { type: Date, default: Date.now },
        description: { type: String }
    }],
    aiGeneratedNotes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);
