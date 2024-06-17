import { createUser } from "@/src/queries";
import { useQuery } from "@tanstack/react-query";

export function createNewUser(
  name,
  email,
  image,
  role = "user",
  subscribed_to = []
) {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      createUser("name", "email", "image", "role", "subscribed_to"),
  });
}
