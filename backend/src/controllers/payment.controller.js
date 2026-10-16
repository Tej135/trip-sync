const { createOrder, verifyPaymentSignature, getKeyId } = require('../services/payment.service');
const emailService = require('../services/email.service');

/**
 * Initiate a generic Razorpay Payment Order
 * POST /api/v1/payment/create-order
 */
const createPaymentOrder = async (req, res) => {
    try {
        const { amount, receipt, notes = {} } = req.body;

        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A valid payment amount is required'
            });
        }

        const receiptId = receipt || `rcpt_${Date.now()}`;
        const order = await createOrder(parseFloat(amount), receiptId, {
            ...notes,
            userId: req.user?._id?.toString() || 'guest'
        });

        res.status(200).json({
            success: true,
            message: 'Razorpay order created successfully',
            data: {
                ...order,
                razorpayKeyId: getKeyId()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Verify Razorpay Payment Signature and dispatch notification emails
 * POST /api/v1/payment/verify
 */
const verifyPayment = async (req, res) => {
    try {
        const { orderId, paymentId, signature, amount, itemOrPlan = 'TripSync Booking / Service' } = req.body;

        if (!orderId || !paymentId) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and Payment ID are required for verification'
            });
        }

        const isValid = verifyPaymentSignature(orderId, paymentId, signature);
        const userEmail = req.user?.email;
        const userName = req.user?.name || 'Traveler';

        if (!isValid) {
            if (userEmail) {
                emailService.sendPaymentFailureEmail(
                    userEmail,
                    userName,
                    amount || 0,
                    itemOrPlan,
                    'Payment signature verification failed'
                ).catch(err => console.error('[PaymentController] Failure email error:', err.message));
            }

            return res.status(400).json({
                success: false,
                message: 'Payment verification failed: invalid signature'
            });
        }

        // Send payment success confirmation email
        if (userEmail) {
            emailService.sendPaymentSuccessEmail(
                userEmail,
                userName,
                amount || 0,
                itemOrPlan,
                paymentId
            ).catch(err => console.error('[PaymentController] Success email error:', err.message));
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully!',
            data: {
                orderId,
                paymentId,
                status: 'PAID'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get Public Razorpay Configuration Key
 * GET /api/v1/payment/config
 */
const getPaymentConfig = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            keyId: getKeyId(),
            currency: 'INR'
        }
    });
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getPaymentConfig
};
