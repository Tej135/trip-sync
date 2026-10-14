const exifr = require('exifr');
const fs = require('fs');

/**
 * Calculate Haversine distance between two coordinates in meters
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in meters
 */
const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
};

/**
 * Extract GPS and timestamp metadata from an image file using exifr
 * @param {string} filePath 
 * @returns {Promise<{latitude: number, longitude: number, timestamp: Date}|null>}
 */
const extractExifGps = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        const data = await exifr.parse(filePath, {
            gps: true,
            pick: ['latitude', 'longitude', 'DateTimeOriginal', 'CreateDate']
        });

        if (!data || data.latitude === undefined || data.longitude === undefined) {
            return null;
        }

        return {
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.DateTimeOriginal || data.CreateDate || new Date()
        };
    } catch (err) {
        console.warn('[GeoService] EXIF parsing error:', err.message);
        return null;
    }
};

/**
 * Verify if photo coordinates are within threshold distance of place
 * @param {number} photoLat 
 * @param {number} photoLng 
 * @param {number} placeLat 
 * @param {number} placeLng 
 * @param {number} maxDistanceMeters 
 * @returns {{isValid: boolean, distanceMeters: number}}
 */
const verifyPhotoLocation = (photoLat, photoLng, placeLat, placeLng, maxDistanceMeters = 500) => {
    const distanceMeters = calculateDistanceMeters(photoLat, photoLng, placeLat, placeLng);
    return {
        isValid: distanceMeters <= maxDistanceMeters,
        distanceMeters
    };
};

module.exports = {
    calculateDistanceMeters,
    extractExifGps,
    verifyPhotoLocation
};
