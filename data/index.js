import { getAllReferencesAndNotes } from "@/src/queries";

import { useQuery } from "@tanstack/react-query";

export function useFetchAllNotes() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["global"],
    queryFn: async () => await getAllReferencesAndNotes(),
  });

  return { data, isLoading, isError, error };
}
