const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
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
    cuisines: [{
        type: String
    }],
    famousDishes: [{
        dishName: { type: String, required: true },
        isVeg: { type: Boolean, default: true },
        isVegan: { type: Boolean, default: false },
        isJainAvailable: { type: Boolean, default: false },
        price: { type: Number, default: 200 },
        description: { type: String, default: '' },
        photoUrl: { type: String, default: '' }
    }],
    priceForTwo: {
        type: Number,
        default: 600
    },
    rating: {
        type: Number,
        default: 4.5
    },
    photoUrls: [{
        type: String
    }],
    zomatoUrl: {
        type: String,
        default: ''
    },
    swiggyUrl: {
        type: String,
        default: ''
    },
    googleMapsUrl: {
        type: String,
        default: ''
    },
    nearbyPlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
    }]
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ city: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
