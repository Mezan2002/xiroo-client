import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useAttributes
 * Product property and design matrix orchestration.
 */
export const useAttributes = () => {
  const queryClient = useQueryClient();

  // 1. Attribute Registry Discovery
  const useAttributeRegistry = () => {
    return useQuery({
      queryKey: ["attributes"],
      queryFn: async () => {
        const response = await axiosInstance.get("/attributes");
        return response.data;
      },
    });
  };

  // 2. Attribute Mutations (Admin)
  const createAttribute = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/attributes", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  const updateAttribute = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/attributes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  const deleteAttribute = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/attributes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
  });

  return {
    useAttributeRegistry,
    createAttribute,
    updateAttribute,
    deleteAttribute,
  };
};
