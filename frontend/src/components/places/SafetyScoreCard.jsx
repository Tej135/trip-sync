import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Wifi, Moon, Heart, Hospital, Mountain, Sun } from 'lucide-react';

const SafetyScoreCard = ({ safetyScore = {} }) => {
  const overall = safetyScore.overall || 8.5;

  const getScoreColor = (score) => {
    if (score >= 8.0) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    if (score >= 6.0) return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    return 'text-rose-400 bg-rose-950/60 border-rose-800/60';
  };

  const metrics = [
    { label: 'Crime Safety', val: safetyScore.crime || 8.5, icon: Shield, desc: 'Historical safety index & police proximity' },
    { label: 'Women Safety', val: safetyScore.women || 8.5, icon: Heart, desc: 'Derived from verified female traveler reviews' },
    { label: 'Night Exploration', val: safetyScore.night || 7.5, icon: Moon, desc: 'Street lighting & evening crowd presence' },
    { label: 'Network Signal', val: safetyScore.network || 8.0, icon: Wifi, desc: '4G/5G mobile tower coverage' },
    { label: 'Medical Proximity', val: safetyScore.medical || 8.0, icon: Hospital, desc: 'Proximity to nearest clinic/hospital' },
    { label: 'Terrain Difficulty', val: safetyScore.terrain || 8.5, icon: Mountain, desc: 'Pavement walking quality & steps' },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Safety & Risk Assessment
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Continuous evaluation from verified traveler telemetry</p>
        </div>

        {/* Big Overall Gauge */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-black text-xl shadow-lg ${getScoreColor(overall)}`}>
          <span>{overall}</span>
          <span className="text-xs font-semibold opacity-75">/ 10</span>
        </div>
      </div>

      {/* Grid of Sub-Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-brand-400" />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getScoreColor(m.val)}`}>
                  {m.val}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-200">{m.label}</p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{m.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SafetyScoreCard;
