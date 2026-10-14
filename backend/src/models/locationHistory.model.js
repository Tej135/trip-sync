const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
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
    accuracy: {
        type: Number,
        default: 10
    },
    dwellStart: {
        type: Date,
        default: Date.now
    },
    dwellEnd: {
        type: Date,
        default: Date.now
    },
    dwellMinutes: {
        type: Number,
        default: 0
    },
    nearestPlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    },
    distanceMeters: {
        type: Number
    }
}, { timestamps: true });

locationHistorySchema.index({ location: '2dsphere' });
locationHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('LocationHistory', locationHistorySchema);
