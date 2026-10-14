const express = require('express');
const router = express.Router();
const {
    generateSmartPackingList,
    getPackingList,
    togglePackingItem
} = require('../controllers/packing.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/generate', protect, generateSmartPackingList);
router.get('/', protect, getPackingList);
router.post('/toggle', protect, togglePackingItem);

module.exports = router;
