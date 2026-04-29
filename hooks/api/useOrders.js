import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useOrders
 * Robust order lifecycle management and logistical orchestration.
 */
export const useOrders = () => {
  const queryClient = useQueryClient();

  // 1. Transactional Protocol: Create Order Registry
  const placeOrder = useMutation({
    mutationFn: async (payload) => {
      // Support both direct payload or { orderData, token } for auto-flow
      const isAutoFlow = payload?.orderData && payload?.token;
      const orderData = isAutoFlow ? payload.orderData : payload;
      const config = isAutoFlow ? { headers: { Authorization: payload.token } } : {};
      
      const response = await axiosInstance.post("/orders", orderData, config);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const placeGuestOrder = useMutation({
    mutationFn: async (orderData) => {
      const response = await axiosInstance.post("/orders/guest", orderData);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // 2. Registry Retrieval: List Orders (Admin)
  const useOrderHistory = (params = {}, options = {}) => {
    return useQuery({
      queryKey: ["orders", params],
      queryFn: async () => {
        const response = await axiosInstance.get("/orders", { params });
        return response.data;
      },
      ...options,
    });
  };

  // 2.1 Personalized Registry: User specific order history
  const useMyOrders = (options = {}) => {
    return useQuery({
      queryKey: ["my-orders"],
      queryFn: async () => {
        const response = await axiosInstance.get("/orders/my-orders");
        return response.data;
      },
      ...options,
    });
  };

  // 2.2 Analytics Protocol: Order Statistics
  const useOrderStats = (options = {}) => {
    return useQuery({
      queryKey: ["order-stats"],
      queryFn: async () => {
        const response = await axiosInstance.get("/orders/stats");
        return response.data;
      },
      ...options,
    });
  };

  // 3. Single Order Discovery
  const useOrderDetail = (id, options = {}) => {
    return useQuery({
      queryKey: ["order", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/orders/${id}`);
        return response.data;
      },
      enabled: !!id,
      ...options,
    });
  };

  // 4. Admin Management protocols: Status synchronization
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
      return response;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });

  const dispatchCourier = useMutation({
    mutationFn: async ({ id, provider, trackingId }) => {
      const response = await axiosInstance.post(`/orders/${id}/dispatch`, { provider, trackingId });
      return response;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
  });

  const cancelOrder = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/orders/${id}/cancel`);
      return response;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/orders/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
    },
  });

  return {
    placeOrder,
    placeGuestOrder,
    useOrderHistory,
    useMyOrders,
    useOrderStats,
    useOrderDetail,
    updateStatus,
    dispatchCourier,
    cancelOrder,
    deleteOrder,
  };
};
