const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        trim: true,
        default: ''
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true
    },
    subRatings: {
        scenery: { type: Number, min: 1, max: 5, default: 5 },
        cleanliness: { type: Number, min: 1, max: 5, default: 4 },
        value: { type: Number, min: 1, max: 5, default: 4 },
        crowd: { type: Number, min: 1, max: 5, default: 3 },
        safety: { type: Number, min: 1, max: 5, default: 5 }
    },
    verificationTier: {
        type: String,
        enum: ['TIER_1_VERIFIED', 'TIER_2_LIKELY', 'TIER_3_UNVERIFIED'],
        default: 'TIER_3_UNVERIFIED'
    },
    proofType: {
        type: String,
        enum: ['GPS_DWELL', 'EXIF_PHOTO', 'NONE'],
        default: 'NONE'
    },
    proofMetadata: {
        dwellMinutes: { type: Number, default: 0 },
        distanceMeters: { type: Number, default: 0 },
        photoUrl: { type: String, default: '' },
        exifTimestamp: { type: Date },
        exifCoordinates: { type: [Number] } // [lng, lat]
    },
    photos: [{
        url: { type: String },
        caption: { type: String }
    }],
    visitedDate: {
        type: Date,
        default: Date.now
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

// Compound index to help lookup and enforce anti-fraud checks
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ place: 1, verificationTier: 1 });

module.exports = mongoose.model('Review', reviewSchema);
