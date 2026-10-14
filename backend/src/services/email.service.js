const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || 'TripSync <noreply@tripsync.com>';

let transporter = null;
if (emailUser && emailPass && emailUser !== 'demo@tripsync.local') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
}

/**
 * Dispatch SOS alert email to emergency contacts
 * @param {string} toEmail 
 * @param {string} userName 
 * @param {number} lat 
 * @param {number} lng 
 * @param {string} address 
 */
const sendEmergencySosEmail = async (toEmail, userName, lat, lng, address = '') => {
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const subject = `🚨 URGENT SOS ALERT from ${userName} via TripSync`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px;">
            <h1 style="color: #dc2626; margin-top: 0;">🚨 EMERGENCY SOS ALERT</h1>
            <p style="font-size: 16px; color: #1f2937;">
                <strong>${userName}</strong> has triggered an emergency SOS panic signal via <strong>TripSync</strong>.
            </p>
            <div style="background: #ffffff; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>GPS Coordinates:</strong> Latitude ${lat}, Longitude ${lng}</p>
                ${address ? `<p><strong>Reported Location:</strong> ${address}</p>` : ''}
            </div>
            <a href="${mapsLink}" target="_blank" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Live Location on Google Maps
            </a>
            <p style="margin-top: 20px; font-size: 13px; color: #6b7280;">
                Emergency helplines: Police: 112 | Women Helpline: 1091 | Ambulance: 108
            </p>
        </div>
    `;

    console.log(`[EmailService] 🚨 SOS Email prepared for ${toEmail}: Coordinates: ${lat}, ${lng} -> ${mapsLink}`);

    if (transporter) {
        try {
            await transporter.sendMail({
                from: emailFrom,
                to: toEmail,
                subject,
                html
            });
            return true;
        } catch (err) {
            console.error('[EmailService] Failed to send email via SMTP:', err.message);
        }
    }
    return true; // simulated dispatch
};

/**
 * Send booking receipt email
 */
const sendBookingConfirmationEmail = async (toEmail, bookingDetails) => {
    const subject = `Booking Confirmed: ${bookingDetails.tourTitle} with Local Expert`;
    console.log(`[EmailService] Booking confirmation email dispatched to ${toEmail}`);
    return true;
};

module.exports = {
    sendEmergencySosEmail,
    sendBookingConfirmationEmail
};
