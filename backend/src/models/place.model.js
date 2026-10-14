const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Place name is required'], 
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'] 
    },
    category: {
        type: String,
        enum: ['HERITAGE', 'NATURE', 'TEMPLE', 'VIEWPOINT', 'FOOD', 'ADVENTURE'],
        required: true
    },
    location: {
        type: { 
            type: String, 
            enum: ['Point'], 
            default: 'Point' 
        },
        coordinates: { 
            type: [Number], // [longitude, latitude]
            required: true 
        }
    },
    city: { 
        type: String, 
        required: true,
        trim: true
    },
    state: { 
        type: String, 
        required: true,
        trim: true
    },
    address: {
        type: String,
        default: ''
    },
    photoUrls: [{ 
        type: String 
    }],
    coverPhoto: {
        type: String,
        default: ''
    },
    averageRating: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: { 
        type: Number, 
        default: 0 
    },
    totalVerifiedReviews: { 
        type: Number, 
        default: 0 
    },
    priceIndicator: {
        type: String,
        enum: ['₹', '₹₹', '₹₹₹', 'FREE'],
        default: '₹'
    },
    recommendedDurationMinutes: { 
        type: Number, 
        default: 120 
    },
    bestTimeToVisit: { 
        type: String,
        default: 'Early Morning'
    },
    timings: {
        open: { type: String, default: '09:00 AM' },
        close: { type: String, default: '06:00 PM' }
    },
    entryFees: {
        indian: { type: Number, default: 0 },
        foreigner: { type: Number, default: 0 },
        child: { type: Number, default: 0 },
        camera: { type: Number, default: 0 }
    },
    safetyScore: {
        overall: { type: Number, default: 8.5 },
        crime: { type: Number, default: 8.5 },
        terrain: { type: Number, default: 8.5 },
        weather: { type: Number, default: 8.5 },
        medical: { type: Number, default: 8.0 },
        network: { type: Number, default: 8.0 },
        night: { type: Number, default: 7.5 },
        women: { type: Number, default: 8.5 }
    },
    creatorInfo: {
        videoAllowed: { type: Boolean, default: true },
        photoAllowed: { type: Boolean, default: true },
        tripodAllowed: { type: Boolean, default: false },
        droneZone: { 
            type: String, 
            enum: ['GREEN', 'YELLOW', 'RED'], 
            default: 'RED' 
        },
        permitRequired: { type: Boolean, default: false },
        permitDetails: { type: String, default: '' },
        authorityContact: { type: String, default: '' },
        bannedPockets: [{ type: String }],
        goldenHourRecommendation: { type: String, default: '06:00 AM - 07:30 AM & 05:00 PM - 06:15 PM' },
        bestAngles: [{
            title: { type: String },
            description: { type: String },
            coordinates: { type: [Number] } // [lng, lat]
        }]
    },
    facilities: {
        toiletAvailable: { type: Boolean, default: false },
        toiletCleanlinessScore: { type: Number, default: 3, min: 1, max: 5 },
        isToiletPaid: { type: Boolean, default: false },
        parkingAvailable: { type: Boolean, default: false },
        wheelchairAccessible: { type: Boolean, default: false },
        drinkingWaterAvailable: { type: Boolean, default: false },
        upiAccepted: { type: Boolean, default: true }
    },
    lastMileTransit: {
        directions: { type: String, default: '' },
        modes: [{ type: String }],
        parkingFee: { type: Number, default: 0 },
        walkingDistanceMeters: { type: Number, default: 100 }
    },
    crowdMetrics: {
        currentDensity: { 
            type: String, 
            enum: ['LOW', 'MODERATE', 'BUSY', 'EXTREME'], 
            default: 'MODERATE' 
        },
        hourlyEstimates: [{
            hour: { type: Number }, // 0 - 23
            densityPercentage: { type: Number } // 0 - 100
        }],
        dynamicSwapSuggestion: {
            crowdedThreshold: { type: String, default: 'EXTREME' },
            alternativePlaceSlug: { type: String, default: '' },
            reason: { type: String, default: '' }
        }
    },
    isPromoted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// GeoJSON 2dsphere index for location
placeSchema.index({ location: '2dsphere' });
placeSchema.index({ city: 1, category: 1 });
placeSchema.index({ slug: 1 });

module.exports = mongoose.model('Place', placeSchema);
