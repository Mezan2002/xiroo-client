import axiosInstance from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDeliverySettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["deliverySettings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/delivery-settings");
      return response.data;
    },
  });

  const getDeliveryFee = useQuery({
    queryKey: ["deliveryFee", settings?._id],
    queryFn: async () => {
      const response = await axiosInstance.get("/delivery-settings");
      return response.data;
    },
    enabled: !!settings,
  });

  const updateSettings = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch("/delivery-settings", payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverySettings"] });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings,
  };
};

export const useDeliveryFee = (district) => {
  return useQuery({
    queryKey: ["deliveryFee", district],
    queryFn: async () => {
      const response = await axiosInstance.get(`/delivery-settings/fee?district=${encodeURIComponent(district)}`);
      return response.data;
    },
    enabled: !!district,
  });
};
