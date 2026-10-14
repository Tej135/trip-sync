const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id: ${err.value}`;
        return res.status(404).json({ success: false, message });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        const message = `Duplicate value entered for ${field}. Please use another value.`;
        return res.status(409).json({ success: false, message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({ success: false, message });
    }

    // Multer upload errors
    if (err.name === 'MulterError') {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token has expired.' });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
