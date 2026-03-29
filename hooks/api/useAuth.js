import { useToast } from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import {
  logout as logoutAction,
  setCredentials,
} from "@/redux/slices/authSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

/**
 * Senior Dev Hook: useAuth
 * Orchestrates technical identity verification and session lifecycle.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.accessToken }));
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Identity Verified. Session active.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post("/auth/register", formData);
      return response.data;
    },
    onSuccess: () => {
      toast.info("Onboarding successful. Awaiting verification.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp, type }) => {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
        type,
      });
      return response.data;
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async ({ email }) => {
      const response = await axiosInstance.post("/auth/resend-otp", { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Security Code Dispatched.");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ email, otp, newPassword }) => {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Security Credential Updated.");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }) => {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Recovery Protocol Initiated.");
    },
  });

  const logout = () => {
    dispatch(logoutAction());
    queryClient.clear();
    toast.info("Session Terminated. Securely signed out.");
    router.push("/login");
  };

  return {
    loginMutation,
    registerMutation,
    verifyOtpMutation,
    resendOtpMutation,
    resetPasswordMutation,
    forgotPasswordMutation,
    logout,
  };
};
