import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass, Train, MapPin, Sparkles, ShieldCheck, Camera,
  Layers, ArrowRight, Star, Heart, ArrowLeftRight, Coffee, Sunset,
  Palmtree, Snowflake, Mountain, Castle, Waves, Landmark
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [sourceCity, setSourceCity] = useState('Hyderabad');
  const [destinationCity, setDestinationCity] = useState('Visakhapatnam');
  const [activeMood, setActiveMood] = useState('BEACH');

  const travelVibes = [
    {
      id: 'BEACH',
      label: 'Golden Beaches',
      icon: Palmtree,
      title: 'Sun-Drenched Coastal Shores',
      subtitle: 'Rushikonda Blue-Flag surf, secluded Yarada coves, and fresh evening sea breezes.',
      themeGradient: 'from-amber-500/30 via-orange-600/20 to-sky-600/30',
      badgeClass: 'bg-orange-500/20 text-orange-200 border-orange-400/40',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      from: 'Hyderabad',
      to: 'Visakhapatnam'
    },
    {
      id: 'FORTS',
      label: 'Historic Forts & Palaces',
      icon: Landmark,
      title: 'Royal Dynasties & Citadels',
      subtitle: 'The 400-year stucco minarets of Charminar, Golconda acoustic tunnels, and Chowmahalla chandeliers.',
      themeGradient: 'from-amber-600/30 via-yellow-600/20 to-indigo-900/40',
      badgeClass: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
      heroImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=80',
      from: 'Bengaluru',
      to: 'Hyderabad'
    },
    {
      id: 'GHATS',
      label: 'Misty Valley Hills',
      icon: Mountain,
      title: 'Emerald Coffee Estates & Caves',
      subtitle: 'Misty Araku Valley pine ridges, 150-million-year Borra Caves, and Lambasingi winter clouds.',
      themeGradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-700/30',
      badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
      heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
      from: 'Visakhapatnam',
      to: 'Araku Valley'
    },
    {
      id: 'SNOW',
      label: 'Snowy Mountain Peaks',
      icon: Snowflake,
      title: 'Himalayan Glacial Passes',
      subtitle: 'Powdered pine forests, steaming roadside chai cups, and majestic snow-blanketed ridges.',
      themeGradient: 'from-sky-500/30 via-blue-600/20 to-indigo-950/40',
      badgeClass: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
      heroImage: 'https://images.unsplash.com/photo-1546587348-d12660c30c50?auto=format&fit=crop&w=1600&q=80',
      from: 'New Delhi',
      to: 'Manali'
    }
  ];

  const currentVibe = travelVibes.find(v => v.id === activeMood) || travelVibes[0];

  const handleSelectVibe = (vibe) => {
    setActiveMood(vibe.id);
    setSourceCity(vibe.from);
    setDestinationCity(vibe.to);
  };

  const handleSwap = () => {
    setSourceCity(destinationCity);
    setDestinationCity(sourceCity);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/transport?source=${encodeURIComponent(sourceCity)}&destination=${encodeURIComponent(destinationCity)}`);
  };

  return (
    <div className="bg-[#FAF8F5] text-charcoal font-sans min-h-screen">
      
      {/* Visual Panorama Living Hero with Diverse Landscapes */}
      <section className="relative px-4 pt-6 pb-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Landscape Mood Selector Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-6">
          {travelVibes.map((v) => {
            const Icon = v.icon;
            const isSelected = activeMood === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVibe(v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  isSelected
                    ? 'bg-charcoal text-white scale-105 shadow-card-warm ring-2 ring-white/60'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200 shadow-sm'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Large Cinematic Hero Banner featuring Tourist Landscape Backdrop */}
        <div className="relative rounded-4xl overflow-hidden shadow-float-card border border-stone-200 text-white min-h-[500px] flex flex-col justify-between p-7 sm:p-12">
          {/* Real High-Resolution Landscape Image */}
          <img
            src={currentVibe.heroImage}
            alt={currentVibe.label}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 brightness-75 scale-105"
          />
          {/* Atmospheric Rich Gradient Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25" />
          <div className={`absolute inset-0 bg-gradient-to-r ${currentVibe.themeGradient} opacity-60 mix-blend-overlay`} />

          {/* Top Headline Content */}
          <div className="relative z-10 max-w-2xl">
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border backdrop-blur-md mb-3.5 ${currentVibe.badgeClass}`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {currentVibe.title}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] drop-shadow-md">
              Beaches, misty hills & royal fortresses in one seamless plan.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-stone-200 font-medium max-w-xl drop-shadow leading-relaxed">
              {currentVibe.subtitle}
            </p>
          </div>

          {/* High-Contrast Interactive Search Form */}
          <div className="relative z-10 mt-8 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-stone-200/80 shadow-2xl text-charcoal max-w-3xl">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full bg-[#FAF8F5] rounded-2xl p-3 border border-stone-200 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-terracotta" />
                <div className="text-left w-full">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">Departing From</span>
                  <input
                    type="text"
                    value={sourceCity}
                    onChange={(e) => setSourceCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-charcoal focus:outline-none"
                    placeholder="e.g. Hyderabad"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-terracotta hover:rotate-180 transition-all duration-300 shadow-sm"
                title="Swap departure and destination"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <div className="flex-1 w-full bg-[#FAF8F5] rounded-2xl p-3 border border-stone-200 flex items-center gap-3">
                <Compass className="w-5 h-5 text-emerald-600" />
                <div className="text-left w-full">
                  <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 block">Destination</span>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-charcoal focus:outline-none"
                    placeholder="e.g. Visakhapatnam"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white font-black text-sm shadow-pop-terracotta transition-all flex items-center justify-center gap-2"
              >
                Find Routes <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Shortcut Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-600">
          <span className="font-bold">Trending journeys:</span>
          <button onClick={() => { setSourceCity('Hyderabad'); setDestinationCity('Visakhapatnam'); }} className="px-3 py-1 rounded-full bg-white border border-stone-200 hover:border-terracotta font-bold text-charcoal shadow-sm">
            Hyderabad ➔ Visakhapatnam (Vande Bharat)
          </button>
          <button onClick={() => { setSourceCity('Visakhapatnam'); setDestinationCity('Araku Valley'); }} className="px-3 py-1 rounded-full bg-white border border-stone-200 hover:border-terracotta font-bold text-charcoal shadow-sm">
            Visakhapatnam ➔ Araku Valley (Vistadome)
          </button>
          <Link to="/explore?city=Hyderabad" className="text-terracotta font-black hover:underline flex items-center gap-1">
            Explore 24+ Spots on Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Featured Cities Section: Hyderabad (Charminar) & Visakhapatnam (Araku & Beach) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-terracotta">Curated Regional Hubs</span>
            <h2 className="text-2xl sm:text-4xl font-black text-charcoal mt-1">Featured Indian Destinations</h2>
          </div>
          <Link to="/compare" className="text-xs font-black text-terracotta hover:underline flex items-center gap-1.5 transition-colors">
            Compare Side-by-Side <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: HYDERABAD (Featuring Charminar) */}
          <div className="group bg-white rounded-4xl overflow-hidden border border-stone-200 shadow-card-warm hover:shadow-float-card transition-all duration-300">
            <div className="h-72 overflow-hidden relative bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80"
                alt="Charminar Hyderabad"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-black text-charcoal shadow-sm">
                🕌 12 Verified Heritage Sites
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold drop-shadow">
                <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">⭐ 4.85 / 5.0 (420 Visits)</span>
                <span className="bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-full">🛡️ 9.1 Safety Score</span>
              </div>
            </div>

            <div className="p-7">
              <h3 className="text-2xl font-black text-charcoal">Hyderabad, Telangana</h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                The City of Pearls. 400-year-old minarets of Charminar, whispering acoustic arches of Golconda Fort, grand chandeliers of Chowmahalla Palace, and legendary Dum Biryani at Bawarchi.
              </p>

              <div className="mt-6 flex gap-3">
                <Link to="/explore?city=Hyderabad" className="flex-1">
                  <button className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white font-black text-xs shadow-pop-terracotta transition-all">
                    Open Hyderabad Map
                  </button>
                </Link>
                <Link to="/planner?destination=Hyderabad" className="flex-1">
                  <button className="w-full py-3.5 rounded-2xl bg-[#FAF8F5] hover:bg-stone-200 text-charcoal font-black text-xs border border-stone-200 transition-all">
                    Plan Itinerary
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: VISAKHAPATNAM (Featuring Araku Valley & Rushikonda Beach) */}
          <div className="group bg-white rounded-4xl overflow-hidden border border-stone-200 shadow-card-warm hover:shadow-float-card transition-all duration-300">
            <div className="h-72 overflow-hidden relative bg-stone-100">
              <div className="w-full h-full grid grid-cols-2">
                <div className="h-full relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                    alt="Araku Valley Visakhapatnam"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded font-bold">
                    ☕ Araku Hills
                  </span>
                </div>
                <div className="h-full relative overflow-hidden border-l border-white/20">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                    alt="Rushikonda Beach Visakhapatnam"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded font-bold">
                    🏖️ Blue Flag Beach
                  </span>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-black text-charcoal shadow-sm">
                🌊 12 Coastal & Mountain Gems
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold drop-shadow">
                <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">⭐ 4.90 / 5.0 (390 Visits)</span>
                <span className="bg-emerald-600/90 backdrop-blur-sm px-3 py-1 rounded-full">🛡️ 9.4 Safety Score</span>
              </div>
            </div>

            <div className="p-7">
              <h3 className="text-2xl font-black text-charcoal">Visakhapatnam (Vizag), Andhra Pradesh</h3>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                The Jewel of the East Coast. Blue Flag certified Rushikonda Beach surf, 150-million-year-old Borra limestone caves, the historic INS Kursura Submarine Museum, and scenic Vistadome train rides to Araku Valley.
              </p>

              <div className="mt-6 flex gap-3">
                <Link to="/explore?city=Visakhapatnam" className="flex-1">
                  <button className="w-full py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white font-black text-xs shadow-pop-terracotta transition-all">
                    Open Vizag Map
                  </button>
                </Link>
                <Link to="/planner?destination=Visakhapatnam" className="flex-1">
                  <button className="w-full py-3.5 rounded-2xl bg-[#FAF8F5] hover:bg-stone-200 text-charcoal font-black text-xs border border-stone-200 transition-all">
                    Plan Itinerary
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default HomePage;
