const PackingList = require('../models/packingList.model');
const Trip = require('../models/trip.model');

/**
 * Generate smart packing list based on destination type and weather
 */
const generateSmartPackingList = async (req, res) => {
    try {
        const { destination, destinationType = 'HERITAGE_CITIES', tripId } = req.body;

        const baseItems = [
            { name: 'Govt Photo ID (Aadhaar / Passport / DL)', category: 'DOCUMENTS', isPacked: false },
            { name: 'Train / Flight e-Tickets & Booking Vouchers', category: 'DOCUMENTS', isPacked: false },
            { name: 'Power Bank (10,000+ mAh) & Fast Chargers', category: 'ELECTRONICS', isPacked: false },
            { name: 'Universal Adapter & Long Cable', category: 'ELECTRONICS', isPacked: false },
            { name: 'Basic First-Aid (Band-aids, Paracetamol, Antacids)', category: 'MEDICINE', isPacked: false },
            { name: 'Hand Sanitizer & Pocket Wet Wipes', category: 'TOILETRIES', isPacked: false }
        ];

        if (destinationType === 'BEACH') {
            baseItems.push(
                { name: 'High-SPF Sunscreen (SPF 50+) & Lip Balm', category: 'TOILETRIES', weatherOrActivityReason: 'High UV index along coastal shores' },
                { name: 'Quick-Dry Microfiber Beach Towel', category: 'GEAR', weatherOrActivityReason: 'Water activities & beach lounging' },
                { name: 'Waterproof Phone Pouch', category: 'GEAR', weatherOrActivityReason: 'Protects device during boat rides' },
                { name: 'Linen Shirts & Breathable Shorts', category: 'CLOTHING', weatherOrActivityReason: 'Humid coastal weather' },
                { name: 'UV Protection Sunglasses & Sun Hat', category: 'GEAR', weatherOrActivityReason: 'Direct midday sunlight' }
            );
        } else if (destinationType === 'COLD_HILLS') {
            baseItems.push(
                { name: 'Thermal Inners & Woolen Socks', category: 'CLOTHING', weatherOrActivityReason: 'Night temperatures below 10°C' },
                { name: 'Down Jacket / Fleece Windbreaker', category: 'CLOTHING', weatherOrActivityReason: 'High altitude mountain chill' },
                { name: 'Moisturizer & Winter Lip Care', category: 'TOILETRIES', weatherOrActivityReason: 'Dry mountain air' },
                { name: 'Insulated Thermos Water Bottle', category: 'GEAR', weatherOrActivityReason: 'Keeps warm water available on trails' }
            );
        } else if (destinationType === 'HERITAGE_CITIES') {
            baseItems.push(
                { name: 'Comfortable Walking / Slip-on Shoes', category: 'CLOTHING', weatherOrActivityReason: 'Cobblestone palace ramparts & frequent temple shoe removal' },
                { name: 'Modest Clothing / Light Scarf or Dupatta', category: 'CLOTHING', weatherOrActivityReason: 'Required for temple and sanctum entry' },
                { name: 'Breathable Cotton Shirts & Trousers', category: 'CLOTHING', weatherOrActivityReason: 'Daytime heat in stone fort courtyards' },
                { name: 'Electrolyte Sachets (ORS / Enerzal)', category: 'MEDICINE', weatherOrActivityReason: 'Prevents dehydration during walking tours' },
                { name: 'Foldable UV Sun Umbrella', category: 'GEAR', weatherOrActivityReason: 'Exposed open-air fort viewpoints' }
            );
        } else if (destinationType === 'TREKKING_ADVENTURE') {
            baseItems.push(
                { name: 'Sturdy Ankle-Support Trekking Shoes', category: 'CLOTHING', weatherOrActivityReason: 'Rocky uneven trails' },
                { name: 'Blister Tape & Pain Relief Spray', category: 'MEDICINE', weatherOrActivityReason: 'Foot friction on continuous ascents' },
                { name: 'Headlamp with Extra Batteries', category: 'GEAR', weatherOrActivityReason: 'Night walks / early morning summit pushes' },
                { name: 'Rain Poncho / Waterproof Rucksack Cover', category: 'GEAR', weatherOrActivityReason: 'Unpredictable mountain weather' }
            );
        }

        let packingList = await PackingList.findOne({ user: req.user._id, trip: tripId || null });
        if (packingList) {
            packingList.destination = destination || packingList.destination;
            packingList.destinationType = destinationType;
            packingList.items = baseItems;
            await packingList.save();
        } else {
            packingList = await PackingList.create({
                user: req.user._id,
                trip: tripId || null,
                destination: destination || 'Adventure Trip',
                destinationType,
                items: baseItems
            });
        }

        res.status(201).json({
            success: true,
            message: 'Smart packing list generated!',
            data: packingList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPackingList = async (req, res) => {
    try {
        const { tripId } = req.query;
        const query = { user: req.user._id };
        if (tripId) query.trip = tripId;

        let packingList = await PackingList.findOne(query);
        if (!packingList) {
            packingList = await PackingList.findOne({ user: req.user._id });
        }

        res.status(200).json({
            success: true,
            data: packingList
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const togglePackingItem = async (req, res) => {
    try {
        const { listId, itemId } = req.body;
        const list = await PackingList.findById(listId);
        if (!list) return res.status(404).json({ success: false, message: 'List not found' });

        const item = list.items.id(itemId);
        if (item) {
            item.isPacked = !item.isPacked;
            await list.save();
        }

        res.status(200).json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    generateSmartPackingList,
    getPackingList,
    togglePackingItem
};
