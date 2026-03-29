import axiosInstance from "@/lib/axios";
import { addToast } from "@/redux/slices/toastSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

/**
 * Senior Dev Hook: useReviews
 * Manages product review fetching and submission lifecycle.
 * Reviews default to 'pending' and require admin approval to appear publicly.
 */
export const useReviews = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // ── Public: fetch approved reviews for a product ──
  const useProductReviews = (productId) => {
    return useQuery({
      queryKey: ["reviews", productId],
      queryFn: async () => {
        if (!productId) return [];
        const response = await axiosInstance.get(
          `/reviews/product/${productId}`,
        );
        // Interceptor returns response.data → { success, data }
        return response.data ?? response;
      },
      enabled: !!productId,
      staleTime: 2 * 60 * 1000, // 2 min — reviews don't update frequently
    });
  };

  // ── Authenticated: submit a new review ──
  const submitReview = useMutation({
    mutationFn: async ({ productId, reviewData }) => {
      const response = await axiosInstance.post(
        `/reviews/${productId}`,
        reviewData,
      );
      return response.data ?? response;
    },
    onSuccess: (_, variables) => {
      dispatch(
        addToast({
          message: "Review submitted — pending moderation",
          type: "success",
        }),
      );
      // Invalidate so approved reviews reload if status changes
      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.productId],
      });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message:
            error?.response?.data?.message ||
            "Could not submit review. Please try again.",
          type: "error",
        }),
      );
    },
  });

  // ── Admin: fetch all reviews ──
  const useAdminReviews = () => {
    return useQuery({
      queryKey: ["admin_reviews"],
      queryFn: async () => {
        const response = await axiosInstance.get("/reviews");
        return response.data ?? response;
      },
    });
  };

  // ── Admin: moderate a review status ──
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.patch(`/reviews/admin/${id}/status`, {
        status,
      });
      return response.data ?? response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Review status updated", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Update failed",
          type: "error",
        }),
      );
    },
  });

  // ── Admin: delete a review ──
  const deleteReview = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/reviews/admin/${id}`);
      return response.data ?? response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Review deleted permanently", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin_reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Deletion failed",
          type: "error",
        }),
      );
    },
  });

  return {
    useProductReviews,
    submitReview,
    useAdminReviews,
    updateStatus,
    deleteReview,
  };
};
