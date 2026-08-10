"use client";
import { ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, Search, X } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "marketing", label: "Marketing/Ads" },
  { value: "packaging", label: "Packaging" },
  { value: "shipping", label: "Shipping" },
  { value: "platform_fees", label: "Platform Fees" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

const DAYS_OPTIONS = [
  { value: 7, label: "7d" },
  { value: 14, label: "14d" },
  { value: 30, label: "30d" },
  { value: 90, label: "90d" },
];

const formatCurrency = (value) => `৳${(value || 0).toLocaleString()}`;

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ExpenseTable = ({
  expenses,
  pagination,
  loading,
  filterCategory,
  setFilterCategory,
  filterDays,
  setFilterDays,
  search,
  setSearch,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const filteredExpenses = expenses.filter((exp) => {
    if (!search) return true;
    return (
      exp.description?.toLowerCase().includes(search.toLowerCase()) ||
      exp.notes?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section>
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
          Expense Log
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          {/* Days filter */}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-100 p-1">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => setFilterDays(d.value)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  filterDays === d.value
                    ? "bg-black text-white"
                    : "text-zinc-400 hover:text-black"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-8 px-3 bg-zinc-50 border border-zinc-100 text-[11px] font-bold outline-none uppercase tracking-widest"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-300" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 pr-6 bg-zinc-50 border border-zinc-100 text-[11px] font-medium outline-none w-40"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-100 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 border-b border-zinc-100">
            <tr>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Category
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Description
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                Amount
              </th>
              <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-300 mx-auto" />
                </td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[12px] text-zinc-300 italic">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {formatDate(expense.date)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-zinc-100 text-[9px] font-bold uppercase tracking-widest">
                      {expense.category?.replace("_", " ") || "Other"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-bold">{expense.description}</span>
                      {expense.notes && (
                        <span className="text-[10px] text-zinc-400 truncate max-w-[200px]">
                          {expense.notes}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-[12px] font-bold">{formatCurrency(expense.amount)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-zinc-400 hover:text-black transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(expense._id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-[11px] text-zinc-400 font-medium">
            {pagination.total.toLocaleString()} expenses · Page{" "}
            {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 w-8 flex items-center justify-center border border-zinc-100 hover:border-black disabled:opacity-30 disabled:hover:border-zinc-100 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 w-8 flex items-center justify-center border border-zinc-100 hover:border-black disabled:opacity-30 disabled:hover:border-zinc-100 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpenseTable;
