import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  DollarSign,
  FileText,
  Users,
  Clock,
  MapPin,
  Shield,
  Layers,
  ArrowRight,
  Plus
} from 'lucide-react';
import { tripsAPI, itineraryAPI, expensesAPI } from '../services/api';
import TimelineView from '../components/itinerary/TimelineView';
import WhatIfModal from '../components/itinerary/WhatIfModal';
import DebtMatrix from '../components/expenses/DebtMatrix';
import ExpenseList from '../components/expenses/ExpenseList';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const ItineraryPage = () => {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [expenseData, setExpenseData] = useState({ expenses: [], balances: [], settlements: [] });
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('timeline'); // 'timeline', 'expenses', 'collaborators'
  const [whatIfModalOpen, setWhatIfModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Invite collaborator state
  const [collabEmail, setCollabEmail] = useState('');
  const [collabMsg, setCollabMsg] = useState('');

  const loadData = async () => {
    if (!tripId) return;
    try {
      setLoading(true);

      // 1. Fetch Trip
      const tripRes = await tripsAPI.getById(tripId);
      if (tripRes.data?.success) {
        setTrip(tripRes.data.data);
      }

      // 2. Fetch Itinerary
      try {
        const itinRes = await itineraryAPI.getByTrip(tripId);
        if (itinRes.data?.success) {
          setItinerary(itinRes.data.data);
        }
      } catch (err) {
        setItinerary(null);
      }

      // 3. Fetch Expenses & Debt Simplification
      try {
        const expRes = await expensesAPI.getSummary(tripId);
        if (expRes.data?.success) {
          setExpenseData(expRes.data.data);
        }
      } catch (err) {
        // no expenses yet
      }
    } catch (err) {
      console.error('Failed to load trip data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  // Generate Itinerary if not present
  const handleGenerateItinerary = async () => {
    try {
      setGenerating(true);
      const res = await itineraryAPI.generate(tripId);
      if (res.data?.success) {
        setItinerary(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Add Expense handler
  const handleAddExpense = async (expensePayload) => {
    await expensesAPI.add({
      ...expensePayload,
      tripId
    });
    const expRes = await expensesAPI.getSummary(tripId);
    if (expRes.data?.success) {
      setExpenseData(expRes.data.data);
    }
  };

  // Mark debt settled handler
  const handleMarkSettled = async (settlement) => {
    // If expense records exist, mark participant share settled
    if (expenseData.expenses && expenseData.expenses[0]) {
      await expensesAPI.markShareSettled({
        expenseId: expenseData.expenses[0]._id,
        participantUserId: settlement.fromUser?._id
      });
      const expRes = await expensesAPI.getSummary(tripId);
      if (expRes.data?.success) {
        setExpenseData(expRes.data.data);
      }
    }
  };

  // Add collaborator
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!collabEmail) return;
    try {
      const res = await tripsAPI.addCollaborator(tripId, { email: collabEmail, role: 'EDITOR' });
      if (res.data?.success) {
        setCollabMsg(`Collaborator invited successfully!`);
        setCollabEmail('');
        setTrip(res.data.data);
      }
    } catch (err) {
      setCollabMsg(err.response?.data?.message || 'Failed to add collaborator');
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading complete trip itinerary, weather telemetry, and group ledger...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h3 className="text-lg font-bold text-white">Trip Not Found</h3>
        <p className="text-xs text-slate-400 mt-2">The requested trip ID does not exist or you do not have permission.</p>
        <Link to="/planner" className="mt-4 inline-block">
          <Button variant="primary" size="sm">Create a New Trip</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Trip Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">{trip.travelPersonality} Archetype</Badge>
              <Badge variant="emerald" size="sm">Active Safety Window: {trip.dailyActiveWindow?.startTime} – {trip.dailyActiveWindow?.endTime}</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">{trip.title}</h2>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              {trip.originCity} ➔ {trip.destinationCity} • {trip.totalDays} Days ({new Date(trip.startDate).toDateString()} – {new Date(trip.endDate).toDateString()})
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trip Budget</span>
            <p className="text-2xl sm:text-3xl font-black text-brand-400">₹{trip.totalBudget?.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Budget-partitioned for transit, stay, food & buffer</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'timeline'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Field Schedule & Timetable
          </button>

          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'expenses'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Group Cost Splitter & UPI
          </button>

          <button
            onClick={() => setActiveSubTab('collaborators')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'collaborators'
                ? 'bg-brand-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Travel Companions ({trip.collaborators?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab 1: Timeline View */}
      {activeSubTab === 'timeline' && (
        <div>
          {!itinerary ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 space-y-4">
              <Sparkles className="w-12 h-12 text-brand-400 mx-auto animate-pulse" />
              <h3 className="text-lg font-bold text-white">Generate Your Clustered AI Timetable</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                The smart sequencing engine will group your spots by proximity, avoid midday palace heat, schedule breakfast at legendary cafes, and protect you with safety window rules.
              </p>
              <Button
                variant="primary"
                size="md"
                loading={generating}
                onClick={handleGenerateItinerary}
              >
                <Sparkles className="w-4 h-4" /> Synthesize AI Itinerary Now
              </Button>
            </div>
          ) : (
            <TimelineView
              itinerary={itinerary}
              trip={trip}
              onOpenWhatIf={() => setWhatIfModalOpen(true)}
            />
          )}
        </div>
      )}

      {/* Tab 2: Group Expense Splitter & UPI */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-8">
          <ExpenseList
            expenses={expenseData.expenses}
            trip={trip}
            onAddExpense={handleAddExpense}
          />
          <DebtMatrix
            settlements={expenseData.settlements}
            balances={expenseData.balances}
            onMarkSettled={handleMarkSettled}
          />
        </div>
      )}

      {/* Tab 3: Collaborators & Sharing */}
      {activeSubTab === 'collaborators' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white">Travel Companions & Collaborators</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Invite friends to co-plan stops, view the offline timetable, and automatically split receipts.
            </p>
          </div>

          {collabMsg && (
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-brand-300">
              {collabMsg}
            </div>
          )}

          <form onSubmit={handleAddCollaborator} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Enter friend's registered TripSync email..."
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
            />
            <Button variant="primary" size="sm" type="submit">
              Invite Companion
            </Button>
          </form>

          <div className="space-y-2 pt-2">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">{trip.owner?.name} (Trip Owner)</p>
                <p className="text-[10px] text-slate-400">{trip.owner?.email}</p>
              </div>
              <Badge variant="gold" size="sm">Organizer</Badge>
            </div>

            {trip.collaborators?.map((c, i) => (
              <div key={i} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{c.user?.name || 'Companion'}</p>
                  <p className="text-[10px] text-slate-400">{c.user?.email}</p>
                </div>
                <Badge variant="primary" size="sm">{c.role || 'EDITOR'}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What-If Replanner Modal */}
      <WhatIfModal
        isOpen={whatIfModalOpen}
        onClose={() => setWhatIfModalOpen(false)}
        tripId={trip._id}
        onItineraryUpdated={(updated) => setItinerary(updated)}
      />
    </div>
  );
};

export default ItineraryPage;
