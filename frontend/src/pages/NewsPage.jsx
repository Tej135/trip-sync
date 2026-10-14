import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Share2,
  ThumbsUp,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Flame
} from 'lucide-react';
import { storiesAPI, placesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const NewsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal post news state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [headline, setHeadline] = useState('');
  const [newsCategory, setNewsCategory] = useState('ALERT');
  const [details, setDetails] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ error: '', success: '' });
  const [upvotes, setUpvotes] = useState({});

  // Seeded baseline real-time travel news
  const defaultNews = [
    {
      _id: 'news-1',
      title: 'Araku Valley Vistadome Glass Coach Schedule Expanded for Winter Peak',
      category: 'TRANSIT',
      city: 'Visakhapatnam',
      locationName: 'Araku Valley & Kothavalasa-Kirandul Line',
      timestamp: '2 hours ago',
      verified: true,
      summary: 'Due to soaring tourist demand for the winter coffee harvest season, East Coast Railway has attached additional panoramic Vistadome coaches on train #18551/18552 traversing the scenic 58 tunnels.',
      groundReality: 'Advance booking opens 60 days prior on IRCTC and fills within minutes. If seats are sold out, government RTC deluxe buses from RTC Complex Vizag operate every 45 mins.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      source: 'East Coast Railway Advisory'
    },
    {
      _id: 'news-2',
      title: 'Rushikonda Beach Retains Prestigious International Blue Flag Eco-Label',
      category: 'ECO_BEACH',
      city: 'Visakhapatnam',
      locationName: 'Rushikonda Beach',
      timestamp: '5 hours ago',
      verified: true,
      summary: 'Visakhapatnam’s Rushikonda beach has successfully met all 33 stringent environmental and safety criteria of the Foundation for Environmental Education (FEE) Denmark to retain its Blue Flag eco-certification.',
      groundReality: 'Clean shower rooms, solar lighting, wheelchair ramps, and certified lifeguards on patrol until 6:00 PM. High-tide water sports and sea kayaking are operational.',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      source: 'AP Tourism Department'
    },
    {
      _id: 'news-3',
      title: 'Charminar Pedestrianization Zone Fully Operational: Evening Illumination Schedule',
      category: 'HERITAGE',
      city: 'Hyderabad',
      locationName: 'Charminar & Laad Bazaar Precinct',
      timestamp: '1 day ago',
      verified: true,
      summary: 'The comprehensive Charminar Pedestrianization Project (CPP) has completed cobblestone paving around the monument. Vehicular traffic is permanently restricted within 300 meters, enabling serene walking tours.',
      groundReality: 'Night floodlights illuminate the four 1591 stucco minarets from 6:45 PM to 10:30 PM daily. Excellent time to photograph the monument and enjoy Irani chai at Nimrah Cafe across the plaza.',
      imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
      source: 'Telangana Heritage Authority'
    },
    {
      _id: 'news-4',
      title: 'Lambasingi Experiences Dense Valley Fog & Cold Wave of 3.8°C',
      category: 'WEATHER',
      city: 'Visakhapatnam',
      locationName: 'Lambasingi & Chintapalli Hills',
      timestamp: '1 day ago',
      verified: true,
      summary: 'Popularly known as the "Kashmir of Andhra Pradesh", Lambasingi saw mercury dip to 3.8°C this morning. Thick cloud bed inversions greeted campers in the pine forests.',
      groundReality: 'Drive with caution on Narsipatnam-Chintapalli ghat road between 5:00 AM and 8:30 AM due to near-zero fog visibility. Carry heavy thermal jackets and book tent stays in advance.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      source: 'IMD Coastal Andhra Advisory'
    },
    {
      _id: 'news-5',
      title: 'Golconda Fort Acoustic Sound & Light Show Timings Updated',
      category: 'HERITAGE',
      city: 'Hyderabad',
      locationName: 'Golconda Fort Citadel',
      timestamp: '2 days ago',
      verified: true,
      summary: 'Telangana Tourism has announced updated timings for the iconic Golconda Fort English and Telugu Sound & Light narration shows narrated by Amitabh Bachchan.',
      groundReality: 'First show (English) commences at 6:30 PM; second show (Telugu) at 7:45 PM. Buy tickets online or arrive by 5:30 PM at the main gateway ticket counter.',
      imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80',
      source: 'Telangana Tourism Bulletin'
    }
  ];

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await storiesAPI.getAll();
      if (res.data?.success && res.data.data.length > 0) {
        // Map backend stories to news structure
        const mapped = res.data.data.map(item => ({
          _id: item._id,
          title: item.caption,
          category: 'COMMUNITY',
          city: item.place?.city || 'Hyderabad',
          locationName: item.place?.name || 'Local Destination',
          timestamp: new Date(item.createdAt).toLocaleDateString(),
          verified: item.verificationTier === 'TIER_1_VERIFIED',
          summary: item.caption,
          groundReality: item.groundRealityNotes || 'Verified ground status submitted by explorer.',
          imageUrl: item.mediaUrl || defaultNews[0].imageUrl,
          source: item.user?.name || 'Verified Explorer'
        }));
        setNewsList([...mapped, ...defaultNews]);
      } else {
        setNewsList(defaultNews);
      }
    } catch (err) {
      console.error(err);
      setNewsList(defaultNews);
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
    fetchNews();
    fetchPlacesList();
  }, []);

  const handleUpvote = (id) => {
    setUpvotes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handlePostNews = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setStatusMessage({ error: 'Please sign in to post a live travel update.', success: '' });
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage({ error: '', success: '' });

      const res = await storiesAPI.create({
        placeId: selectedPlaceId,
        caption: headline,
        groundRealityNotes: details,
        mediaUrl: mediaUrlInput || 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
        mediaType: 'PHOTO'
      });

      if (res.data?.success) {
        setStatusMessage({ error: '', success: 'Travel news update published successfully!' });
        setHeadline('');
        setDetails('');
        setMediaUrlInput('');
        fetchNews();
        setTimeout(() => setCreateModalOpen(false), 1500);
      }
    } catch (err) {
      setStatusMessage({ error: err.response?.data?.message || 'Failed to publish news update', success: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredNews = newsList.filter(item => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FAF8F5] text-charcoal font-sans min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-stone-200 shadow-card-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-terracotta border border-orange-200 mb-3">
              <Flame className="w-3.5 h-3.5 text-terracotta" /> Live Ground Reality News
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
              Real-Time Travel News & Advisories
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
              Verified road closures, train capacity updates, monument timings, weather warnings, and local festival alerts across Hyderabad, Visakhapatnam, and Araku Valley.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-terracotta hover:bg-terracotta-hover text-white font-black text-xs shadow-pop-terracotta transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Report Live Update
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'ALL', label: 'All News' },
              { id: 'TRANSIT', label: '🚆 Trains & Roads' },
              { id: 'HERITAGE', label: '🕌 Monuments & Forts' },
              { id: 'ECO_BEACH', label: '🏖️ Beaches' },
              { id: 'WEATHER', label: '⛅ Weather & Fog' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-charcoal text-white shadow-card-warm'
                    : 'text-stone-500 hover:text-charcoal hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search news & alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-charcoal focus:outline-none focus:border-terracotta"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* News Feed Grid */}
        {loading ? (
          <div className="py-24 text-center text-xs text-stone-400">Fetching latest travel updates...</div>
        ) : filteredNews.length === 0 ? (
          <div className="py-24 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
            No travel news matching your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news) => {
              const count = upvotes[news._id] || 12;
              return (
                <div
                  key={news._id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-stone-300 shadow-card-warm hover:shadow-float-card transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* News Image Cover */}
                    <div className="h-48 relative overflow-hidden bg-stone-100">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-charcoal/85 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {news.category}
                        </span>
                        {news.verified && (
                          <span className="bg-emerald-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2.5 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-terracotta" /> {news.locationName}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2">
                        <span className="font-semibold">{news.source}</span>
                        <span>{news.timestamp}</span>
                      </div>

                      <h3 className="font-black text-base text-charcoal leading-snug line-clamp-2">
                        {news.title}
                      </h3>

                      <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed">
                        {news.summary}
                      </p>

                      {/* Ground Reality Alert Box */}
                      {news.groundReality && (
                        <div className="mt-3.5 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-600 leading-relaxed">
                          <p className="font-bold text-terracotta flex items-center gap-1 text-[11px] uppercase tracking-wider mb-0.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Traveler Ground Advisory:
                          </p>
                          <p className="text-[11px]">{news.groundReality}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleUpvote(news._id)}
                      className="flex items-center gap-1.5 font-bold text-stone-600 hover:text-terracotta transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({count})
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: news.title, text: news.summary, url: window.location.href });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('News link copied to clipboard!');
                        }
                      }}
                      className="flex items-center gap-1 font-bold text-stone-500 hover:text-charcoal"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal to Post Live Travel News / Advisory */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="📢 Report Live Travel News / Ground Advisory"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handlePostNews} className="space-y-4">
          {statusMessage.error && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-200 text-xs text-red-700 font-bold">
              {statusMessage.error}
            </div>
          )}
          {statusMessage.success && (
            <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-xs text-emerald-800 font-bold">
              {statusMessage.success}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Target Tourist Spot</label>
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl p-2.5 text-xs text-charcoal font-semibold focus:outline-none"
            >
              {places.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">News Headline / Alert</label>
            <input
              type="text"
              required
              placeholder="e.g. Fog delay on Araku ghat road or Charminar night light schedule"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl p-2.5 text-xs text-charcoal font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Ground Reality Advisory & Travel Tips</label>
            <textarea
              required
              rows={3}
              placeholder="Provide exact details: road conditions, ticket counter queues, timings changes, or weather tips."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Photo URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={mediaUrlInput}
              onChange={(e) => setMediaUrlInput(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full font-black shadow-pop-terracotta" loading={submitting}>
              Publish Live Advisory
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewsPage;
