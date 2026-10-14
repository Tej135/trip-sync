const express = require('express');
const router = express.Router();
const {
    triggerSosPanic,
    getEmergencyContacts,
    addEmergencyContact,
    deleteEmergencyContact
} = require('../controllers/emergency.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/sos', protect, triggerSosPanic);
router.get('/contacts', protect, getEmergencyContacts);
router.post('/contacts', protect, addEmergencyContact);
router.delete('/contacts/:id', protect, deleteEmergencyContact);

module.exports = router;
