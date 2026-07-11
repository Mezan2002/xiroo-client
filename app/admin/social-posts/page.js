"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ModuleHeader from "@/components/admin/shared/ModuleHeader";
import SocialPostTable from "@/components/admin/social-posts/SocialPostTable";
import useSocialPosts from "@/hooks/api/useSocialPosts";

const TABS = [
  { label: "All", value: "all" },
  { label: "Pinned", value: "pinned" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function SocialPostsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const { useAllSocialPosts } = useSocialPosts();
  const { data, isLoading } = useAllSocialPosts(page, 20);

  // Filter posts based on active tab
  const allPosts = data?.data?.posts || [];
  const filteredPosts = allPosts.filter((post) => {
    if (activeTab === "pinned") return post.isPinned;
    if (activeTab === "active") return post.isActive;
    if (activeTab === "inactive") return !post.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Social Feed"
        label="Catalog"
        labelHref="/admin"
        primaryAction={{
          label: "Add Post",
          onClick: () => router.push("/admin/social-posts/new"),
        }}
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.value
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SocialPostTable
        posts={filteredPosts}
        pagination={data?.data?.pagination}
        isLoading={isLoading}
      />
    </div>
  );
}
