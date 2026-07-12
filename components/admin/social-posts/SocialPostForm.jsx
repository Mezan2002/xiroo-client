import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Image as ImageIcon, Video } from "lucide-react";
import useSocialPosts from "@/hooks/api/useSocialPosts";
import { Button } from "@/components/ui/Button";
import { MediaUploader } from "@/components/shared/MediaUploader";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
];

export default function SocialPostForm({ initialData }) {
  const router = useRouter();
  const { useCreateSocialPost, useUpdateSocialPost } = useSocialPosts();
  const createMutation = useCreateSocialPost();
  const updateMutation = useUpdateSocialPost();

  const [formData, setFormData] = useState({
    title: "",
    platform: "instagram",
    mediaUrl: "",
    postLink: "",
    type: "video",
    isPinned: false,
    isActive: true,
    order: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        platform: initialData.platform || "instagram",
        mediaUrl: initialData.mediaUrl || "",
        postLink: initialData.postLink || "",
        type: initialData.type || "video",
        isPinned: initialData.isPinned || false,
        isActive: initialData.isActive ?? true,
        order: initialData.order || 0,
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.mediaUrl.trim()) {
      newErrors.mediaUrl = "Please upload a video or image";
    }

    if (!formData.postLink.trim()) {
      newErrors.postLink = "Post link is required";
    } else {
      try {
        new URL(formData.postLink);
      } catch {
        newErrors.postLink = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (initialData) {
        await updateMutation.mutateAsync({
          id: initialData._id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      router.push("/admin/social-posts");
    } catch (error) {
      // Error toast is handled by the hook
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => router.push("/admin/social-posts")}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">
          {initialData ? "Edit Social Post" : "Add New Social Post"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Media Type Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleChange("type", "video")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.type === "video"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Video size={18} />
                <span className="text-sm font-medium">Video</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange("type", "image")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  formData.type === "image"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <ImageIcon size={18} />
                <span className="text-sm font-medium">Image</span>
              </button>
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload {formData.type === "video" ? "Video" : "Image"} *
            </label>
            <MediaUploader
              type={formData.type}
              initialValue={formData.mediaUrl}
              onUploadSuccess={(url) => handleChange("mediaUrl", url)}
              onUploadError={(msg) => setErrors((prev) => ({ ...prev, mediaUrl: msg }))}
              onRemove={() => handleChange("mediaUrl", "")}
            />
            {errors.mediaUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.mediaUrl}</p>
            )}
            {formData.mediaUrl && (
              <p className="text-green-600 text-sm mt-1">✓ Media uploaded</p>
            )}
          </div>

          {/* Post Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Link *
            </label>
            <input
              type="url"
              value={formData.postLink}
              onChange={(e) => handleChange("postLink", e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                errors.postLink ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.postLink && (
              <p className="text-red-500 text-sm mt-1">{errors.postLink}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Link to the original post. Users will be redirected here when they click.
            </p>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              value={formData.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Post title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Order, Pin, Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange("order", parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => handleChange("isPinned", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Pin</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/social-posts")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
