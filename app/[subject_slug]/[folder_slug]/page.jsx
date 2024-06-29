"use client";
import Error from "@/app/Error";
import React from "react";
import NotesContainer from "@/components/NotesContainer";
import { useFetchFolders } from "@/data/folder";
import { useFetchSubjects } from "@/data/subject";
import { useFetchNotes } from "@/data/notes";
const page = ({ params }) => {
  const { data: subjects, error } = useFetchSubjects();
  const formattedSubjects = subjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
  }));
  const subject_id =
    formattedSubjects &&
    formattedSubjects.find((subject) => subject.slug === params.subject_slug)
      ?.id;

  const { data: folders, error: folderError } = useFetchFolders(subject_id);

  const formattedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
  }));

  const folder_id =
    formattedFolders &&
    formattedFolders.find((folder) => folder.slug === params.folder_slug)?.id;

  const { data: notes, error: notesError } = useFetchNotes(folder_id);

  // if the current subject is not found, return a 404 page
  if (
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
  if (!formattedFolders?.find((folder) => folder.slug === params.folder_slug)) {
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
          created_by={note.user_id}
          subject={params.subject_slug}
        />
      ))}
    </div>
  );
};

export default page;
