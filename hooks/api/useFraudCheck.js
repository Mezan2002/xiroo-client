import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useFraudCheck = () => {
  const queryClient = useQueryClient();

  const useCourierCheck = () => {
    return useMutation({
      mutationFn: async (phone) => {
        const response = await axiosInstance.post("/fraud-check/admin-check-courier", { phone });
        return response.data;
      },
    });
  };

  const useFraudStats = (options = {}) => {
    return useQuery({
      queryKey: ["fraud-stats"],
      queryFn: async () => {
        const response = await axiosInstance.get("/fraud-check/stats");
        return response.data;
      },
      ...options,
    });
  };

  const useFlaggedOrders = (params = {}, options = {}) => {
    return useQuery({
      queryKey: ["fraud-orders", params],
      queryFn: async () => {
        const response = await axiosInstance.get("/fraud-check/orders", { params });
        return response.data;
      },
      ...options,
    });
  };

  return {
    useCourierCheck,
    useFraudStats,
    useFlaggedOrders,
  };
};
