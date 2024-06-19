import {
  createSubject,
  fetchSubjects,
  fetchArchivedSubjects,
} from "@/src/queries";

import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export function useCreateSubjectMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createSubject,
    onSuccess: (data) => {
      console.log("Subject created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (error) => {
      console.error("Error creating subject", error);
    },
  });

  return mutation;
}

export function useFetchSubjects() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => await fetchSubjects(),
  });

  return { data, isLoading, isError, error };
}

export function useFetchArchivedSubjects() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["archived_subjects"],
    queryFn: async () => await fetchArchivedSubjects(),
  });

  return { data, isLoading, isError, error };
}
