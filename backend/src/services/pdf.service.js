const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const bookletsDir = path.join(__dirname, '../../uploads/booklets');
if (!fs.existsSync(bookletsDir)) {
    fs.mkdirSync(bookletsDir, { recursive: true });
}

/**
 * Generate a complete offline travel booklet PDF
 * @param {object} trip 
 * @param {object} itinerary 
 * @param {Array} emergencyContacts 
 * @returns {Promise<string>} relative file path to PDF
 */
const generateTravelBooklet = async (trip, itinerary, emergencyContacts = []) => {
    return new Promise((resolve, reject) => {
        const filename = `tripsync-booklet-${trip._id}-${Date.now()}.pdf`;
        const filePath = path.join(bookletsDir, filename);
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Header / Title banner
        doc.rect(0, 0, doc.page.width, 100).fill('#0f172a');
        doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('TripSync Offline Travel Field Guide', 50, 30);
        doc.fontSize(12).font('Helvetica').text(`Destination: ${trip.destinationCity} | Traveler: ${trip.owner?.name || 'Explorer'}`, 50, 65);

        doc.moveDown(4);
        doc.fillColor('#0f172a');

        // Trip Snapshot
        doc.fontSize(16).font('Helvetica-Bold').text('Trip Overview & Budget Breakdown', 50, 120);
        doc.fontSize(10).font('Helvetica').fillColor('#334155');
        doc.text(`Duration: ${trip.totalDays} Days (${new Date(trip.startDate).toDateString()} - ${new Date(trip.endDate).toDateString()})`, 50, 145);
        doc.text(`Daily Exploration Window: ${trip.dailyActiveWindow?.startTime || '09:00 AM'} to ${trip.dailyActiveWindow?.endTime || '06:00 PM'}`, 50, 160);
        doc.text(`Total Budget: INR ${trip.totalBudget?.toLocaleString('en-IN')}`, 50, 175);
        doc.text(`Archetype: ${trip.travelPersonality || 'EXPLORER'}`, 50, 190);

        doc.moveDown(2);

        // Day by Day Itinerary
        let currentY = 220;
        doc.fontSize(16).font('Helvetica-Bold').fillColor('#0f172a').text('Day-by-Day Field Schedule', 50, currentY);
        currentY += 25;

        if (itinerary && itinerary.days && itinerary.days.length > 0) {
            itinerary.days.forEach((day, index) => {
                if (currentY > 680) {
                    doc.addPage();
                    currentY = 50;
                }

                doc.fontSize(13).font('Helvetica-Bold').fillColor('#2563eb').text(`Day ${day.dayNumber}: ${day.theme || 'Exploration'}`, 50, currentY);
                currentY += 18;
                doc.fontSize(9).font('Helvetica-Oblique').fillColor('#64748b').text(`Weather Forecast: ${day.weatherSummary?.condition || 'Clear'}, ${day.weatherSummary?.tempC || 28}°C | Rain Risk: ${day.weatherSummary?.rainProbability || 5}%`, 50, currentY);
                currentY += 16;

                if (day.slots && day.slots.length > 0) {
                    day.slots.forEach(slot => {
                        if (currentY > 730) {
                            doc.addPage();
                            currentY = 50;
                        }

                        doc.fontSize(10).font('Helvetica-Bold').fillColor('#0f172a').text(`• [${slot.startTime} - ${slot.endTime}] ${slot.title}`, 65, currentY);
                        currentY += 13;

                        if (slot.transitDetails && slot.transitDetails.instructions) {
                            doc.fontSize(8).font('Helvetica').fillColor('#475569').text(`   Transit: ${slot.transitDetails.mode} (~${slot.transitDetails.distanceKm} km, INR ${slot.transitDetails.estimatedFare}) - ${slot.transitDetails.instructions}`, 65, currentY);
                            currentY += 12;
                        }

                        if (slot.mealDetails && slot.mealDetails.recommendedDish) {
                            doc.fontSize(8).font('Helvetica').fillColor('#16a34a').text(`   Must-try Dish: ${slot.mealDetails.recommendedDish} (${slot.mealDetails.cuisine || 'Local'})`, 65, currentY);
                            currentY += 12;
                        }

                        if (slot.notes) {
                            doc.fontSize(8).font('Helvetica-Oblique').fillColor('#64748b').text(`   Note: ${slot.notes}`, 65, currentY);
                            currentY += 12;
                        }

                        currentY += 4;
                    });
                }
                currentY += 10;
            });
        }

        // New Page: Emergency & Language Phrasebook
        doc.addPage();
        doc.rect(0, 0, doc.page.width, 40).fill('#dc2626');
        doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('Emergency SOS Directory & Contacts', 50, 12);

        doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text('National Emergency Helplines (Dial Free):', 50, 60);
        doc.fontSize(9).font('Helvetica').fillColor('#334155');
        doc.text('• Police & General Emergency: 112', 65, 80);
        doc.text('• Women Safety Helpline: 1091', 65, 95);
        doc.text('• Medical Ambulance: 108', 65, 110);
        doc.text('• Tourist Police Helpline: 1363 (24x7 Multi-lingual support)', 65, 125);

        doc.moveDown();
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#0f172a').text('Registered Personal Emergency Contacts:', 50, 150);
        let contactY = 170;
        if (emergencyContacts.length > 0) {
            emergencyContacts.forEach(contact => {
                doc.fontSize(9).font('Helvetica').fillColor('#334155').text(`• ${contact.name} (${contact.relationship}): ${contact.phone}`, 65, contactY);
                contactY += 16;
            });
        } else {
            doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('• None registered in profile.', 65, contactY);
            contactY += 16;
        }

        // Regional Phrasebook Section
        const phraseY = contactY + 20;
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#0f172a').text('Survival Language Phrasebook (Hindi / Local)', 50, phraseY);
        
        const phrases = [
            { english: 'Please help me', phonetic: 'Kripya meri madad kijiye', usage: 'Emergency' },
            { english: 'Where is the hospital?', phonetic: 'Aspataal kahan hai?', usage: 'Medical' },
            { english: 'Take me to this location', phonetic: 'Mujhe is jagah le chaliye', usage: 'Cab / Auto' },
            { english: 'How much does this cost?', phonetic: 'Yeh kitne ka hai?', usage: 'Shopping' },
            { english: 'No meat / Pure vegetarian food', phonetic: 'Shuddh shakahari khana chahiye', usage: 'Food' },
            { english: 'Can you use the meter?', phonetic: 'Kya aap meter se chalenge?', usage: 'Taxi' },
            { english: 'Where is the police station?', phonetic: 'Police station kahan hai?', usage: 'Safety' },
            { english: 'Is this water safe to drink?', phonetic: 'Kya yeh peene ka paani hai?', usage: 'Health' }
        ];

        let py = phraseY + 25;
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#1e293b').text('English', 50, py);
        doc.text('Phonetic Pronunciation', 200, py);
        doc.text('Category', 420, py);
        py += 15;
        doc.moveTo(50, py).lineTo(540, py).stroke('#cbd5e1');
        py += 10;

        phrases.forEach(p => {
            doc.fontSize(8.5).font('Helvetica').fillColor('#0f172a').text(p.english, 50, py);
            doc.font('Helvetica-Oblique').fillColor('#2563eb').text(p.phonetic, 200, py);
            doc.font('Helvetica').fillColor('#64748b').text(p.usage, 420, py);
            py += 18;
        });

        // Footer note
        doc.fontSize(8).fillColor('#94a3b8').text('Generated by TripSync Platform. Keep a printed or cached copy for offline mountain/remote travel.', 50, 750, { align: 'center' });

        doc.end();

        writeStream.on('finish', () => {
            resolve(`/uploads/booklets/${filename}`);
        });

        writeStream.on('error', (err) => {
            reject(err);
        });
    });
};

module.exports = {
    generateTravelBooklet
};
