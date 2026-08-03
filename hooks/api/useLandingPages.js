import axiosInstance from "@/lib/axios";
import { addToast } from "@/redux/slices/toastSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useLandingPages = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Admin: Fetch all landing pages
  const useAdminLandingPages = (page = 1, limit = 20, search = "", isPublished) => {
    return useQuery({
      queryKey: ["admin-landing-pages", page, limit, search, isPublished],
      queryFn: async () => {
        let url = `/landing-pages?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (isPublished !== undefined && isPublished !== "all") url += `&isPublished=${isPublished}`;
        const response = await axiosInstance.get(url);
        return response;
      },
    });
  };

  // Admin: Fetch single landing page
  const useLandingPage = (id) => {
    return useQuery({
      queryKey: ["landing-page", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/landing-pages/${id}`);
        return response;
      },
      enabled: !!id,
    });
  };

  // Admin: Create landing page
  const createLandingPage = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/landing-pages", data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Landing page created successfully", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-landing-pages"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to create landing page",
          type: "error",
        }),
      );
    },
  });

  // Admin: Update landing page
  const updateLandingPage = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/landing-pages/${id}`, data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Landing page updated successfully", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-landing-pages"] });
      queryClient.invalidateQueries({ queryKey: ["landing-page"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to update landing page",
          type: "error",
        }),
      );
    },
  });

  // Admin: Delete landing page
  const deleteLandingPage = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/landing-pages/${id}`);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Landing page deleted successfully", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["admin-landing-pages"] });
    },
    onError: (error) => {
      dispatch(
        addToast({
          message: error?.response?.data?.message || "Failed to delete landing page",
          type: "error",
        }),
      );
    },
  });

  // Public: Fetch landing page by slug
  const usePublicLandingPage = (slug) => {
    return useQuery({
      queryKey: ["public-landing-page", slug],
      queryFn: async () => {
        const response = await axiosInstance.get(`/landing-pages/slug/${slug}`);
        return response;
      },
      enabled: !!slug,
    });
  };

  // Admin: Fetch products for selector
  const useProducts = (search = "") => {
    return useQuery({
      queryKey: ["products-for-landing", search],
      queryFn: async () => {
        const url = search
          ? `/products?search=${encodeURIComponent(search)}&limit=50`
          : `/products?limit=50`;
        const response = await axiosInstance.get(url);
        return response;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    useAdminLandingPages,
    useLandingPage,
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    usePublicLandingPage,
    useProducts,
  };
};
