import { createFolder, fetchFolders, deleteFolder } from "@/src/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

const QUERY_KEYS = {
  folders: "folders",
};

/**
 * Custom hook to create a new folder
 * @returns {Object} Mutation object with mutate function and status
 */
export function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onMutate: async (newFolder) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.folders, newFolder.subject_id],
      });
      const previousFolders = queryClient.getQueryData([
        QUERY_KEYS.folders,
        newFolder.subject_id,
      ]);

      // Optimistically add the new folder
      queryClient.setQueryData(
        [QUERY_KEYS.folders, newFolder.subject_id],
        (old = []) => [...old, { ...newFolder, id: Date.now().toString() }]
      );

      return { previousFolders };
    },
    onSuccess: (newFolder, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.folders, variables.subject_id],
      });
    },
    onError: (err, newFolder, context) => {
      console.error("Error creating folder:", err);
      queryClient.setQueryData(
        [QUERY_KEYS.folders, newFolder.subject_id],
        context.previousFolders
      );
    },
  });
}

/**
 * Custom hook to fetch folders for a specific subject
 * @param {string} subject_id - The ID of the subject to fetch folders from
 * @returns {Object} Query result object containing data, loading state, and error state
 */
export function useFetchFolders(subject_id) {
  return useQuery({
    queryKey: [QUERY_KEYS.folders, subject_id],
    queryFn: () => fetchFolders(subject_id),
    enabled: Boolean(subject_id),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: true,
    select: (data) => {
      return data?.map((folder) => ({
        ...folder,
        created_at: new Date(folder.created_at),
        updated_at: new Date(folder.updated_at),
      }));
    },
  });
}

/**
 * Custom hook to delete a folder
 * @returns {Object} Mutation object with mutate function and status
 */
export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onMutate: async (deletedFolder) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.folders, deletedFolder.subject_id],
      });
      const previousFolders = queryClient.getQueryData([
        QUERY_KEYS.folders,
        deletedFolder.subject_id,
      ]);

      // Optimistically remove the folder
      queryClient.setQueryData(
        [QUERY_KEYS.folders, deletedFolder.subject_id],
        (old = []) => old.filter((folder) => folder.id !== deletedFolder.id)
      );

      return { previousFolders };
    },
    onSuccess: (_, deletedFolder) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.folders, deletedFolder.subject_id],
      });
    },
    onError: (err, deletedFolder, context) => {
      console.error("Error deleting folder:", err);
      // Rollback to the previous state
      queryClient.setQueryData(
        [QUERY_KEYS.folders, deletedFolder.subject_id],
        context.previousFolders
      );
    },
  });
}

/**
 * Helper hook to manage folders in a subject
 * @param {string} subject_id - The ID of the subject
 * @returns {Object} Combined folders management object
 */
export function useFolderManager(subject_id) {
  const {
    data: folders = [],
    isLoading,
    isError,
    error,
  } = useFetchFolders(subject_id);

  const createFolderMutation = useCreateFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();

  return {
    folders,
    isLoading,
    isError,
    error,
    createFolder: createFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    isCreating: createFolderMutation.isLoading,
    isDeleting: deleteFolderMutation.isLoading,
  };
}
