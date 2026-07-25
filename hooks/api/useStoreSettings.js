import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStoreSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["storeSettings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/store-settings");
      return response.data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch("/store-settings", payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeSettings"] });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};
