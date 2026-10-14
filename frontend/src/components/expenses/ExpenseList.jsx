import React, { useState } from 'react';
import { Plus, DollarSign, Receipt, Tag, Users } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

const ExpenseList = ({ expenses = [], trip, onAddExpense }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;
    try {
      setLoading(true);
      await onAddExpense({
        title,
        amount: Number(amount),
        category,
        splitType: 'EQUAL'
      });
      setTitle('');
      setAmount('');
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    FOOD: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    TRANSPORT: 'text-sky-400 bg-sky-950/40 border-sky-800/40',
    LODGING: 'text-purple-400 bg-purple-950/40 border-purple-800/40',
    TICKETS: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40',
    EXPERIENCE: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    OTHER: 'text-slate-400 bg-slate-900 border-slate-800'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Logged Shared Expenses</h4>
          <p className="text-xs text-slate-400">{expenses.length} shared receipts recorded</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8 glass-card rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No expenses recorded yet. Click "Add Expense" to start tracking group costs.
        </div>
      ) : (
        <div className="space-y-2.5">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${categoryColors[exp.category] || categoryColors.OTHER}`}>
                  {exp.category}
                </span>
                <div>
                  <h5 className="font-bold text-sm text-white">{exp.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Paid by <span className="font-semibold text-slate-200">{exp.payer?.name}</span> • Split equally among {exp.participants?.length || 1} people
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-white">₹{exp.amount}</span>
                <p className="text-[10px] text-slate-400">
                  ₹{Math.round((exp.amount / (exp.participants?.length || 1)))} / person
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Expense Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Log Shared Group Expense" maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Expense Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Amber Palace composite tickets"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Total Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 1200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-bold"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="FOOD">Food & Dining</option>
              <option value="TRANSPORT">Transit & Cabs</option>
              <option value="LODGING">Stay & Hotel</option>
              <option value="TICKETS">Entry Tickets</option>
              <option value="EXPERIENCE">Local Experience</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={loading}>
              Save & Split
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExpenseList;
