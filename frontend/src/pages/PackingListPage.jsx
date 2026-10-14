import React, { useState, useEffect } from 'react';
import {
  Layers,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
  Volume2,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { packingAPI } from '../services/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const PackingListPage = () => {
  const [packingList, setPackingList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('HERITAGE_CITIES');
  const [generating, setGenerating] = useState(false);

  // Survival Phrasebook Data (Section 33)
  const phrases = [
    { eng: 'Please help me', phon: 'Kripya meri madad kijiye', cat: 'Emergency', lang: 'Hindi' },
    { eng: 'Where is the hospital?', phon: 'Aspataal kahan hai?', cat: 'Medical', lang: 'Hindi' },
    { eng: 'Take me to this location', phon: 'Mujhe is jagah le chaliye', cat: 'Transit', lang: 'Hindi' },
    { eng: 'How much does this cost?', phon: 'Yeh kitne ka hai?', cat: 'Shopping', lang: 'Hindi' },
    { eng: 'No meat / Pure vegetarian food', phon: 'Shuddh shakahari khana chahiye', cat: 'Dietary', lang: 'Hindi' },
    { eng: 'Can you use the taxi meter?', phon: 'Kya aap meter se chalenge?', cat: 'Transit', lang: 'Hindi' },
    { eng: 'Where is the police station?', phon: 'Police station kahan hai?', cat: 'Safety', lang: 'Hindi' },
    { eng: 'Is this water safe to drink?', phon: 'Kya yeh peene ka paani hai?', cat: 'Health', lang: 'Hindi' },
    { eng: 'Thank you very much', phon: 'Bahut bahut dhanyavaad', cat: 'Politeness', lang: 'Hindi' },
    { eng: 'I am lost', phon: 'Main rasta bhatak gaya hoon', cat: 'Emergency', lang: 'Hindi' },
    { eng: 'Speak slowly please', phon: 'Kripya dheere boliye', cat: 'General', lang: 'Hindi' },
    { eng: 'Where is the washroom/toilet?', phon: 'Shauchalaya / Toilet kahan hai?', cat: 'Sanitation', lang: 'Hindi' }
  ];

  const fetchPackingList = async () => {
    try {
      setLoading(true);
      const res = await packingAPI.get();
      if (res.data?.success && res.data.data) {
        setPackingList(res.data.data);
      } else {
        await handleGenerateList('HERITAGE_CITIES');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateList = async (type) => {
    try {
      setGenerating(true);
      setSelectedType(type);
      const res = await packingAPI.generate({
        destination: type === 'BEACH' ? 'South Goa' : 'Jaipur',
        destinationType: type
      });
      if (res.data?.success) {
        setPackingList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchPackingList();
  }, []);

  const handleToggle = async (itemId) => {
    if (!packingList) return;
    try {
      const res = await packingAPI.toggle({
        listId: packingList._id,
        itemId
      });
      if (res.data?.success) {
        setPackingList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalItems = packingList?.items?.length || 0;
  const packedCount = packingList?.items?.filter(i => i.isPacked).length || 0;
  const progressPercent = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <Badge variant="primary" size="sm">Weather & Activity Intelligence</Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Smart Packing & Offline Phrasebook</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          Checklist automatically adapts to whether you are exploring rocky Rajput forts, cold Himalayan trails, or coastal sandy surf breaks.
        </p>
      </div>

      {/* Destination Archetype Selector */}
      <div className="glass-card rounded-2xl p-4 border border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300">Generate Checklist for Trip Type:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'HERITAGE_CITIES', label: 'Heritage & Palaces (Jaipur)' },
            { id: 'BEACH', label: 'Coastal & Beaches (Goa)' },
            { id: 'COLD_HILLS', label: 'Cold Mountain Passes' },
            { id: 'TREKKING_ADVENTURE', label: 'Trekking & Wildlife' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleGenerateList(t.id)}
              disabled={generating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === t.id
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-5 border border-slate-700/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white">Packing Progress</span>
          <span className="font-bold text-brand-400">{packedCount} of {totalItems} Packed ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Packing Items Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Custom Gear & Checklist Items</h3>
        
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading checklist...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packingList?.items?.map((item) => (
              <div
                key={item._id}
                onClick={() => handleToggle(item._id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  item.isPacked
                    ? 'bg-emerald-950/20 border-emerald-800/40 opacity-75'
                    : 'glass-card border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {item.isPacked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold ${item.isPacked ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.name}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.category}
                    </span>
                  </div>
                  {item.weatherOrActivityReason && (
                    <p className="text-[11px] text-brand-300 mt-1 leading-tight">
                      💡 {item.weatherOrActivityReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offline Regional Language Phrasebook */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Survival Language Phrasebook (Offline Cached)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Essential phonetic pronunciations across Hindi and regional dialects for taxis, food restrictions, and emergencies.
            </p>
          </div>
          <Badge variant="primary" size="sm">25 Survival Phrases</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {phrases.map((p, idx) => (
            <div key={idx} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
                <span>{p.cat}</span>
                <span className="text-brand-400">{p.lang}</span>
              </div>
              <p className="text-xs font-bold text-white">{p.eng}</p>
              <p className="text-xs font-semibold text-sky-300 italic font-mono pt-1">
                "{p.phon}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackingListPage;
