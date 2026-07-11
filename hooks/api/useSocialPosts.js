import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { addToast } from "@/redux/slices/toastSlice";
import { useDispatch } from "react-redux";

const useSocialPosts = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Public: Get active social posts for homepage
  const useActiveSocialPosts = (limit = 10) => {
    return useQuery({
      queryKey: ["active-social-posts", limit],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/social-posts/active?limit=${limit}`
        );
        return response;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Admin: Get all social posts with pagination
  const useAllSocialPosts = (page = 1, limit = 20) => {
    return useQuery({
      queryKey: ["admin-social-posts", page, limit],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/social-posts?page=${page}&limit=${limit}`
        );
        return response;
      },
    });
  };

  // Admin: Get single social post
  const useSocialPost = (id) => {
    return useQuery({
      queryKey: ["social-post", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/social-posts/${id}`);
        return response;
      },
      enabled: !!id,
    });
  };

  // Admin: Create social post
  const useCreateSocialPost = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await axiosInstance.post("/social-posts", data);
        return response;
      },
      onSuccess: () => {
        dispatch(addToast({ message: "Social post created successfully", type: "success" }));
        queryClient.invalidateQueries({ queryKey: ["admin-social-posts"] });
      },
      onError: (error) => {
        dispatch(
          addToast({
            message: error?.response?.data?.message || "Failed to create social post",
            type: "error",
          })
        );
      },
    });
  };

  // Admin: Update social post
  const useUpdateSocialPost = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axiosInstance.patch(`/social-posts/${id}`, data);
        return response;
      },
      onSuccess: (_, variables) => {
        dispatch(addToast({ message: "Social post updated successfully", type: "success" }));
        queryClient.invalidateQueries({ queryKey: ["admin-social-posts"] });
        queryClient.invalidateQueries({
          queryKey: ["social-post", variables.id],
        });
      },
      onError: (error) => {
        dispatch(
          addToast({
            message: error?.response?.data?.message || "Failed to update social post",
            type: "error",
          })
        );
      },
    });
  };

  // Admin: Toggle pin
  const useTogglePin = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosInstance.patch(`/social-posts/${id}/pin`);
        return response;
      },
      onSuccess: (data) => {
        dispatch(addToast({ message: data?.message || "Pin status updated", type: "success" }));
        queryClient.invalidateQueries({ queryKey: ["admin-social-posts"] });
      },
      onError: (error) => {
        dispatch(
          addToast({
            message: error?.response?.data?.message || "Failed to toggle pin",
            type: "error",
          })
        );
      },
    });
  };

  // Admin: Delete social post
  const useDeleteSocialPost = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axiosInstance.delete(`/social-posts/${id}`);
        return response;
      },
      onSuccess: () => {
        dispatch(addToast({ message: "Social post deleted successfully", type: "success" }));
        queryClient.invalidateQueries({ queryKey: ["admin-social-posts"] });
      },
      onError: (error) => {
        dispatch(
          addToast({
            message: error?.response?.data?.message || "Failed to delete social post",
            type: "error",
          })
        );
      },
    });
  };

  // Admin: Reorder posts
  const useReorderPosts = () => {
    return useMutation({
      mutationFn: async (updates) => {
        const response = await axiosInstance.patch(
          "/social-posts/reorder/bulk",
          { updates }
        );
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-social-posts"] });
      },
    });
  };

  return {
    useActiveSocialPosts,
    useAllSocialPosts,
    useSocialPost,
    useCreateSocialPost,
    useUpdateSocialPost,
    useTogglePin,
    useDeleteSocialPost,
    useReorderPosts,
  };
};

export default useSocialPosts;
