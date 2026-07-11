"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SocialPostForm from "@/components/admin/social-posts/SocialPostForm";
import useSocialPosts from "@/hooks/api/useSocialPosts";

export default function EditSocialPostPage() {
  const params = useParams();
  const router = useRouter();
  const { useSocialPost } = useSocialPosts();
  const { data, isLoading, error } = useSocialPost(params.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-600">Failed to load social post</p>
        <button
          onClick={() => router.push("/admin/social-posts")}
          className="text-sm text-gray-600 hover:underline"
        >
          Back to Social Feed
        </button>
      </div>
    );
  }

  return <SocialPostForm initialData={data?.data} />;
}
