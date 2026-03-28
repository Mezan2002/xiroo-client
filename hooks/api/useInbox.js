import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

/** 
 * Senior Dev Hook: useInbox
 * Orchestrates real-time communication flows and administrative inquiry management.
 */
export const useInbox = () => {
  const queryClient = useQueryClient();

  // 1. Registry Discovery: List all conversations (admin)
  const useConversations = (filters = {}) => {
    return useQuery({
      queryKey: ["conversations", filters],
      queryFn: async () => {
        const response = await axiosInstance.get("/inbox/admin/conversations", { params: filters });
        return response.data;
      },
    });
  };

  // 2. Intelligence Deep-Dive: Single conversation
  const useConversation = (id) => {
    return useQuery({
      queryKey: ["conversation", id],
      queryFn: async () => {
        const response = await axiosInstance.get(`/inbox/conversation/${id}`);
        return response.data;
      },
      enabled: !!id,
      staleTime: 0,
    });
  };

  // 3. Customer Context Synchronization
  const useCustomerContext = () => {
    return useQuery({
      queryKey: ["customer-inbox-context"],
      queryFn: async () => {
        const response = await axiosInstance.get("/inbox/context");
        return response.data;
      },
      staleTime: 0,
    });
  };

  // 4. Communication Protocol: Send a message
  const sendMessage = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post("/inbox/send", payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data?._id) {
        queryClient.invalidateQueries({ queryKey: ["conversation", String(data._id)] });
      }
      queryClient.invalidateQueries({ queryKey: ["customer-inbox-context"] });
    },
  });

  // 5. Administrative Protocols: Assignment, Flags, Status, Priority
  const assignConversation = useMutation({
    mutationFn: async ({ id, assignedTo }) => {
      const response = await axiosInstance.patch(`/inbox/assign/${id}`, { assignedTo });
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });

  const flagConversation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/inbox/flag/${id}`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await axiosInstance.patch(`/inbox/status/${id}`, { status });
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });

  const setPriority = useMutation({
    mutationFn: async ({ id, priority }) => {
      const response = await axiosInstance.patch(`/inbox/priority/${id}`, { priority });
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/inbox/read/${id}`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });

  const deleteConversation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/inbox/purge/${id}`);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.removeQueries({ queryKey: ["conversation", id] });
    },
  });

  return {
    useConversations,
    useConversation,
    useCustomerContext,
    sendMessage,
    assignConversation,
    flagConversation,
    setStatus,
    setPriority,
    markAsRead,
    deleteConversation,
  };
};
