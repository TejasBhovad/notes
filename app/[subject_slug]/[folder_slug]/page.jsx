"use client";
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
      .id;

  const { data: folders, error: folderError } = useFetchFolders(subject_id);
  const formattedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
  }));

  const folder_id =
    formattedFolders &&
    formattedFolders.find((folder) => folder.slug === params.folder_slug).id;

  const { data: notes, error: notesError } = useFetchNotes(folder_id);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{params.folder_slug}</h1>
      {notes?.map((note) => (
        <NotesContainer key={note.id} name={note.name} url={note.url} />
      ))}
    </div>
  );
};

export default page;
