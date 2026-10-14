const Restaurant = require('../models/restaurant.model');

const getRestaurants = async (req, res) => {
    try {
        const { city, isVeg, isVegan, search } = req.query;
        const query = {};

        if (city) query.city = new RegExp(city.trim(), 'i');
        if (isVeg === 'true') query['famousDishes.isVeg'] = true;
        if (isVegan === 'true') query['famousDishes.isVegan'] = true;
        if (search) {
            query.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { 'famousDishes.dishName': { $regex: search.trim(), $options: 'i' } }
            ];
        }

        const restaurants = await Restaurant.find(query).sort({ rating: -1 }).limit(30);

        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const rest = await Restaurant.findById(req.params.id);
        if (!rest) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
        res.status(200).json({ success: true, data: rest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createRestaurant = async (req, res) => {
    try {
        const rest = await Restaurant.create(req.body);
        res.status(201).json({ success: true, data: rest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getRestaurants,
    getRestaurantById,
    createRestaurant
};
