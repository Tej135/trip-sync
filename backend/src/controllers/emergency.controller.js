const EmergencyContact = require('../models/emergencyContact.model');
const { sendEmergencySosEmail } = require('../services/email.service');

/**
 * Trigger One-Tap SOS Alert
 */
const triggerSosPanic = async (req, res) => {
    try {
        const { latitude, longitude, address = '' } = req.body;

        const contacts = await EmergencyContact.find({ user: req.user._id });

        // Dispatch emails to all registered contacts
        const dispatchPromises = contacts.map(c => {
            if (c.email) {
                return sendEmergencySosEmail(c.email, req.user.name, latitude, longitude, address);
            }
            return Promise.resolve();
        });

        await Promise.all(dispatchPromises);

        console.log(`🚨 [SOS] Triggered by ${req.user.name} (${req.user.email}) at coordinates: ${latitude}, ${longitude}`);

        res.status(200).json({
            success: true,
            message: `🚨 Emergency SOS Signal broadcasted to ${contacts.length} registered contacts!`,
            data: {
                dispatchedCount: contacts.length,
                coordinates: { latitude, longitude },
                nationalHelplines: {
                    police: '112',
                    womenHelpline: '1091',
                    ambulance: '108',
                    touristHelpline: '1363'
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get user emergency contacts
 */
const getEmergencyContacts = async (req, res) => {
    try {
        const contacts = await EmergencyContact.find({ user: req.user._id }).sort({ isPrimary: -1 });
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Add emergency contact
 */
const addEmergencyContact = async (req, res) => {
    try {
        const { name, relationship, phone, email, isPrimary } = req.body;
        if (!name || !phone || !relationship) {
            return res.status(400).json({ success: false, message: 'Name, phone, and relationship are required' });
        }

        const contact = await EmergencyContact.create({
            user: req.user._id,
            name,
            relationship,
            phone,
            email: email || '',
            isPrimary: !!isPrimary
        });

        res.status(201).json({
            success: true,
            message: 'Emergency contact added',
            data: contact
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Delete emergency contact
 */
const deleteEmergencyContact = async (req, res) => {
    try {
        const contact = await EmergencyContact.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.status(200).json({ success: true, message: 'Emergency contact deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    triggerSosPanic,
    getEmergencyContacts,
    addEmergencyContact,
    deleteEmergencyContact
};
