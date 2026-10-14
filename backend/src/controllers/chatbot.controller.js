const { generateChatResponse } = require('../services/ai.service');

const sendChatMessage = async (req, res) => {
    try {
        const { message, context = {} } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message text is required' });
        }

        const reply = await generateChatResponse(message, {
            ...context,
            userName: req.user?.name,
            userRole: req.user?.role
        });

        res.status(200).json({
            success: true,
            reply
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendChatMessage
};
