const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const tokenBlackListModel = require('../models/blackList.model');

const protect = async (req, res, next) => {
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access, token is missing'
        });
    }

    // Check if token has been blacklisted (logged out)
    const tokenBlackListed = await tokenBlackListModel.findOne({ token }).lean();
    if (tokenBlackListed) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access, token is invalid or logged out'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access, user not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.name === 'TokenExpiredError'
                ? 'Session expired. Please log in again.'
                : 'Unauthorized access, token is invalid'
        });
    }
};

// System / Admin middleware (from template)
const authSystemMiddleware = async (req, res, next) => {
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized access, token is missing' });
    }

    const tokenBlackListed = await tokenBlackListModel.findOne({ token }).lean();
    if (tokenBlackListed) {
        return res.status(401).json({ success: false, message: 'Unauthorized access, token is invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('+systemUser');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized access, user not found' });
        }
        if (!user.systemUser && user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Forbidden access, you are not a system/admin user' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Unauthorized access, token is invalid' });
    }
};

// Optional protect for endpoints accessible by both guests and logged-in users
const optionalProtect = async (req, res, next) => {
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const tokenBlackListed = await tokenBlackListModel.findOne({ token }).lean();
        if (tokenBlackListed) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
            req.user = user;
        }
    } catch (err) {
        // Silently continue without user
    }
    next();
};

module.exports = {
    protect,
    authMiddleware: protect,
    authSystemMiddleware,
    optionalProtect
};
