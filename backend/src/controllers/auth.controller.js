const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '3d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax'
    };

    res.cookie('token', token, cookieOptions);

    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;

    res.status(statusCode).json({
        success: true,
        message,
        token,
        data: userObj
    });
};

const register = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword, role, personalityArchetype, dietaryPreference } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone: phone || '',
            password,
            role: role || 'TRAVELER',
            personalityArchetype: personalityArchetype || 'EXPLORER',
            dietaryPreference: dietaryPreference || 'Vegetarian'
        });

        sendTokenResponse(user, 201, res, 'Registration successful! Welcome to TripSync.');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both email and password'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. User not found.'
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Password incorrect.'
            });
        }

        sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password;
        delete updates.role; // Role cannot be escalated by traveler directly

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    updateProfile
};
