const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema({
    sourceCity: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    sourceStationCode: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    destinationCity: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    destinationStationCode: {
        type: String,
        trim: true,
        uppercase: true,
        default: ''
    },
    mode: {
        type: String,
        enum: ['TRAIN', 'FLIGHT', 'BUS', 'FERRY', 'CAB'],
        required: true,
        index: true
    },
    operatorName: {
        type: String,
        required: true,
        trim: true
    },
    routeCode: {
        type: String,
        trim: true,
        default: ''
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    stopsCount: {
        type: Number,
        default: 0
    },
    stops: [{
        type: String
    }],
    distanceKm: {
        type: Number,
        required: true
    },
    carbonKgPerPassenger: {
        type: Number,
        required: true
    },
    isGreenChoice: {
        type: Boolean,
        default: false
    },
    classes: [{
        className: { type: String, required: true }, // e.g. "3rd AC", "Sleeper", "Economy", "Volvo AC"
        fare: { type: Number, required: true },
        availableSeats: { type: Number, default: 24 },
        perks: [{ type: String }]
    }],
    polyline: {
        type: {
            type: String,
            enum: ['LineString'],
            default: 'LineString'
        },
        coordinates: {
            type: [[Number]], // [[lng, lat], [lng, lat], ...]
            required: true
        }
    },
    bookingGateway: {
        provider: { type: String, default: 'IRCTC' },
        deepLinkUrl: { type: String, default: '' },
        apiParams: { type: Map, of: String }
    }
}, { timestamps: true });

transportRouteSchema.index({ polyline: '2dsphere' });
transportRouteSchema.index({ sourceCity: 1, destinationCity: 1, mode: 1 });

module.exports = mongoose.model('TransportRoute', transportRouteSchema);
