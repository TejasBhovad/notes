"use client";
import { useState } from "react";

import { useCreateNoteMutation } from "@/data/notes";
import { useFetchNotes } from "@/data/notes";
const page = () => {
  //  states
  const [folder_id, setFolderId] = useState(1);
  const [name, setName] = useState("");
  const [user_id, setUserId] = useState(1);
  const [include_global, setIncludeGlobal] = useState(false);
  const createNote = useCreateNoteMutation();
  const { data, isLoading, isError, error } = useFetchNotes(folder_id);

  // fetch data
  if (isLoading) return <>Loading</>;
  if (isError)
    return (
      <div>
        Sorry There was an Error
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );

  // create data
  function createNewSubject() {
    // console.log("creating reference", name, subject_id, type, url, user_id);
    createNote.mutate({
      name,
      user_id,
      folder_id,
      include_global,
    });
  }

  return (
    <div className="w-fullh-full flex flex-col">
      <div className="w-full h-auto flex flex-col p-2 gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="number"
          value={folder_id}
          onChange={(e) => setFolderId(e.target.value)}
          placeholder="Folder Id"
          className="p-2 border border-gray-300 rounded text-black"
        />
        <input
          type="number"
          value={user_id}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User Id"
          className="p-2 border border-gray-300 rounded text-black"
        />
        <button
          onClick={createNewSubject}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Create Note
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
