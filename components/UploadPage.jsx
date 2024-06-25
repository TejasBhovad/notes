"use client";
import { useQueryClient } from "@tanstack/react-query";
import SubjectSelector from "./SubjectSelector";
import FolderSelector from "./FolderSelector";
import { useFetchSubjects } from "@/data/subject";
import { useFetchFolders } from "@/data/folder";
import { useState, useEffect } from "react";
import { useCreateNoteMutation } from "@/data/notes";
import { UploadDropzone } from "@uploadthing/react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

const UploadPage = ({ session, user }) => {
  const createNote = useCreateNoteMutation();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useFetchSubjects();
  const transformedData =
    data &&
    data.map((item) => ({
      value: item.name.toLowerCase().replace(/\s/g, "-"),
      label: item.name,
      id: item.id,
    }));
  const [user_id, setUserId] = useState(user.id);
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

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (selectedSubjectId) {
      queryClient.invalidateQueries(["folders", selectedSubjectId]);
    }
  }, [selectedSubjectId]);

  function createNewSubject() {
    if (!selectedSubjectId) {
      alert("Please select a subject first");
      return;
    }
    if (!selectedFolderId) {
      alert("Please select a folder first");
      return;
    }
    if (!url) {
      alert("URL is required");
      return;
    }
    if (files.length === 0) {
      alert("Please upload a file");
      return;
    }
    console.log("creating note", name, user_id, selectedFolderId, url);
    createNote.mutate({
      name: name,
      url: url,
      user_id: user_id,
      folder_id: selectedFolderId,
    });
    alert("Note created successfully");
    setFiles([]);
    setName("");
    setUrl("");
  }

  // when files come in chnage name
  useEffect(() => {
    if (files.length > 0) {
      setName(files[0].name.replace(".pdf", ""));
      setUrl(files[0].url);
    }
  }, [files]);

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
      <div className="flex gap-4">
        <SubjectSelector
          user_id={user_id}
          user={user}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          subjects={transformedData}
          selectedSubjectId={selectedSubjectId}
          setSelectedSubjectId={setSelectedSubjectId}
        />
        <FolderSelector
          user={user}
          user_id={user_id}
          selectedSubjectId={selectedSubjectId}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          folders={transformedFoldersData}
          setSelectedFolderId={setSelectedFolderId}
        />
      </div>

      {/* <span>{selectedSubjectId}</span>
      <span>{selectedFolderId}</span> */}
      <div
        className={`w-full h-54 min-h-16 ${
          !selectedSubjectId || !selectedFolderId || files.length > 0
            ? "pointer-events-none opacity-25"
            : ""
        }`}
      >
        <div className="w-full h-full border border-white/50 rounded-md border-dashed">
          <UploadDropzone
            className="h-full w-full ut-button:bg-primary/75 ut-button:p-0 ut-button:text-sm ut-button:h-8 ut-label:text-primary/75 ut-label:text-sm ut-label:font-semibold ut-upload-icon:text-white/75 ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-white/50 ut-button:ut-uploading::after:bg-white"
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              setFiles([...files, ...res]);
            }}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </div>

      <div className="file list flex flex-col py-2">
        {
          files &&
            files.map((file) => (
              <Link
                // open in new tab
                target="_blank"
                href={file.url}
                key={file.id}
                className="min-w-64 flex flex-col bg-primary/10 w-fit rounded-md px-4 py-2"
              >
                <span className="font-semibold">{file.name}</span>
              </Link>
            ))
          // <span>{JSON.stringify(files)}</span>
        }
      </div>
      <div className="flex gap-1 text-center items-center justify-center">
        <span>Add </span>
        <span className="gap-1 flex font-medium text-primary/75">
          {/* iterate thru file names */}
          {files.map((file) => (
            <span key={file.id}>{file.name}</span>
          ))}
          {!files.length && "<file>"}
        </span>
        <span>to</span>
        <span className="font-medium text-primary/75">
          {selectedFolder || "<select a folder>"}
        </span>
        <span>in</span>
        <span className="font-medium text-primary/75">
          {selectedSubject || "<select a subject>"}
        </span>
      </div>
      {files.length > 0 && (
        <div className="flex py-4 flex-col gap-1">
          <span className="text-xs font-bold px-1 text-white/50">NAME</span>
          <Input
            type="text"
            // default value to file name w.o pdf
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="p-2 border border-gray-300/10 rounded text-white"
          />
        </div>
      )}

      <Button
        disabled={files.length === 0}
        onClick={createNewSubject}
        className="p-2 bg-primary/15 border-[1.5px] border-primary/25 text-white rounded hover:bg-primary/25 hover:text-white"
      >
        Create Note
      </Button>
    </div>
  );
};

export default UploadPage;
