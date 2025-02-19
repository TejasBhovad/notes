"use client";
import Error from "@/app/Error";
import React, { use } from "react";
import { useState, useEffect } from "react";
import NotesContainer from "@/components/NotesContainer";
import { useFetchFolders } from "@/data/folder";
import { useFetchSubjects, useFetchArchivedSubjects } from "@/data/subject";
import { useFetchNotes } from "@/data/notes";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/src/queries";

const page = props => {
  const params = use(props.params);
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  // Fetch both regular and archived subjects
  const {
    data: subjects,
    isLoading: subjectLoading,
    error,
  } = useFetchSubjects();

  const {
    data: archivedSubjects,
    isLoading: archivedSubjectLoading,
    error: archivedError,
  } = useFetchArchivedSubjects();

  const formattedSubjects = subjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
    isArchived: false,
  }));

  const formattedArchivedSubjects = archivedSubjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
    isArchived: true,
  }));

  // Find current subject in both regular and archived subjects
  const currentSubject =
    formattedSubjects?.find(
      (subject) => subject.slug === params.subject_slug
    ) ||
    formattedArchivedSubjects?.find(
      (subject) => subject.slug === params.subject_slug
    );

  const subject_id = currentSubject?.id;
  const isArchived = currentSubject?.isArchived;

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

  const {
    data: notes,
    isLoading: notesLoading,
    error: notesError,
  } = useFetchNotes(folder_id);

  useEffect(() => {
    if (session) {
      getUserByEmail(session.user.email).then((res) => {
        setUser(res[0]);
      });
    }
  }, [session]);

  // Check if subject exists in either regular or archived subjects
  if (
    !subjectLoading &&
    !archivedSubjectLoading &&
    !isLoading &&
    !currentSubject
  ) {
    return (
      (<Error
        message={`The subject ${params.subject_slug.replace(
          /_/g,
          " "
        )} does not exist`}
      />)
    );
  }

  // if the current folder is not found, return a 404 page
  if (
    !subjectLoading &&
    !archivedSubjectLoading &&
    !isLoading &&
    !formattedFolders?.find((folder) => folder.slug === params.folder_slug)
  ) {
    return (
      (<Error
        message={`The folder ${params.folder_slug.replace(
          /_/g,
          " "
        )} does not exist`}
      />)
    );
  }

  // if no notes, return a message
  if (
    !notes &&
    !notesLoading &&
    !isLoading &&
    !subjectLoading &&
    !archivedSubjectLoading
  ) {
    return (
      (<div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold capitalize">
            {params.folder_slug.replace(/_/g, " ")}
          </h1>
          {isArchived && (
            <span className="uppercase text-sm font-semibold text-warning">
              Archived Subject
            </span>
          )}
          <span className="uppercase text-sm font-semibold text-danger">
            No notes found
          </span>
        </div>
      </div>)
    );
  }

  return (
    <div className="w-full h-[85vh] pb-6 overflow-y-auto px-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold capitalize">
            {params.folder_slug}
          </h1>
          {isArchived && (
            <span className="uppercase text-sm font-semibold text-warning">
              Archived Subject
            </span>
          )}
        </div>
        {notes?.map((note) => (
          <NotesContainer
            key={note.id}
            name={note.name}
            url={note.url}
            created_at={note.created_at}
            created_by={note.user_id}
            subject={params.subject_slug}
            user_id={user ? user.id : -1}
            isArchived={isArchived}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
