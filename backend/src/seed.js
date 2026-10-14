require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./db/db');
const User = require('./models/user.model');
const Place = require('./models/place.model');
const TransportRoute = require('./models/transportRoute.model');
const Accommodation = require('./models/accommodation.model');
const Restaurant = require('./models/restaurant.model');
const Review = require('./models/review.model');
const Story = require('./models/story.model');
const LocalExpert = require('./models/expert.model');
const Event = require('./models/event.model');
const EmergencyContact = require('./models/emergencyContact.model');

const seedData = async () => {
    try {
        await connectDB();
        console.log('[Seed] Connected to database. Clearing existing collections...');

        await User.deleteMany({});
        await Place.deleteMany({});
        await TransportRoute.deleteMany({});
        await Accommodation.deleteMany({});
        await Restaurant.deleteMany({});
        await Review.deleteMany({});
        await Story.deleteMany({});
        await LocalExpert.deleteMany({});
        await Event.deleteMany({});
        await EmergencyContact.deleteMany({});

        console.log('[Seed] Seeding Users...');
        const users = await User.create([
            {
                name: 'Aditya Vardhan (Admin)',
                email: 'admin@tripsync.com',
                password: 'password123',
                role: 'ADMIN',
                phone: '+91 98765 43210',
                homeCity: 'Hyderabad',
                explorerLevel: 'DIAMOND',
                verifiedReviewsCount: 145,
                isPro: true,
                avatar: 'https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png',
                badges: [{ name: 'System Overseer', description: 'Master administrator of TripSync', icon: '⚡' }]
            },
            {
                name: 'Kavitha Rao (Moderator)',
                email: 'moderator@tripsync.com',
                password: 'password123',
                role: 'MODERATOR',
                phone: '+91 98111 22334',
                homeCity: 'Visakhapatnam',
                explorerLevel: 'PLATINUM',
                verifiedReviewsCount: 78,
                isPro: true,
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
            },
            {
                name: 'Syed Farooq Ali',
                email: 'farooq.guide@tripsync.com',
                password: 'password123',
                role: 'LOCAL_EXPERT',
                phone: '+91 94400 12345',
                homeCity: 'Hyderabad',
                explorerLevel: 'DIAMOND',
                verifiedReviewsCount: 160,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                bio: 'Heritage historian & royal Nizami food researcher with 15 years guiding walks through Charminar, Golconda acoustic tunnels, and Laad Bazaar.'
            },
            {
                name: 'K. Appala Naidu',
                email: 'naidu.vizag@tripsync.com',
                password: 'password123',
                role: 'LOCAL_EXPERT',
                phone: '+91 98480 67890',
                homeCity: 'Visakhapatnam',
                explorerLevel: 'GOLD',
                verifiedReviewsCount: 92,
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                bio: 'Araku Valley tribal eco-tour pioneer, coffee plantation naturalist, and coastal trekking specialist covering Rushikonda & Dolphin’s Nose.'
            },
            {
                name: 'Rahul Varma (Explorer)',
                email: 'traveler@tripsync.com',
                password: 'password123',
                role: 'TRAVELER',
                phone: '+91 98990 11223',
                homeCity: 'Bengaluru',
                explorerLevel: 'GOLD',
                personalityArchetype: 'EXPLORER',
                verifiedReviewsCount: 28,
                isPro: true,
                upiId: 'rahul@okhdfc'
            },
            {
                name: 'Pooja Reddy (Creator)',
                email: 'pooja.creator@tripsync.com',
                password: 'password123',
                role: 'CREATOR',
                phone: '+91 97110 33445',
                homeCity: 'Hyderabad',
                explorerLevel: 'PLATINUM',
                personalityArchetype: 'CONTENT_CREATOR',
                verifiedReviewsCount: 64,
                isPro: true
            }
        ]);

        const admin = users[0];
        const expertHydUser = users[2];
        const expertVizagUser = users[3];
        const travelerRahul = users[4];
        const creatorPooja = users[5];

        console.log('[Seed] Seeding Local Experts for Hyderabad & Visakhapatnam...');
        await LocalExpert.create([
            {
                user: expertHydUser._id,
                city: 'Hyderabad',
                state: 'Telangana',
                specialty: 'Heritage Walk Historian',
                bio: 'Uncover 400 years of Qutb Shahi and Asaf Jahi dynasties. Private access to historic havelis, secret acoustics of Golconda, and genuine Dum Biryani food walks.',
                yearsOfExperience: 15,
                hourlyRateInr: 850,
                rating: 4.96,
                totalBookings: 112,
                idVerificationStatus: 'VERIFIED',
                idDocumentType: 'Telangana Tourism Approved Guide Badge',
                languages: ['English', 'Telugu', 'Urdu', 'Hindi'],
                offeredTours: [
                    {
                        title: 'Charminar Walled City & Nizami Food Trail',
                        description: 'Evening walking tour tasting Irani chai, Osmania biscuits, Nimrah bakery puffs, authentic Pathar ka Gosht, and walking through vibrant Laad Bazaar.',
                        durationHours: 3.5,
                        priceInr: 1600,
                        meetingPoint: 'Charminar North Bhagyalakshmi Gate',
                        maxGroupSize: 8
                    },
                    {
                        title: 'Secrets & Acoustics of Golconda Fort Citadel',
                        description: 'Detailed architectural walkthrough demonstrating acoustic clapping signals, water lift systems, and royal Kohinoor diamond chambers.',
                        durationHours: 3.0,
                        priceInr: 1400,
                        meetingPoint: 'Golconda Fort Fateh Darwaza Ticket Counter',
                        maxGroupSize: 10
                    }
                ]
            },
            {
                user: expertVizagUser._id,
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                specialty: 'Trekking & Adventure Sherpa',
                bio: 'Certified Eastern Ghats trek leader. Specializing in misty Araku Valley coffee trails, Borra limestone cave geology, and secluded coastal cliff walks at Yarada.',
                yearsOfExperience: 11,
                hourlyRateInr: 900,
                rating: 4.92,
                totalBookings: 86,
                idVerificationStatus: 'VERIFIED',
                idDocumentType: 'AP Tourism Certified Adventure Guide',
                languages: ['English', 'Telugu', 'Hindi'],
                offeredTours: [
                    {
                        title: 'Araku Valley Tribal Coffee & Waterfall Trek',
                        description: 'Hike through organic tribal coffee estates to hidden Katiki waterfalls, taste authentic Bamboo Chicken, and explore 150-million-year-old Borra caves.',
                        durationHours: 6.0,
                        priceInr: 2400,
                        meetingPoint: 'Araku Tribal Museum Entrance',
                        maxGroupSize: 6
                    },
                    {
                        title: 'Vizag Coastline & Dolphin’s Nose Sunset Walk',
                        description: 'Scenic marine walk exploring the historic British lighthouse, Yarada hill promontory, and quiet coastal fishing catamarans.',
                        durationHours: 3.0,
                        priceInr: 1300,
                        meetingPoint: 'Dolphin’s Nose Lighthouse Gate',
                        maxGroupSize: 8
                    }
                ]
            }
        ]);

        console.log('[Seed] Seeding Tourist Places for Hyderabad & Visakhapatnam...');
        const places = await Place.create([
            // ================= HYDERABAD PLACES =================
            {
                name: 'Charminar & Laad Bazaar',
                slug: 'charminar-hyderabad',
                description: 'Magnificent 1591 monument with four 48.7-meter stucco minarets built by Sultan Muhammad Quli Qutb Shah. Surrounded by buzzing Laad Bazaar lacquer bangle stalls and legendary Irani chai cafes.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [78.4747, 17.3616] },
                city: 'Hyderabad',
                state: 'Telangana',
                photoUrls: [
                    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
                ],
                coverPhoto: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
                averageRating: 4.85,
                totalReviews: 420,
                totalVerifiedReviews: 310,
                priceIndicator: '₹',
                recommendedDurationMinutes: 90,
                bestTimeToVisit: 'Morning (07:30 AM) or Night Illumination (07:00 PM)',
                timings: { open: '09:00 AM', close: '05:30 PM' },
                entryFees: { indian: 25, foreigner: 300, child: 10, camera: 25 },
                safetyScore: { overall: 9.1, crime: 8.8, terrain: 9.5, weather: 9.0, medical: 9.2, network: 9.8, night: 8.9, women: 8.8 },
                creatorInfo: {
                    videoAllowed: true, photoAllowed: true, tripodAllowed: false, droneZone: 'RED',
                    permitRequired: true,
                    permitDetails: 'ASI Hyderabad Circle commercial permit required for professional video rigs.',
                    authorityContact: 'Archaeological Survey of India, Kendriya Sadan, Hyderabad (+91 40 2474 2480)',
                    bannedPockets: ['Inner upper gallery mosque sanctum'],
                    goldenHourRecommendation: '06:15 AM - 07:15 AM from Nimrah Cafe rooftop before street congestion',
                    bestAngles: [
                        { title: 'Nimrah Cafe Irani Chai Perspective', description: 'Frame Charminar through hot steaming Irani chai cup from Nimrah bakery pavement.', coordinates: [78.4749, 17.3618] },
                        { title: 'Laad Bazaar Archway Symmetry', description: 'Shoot looking straight up the bazaar street with colorful glittering bangles in foreground.', coordinates: [78.4735, 17.3615] }
                    ]
                },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 3, isToiletPaid: true, parkingAvailable: false, wheelchairAccessible: false, drinkingWaterAvailable: true, upiAccepted: true },
                lastMileTransit: { directions: '5 km from Hyderabad Deccan (Nampally) railway station. Nearest metro: MGBS / Charminar auto stand.', modes: ['Metro', 'Auto', 'Cab'], parkingFee: 50, walkingDistanceMeters: 200 }
            },
            {
                name: 'Golconda Fort Citadel',
                slug: 'golconda-fort',
                description: 'Towering 13th-century medieval granite fortress famed for its acoustic clapping echo system, diamond vaults that once held the Kohinoor and Hope diamonds, and panoramic sunset city views from the Bala Hissar pavilion.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [78.4011, 17.3833] },
                city: 'Hyderabad',
                state: 'Telangana',
                photoUrls: [
                    'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.8,
                totalReviews: 360,
                totalVerifiedReviews: 280,
                priceIndicator: '₹₹',
                recommendedDurationMinutes: 180,
                bestTimeToVisit: 'Late Afternoon (03:30 PM - 06:30 PM)',
                entryFees: { indian: 25, foreigner: 300, child: 15, camera: 50 },
                safetyScore: { overall: 8.9, crime: 9.0, terrain: 7.8, weather: 8.5, medical: 8.6, network: 8.9, night: 7.8, women: 8.8 },
                creatorInfo: {
                    droneZone: 'RED', videoAllowed: true, photoAllowed: true, tripodAllowed: false,
                    goldenHourRecommendation: '05:00 PM - 06:15 PM from the highest Bala Hissar royal darbar terrace',
                    bestAngles: [{ title: 'Bala Hissar Sunset over Hyderabad Skyline', description: 'Capture panoramic view as city lights start turning on below the ancient battlements.', coordinates: [78.4015, 17.3835] }]
                },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 4, parkingAvailable: true, wheelchairAccessible: false, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Hussain Sagar Lake & Buddha Statue',
                slug: 'hussain-sagar-buddha',
                description: 'Heart-shaped artificial lake built in 1563, featuring the world’s tallest monolithic granite Buddha statue (18m, 450 tonnes) standing serenely in the center of the lake on Gibraltar Rock. Connected by evening boat cruises from Lumbini Park.',
                category: 'VIEWPOINT',
                location: { type: 'Point', coordinates: [78.4744, 17.4239] },
                city: 'Hyderabad',
                state: 'Telangana',
                photoUrls: [
                    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.7,
                totalReviews: 310,
                totalVerifiedReviews: 245,
                priceIndicator: '₹',
                recommendedDurationMinutes: 90,
                bestTimeToVisit: 'Sunset & Twilight (05:00 PM - 07:30 PM)',
                entryFees: { indian: 80, foreigner: 150, child: 50, camera: 50 },
                safetyScore: { overall: 9.3, crime: 9.2, terrain: 9.8, weather: 9.2, medical: 9.4, network: 9.8, night: 9.0, women: 9.2 },
                creatorInfo: { droneZone: 'YELLOW', videoAllowed: true, photoAllowed: true },
                facilities: { toiletAvailable: true, parkingAvailable: true, wheelchairAccessible: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Chowmahalla Palace',
                slug: 'chowmahalla-palace',
                description: 'Exquisite 18th-century palace complex of the Nizams of Hyderabad, boasting the grand Khilwat Mubarak durbar hall with 19 magnificent Belgian crystal chandeliers, royal armory, and a collection of vintage yellow Rolls-Royces.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [78.4717, 17.3578] },
                city: 'Hyderabad',
                state: 'Telangana',
                photoUrls: [
                    'https://images.unsplash.com/photo-1600100397608-f010f4439f01?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.88,
                totalReviews: 275,
                totalVerifiedReviews: 215,
                priceIndicator: '₹₹',
                recommendedDurationMinutes: 120,
                bestTimeToVisit: 'Morning (10:00 AM - 12:30 PM)',
                entryFees: { indian: 100, foreigner: 400, child: 40, camera: 100 },
                safetyScore: { overall: 9.5, crime: 9.6, terrain: 9.8, weather: 9.4, medical: 9.2, network: 9.6, night: 8.8, women: 9.4 },
                creatorInfo: { droneZone: 'RED', videoAllowed: true, photoAllowed: true, tripodAllowed: false },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 5, parkingAvailable: true, wheelchairAccessible: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Salar Jung Museum',
                slug: 'salar-jung-museum',
                description: 'One of India’s three premier National Museums, housing Nawab Mir Yousuf Ali Khan’s private global collection: the legendary marble sculpture Veiled Rebecca, the 19th-century musical bracket clock, and Mughal jade daggers.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [78.4803, 17.3714] },
                city: 'Hyderabad',
                state: 'Telangana',
                photoUrls: [
                    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.75,
                totalReviews: 290,
                totalVerifiedReviews: 230,
                recommendedDurationMinutes: 180,
                entryFees: { indian: 50, foreigner: 500, child: 20, camera: 50 },
                safetyScore: { overall: 9.6, crime: 9.8, terrain: 9.8, weather: 9.8, medical: 9.5, network: 9.8, night: 9.0, women: 9.6 },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 5, parkingAvailable: true, wheelchairAccessible: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Ramoji Film City',
                slug: 'ramoji-film-city',
                description: 'Certified by the Guinness World Records as the world’s largest film studio complex (sprawling over 1,666 acres). Experience cinematic film sets, live Hollywood stunt shows, thematic gardens, and movie simulation rides.',
                category: 'ADVENTURE',
                location: { type: 'Point', coordinates: [78.6822, 17.2544] },
                city: 'Hyderabad',
                state: 'Telangana',
                photoUrls: [
                    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.7,
                totalReviews: 380,
                totalVerifiedReviews: 295,
                priceIndicator: '₹₹₹',
                recommendedDurationMinutes: 360,
                bestTimeToVisit: 'Full Day (09:00 AM - 05:30 PM)',
                entryFees: { indian: 1350, foreigner: 1350, child: 1150, camera: 100 },
                safetyScore: { overall: 9.6, crime: 9.7, terrain: 9.5, weather: 9.0, medical: 9.4, network: 9.8, night: 9.2, women: 9.6 },
                creatorInfo: { droneZone: 'RED', videoAllowed: true, photoAllowed: true },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 5, parkingAvailable: true, wheelchairAccessible: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Birla Mandir (Naubat Pahad)',
                slug: 'birla-mandir-hyderabad',
                description: 'Spectacular pure white Rajasthani marble temple dedicated to Lord Venkateswara, constructed atop the 280-foot high granite Naubat Pahad hill, offering serene sunset breezes and glittering night views over Hussain Sagar.',
                category: 'TEMPLE',
                location: { type: 'Point', coordinates: [78.4697, 17.4062] },
                city: 'Hyderabad',
                state: 'Telangana',
                averageRating: 4.82,
                totalReviews: 310,
                totalVerifiedReviews: 250,
                priceIndicator: 'FREE',
                recommendedDurationMinutes: 75,
                entryFees: { indian: 0, foreigner: 0, child: 0, camera: 0 },
                safetyScore: { overall: 9.7, crime: 9.8, terrain: 9.6, weather: 9.5, medical: 9.5, network: 9.8, night: 9.5, women: 9.8 },
                creatorInfo: { droneZone: 'RED', videoAllowed: false, photoAllowed: false },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 5, parkingAvailable: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Qutb Shahi Tombs (Ibrahim Bagh)',
                slug: 'qutb-shahi-tombs',
                description: 'Picturesque complex of 21 grand domed mausoleums blending Persian, Pashtun, and Hindu architectural details in landscaped Mughal-style gardens, resting place of the seven Golconda sultans.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [78.3956, 17.3892] },
                city: 'Hyderabad',
                state: 'Telangana',
                averageRating: 4.78,
                totalReviews: 215,
                totalVerifiedReviews: 170,
                recommendedDurationMinutes: 90,
                entryFees: { indian: 30, foreigner: 200, child: 15, camera: 50 },
                safetyScore: { overall: 9.2, crime: 9.4, terrain: 9.5, weather: 9.0, medical: 9.0, network: 9.5, night: 8.2, women: 9.2 },
                creatorInfo: {
                    droneZone: 'YELLOW', permitRequired: true,
                    bestAngles: [{ title: 'Domed Silhouette Symmetry', description: 'Stand between Muhammad Quli Qutb Shah tomb archways during golden hour.', coordinates: [78.3956, 17.3892] }]
                },
                facilities: { toiletAvailable: true, parkingAvailable: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Taj Falaknuma Palace',
                slug: 'falaknuma-palace',
                description: 'Known as "Mirror of the Sky", this rare scorpion-shaped Italian marble palace perched 2,000 feet above Hyderabad was built by Paigah Nawab Vikar-ul-Umra. Features the 101-seat dining table and jade collections.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [78.4678, 17.3314] },
                city: 'Hyderabad',
                state: 'Telangana',
                averageRating: 4.95,
                totalReviews: 180,
                totalVerifiedReviews: 150,
                priceIndicator: '₹₹₹',
                recommendedDurationMinutes: 150,
                safetyScore: { overall: 9.8, crime: 9.9, terrain: 9.8, weather: 9.5, medical: 9.6, network: 9.8, night: 9.8, women: 9.8 },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 5, parkingAvailable: true, wheelchairAccessible: true, upiAccepted: true }
            },
            {
                name: 'Durgam Cheruvu Cable Bridge & Secret Lake',
                slug: 'durgam-cheruvu-bridge',
                description: 'Iconic 238-meter cable-stayed bridge spanning over Durgam Cheruvu lake, featuring dynamic multi-color LED illumination at night, pedestrian walkways, and floating restaurant dining against the Hitec City skyline.',
                category: 'VIEWPOINT',
                location: { type: 'Point', coordinates: [78.3847, 17.4361] },
                city: 'Hyderabad',
                state: 'Telangana',
                averageRating: 4.75,
                totalReviews: 260,
                totalVerifiedReviews: 210,
                priceIndicator: 'FREE',
                recommendedDurationMinutes: 60,
                entryFees: { indian: 0, foreigner: 0, child: 0, camera: 0 },
                safetyScore: { overall: 9.4, crime: 9.5, terrain: 9.8, weather: 9.2, medical: 9.5, network: 9.8, night: 9.2, women: 9.4 },
                creatorInfo: { droneZone: 'GREEN', videoAllowed: true, photoAllowed: true },
                facilities: { parkingAvailable: true, upiAccepted: true }
            },
            {
                name: 'Shilparamam Arts & Crafts Village',
                slug: 'shilparamam-cultural-village',
                description: 'Sprawling 65-acre cultural village preserving traditional rural arts, live pottery crafting, handloom textile weavers, classical Kuchipudi dance performances, and serene boating ponds in Madhapur.',
                category: 'FOOD',
                location: { type: 'Point', coordinates: [78.3789, 17.4522] },
                city: 'Hyderabad',
                state: 'Telangana',
                averageRating: 4.65,
                totalReviews: 230,
                totalVerifiedReviews: 175,
                recommendedDurationMinutes: 120,
                entryFees: { indian: 60, foreigner: 150, child: 30, camera: 50 },
                safetyScore: { overall: 9.5, crime: 9.6, terrain: 9.8, weather: 9.2, medical: 9.5, network: 9.8, night: 9.2, women: 9.5 },
                facilities: { toiletAvailable: true, parkingAvailable: true, wheelchairAccessible: true, upiAccepted: true }
            },
            {
                name: 'Nehru Zoological Park & Safari',
                slug: 'nehru-zoological-park',
                description: 'One of South Asia’s largest and best-maintained zoological gardens (380 acres), featuring a natural African lion and Royal Bengal tiger safari, nocturnal house, and Mir Alam tank migratory bird waters.',
                category: 'NATURE',
                location: { type: 'Point', coordinates: [78.4506, 17.3489] },
                city: 'Hyderabad',
                state: 'Telangana',
                averageRating: 4.6,
                totalReviews: 280,
                totalVerifiedReviews: 210,
                recommendedDurationMinutes: 180,
                entryFees: { indian: 70, foreigner: 200, child: 35, camera: 120 },
                safetyScore: { overall: 9.4, crime: 9.5, terrain: 9.2, weather: 9.0, medical: 9.2, network: 9.5, night: 8.5, women: 9.4 },
                facilities: { toiletAvailable: true, parkingAvailable: true, wheelchairAccessible: true, upiAccepted: true }
            },

            // ================= VISAKHAPATNAM (VIZAG) PLACES =================
            {
                name: 'Araku Valley Coffee Plantations & Hills',
                slug: 'araku-valley',
                description: 'Enchanting Eastern Ghats hill station situated at 3,000 feet, surrounded by Galikonda mountain ridges, cascading streams, and famous organic tribal Arabica coffee plantations with aroma-rich tasting cafes.',
                category: 'NATURE',
                location: { type: 'Point', coordinates: [82.8833, 18.3333] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
                ],
                coverPhoto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
                averageRating: 4.9,
                totalReviews: 340,
                totalVerifiedReviews: 270,
                priceIndicator: '₹₹',
                recommendedDurationMinutes: 240,
                bestTimeToVisit: 'Winter & Early Morning Mist (06:30 AM - 11:00 AM)',
                entryFees: { indian: 0, foreigner: 0, child: 0, camera: 0 },
                safetyScore: { overall: 9.3, crime: 9.5, terrain: 8.6, weather: 9.2, medical: 8.0, network: 8.2, night: 8.0, women: 9.1 },
                creatorInfo: {
                    droneZone: 'GREEN', videoAllowed: true, photoAllowed: true, tripodAllowed: true,
                    goldenHourRecommendation: '06:15 AM - 07:45 AM capturing cloud inversion beds over coffee valleys',
                    bestAngles: [
                        { title: 'Galikonda Viewpoint Cloud Bed', description: 'Shoot from the highest ridge looking down into the misty Ananthagiri valley.', coordinates: [82.8850, 18.3350] }
                    ]
                },
                facilities: { toiletAvailable: true, parkingAvailable: true, wheelchairAccessible: false, drinkingWaterAvailable: true, upiAccepted: true },
                lastMileTransit: { directions: '115 km from Vizag city via scenic Vistadome train (Kothavalasa-Kirandul line) or Ghat road via Srungavarapukota.', modes: ['Vistadome Train', 'Cab', 'APSRTC Bus'], parkingFee: 50, walkingDistanceMeters: 100 }
            },
            {
                name: 'Rushikonda Beach & Water Sports',
                slug: 'rushikonda-beach',
                description: 'Prestigious Blue Flag-certified golden sand beach bordered by green hills and clear waters of the Bay of Bengal. Premier destination for sea surfing, speed boating, windsurfing, and beachfront dining.',
                category: 'NATURE',
                location: { type: 'Point', coordinates: [83.3853, 17.7819] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
                ],
                coverPhoto: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                averageRating: 4.85,
                totalReviews: 390,
                totalVerifiedReviews: 305,
                priceIndicator: '₹',
                recommendedDurationMinutes: 180,
                bestTimeToVisit: 'Sunrise & Late Afternoon (06:00 AM & 04:30 PM)',
                entryFees: { indian: 0, foreigner: 0, child: 0, camera: 0 },
                safetyScore: { overall: 9.4, crime: 9.4, terrain: 9.6, weather: 9.0, medical: 9.0, network: 9.8, night: 9.0, women: 9.4 },
                creatorInfo: {
                    droneZone: 'GREEN', videoAllowed: true, photoAllowed: true, tripodAllowed: true,
                    goldenHourRecommendation: '05:30 AM - 06:45 AM sunrise emerging directly from the ocean horizon',
                    bestAngles: [{ title: 'Golden Sunrise Ocean Horizon', description: 'Capture breaking surf waves with Rushikonda hill outline in morning warm light.', coordinates: [83.3853, 17.7819] }]
                },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 5, parkingAvailable: true, wheelchairAccessible: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Ramakrishna (RK) Beach & Marine Promenade',
                slug: 'rk-beach-vizag',
                description: 'The energetic heartbeat of Visakhapatnam, featuring a 4-kilometer illuminated coastal promenade, historic war memorials, bustling evening street seafood stalls, and sea breeze.',
                category: 'VIEWPOINT',
                location: { type: 'Point', coordinates: [83.3242, 17.7125] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.8,
                totalReviews: 410,
                totalVerifiedReviews: 330,
                priceIndicator: 'FREE',
                recommendedDurationMinutes: 120,
                safetyScore: { overall: 9.5, crime: 9.5, terrain: 9.8, weather: 9.2, medical: 9.5, network: 9.9, night: 9.4, women: 9.4 },
                creatorInfo: { droneZone: 'YELLOW', videoAllowed: true, photoAllowed: true },
                facilities: { toiletAvailable: true, parkingAvailable: true, wheelchairAccessible: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'INS Kursura Submarine Museum',
                slug: 'ins-kursura-submarine',
                description: 'Historic decommissioned Soviet-built submarine (S20) that served during the 1971 Indo-Pak war. Preserved on the sands of RK Beach as South Asia’s first operational submarine museum, guided by retired naval personnel.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [83.3325, 17.7186] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.9,
                totalReviews: 350,
                totalVerifiedReviews: 285,
                priceIndicator: '₹',
                recommendedDurationMinutes: 75,
                entryFees: { indian: 70, foreigner: 200, child: 40, camera: 100 },
                safetyScore: { overall: 9.6, crime: 9.8, terrain: 9.8, weather: 9.4, medical: 9.5, network: 9.9, night: 9.4, women: 9.6 },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 4, parkingAvailable: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Borra Caves (150-Million-Year Karst Caverns)',
                slug: 'borra-caves',
                description: 'Sensational deep limestone caves carved by the subterranean Gosthani river in the Ananthagiri hills. Marvel at colossal natural stalactite and stalagmite formations illuminated with colorful mercury and sodium lighting.',
                category: 'ADVENTURE',
                location: { type: 'Point', coordinates: [83.0403, 18.2811] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.86,
                totalReviews: 320,
                totalVerifiedReviews: 255,
                priceIndicator: '₹₹',
                recommendedDurationMinutes: 120,
                entryFees: { indian: 80, foreigner: 250, child: 60, camera: 100 },
                safetyScore: { overall: 8.8, crime: 9.2, terrain: 7.9, weather: 8.8, medical: 7.8, network: 6.8, night: 6.5, women: 8.6 },
                creatorInfo: { droneZone: 'RED', videoAllowed: true, photoAllowed: true },
                facilities: { toiletAvailable: true, parkingAvailable: true, upiAccepted: true }
            },
            {
                name: 'Kailasagiri Hilltop Park & Ropeway',
                slug: 'kailasagiri-park',
                description: 'Scenic 360-foot hilltop park reached via passenger cable car ropeway, offering majestic panoramic views where the Eastern Ghats hills kiss the Bay of Bengal, anchored by the iconic 40-foot white Shiva-Parvati statue.',
                category: 'VIEWPOINT',
                location: { type: 'Point', coordinates: [83.3422, 17.7492] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.75,
                totalReviews: 290,
                totalVerifiedReviews: 235,
                recommendedDurationMinutes: 120,
                entryFees: { indian: 20, foreigner: 50, child: 10, camera: 50 },
                safetyScore: { overall: 9.5, crime: 9.6, terrain: 9.5, weather: 9.2, medical: 9.2, network: 9.8, night: 9.0, women: 9.4 },
                creatorInfo: {
                    droneZone: 'GREEN', videoAllowed: true, photoAllowed: true,
                    bestAngles: [{ title: 'Ocean & City Panorama from Titanic Viewpoint', description: 'Shoot looking south toward Vizag harbor and RK beach curve.', coordinates: [83.3422, 17.7492] }]
                },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 4, parkingAvailable: true, wheelchairAccessible: true, upiAccepted: true }
            },
            {
                name: 'Yarada Beach (Secret Coastal Bay)',
                slug: 'yarada-beach',
                description: 'Secluded pristine beach tucked away behind Yarada hills on three sides and the turquoise Bay of Bengal on the fourth, surrounded by lush green coconut and banana groves with soft golden surf.',
                category: 'NATURE',
                location: { type: 'Point', coordinates: [83.2708, 17.6539] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.88,
                totalReviews: 240,
                totalVerifiedReviews: 180,
                priceIndicator: 'FREE',
                recommendedDurationMinutes: 150,
                safetyScore: { overall: 8.7, crime: 9.0, terrain: 8.5, weather: 8.5, medical: 7.8, network: 7.2, night: 6.8, women: 8.4 },
                creatorInfo: { droneZone: 'GREEN', videoAllowed: true, photoAllowed: true },
                facilities: { parkingAvailable: true, upiAccepted: true }
            },
            {
                name: 'Dolphin’s Nose & Historic Lighthouse',
                slug: 'dolphins-nose-lighthouse',
                description: 'A striking 358-meter high rock headland jutting dramatically into the sea resembling a dolphin’s snout. Topped by a powerful 19th-century naval lighthouse guiding ships into Visakhapatnam port with a light range of 32 nautical miles.',
                category: 'VIEWPOINT',
                location: { type: 'Point', coordinates: [83.2933, 17.6744] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.82,
                totalReviews: 220,
                totalVerifiedReviews: 170,
                recommendedDurationMinutes: 90,
                entryFees: { indian: 20, foreigner: 50, child: 10, camera: 50 },
                safetyScore: { overall: 8.9, crime: 9.2, terrain: 8.0, weather: 8.5, medical: 8.2, network: 8.0, night: 7.0, women: 8.5 },
                facilities: { parkingAvailable: true, upiAccepted: true }
            },
            {
                name: 'Simhachalam Temple (Varaha Narasimha)',
                slug: 'simhachalam-temple',
                description: 'Ancient 11th-century fortress-like temple dedicated to Lord Varaha Narasimha, covered continuously in sandalwood paste throughout the year. Showcases magnificent Kalinga and Chola stone architecture on Simhachalam hill.',
                category: 'TEMPLE',
                location: { type: 'Point', coordinates: [83.2506, 17.7667] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.88,
                totalReviews: 310,
                totalVerifiedReviews: 250,
                priceIndicator: 'FREE',
                recommendedDurationMinutes: 120,
                safetyScore: { overall: 9.6, crime: 9.8, terrain: 9.2, weather: 9.2, medical: 9.2, network: 9.8, night: 9.0, women: 9.6 },
                creatorInfo: { droneZone: 'RED', videoAllowed: false, photoAllowed: false },
                facilities: { toiletAvailable: true, toiletCleanlinessScore: 4, parkingAvailable: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Katiki Waterfalls (Deep Jungle Cascade)',
                slug: 'katiki-waterfalls',
                description: 'Breath-taking 50-foot natural waterfall fed by the perennial Gosthani river, hidden deep within the verdant forests of Araku Valley. Reached via adventurous 4x4 Jeep rides and bamboo forest hiking paths.',
                category: 'ADVENTURE',
                location: { type: 'Point', coordinates: [83.0233, 18.2611] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.7,
                totalReviews: 180,
                totalVerifiedReviews: 135,
                recommendedDurationMinutes: 150,
                safetyScore: { overall: 8.2, crime: 8.8, terrain: 6.8, weather: 8.0, medical: 6.5, network: 4.8, night: 4.0, women: 8.0 },
                facilities: { parkingAvailable: true, upiAccepted: false }
            },
            {
                name: 'TU 142 Aircraft Museum',
                slug: 'tu-142-aircraft-museum',
                description: 'Actual long-range maritime reconnaissance anti-submarine aircraft of the Indian Navy decommissioned after 29 years of accident-free service. Walk through the flight cockpit, radar controls, and torpedo compartments on Beach Road.',
                category: 'HERITAGE',
                location: { type: 'Point', coordinates: [83.3344, 17.7197] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.85,
                totalReviews: 240,
                totalVerifiedReviews: 190,
                entryFees: { indian: 70, foreigner: 150, child: 40, camera: 50 },
                safetyScore: { overall: 9.6, crime: 9.8, terrain: 9.8, weather: 9.4, medical: 9.5, network: 9.9, night: 9.4, women: 9.6 },
                facilities: { toiletAvailable: true, parkingAvailable: true, drinkingWaterAvailable: true, upiAccepted: true }
            },
            {
                name: 'Lambasingi (Kashmir of Andhra Pradesh)',
                slug: 'lambasingi-hills',
                description: 'Picturesque hill hamlet nestled at 3,300 feet in Chintapalli where winter morning temperatures drop near freezing (0°C). Famed for swirling morning mist, strawberry farms, pine groves, and peaceful valley trails.',
                category: 'NATURE',
                location: { type: 'Point', coordinates: [82.5283, 17.8183] },
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                photoUrls: [
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'
                ],
                averageRating: 4.78,
                totalReviews: 220,
                totalVerifiedReviews: 165,
                recommendedDurationMinutes: 180,
                safetyScore: { overall: 9.0, crime: 9.4, terrain: 8.5, weather: 8.8, medical: 7.5, network: 7.2, night: 7.0, women: 8.8 },
                creatorInfo: { droneZone: 'GREEN', videoAllowed: true, photoAllowed: true },
                facilities: { parkingAvailable: true, upiAccepted: true }
            }
        ]);

        console.log(`[Seed] Seeded ${places.length} places across Hyderabad and Visakhapatnam.`);

        console.log('[Seed] Seeding Transport Routes between Hyderabad and Visakhapatnam...');
        await TransportRoute.create([
            // Hyderabad -> Visakhapatnam (Vande Bharat Express)
            {
                sourceCity: 'Hyderabad',
                sourceStationCode: 'SC',
                destinationCity: 'Visakhapatnam',
                destinationStationCode: 'VSKP',
                mode: 'TRAIN',
                operatorName: 'Indian Railways (Vande Bharat Express)',
                routeCode: '20834',
                departureTime: '03:00 PM',
                arrivalTime: '11:30 PM',
                durationMinutes: 510,
                stopsCount: 4,
                stops: ['Warangal', 'Khammam', 'Vijayawada', 'Rajahmundry', 'Samalkot'],
                distanceKm: 699,
                carbonKgPerPassenger: 18.5,
                isGreenChoice: true,
                classes: [
                    { className: 'AC Chair Car', fare: 1665, availableSeats: 58, perks: ['Scenic Godavari River Bridge', 'Complimentary Dinner & Snacks', 'Automatic Sliding Doors'] },
                    { className: 'Executive Class', fare: 3120, availableSeats: 16, perks: ['180° Rotating Luxury Seats', 'Royal Multi-course Dinner', 'Priority Attendant'] }
                ],
                polyline: {
                    type: 'LineString',
                    coordinates: [[78.5000, 17.4333], [79.6000, 17.9800], [80.6400, 16.5100], [81.7800, 17.0000], [83.2185, 17.6868]]
                }
            },
            // Hyderabad -> Visakhapatnam (Flight)
            {
                sourceCity: 'Hyderabad',
                sourceStationCode: 'HYD',
                destinationCity: 'Visakhapatnam',
                destinationStationCode: 'VTZ',
                mode: 'FLIGHT',
                operatorName: 'IndiGo Airlines',
                routeCode: '6E-452',
                departureTime: '07:15 AM',
                arrivalTime: '08:20 AM',
                durationMinutes: 65,
                stopsCount: 0,
                distanceKm: 510,
                carbonKgPerPassenger: 82.0,
                isGreenChoice: false,
                classes: [
                    { className: 'Economy Saver', fare: 2650, availableSeats: 36, perks: ['7kg Cabin Baggage', '15kg Check-in'] },
                    { className: 'Flexi Plus', fare: 4100, availableSeats: 14, perks: ['Free Choice of Seat', 'Complimentary Meal Box', 'Free Rescheduling'] }
                ],
                polyline: {
                    type: 'LineString',
                    coordinates: [[78.4300, 17.2403], [83.2244, 17.7214]]
                }
            },
            // Hyderabad -> Visakhapatnam (Bus)
            {
                sourceCity: 'Hyderabad',
                sourceStationCode: 'MGBS',
                destinationCity: 'Visakhapatnam',
                destinationStationCode: 'RTC COMPLEX',
                mode: 'BUS',
                operatorName: 'Kaveri Travels Volvo Multi-Axle',
                routeCode: 'KVR-HYD-VSKP',
                departureTime: '08:00 PM',
                arrivalTime: '07:15 AM',
                durationMinutes: 675,
                stopsCount: 3,
                distanceKm: 650,
                carbonKgPerPassenger: 28.0,
                isGreenChoice: false,
                classes: [
                    { className: 'AC Sleeper 2+1', fare: 1150, availableSeats: 22, perks: ['Clean Pillow & Blanket', 'USB Charging Port', 'Bottled Mineral Water'] }
                ],
                polyline: {
                    type: 'LineString',
                    coordinates: [[78.4800, 17.3750], [80.6000, 16.5000], [82.2000, 17.0000], [83.2185, 17.6868]]
                }
            },
            // Visakhapatnam -> Araku Valley (Vistadome Scenic Train)
            {
                sourceCity: 'Visakhapatnam',
                sourceStationCode: 'VSKP',
                destinationCity: 'Araku Valley',
                destinationStationCode: 'ARK',
                mode: 'TRAIN',
                operatorName: 'Indian Railways (Vistadome Glass Coach Express)',
                routeCode: '18551',
                departureTime: '06:45 AM',
                arrivalTime: '10:55 AM',
                durationMinutes: 250,
                stopsCount: 5,
                distanceKm: 130,
                carbonKgPerPassenger: 8.5,
                isGreenChoice: true,
                classes: [
                    { className: 'Vistadome 360° Glass Coach', fare: 670, availableSeats: 40, perks: ['Glass Roof Observation Deck', '58 Mountain Tunnels', 'Revolving Seats'] }
                ],
                polyline: {
                    type: 'LineString',
                    coordinates: [[83.2185, 17.6868], [83.1500, 17.9000], [83.0000, 18.1500], [82.8833, 18.3333]]
                }
            }
        ]);

        console.log('[Seed] Seeding Regional Restaurants & Famous Dishes...');
        await Restaurant.create([
            {
                name: 'Bawarchi Restaurant (Legendary Biryani)',
                city: 'Hyderabad',
                state: 'Telangana',
                location: { type: 'Point', coordinates: [78.4903, 17.4069] },
                address: 'RTC X Roads, Chikkadpally, Hyderabad',
                cuisines: ['Authentic Hyderabadi Biryani', 'Mughlai', 'Tandoori'],
                rating: 4.88,
                priceForTwo: 650,
                zomatoUrl: 'https://www.zomato.com/hyderabad/bawarchi-restaurant-rtc-x-roads',
                famousDishes: [
                    { dishName: 'Hyderabadi Special Mutton Dum Biryani', isVeg: false, price: 380, description: 'Slow cooked tender mutton layered with fragrant basmati rice, saffron, and fried onions.' },
                    { dishName: 'Mutton Boti Kebab', isVeg: false, price: 340, description: 'Charcoal-grilled boneless mutton cubes marinated in spicy Nizami masalas.' },
                    { dishName: 'Double Ka Meetha', isVeg: true, price: 120, description: 'Traditional Hyderabadi dessert of crispy fried bread soaked in saffron milk and dry fruits.' }
                ]
            },
            {
                name: 'Nimrah Cafe & Bakery (Opposite Charminar)',
                city: 'Hyderabad',
                state: 'Telangana',
                location: { type: 'Point', coordinates: [78.4749, 17.3618] },
                address: 'Opposite Mecca Masjid & Charminar, Hyderabad',
                cuisines: ['Irani Chai', 'Osmania Biscuits', 'Bakery'],
                rating: 4.95,
                priceForTwo: 180,
                famousDishes: [
                    { dishName: 'Steaming Dum Irani Chai', isVeg: true, price: 25, description: 'Silky, rich slow-brewed tea made with condensed milk and aromatic tea leaves.' },
                    { dishName: 'Original Osmania & Chand Biscuits', isVeg: true, price: 60, description: 'Sweet and lightly salted melt-in-mouth royal Nizami cookies.' }
                ]
            },
            {
                name: 'Sea Inn (Raju Gaari Dhaba - Rushikonda)',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                location: { type: 'Point', coordinates: [83.3792, 17.7803] },
                address: 'Rushikonda Beach Road, Visakhapatnam',
                cuisines: ['Spicy Andhra Coastal Seafood', 'Local Dhaba'],
                rating: 4.82,
                priceForTwo: 800,
                famousDishes: [
                    { dishName: 'Andhra Royyala Vepudu (Spicy Prawn Fry)', isVeg: false, price: 360, description: 'Fresh Bay of Bengal prawns tossed in freshly ground Guntur red chillies and curry leaves.' },
                    { dishName: 'Chepala Pulusu (Tangy Fish Curry)', isVeg: false, price: 320, description: 'Catch-of-the-day fish simmered in tangy tamarind gravy and roasted cumin.' }
                ]
            },
            {
                name: 'Araku Tribal Bamboo Cafe',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                location: { type: 'Point', coordinates: [82.8850, 18.3340] },
                address: 'Main Road, Araku Valley',
                cuisines: ['Tribal Organic', 'Araku Coffee'],
                rating: 4.8,
                priceForTwo: 500,
                famousDishes: [
                    { dishName: 'Authentic Araku Bamboo Chicken', isVeg: false, price: 280, description: 'Marinated tender chicken stuffed inside raw bamboo shoot and roasted over open coals without oil.' },
                    { dishName: 'Fresh Brewed Araku Organic Arabica Coffee', isVeg: true, price: 50, description: 'Freshly roasted single-estate shade-grown tribal coffee with rich natural caramel notes.' }
                ]
            }
        ]);

        console.log('[Seed] Seeding Accommodations for Hyderabad & Visakhapatnam...');
        await Accommodation.create([
            {
                name: 'Taj Krishna (Luxury City Haven)',
                city: 'Hyderabad',
                state: 'Telangana',
                tier: 'LUXURY',
                pricePerNight: 9500,
                rating: 4.9,
                amenities: ['Outdoor Pool', 'Fine Dining', 'Spa', 'Landscaped Lawns', 'Helipad'],
                location: { type: 'Point', coordinates: [78.4489, 17.4167] },
                address: 'Road No 1, Banjara Hills, Hyderabad'
            },
            {
                name: 'The Hoppetal Backpacker Dorms',
                city: 'Hyderabad',
                state: 'Telangana',
                tier: 'HOSTEL',
                pricePerNight: 700,
                rating: 4.75,
                amenities: ['Fast Free WiFi', 'Rooftop Cafe', 'Walking Tours', 'Bicycle Rental'],
                location: { type: 'Point', coordinates: [78.4350, 17.4250] },
                address: 'Jubilee Hills, Hyderabad'
            },
            {
                name: 'Radisson Blu Resort Rushikonda Beach',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                tier: 'LUXURY',
                pricePerNight: 7800,
                rating: 4.9,
                amenities: ['Oceanfront Balcony', 'Infinity Pool', 'Private Beach Access', 'Seafood Grill'],
                location: { type: 'Point', coordinates: [83.3870, 17.7840] },
                address: 'Rushikonda Beachfront, Visakhapatnam'
            },
            {
                name: 'Haritha Valley Resort (AP Tourism Araku)',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                tier: 'MID_RANGE',
                pricePerNight: 2800,
                rating: 4.65,
                amenities: ['Hill View Cottages', 'Campfire Lawn', 'Multi-cuisine Restaurant', 'Tribal Dance Events'],
                location: { type: 'Point', coordinates: [82.8800, 18.3300] },
                address: 'Near Tribal Museum, Araku Valley'
            }
        ]);

        console.log('[Seed] Seeding Verified Travel News & Updates...');
        await Story.create([
            {
                user: creatorPooja._id,
                place: places[0]._id, // Charminar
                mediaUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
                mediaType: 'PHOTO',
                durationSeconds: 15,
                caption: 'Charminar evening illumination now begins at 6:45 PM daily.',
                groundRealityNotes: 'The pedestrianization project around the monument is completed. Vehicles are diverted 300 meters away making walking through the bazaars pleasant and safe.',
                verificationTier: 'TIER_1_VERIFIED'
            },
            {
                user: travelerRahul._id,
                place: places[12]._id, // Araku Valley
                mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
                mediaType: 'PHOTO',
                durationSeconds: 20,
                caption: 'Winter morning mist in Araku Valley: Coffee harvest season is active!',
                groundRealityNotes: 'The scenic Vistadome train tickets book out 3 weeks in advance. Book early or take the smooth Ghat highway road.',
                verificationTier: 'TIER_1_VERIFIED'
            },
            {
                user: creatorPooja._id,
                place: places[13]._id, // Rushikonda Beach
                mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
                mediaType: 'PHOTO',
                durationSeconds: 15,
                caption: 'Rushikonda Beach retains Blue Flag international eco-certification.',
                groundRealityNotes: 'Clean changing rooms, lifeguards on duty until 6:00 PM, and high tide water sports are running smoothly.',
                verificationTier: 'TIER_1_VERIFIED'
            }
        ]);

        console.log('[Seed] Seeding Cultural Events...');
        await Event.create([
            {
                name: 'Visakha Utsav Coastal Carnival',
                city: 'Visakhapatnam',
                state: 'Andhra Pradesh',
                category: 'FESTIVAL',
                description: 'Magnificent 3-day beach carnival on RK Beach celebrating Andhra maritime culture, classical Carnatic and folk music, laser shows, and coastal seafood food streets.',
                startDate: new Date('2026-12-26'),
                endDate: new Date('2026-12-28'),
                recurringMonths: [12],
                location: { type: 'Point', coordinates: [83.3242, 17.7125] },
                entryFee: 0,
                culturalSignificance: 'Grand state festival highlighting coastal folklore, dance, and maritime heritage.'
            },
            {
                name: 'Numaish All India Industrial Exhibition',
                city: 'Hyderabad',
                state: 'Telangana',
                category: 'FESTIVAL',
                description: 'Historic 46-day annual consumer and cultural fair at Nampally grounds since 1938, featuring 2,000+ stalls with handicrafts, dry fruits, amusement rides, and Lucknowi chikankari.',
                startDate: new Date('2026-01-01'),
                endDate: new Date('2026-02-15'),
                recurringMonths: [1, 2],
                location: { type: 'Point', coordinates: [78.4683, 17.3889] },
                entryFee: 40,
                culturalSignificance: 'Iconic 85-year-old Hyderabadi exhibition tradition.'
            }
        ]);

        console.log('[Seed] Seeding Emergency Contacts...');
        await EmergencyContact.create([
            {
                user: travelerRahul._id,
                name: 'Srinivas Varma (Father)',
                relationship: 'Parent',
                phone: '+91 98490 54321',
                email: 'srinivas.varma@example.com',
                isPrimary: true
            },
            {
                user: travelerRahul._id,
                name: 'Ananya Varma (Sister)',
                relationship: 'Sibling',
                phone: '+91 98491 67890',
                email: 'ananya.varma@example.com',
                isPrimary: false
            }
        ]);

        console.log('=======================================================');
        console.log('✅ TRIPSYNC DATABASE SEEDED SUCCESSFULLY WITH HYDERABAD & VISAKHAPATNAM!');
        console.log('• 6 Users seeded (Admin: admin@tripsync.com / password123)');
        console.log('• 2 Verified Local Experts (Hyderabad & Visakhapatnam)');
        console.log('• 24 Verified Tourist Places (12 Hyderabad + 12 Visakhapatnam)');
        console.log('• 4 Multi-Modal Transport Routes (Train, Flight, Bus, Vistadome)');
        console.log('• 4 Iconic Restaurants with authentic regional dishes');
        console.log('• Verified News, Ground-Reality Updates & Cultural Events');
        console.log('=======================================================');

    } catch (err) {
        console.error('[Seed] Error seeding database:', err);
    }
};

module.exports = { seedData };

if (require.main === module) {
    seedData().then(() => process.exit(0)).catch(() => process.exit(1));
}
