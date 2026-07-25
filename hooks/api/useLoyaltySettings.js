import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useLoyaltySettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["loyaltySettings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/loyalty-settings");
      return response.data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch("/loyalty-settings", payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyaltySettings"] });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};
