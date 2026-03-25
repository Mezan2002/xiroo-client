"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout as logoutAction, updateUser as updateUserAction, hydrate } from "@/redux/slices/authSlice";

const UserContext = createContext();

export function UserProvider({ children }) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user: reduxUser, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const { toast } = useToast();

  // 1. Initial Synchronous Hydration from LocalStorage
  useEffect(() => {
    dispatch(hydrate());
  }, [dispatch]);

  // 2. High-Performance Identification Lifecycle (TanStack Query)
  const { 
    data: userData, 
    isLoading: isQueryLoading, 
    isFetching,
    refetch 
  } = useQuery({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const response = await apiRequest("/users/me");
      if (!response.success) throw new Error("Security Registry Sync Failure");
      return response.data;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // 3. Identification Parity: Sync Query Result to Redux Secure Registry
  useEffect(() => {
    if (userData) {
      dispatch(updateUserAction(userData));
    }
  }, [userData, dispatch]);

  // 4. Authentication Mutations (Best Practices)
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      if (!response.success) throw response; // Throw the whole response for custom error handling (like verification code)
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({
        user: data.user,
        token: data.accessToken
      }));
      queryClient.setQueryData(["currentUser", data.accessToken], data.user);
      toast.success("Identity Verified Successfully.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.success) throw new Error(response.message || "Onboarding Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.info("Registration Initiated. Awaiting Verification.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp, type }) => {
      const response = await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp, type }),
      });
      if (!response.success) throw new Error(response.message || "Verification Failure");
      return response.data;
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async ({ email }) => {
      const response = await apiRequest("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!response.success) throw new Error(response.message || "Dispatch Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.info("Security Code Successfully Dispatched.");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }) => {
      const response = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (!response.success) throw new Error(response.message || "Recovery Dispatch Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.info("Recovery Sequence Initiated. Check your email.");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const response = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (!response.success) throw new Error(response.message || "Credentials Update Failure");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Identity Restored: Credentials Updated.");
    },
  });

  const logout = () => {
    dispatch(logoutAction());
    queryClient.clear();
    toast.info("Session Closed. Securely Signed Out.");
    router.push("/login");
  };

  const isLoading = useMemo(() => {
    if (token && isQueryLoading) return true;
    return false;
  }, [token, isQueryLoading]);

  return (
    <UserContext.Provider value={{ 
      user: reduxUser || userData, 
      loading: isLoading, 
      login: loginMutation.mutateAsync,
      loginMutation,
      register: registerMutation.mutateAsync,
      registerMutation,
      verifyOtpMutation,
      resendOtpMutation,
      forgotPasswordMutation,
      resetPasswordMutation,
      logout, 
      refreshUser: refetch, 
      fetchUser: refetch,
      isFetching
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
