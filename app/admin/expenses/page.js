"use client";
import React, { useState, useEffect, useCallback } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import axiosInstance from "@/lib/axios";
import { Receipt, RefreshCw, Plus } from "lucide-react";
import ExpenseStats from "./sections/ExpenseStats";
import ExpenseTable from "./sections/ExpenseTable";
import AddExpenseModal from "./sections/AddExpenseModal";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDays, setFilterDays] = useState(30);
  const [search, setSearch] = useState("");

  const fetchExpenses = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "50", days: String(filterDays) });
      if (filterCategory) params.set("category", filterCategory);
      const resp = await axiosInstance.get(`/expenses?${params}`);
      setExpenses(resp?.data?.expenses || []);
      setPagination(resp?.data?.pagination || { page: 1, limit: 50, total: 0, totalPages: 0 });
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  }, [filterDays, filterCategory]);

  const fetchStats = useCallback(async () => {
    try {
      const resp = await axiosInstance.get(`/expenses/stats?days=${filterDays}`);
      setStats(resp?.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, [filterDays]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchExpenses(1), fetchStats()]).finally(() => setLoading(false));
  }, [fetchExpenses, fetchStats]);

  const handleRefresh = () => {
    setLoading(true);
    Promise.all([fetchExpenses(pagination.page), fetchStats()]).finally(() => setLoading(false));
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setShowModal(true);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axiosInstance.delete(`/expenses/${id}`);
      fetchExpenses(pagination.page);
      fetchStats();
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingExpense) {
        await axiosInstance.patch(`/expenses/${editingExpense._id}`, data);
      } else {
        await axiosInstance.post("/expenses", data);
      }
      setShowModal(false);
      setEditingExpense(null);
      fetchExpenses(pagination.page);
      fetchStats();
    } catch (err) {
      console.error("Failed to save expense:", err);
      throw err;
    }
  };

  return (
    <div className="space-y-24 font-montserrat antialiased text-zinc-900 animate-in fade-in duration-700 pb-20">
      <ModuleHeader
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Expenses", active: true },
        ]}
        title="Expenses"
        icon={Receipt}
        primaryAction={{
          label: "Add Expense",
          icon: Plus,
          onClick: handleAdd,
        }}
        secondaryAction={{
          label: "Refresh",
          icon: RefreshCw,
          onClick: handleRefresh,
        }}
      />

      <ExpenseStats stats={stats} loading={loading} />

      <ExpenseTable
        expenses={expenses}
        pagination={pagination}
        loading={loading}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterDays={filterDays}
        setFilterDays={setFilterDays}
        search={search}
        setSearch={setSearch}
        onPageChange={fetchExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <AddExpenseModal
          expense={editingExpense}
          onClose={() => { setShowModal(false); setEditingExpense(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
