import { createFolder, fetchFolders, deleteFolder } from "@/src/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createFolder,
    onSuccess: (data) => {
      console.log("Folder created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      console.error("Error creating folder", error);
    },
  });

  return mutation;
}

export function useFetchFolders(subject_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["folders", subject_id],
    queryFn: async () => await fetchFolders(subject_id),
    enabled: !!subject_id,
    // dont prefetch`
    prefetchQuery: false,
  });

  return { data, isLoading, isError, error };
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteFolder,
    onSuccess: (data) => {
      console.log("Folder deleted successfully", data);
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      console.error("Error deleting folder", error);
    },
  });

  return mutation;
}
