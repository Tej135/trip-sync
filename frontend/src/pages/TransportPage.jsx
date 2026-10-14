import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Train,
  Plane,
  Bus,
  Car,
  Clock,
  Leaf,
  ExternalLink,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle2,
  ArrowLeftRight
} from 'lucide-react';
import { transportAPI } from '../services/api';
import MapboxView from '../components/map/MapboxView';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const TransportPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSource = searchParams.get('source') || 'Hyderabad';
  const initialDestination = searchParams.get('destination') || 'Visakhapatnam';

  const [source, setSource] = useState(initialSource);
  const [destination, setDestination] = useState(initialDestination);
  const [modeFilter, setModeFilter] = useState('');
  const [sortBy, setSortBy] = useState('fare');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async (src = source, dst = destination) => {
    try {
      setLoading(true);
      const res = await transportAPI.compare({
        source: src,
        destination: dst,
        mode: modeFilter || undefined,
        sortBy
      });
      if (res.data?.success) {
        setRoutes(res.data.data);
      }
    } catch (err) {
      console.error('Fetch routes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes(source, destination);
  }, [modeFilter, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ source, destination });
    fetchRoutes(source, destination);
  };

  const handleSwapCities = () => {
    const nextSource = destination;
    const nextDestination = source;
    setSource(nextSource);
    setDestination(nextDestination);
    setSearchParams({ source: nextSource, destination: nextDestination });
    fetchRoutes(nextSource, nextDestination);
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'TRAIN': return Train;
      case 'FLIGHT': return Plane;
      case 'BUS': return Bus;
      default: return Car;
    }
  };

  const getFormattedOperatorName = (route) => {
    const name = route.operatorName || '';
    if (/vande bharat/i.test(name)) {
      return route.routeCode ? `Vande Bharat Express #${route.routeCode}` : 'Vande Bharat Express #20978';
    }
    if (/indigo/i.test(name)) {
      return route.routeCode ? `IndiGo #${route.routeCode}` : 'IndiGo #6E-7201';
    }
    if (/zingbus/i.test(name)) {
      return 'Zingbus Electric Intercity';
    }
    if (/air india/i.test(name)) {
      return route.routeCode ? `Air India Express #${route.routeCode}` : 'Air India Express #IX-114';
    }
    return route.routeCode ? `${name} #${route.routeCode}` : name;
  };

  const getAmenityTags = (route) => {
    const perks = (route.classes?.flatMap(c => c.perks || []) || []).join(' ').toLowerCase();
    const lowerName = (route.operatorName || '').toLowerCase();
    const tags = [];

    if (route.mode === 'TRAIN') {
      if (lowerName.includes('vande bharat') || perks.includes('breakfast') || perks.includes('snack') || perks.includes('meal')) {
        tags.push('☕ Breakfast Included');
      }
      tags.push('⚡ Charging Port at Seat');
      tags.push('📶 On-board Wi-Fi');
    } else if (route.mode === 'BUS') {
      tags.push('🛏️ AC Sleeper 2+1');
      tags.push('⚡ Charging Port at Seat');
      tags.push('📶 On-board Wi-Fi');
    } else if (route.mode === 'FLIGHT') {
      tags.push('⚡ Charging Port at Seat');
      tags.push('📶 On-board Wi-Fi');
      if (perks.includes('meal')) {
        tags.push('☕ Meal Included');
      }
    } else {
      tags.push('❄️ Air Conditioned');
      tags.push('⚡ USB Charging');
    }
    return tags;
  };

  const getBookingAction = (route) => {
    if (route.mode === 'TRAIN') {
      return {
        label: 'Book on IRCTC Portal ↗',
        url: route.deepLink || 'https://www.irctc.co.in/nget/'
      };
    }
    if (route.mode === 'BUS') {
      return {
        label: 'Book on RedBus ↗',
        url: route.deepLink || 'https://www.redbus.in/'
      };
    }
    if (route.mode === 'FLIGHT') {
      return {
        label: 'Book Airline Ticket ↗',
        url: route.deepLink || 'https://www.goindigo.in/'
      };
    }
    return {
      label: 'Book Outstation Cab ↗',
      url: route.deepLink || 'https://www.makemytrip.com/cabs/'
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Search Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mb-6">
          <Badge variant="primary" size="sm">Multi-Modal Fare & Route Engine</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Compare Trains, Flights, Buses & Cabs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time fare class breakdown, carbon footprint calculations, and direct booking gateways.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full bg-slate-900/90 rounded-2xl px-4 py-3 border border-slate-800 focus-within:border-sky-500/50 transition-colors">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">From City</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. New Delhi"
              className="w-full bg-transparent text-sm font-bold text-white focus:outline-none mt-0.5"
            />
          </div>

          {/* Interactive City Swap Button */}
          <button
            type="button"
            onClick={handleSwapCities}
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-white border border-slate-700/80 hover:border-sky-500/40 transition-all duration-200 hover:rotate-180 active:scale-90 shadow-sm shrink-0"
            title="Swap Cities (⇄)"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="flex-1 w-full bg-slate-900/90 rounded-2xl px-4 py-3 border border-slate-800 focus-within:border-sky-500/50 transition-colors">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">To Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Jaipur"
              className="w-full bg-transparent text-sm font-bold text-white focus:outline-none mt-0.5"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto px-7 py-4 font-bold shadow-md">
            <Search className="w-4 h-4" /> Compare Transit Fares
          </Button>
        </form>
      </div>

      {/* Filter Chips & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Mode Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: '', label: 'All Modes' },
            { id: 'TRAIN', label: 'Trains' },
            { id: 'FLIGHT', label: 'Flights' },
            { id: 'BUS', label: 'Buses' },
            { id: 'CAB', label: 'Cabs' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setModeFilter(m.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                modeFilter === m.id
                  ? 'bg-slate-800 text-sky-400 border border-sky-400/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-white font-semibold focus:outline-none"
          >
            <option value="fare">Lowest Fare</option>
            <option value="duration">Fastest Duration</option>
            <option value="carbon">Lowest Carbon (Green Choice)</option>
          </select>
        </div>
      </div>

      {/* Polyline Route Map Mini View */}
      {routes.length > 0 && (
        <div className="h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <MapboxView
            routes={routes}
            center={routes[0].polyline?.coordinates?.[0] ? [routes[0].polyline.coordinates[0][1], routes[0].polyline.coordinates[0][0]] : [28.6139, 77.2090]}
            zoom={6}
          />
        </div>
      )}

      {/* Routes Cards List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Calculating multi-modal journeys...</div>
        ) : routes.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs glass-card rounded-2xl border border-slate-800">
            No direct transport records found between {source} and {destination}. Try another Indian city pair (e.g. New Delhi to Jaipur, or Mumbai to South Goa).
          </div>
        ) : (
          routes.map((route) => {
            const Icon = getModeIcon(route.mode);
            const lowestFare = Math.min(...(route.classes?.map(c => c.fare) || [0]));
            const formattedName = getFormattedOperatorName(route);
            const amenities = getAmenityTags(route);
            const booking = getBookingAction(route);
            const co2Saved = route.mode !== 'FLIGHT' 
              ? Math.max(0, (72.5 - (route.carbonKgPerPassenger || 14.2))).toFixed(1)
              : null;

            return (
              <div
                key={route._id}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{formattedName}</h4>
                        {route.isGreenChoice && (
                          <Badge variant="success" size="sm">
                            <Leaf className="w-3 h-3 text-emerald-400" /> Green Choice
                          </Badge>
                        )}
                        {co2Saved && Number(co2Saved) > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-[11px] font-semibold text-emerald-300">
                            🌱 Eco-Friendly: Saves {co2Saved} kg CO₂ compared to flying
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {route.sourceCity} ({route.sourceStationCode || 'SRC'}) ➔ {route.destinationCity} ({route.destinationStationCode || 'DST'})
                      </p>
                    </div>
                  </div>

                  {/* Timing & Duration */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-bold text-white">{route.departureTime} – {route.arrivalTime}</p>
                      <p className="text-[11px] text-slate-400">{Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m ({route.stopsCount} stops)</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-sky-400">₹{lowestFare}</p>
                      <p className="text-[10px] text-slate-400">from</p>
                    </div>
                  </div>
                </div>

                {/* Amenity Tags Pill Row */}
                {amenities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {amenities.map((amenity, aIdx) => (
                      <span
                        key={aIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}

                {/* Travel Classes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-800/80">
                  {route.classes?.map((cls, cIdx) => (
                    <div key={cIdx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">{cls.className}</p>
                        <p className="text-[10px] text-emerald-400 font-semibold">{cls.availableSeats} Seats Available</p>
                        {cls.perks && cls.perks[0] && (
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{cls.perks[0]}</p>
                        )}
                      </div>
                      <span className="font-bold text-xs text-sky-300">₹{cls.fare}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Carbon & Booking Action Link */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CO₂ Footprint: <strong className="text-slate-200">{route.carbonKgPerPassenger} kg</strong> per passenger</span>
                  </div>

                  <a
                    href={booking.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-white border border-slate-700/80 hover:border-sky-500/40 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    {booking.label}
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransportPage;
