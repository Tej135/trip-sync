const express = require('express');
const router = express.Router();
const {
    addExpense,
    getTripExpensesAndSummary,
    markShareSettled
} = require('../controllers/expense.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', protect, addExpense);
router.get('/trip/:tripId', protect, getTripExpensesAndSummary);
router.post('/settle', protect, markShareSettled);

module.exports = router;
