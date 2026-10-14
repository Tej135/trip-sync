const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
        index: true
    },
    payer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: String,
        enum: ['TRANSPORT', 'LODGING', 'FOOD', 'TICKETS', 'EXPERIENCE', 'EMERGENCY', 'OTHER'],
        default: 'FOOD'
    },
    splitType: {
        type: String,
        enum: ['EQUAL', 'EXACT', 'PERCENTAGE'],
        default: 'EQUAL'
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        shareAmount: {
            type: Number,
            required: true
        },
        isSettled: {
            type: Boolean,
            default: false
        },
        settledAt: {
            type: Date
        }
    }],
    receiptUrl: {
        type: String,
        default: ''
    },
    expenseDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

expenseSchema.index({ trip: 1, expenseDate: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
