const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || `"TripSync" <${emailUser || 'noreply@tripsync.com'}>`;

let transporter = null;

// Support OAuth2 or direct User/Pass
if (emailUser && process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.REFRESH_TOKEN) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: emailUser,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    });
} else if (emailUser && emailPass && emailUser !== 'demo@tripsync.local') {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
}

if (transporter) {
    transporter.verify((error) => {
        if (error) {
            console.error('[EmailService] SMTP Server connection failed:', error.message);
        } else {
            console.log('[EmailService] SMTP Server ready to dispatch emails');
        }
    });
}

/**
 * Core sendEmail helper
 */
const sendEmail = async (to, subject, text, html) => {
    console.log(`[EmailService] 📧 Sending email to ${to} | Subject: "${subject}"`);
    if (!transporter) {
        console.log(`[EmailService] (Simulation Mode - No active SMTP credentials provided)`);
        console.log(`[EmailService] Text Preview: ${text.slice(0, 100)}...`);
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: emailFrom,
            to,
            subject,
            text,
            html,
        });
        console.log(`[EmailService] ✅ Email dispatched successfully: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error(`[EmailService] ❌ Failed to dispatch email to ${to}:`, err.message);
        return false;
    }
};

/**
 * 1. Login Notification Email
 */
const sendLoginEmail = async (userEmail, name, loginTime = new Date().toLocaleString(), ipAddress = '') => {
    const subject = '🔐 Security Alert: New Login to TripSync';
    const text = `Hello ${name},\n\nYou have successfully logged into your TripSync account on ${loginTime}${ipAddress ? ` from IP: ${ipAddress}` : ''}.\n\nIf this was not you, please secure your account immediately.\n\nBest regards,\nThe TripSync Security Team`;
    
    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">TripSync Security Alert</h1>
            </div>
            <div style="padding: 28px 24px;">
                <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Hello <strong>${name}</strong>,</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                    We noticed a new login to your <strong>TripSync</strong> account.
                </p>
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
                    <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>🕒 Date & Time:</strong> ${loginTime}</p>
                    ${ipAddress ? `<p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>🌐 IP Address:</strong> ${ipAddress}</p>` : ''}
                    <p style="margin: 4px 0; font-size: 14px; color: #334155;"><strong>🛡️ Status:</strong> Authentication Successful</p>
                </div>
                <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                    If this was you, you can safely disregard this email. If you did not log in, please reset your password immediately.
                </p>
            </div>
            <div style="background: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} TripSync Enterprise. All rights reserved.</p>
            </div>
        </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
};

/**
 * 2. Payment Success Email
 */
const sendPaymentSuccessEmail = async (userEmail, name, amount, itemOrPlan = 'TripSync Services', transactionId = '') => {
    const subject = '🎉 Payment Successful - TripSync Receipt';
    const text = `Hello ${name},\n\nYour payment of ₹${amount} for ${itemOrPlan} was successful!\nTransaction ID: ${transactionId}\n\nThank you for choosing TripSync.\n\nBest regards,\nThe TripSync Billing Team`;

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Receipt</h1>
            </div>
            <div style="padding: 28px 24px;">
                <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Hello <strong>${name}</strong>,</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                    Thank you for your payment! Your transaction has been processed successfully.
                </p>
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 18px; margin: 20px 0;">
                    <p style="margin: 4px 0; font-size: 15px; color: #166534;"><strong>Item / Service:</strong> ${itemOrPlan}</p>
                    <p style="margin: 4px 0; font-size: 15px; color: #166534;"><strong>Amount Paid:</strong> ₹${amount}</p>
                    ${transactionId ? `<p style="margin: 4px 0; font-size: 14px; color: #15803d;"><strong>Razorpay Payment ID:</strong> ${transactionId}</p>` : ''}
                    <p style="margin: 4px 0; font-size: 14px; color: #15803d;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p style="color: #475569; font-size: 14px;">Your receipt and features are now fully active in your account.</p>
            </div>
            <div style="background: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} TripSync Enterprise. All rights reserved.</p>
            </div>
        </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
};

/**
 * 3. Payment Failure Email
 */
const sendPaymentFailureEmail = async (userEmail, name, amount, itemOrPlan = 'TripSync Services', failureReason = 'Payment verification declined or cancelled.') => {
    const subject = '⚠️ Payment Failed - TripSync';
    const text = `Hello ${name},\n\nWe were unable to process your payment of ₹${amount} for ${itemOrPlan}.\nReason: ${failureReason}\n\nPlease try again or use another payment method.\n\nBest regards,\nThe TripSync Billing Team`;

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Payment Failed</h1>
            </div>
            <div style="padding: 28px 24px;">
                <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Hello <strong>${name}</strong>,</p>
                <p style="color: #475569; font-size: 15px; line-height: 1.6;">
                    We regret to inform you that your recent payment attempt on <strong>TripSync</strong> could not be completed.
                </p>
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 18px; margin: 20px 0;">
                    <p style="margin: 4px 0; font-size: 15px; color: #991b1b;"><strong>Service:</strong> ${itemOrPlan}</p>
                    <p style="margin: 4px 0; font-size: 15px; color: #991b1b;"><strong>Amount Attempted:</strong> ₹${amount}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #b91c1c;"><strong>Reason:</strong> ${failureReason}</p>
                    <p style="margin: 4px 0; font-size: 14px; color: #b91c1c;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                    No funds were deducted from your account. If amount was debited by your bank, it will be automatically refunded within 3-5 business days.
                </p>
            </div>
            <div style="background: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 12px; color: #64748b;">&copy; ${new Date().getFullYear()} TripSync Enterprise. All rights reserved.</p>
            </div>
        </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
};

/**
 * 4. Welcome / Registration Email (from template)
 */
const sendRegistrationEmail = async (userEmail, name) => {
    const subject = 'Welcome to TripSync!';
    const text = `Hello ${name},\n\nThank you for registering at TripSync. We're excited to have you on board!\n\nBest regards,\nThe TripSync Team`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; border-radius: 8px;">
            <h2>Welcome to TripSync, ${name}!</h2>
            <p>Thank you for joining our community of travelers and explorers.</p>
            <p>You can now plan trips, discover hidden gems, book local experts, and split expenses seamlessly.</p>
            <br>
            <p>Best regards,<br><strong>The TripSync Team</strong></p>
        </div>
    `;
    return await sendEmail(userEmail, subject, text, html);
};

/**
 * 5. Emergency SOS Email
 */
const sendEmergencySosEmail = async (toEmail, userName, lat, lng, address = '') => {
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const subject = `🚨 URGENT SOS ALERT from ${userName} via TripSync`;
    const text = `URGENT SOS ALERT: ${userName} has triggered an emergency SOS panic signal at coordinates ${lat}, ${lng}. Google Maps: ${mapsLink}`;
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

    return await sendEmail(toEmail, subject, text, html);
};

/**
 * 6. Booking Confirmation Email
 */
const sendBookingConfirmationEmail = async (toEmail, bookingDetails) => {
    const subject = `Booking Confirmed: ${bookingDetails.tourTitle} with Local Expert`;
    const text = `Booking Confirmed for ${bookingDetails.tourTitle} on ${bookingDetails.bookingDate}. Total Amount: ₹${bookingDetails.totalAmount}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px;">
            <h2 style="color: #15803d;">Booking Confirmed!</h2>
            <p><strong>Tour:</strong> ${bookingDetails.tourTitle}</p>
            <p><strong>Date:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ₹${bookingDetails.totalAmount}</p>
        </div>
    `;
    return await sendEmail(toEmail, subject, text, html);
};

module.exports = {
    sendEmail,
    sendLoginEmail,
    sendPaymentSuccessEmail,
    sendPaymentFailureEmail,
    sendRegistrationEmail,
    sendEmergencySosEmail,
    sendBookingConfirmationEmail
};
