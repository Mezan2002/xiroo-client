import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useMenus
 * Handles navigation state and administration mappings.
 */
export const useMenus = () => {
  const queryClient = useQueryClient();

  const useAllMenus = () => {
    return useQuery({
      queryKey: ["menus"],
      queryFn: async () => {
        const response = await axiosInstance.get("/menus");
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const createMenu = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post("/menus", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  const updateMenu = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await axiosInstance.patch(`/menus/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  const deleteMenu = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/menus/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  const reorderMenus = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch("/menus/update-order", { menus: payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });

  return {
    useAllMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    reorderMenus,
  };
};
