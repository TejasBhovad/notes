import { createNote, fetchNotes } from "@/src/queries";
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

export function useFetchNotes(subject_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => await fetchNotes(subject_id),
  });

  return { data, isLoading, isError, error };
}
