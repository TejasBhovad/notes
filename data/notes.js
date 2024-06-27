import { createNote, fetchNotes, deleteNote } from "@/src/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: (data) => {
      console.log("Note created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error creating note", error);
    },
  });

  return mutation;
}

export function useFetchNotes(folder_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", folder_id],
    queryFn: async () => await fetchNotes(folder_id),
    enabled: !!folder_id,
  });

  return { data, isLoading, isError, error };
}
// create for delete
export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: (data) => {
      console.log("Note deleted successfully", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note", error);
    },
  });

  return mutation;
}
