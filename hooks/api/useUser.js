import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useSelector } from "react-redux";

/** 
 * Senior Dev Hook: useUser
 * Professional-grade profile and identity data management.
 * Synchronizes server-side user data with the client session.
 */
export const useUser = () => {
  const queryClient = useQueryClient();
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const {
    data: user,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useQuery({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/me");
      return response.data; // Response interceptor returns response.data
    },
    enabled: !!token && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh
    retry: false,
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData) => {
      const response = await axiosInstance.patch("/users/me", profileData);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser", token], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const syncAvatar = useMutation({
    mutationFn: async (secureUrl) => {
      const response = await axiosInstance.patch("/users/me", { profileAvatar: secureUrl });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser", token], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete("/users/me");
      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
    },
  });

  const syncAddresses = useMutation({
    mutationFn: async (addresses) => {
      const response = await axiosInstance.patch("/users/me", { addresses });
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["currentUser", token], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    user,
    isLoading: !!token && isLoading,
    isFetching,
    isAuthenticated,
    refreshUser: refetch,
    updateProfile,
    syncAvatar,
    syncAddresses,
    deleteAccount,
    error,
  };
};


