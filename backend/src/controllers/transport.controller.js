const TransportRoute = require('../models/transportRoute.model');

/**
 * Compare multi-modal transport routes between source and destination
 */
const compareTransportRoutes = async (req, res) => {
    try {
        const source = req.query.source || req.query.origin || req.query.from;
        const destination = req.query.destination || req.query.dest || req.query.to;
        const { mode, sortBy = 'fare' } = req.query;

        if (!source || !destination) {
            return res.status(400).json({
                success: false,
                message: 'Both source and destination cities are required'
            });
        }

        const filter = {
            sourceCity: new RegExp(`^${source.trim()}$`, 'i'),
            destinationCity: new RegExp(`^${destination.trim()}$`, 'i')
        };

        if (mode) {
            filter.mode = mode.toUpperCase();
        }

        let routes = await TransportRoute.find(filter);

        // If no direct static routes found in database, check reverse or generate multi-modal estimates
        if (routes.length === 0) {
            routes = await TransportRoute.find({
                $or: [
                    { sourceCity: new RegExp(source.trim(), 'i') },
                    { destinationCity: new RegExp(destination.trim(), 'i') }
                ]
            });
        }

        // Identify lowest carbon footprint mode as Green Choice
        let lowestCarbon = Infinity;
        let greenChoiceId = null;

        routes.forEach(route => {
            if (route.carbonKgPerPassenger < lowestCarbon) {
                lowestCarbon = route.carbonKgPerPassenger;
                greenChoiceId = route._id.toString();
            }
        });

        // Add dynamic deep links and green choice flag
        const formattedRoutes = routes.map(route => {
            const rObj = route.toObject();
            rObj.isGreenChoice = rObj._id.toString() === greenChoiceId;

            // Generate dynamic live deep links
            const dateStr = req.query.date || new Date().toISOString().split('T')[0];
            if (route.mode === 'TRAIN') {
                rObj.deepLink = `https://www.irctc.co.in/nget/train-search?src=${route.sourceStationCode || 'NDLS'}&dst=${route.destinationStationCode || 'JP'}&journeyDate=${dateStr}`;
            } else if (route.mode === 'FLIGHT') {
                rObj.deepLink = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(route.destinationCity)}%20from%20${encodeURIComponent(route.sourceCity)}%20on%20${dateStr}`;
            } else if (route.mode === 'BUS') {
                rObj.deepLink = `https://www.redbus.in/bus-tickets/${route.sourceCity.toLowerCase()}-to-${route.destinationCity.toLowerCase()}?date=${dateStr}`;
            } else if (route.mode === 'CAB') {
                rObj.deepLink = `https://m.uber.com/ul/?action=setPickup&pickup[query]=${encodeURIComponent(route.sourceCity)}&dropoff[query]=${encodeURIComponent(route.destinationCity)}`;
            } else {
                rObj.deepLink = `https://www.makemytrip.com/`;
            }

            return rObj;
        });

        // Sorting
        if (sortBy === 'duration') {
            formattedRoutes.sort((a, b) => a.durationMinutes - b.durationMinutes);
        } else if (sortBy === 'carbon') {
            formattedRoutes.sort((a, b) => a.carbonKgPerPassenger - b.carbonKgPerPassenger);
        } else {
            // Sort by lowest class fare
            formattedRoutes.sort((a, b) => {
                const minA = Math.min(...(a.classes.map(c => c.fare) || [0]));
                const minB = Math.min(...(b.classes.map(c => c.fare) || [0]));
                return minA - minB;
            });
        }

        res.status(200).json({
            success: true,
            source,
            destination,
            count: formattedRoutes.length,
            data: formattedRoutes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get route by ID with complete GeoJSON polyline
 */
const getTransportRouteById = async (req, res) => {
    try {
        const route = await TransportRoute.findById(req.params.id);
        if (!route) {
            return res.status(404).json({ success: false, message: 'Transport route not found' });
        }
        res.status(200).json({ success: true, data: route });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Admin: Create a new transport route
 */
const createTransportRoute = async (req, res) => {
    try {
        const route = await TransportRoute.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Transport route created successfully',
            data: route
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    compareTransportRoutes,
    getTransportRouteById,
    createTransportRoute
};
