const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    specialty: {
        type: String,
        required: true,
        enum: [
            'Heritage Walk Historian',
            'Photography & Golden-Hour Mentor',
            'Street Food Walk Curator',
            'Trekking & Adventure Sherpa',
            'Wildlife & Birding Naturalist'
        ]
    },
    bio: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        default: 3
    },
    hourlyRateInr: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 4.8
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    idVerificationStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED'],
        default: 'VERIFIED'
    },
    idDocumentType: {
        type: String,
        default: 'Govt ID / Guide License'
    },
    languages: [{
        type: String
    }],
    offeredTours: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        durationHours: { type: Number, default: 3 },
        priceInr: { type: Number, required: true },
        meetingPoint: { type: String, required: true },
        maxGroupSize: { type: Number, default: 8 }
    }]
}, { timestamps: true });

expertSchema.index({ city: 1, specialty: 1 });

module.exports = mongoose.model('LocalExpert', expertSchema);
