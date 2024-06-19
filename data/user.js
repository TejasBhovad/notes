import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/src/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/src/queries"; // Adjust the import path as necessary

import { useQueryClient } from "@tanstack/react-query";
export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User created successfully", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error creating user", error);
    },
  });

  return mutation;
}
export function useFetchAllUsers() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await fetchAllUsers(),
  });

  return { data, isLoading, isError, error };
}
