const Event = require('../models/event.model');

const getEvents = async (req, res) => {
    try {
        const { city, category, month } = req.query;
        const query = {};

        if (city) query.city = new RegExp(city.trim(), 'i');
        if (category) query.category = category.toUpperCase();
        if (month) query.recurringMonths = parseInt(month);

        const events = await Event.find(query).sort({ startDate: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent
};
