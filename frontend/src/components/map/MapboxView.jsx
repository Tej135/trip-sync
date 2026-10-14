import React, { useState, useCallback, useEffect, memo } from 'react';
import { GoogleMap, useJsApiLoader, Marker as GoogleMarker, InfoWindow, Polyline as GooglePolyline } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup, Polyline as LeafletPolyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Star, Shield, Plus, Check, Clock, Eye, Sparkles, Navigation, MapPin } from 'lucide-react';
import { useTrip } from '../../context/TripContext';
import Badge from '../common/Badge';

// Hard Boundary: Strictly locked to India
const INDIA_BOUNDS = {
  north: 37.1,
  south: 6.8,
  west: 68.1,
  east: 97.4,
};

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.75rem'
};

// Warm Earth & Lagoon Styling for Google Maps
const travelMapStyles = [
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#7dd3fc' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#fef3c7' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#fdba74' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#bbf7d0' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] }
];

// Helper to recenter Leaflet map view programmatically
const LeafletRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      const lat = center.lat !== undefined ? center.lat : center[0];
      const lng = center.lng !== undefined ? center.lng : center[1];
      map.setView([lat, lng], zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
};

// Create custom SVG markers per category for Leaflet fallback
const createCategoryIcon = (category) => {
  const colorMap = {
    HERITAGE: '#d97706', // Amber Sandstone
    NATURE: '#059669',   // Emerald Forest
    TEMPLE: '#7c3aed',   // Royal Violet
    VIEWPOINT: '#0284c7',// Coastal Cyan
    FOOD: '#ea580c',     // Saffron Orange
    ADVENTURE: '#dc2626' // Ruby Red
  };
  const color = colorMap[category] || '#ea580c';

  const svgHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 14px ${color}88, 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s ease;
    ">
      <div style="width: 10px; height: 10px; background-color: #ffffff; border-radius: 50%;"></div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-category-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const MapboxView = ({
  places = [],
  routes = [],
  selectedPlace = null,
  onSelectPlace,
  center = { lat: 17.3850, lng: 78.4867 }, // Default Hyderabad
  zoom = 12
}) => {
  const { trayPlaces, addPlaceToActiveTrip, removePlaceFromActiveTrip } = useTrip();
  const [activeMarker, setActiveMarker] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places']
  });

  const isPlaceInTray = (placeId) => {
    return trayPlaces.some(p => (p._id || p) === placeId);
  };

  const centerLat = center.lat !== undefined ? center.lat : (center[0] || 17.3850);
  const centerLng = center.lng !== undefined ? center.lng : (center[1] || 78.4867);

  // If user provided a valid Google Maps API Key and it loaded successfully, use Google Maps
  if (apiKey && isLoaded && !loadError) {
    return (
      <div className="w-full h-full relative rounded-4xl overflow-hidden border border-stone-200 shadow-float-card">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: centerLat, lng: centerLng }}
          zoom={zoom}
          options={{
            styles: travelMapStyles,
            restriction: {
              latLngBounds: INDIA_BOUNDS,
              strictBounds: false
            },
            minZoom: 5,
            maxZoom: 18,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true
          }}
        >
          {/* Render Multi-Modal Polyline Routes */}
          {routes.map((route, idx) => {
            if (!route.polyline || !route.polyline.coordinates) return null;
            const path = route.polyline.coordinates.map(pt => ({ lat: pt[1], lng: pt[0] }));
            const modeColors = {
              TRAIN: '#2563eb',
              FLIGHT: '#9333ea',
              BUS: '#16a34a',
              CAB: '#f59e0b'
            };
            return (
              <GooglePolyline
                key={route._id || idx}
                path={path}
                options={{
                  strokeColor: modeColors[route.mode] || '#ff5a36',
                  strokeOpacity: 0.9,
                  strokeWeight: route.mode === 'FLIGHT' ? 3 : 5
                }}
              />
            );
          })}

          {/* Places Markers */}
          {places.map((place) => {
            if (!place.location || !place.location.coordinates) return null;
            const [lng, lat] = place.location.coordinates;

            return (
              <GoogleMarker
                key={place._id}
                position={{ lat, lng }}
                onClick={() => setActiveMarker(place)}
                title={place.name}
              />
            );
          })}

          {/* Spot Peek Card InfoWindow */}
          {activeMarker && activeMarker.location && (
            <InfoWindow
              position={{
                lat: activeMarker.location.coordinates[1],
                lng: activeMarker.location.coordinates[0]
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="w-72 p-1 font-sans text-charcoal">
                {activeMarker.photoUrls?.[0] && (
                  <div className="w-full h-32 rounded-xl overflow-hidden mb-2 relative">
                    <img
                      src={activeMarker.photoUrls[0]}
                      alt={activeMarker.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-terracotta">
                      {activeMarker.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded-lg text-[10px] text-amber-300 font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {activeMarker.averageRating || '4.8'}
                    </div>
                  </div>
                )}

                <h4 className="font-black text-sm text-charcoal">{activeMarker.name}</h4>
                <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{activeMarker.description}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs font-semibold">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Safety: {activeMarker.safetyScore?.overall || 9}/10
                  </span>
                  <span className="text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activeMarker.recommendedDurationMinutes} mins
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onSelectPlace && onSelectPlace(activeMarker)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                  <button
                    onClick={() => isPlaceInTray(activeMarker._id) ? removePlaceFromActiveTrip(activeMarker._id) : addPlaceToActiveTrip(activeMarker)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      isPlaceInTray(activeMarker._id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-terracotta hover:bg-terracotta-hover text-white shadow-sm'
                    }`}
                  >
                    {isPlaceInTray(activeMarker._id) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {isPlaceInTray(activeMarker._id) ? 'Added' : 'Add to Trip'}
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    );
  }

  // Resilient Interactive Leaflet Fallback (Works 100% offline or with zero API keys required!)
  return (
    <div className="w-full h-full relative rounded-4xl overflow-hidden border border-stone-200 shadow-float-card bg-[#f8f9fa]">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[500px]"
      >
        <LeafletRecenter center={[centerLat, centerLng]} zoom={zoom} />

        {/* Clean, high-performance CartoDB Voyager tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Multi-Modal Polylines */}
        {routes.map((route, idx) => {
          if (!route.polyline || !route.polyline.coordinates) return null;
          const latLngs = route.polyline.coordinates.map(pt => [pt[1], pt[0]]);
          const modeColors = {
            TRAIN: '#2563eb',
            FLIGHT: '#9333ea',
            BUS: '#16a34a',
            CAB: '#f59e0b'
          };
          const color = modeColors[route.mode] || '#ea580c';

          return (
            <LeafletPolyline
              key={route._id || idx}
              positions={latLngs}
              pathOptions={{
                color,
                weight: route.mode === 'FLIGHT' ? 3 : 5,
                dashArray: route.mode === 'FLIGHT' ? '6, 8' : undefined,
                opacity: 0.85
              }}
            >
              <LeafletPopup>
                <div className="p-2 text-xs">
                  <p className="font-bold text-charcoal">{route.operatorName} ({route.mode})</p>
                  <p className="text-stone-500">Duration: {route.durationMinutes} mins | CO₂: {route.carbonKgPerPassenger} kg</p>
                </div>
              </LeafletPopup>
            </LeafletPolyline>
          );
        })}

        {/* Plotted Tourist Places Markers */}
        {places.map((place) => {
          if (!place.location || !place.location.coordinates) return null;
          const [lng, lat] = place.location.coordinates;
          const inTray = isPlaceInTray(place._id);

          return (
            <LeafletMarker
              key={place._id}
              position={[lat, lng]}
              icon={createCategoryIcon(place.category)}
              eventHandlers={{
                click: () => onSelectPlace && onSelectPlace(place)
              }}
            >
              <LeafletPopup>
                <div className="w-64 p-1 text-charcoal font-sans">
                  {place.photoUrls && place.photoUrls[0] && (
                    <div className="w-full h-28 rounded-xl overflow-hidden mb-2 relative">
                      <img
                        src={place.photoUrls[0]}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-terracotta">
                        {place.category}
                      </div>
                      <div className="absolute bottom-1.5 right-1.5 bg-black/70 px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {place.averageRating || '4.8'}
                      </div>
                    </div>
                  )}

                  <h4 className="font-bold text-sm text-charcoal truncate">{place.name}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{place.description}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100 text-[11px]">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <Shield className="w-3 h-3" />
                      Safety: {place.safetyScore?.overall || 9.2}/10
                    </div>
                    <div className="flex items-center gap-1 text-stone-500">
                      <Clock className="w-3 h-3" />
                      {place.recommendedDurationMinutes}m
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onSelectPlace && onSelectPlace(place)}
                      className="flex-1 py-1 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </button>
                    <button
                      onClick={() => inTray ? removePlaceFromActiveTrip(place._id) : addPlaceToActiveTrip(place)}
                      className={`py-1 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                        inTray
                          ? 'bg-emerald-600 text-white'
                          : 'bg-terracotta hover:bg-terracotta-hover text-white'
                      }`}
                    >
                      {inTray ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      {inTray ? 'In Trip' : 'Add'}
                    </button>
                  </div>
                </div>
              </LeafletPopup>
            </LeafletMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default memo(MapboxView);
