const express = require('express');
const router = express.Router();
const { sendChatMessage } = require('../controllers/chatbot.controller');
const { optionalProtect } = require('../middlewares/auth.middleware');

router.post('/', optionalProtect, sendChatMessage);
router.post('/message', optionalProtect, sendChatMessage);

module.exports = router;
