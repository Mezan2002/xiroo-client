import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useLoyalty
 * Orchestrates the loyalty tiers, points, and prestige configurations.
 */
export const useLoyalty = () => {
  const queryClient = useQueryClient();

  // 1. Settings Discovery
  const useLoyaltySettings = () => {
    return useQuery({
      queryKey: ["loyalty-settings"],
      queryFn: async () => {
        const response = await axiosInstance.get("/loyalty-settings");
        return response.data;
      },
      staleTime: 30 * 60 * 1000, // 30 minutes cache for global settings
    });
  };

  // 2. Prestige Protocol Updates
  const updateLoyaltySettings = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.patch("/loyalty-settings", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-settings"] });
    },
  });

  return {
    useLoyaltySettings,
    updateLoyaltySettings,
  };
};
