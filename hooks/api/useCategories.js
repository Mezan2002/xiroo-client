import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useCategories
 * Hierarchical data management for the navigation and category tree.
 */
export const useCategories = () => {
  const queryClient = useQueryClient();

  // 1. Full Category Tree (Cached for long periods)
  const useCategoryTree = () => {
    return useQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const response = await axiosInstance.get("/categories");
        return response.data;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes (Categories are static mostly)
    });
  };

  const useCategoryDetail = (slug) => {
    return useQuery({
      queryKey: ["category", slug],
      queryFn: async () => {
        const response = await axiosInstance.get(`/categories/slug/${slug}`);
        return response.data;
      },
      enabled: slug !== "all" && !!slug,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
  };


  // 2. Admin Category Mutations
  const createCategory = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/categories", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/categories/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/categories/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const reorderCategories = useMutation({
    mutationFn: async (orderData) => {
      const response = await axiosInstance.patch("/categories/reorder", { orderData });
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(["categories"], (old) => {
        // Optimistic UI updates could be implemented here for a senior feel
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { 
    useCategoryTree, 
    useCategoryDetail,
    createCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategories 
  };
};

