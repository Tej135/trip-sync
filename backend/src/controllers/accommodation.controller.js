const Accommodation = require('../models/accommodation.model');

const getAccommodations = async (req, res) => {
    try {
        const { city, tier, maxPrice, search } = req.query;
        const query = {};

        if (city) query.city = new RegExp(city.trim(), 'i');
        if (tier) query.tier = tier.toUpperCase();
        if (maxPrice) query.pricePerNight = { $lte: parseFloat(maxPrice) };
        if (search) query.name = { $regex: search.trim(), $options: 'i' };

        const stays = await Accommodation.find(query).sort({ rating: -1 }).limit(30);

        res.status(200).json({
            success: true,
            count: stays.length,
            data: stays
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAccommodationById = async (req, res) => {
    try {
        const stay = await Accommodation.findById(req.params.id);
        if (!stay) {
            return res.status(404).json({ success: false, message: 'Accommodation not found' });
        }
        res.status(200).json({ success: true, data: stay });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createAccommodation = async (req, res) => {
    try {
        const stay = await Accommodation.create(req.body);
        res.status(201).json({ success: true, data: stay });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAccommodations,
    getAccommodationById,
    createAccommodation
};
