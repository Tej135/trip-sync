const LocalExpert = require('../models/expert.model');
const ExpertBooking = require('../models/expertBooking.model');
const User = require('../models/user.model');
const { createOrder, verifyPaymentSignature } = require('../services/payment.service');
const { sendBookingConfirmationEmail, sendPaymentSuccessEmail, sendPaymentFailureEmail } = require('../services/email.service');

const getExperts = async (req, res) => {
    try {
        const { city, specialty } = req.query;
        const query = { idVerificationStatus: 'VERIFIED' };

        if (city) query.city = new RegExp(city.trim(), 'i');
        if (specialty) query.specialty = specialty;

        const experts = await LocalExpert.find(query)
            .populate('user', 'name avatar bio explorerLevel')
            .sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: experts.length,
            data: experts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getExpertById = async (req, res) => {
    try {
        const expert = await LocalExpert.findById(req.params.id)
            .populate('user', 'name avatar bio explorerLevel');

        if (!expert) {
            return res.status(404).json({ success: false, message: 'Local expert not found' });
        }

        res.status(200).json({ success: true, data: expert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Book a local expert tour (Creates Razorpay order)
const bookExpertTour = async (req, res) => {
    try {
        const { expertId, tourTitle, bookingDate, timeSlot, personsCount = 1, travelerNotes } = req.body;

        const expert = await LocalExpert.findById(expertId);
        if (!expert) {
            return res.status(404).json({ success: false, message: 'Local expert not found' });
        }

        const tour = expert.offeredTours.find(t => t.title === tourTitle) || expert.offeredTours[0];
        const basePrice = tour ? tour.priceInr : (expert.hourlyRateInr * 3);
        const totalAmount = basePrice * parseInt(personsCount);

        const commissionFee = Math.round(totalAmount * 0.12); // 12% platform commission
        const expertEarnings = totalAmount - commissionFee;

        // Razorpay order
        const order = await createOrder(totalAmount, `exp_${req.user._id}_${Date.now()}`, {
            expertId: expert._id.toString(),
            tourTitle: tour.title
        });

        const booking = await ExpertBooking.create({
            traveler: req.user._id,
            expert: expert._id,
            tourTitle: tour.title,
            bookingDate: new Date(bookingDate),
            timeSlot: timeSlot || '08:00 AM - 11:00 AM',
            personsCount: parseInt(personsCount),
            totalAmount,
            platformCommissionFee: commissionFee,
            expertEarnings,
            paymentStatus: 'PENDING',
            razorpayOrderId: order.id,
            travelerNotes: travelerNotes || ''
        });

        res.status(201).json({
            success: true,
            message: 'Booking initiated. Please complete payment.',
            data: {
                booking,
                paymentOrder: order
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Confirm payment for tour booking
const verifyBookingPayment = async (req, res) => {
    try {
        const { bookingId, orderId, paymentId, signature } = req.body;

        const booking = await ExpertBooking.findById(bookingId).populate('expert').populate('traveler');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking record not found' });
        }

        const isValid = verifyPaymentSignature(orderId, paymentId, signature);
        if (!isValid) {
            booking.paymentStatus = 'FAILED';
            await booking.save();

            if (req.user?.email) {
                sendPaymentFailureEmail(
                    req.user.email,
                    req.user.name,
                    booking.totalAmount,
                    `Local Expert Tour: ${booking.tourTitle}`,
                    'Payment signature verification failed'
                ).catch(err => console.error('[ExpertController] Failure email error:', err.message));
            }

            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        booking.paymentStatus = 'PAID';
        booking.razorpayPaymentId = paymentId;
        booking.razorpaySignature = signature;
        booking.bookingStatus = 'CONFIRMED';
        await booking.save();

        // Increment expert total bookings
        await LocalExpert.findByIdAndUpdate(booking.expert._id, { $inc: { totalBookings: 1 } });

        // Dispatch confirmation and payment receipt emails
        await sendBookingConfirmationEmail(req.user.email, {
            tourTitle: booking.tourTitle,
            bookingDate: booking.bookingDate,
            totalAmount: booking.totalAmount
        });

        sendPaymentSuccessEmail(
            req.user.email,
            req.user.name,
            booking.totalAmount,
            `Local Expert Tour: ${booking.tourTitle}`,
            paymentId
        ).catch(err => console.error('[ExpertController] Success email error:', err.message));

        res.status(200).json({
            success: true,
            message: 'Tour booking confirmed with local expert!',
            data: booking
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getExperts,
    getExpertById,
    bookExpertTour,
    verifyBookingPayment
};
