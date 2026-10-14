import React from 'react';
import { ArrowRight, QrCode, CheckCircle2, ExternalLink } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

const DebtMatrix = ({ settlements = [], balances = [], onMarkSettled }) => {
  return (
    <div className="space-y-6">
      {/* Individual Net Balances */}
      <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
        <h4 className="text-sm font-bold text-white mb-3">Group Net Balance Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {balances.map((b, i) => {
            const isOwed = b.netBalance > 0;
            const isZero = Math.abs(b.netBalance) <= 0.01;
            return (
              <div key={i} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-200 truncate">{b.user?.name || 'Explorer'}</p>
                <p className={`text-sm font-black mt-1 ${isZero ? 'text-slate-400' : isOwed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isZero ? 'Settled Up' : isOwed ? `+₹${b.netBalance}` : `-₹${Math.abs(b.netBalance)}`}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isZero ? 'Zero debt' : isOwed ? 'Gets back' : 'Owes to group'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simplified Debts Algorithm Results */}
      <div className="glass-card rounded-2xl p-5 border border-slate-700/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">Debt Simplification Transfers</h4>
            <p className="text-xs text-slate-400 mt-0.5">Minimizes total cash transactions between friends</p>
          </div>
          <Badge variant="primary" size="sm">Smart Algorithm</Badge>
        </div>

        {settlements.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            🎉 All travel companions are fully settled up! No pending debts.
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-rose-300">{s.fromUser?.name || 'Debtor'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-bold text-emerald-300">{s.toUser?.name || 'Creditor'}</span>
                  </div>
                  <span className="font-black text-sm text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    ₹{s.amount}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* UPI Pay Link */}
                  {s.upiLink && (
                    <a
                      href={s.upiLink}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Pay via UPI
                    </a>
                  )}

                  <button
                    onClick={() => onMarkSettled && onMarkSettled(s)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Mark Settled
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtMatrix;
