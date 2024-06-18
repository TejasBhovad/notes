"use client";
import { createUser } from "@/src/queries";
import { fetchAllUsers } from "@/src/queries";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
const page = () => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("user");
  const [subscribed_to, setSubscribedTo] = useState([]);

  const mutatation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("created user", data);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await fetchAllUsers(),
    queryKey: ["users"], //Array according to Documentation
  });

  if (isLoading) return <>Loading</>;
  if (isError) return <div>Sorry There was an Error</div>;
  function createNewUser() {
    console.log("creating user", name, email, image, role, subscribed_to);
    mutatation.mutate({ name, email, image, role, subscribed_to });
    // createUser(name, email, image, role, subscribed_to);
  }

  return (
    <div className="w-fullh-full flex flex-col">
      <div className="w-full h-auto flex flex-col p-2 gap-2">
        <input
          type="text"
          placeholder="name"
          className="w-full py-1 px-4 rounded-sm bg-slate-700 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="w-full py-1 px-4 rounded-sm bg-slate-700 text-white"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="image"
          value={image}
          className="w-full py-1 px-4 rounded-sm bg-slate-700 text-white"
          onChange={(e) => setImage(e.target.value)}
        />
        <input
          className="w-full py-1 px-4 rounded-sm bg-slate-700 text-white"
          type="text"
          placeholder="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          className="w-full py-1 px-4 rounded-sm bg-slate-700 text-white"
          type="text"
          placeholder="subscribed_to"
          value={subscribed_to}
          onChange={(e) => setSubscribedTo(e.target.value)}
        />
        <button
          onClick={createNewUser}
          className="w-full py-1 px-4 rounded-sm bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 transition-colors duration-75 ease-in-out font-semibold"
        >
          Create User
        </button>
      </div>

      <span className="text-wrap p-3 overflow-x-auto">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </span>
    </div>
  );
};

export default page;
