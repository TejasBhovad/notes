import { createNote, fetchNotes, deleteNote } from "@/src/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

const QUERY_KEYS = {
  notes: "notes",
};

/**
 * Custom hook to create a new note
 * @returns {Object} Mutation object with mutate function and status
 */
export function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: (newNote, variables) => {
      // Optimistically update the cache
      queryClient.setQueryData(
        [QUERY_KEYS.notes, variables.folder_id],
        (oldNotes = []) => [...oldNotes, newNote]
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.notes, variables.folder_id],
      });
    },
    onError: (error) => {
      console.error("Error creating note:", error.message);
      return error.message;
    },
  });
}

/**
 * Custom hook to fetch notes for a specific folder
 * @param {string} folder_id - The ID of the folder to fetch notes from
 * @returns {Object} Query result object containing data, loading state, and error state
 */
export function useFetchNotes(folder_id) {
  return useQuery({
    queryKey: [QUERY_KEYS.notes, folder_id],
    queryFn: () => fetchNotes(folder_id),
    enabled: Boolean(folder_id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
    select: (data) => {
      return data?.map((note) => ({
        ...note,
        created_at: new Date(note.created_at),
        updated_at: new Date(note.updated_at),
      }));
    },
  });
}

/**
 * Custom hook to delete a note
 * @returns {Object} Mutation object with mutate function and status
 */
export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onMutate: async (deletedNote) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.notes, deletedNote.folder_id],
      });
      const previousNotes = queryClient.getQueryData([
        QUERY_KEYS.notes,
        deletedNote.folder_id,
      ]);

      // Optimistically remove the note
      queryClient.setQueryData(
        [QUERY_KEYS.notes, deletedNote.folder_id],
        (old = []) => old.filter((note) => note.id !== deletedNote.id)
      );

      return { previousNotes };
    },
    onSuccess: (_, deletedNote) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.notes, deletedNote.folder_id],
      });
    },
    onError: (err, deletedNote, context) => {
      console.error("Error deleting note:", err);
      // Rollback to the previous state if there's an error
      queryClient.setQueryData(
        [QUERY_KEYS.notes, deletedNote.folder_id],
        context.previousNotes
      );
    },
  });
}

/**
 * Helper hook to manage notes in a folder
 * @param {string} folder_id - The ID of the folder
 * @returns {Object} Combined notes management object
 */
export function useNoteManager(folder_id) {
  const {
    data: notes = [],
    isLoading,
    isError,
    error,
  } = useFetchNotes(folder_id);

  const createNoteMutation = useCreateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  return {
    notes,
    isLoading,
    isError,
    error,
    createNote: createNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    isCreating: createNoteMutation.isLoading,
    isDeleting: deleteNoteMutation.isLoading,
  };
}
