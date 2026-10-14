import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Shield,
  Camera,
  Plus,
  Check,
  Eye,
  Sparkles,
  Layers,
  Navigation,
  Compass,
  Map as MapIcon,
  List as ListIcon
} from 'lucide-react';
import MapboxView from '../components/map/MapboxView';
import PlaceDetailModal from '../components/places/PlaceDetailModal';
import { placesAPI } from '../services/api';
import { useTrip } from '../context/TripContext';

const ExplorePage = () => {
  const [searchParams] = useSearchParams();
  const cityParam = searchParams.get('city') || 'Hyderabad';

  const { trayPlaces, addPlaceToActiveTrip, removePlaceFromActiveTrip } = useTrip();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDroneZone, setSelectedDroneZone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedPlaceId, setInspectedPlaceId] = useState(null);
  const [mobileTab, setMobileTab] = useState('list'); // 'list' | 'map'

  // Dynamic Map Centers for Hyderabad and Visakhapatnam
  const cityCoordinates = {
    Hyderabad: { lat: 17.3850, lng: 78.4867 },
    Visakhapatnam: { lat: 17.6868, lng: 83.2185 },
    'South Goa': { lat: 15.1500, lng: 74.0000 },
    Jaipur: { lat: 26.9124, lng: 75.7873 }
  };

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const params = {
        city: selectedCity,
        category: selectedCategory || undefined,
        droneZone: selectedDroneZone || undefined,
        search: searchQuery || undefined
      };
      const res = await placesAPI.getPlaces(params);
      if (res.data?.success) {
        setPlaces(res.data.data);
      }
    } catch (err) {
      console.error('Fetch places error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [selectedCity, selectedCategory, selectedDroneZone]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  const isPlaceInTray = (placeId) => {
    return trayPlaces.some(p => (p._id || p) === placeId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-sand text-charcoal font-sans">
      {/* Top Filter Bar */}
      <div className="bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex-shrink-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Destination Selector & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-2xl bg-white p-1 border border-stone-200 shadow-sm">
              <button
                onClick={() => setSelectedCity('Hyderabad')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  selectedCity === 'Hyderabad'
                    ? 'bg-charcoal text-white shadow-card-warm'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-100'
                }`}
              >
                🕌 Hyderabad (Charminar & Forts)
              </button>
              <button
                onClick={() => setSelectedCity('Visakhapatnam')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 ${
                  selectedCity === 'Visakhapatnam'
                    ? 'bg-charcoal text-white shadow-card-warm'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-100'
                }`}
              >
                🏖️ Visakhapatnam (Araku & Beaches)
              </button>
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search Charminar, Araku, Beach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-terracotta w-44 sm:w-60 shadow-sm"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            </form>
          </div>

          {/* Categories, Drone Filters & Mobile Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 font-bold focus:outline-none focus:border-terracotta shadow-sm"
            >
              <option value="">All Categories</option>
              <option value="HERITAGE">Heritage</option>
              <option value="NATURE">Nature</option>
              <option value="TEMPLE">Temple</option>
              <option value="VIEWPOINT">Viewpoint</option>
              <option value="FOOD">Food & Bazaars</option>
              <option value="ADVENTURE">Adventure</option>
            </select>

            <select
              value={selectedDroneZone}
              onChange={(e) => setSelectedDroneZone(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700 font-bold focus:outline-none focus:border-terracotta shadow-sm"
            >
              <option value="">Drone Regulations</option>
              <option value="GREEN">🟢 Green (Permitted)</option>
              <option value="YELLOW">🟡 Yellow (Permit Required)</option>
              <option value="RED">🔴 Red (No-Fly Zone)</option>
            </select>

            {/* Mobile List/Map Toggle */}
            <div className="sm:hidden flex bg-white border border-stone-200 rounded-xl p-0.5">
              <button
                onClick={() => setMobileTab('list')}
                className={`p-1.5 rounded-lg text-xs font-bold ${mobileTab === 'list' ? 'bg-charcoal text-white' : 'text-stone-500'}`}
                title="List View"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMobileTab('map')}
                className={`p-1.5 rounded-lg text-xs font-bold ${mobileTab === 'map' ? 'bg-charcoal text-white' : 'text-stone-500'}`}
                title="Map View"
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trip Tray Floating Status */}
            {trayPlaces.length > 0 && (
              <Link
                to="/planner"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{trayPlaces.length} in Tray</span>
                <span className="hidden sm:inline">➔ Plan</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Split Body: Cards List on Left + Interactive Map on Right */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Places List Cards Drawer */}
        <div className={`w-full sm:w-96 lg:w-[440px] bg-sand border-r border-stone-200 overflow-y-auto p-4 space-y-3.5 flex-shrink-0 ${mobileTab === 'map' ? 'hidden sm:block' : 'block'}`}>
          <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs font-bold text-stone-500">
            <span>Showing {places.length} curated destinations in {selectedCity}</span>
            <span>Click to inspect</span>
          </div>

          {loading ? (
            <div className="py-24 text-center text-xs text-stone-400">Loading verified tourist spots...</div>
          ) : places.length === 0 ? (
            <div className="py-24 text-center text-xs text-stone-500">
              No tourist spots match your criteria. Try changing filters or city.
            </div>
          ) : (
            places.map((place) => {
              const inTray = isPlaceInTray(place._id);
              const goldenHour = place.creatorInfo?.goldenHourRecommendation
                ? place.creatorInfo.goldenHourRecommendation.split('&')[0].trim()
                : '6:15 AM - 7:30 AM';

              return (
                <div
                  key={place._id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-300 group shadow-card-warm hover:shadow-card-float"
                >
                  <div className="h-40 relative overflow-hidden bg-stone-100">
                    <img
                      src={place.photoUrls?.[0] || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80'}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center max-w-[90%]">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-charcoal shadow-sm">
                        {place.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-sm ${
                        place.creatorInfo?.droneZone === 'GREEN'
                          ? 'bg-emerald-600/90 text-white'
                          : place.creatorInfo?.droneZone === 'YELLOW'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-rose-600/90 text-white'
                      }`}>
                        {place.creatorInfo?.droneZone || 'RED'} Drone
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-bold text-amber-300 backdrop-blur-sm">
                        🌅 {goldenHour}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-bold text-white">
                      <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.averageRating || 4.8} ({place.totalVerifiedReviews || 24})
                      </span>
                      <span className="bg-emerald-600/90 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                        🛡️ Safety: {place.safetyScore?.overall || 9.0}/10
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-black text-sm text-charcoal truncate">{place.name}</h4>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">{place.description}</p>
                    
                    <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setInspectedPlaceId(place._id)}
                        className="text-xs font-black text-terracotta hover:text-terracotta-hover flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>

                      <button
                        type="button"
                        onClick={() => inTray ? removePlaceFromActiveTrip(place._id) : addPlaceToActiveTrip(place)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 shadow-sm ${
                          inTray
                            ? 'bg-emerald-600 text-white shadow-emerald-200'
                            : 'bg-sand hover:bg-stone-200 text-charcoal border border-stone-200'
                        }`}
                      >
                        {inTray ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-stone-600" />
                        )}
                        <span>{inTray ? 'In Trip Tray' : 'Add to Trip'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Interactive Hybrid Map Canvas (Always Visible & Interactive!) */}
        <div className={`flex-1 h-full p-3 bg-sand ${mobileTab === 'list' ? 'hidden sm:block' : 'block'}`}>
          <MapboxView
            places={places}
            center={cityCoordinates[selectedCity] || { lat: 17.3850, lng: 78.4867 }}
            zoom={selectedCity === 'Visakhapatnam' ? 11 : 12}
            onSelectPlace={(place) => setInspectedPlaceId(place._id)}
          />
        </div>
      </div>

      {/* Deep Inspection Modal */}
      <PlaceDetailModal
        isOpen={!!inspectedPlaceId}
        onClose={() => setInspectedPlaceId(null)}
        placeId={inspectedPlaceId}
      />
    </div>
  );
};

export default ExplorePage;
