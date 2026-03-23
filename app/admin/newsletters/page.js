"use client";
import React, { useState } from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { Plus, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const MOCK_CAMPAIGNS = [
  { id: 1, title: "Spring Collection Reveal", subject: "Exclusive: Discover our new Spring arrivals", date: "Mar 22, 2024", status: "Sent", openRate: "24.5%" },
  { id: 2, title: "Flash Sale Alert", subject: "48 Hours Only: 20% OFF Everything", date: "Mar 25, 2024", status: "Scheduled", openRate: "-" },
  { id: 3, title: "Welcome Sequence #1", subject: "Welcome to Xiroo - Here's something special", date: "Mar 20, 2024", status: "Active", openRate: "42.1%" },
];

const MOCK_SUBSCRIBERS = [
  { id: 1, email: "john@example.com", source: "Popup", date: "Mar 22, 2024", status: "Active" },
  { id: 2, email: "sarah@example.com", source: "Footer", date: "Mar 21, 2024", status: "Active" },
  { id: 3, email: "unsub@test.com", source: "Checkout", date: "Mar 20, 2024", status: "Unsubscribed" },
];

const CAMPAIGN_COLUMNS = [
  { key: "title", label: "Campaign Title", type: "text" },
  { key: "subject", label: "Email Subject", type: "text" },
  { key: "date", label: "Date", type: "text" },
  { key: "openRate", label: "Open Rate", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

const SUBSCRIBER_COLUMNS = [
  { key: "email", label: "Email Address", type: "text" },
  { key: "source", label: "Source", type: "text" },
  { key: "date", label: "Date Joined", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminNewsletters() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Campaigns");
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [subscribers, setSubscribers] = useState(MOCK_SUBSCRIBERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDelete = (row) => {
    setSelectedItem(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (activeTab === "Campaigns") {
      setCampaigns(prev => prev.filter(c => c.id !== selectedItem.id));
    } else {
      setSubscribers(prev => prev.filter(s => s.id !== selectedItem.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleEdit = (row) => {
    if (activeTab === "Campaigns") {
      router.push(`/admin/newsletters/${row.id}/edit`);
    }
  };

  return (
    <div className="space-y-6">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Newsletters", active: true }
        ]}
        title="Newsletters" 
        icon={Mail}
        primaryAction={{
          label: "Draft Newsletter",
          icon: Plus,
          onClick: () => router.push("/admin/newsletters/new")
        }}
        navigation={[
          { label: "Campaigns", active: activeTab === "Campaigns", onClick: () => setActiveTab("Campaigns") },
          { label: "Subscribers", active: activeTab === "Subscribers", onClick: () => setActiveTab("Subscribers") },
        ]}
      />
      
      <DataTable 
        columns={activeTab === "Campaigns" ? CAMPAIGN_COLUMNS : SUBSCRIBER_COLUMNS}
        data={activeTab === "Campaigns" ? campaigns : subscribers}
        onEdit={activeTab === "Campaigns" ? handleEdit : null}
        onDelete={handleDelete}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={activeTab === "Campaigns" ? "Delete Marketing Campaign" : "Remove Subscriber"}
        message={`Are you absolutely sure you want to delete ${selectedItem?.title || selectedItem?.email}? This action will permanently remove the record from the registry.`}
      />
    </div>
  );
}
