const express = require('express');
const router = express.Router();
const { compareDestinations } = require('../controllers/compare.controller');

router.get('/destinations', compareDestinations);

module.exports = router;
