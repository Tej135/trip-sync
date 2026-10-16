# 🌍 TripSync — Smart Multi-Modal Travel Planning, Geospatial Discovery & Verified Community Platform

<p align="center">
  <strong>A production-grade, full-stack travel ecosystem engineered to unify travel discovery, multi-modal transport routing, AI-sequenced itineraries, ground-truth safety verification, group expense settling, and local expert consultations into one centralized platform.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_18_%7C_Vite_%7C_Tailwind_CSS-38bdf8?style=for-the-badge&logo=react" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-Node.js_%7C_Express-22c55e?style=for-the-badge&logo=node.js" alt="Backend" />
  <img src="https://img.shields.io/badge/Database-MongoDB_%7C_GeoJSON_2dsphere-10b981?style=for-the-badge&logo=mongodb" alt="Database" />
  <img src="https://img.shields.io/badge/Map-Leaflet_%7C_OpenStreetMap-eab308?style=for-the-badge&logo=leaflet" alt="Map" />
  <img src="https://img.shields.io/badge/AI-Dynamic_Itinerary_Sequencer-a855f7?style=for-the-badge" alt="AI" />
</p>

---

## 📌 Table of Contents

1. [The Problem TripSync Solves](#-the-problem-tripsync-solves)
2. [Key Features Walkthrough](#-key-features-walkthrough)
3. [System Architecture](#-system-architecture)
4. [Technology Stack](#-technology-stack)
5. [Prerequisites](#-prerequisites)
6. [Step-by-Step Installation & Setup](#-step-by-step-installation--setup)
7. [Running the Application](#-running-the-application)
   - [Option A: One-Click Windows Launcher (Easiest)](#option-a-one-click-windows-launcher-easiest)
   - [Option B: Manual Terminals (PowerShell / CMD)](#option-b-manual-terminals-powershell--cmd)
   - [Troubleshooting Windows PowerShell Script Policy](#-troubleshooting-windows-powershell-script-policy)
8. [Demo Accounts & Pre-Loaded Credentials](#-demo-accounts--pre-loaded-credentials)
9. [API Endpoints Manifest](#-api-endpoints-manifest)
10. [Folder & Directory Structure](#-folder--directory-structure)
11. [Git Workflow & Repository Management](#-git-workflow--repository-management)
12. [License](#-license)

---

## 💡 The Problem TripSync Solves

Modern travelers currently suffer from a fragmented process spread across 5 to 7 disjointed applications:

```
[IRCTC / RedBus / Skyscanner]  -->  Check trains, flights, buses, and cabs separately
[Instagram / YouTube]          -->  Find scenic spots without knowing drone bans or camera permit fees
[Google / TripAdvisor]         -->  Read unverified or fake reviews from accounts that never visited
[Manual Google Docs / Notes]   -->  Guess travel times, walk into scorching midday heat or unlit alleys
[Splitwise / WhatsApp]         -->  Manual spreadsheet expense tallying with no direct UPI settlement
```

### The TripSync Solution:
TripSync unifies this entire journey into a single intelligent platform:
- **Compare All Modes on One Screen:** Trains, Flights, Buses, Cabs with carbon footprint metrics and live deep booking links.
- **Inspect Ground Reality:** Check 10-point Safety Scores, solo female safety ratings, lighting conditions, and drone/camera rules before stepping out.
- **Trust Authentic Reviews:** Proof-of-Travel dual-tier validation (GPS Dwell + Photo EXIF metadata) awards verified badges.
- **AI-Sequenced Itineraries:** Weather-aware, sun-safe scheduling with a dynamic **"What-If" Replanner**.
- **Offline Travel Booklet:** Export a downloadable PDF guide complete with day schedules, SOS contacts, and regional phrases.
- **Splitwise + UPI:** Group cost splitting with debt simplification and direct one-click UPI payment deep links.

---

## 🚀 Key Features Walkthrough

### 1. 🚆 Multi-Modal Transport Comparison & Carbon Footprint
- Side-by-side journey comparison for **Train, Flight, Bus, Cab, and Ferry**.
- Real-time travel duration, departure/arrival schedules, and intermediate stop counts.
- Multiple fare classes (e.g., *Sleeper, 3rd AC, Executive Chair, Volvo AC, Economy Flight*).
- **Eco-Aware Travel:** Calculates **kg CO₂ emissions per passenger** and highlights the **Green Choice**.
- **Live Booking Deep Links:** Direct, one-click redirects to **IRCTC train search**, **Google Flights**, and **RedBus**.

### 2. 🗺️ Geospatial Discovery & Interactive Map
- Built with **Leaflet** and **OpenStreetMap**, with smooth custom marker categorization:
  - 🏰 *Heritage & Forts*
  - 🌅 *Sunset & Viewpoints*
  - 🌿 *Nature & Beaches*
  - 🍛 *Iconic Food & Cafes*
  - 🧗 *Adventure & Culture*
- Includes 30 pre-seeded destinations across **Jaipur (Pink City)** and **South Goa**.

### 3. 🛡️ 10-Point Safety Score Breakdown
Each tourist spot features an in-depth safety audit:
- **Solo Traveler Index:** Friendliness and ease of solo navigation.
- **Evening Lighting Score:** Visibility and lighting after dusk.
- **Women Safety Index:** Dedicated crowd and harassment ratings.
- **Police / Tourist Kiosk Proximity:** Distance to nearest emergency help.
- **Active Hours Window:** Safe visiting window (e.g., `06:00 AM – 06:30 PM`).

### 4. 📸 Content Creator Zone
Designed specifically for photographers, videographers, and vloggers:
- **Drone Status:** Clear categorization (*Strict Ban / DGCA Permit Required / Allowed*).
- **Equipment Rules:** Tripod and commercial gimbal restrictions.
- **Permit Fees:** Official commercial camera charges in ₹ INR.
- **Golden Hour Timings:** Optimal sunrise/sunset photography angles and timings.

### 5. 🔍 Proof-of-Travel Verified Community Reviews
Eliminates fake and sponsored reviews via a dual-layer verification engine:
- **Tier 1 (GPS Dwell Check):** Verifies the user stayed within 250 meters of the spot for at least 15 minutes.
- **Tier 2 (Photo EXIF Inspection):** Uses `exifr` on the backend to inspect original metadata (GPS coordinates, camera model, timestamp) from uploaded travel photos.
- Authentic reviews receive the coveted **Verified Traveler** shield badge.

### 6. 🧠 AI-Powered Dynamic Itinerary Sequencing
- **Proximity-Based Clustering:** Eliminates back-and-forth travel across the city.
- **Sun & Heat Protection:** Automatically moves exposed outdoor forts out of the scorching 12:00 PM – 3:00 PM window.
- **Safety Window Enforcement:** Ensures solo travelers finish outdoor sightseeing before sunset.
- **Meal Integration:** Automatically reserves slots at famous regional restaurants (e.g., *LMB Jaipur, Rawat Mishthan Bhandar, Martin's Corner Goa*).
- **"What-If" Dynamic Replanner:** Simulate unforeseen changes with one click:
  - 🌧️ *Rain Protection Swap:* Automatically replaces exposed outdoor forts with museums and indoor palaces.
  - ⏰ *Woke Up Late (11:00 AM Start):* Re-sequences the day without dropping key bucket-list spots.
  - 📅 *Extend Trip (+1 Day):* Re-distributes pace and adds remaining sights.
  - 💵 *Increase Budget (+₹5,000):* Upgrades shared transit to private AC cabs.

### 7. 📄 Offline Travel Booklet PDF Generation
- Powered by `pdfkit` on the backend.
- Generates a beautifully styled, print-ready PDF containing:
  - Complete day-by-day timetable & activity slots
  - Essential local dialect phrases & survival vocabulary
  - Emergency SOS contacts, police stations, and hospitals
  - Offline landmark navigation notes

### 8. 💰 Group Cost Splitter & Debt Matrix (Splitwise + UPI)
- Log shared expenses with equal or exact splits across trip companions.
- **Debt Simplification Algorithm:** Minimizes total cross-settlement cash transfers between friends.
- **UPI Deep Links:** Direct `upi://pay` links for instant one-tap settlement via Google Pay, PhonePe, or Paytm.

### 9. 🤝 Local Expert Marketplace & Razorpay Payments
- Connect with verified local guides (e.g., certified Jaipur Heritage historians, Goa hidden beach guides).
- View hourly rates, domain expertise, and verified client ratings.
- Integrated with **Razorpay Payment Gateway** (Order creation, HMAC-SHA256 signature verification, and automated email receipts).

### 10. 🚨 Emergency SOS & Panic Dispatch
- One-touch emergency beacon broadcasts traveler coordinates, battery status, and emergency notes to registered contacts and nearest local police/tourist helplines.

### 11. 🤖 AI Travel Copilot Chatbot
- Floating contextual copilot ready to answer questions on dress codes, best sunset spots, taxi fare estimates, and emergency guidance.

### 12. 🔐 Security, JWT Blacklist & Email Dispatch
- **Token Blacklist on Logout:** True session invalidation using MongoDB TTL indexing so logged-out tokens cannot be reused.
- **Automated Email Service:** Nodemailer integration (Gmail SMTP & OAuth2) dispatching real-time login security alerts, booking receipts, and payment failure notifications.

---

## 🏗️ System Architecture

```
                       +-----------------------------------+
                       |         TripSync Client           |
                       |    (React 18 + Vite + Tailwind)   |
                       +-----------------+-----------------+
                                         |
                                         | HTTP / REST (port 5173 -> 3000)
                                         v
                       +-----------------+-----------------+
                       |     TripSync Express Backend      |
                       |         (Node.js CommonJS)        |
                       +-----------------+-----------------+
                                         |
            +----------------------------+----------------------------+
            |                            |                            |
            v                            v                            v
  +---------+---------+        +---------+---------+        +---------+---------+
  |  MongoDB Database |        |   Core Services   |        | External APIs /   |
  | (GeoJSON 2dsphere |        | • AI Sequencer    |        | Live Deep Links   |
  | + MongoMemorySrvr)|        | • PDFKit Booklet  |        | • IRCTC Search    |
  +-------------------+        | • Debt Simplifier |        | • Google Flights  |
                               | • EXIF Inspector  |        | • RedBus          |
                               | • Weather Engine  |        | • UPI Payment     |
                               +-------------------+        +-------------------+
```

---

## 💻 Technology Stack

### Frontend:
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom glassmorphism & dark-mode theme
- **Mapping:** Leaflet & React-Leaflet with OpenStreetMap tiles
- **Routing:** React Router v6
- **Icons:** Lucide React
- **HTTP Client:** Axios (with Bearer token interceptor)
- **Charts & Metrics:** Recharts

### Backend:
- **Runtime:** Node.js (CommonJS `require` / `module.exports`)
- **Web Framework:** Express.js
- **Database:** MongoDB / Mongoose with `2dsphere` geospatial indexing
- **Zero-Friction Fallback:** `mongodb-memory-server` (automatic in-memory database if no local MongoDB service is running)
- **Authentication:** JWT (JSON Web Tokens) with secure HTTP-only cookies
- **Password Security:** bcryptjs
- **File Upload & EXIF:** Multer + `exifr` metadata parser
- **PDF Engine:** PDFKit
- **Payment Gateway:** Razorpay SDK (simulated test mode)

---

## 📋 Prerequisites

Before setting up TripSync, ensure your system has:
- **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm:** v9.0.0 or higher (bundled with Node.js)
- **Git:** Installed on your machine ([Download Git](https://git-scm.com/))
- *(Optional)* **MongoDB Community Server:** If not installed, TripSync automatically starts an embedded in-memory MongoDB instance with zero configuration.

---

## ⚙️ Step-by-Step Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/TripSync.git
cd TripSync
```

### 2. Configure Backend Environment
Navigate to the `backend` folder and review `.env`:
```bash
cd backend
```
A default `.env` is already configured for local development:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/tripsync
JWT_SECRET=tripsync_production_grade_jwt_secret_key_2026_super_secure!
JWT_EXPIRES_IN=3d
CLIENT_URL=http://localhost:5173
```
Install backend dependencies:
```bash
npm install
```

### 3. Populate Comprehensive Seed Data
Run the database seed script to load 30 destinations, multi-modal routes, local experts, and sample reviews:
```bash
node src/seed.js
```

### 4. Configure Frontend Environment
In a new terminal, navigate to the `frontend` folder:
```bash
cd ../frontend
npm install
```

---

## ▶️ Running the Application

### Option A: One-Click Windows Launcher (Easiest)
In Windows File Explorer, double-click:
```text
start-tripsync.bat
```
This launcher automatically:
1. Boots the Express backend server on port 3000
2. Boots the Vite frontend dev server on port 5173
3. Automatically opens **http://localhost:5173** in your default web browser

---

### Option B: Manual Terminals (PowerShell / Git Bash)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:3000` (or run `node server.js`)*

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

### ⚠️ Troubleshooting Windows PowerShell Script Policy

If you encounter this error in PowerShell when running `npm`:
```
npm : File C:\...\npm.ps1 cannot be loaded because running scripts is disabled on this system. (PSSecurityException)
```

**Fix (run once in PowerShell):**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
*Or simply run `npm.cmd run dev` which bypasses the script restriction directly.*

---

## 🔑 Demo Accounts & Pre-Loaded Credentials

You can use the **"Demo Traveler"** quick login button on the login screen, or sign in with any of these pre-configured user profiles:

| Role | Email | Password | Pre-Loaded Context |
|---|---|---|---|
| **Traveler (Explorer)** | `traveler@tripsync.com` | `password123` | Active Jaipur trips, timeline, and expenses |
| **Content Creator** | `creator@tripsync.com` | `password123` | Photography & drone spots enthusiast |
| **Solo Female Traveler** | `ananya@tripsync.com` | `password123` | Safety score verified community reviewer |
| **Local Expert** | `rajesh.jaipur@tripsync.com` | `password123` | Certified Jaipur Heritage guide |
| **System Administrator** | `admin@tripsync.com` | `password123` | Full administrative oversight & content control |

---

## 📡 API Endpoints Manifest

All backend routes are mounted under `/api/v1/`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & uptime status check |
| `POST` | `/api/v1/auth/login` | Authenticate user (JWT cookie + Bearer token) & send login email |
| `POST` | `/api/v1/auth/register` | Register new traveler profile & send welcome email |
| `POST` | `/api/v1/auth/logout` | Invalidate active token via Blacklist & clear auth cookie |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/v1/payment/config` | Retrieve public Razorpay Key ID |
| `POST` | `/api/v1/payment/create-order` | Create Razorpay payment order in INR |
| `POST` | `/api/v1/payment/verify` | Verify payment signature and dispatch receipt email |
| `GET` | `/api/v1/places` | List tourist places with safety & creator filters |
| `GET` | `/api/v1/places/nearby` | GeoJSON `$near` radius search |
| `GET` | `/api/v1/places/:identifier` | Detailed place inspection (Safety & Creator rules) |
| `GET` | `/api/v1/transport/compare` | Multi-modal route comparison (Train/Flight/Bus/Cab) |
| `POST` | `/api/v1/trips` | Create trip with automated budget partitioning |
| `GET` | `/api/v1/trips` | Get current user's trips |
| `POST` | `/api/v1/itinerary/generate` | AI-powered clustered schedule generator |
| `POST` | `/api/v1/itinerary/what-if` | Dynamic itinerary replanner (Rain, Late, Budget) |
| `GET` | `/api/v1/booklet/download/:tripId` | Download offline PDF travel booklet |
| `POST` | `/api/v1/expenses` | Add shared expense & recalculate debts |
| `GET` | `/api/v1/expenses/trip/:tripId` | Fetch Splitwise debt matrix & UPI deep links |
| `GET` | `/api/v1/experts` | Browse certified local guides |
| `POST` | `/api/v1/experts/:id/book` | Book consultation (Razorpay checkout) |
| `POST` | `/api/v1/emergency/sos` | Dispatch emergency SOS alert & GPS broadcast |
| `POST` | `/api/v1/chat` | AI Travel Copilot chatbot query |

---

## 📁 Folder & Directory Structure

```
TripSync/
├── .gitignore                     # Git ignore rules for node_modules, .env, builds
├── README.md                      # Comprehensive project documentation
├── start-tripsync.bat             # One-click Windows application launcher
│
├── backend/                       # Express Node.js Backend
│   ├── .env                       # Environment configuration
│   ├── .env.example               # Example environment template
│   ├── package.json               # Backend dependencies & scripts
│   ├── server.js                  # App entry point & server listener (outside src)
│   ├── uploads/                   # Uploaded media & cached PDF booklets
│   └── src/
│       ├── app.js                 # Express application & middleware assembly
│       ├── seed.js                # Database seeder (30 places, routes, experts)
│       ├── controllers/           # Express route controllers (Auth, Payment, Places, etc.)
│       ├── db/                    # Mongoose connection & in-memory fallback
│       ├── middlewares/           # JWT Auth, Token Blacklist, Role Guard, Multer, Error Handler
│       ├── models/                # Mongoose Schemas (GeoJSON 2dsphere, User, Blacklist, etc.)
│       ├── routes/                # REST API routes (Auth, Payment, Trips, etc.)
│       └── services/              # AI Sequencer, PDFKit, Razorpay, Email, Weather, Geo
│
└── frontend/                      # React 18 Vite Frontend
    ├── index.html                 # HTML shell with Google Fonts & Leaflet styles
    ├── package.json               # Frontend dependencies & scripts
    ├── postcss.config.js          # PostCSS configuration
    ├── tailwind.config.js         # Tailwind CSS design system tokens
    ├── vite.config.js             # Vite config with backend proxy (/api & /uploads)
    └── src/
        ├── App.jsx                # Application root with context providers
        ├── AppRoutes.jsx          # Route definitions
        ├── index.css              # Global styles, glassmorphism & scrollbars
        ├── main.jsx               # React DOM entry point
        ├── components/            # Reusable UI components
        │   ├── chat/              # AI Travel Copilot Chat Widget
        │   ├── common/            # Badge, Button, Modal, Loader
        │   ├── expenses/          # DebtMatrix & ExpenseList with UPI
        │   ├── itinerary/         # TimelineView, ActivitySlot, WhatIfModal
        │   ├── map/               # MapboxView (Leaflet interactive map)
        │   └── places/            # PlaceDetailModal, SafetyScoreCard, CreatorZone
        ├── context/               # AuthContext & TripContext
        ├── layouts/               # MainLayout & Navbar
        ├── pages/                 # 14 Full Page Views
        └── services/              # Axios API service client
```

---

## 🌿 Git Workflow & Repository Management

To commit and push updates to your GitHub repository:

```bash
# 1. Check current repository status
git status

# 2. Stage all modifications
git add .

# 3. Create a descriptive commit
git commit -m "feat: complete TripSync multi-modal travel platform"

# 4. Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/your-username/TripSync.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📜 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute for personal and commercial projects.
