import React, { createContext, useContext, useState, useEffect } from 'react';
import { tripsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [trayPlaces, setTrayPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    if (!isAuthenticated) {
      setTrips([]);
      setActiveTrip(null);
      return;
    }
    try {
      setLoading(true);
      const res = await tripsAPI.getMyTrips();
      if (res.data?.success) {
        setTrips(res.data.data);
        if (res.data.data.length > 0 && !activeTrip) {
          setActiveTrip(res.data.data[0]);
          setTrayPlaces(res.data.data[0].selectedPlaces?.map(sp => sp.place) || []);
        }
      }
    } catch (err) {
      console.warn('[TripContext] Fetch trips error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [isAuthenticated]);

  const selectTrip = (trip) => {
    setActiveTrip(trip);
    setTrayPlaces(trip.selectedPlaces?.map(sp => sp.place) || []);
  };

  const addPlaceToActiveTrip = async (place) => {
    // If user has an active trip, call API to persist
    if (activeTrip) {
      try {
        const res = await tripsAPI.addPlace(activeTrip._id, place._id);
        if (res.data?.success) {
          setActiveTrip(res.data.data);
        }
      } catch (err) {
        console.warn('[TripContext] Add place API failed, keeping local state:', err.message);
      }
    }
    // Update local tray state
    setTrayPlaces(prev => {
      const exists = prev.some(p => (p._id || p) === place._id);
      if (!exists) return [...prev, place];
      return prev;
    });
  };

  const removePlaceFromActiveTrip = async (placeId) => {
    if (activeTrip) {
      try {
        const res = await tripsAPI.removePlace(activeTrip._id, placeId);
        if (res.data?.success) {
          setActiveTrip(res.data.data);
        }
      } catch (err) {
        console.warn('[TripContext] Remove place error:', err.message);
      }
    }
    setTrayPlaces(prev => prev.filter(p => (p._id || p) !== placeId));
  };

  const value = {
    trips,
    activeTrip,
    setActiveTrip,
    trayPlaces,
    loading,
    selectTrip,
    addPlaceToActiveTrip,
    removePlaceFromActiveTrip,
    refreshTrips: fetchTrips
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
