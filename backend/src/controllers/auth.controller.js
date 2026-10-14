const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');
const tokenBlackListModel = require('../models/blackList.model');

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
                message: 'Name, email, and password are required',
                status: 'failed'
            });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
                status: 'failed'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'An account with this email already exists',
                status: 'failed'
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

        // Dispatch Welcome / Registration Email asynchronously
        emailService.sendRegistrationEmail(user.email, user.name).catch(err => {
            console.error('[AuthController] Failed to send registration email:', err.message);
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            status: 'failed'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing Fields, Please Enter all Fields!',
                status: 'failed'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. User not found.',
                status: 'failed'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Password incorrect.',
                status: 'failed'
            });
        }

        sendTokenResponse(user, 200, res, 'User Logged in Successfully');

        // Dispatch Login Notification Email
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        emailService.sendLoginEmail(user.email, user.name, new Date().toLocaleString(), clientIp).catch(err => {
            console.error('[AuthController] Failed to send login email:', err.message);
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            status: 'failed'
        });
    }
};

const logout = async (req, res) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token is not found',
            status: 'failed'
        });
    }

    try {
        await tokenBlackListModel.create({ token });
    } catch (err) {
        if (err.code !== 11000) {
            console.error('[AuthController] Blacklist error:', err.message);
        }
    }

    res.clearCookie('token');
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true
    });

    return res.status(200).json({
        success: true,
        message: 'User Logged out Successfully',
        status: 'success'
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
        delete updates.role;

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
    userRegister: register,
    login,
    userLogin: login,
    logout,
    userLogout: logout,
    getMe,
    updateProfile
};
