import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, ExternalLink, Pin, Trash2 } from "lucide-react";
import DataTable from "@/components/admin/shared/DataTable";
import useSocialPosts from "@/hooks/api/useSocialPosts";

const platformColors = {
  instagram: "bg-pink-100 text-pink-700",
  facebook: "bg-blue-100 text-blue-700",
  youtube: "bg-red-100 text-red-700",
  tiktok: "bg-gray-100 text-gray-700",
};

export default function SocialPostTable({ posts, pagination, isLoading }) {
  const [deleteModal, setDeleteModal] = useState(null);
  const router = useRouter();
  const { useDeleteSocialPost, useTogglePin } = useSocialPosts();
  const deleteMutation = useDeleteSocialPost();
  const togglePinMutation = useTogglePin();

  const handleDelete = async (post) => {
    try {
      await deleteMutation.mutateAsync(post._id);
      setDeleteModal(null);
    } catch (error) {
      // Error toast is handled by the hook
    }
  };

  const handleTogglePin = async (post) => {
    try {
      await togglePinMutation.mutateAsync(post._id);
    } catch (error) {
      // Error toast is handled by the hook
    }
  };

  const columns = [
    {
      key: "pin",
      label: "Pin",
      render: (post) => (
        <button
          onClick={() => handleTogglePin(post)}
          className={`p-1 rounded hover:bg-gray-100 ${
            post.isPinned ? "text-yellow-500" : "text-gray-300"
          }`}
          title={post.isPinned ? "Unpin" : "Pin to top"}
        >
          <Pin size={16} fill={post.isPinned ? "currentColor" : "none"} />
        </button>
      ),
    },
    {
      key: "platform",
      label: "Platform",
      render: (post) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize ${
            platformColors[post.platform] || "bg-gray-100 text-gray-700"
          }`}
        >
          {post.platform}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (post) => (
        <span className="text-sm capitalize">{post.type}</span>
      ),
    },
    {
      key: "url",
      label: "URL",
      render: (post) => (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1 max-w-[200px] truncate"
        >
          {post.url}
          <ExternalLink size={12} />
        </a>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (post) => (
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (post) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push(`/admin/social-posts/${post._id}`)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteModal(post)}
            className="p-1.5 rounded hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={posts || []}
        isLoading={isLoading}
        pagination={pagination}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Post</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
