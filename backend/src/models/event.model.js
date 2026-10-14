const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    category: {
        type: String,
        enum: ['FESTIVAL', 'FAIR', 'NATURAL_PHENOMENON', 'MUSIC_CULTURE', 'HERITAGE_CELEBRATION'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    recurringMonths: [{
        type: Number // 1-12
    }],
    entryFee: {
        type: Number,
        default: 0
    },
    photoUrls: [{
        type: String
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },
    culturalSignificance: {
        type: String,
        default: ''
    },
    creatorTips: [{
        type: String
    }]
}, { timestamps: true });

eventSchema.index({ location: '2dsphere' });
eventSchema.index({ city: 1, startDate: 1 });

module.exports = mongoose.model('Event', eventSchema);
