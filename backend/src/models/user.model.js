const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['TRAVELER', 'PRO_TRAVELER', 'CREATOR', 'LOCAL_EXPERT', 'MODERATOR', 'ADMIN'],
        default: 'TRAVELER'
    },
    avatar: {
        type: String,
        default: 'https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png'
    },
    bio: {
        type: String,
        default: 'Passionate globetrotter exploring uncharted trails and authentic flavors.'
    },
    homeCity: {
        type: String,
        default: 'New Delhi'
    },
    languagesSpoken: {
        type: [String],
        default: ['English', 'Hindi']
    },
    explorerLevel: {
        type: String,
        enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'],
        default: 'BRONZE'
    },
    personalityArchetype: {
        type: String,
        enum: ['EXPLORER', 'RELAXED', 'CONTENT_CREATOR', 'FAMILY', 'BUDGET_BACKPACKER'],
        default: 'EXPLORER'
    },
    dietaryPreference: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain'],
        default: 'Vegetarian'
    },
    wheelchairAssistance: {
        type: Boolean,
        default: false
    },
    badges: [{
        name: { type: String, required: true },
        description: { type: String },
        awardedAt: { type: Date, default: Date.now },
        icon: { type: String }
    }],
    verifiedReviewsCount: {
        type: Number,
        default: 0
    },
    isPro: {
        type: Boolean,
        default: false
    },
    proExpiresAt: {
        type: Date
    },
    upiId: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Instance method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.comparePassword = userSchema.methods.matchPassword;

// Method to update explorer level based on verified reviews count
userSchema.methods.calculateExplorerLevel = function() {
    const count = this.verifiedReviewsCount || 0;
    if (count >= 100) this.explorerLevel = 'DIAMOND';
    else if (count >= 51) this.explorerLevel = 'PLATINUM';
    else if (count >= 21) this.explorerLevel = 'GOLD';
    else if (count >= 6) this.explorerLevel = 'SILVER';
    else this.explorerLevel = 'BRONZE';
    return this.explorerLevel;
};

module.exports = mongoose.model('User', userSchema);
