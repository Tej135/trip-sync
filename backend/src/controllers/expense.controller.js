const Expense = require('../models/expense.model');
const Trip = require('../models/trip.model');
const User = require('../models/user.model');

/**
 * Debt Simplification Algorithm
 * Minimizes total cash transactions between friends (Splitwise style)
 */
const simplifyDebts = (balances) => {
    // balances is an array: [{ user: { _id, name, upiId }, netBalance: number }]
    // positive netBalance = is owed money (creditor)
    // negative netBalance = owes money (debtor)

    const creditors = [];
    const debtors = [];

    balances.forEach(b => {
        if (b.netBalance > 0.01) {
            creditors.push({ ...b, amount: b.netBalance });
        } else if (b.netBalance < -0.01) {
            debtors.push({ ...b, amount: Math.abs(b.netBalance) });
        }
    });

    const settlements = [];

    let cIdx = 0;
    let dIdx = 0;

    while (cIdx < creditors.length && dIdx < debtors.length) {
        const creditor = creditors[cIdx];
        const debtor = debtors[dIdx];

        const settlementAmount = Math.min(creditor.amount, debtor.amount);
        const roundedAmount = Math.round(settlementAmount * 100) / 100;

        if (roundedAmount > 0) {
            // Generate UPI payment deep link
            const payeeUpi = creditor.user.upiId || 'tripsync@okaxis';
            const upiLink = `upi://pay?pa=${encodeURIComponent(payeeUpi)}&pn=${encodeURIComponent(creditor.user.name)}&am=${roundedAmount}&cu=INR&tn=TripSync Settlement`;

            settlements.push({
                fromUser: debtor.user,
                toUser: creditor.user,
                amount: roundedAmount,
                upiLink,
                isSettled: false
            });
        }

        creditor.amount -= settlementAmount;
        debtor.amount -= settlementAmount;

        if (creditor.amount <= 0.01) cIdx++;
        if (debtor.amount <= 0.01) dIdx++;
    }

    return settlements;
};

/**
 * Add a new shared expense
 */
const addExpense = async (req, res) => {
    try {
        const { tripId, title, description, amount, category, splitType = 'EQUAL', participantIds, exactShares } = req.body;
        const resolvedTitle = title || description || 'Shared Trip Expense';

        const trip = await Trip.findById(tripId).populate('collaborators.user');
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const totalAmount = parseFloat(amount);
        let participants = [];

        if (splitType === 'EQUAL') {
            const userList = participantIds && participantIds.length > 0
                ? participantIds
                : [trip.owner, ...(trip.collaborators.map(c => c.user._id || c.user))];

            const perPersonShare = Math.round((totalAmount / userList.length) * 100) / 100;

            participants = userList.map(uid => ({
                user: uid,
                shareAmount: perPersonShare,
                isSettled: uid.toString() === req.user._id.toString() // Payer is already settled
            }));
        } else if (splitType === 'EXACT' && exactShares) {
            participants = exactShares.map(s => ({
                user: s.userId,
                shareAmount: parseFloat(s.amount),
                isSettled: s.userId.toString() === req.user._id.toString()
            }));
        }

        const expense = await Expense.create({
            trip: tripId,
            payer: req.user._id,
            title: resolvedTitle,
            amount: totalAmount,
            category: category || 'FOOD',
            splitType,
            participants,
            expenseDate: new Date()
        });

        const populated = await Expense.findById(expense._id)
            .populate('payer', 'name avatar')
            .populate('participants.user', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Expense added and split calculated',
            data: populated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all expenses and debt simplification summary for a trip
 */
const getTripExpensesAndSummary = async (req, res) => {
    try {
        const { tripId } = req.params;
        const trip = await Trip.findById(tripId)
            .populate('owner', 'name avatar upiId')
            .populate('collaborators.user', 'name avatar upiId');

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        const expenses = await Expense.find({ trip: tripId })
            .populate('payer', 'name avatar upiId')
            .populate('participants.user', 'name avatar upiId')
            .sort({ expenseDate: -1 });

        // Collect all distinct members
        const membersMap = new Map();
        membersMap.set(trip.owner._id.toString(), trip.owner);
        trip.collaborators.forEach(c => {
            if (c.user) membersMap.set(c.user._id.toString(), c.user);
        });

        // Calculate net balances
        const netBalancesMap = new Map();
        for (const [id] of membersMap) {
            netBalancesMap.set(id, 0);
        }

        let totalTripSpent = 0;
        const categoryBreakdown = {};

        expenses.forEach(exp => {
            totalTripSpent += exp.amount;
            categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + exp.amount;

            const payerId = exp.payer._id.toString();
            // Payer gets credited full amount
            netBalancesMap.set(payerId, (netBalancesMap.get(payerId) || 0) + exp.amount);

            // Participants get debited their share
            exp.participants.forEach(p => {
                const partId = p.user._id.toString();
                netBalancesMap.set(partId, (netBalancesMap.get(partId) || 0) - p.shareAmount);
            });
        });

        const balancesArray = [];
        for (const [userId, netBalance] of netBalancesMap.entries()) {
            balancesArray.push({
                user: membersMap.get(userId),
                netBalance: Math.round(netBalance * 100) / 100
            });
        }

        // Run debt simplification algorithm
        const simplifiedSettlements = simplifyDebts(balancesArray);

        res.status(200).json({
            success: true,
            data: {
                expenses,
                totalTripSpent,
                categoryBreakdown,
                balances: balancesArray,
                settlements: simplifiedSettlements
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Mark participant share as settled
 */
const markShareSettled = async (req, res) => {
    try {
        const { expenseId, participantUserId } = req.body;
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const participant = expense.participants.find(p => p.user.toString() === participantUserId);
        if (participant) {
            participant.isSettled = true;
            participant.settledAt = new Date();
            await expense.save();
        }

        res.status(200).json({
            success: true,
            message: 'Expense share marked as settled'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addExpense,
    getTripExpensesAndSummary,
    markShareSettled
};
