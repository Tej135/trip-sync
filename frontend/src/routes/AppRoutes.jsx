import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

import HomePage from '../pages/HomePage';
import ExplorePage from '../pages/ExplorePage';
import TransportPage from '../pages/TransportPage';
import TripPlannerPage from '../pages/TripPlannerPage';
import ItineraryPage from '../pages/ItineraryPage';
import NewsPage from '../pages/NewsPage';
import ExpertMarketplacePage from '../pages/ExpertMarketplacePage';
import CompareTripsPage from '../pages/CompareTripsPage';
import PackingListPage from '../pages/PackingListPage';
import EmergencyPage from '../pages/EmergencyPage';
import ProfilePage from '../pages/ProfilePage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import { useTrip } from '../context/TripContext';

// Helper route to jump to active trip or planner
const TripsRedirect = () => {
  const { activeTrip } = useTrip();
  if (activeTrip?._id) {
    return <Navigate to={`/itinerary/${activeTrip._id}`} replace />;
  }
  return <Navigate to="/planner" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="transport" element={<TransportPage />} />
        <Route path="planner" element={<TripPlannerPage />} />
        <Route path="itinerary/:tripId" element={<ItineraryPage />} />
        <Route path="trips" element={<TripsRedirect />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="stories" element={<Navigate to="/news" replace />} />
        <Route path="experts" element={<ExpertMarketplacePage />} />
        <Route path="compare" element={<CompareTripsPage />} />
        <Route path="packing" element={<PackingListPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
