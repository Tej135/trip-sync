const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent
} = require('../controllers/event.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, authorizeRoles('ADMIN', 'MODERATOR'), createEvent);

module.exports = router;
