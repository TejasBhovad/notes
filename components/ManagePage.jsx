import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchSubjects } from "@/data/subject";
import { useFetchFolders } from "@/data/folder";
import { useFetchNotes } from "@/data/notes";
import SubjectFinder from "./SubjectFinder";
import NoteCard from "./NoteCard";
const ManagePage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useFetchSubjects();
  const transformedData =
    data &&
    data.map((item) => ({
      value: item.name.toLowerCase().replace(/\s/g, "-"),
      label: item.name,
      id: item.id,
    }));
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const {
    data: folders,
    isLoading: folderIsLoading,
    isError: folderIsError,
  } = useFetchFolders(selectedSubjectId);
  const transformedFoldersData =
    folders &&
    folders.map((item) => ({
      value: item.name.toLowerCase().replace(/\s/g, "-"),
      label: item.name,
      id: item.id,
    }));

  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");

  const {
    data: notes,
    isLoading: notesIsLoading,
    isError: notesIsError,
  } = useFetchNotes(selectedFolderId);

  return (
    <div className="p-4 gap-4 flex flex-col">
      <h1 className="font-semibold text-2xl">Manage file</h1>
      <div className="flex gap-4">
        <SubjectFinder
          setSelectedSubject={setSelectedSubject}
          selectedSubject={selectedSubject}
          setSelectedSubjectId={setSelectedSubjectId}
          subjects={transformedData}
        />
        <SubjectFinder
          setSelectedSubject={setSelectedFolder}
          selectedSubject={selectedFolder}
          setSelectedSubjectId={setSelectedFolderId}
          subjects={transformedFoldersData}
        />
      </div>
      <div className="">
        {/* <span>{JSON.stringify(notes)}</span> */}
        <div className="flex gap-4 flex-wrap">
          {notes &&
            notes.map((note) => (
              <NoteCard
                key={note.id}
                url={note.url}
                id={note.id}
                name={note.name}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManagePage;
