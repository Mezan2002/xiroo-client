import axiosInstance from "@/lib/axios";
import { addToast } from "@/redux/slices/toastSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useNotes = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const useNotesList = (page = 1, limit = 20, search = "", tag = "") => {
    return useQuery({
      queryKey: ["notes", page, limit, search, tag],
      queryFn: async () => {
        let url = `/notes?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (tag) url += `&tag=${encodeURIComponent(tag)}`;
        const response = await axiosInstance.get(url);
        return response;
      },
    });
  };

  const useNoteTags = () => {
    return useQuery({
      queryKey: ["note-tags"],
      queryFn: async () => {
        const response = await axiosInstance.get("/notes/tags");
        return response;
      },
    });
  };

  const createNote = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/notes", data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Note created", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      dispatch(addToast({ message: error?.response?.data?.message || "Failed to create note", type: "error" }));
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(`/notes/${id}`, data);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Note updated", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      dispatch(addToast({ message: error?.response?.data?.message || "Failed to update note", type: "error" }));
    },
  });

  const togglePin = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(`/notes/${id}/pin`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(`/notes/${id}`);
      return response;
    },
    onSuccess: () => {
      dispatch(addToast({ message: "Note deleted", type: "success" }));
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    useNotesList,
    useNoteTags,
    createNote,
    updateNote,
    togglePin,
    deleteNote,
  };
};
