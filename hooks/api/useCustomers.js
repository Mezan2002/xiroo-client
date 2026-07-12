import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// Search customer by phone (for checkout lookup)
export const searchCustomerByPhone = async (phone) => {
  if (!phone || phone.length < 3) return null;
  const response = await axiosInstance.get(`/customers/search?phone=${encodeURIComponent(phone)}`);
  return response.data;
};

// Get customer suggestions by partial phone match
export const searchCustomerSuggestions = async (phone) => {
  if (!phone || phone.replace(/[^0-9]/g, "").length < 3) return [];
  const response = await axiosInstance.get(`/customers/suggest?phone=${encodeURIComponent(phone)}`);
  return response.data || [];
};

export const useCustomers = () => {
  const queryClient = useQueryClient();

  // Get all customers (admin)
  const useAllCustomers = (params = {}, options = {}) => {
    return useQuery({
      queryKey: ["customers", params],
      queryFn: async () => {
        const response = await axiosInstance.get("/customers", { params });
        return response.data;
      },
      ...options,
    });
  };

  // Get customer by ID (admin)
  const useCustomerDetail = (id, options = {}) => {
    return useQuery({
      queryKey: ["customer", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/customers/${id}`);
        return response.data;
      },
      enabled: !!id,
      ...options,
    });
  };

  // Get customer orders (admin)
  const useCustomerOrders = (phone, options = {}) => {
    return useQuery({
      queryKey: ["customer-orders", phone],
      queryFn: async () => {
        const response = await axiosInstance.get(`/customers/orders?phone=${encodeURIComponent(phone)}`);
        return response.data;
      },
      enabled: !!phone,
      ...options,
    });
  };

  // Update customer (admin)
  const updateCustomer = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/customers/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    searchCustomerByPhone,
    useAllCustomers,
    useCustomerDetail,
    useCustomerOrders,
    updateCustomer,
  };
};
