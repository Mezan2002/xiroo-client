"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import DataTable from "@/components/admin/shared/DataTable";
import { Send, Mail } from "lucide-react";

const MOCK_SUBSCRIBERS = [
  { id: 1, email: "john@example.com", source: "Popup", date: "Mar 22, 2024", status: "Active" },
  { id: 2, email: "sarah@example.com", source: "Footer", date: "Mar 21, 2024", status: "Active" },
  { id: 3, email: "unsub@test.com", source: "Checkout", date: "Mar 20, 2024", status: "Unsubscribed" },
];

const COLUMNS = [
  { key: "email", label: "Email Address", type: "text" },
  { key: "source", label: "Source", type: "text" },
  { key: "date", label: "Date Joined", type: "text" },
  { key: "status", label: "Status", type: "status" },
  { key: "actions", label: "Actions", type: "actions", align: "right" },
];

export default function AdminNewsletters() {
  return (
    <div className="space-y-6">
      <ModuleHeader 
        label="Marketing & CRM" 
        title="Newsletters" 
        icon={Mail}
        primaryAction={{
          label: "Send Campaign",
          icon: Send,
          onClick: () => console.log("Send Campaign")
        }}
      />
      
      <DataTable 
        columns={COLUMNS}
        data={MOCK_SUBSCRIBERS}
      />
    </div>
  );
}
