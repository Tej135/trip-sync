const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['CLOTHING', 'GEAR', 'DOCUMENTS', 'TOILETRIES', 'MEDICINE', 'ELECTRONICS', 'OTHER'],
        default: 'CLOTHING'
    },
    isPacked: {
        type: Boolean,
        default: false
    },
    weatherOrActivityReason: {
        type: String,
        default: ''
    }
});

const packingListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip'
    },
    destination: {
        type: String,
        default: ''
    },
    destinationType: {
        type: String,
        enum: ['BEACH', 'HERITAGE_CITIES', 'COLD_HILLS', 'TREKKING_ADVENTURE', 'GENERAL'],
        default: 'GENERAL'
    },
    items: [packingItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('PackingList', packingListSchema);
