const express = require('express');
const router = express.Router();
const { downloadOfflineBooklet } = require('../controllers/booklet.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/download/:tripId', protect, downloadOfflineBooklet);

module.exports = router;
