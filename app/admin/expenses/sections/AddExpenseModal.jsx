"use client";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "marketing", label: "Marketing/Ads" },
  { value: "packaging", label: "Packaging" },
  { value: "shipping", label: "Shipping" },
  { value: "platform_fees", label: "Platform Fees" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

const AddExpenseModal = ({ expense, onClose, onSave }) => {
  const [form, setForm] = useState({
    category: "marketing",
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    recurringFrequency: "monthly",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setForm({
        category: expense.category || "marketing",
        description: expense.description || "",
        amount: expense.amount?.toString() || "",
        date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        isRecurring: expense.isRecurring || false,
        recurringFrequency: expense.recurringFrequency || "monthly",
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        amount: Number(form.amount),
      });
    } catch (err) {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white border border-zinc-100 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em]">
            {expense ? "Edit Expense" : "Add Expense"}
          </h3>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-black">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-100 text-[12px] font-bold outline-none uppercase tracking-widest"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Facebook Ads - Week 32"
              required
              className="w-full h-10 px-3 bg-zinc-50 border border-zinc-100 text-[12px] font-medium outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Amount (৳)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                required
                min="0.01"
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-100 text-[12px] font-bold outline-none focus:border-black transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-100 text-[12px] font-medium outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, isRecurring: !form.isRecurring })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                form.isRecurring ? "bg-black" : "bg-zinc-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  form.isRecurring ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-[11px] font-bold text-zinc-500">Recurring expense</span>
          </div>

          {form.isRecurring && (
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Frequency
              </label>
              <select
                value={form.recurringFrequency}
                onChange={(e) => setForm({ ...form, recurringFrequency: e.target.value })}
                className="w-full h-10 px-3 bg-zinc-50 border border-zinc-100 text-[12px] font-bold outline-none uppercase tracking-widest"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={2}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-100 text-[12px] font-medium outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !form.description || !form.amount}
              className="px-6 py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 size={12} className="animate-spin" />}
              {expense ? "Update" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
