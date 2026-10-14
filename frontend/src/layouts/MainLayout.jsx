import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ChatWidget from '../components/chat/ChatWidget';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

import { AlertTriangle, Phone, ShieldCheck, Heart } from 'lucide-react';
import { emergencyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosStatus, setSosStatus] = useState(null);

  const handleTriggerSos = async () => {
    try {
      setSosLoading(true);
      // Attempt to retrieve browser coordinates if available
      let lat = 26.9124;
      let lng = 75.7873;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            await dispatchSos(lat, lng);
          },
          async () => {
            await dispatchSos(lat, lng);
          }
        );
      } else {
        await dispatchSos(lat, lng);
      }
    } catch (err) {
      setSosStatus({ error: err.message });
      setSosLoading(false);
    }
  };

  const dispatchSos = async (latitude, longitude) => {
    try {
      const res = await emergencyAPI.triggerSos({
        latitude,
        longitude,
        address: 'Live Panic Coordinate Dispatch'
      });
      if (res.data?.success) {
        setSosStatus(res.data);
      }
    } catch (err) {
      setSosStatus({ error: err.response?.data?.message || 'Emergency broadcast failed' });
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d19] text-slate-100">
      {/* Global Navbar */}
      <Navbar onOpenSos={() => setSosModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Floating AI Chat Copilot */}
      <ChatWidget />

      {/* Emergency SOS Panic Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => {
          setSosModalOpen(false);
          setSosStatus(null);
        }}
        title="🚨 EMERGENCY SOS & SAFETY DISPATCH"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 text-sm text-red-400">
              <AlertTriangle className="w-5 h-5" /> Instant Emergency Broadcaster
            </p>
            <p className="mt-1">
              Pressing the button below dispatches an automated urgent SMS and Email alert containing your live GPS coordinates to your registered emergency contacts.
            </p>
          </div>

          {sosStatus?.success && (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 space-y-2">
              <p className="font-bold text-sm">✅ {sosStatus.message}</p>
              <p>Dispatched to {sosStatus.data?.dispatchedCount || 2} registered contacts with Google Maps link.</p>
            </div>
          )}

          {sosStatus?.error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
              {sosStatus.error}
            </div>
          )}

          <div className="text-center py-2">
            <Button
              variant="danger"
              size="lg"
              className="w-full text-base font-black py-4 uppercase tracking-wider"
              loading={sosLoading}
              onClick={handleTriggerSos}
            >
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              SEND EMERGENCY SOS SIGNAL NOW
            </Button>
          </div>

          <div className="border-t border-slate-800 pt-3">
            <p className="text-xs font-bold text-slate-300 mb-2">Immediate Free Emergency Helplines (Dial Now):</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="tel:112" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-bold text-white hover:border-slate-700">
                <span>Police / National</span>
                <span className="text-brand-400 font-mono">112</span>
              </a>
              <a href="tel:1091" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-bold text-white hover:border-slate-700">
                <span>Women Helpline</span>
                <span className="text-rose-400 font-mono">1091</span>
              </a>
              <a href="tel:108" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-bold text-white hover:border-slate-700">
                <span>Ambulance</span>
                <span className="text-emerald-400 font-mono">108</span>
              </a>
              <a href="tel:1363" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-bold text-white hover:border-slate-700">
                <span>Tourist Police</span>
                <span className="text-amber-400 font-mono">1363</span>
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
            <div>
              <p className="text-sm font-extrabold text-white">TripSync Systems</p>
              <p className="mt-1">Smart Multi-Modal Travel Planning, Geospatial Discovery & Verified Community Platform.</p>
            </div>
            <div className="flex items-center gap-6 font-medium">
              <Link to="/explore" className="hover:text-white">Explore Map</Link>
              <Link to="/transport" className="hover:text-white">Transport Compare</Link>
              <Link to="/experts" className="hover:text-white">Local Guides</Link>
              <Link to="/compare" className="hover:text-white">Compare Trips</Link>
              <Link to="/emergency" className="hover:text-white">Safety SOS</Link>
            </div>
          </div>
          <div className="border-t border-slate-900 mt-6 pt-6 text-[11px] text-slate-500 text-center">
            © 2026 TripSync Platform. Built with React, Vite, Node.js, Express, Mongoose GeoJSON, and PDFKit.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
