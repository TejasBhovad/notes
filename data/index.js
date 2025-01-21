import { getAllReferencesAndNotes } from "@/src/queries";

import { useQuery } from "@tanstack/react-query";

export function useFetchAllNotes() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["global"],
    queryFn: async () => await getAllReferencesAndNotes(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { data, isLoading, isError, error };
}
