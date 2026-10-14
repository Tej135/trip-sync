import React, { useState } from 'react';
import { Sparkles, CalendarPlus, DollarSign, Clock, CloudRain, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { itineraryAPI } from '../../services/api';

const WhatIfModal = ({ isOpen, onClose, tripId, onItineraryUpdated }) => {
  const [selectedScenario, setSelectedScenario] = useState('EXTEND_DAY');
  const [budgetIncrease, setBudgetIncrease] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const scenarios = [
    {
      id: 'EXTEND_DAY',
      title: 'Extend Trip by +1 Day',
      desc: 'Recalculates activities and weaves in remaining bucket-list enclaves without rushing.',
      icon: CalendarPlus,
      color: 'text-brand-400'
    },
    {
      id: 'BUDGET_INCREASE',
      title: 'Increase Budget (Add ₹5,000)',
      desc: 'Upgrades all shared auto transits into AC private sedan cabs and adds fine dining reservations.',
      icon: DollarSign,
      color: 'text-emerald-400'
    },
    {
      id: 'WAKE_UP_LATE',
      title: 'Wake Up Late on Day 2 (11:00 AM Start)',
      desc: 'Shifts morning start window, combines breakfast into leisure brunch, and protects key afternoon sights.',
      icon: Clock,
      color: 'text-amber-400'
    },
    {
      id: 'RAIN_SWAP',
      title: 'Rain Protection Dynamic Swap',
      desc: 'Detects wet weather risk and automatically swaps exposed outdoor forts with covered palaces & museums.',
      icon: CloudRain,
      color: 'text-sky-400'
    }
  ];

  const handleApplyWhatIf = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const res = await itineraryAPI.whatIf({
        tripId,
        scenario: selectedScenario,
        params: { amount: budgetIncrease }
      });

      if (res.data?.success) {
        setSuccessMsg(res.data.message);
        if (onItineraryUpdated) {
          onItineraryUpdated(res.data.data);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to apply scenario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="“What If” Dynamic Re-Planner" maxWidth="max-w-xl">
      <div className="space-y-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          Adjust itinerary variables dynamically in real-time without starting over from scratch. The AI sequencing engine recalculates time windows, transit legs, and budget balances.
        </p>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Scenarios Picker */}
        <div className="space-y-2.5">
          {scenarios.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedScenario === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-brand-950/40 border-brand-500 shadow-glow'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-white">{s.title}</h5>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-brand-400 bg-brand-500' : 'border-slate-700'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {selectedScenario === 'BUDGET_INCREASE' && (
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2">
            <label className="text-slate-300 font-semibold block">Additional Budget (₹)</label>
            <input
              type="number"
              value={budgetIncrease}
              onChange={(e) => setBudgetIncrease(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold"
            />
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" loading={loading} onClick={handleApplyWhatIf}>
            <Sparkles className="w-4 h-4" />
            Apply Dynamic Scenario
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WhatIfModal;
