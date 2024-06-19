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
    queryKey: ["folders"],
    queryFn: async () => await fetchFolders(subject_id),
  });

  return { data, isLoading, isError, error };
}
