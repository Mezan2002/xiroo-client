import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useUsers
 * Comprehensive user registry management and security Clearance orchestration.
 */
export const useUsers = () => {
  const queryClient = useQueryClient();

  // 1. Registry Retrieval: List all identities
  const useAllUsers = (params = {}) => {
    return useQuery({
      queryKey: ["users", params],
      queryFn: async () => {
        const response = await axiosInstance.get("/users", { params });
        return response.data;
      },
    });
  };

  // 2. Identity Discovery: Single User Detail
  const useUserDetail = (id) => {
    return useQuery({
      queryKey: ["user", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
      },
      enabled: !!id,
    });
  };

  // 3. Security Protocols: Mutations
  const updateRole = useMutation({
    mutationFn: async ({ id, role }) => {
      const response = await axiosInstance.patch(`/users/${id}`, { role });
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const updateUser = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/users/${id}`, data);
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const createUser = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/users/create-user", { user: data });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    useAllUsers,
    useUserDetail,
    createUser,
    updateRole,
    updateUser,
    deleteUser,
  };
};
