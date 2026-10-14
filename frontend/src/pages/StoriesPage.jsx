import React, { useState, useEffect } from 'react';
import {
  Layers,
  Heart,
  Eye,
  Camera,
  MapPin,
  Clock,
  AlertCircle,
  Plus,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { storiesAPI, placesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const StoriesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [stories, setStories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal post story state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [caption, setCaption] = useState('');
  const [groundRealityNotes, setGroundRealityNotes] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ error: '', success: '' });

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await storiesAPI.getAll();
      if (res.data?.success) {
        setStories(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacesList = async () => {
    try {
      const res = await placesAPI.getPlaces({ limit: 40 });
      if (res.data?.success) {
        setPlaces(res.data.data);
        if (res.data.data[0]) {
          setSelectedPlaceId(res.data.data[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStories();
    fetchPlacesList();
  }, []);

  const handleLike = async (storyId) => {
    if (!isAuthenticated) return;
    try {
      const res = await storiesAPI.toggleLike(storyId);
      if (res.data?.success) {
        setStories(prev => prev.map(s => {
          if (s._id === storyId) {
            return {
              ...s,
              likes: res.data.isLiked ? [...(s.likes || []), user._id] : s.likes.filter(id => id !== user._id)
            };
          }
          return s;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setStatusMessage({ error: '', success: '' });

      const formData = new FormData();
      formData.append('placeId', selectedPlaceId);
      formData.append('caption', caption);
      formData.append('groundRealityNotes', groundRealityNotes);
      formData.append('durationSeconds', 25);
      if (mediaFile) {
        formData.append('mediaFile', mediaFile);
      } else if (mediaUrlInput) {
        formData.append('mediaUrl', mediaUrlInput);
      }

      const res = await storiesAPI.create(formData);
      if (res.data?.success) {
        setStatusMessage({ success: 'Ground-reality story published!', error: '' });
        setCaption('');
        setGroundRealityNotes('');
        setMediaFile(null);
        setMediaUrlInput('');
        await fetchStories();
        setTimeout(() => setCreateModalOpen(false), 1200);
      }
    } catch (err) {
      setStatusMessage({
        error: err.response?.data?.message || 'Posting failed: You must have a verified review or creator badge for this location.',
        success: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm">Ground-Reality Travel Feeds</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Verified Stories & Reels</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Short-form photo and video reels showing live queues, current water levels, and construction scaffolding. Strictly gated to Tier 1 and Tier 2 verified travelers.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Post Ground-Reality Story
        </Button>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-slate-400">Loading verified travel stories...</div>
      ) : stories.length === 0 ? (
        <div className="py-24 text-center glass-card rounded-3xl border border-slate-800 text-slate-400 text-xs">
          No active stories. Post the first verified ground-reality reel!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stories.map((story) => {
            const isLiked = story.likes?.some(id => (id._id || id) === user?._id);

            return (
              <div
                key={story._id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-800 flex flex-col group hover:border-slate-700 transition-all shadow-xl"
              >
                {/* Media Container */}
                <div className="relative h-80 overflow-hidden bg-slate-900">
                  <img
                    src={story.mediaUrl}
                    alt={story.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Verification Tier Pill */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={story.verificationTier === 'TIER_1_VERIFIED' ? 'success' : 'warning'} size="sm">
                      {story.verificationTier === 'TIER_1_VERIFIED' ? '🟢 GPS Verified' : '🔶 EXIF Geotag'}
                    </Badge>
                  </div>

                  {/* Place tag */}
                  <div className="absolute bottom-3 left-3 right-3 text-xs">
                    <span className="font-bold text-white block truncate">{story.place?.name}</span>
                    <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-brand-400" /> {story.place?.city}
                    </span>
                  </div>
                </div>

                {/* Ground Reality Notes & Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {story.caption && (
                      <p className="text-xs font-semibold text-white line-clamp-2">{story.caption}</p>
                    )}
                    {story.groundRealityNotes && (
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-brand-300 leading-relaxed italic">
                        ⚡ {story.groundRealityNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <img
                        src={story.user?.avatar || 'https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png'}
                        alt={story.user?.name}
                        className="w-6 h-6 rounded-full object-contain bg-sky-950/20 ring-1 ring-sky-400/30 p-0.5"
                      />
                      <span className="text-[11px] font-bold text-slate-300 truncate max-w-[90px]">
                        {story.user?.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleLike(story._id)}
                      className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                        isLiked ? 'text-rose-400' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                      <span>{story.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Ground Reality Story Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Publish Ground-Reality Story Reel" maxWidth="max-w-md">
        <form onSubmit={handleCreateStory} className="space-y-4">
          <div className="p-3 bg-brand-950/40 border border-brand-800 rounded-xl text-xs text-brand-300">
            🔒 <strong>Verification Gate:</strong> You must have a Tier 1 or Tier 2 verified visit for the chosen place or hold Creator status.
          </div>

          {statusMessage.error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300">
              {statusMessage.error}
            </div>
          )}

          {statusMessage.success && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300">
              {statusMessage.success}
            </div>
          )}

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Destination Location</label>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              {places.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Caption</label>
            <input
              type="text"
              required
              placeholder="e.g. Amber Palace Sheesh Mahal at sunrise"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">
              Ground-Reality Notes (Line lengths, water levels, scaffolding)
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Lines were 20 mins. West ramparts under conservation."
              value={groundRealityNotes}
              onChange={(e) => setGroundRealityNotes(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Upload Photo / Video Proof</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMediaFile(e.target.files[0])}
              className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1">Or Online Media URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Publish Story
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StoriesPage;
