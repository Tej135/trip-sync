const Place = require('../models/place.model');
const Review = require('../models/review.model');
const Restaurant = require('../models/restaurant.model');
const Story = require('../models/story.model');

/**
 * Get nearby places using GeoJSON 2dsphere $near query
 */
const getNearbyPlaces = async (req, res) => {
    try {
        const { longitude, latitude, radius = 25000, category, city } = req.query;

        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: "Longitude and latitude are required"
            });
        }

        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseFloat(radius)
                }
            }
        };

        if (category) {
            query.category = category.toUpperCase();
        }
        if (city) {
            query.city = new RegExp(city.trim(), 'i');
        }

        const places = await Place.find(query).limit(50);

        return res.status(200).json({
            success: true,
            message: "Nearby places retrieved successfully",
            count: places.length,
            data: places
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Filter and search places by city, category, drone rules, safety
 */
const getPlaces = async (req, res) => {
    try {
        const { city, category, droneZone, minSafety, search, sort = 'rating' } = req.query;
        const query = {};

        if (city) {
            query.city = new RegExp(city.trim(), 'i');
        }
        if (category) {
            query.category = category.toUpperCase();
        }
        if (droneZone) {
            query['creatorInfo.droneZone'] = droneZone.toUpperCase();
        }
        if (minSafety) {
            query['safetyScore.overall'] = { $gte: parseFloat(minSafety) };
        }
        if (search) {
            query.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
                { city: { $regex: search.trim(), $options: 'i' } }
            ];
        }

        let sortObj = { averageRating: -1 };
        if (sort === 'safety') sortObj = { 'safetyScore.overall': -1 };
        if (sort === 'reviews') sortObj = { totalVerifiedReviews: -1 };
        if (sort === 'duration') sortObj = { recommendedDurationMinutes: 1 };

        const places = await Place.find(query).sort(sortObj).limit(60);

        res.status(200).json({
            success: true,
            count: places.length,
            data: places
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Deep inspection of single place with linked restaurants, verified reviews, and stories
 */
const getPlaceDetails = async (req, res) => {
    try {
        const { identifier } = req.params;

        let place = null;
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            place = await Place.findById(identifier);
        } else {
            place = await Place.findOne({ slug: identifier.toLowerCase() });
        }

        if (!place) {
            return res.status(404).json({
                success: false,
                message: 'Place not found'
            });
        }

        // Fetch nearby food within ~3km
        const nearbyRestaurants = await Restaurant.find({
            city: place.city
        }).limit(6);

        // Fetch top verified reviews (Tier 1 & 2 first)
        const reviews = await Review.find({ place: place._id })
            .populate('user', 'name avatar explorerLevel badges')
            .sort({ verificationTier: 1, createdAt: -1 })
            .limit(10);

        // Fetch ground-reality stories for this place
        const stories = await Story.find({ place: place._id })
            .populate('user', 'name avatar explorerLevel')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                place,
                nearbyRestaurants,
                reviews,
                stories
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createPlace = async (req, res) => {
    try {
        const slug = req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const place = await Place.create({ ...req.body, slug });
        res.status(201).json({
            success: true,
            message: 'Place created successfully',
            data: place
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updatePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!place) {
            return res.status(404).json({ success: false, message: 'Place not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Place updated successfully',
            data: place
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ success: false, message: 'Place not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Place deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getNearbyPlaces,
    getPlaces,
    getPlaceDetails,
    createPlace,
    updatePlace,
    deletePlace
};
