import { auth } from "../auth";

export default async function fetchUser() {
  const session = await auth();

  if (!session.user) return null;

  return session;
}
