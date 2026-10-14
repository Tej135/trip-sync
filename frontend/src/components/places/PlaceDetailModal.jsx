import React, { useState, useEffect } from 'react';
import {
  Star,
  Shield,
  MapPin,
  Clock,
  Car,
  Footprints,
  Utensils,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ThumbsUp,
  Share2,
  Plus
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import SafetyScoreCard from './SafetyScoreCard';
import CreatorZoneCard from './CreatorZoneCard';
import { placesAPI, reviewsAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';

const PlaceDetailModal = ({ isOpen, onClose, placeId }) => {
  const { user, isAuthenticated } = useAuth();
  const { trayPlaces, addPlaceToActiveTrip, removePlaceFromActiveTrip } = useTrip();

  const [placeData, setPlaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'creator', 'food', 'reviews'
  
  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [proofPhoto, setProofPhoto] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');
  const [reviewErrorMessage, setReviewErrorMessage] = useState('');

  // Physical Dwell Check-in state
  const [dwellCheckingIn, setDwellCheckingIn] = useState(false);
  const [dwellCheckinMessage, setDwellCheckinMessage] = useState('');

  const fetchDetails = async () => {
    if (!placeId) return;
    try {
      setLoading(true);
      const res = await placesAPI.getDetails(placeId);
      if (res.data?.success) {
        setPlaceData(res.data.data);
      }
    } catch (err) {
      console.error('Fetch place details error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && placeId) {
      fetchDetails();
      setShowReviewForm(false);
      setReviewSuccessMessage('');
      setReviewErrorMessage('');
      setDwellCheckinMessage('');
    }
  }, [isOpen, placeId]);

  if (!isOpen) return null;

  const place = placeData?.place || {};
  const nearbyRestaurants = placeData?.nearbyRestaurants || [];
  const reviews = placeData?.reviews || [];
  const inTray = trayPlaces.some(p => (p._id || p) === place._id);

  // Handle GPS Dwell check-in
  const handleGpsDwellCheckin = async () => {
    try {
      setDwellCheckingIn(true);
      const [lng, lat] = place.location?.coordinates || [75.8, 26.9];
      const res = await userAPI.recordDwell({
        longitude: lng,
        latitude: lat,
        accuracy: 5,
        dwellMinutes: 25 // Simulating 25 min dwell
      });
      if (res.data?.success) {
        setDwellCheckinMessage(res.data.message);
      }
    } catch (err) {
      setDwellCheckinMessage(err.response?.data?.message || 'Check-in failed');
    } finally {
      setDwellCheckingIn(false);
    }
  };

  // Submit verified review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      setReviewErrorMessage('');
      setReviewSuccessMessage('');

      const formData = new FormData();
      formData.append('placeId', place._id);
      formData.append('rating', reviewRating);
      formData.append('title', reviewTitle);
      formData.append('comment', reviewComment);
      if (proofPhoto) {
        formData.append('photoProof', proofPhoto);
      }

      const res = await reviewsAPI.create(formData);
      if (res.data?.success) {
        setReviewSuccessMessage(res.data.message);
        setShowReviewForm(false);
        setReviewTitle('');
        setReviewComment('');
        setProofPhoto(null);
        await fetchDetails(); // Refresh ratings and reviews list
      }
    } catch (err) {
      setReviewErrorMessage(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={place.name || 'Place Details'} maxWidth="max-w-4xl">
      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading comprehensive place intelligence...</div>
      ) : (
        <div>
          {/* Cover & Gallery */}
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 group">
            <img
              src={place.photoUrls?.[0] || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            
            {/* Top badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="primary" size="lg">{place.category}</Badge>
              <Badge variant="gold" size="lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {place.averageRating} ({place.totalVerifiedReviews} Verified Reviews)
              </Badge>
            </div>

            {/* Bottom quick actions */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">{place.name}</p>
                <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  {place.city}, {place.state}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={inTray ? 'emerald' : 'primary'}
                  size="sm"
                  onClick={() => inTray ? removePlaceFromActiveTrip(place._id) : addPlaceToActiveTrip(place)}
                >
                  {inTray ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inTray ? 'In Active Trip' : 'Add to Trip'}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Safety' },
              { id: 'creator', label: 'Creator & Drone Zone' },
              { id: 'food', label: 'Nearby Iconic Food' },
              { id: 'reviews', label: `Verified Reviews (${reviews.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview & Safety */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description & Key Details */}
              <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
                <h4 className="text-sm font-bold text-white mb-2">About This Destination</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{place.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Ideal Stay Duration</span>
                    <p className="text-sm font-bold text-white mt-0.5">{place.recommendedDurationMinutes} minutes</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Best Window</span>
                    <p className="text-sm font-bold text-brand-300 mt-0.5">{place.bestTimeToVisit || 'Morning'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Entry Fee (Indian)</span>
                    <p className="text-sm font-bold text-white mt-0.5">₹{place.entryFees?.indian || 0}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Foreigner Entry</span>
                    <p className="text-sm font-bold text-white mt-0.5">₹{place.entryFees?.foreigner || 0}</p>
                  </div>
                </div>
              </div>

              {/* Safety Score Component */}
              <SafetyScoreCard safetyScore={place.safetyScore} />

              {/* Facilities & Last-Mile Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Facilities & Restrooms
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Clean Restrooms:</span>
                      <span className="font-bold text-white">
                        {place.facilities?.toiletAvailable ? `Available (Cleanliness: ${place.facilities.toiletCleanlinessScore}/5)` : 'Not on premises'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Parking Space:</span>
                      <span className="font-bold text-white">{place.facilities?.parkingAvailable ? 'Available on-site' : 'Street parking'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Wheelchair Accessible:</span>
                      <span className="font-bold text-white">{place.facilities?.wheelchairAccessible ? 'Yes' : 'Partial / Steps'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">UPI Payments Accepted:</span>
                      <span className="font-bold text-emerald-400">{place.facilities?.upiAccepted ? 'Yes (GPay / PhonePe / Paytm)' : 'Cash Only'}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Last-Mile Transit & Access
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {place.lastMileTransit?.directions || 'Easily accessible via local autos, taxi aggregator apps (Uber/Ola), and city buses.'}
                  </p>
                  <div className="mt-3 text-xs text-slate-400 space-y-1">
                    <p>• Walking Distance from Gate: {place.lastMileTransit?.walkingDistanceMeters || 100} meters</p>
                    <p>• Estimated Parking Fee: ₹{place.lastMileTransit?.parkingFee || 40}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Creator Zone */}
          {activeTab === 'creator' && (
            <CreatorZoneCard creatorInfo={place.creatorInfo} />
          )}

          {/* Tab 3: Food & Iconic Dishes */}
          {activeTab === 'food' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-400" />
                Vetted Nearby Eateries & Legendary Dishes
              </h4>

              {nearbyRestaurants.length === 0 ? (
                <p className="text-xs text-slate-400">No restaurants currently indexed within 2km.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyRestaurants.map((rest) => (
                    <div key={rest._id} className="glass-card p-4 rounded-xl border border-slate-700/80">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-white text-sm">{rest.name}</h5>
                          <p className="text-xs text-slate-400">{rest.cuisines?.join(', ')}</p>
                        </div>
                        <div className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded text-xs font-bold border border-amber-700/60">
                          ★ {rest.rating}
                        </div>
                      </div>

                      {rest.famousDishes && rest.famousDishes.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                          <p className="text-[10px] uppercase font-bold text-amber-400">Must-Try Iconic Dish:</p>
                          {rest.famousDishes.map((dish, dIdx) => (
                            <div key={dIdx} className="text-xs bg-slate-900/60 p-2 rounded-lg">
                              <div className="flex items-center justify-between font-bold text-slate-200">
                                <span>{dish.dishName}</span>
                                <span className="text-brand-300">₹{dish.price}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{dish.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Verified Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Check-in / Review Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white">Proof-of-Travel Review Engine</h4>
                  <p className="text-xs text-slate-400">Reviews must provide GPS dwell proof or geotagged photos to alter star ratings.</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={dwellCheckingIn}
                    onClick={handleGpsDwellCheckin}
                  >
                    Simulate Dwell Check-In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? 'Cancel' : 'Write Review'}
                  </Button>
                </div>
              </div>

              {dwellCheckinMessage && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                  {dwellCheckinMessage}
                </div>
              )}

              {reviewSuccessMessage && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                  {reviewSuccessMessage}
                </div>
              )}

              {reviewErrorMessage && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300">
                  {reviewErrorMessage}
                </div>
              )}

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="glass-card p-5 rounded-2xl border border-slate-700 space-y-4">
                  <h5 className="font-bold text-sm text-white">Submit Proof-of-Travel Verified Review</h5>
                  
                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setReviewRating(s)}
                          className={`p-2 rounded-xl text-sm font-bold flex items-center gap-1 ${
                            reviewRating >= s ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" /> {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Review Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="e.g. Early morning tranquility before crowds"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">Detailed Traveler Experience</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe lines, ticket checks, lighting, and ground reality..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-medium block mb-1">
                      Upload Proof Photo (for Tier 2 EXIF Geotag Verification)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofPhoto(e.target.files[0])}
                      className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                    />
                  </div>

                  <Button type="submit" variant="primary" loading={submittingReview}>
                    Publish Verified Review
                  </Button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.map((rev) => {
                  const isTier1 = rev.verificationTier === 'TIER_1_VERIFIED';
                  const isTier2 = rev.verificationTier === 'TIER_2_LIKELY';

                  return (
                    <div key={rev._id} className="glass-card p-4 rounded-xl border border-slate-800">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.user?.avatar || 'https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png'}
                            alt={rev.user?.name}
                            className="w-8 h-8 rounded-full object-contain bg-sky-950/20 ring-1 ring-sky-400/30 p-0.5"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{rev.user?.name}</p>
                            <p className="text-[10px] text-amber-400">{rev.user?.explorerLevel || 'EXPLORER'} Level</p>
                          </div>
                        </div>

                        {/* Verification Tier Badge */}
                        <div>
                          {isTier1 && (
                            <Badge variant="success" size="sm">
                              🟢 Tier 1: Verified Traveler (GPS)
                            </Badge>
                          )}
                          {isTier2 && (
                            <Badge variant="warning" size="sm">
                              🔶 Tier 2: Likely Visited (EXIF)
                            </Badge>
                          )}
                          {!isTier1 && !isTier2 && (
                            <Badge variant="default" size="sm">
                              ⚪ Unverified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-2">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        {rev.title && <span className="text-white ml-2">{rev.title}</span>}
                      </div>

                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rev.comment}</p>

                      {rev.photos && rev.photos[0] && (
                        <div className="mt-3 w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                          <img src={rev.photos[0].url} alt="Proof" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default PlaceDetailModal;
