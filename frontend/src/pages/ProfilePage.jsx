import React, { useState } from 'react';
import {
  User,
  Shield,
  Star,
  Award,
  Sparkles,
  CreditCard,
  CheckCircle2,
  Edit3,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const ProfilePage = () => {
  const { user, isPro, reloadUser, updateProfile } = useAuth();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [homeCity, setHomeCity] = useState(user?.homeCity || 'New Delhi');
  const [personality, setPersonality] = useState(user?.personalityArchetype || 'EXPLORER');
  const [updating, setUpdating] = useState(false);

  // Pro Subscription upgrade state
  const [proLoading, setProLoading] = useState(false);
  const [proSuccess, setProSuccess] = useState('');

  const levels = [
    { name: 'BRONZE', min: 0, max: 5 },
    { name: 'SILVER', min: 6, max: 20 },
    { name: 'GOLD', min: 21, max: 50 },
    { name: 'PLATINUM', min: 51, max: 100 },
    { name: 'DIAMOND', min: 100, max: Infinity },
  ];

  const currentLevelIndex = levels.findIndex(l => l.name === (user?.explorerLevel || 'BRONZE'));
  const currentReviews = user?.verifiedReviewsCount || 0;

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await updateProfile({
        name,
        bio,
        homeCity,
        personalityArchetype: personality
      });
      setEditModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleSubscribePro = async (plan = 'monthly') => {
    try {
      setProLoading(true);
      setProSuccess('');

      // 1. Create order
      const orderRes = await userAPI.createProOrder({ plan });
      if (orderRes.data?.success) {
        const order = orderRes.data.data;

        // 2. Simulate Razorpay payment verification
        const verifyRes = await userAPI.verifyPro({
          orderId: order.id,
          paymentId: `pay_pro_${Date.now()}`,
          signature: 'pro_sig_ok',
          plan
        });

        if (verifyRes.data?.success) {
          setProSuccess('🎉 Congratulations! TripSync Pro membership activated successfully.');
          await reloadUser();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.avatar || 'https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png'}
              alt={user?.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-contain bg-sky-950/20 ring-2 ring-sky-400/30 p-1"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-white">{user?.name}</h2>
                {isPro && (
                  <Badge variant="primary" size="sm">PRO MEMBER</Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="gold" size="sm">{user?.explorerLevel || 'BRONZE'} EXPLORER</Badge>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-medium">{user?.personalityArchetype || 'EXPLORER'}</span>
              </div>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(true)}>
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </Button>
        </div>

        {user?.bio && (
          <p className="text-xs text-slate-300 mt-6 leading-relaxed italic bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            "{user.bio}"
          </p>
        )}
      </div>

      {/* Explorer Level Progress */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Community Explorer Level Progress
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Levels advance exclusively by publishing verified GPS dwell & EXIF geotag reviews.
            </p>
          </div>
          <span className="text-sm font-black text-amber-400">
            {currentReviews} Verified Reviews
          </span>
        </div>

        {/* Level Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {levels.map((lvl, idx) => {
            const isCompleted = idx <= currentLevelIndex;
            return (
              <div
                key={lvl.name}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCompleted
                    ? 'bg-amber-950/40 border-amber-600/80 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <p className={`text-xs font-black ${isCompleted ? 'text-amber-300' : 'text-slate-400'}`}>
                  {lvl.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {lvl.min}{lvl.max === Infinity ? '+' : `-${lvl.max}`} reviews
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Earned */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Earned Badges & Distinctions
        </h3>

        {user?.badges && user.badges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {user.badges.map((b, i) => (
              <div key={i} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
                <span className="text-2xl">{b.icon || '🏅'}</span>
                <div>
                  <p className="text-xs font-bold text-white">{b.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-xs text-slate-400 text-center">
            No badges unlocked yet. Review places with GPS dwell time or upload geotagged photos to earn badges.
          </div>
        )}
      </div>

      {/* Pro Membership Card */}
      {!isPro ? (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-950 via-slate-900 to-slate-900 border border-brand-800/80 shadow-glow space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge variant="gold" size="sm">TripSync Pro Upgrade</Badge>
              <h3 className="text-xl font-black text-white mt-1">Upgrade for Unlimited AI Itineraries & PDF Booklets</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Unlock What-If dynamic replanning, unlimited day timetable generation, offline printable travel booklets, and priority local guide reservations.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-brand-400">₹299</span>
              <span className="text-xs text-slate-400"> / month</span>
            </div>
          </div>

          {proSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300">
              {proSuccess}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              loading={proLoading}
              onClick={() => handleSubscribePro('monthly')}
            >
              <CreditCard className="w-4 h-4" /> Subscribe Monthly (₹299 via Razorpay)
            </Button>
            <Button
              variant="secondary"
              size="md"
              loading={proLoading}
              onClick={() => handleSubscribePro('annual')}
            >
              Annual Pass (₹1,999/yr — Save 45%)
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-800 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>TripSync Pro Active — Unlimited AI generations & PDF booklets unlocked.</span>
          </div>
          <Badge variant="success" size="sm">ACTIVE</Badge>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Traveler Profile" maxWidth="max-w-md">
        <form onSubmit={handleEditProfile} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Home City</label>
            <input
              type="text"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Travel Personality Archetype</label>
            <select
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="EXPLORER">Explorer (High energy, max sights)</option>
              <option value="RELAXED">Relaxed (Slow travel, minimal hopping)</option>
              <option value="CONTENT_CREATOR">Creator (Golden hours, vantage points)</option>
              <option value="FAMILY">Family (Safe, accessible, low walking)</option>
              <option value="BUDGET_BACKPACKER">Backpacker (Hostels, lowest transit)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={updating}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
