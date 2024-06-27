import { createFolder, fetchFolders } from "@/src/queries";
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
