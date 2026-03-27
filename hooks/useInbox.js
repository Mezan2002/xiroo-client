import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

// ── List all conversations (admin) ────────────────────────────────────────────
export const useConversations = (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: async () => {
      const data = await apiRequest(`/inbox/admin/conversations?${queryParams}`);
      return data.data;
    },
  });
};

// ── Single conversation by ObjectId — uses dedicated endpoint ─────────────────
export const useConversation = (id) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const data = await apiRequest(`/inbox/conversation/${id}`);
      return data.data;
    },
    enabled: !!id,
    staleTime: 0, // Always re-fetch when refetch() is called
  });
};

// ── Customer's own conversation context ───────────────────────────────────────
export const useCustomerContext = () => {
  return useQuery({
    queryKey: ["customer-inbox-context"],
    queryFn: async () => {
      const data = await apiRequest(`/inbox/context`);
      return data.data;
    },
    staleTime: 0,
  });
};

// ── Send a message ────────────────────────────────────────────────────────────
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const data = await apiRequest(`/inbox/send`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (data?._id) {
        queryClient.invalidateQueries({ queryKey: ["conversation", data._id] });
        queryClient.invalidateQueries({ queryKey: ["conversation", String(data._id)] });
      }
      queryClient.invalidateQueries({ queryKey: ["customer-inbox-context"] });
    },
  });
};

// ── Admin: Assign conversation ────────────────────────────────────────────────
export const useAssignConversation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ assignedTo }) => {
      const data = await apiRequest(`/inbox/assign/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ assignedTo }),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });
};

// ── Admin: Toggle flag for review ─────────────────────────────────────────────
export const useFlagConversation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const data = await apiRequest(`/inbox/flag/${id}`, { method: "PATCH" });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });
};

// ── Admin: Set status (resolve / reopen) ─────────────────────────────────────
export const useSetStatus = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ status }) => {
      const data = await apiRequest(`/inbox/status/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });
};

// ── Admin: Set priority ───────────────────────────────────────────────────────
export const useSetPriority = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ priority }) => {
      const data = await apiRequest(`/inbox/priority/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ priority }),
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });
};

// ── Mark as read ──────────────────────────────────────────────────────────────
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const data = await apiRequest(`/inbox/read/${id}`, { method: "PATCH" });
      return data.data;
    },
    onSuccess: (_data, id) => {
      // Use the id passed to mutate (not data._id) — avoids crash if data is null
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["conversation", id] });
    },
  });
};

// ── Delete (purge) conversation ───────────────────────────────────────────────
export const useDeleteConversation = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const data = await apiRequest(`/inbox/purge/${id}`, { method: "DELETE" });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.removeQueries({ queryKey: ["conversation", id] });
    },
  });
};
