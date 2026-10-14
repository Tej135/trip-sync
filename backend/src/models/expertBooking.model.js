const mongoose = require('mongoose');

const expertBookingSchema = new mongoose.Schema({
    traveler: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LocalExpert',
        required: true
    },
    tourTitle: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        default: '08:00 AM - 11:00 AM'
    },
    personsCount: {
        type: Number,
        default: 1,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true
    },
    platformCommissionFee: {
        type: Number,
        default: 0 // 12% commission
    },
    expertEarnings: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'REFUNDED'],
        default: 'PENDING'
    },
    razorpayOrderId: {
        type: String,
        default: ''
    },
    razorpayPaymentId: {
        type: String,
        default: ''
    },
    razorpaySignature: {
        type: String,
        default: ''
    },
    bookingStatus: {
        type: String,
        enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
        default: 'CONFIRMED'
    },
    travelerNotes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

expertBookingSchema.index({ traveler: 1, bookingDate: -1 });

module.exports = mongoose.model('ExpertBooking', expertBookingSchema);
