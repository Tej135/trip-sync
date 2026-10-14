const Review = require('../models/review.model');
const Place = require('../models/place.model');
const User = require('../models/user.model');
const LocationHistory = require('../models/locationHistory.model');
const { calculateDistanceMeters, extractExifGps, verifyPhotoLocation } = require('../services/geo.service');
const { getFileUrl } = require('../services/storage.service');

/**
 * Submit a review with automated Tier 1 (GPS Dwell) or Tier 2 (EXIF Geotag) verification
 */
const createReview = async (req, res) => {
    try {
        const { placeId, rating, title, comment, subRatings, proofType } = req.body;

        if (!placeId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Place ID, rating (1-5), and review comment are required'
            });
        }

        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ success: false, message: 'Place not found' });
        }

        // Anti-Fraud Control 1: Maximum 3 reviews per user per 24 hours
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyCount = await Review.countDocuments({
            user: req.user._id,
            createdAt: { $gte: last24h }
        });
        if (dailyCount >= 3) {
            return res.status(422).json({
                success: false,
                message: 'Anti-Fraud limit reached: Maximum 3 reviews allowed per traveler within 24 hours.'
            });
        }

        let verificationTier = 'TIER_3_UNVERIFIED';
        let verifiedProofType = 'NONE';
        const proofMetadata = {
            dwellMinutes: 0,
            distanceMeters: 0,
            photoUrl: '',
            exifCoordinates: []
        };

        const placeLng = place.location.coordinates[0];
        const placeLat = place.location.coordinates[1];

        // 🟢 Check Tier 1: Physical GPS Dwell History (within 250m & >= 15 minutes)
        const recentDwellRecord = await LocationHistory.findOne({
            user: req.user._id,
            dwellMinutes: { $gte: 15 },
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [placeLng, placeLat] },
                    $maxDistance: 250
                }
            }
        });

        if (recentDwellRecord) {
            verificationTier = 'TIER_1_VERIFIED';
            verifiedProofType = 'GPS_DWELL';
            proofMetadata.dwellMinutes = recentDwellRecord.dwellMinutes;
            proofMetadata.distanceMeters = recentDwellRecord.distanceMeters || 120;
        }

        // 🔶 Check Tier 2: EXIF Photo Metadata from uploaded proof photo
        if (verificationTier === 'TIER_3_UNVERIFIED' && req.file) {
            const exifData = await extractExifGps(req.file.path);
            if (exifData) {
                const geoCheck = verifyPhotoLocation(
                    exifData.latitude,
                    exifData.longitude,
                    placeLat,
                    placeLng,
                    500 // within 500 meters
                );

                if (geoCheck.isValid) {
                    verificationTier = 'TIER_2_LIKELY';
                    verifiedProofType = 'EXIF_PHOTO';
                    proofMetadata.distanceMeters = geoCheck.distanceMeters;
                    proofMetadata.exifCoordinates = [exifData.longitude, exifData.latitude];
                    proofMetadata.exifTimestamp = exifData.timestamp;
                }
            }
            proofMetadata.photoUrl = getFileUrl(req.file.filename, req);
        }

        // Parse subRatings if sent as JSON string via FormData
        let parsedSubRatings = { scenery: 5, cleanliness: 4, value: 4, crowd: 3, safety: 5 };
        if (subRatings) {
            parsedSubRatings = typeof subRatings === 'string' ? JSON.parse(subRatings) : subRatings;
        }

        const review = await Review.create({
            user: req.user._id,
            place: place._id,
            rating: Number(rating),
            title: title || '',
            comment,
            subRatings: parsedSubRatings,
            verificationTier,
            proofType: verifiedProofType,
            proofMetadata,
            photos: proofMetadata.photoUrl ? [{ url: proofMetadata.photoUrl }] : []
        });

        // Recalculate Place official aggregate rating ONLY from Tier 1 & Tier 2 verified reviews!
        const verifiedReviews = await Review.find({
            place: place._id,
            verificationTier: { $in: ['TIER_1_VERIFIED', 'TIER_2_LIKELY'] }
        });

        const totalReviewsCount = await Review.countDocuments({ place: place._id });
        const totalVerifiedCount = verifiedReviews.length;

        let newAvgRating = place.averageRating;
        if (totalVerifiedCount > 0) {
            const sumRating = verifiedReviews.reduce((sum, r) => sum + r.rating, 0);
            newAvgRating = parseFloat((sumRating / totalVerifiedCount).toFixed(1));
        }

        await Place.findByIdAndUpdate(place._id, {
            averageRating: newAvgRating,
            totalReviews: totalReviewsCount,
            totalVerifiedReviews: totalVerifiedCount
        });

        // If verified, update traveler explorer level & check badges
        if (verificationTier === 'TIER_1_VERIFIED' || verificationTier === 'TIER_2_LIKELY') {
            const user = await User.findById(req.user._id);
            user.verifiedReviewsCount = (user.verifiedReviewsCount || 0) + 1;
            user.calculateExplorerLevel();

            // Award Pioneer badge if first verified review of this place
            if (totalVerifiedCount === 1) {
                user.badges.push({
                    name: 'Pioneer Explorer',
                    description: `First verified traveler to review ${place.name}`,
                    icon: '🧭'
                });
            }

            await user.save();
        }

        res.status(201).json({
            success: true,
            message: verificationTier === 'TIER_1_VERIFIED'
                ? 'Review published as 🟢 TIER 1 VERIFIED TRAVELER (GPS dwell confirmed)!'
                : (verificationTier === 'TIER_2_LIKELY'
                    ? 'Review published as 🔶 TIER 2 LIKELY VISITED (EXIF geotag verified)!'
                    : 'Review published as ⚪ UNVERIFIED (does not alter official rating without proof).'),
            data: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get all reviews for a place with tier sorting
 */
const getPlaceReviews = async (req, res) => {
    try {
        const { placeId } = req.params;
        const reviews = await Review.find({ place: placeId })
            .populate('user', 'name avatar explorerLevel badges')
            .sort({ verificationTier: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Upvote helpful review
 */
const upvoteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        const userId = req.user._id;
        const alreadyUpvoted = review.upvotes.some(id => id.toString() === userId.toString());

        if (alreadyUpvoted) {
            review.upvotes = review.upvotes.filter(id => id.toString() !== userId.toString());
        } else {
            review.upvotes.push(userId);
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: alreadyUpvoted ? 'Upvote removed' : 'Review upvoted',
            upvotesCount: review.upvotes.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createReview,
    getPlaceReviews,
    upvoteReview
};
