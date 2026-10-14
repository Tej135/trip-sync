const mongoose = require('mongoose');

const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to create a blacklist entry"],
        unique: true
    }
}, {
    timestamps: true
});

tokenBlackListSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 3 } // Automatically expire after 3 days
);

const tokenBlackListModel = mongoose.model('tokenBlackList', tokenBlackListSchema);

module.exports = tokenBlackListModel;
