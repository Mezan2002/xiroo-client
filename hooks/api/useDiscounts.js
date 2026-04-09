import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export const useDiscounts = () => {
  const queryClient = useQueryClient();

  const useDiscountsQuery = () => {
    return useQuery({
      queryKey: ["discounts"],
      queryFn: async () => {
        const response = await axiosInstance.get("/discounts");
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const useDiscountDetail = (id) => {
    return useQuery({
      queryKey: ["discount", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/discounts/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  const createDiscount = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/discounts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });

  const updateDiscount = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/discounts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });

  const deleteDiscount = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/discounts/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
  });

  const validateDiscount = useMutation({
    mutationFn: async (payload) => {
      // payload: { code, currentOrderValue }
      const response = await axiosInstance.post(`/discounts/validate`, payload);
      return response.data;
    },
  });

  return {
    useDiscountsQuery,
    useDiscountDetail,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    validateDiscount,
  };
};
