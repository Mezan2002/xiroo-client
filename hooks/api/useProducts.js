import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useProducts
 * Optimized data discovery and lifecycle management for the storefront.
 */
export const useProducts = (options = {}) => {
  const queryClient = useQueryClient();

  // 1. Generic Inventory Fetching
  const useAllProducts = (params = {}) => {
    return useQuery({
      queryKey: ["products", params],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", { params });
        return response.data;
      },
      ...options,
    });
  };

  // 2. Specialized Homepage Featured Query
  const useFeaturedProducts = () => {
    return useQuery({
      queryKey: ["products", "featured"],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", { params: { isFeatured: true } });
        return response.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes fresh
    });
  };

  // 3. Specialized New Arrivals (Recent) Query
  const useNewArrivals = (limit = 4) => {
    return useQuery({
      queryKey: ["products", "new-arrivals", limit],
      queryFn: async () => {
        const response = await axiosInstance.get("/products", { params: { limit, sort: "-createdAt" } });
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  // 4. Detailed Lifecycle: Single Product Discovery
  const useProductDetail = (id) => {
    return useQuery({
      queryKey: ["product", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // 5. Admin Protocol: Inventory Mutations
  const useProductMutation = () => {
    const createMutation = useMutation({
      mutationFn: async (formData) => {
        const response = await axiosInstance.post("/products", formData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

    const updateMutation = useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axiosInstance.patch(`/products/${id}`, data);
        return response.data;
      },
      onSuccess: (data, { id }) => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product", id] });
      },
    });

    const deleteMutation = useMutation({
      mutationFn: async (id) => {
        const response = await axiosInstance.delete(`/products/${id}`);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

    return { createMutation, updateMutation, deleteMutation };
  };

  return {
    useAllProducts,
    useFeaturedProducts,
    useNewArrivals,
    useProductDetail,
    useProductMutation
  };
};
