const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    relationship: {
        type: String,
        required: true,
        trim: true // e.g. "Spouse", "Parent", "Sibling", "Friend"
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    isPrimary: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
