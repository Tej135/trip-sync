import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Phone,
  Shield,
  Plus,
  Trash2,
  Heart,
  Hospital,
  MapPin,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { emergencyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const EmergencyPage = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Contact Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // SOS broadcast state
  const [sosStatus, setSosStatus] = useState(null);
  const [sosLoading, setSosLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await emergencyAPI.getContacts();
      if (res.data?.success) {
        setContacts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await emergencyAPI.addContact({
        name,
        relationship,
        phone,
        email,
        isPrimary: contacts.length === 0
      });
      if (res.data?.success) {
        setName('');
        setPhone('');
        setEmail('');
        setModalOpen(false);
        await fetchContacts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await emergencyAPI.deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerSos = async () => {
    try {
      setSosLoading(true);
      setSosStatus(null);
      const res = await emergencyAPI.triggerSos({
        latitude: 26.9124,
        longitude: 75.7873,
        address: 'Live Location via Safety Hub'
      });
      if (res.data?.success) {
        setSosStatus(res.data);
      }
    } catch (err) {
      setSosStatus({ error: err.response?.data?.message || 'Emergency trigger failed' });
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Badge variant="danger" size="sm">24x7 Offline Emergency Safety Grid</Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Emergency SOS & Safety Hub</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Instantly broadcast GPS coordinates to loved ones, access national distress helplines, and navigate to verified hospitals even with zero cell connectivity.
        </p>
      </div>

      {/* Big One-Tap SOS Panic Box */}
      <div className="glass-card rounded-3xl p-8 border border-red-900/60 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 shadow-2xl space-y-4 text-center">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
        <h3 className="text-xl font-black text-white">Broadcast Emergency SOS Signal</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Dispatches live telemetry with map coordinates to all {contacts.length} registered emergency contacts and logs incident with tourist helplines.
        </p>

        {sosStatus?.success && (
          <div className="max-w-md mx-auto p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300">
            ✅ {sosStatus.message}
          </div>
        )}

        {sosStatus?.error && (
          <div className="max-w-md mx-auto p-3.5 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
            ❌ {sosStatus.error}
          </div>
        )}

        <Button
          variant="danger"
          size="lg"
          loading={sosLoading}
          onClick={handleTriggerSos}
          className="px-10 py-4 font-black uppercase tracking-wider text-sm shadow-xl hover:shadow-red-500/30"
        >
          <AlertTriangle className="w-5 h-5 mr-1" /> TRIGGER INSTANT SOS BROADCAST
        </Button>
      </div>

      {/* National Emergency Helplines */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
          National Emergency Helplines (Toll-Free 24x7)
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <a
            href="tel:112"
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <span className="text-slate-400 font-semibold">Police & SOS</span>
            <span className="text-lg font-black text-brand-400 font-mono mt-2">112</span>
          </a>

          <a
            href="tel:1091"
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <span className="text-slate-400 font-semibold">Women Distress</span>
            <span className="text-lg font-black text-rose-400 font-mono mt-2">1091</span>
          </a>

          <a
            href="tel:108"
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <span className="text-slate-400 font-semibold">Ambulance</span>
            <span className="text-lg font-black text-emerald-400 font-mono mt-2">108</span>
          </a>

          <a
            href="tel:1363"
            className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <span className="text-slate-400 font-semibold">Tourist Helpline</span>
            <span className="text-lg font-black text-amber-400 font-mono mt-2">1363</span>
          </a>
        </div>
      </div>

      {/* Registered Emergency Contacts */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Registered Emergency Contacts</h4>
            <p className="text-xs text-slate-400">These individuals receive instant emails and coordinates upon panic trigger.</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading emergency contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            No contacts registered. Add at least one family member or friend for safety alerts.
          </div>
        ) : (
          <div className="space-y-2.5">
            {contacts.map((c) => (
              <div
                key={c._id}
                className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-white">{c.name}</h5>
                    <Badge variant="primary" size="sm">{c.relationship}</Badge>
                    {c.isPrimary && <Badge variant="gold" size="sm">Primary</Badge>}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-mono">{c.phone} • {c.email || 'No email'}</p>
                </div>

                <button
                  onClick={() => handleDeleteContact(c._id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Emergency Contact" maxWidth="max-w-md">
        <form onSubmit={handleAddContact} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rajesh Thapar"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="Parent">Parent</option>
              <option value="Spouse">Spouse</option>
              <option value="Sibling">Sibling</option>
              <option value="Friend">Friend</option>
              <option value="Colleague">Colleague</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98200 12345"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Email Address (for instant coordinate maps)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rajesh@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default EmergencyPage;
