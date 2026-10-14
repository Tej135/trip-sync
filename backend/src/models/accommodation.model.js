const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
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
    tier: {
        type: String,
        enum: ['BUDGET', 'MID_RANGE', 'LUXURY', 'HERITAGE', 'HOSTEL'],
        required: true,
        index: true
    },
    pricePerNight: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 4.2
    },
    amenities: [{
        type: String
    }],
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
    address: {
        type: String,
        default: ''
    },
    contactPhone: {
        type: String,
        default: ''
    },
    bookingDeepLink: {
        type: String,
        default: ''
    },
    safetyCertified: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

accommodationSchema.index({ location: '2dsphere' });
accommodationSchema.index({ city: 1, tier: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
