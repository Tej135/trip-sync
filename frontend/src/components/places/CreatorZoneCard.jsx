import React from 'react';
import { Camera, Video, AlertOctagon, Sun, CheckCircle2, XCircle, Info, Compass } from 'lucide-react';
import Badge from '../common/Badge';

const CreatorZoneCard = ({ creatorInfo = {} }) => {
  const droneZone = creatorInfo.droneZone || 'RED';

  const droneConfig = {
    GREEN: {
      label: 'GREEN ZONE — Open Flying Permitted',
      badge: 'success',
      boxStyle: 'bg-emerald-950/40 border-emerald-800 text-emerald-300',
      desc: 'Standard DGCA nano/micro drone guidelines apply. No restricted government airspaces.'
    },
    YELLOW: {
      label: 'YELLOW ZONE — Prior Permit Required',
      badge: 'warning',
      boxStyle: 'bg-amber-950/40 border-amber-800 text-amber-300',
      desc: 'Requires local administration / forest department approval letter prior to takeoff.'
    },
    RED: {
      label: 'RED ZONE — STRICTLY PROHIBITED',
      badge: 'danger',
      boxStyle: 'bg-red-950/50 border-red-700 text-red-300',
      desc: 'NO-FLY ZONE. Flying here leads to heavy fines (up to ₹1,00,000) and drone confiscation under ASI / DGCA regulations.'
    }
  };

  const currentDrone = droneConfig[droneZone] || droneConfig.RED;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            Content Creator & Photography Zone
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">Rules, restrictions, and cinematic vantage coordinates</p>
        </div>
        <Badge variant={currentDrone.badge} size="md">
          {droneZone} Drone Zone
        </Badge>
      </div>

      {/* Drone Alert Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 mb-4 ${currentDrone.boxStyle}`}>
        <AlertOctagon className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">{currentDrone.label}</p>
          <p className="text-xs mt-1 leading-relaxed opacity-90">{currentDrone.desc}</p>
          {creatorInfo.authorityContact && (
            <p className="text-[11px] mt-2 font-mono font-medium opacity-80">
              Authority Contact: {creatorInfo.authorityContact}
            </p>
          )}
        </div>
      </div>

      {/* Equipment Permission Matrix */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Camera className="w-4 h-4 mx-auto text-slate-400 mb-1" />
          <p className="text-xs font-semibold text-slate-300">Still Photos</p>
          <p className="text-xs font-bold mt-1 flex items-center justify-center gap-1 text-emerald-400">
            {creatorInfo.photoAllowed !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
            {creatorInfo.photoAllowed !== false ? 'Allowed' : 'Prohibited'}
          </p>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Video className="w-4 h-4 mx-auto text-slate-400 mb-1" />
          <p className="text-xs font-semibold text-slate-300">Video Shooting</p>
          <p className="text-xs font-bold mt-1 flex items-center justify-center gap-1 text-emerald-400">
            {creatorInfo.videoAllowed !== false ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
            {creatorInfo.videoAllowed !== false ? 'Allowed' : 'Prohibited'}
          </p>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <Info className="w-4 h-4 mx-auto text-slate-400 mb-1" />
          <p className="text-xs font-semibold text-slate-300">Tripod / Monopod</p>
          <p className={`text-xs font-bold mt-1 flex items-center justify-center gap-1 ${creatorInfo.tripodAllowed ? 'text-emerald-400' : 'text-amber-400'}`}>
            {creatorInfo.tripodAllowed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {creatorInfo.tripodAllowed ? 'Permitted' : 'Permit Only'}
          </p>
        </div>
      </div>

      {/* Golden Hour Window */}
      {creatorInfo.goldenHourRecommendation && (
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-3 rounded-xl border border-amber-800/40 flex items-center gap-3 mb-4">
          <Sun className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-amber-300">Golden Hour Recommended Timing</p>
            <p className="text-xs text-slate-300 mt-0.5">{creatorInfo.goldenHourRecommendation}</p>
          </div>
        </div>
      )}

      {/* Vantage Points */}
      {creatorInfo.bestAngles && creatorInfo.bestAngles.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-400" />
            Community-Recommended Vantage Points
          </p>
          <div className="space-y-2">
            {creatorInfo.bestAngles.map((angle, i) => (
              <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                <p className="font-bold text-white">{angle.title}</p>
                <p className="text-slate-400 mt-1 leading-relaxed">{angle.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorZoneCard;
