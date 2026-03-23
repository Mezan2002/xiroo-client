"use client";
import React from "react";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import NewsletterForm from "@/components/admin/newsletters/NewsletterForm";
import { Mail } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

const MOCK_CAMPAIGNS = [
  { id: 1, title: "Spring Collection Reveal", subject: "Exclusive: Discover our new Spring arrivals", date: "Mar 22, 2024", status: "Sent", openRate: "24.5%", content: "<h1>Spring is Here</h1><p>Check out our latest collection.</p>" },
  { id: 2, title: "Flash Sale Alert", subject: "48 Hours Only: 20% OFF Everything", date: "Mar 25, 2024", status: "Scheduled", openRate: "-", content: "<h1>48 Hour Flash Sale</h1><p>Don't miss out on these deals.</p>" },
  { id: 3, title: "Welcome Sequence #1", subject: "Welcome to Xiroo - Here's something special", date: "Mar 20, 2024", status: "Active", openRate: "42.1%", content: "<h1>Welcome!</h1><p>We're glad to have you here.</p>" },
];

export default function EditNewsletterPage() {
  const router = useRouter();
  const params = useParams();
  
  const campaign = MOCK_CAMPAIGNS.find(c => c.id === parseInt(params.id)) || MOCK_CAMPAIGNS[0];

  const handleSubmit = (data) => {
    console.log("Updating Marketing Campaign:", data);
    router.push("/admin/newsletters");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <ModuleHeader 
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Newsletters", href: "/admin/newsletters" },
          { label: campaign?.title || "Refine", active: true }
        ]}
        title="Refine Campaign Narrative"
        icon={Mail}
      />

      <div className="bg-white border-x border-zinc-100 px-12 py-16">
        <NewsletterForm 
          initialData={campaign}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
