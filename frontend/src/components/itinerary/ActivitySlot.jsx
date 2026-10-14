import React from 'react';
import {
  Clock,
  Utensils,
  Car,
  MapPin,
  Coffee,
  AlertTriangle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import Badge from '../common/Badge';

const ActivitySlot = ({ slot }) => {
  const typeIcons = {
    MEAL: Utensils,
    TRANSIT: Car,
    PLACE_VISIT: MapPin,
    REST_BUFFER: Coffee,
  };

  const Icon = typeIcons[slot.slotType] || MapPin;

  const typeBadges = {
    MEAL: 'warning',
    TRANSIT: 'primary',
    PLACE_VISIT: 'emerald',
    REST_BUFFER: 'default'
  };

  return (
    <div className="relative pl-6 pb-6 group last:pb-0">
      {/* Timeline connector line */}
      <div className="absolute left-[11px] top-4 bottom-0 w-0.5 bg-slate-800 group-last:hidden" />

      {/* Circle Icon Indicator */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-brand-400 flex items-center justify-center shadow-glow">
        <Icon className="w-3 h-3 text-brand-400" />
      </div>

      {/* Slot Content Card */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-slate-700 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-brand-300 border border-slate-700">
              {slot.startTime} – {slot.endTime}
            </span>
            <Badge variant={typeBadges[slot.slotType] || 'default'} size="sm">
              {slot.slotType?.replace('_', ' ')}
            </Badge>
          </div>

          {slot.cost > 0 && (
            <span className="text-xs font-bold text-slate-300">
              ₹{slot.cost}
            </span>
          )}
        </div>

        <h5 className="font-bold text-sm text-white">{slot.title}</h5>

        {/* Turn-by-Turn Transit details */}
        {slot.transitDetails && slot.transitDetails.instructions && (
          <div className="mt-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-slate-300 flex items-start gap-2">
            <Car className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Transit Mode: {slot.transitDetails.mode}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{slot.transitDetails.instructions}</p>
              {slot.transitDetails.deepLink && (
                <a
                  href={slot.transitDetails.deepLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-brand-400 hover:underline mt-1 font-semibold"
                >
                  Book Cab Gateway <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Meal recommendations */}
        {slot.mealDetails && slot.mealDetails.recommendedDish && (
          <div className="mt-2 text-xs bg-amber-950/20 p-2.5 rounded-xl border border-amber-800/30 text-amber-200">
            <p className="font-bold flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              Must-Order: {slot.mealDetails.recommendedDish}
            </p>
            {slot.mealDetails.cuisine && (
              <p className="text-[11px] text-slate-400 mt-0.5">Cuisine: {slot.mealDetails.cuisine}</p>
            )}
          </div>
        )}

        {/* General notes */}
        {slot.notes && (
          <p className="text-xs text-slate-400 mt-2 leading-relaxed italic">
            Note: {slot.notes}
          </p>
        )}

        {/* Safety Window Alert */}
        {slot.safetyCheck && slot.safetyCheck.isAfterDark && (
          <div className="mt-2 p-2 rounded-lg bg-red-950/30 border border-red-800/50 text-[11px] text-red-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>Night exploration warning: {slot.safetyCheck.warning || 'Conclude outdoor visits before dark.'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySlot;
