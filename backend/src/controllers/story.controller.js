const Story = require('../models/story.model');
const Place = require('../models/place.model');
const Review = require('../models/review.model');
const { getFileUrl } = require('../services/storage.service');

/**
 * Post a new ground-reality story reel
 * Gated: ONLY users with Tier 1 or Tier 2 verified reviews for this place can post!
 */
const createStory = async (req, res) => {
    try {
        const { placeId, caption, groundRealityNotes, durationSeconds = 30, mediaType = 'VIDEO' } = req.body;

        if (!placeId) {
            return res.status(400).json({ success: false, message: 'Place ID is required' });
        }

        const place = await Place.findById(placeId);
        if (!place) {
            return res.status(404).json({ success: false, message: 'Place not found' });
        }

        // Strict Gate Verification: Check if user has a verified review for this place OR is a CREATOR role
        const verifiedReview = await Review.findOne({
            user: req.user._id,
            place: placeId,
            verificationTier: { $in: ['TIER_1_VERIFIED', 'TIER_2_LIKELY'] }
        });

        const isCreatorOrAdmin = ['CREATOR', 'ADMIN'].includes(req.user.role);

        if (!verifiedReview && !isCreatorOrAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Story posting is gated: Only Tier 1 (GPS Verified) or Tier 2 (EXIF Geotagged) travelers or verified Creators can publish ground-reality stories for this place.'
            });
        }

        let mediaUrl = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80';
        if (req.file) {
            mediaUrl = getFileUrl(req.file.filename, req);
        } else if (req.body.mediaUrl) {
            mediaUrl = req.body.mediaUrl;
        }

        const verificationTier = verifiedReview ? verifiedReview.verificationTier : 'TIER_2_LIKELY';

        const story = await Story.create({
            user: req.user._id,
            place: place._id,
            mediaUrl,
            mediaType,
            durationSeconds: parseInt(durationSeconds) || 30,
            caption: caption || '',
            groundRealityNotes: groundRealityNotes || 'Live conditions verified on location.',
            verificationTier
        });

        const populated = await Story.findById(story._id)
            .populate('user', 'name avatar explorerLevel')
            .populate('place', 'name city category');

        res.status(201).json({
            success: true,
            message: 'Ground-reality story reel published successfully!',
            data: populated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get stories feed (filtered by place or global)
 */
const getStories = async (req, res) => {
    try {
        const { placeId, city } = req.query;
        const query = { expiresAt: { $gt: new Date() } };

        if (placeId) {
            query.place = placeId;
        }

        let stories = await Story.find(query)
            .populate('user', 'name avatar explorerLevel')
            .populate('place', 'name city category')
            .sort({ createdAt: -1 })
            .limit(25);

        if (city) {
            stories = stories.filter(s => s.place && s.place.city && s.place.city.toLowerCase() === city.toLowerCase());
        }

        res.status(200).json({
            success: true,
            count: stories.length,
            data: stories
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Like / unlike a story
 */
const toggleLikeStory = async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        const userId = req.user._id;
        const index = story.likes.findIndex(id => id.toString() === userId.toString());

        if (index > -1) {
            story.likes.splice(index, 1);
        } else {
            story.likes.push(userId);
        }

        await story.save();

        res.status(200).json({
            success: true,
            likesCount: story.likes.length,
            isLiked: index === -1
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createStory,
    getStories,
    toggleLikeStory
};
