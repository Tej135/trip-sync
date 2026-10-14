import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  DollarSign,
  Clock,
  Compass,
  MapPin,
  X,
  Plus,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { tripsAPI, itineraryAPI } from '../services/api';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

const TripPlannerPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destinationParam = searchParams.get('destination') || 'Visakhapatnam';

  const { isAuthenticated } = useAuth();
  const { trayPlaces, removePlaceFromActiveTrip, refreshTrips, setActiveTrip } = useTrip();

  const [title, setTitle] = useState(`${destinationParam} Coastal & Hills Gateway 2026`);
  const [originCity, setOriginCity] = useState('Hyderabad');
  const [destinationCity, setDestinationCity] = useState(destinationParam);
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-04');
  const [totalBudget, setTotalBudget] = useState(18000);
  const [dailyActiveStart, setDailyActiveStart] = useState('09:00 AM');
  const [dailyActiveEnd, setDailyActiveEnd] = useState('06:00 PM');
  const [personality, setPersonality] = useState('EXPLORER');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Live Budget Partitioning
  const budgetNum = Number(totalBudget) || 18000;
  const transitPartition = Math.round(budgetNum * 0.30);
  const stayPartition = Math.round(budgetNum * 0.35);
  const foodPartition = Math.round(budgetNum * 0.20);
  const ticketsPartition = Math.round(budgetNum * 0.10);
  const bufferPartition = Math.round(budgetNum * 0.05);

  const personalities = [
    { id: 'EXPLORER', icon: '🗺️', label: 'Explorer', desc: 'High energy, maximum sights & historic trails' },
    { id: 'RELAXED', icon: '☕', label: 'Slow & Relaxed', desc: 'Leisurely mornings, scenic cafes & sunset spots' },
    { id: 'CONTENT_CREATOR', icon: '📸', label: 'Content Creator', desc: 'Golden hour lighting, camera rules & viewpoints' },
    { id: 'FAMILY', icon: '👨‍👩‍👧‍👦', label: 'Family', desc: 'Comfortable pace, safe terrain & kid-friendly stops' },
    { id: 'BUDGET_BACKPACKER', icon: '🎒', label: 'Budget Backpacker', desc: 'Hostel vibes, street food thalis & lowest fares' },
  ];

  const handleCreateAndGenerate = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // 1. Create Trip
      const tripRes = await tripsAPI.create({
        title,
        originCity,
        destinationCity,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalBudget: budgetNum,
        travelPersonality: personality,
        dailyActiveWindow: {
          startTime: dailyActiveStart,
          endTime: dailyActiveEnd
        }
      });

      if (!tripRes.data?.success) {
        throw new Error(tripRes.data?.message || 'Failed to create trip');
      }

      const createdTrip = tripRes.data.data;
      setActiveTrip(createdTrip);

      // 2. Add tray places to trip if any
      for (const p of trayPlaces) {
        try {
          await tripsAPI.addPlace(createdTrip._id, p._id || p);
        } catch (err) {
          // ignore duplicate
        }
      }

      // 3. Generate AI Itinerary
      const itinRes = await itineraryAPI.generate(createdTrip._id);
      await refreshTrips();

      // 4. Redirect to Itinerary Timeline
      navigate(`/itinerary/${createdTrip._id}`);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <Badge variant="primary" size="sm">Trip Builder & Smart Itinerary</Badge>
        <h2 className="text-3xl font-extrabold text-white mt-1">Design Your Perfect Journey</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tell us about your trip pace, budget, and route. TripSync clusters stops geographically and builds a realistic, low-stress timetable.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleCreateAndGenerate} className="space-y-8">
        
        {/* Core Trip Parameters */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              1. Destination & Dates
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Where and when are you planning to go?</p>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              What do you want to call this journey?
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Rajasthan Roadtrip 2026"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white font-bold focus:outline-none focus:border-sky-500/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Where are you starting from?
              </label>
              <input
                type="text"
                required
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="e.g. New Delhi"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500/60"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Where are you heading?
              </label>
              <input
                type="text"
                required
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                placeholder="e.g. Jaipur"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500/60"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              When are you traveling?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Departure Date</span>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500/60"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Return Date</span>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-sky-500/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Active Travel Window & Personality */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-sm">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              2. Timing & Travel Vibe
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize your pace to fit your exploration style</p>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-2">
              What's the travel vibe?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {personalities.map((p) => {
                const isSelected = personality === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonality(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white border-sky-400/60 shadow-md ring-1 ring-sky-400/20'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <span className="text-xl mb-1.5 block">{p.icon}</span>
                      <p className={`text-xs font-bold ${isSelected ? 'text-sky-300' : 'text-white'}`}>{p.label}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              What hours do you like to explore?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Morning Start Time</span>
                <input
                  type="text"
                  value={dailyActiveStart}
                  onChange={(e) => setDailyActiveStart(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500/60"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Evening Return to Stay</span>
                <input
                  type="text"
                  value={dailyActiveEnd}
                  onChange={(e) => setDailyActiveEnd(e.target.value)}
                  placeholder="06:00 PM"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-sm text-white font-mono focus:outline-none focus:border-sky-500/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Budget Allocator */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                3. Visual Budget Allocator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Dynamic calculation based on realistic Indian travel costs</p>
            </div>
            <span className="text-xs text-sky-400 font-semibold bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800/40">
              Auto Calculated Breakdown
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              Total Trip Budget Ceiling (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-bold text-slate-400">₹</span>
              <input
                type="number"
                min="3000"
                step="500"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-3 text-xl font-black text-white focus:outline-none focus:border-sky-500/60"
              />
            </div>
          </div>

          {/* Dynamic Visual Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Budget Distribution</span>
              <span>100% Allocated (₹{budgetNum.toLocaleString('en-IN')})</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex shadow-inner border border-slate-800">
              <div style={{ width: '30%' }} className="bg-sky-500 h-full transition-all duration-300" title="Transit: 30%" />
              <div style={{ width: '35%' }} className="bg-purple-500 h-full transition-all duration-300" title="Stay: 35%" />
              <div style={{ width: '20%' }} className="bg-amber-500 h-full transition-all duration-300" title="Food: 20%" />
              <div style={{ width: '10%' }} className="bg-emerald-500 h-full transition-all duration-300" title="Sightseeing: 10%" />
              <div style={{ width: '5%' }} className="bg-rose-500 h-full transition-all duration-300" title="Emergency Buffer: 5%" />
            </div>
          </div>

          {/* Calculated Rupee Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Transit (30%)</span>
              </div>
              <p className="text-base font-black text-white">₹{transitPartition.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Stay (35%)</span>
              </div>
              <p className="text-base font-black text-white">₹{stayPartition.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Food (20%)</span>
              </div>
              <p className="text-base font-black text-white">₹{foodPartition.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Sightseeing (10%)</span>
              </div>
              <p className="text-base font-black text-white">₹{ticketsPartition.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Buffer (5%)</span>
              </div>
              <p className="text-base font-black text-white">₹{bufferPartition.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Place Tray Summary */}
        <div className="glass-card rounded-3xl p-6 border border-slate-700/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                Selected Places Tray ({trayPlaces.length} Spots)
              </h3>
              <p className="text-xs text-slate-400">
                Spots added from the Explore Map to include in your sequence.
              </p>
            </div>
            <Link to="/explore">
              <Button variant="outline" size="sm">
                <Plus className="w-3.5 h-3.5" /> Browse Map
              </Button>
            </Link>
          </div>

          {trayPlaces.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No places currently selected. (The AI engine will automatically pick the top recommended spots for {destinationCity}!)
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trayPlaces.map((p) => (
                <div
                  key={p._id || p}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                >
                  <span>{p.name || 'Tourist Spot'}</span>
                  <button
                    type="button"
                    onClick={() => removePlaceFromActiveTrip(p._id || p)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full py-4 text-base font-extrabold shadow-glow"
        >
          <Sparkles className="w-5 h-5 text-white" />
          Generate Optimized AI Itinerary & Timetable
        </Button>
      </form>
    </div>
  );
};

export default TripPlannerPage;
