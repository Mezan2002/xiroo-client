import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  const useDashboardStats = () => {
    return useQuery({
      queryKey: ["dashboard-stats"],
      queryFn: async () => {
        const response = await axiosInstance.get("/dashboard/stats");
        return response;
      },
      staleTime: 2 * 60 * 1000,
    });
  };

  const useSidebarBadges = () => {
    return useQuery({
      queryKey: ["sidebar-badges"],
      queryFn: async () => {
        const response = await axiosInstance.get("/dashboard/sidebar-badges");
        return response;
      },
      staleTime: 1 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000,
    });
  };

  return { useDashboardStats, useSidebarBadges };
};
