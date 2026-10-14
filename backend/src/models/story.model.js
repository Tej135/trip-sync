const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
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
    mediaUrl: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ['VIDEO', 'PHOTO'],
        default: 'VIDEO'
    },
    thumbnailUrl: {
        type: String,
        default: ''
    },
    durationSeconds: {
        type: Number,
        default: 30,
        min: 5,
        max: 60
    },
    caption: {
        type: String,
        trim: true,
        default: ''
    },
    groundRealityNotes: {
        type: String,
        trim: true,
        default: '' // e.g. "Water level high today; queue ~15 mins"
    },
    verificationTier: {
        type: String,
        enum: ['TIER_1_VERIFIED', 'TIER_2_LIKELY'],
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    viewsCount: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year expiry
    }
}, { timestamps: true });

// Auto-expire index
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
storySchema.index({ place: 1, createdAt: -1 });

module.exports = mongoose.model('Story', storySchema);
