"use client";
import Error from "@/app/Error";
import React from "react";
import { useState, useEffect } from "react";
import NotesContainer from "@/components/NotesContainer";
import { useFetchFolders } from "@/data/folder";
import { useFetchSubjects } from "@/data/subject";
import { useFetchNotes } from "@/data/notes";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/src/queries";
const page = ({ params }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const {
    data: subjects,
    isLoading: subjectLoading,
    error,
  } = useFetchSubjects();
  const formattedSubjects = subjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
  }));
  const subject_id =
    formattedSubjects &&
    formattedSubjects.find((subject) => subject.slug === params.subject_slug)
      ?.id;

  const {
    data: folders,
    isLoading,
    error: folderError,
  } = useFetchFolders(subject_id);

  const formattedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
  }));

  const folder_id =
    formattedFolders &&
    formattedFolders.find((folder) => folder.slug === params.folder_slug)?.id;

  const { data: notes, error: notesError } = useFetchNotes(folder_id);

  useEffect(() => {
    if (session) {
      getUserByEmail(session.user.email).then((res) => {
        setUser(res[0]);
      });
    }
  }, [session]);

  // if the current subject is not found, return a 404 page
  if (
    !subjectLoading &&
    !isLoading &&
    !formattedSubjects?.find((subject) => subject.slug === params.subject_slug)
  ) {
    return (
      <Error
        message={`The subject ${params.subject_slug.replace(
          /_/g,
          " "
        )} does not exist`}
      />
    );
  }

  // if the current folder is not found, return a 404 page
  if (
    !subjectLoading &&
    !isLoading &&
    !formattedFolders?.find((folder) => folder.slug === params.folder_slug)
  ) {
    return (
      <Error
        message={`The folder ${params.folder_slug.replace(
          /_/g,
          " "
        )} does not exist`}
      />
    );
  }

  // if no notes, return a message
  if (!notes) {
    return (
      <div className="p-4 flex flex-col gap-6">
        <span>
          <h1 className="text-3xl font-semibold">Notes</h1>
          <span className="uppercase text-sm font-semibold text-white/50">
            No notes found
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{params.folder_slug}</h1>
      {notes?.map((note) => (
        <NotesContainer
          key={note.id}
          name={note.name}
          url={note.url}
          created_at={note.created_at}
          created_by={note.user_id}
          subject={params.subject_slug}
          //  if user,id user_id=user.id else -1
          user_id={user ? user.id : -1}
        />
      ))}
    </div>
  );
};

export default page;
