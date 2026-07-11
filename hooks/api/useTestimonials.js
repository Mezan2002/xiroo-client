import axiosInstance from "@/lib/axios";
import { addToast } from "@/redux/slices/toastSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useTestimonials = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Public: Fetch featured testimonials for homepage
  const useFeaturedTestimonials = (limit = 5) => {
    return useQuery({
      queryKey: ["featured-testimonials", limit],
      queryFn: async () => {
        const response = await axiosInstance.get(`/testimonials/featured?limit=${limit}`);
        return response;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // Public: Fetch paginated testimonials
  const usePublicTestimonials = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ["public-testimonials", page, limit],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/testimonials/public?page=${page}&limit=${limit}`,
        );
        return response;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  // Public: Submit a testimonial
  const submitTestimonial = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/testimonials", data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addToast({
          message: "Testimonial submitted successfully. It will appear after moderation.",
          type: "success",
        }),
      );
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to submit testimonial.",
          type: "error",
        }),
      );
    },
  });

  // Admin: Fetch all testimonials
  const useAdminTestimonials = (page = 1, limit = 20, status, isFeatured) => {
    return useQuery({
      queryKey: ["admin-testimonials", page, limit, status, isFeatured],
      queryFn: async () => {
        let url = `/testimonials?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (isFeatured !== undefined) url += `&isFeatured=${isFeatured}`;

        const response = await axiosInstance.get(url);
        return response;
      },
    });
  };

  // Admin: Fetch single testimonial
  const useTestimonial = (id) => {
    return useQuery({
      queryKey: ["testimonial", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/testimonials/${id}`);
        return response;
      },
      enabled: !!id,
    });
  };

  // Admin: Create testimonial
  const createTestimonial = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/testimonials", data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Testimonial created successfully", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to create testimonial",
          type: "error",
        }),
      );
    },
  });

  // Admin: Update testimonial
  const updateTestimonial = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/testimonials/${id}`, data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Testimonial updated successfully", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to update testimonial",
          type: "error",
        }),
      );
    },
  });

  // Admin: Update testimonial status
  const updateTestimonialStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.patch(`/testimonials/${id}/status`, { status });
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Testimonial status updated", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to update status",
          type: "error",
        }),
      );
    },
  });

  // Admin: Toggle featured
  const toggleFeatured = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/testimonials/${id}/featured`);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Featured status updated", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["featured-testimonials"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to update featured status",
          type: "error",
        }),
      );
    },
  });

  // Admin: Delete testimonial
  const deleteTestimonial = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/testimonials/${id}`);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Testimonial deleted successfully", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to delete testimonial",
          type: "error",
        }),
      );
    },
  });

  return {
    useFeaturedTestimonials,
    usePublicTestimonials,
    submitTestimonial,
    useAdminTestimonials,
    useTestimonial,
    createTestimonial,
    updateTestimonial,
    updateTestimonialStatus,
    toggleFeatured,
    deleteTestimonial,
  };
};
