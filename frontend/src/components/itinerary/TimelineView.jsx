import React, { useState } from 'react';
import {
  Calendar,
  CloudSun,
  Download,
  Sparkles,
  DollarSign,
  AlertCircle,
  FileText
} from 'lucide-react';
import ActivitySlot from './ActivitySlot';
import Button from '../common/Button';
import Badge from '../common/Badge';

const TimelineView = ({ itinerary, trip, onOpenWhatIf }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
        <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">No Itinerary Generated Yet</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Add spots from the Explore Map to your trip tray or click "Generate AI Itinerary" to assemble your optimized timeline.
        </p>
      </div>
    );
  }

  const currentDay = itinerary.days[activeDayIndex] || itinerary.days[0];
  const weather = currentDay.weatherSummary || {};

  const handleDownloadPdf = () => {
    window.open(`/api/v1/booklet/download/${trip._id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Day Tabs & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        {/* Day Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {itinerary.days.map((day, idx) => (
            <button
              key={day.dayNumber || idx}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeDayIndex === idx
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Day {day.dayNumber}</span>
              <span className="text-[10px] opacity-75">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onOpenWhatIf}>
            <Sparkles className="w-4 h-4 text-brand-400" />
            What-If Re-Planner
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <FileText className="w-4 h-4 text-brand-400" />
            Offline Booklet (PDF)
          </Button>
        </div>
      </div>

      {/* Active Day Banner (Weather & Theme) */}
      <div className="glass-card rounded-2xl p-5 border border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-brand-950/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="primary" size="sm">Day {currentDay.dayNumber} Theme</Badge>
          <h4 className="text-lg font-bold text-white mt-1">{currentDay.theme}</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Total Transit: ~{currentDay.totalDistanceKm || 14} km | Projected Spend: ₹{currentDay.estimatedDayCost || 1200}
          </p>
        </div>

        {/* Live Weather Forecast Strip */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
          <CloudSun className="w-6 h-6 text-amber-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{weather.tempC || 28}°C</span>
              <span className="text-slate-300 font-medium">{weather.condition || 'Sunny & Pleasant'}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Rain Risk: {weather.rainProbability || 5}%</span>
              <span>•</span>
              <span>AQI: {weather.aqi || 85}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Slots */}
      <div className="mt-6">
        {currentDay.slots && currentDay.slots.length > 0 ? (
          currentDay.slots.map((slot, sIdx) => (
            <ActivitySlot key={slot._id || sIdx} slot={slot} />
          ))
        ) : (
          <p className="text-xs text-slate-400">No slots configured for this day.</p>
        )}
      </div>

      {/* AI Intelligence Notes */}
      {itinerary.aiGeneratedNotes && (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 leading-relaxed italic">
          💡 <span className="font-semibold text-slate-300">Itinerary Optimization Rationale: </span>
          {itinerary.aiGeneratedNotes}
        </div>
      )}
    </div>
  );
};

export default TimelineView;
