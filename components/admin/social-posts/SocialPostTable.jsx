import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, ExternalLink, Pin, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import useSocialPosts from "@/hooks/api/useSocialPosts";

const platformColors = {
  instagram: "bg-pink-100 text-pink-700",
  facebook: "bg-blue-100 text-blue-700",
  youtube: "bg-red-100 text-red-700",
  tiktok: "bg-gray-100 text-gray-700",
};

function SortableRow({ post, onTogglePin, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
    position: "relative",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`group border-b border-gray-100 hover:bg-gray-50 ${isDragging ? "bg-gray-50 shadow-lg" : ""}`}
    >
      <td className="px-4 py-3 w-10">
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onTogglePin(post)}
          className={`p-1 rounded hover:bg-gray-100 ${
            post.isPinned ? "text-yellow-500" : "text-gray-300"
          }`}
          title={post.isPinned ? "Unpin" : "Pin to top"}
        >
          <Pin size={16} fill={post.isPinned ? "currentColor" : "none"} />
        </button>
      </td>
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium capitalize ${
            platformColors[post.platform] || "bg-gray-100 text-gray-700"
          }`}
        >
          {post.platform}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm capitalize">{post.type}</span>
      </td>
      <td className="px-4 py-3">
        <a
          href={post.mediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1 max-w-[200px] truncate"
        >
          {post.mediaUrl}
          <ExternalLink size={12} />
        </a>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(post)}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(post)}
            className="p-1.5 rounded hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function SocialPostTable({ posts, pagination, isLoading }) {
  const [deleteModal, setDeleteModal] = useState(null);
  const router = useRouter();
  const { useDeleteSocialPost, useTogglePin, useReorderPosts } = useSocialPosts();
  const deleteMutation = useDeleteSocialPost();
  const togglePinMutation = useTogglePin();
  const reorderMutation = useReorderPosts();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = posts.findIndex((p) => p._id === active.id);
      const newIndex = posts.findIndex((p) => p._id === over.id);
      const reordered = arrayMove(posts, oldIndex, newIndex);

      const updates = reordered.map((post, index) => ({
        id: post._id,
        order: index,
      }));

      reorderMutation.mutate(updates);
    }
  };

  const postIds = posts?.map((p) => p._id) || [];

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-xs font-medium text-gray-500 w-10"></th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Pin</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Platform</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Media</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-100">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : posts?.length > 0 ? (
                <SortableContext
                  items={postIds}
                  strategy={verticalListSortingStrategy}
                >
                  {posts.map((post) => (
                    <SortableRow
                      key={post._id}
                      post={post}
                      onTogglePin={handleTogglePin}
                      onEdit={(p) => router.push(`/admin/social-posts/${p._id}`)}
                      onDelete={setDeleteModal}
                    />
                  ))}
                </SortableContext>
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4 px-4">
            <span className="text-xs text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
              >
                ← Prev
              </button>
              <button
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </DndContext>

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
