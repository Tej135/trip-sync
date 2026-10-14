import React, { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  Users,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus
} from 'lucide-react';
import { placesAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [places, setPlaces] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('places'); // 'places', 'users'

  // Create Place modal
  const [addPlaceModalOpen, setAddPlaceModalOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState('HERITAGE');
  const [newPlaceCity, setNewPlaceCity] = useState('Jaipur');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceDrone, setNewPlaceDrone] = useState('RED');
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [placesRes, usersRes] = await Promise.all([
        placesAPI.getPlaces({ limit: 50 }),
        userAPI.getAllUsers().catch(() => ({ data: { data: [] } }))
      ]);

      if (placesRes.data?.success) setPlaces(placesRes.data.data);
      if (usersRes.data?.success) setUsersList(usersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreatePlace = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await placesAPI.create({
        name: newPlaceName,
        category: newPlaceCategory,
        city: newPlaceCity,
        state: newPlaceCity.toLowerCase().includes('goa') ? 'Goa' : 'Rajasthan',
        description: newPlaceDesc,
        location: {
          type: 'Point',
          coordinates: newPlaceCity.toLowerCase().includes('goa') ? [74.01, 15.02] : [75.82, 26.92]
        },
        creatorInfo: {
          droneZone: newPlaceDrone
        }
      });
      if (res.data?.success) {
        setAddPlaceModalOpen(false);
        setNewPlaceName('');
        setNewPlaceDesc('');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await userAPI.updateRole(userId, newRole);
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm">System Administration</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Admin Operations Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Oversee tourist attractions, verify content creator credentials, and enforce safety regulations.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setAddPlaceModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Destination Place
        </Button>
      </div>

      {/* Analytics KPI Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Indexed Places</p>
          <p className="text-2xl font-black text-brand-400 mt-1">{places.length}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Registered Users</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{usersList.length || 9}</p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Verified Reviews</p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {places.reduce((acc, p) => acc + (p.totalVerifiedReviews || 0), 0)}
          </p>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Safety Index</p>
          <p className="text-2xl font-black text-purple-400 mt-1">9.1 / 10</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('places')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'places' ? 'bg-brand-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          Places Management ({places.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-brand-600 text-white shadow-glow' : 'text-slate-400 hover:text-white'
          }`}
        >
          User Roles & Creators ({usersList.length})
        </button>
      </div>

      {/* Places Management Table */}
      {activeTab === 'places' && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Place Name</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Drone Zone</th>
                  <th className="p-4">Safety Score</th>
                  <th className="p-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {places.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">{p.name}</td>
                    <td className="p-4">{p.city}</td>
                    <td className="p-4">
                      <Badge variant="primary" size="sm">{p.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.creatorInfo?.droneZone === 'GREEN' ? 'success' : 'danger'} size="sm">
                        {p.creatorInfo?.droneZone || 'RED'}
                      </Badge>
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">
                      {p.safetyScore?.overall || 8.5} / 10
                    </td>
                    <td className="p-4 font-bold text-amber-300">
                      ★ {p.averageRating} ({p.totalVerifiedReviews})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Roles Table */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Traveler Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Explorer Level</th>
                  <th className="p-4">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-slate-400">{u.email}</td>
                    <td className="p-4">
                      <Badge variant={u.role === 'ADMIN' ? 'gold' : (u.role === 'CREATOR' ? 'purple' : 'default')} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-amber-300">{u.explorerLevel || 'BRONZE'}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs text-white"
                      >
                        <option value="TRAVELER">TRAVELER</option>
                        <option value="PRO_TRAVELER">PRO_TRAVELER</option>
                        <option value="CREATOR">CREATOR</option>
                        <option value="LOCAL_EXPERT">LOCAL_EXPERT</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Place Modal */}
      <Modal isOpen={addPlaceModalOpen} onClose={() => setAddPlaceModalOpen(false)} title="Create New Destination Place" maxWidth="max-w-md">
        <form onSubmit={handleCreatePlace} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Place Name</label>
            <input
              type="text"
              required
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              placeholder="e.g. Nahargarh Biological Park"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">City</label>
              <select
                value={newPlaceCity}
                onChange={(e) => setNewPlaceCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="Jaipur">Jaipur</option>
                <option value="South Goa">South Goa</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Category</label>
              <select
                value={newPlaceCategory}
                onChange={(e) => setNewPlaceCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="HERITAGE">HERITAGE</option>
                <option value="NATURE">NATURE</option>
                <option value="TEMPLE">TEMPLE</option>
                <option value="VIEWPOINT">VIEWPOINT</option>
                <option value="FOOD">FOOD</option>
                <option value="ADVENTURE">ADVENTURE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Drone Regulation Zone</label>
            <select
              value={newPlaceDrone}
              onChange={(e) => setNewPlaceDrone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="RED">RED (Strictly Prohibited)</option>
              <option value="YELLOW">YELLOW (Permit Required)</option>
              <option value="GREEN">GREEN (Open Flying)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={newPlaceDesc}
              onChange={(e) => setNewPlaceDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAddPlaceModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={creating}>
              Save Place
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboardPage;
