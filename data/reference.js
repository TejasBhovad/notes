import { createReference, fetchReferences } from "@/src/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteReference } from "@/src/queries";
export function useCreateReferenceMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createReference,
    onSuccess: (data) => {
      console.log("Reference created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["references"] });
    },
    onError: (error) => {
      console.error("Error creating reference", error);
    },
  });

  return mutation;
}

export function useFetchReferences(subject_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["references"],
    queryFn: async () => await fetchReferences(subject_id),
    enabled: !!subject_id,
  });

  return { data, isLoading, isError, error };
}

export function useDeleteReferenceMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteReference,
    onSuccess: (data) => {
      console.log("Reference deleted successfully", data);
      queryClient.invalidateQueries({ queryKey: ["references"] });
    },
    onError: (error) => {
      console.error("Error deleting reference", error);
    },
  });

  return mutation;
}
