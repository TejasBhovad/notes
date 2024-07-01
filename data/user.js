import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/src/queries";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/src/queries"; // Adjust the import path as necessary
import {
  fetchFoldersByUser,
  fetchReferencesByUser,
  fetchNotesByUser,
  updateRecentlyViewed,
  getUserByEmail,
} from "@/src/queries";
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

export function useFetchFoldersByUser(user_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["folders", user_id],
    queryFn: async () => await fetchFoldersByUser(user_id),
  });

  return { data, isLoading, isError, error };
}

export function useFetchReferencesByUser(user_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["references", user_id],
    queryFn: async () => await fetchReferencesByUser(user_id),
  });

  return { data, isLoading, isError, error };
}

export function useFetchNotesByUser(user_id) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", user_id],
    queryFn: async () => await fetchNotesByUser(user_id),
  });

  return { data, isLoading, isError, error };
}

export function useUpdateRecentlyViewedMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateRecentlyViewed,
    onSuccess: (data) => {
      console.log("Recently viewed updated successfully", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating recently viewed", error);
    },
  });

  return mutation;
}

export function useGetUserByEmail(email) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", email],
    queryFn: async () => await getUserByEmail(email),
    enabled: !!email,
  });

  return { data, isLoading, isError, error };
}
