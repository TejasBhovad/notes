import { useState } from "react";
import Delete from "./logo/Delete";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useFetchSubjects } from "@/data/subject";
import { useFetchFolders } from "@/data/folder";
import { useFetchNotes } from "@/data/notes";
import SubjectFinder from "./SubjectFinder";
import NoteCard from "./NoteCard";
import { useDeleteFolderMutation } from "@/data/folder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "./ui/use-toast";
const ManagePage = () => {
  const deleteFolderMutation = useDeleteFolderMutation();
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
  // if no folder is selected, return a message
  if (!selectedFolderId) {
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
        <div className="flex flex-col gap-2">
          {/* map over folders in subject */}
          {transformedFoldersData &&
            transformedFoldersData.map((folder) => (
              <div className="w-full flex gap-2">
                <Button
                  key={folder.id}
                  className="bg-white/5 p-2 rounded-md w-full"
                  // onlick should set selectedFolderId and selectedFolder
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    setSelectedFolder(folder.label);
                  }}
                >
                  <span>{folder.label}</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-white/10">
                      <Delete className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Do you want to delete this folder? ({folder.label})
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the folder.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteFolderMutation.mutate(folder.id);
                          queryClient.invalidateQueries("folders");
                          toast({
                            title: "✅ Success",
                            description: "Folder deleted successfully",
                          });
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
        </div>
      </div>
    );
  }

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
