"use client";
import { useQueryClient } from "@tanstack/react-query";
import SubjectSelector from "./SubjectSelector";
import FolderSelector from "./FolderSelector";
import { useFetchSubjects } from "@/data/subject";
import { useFetchFolders } from "@/data/folder";
import { useState, useEffect } from "react";
import { useCreateNoteMutation } from "@/data/notes";
import { UploadDropzone } from "@/src/utils/uploadthing";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { updateSubjectLastUpdated } from "@/src/queries";

const UploadPage = ({ session, user }) => {
  const { toast } = useToast();
  const createNote = useCreateNoteMutation();
  const queryClient = useQueryClient();
  const [user_id, setUserId] = useState(user.id);

  // Fetch subjects
  const {
    data: subjectsData,
    isLoading,
    isError,
    error,
  } = useFetchSubjects(user_id);

  // Transform the subjects data only when it exists
  const transformedData = Array.isArray(subjectsData)
    ? subjectsData.map((item) => ({
        value: item.name.toLowerCase().replace(/\s/g, "-"),
        label: item.name,
        id: item.id,
      }))
    : [];

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  // Fetch folders based on selected subject
  const {
    data: folders,
    isLoading: folderIsLoading,
    isError: folderIsError,
  } = useFetchFolders(selectedSubjectId);

  const transformedFoldersData = Array.isArray(folders)
    ? folders.map((item) => ({
        value: item.name.toLowerCase().replace(/\s/g, "-"),
        label: item.name,
        id: item.id,
      }))
    : [];

  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (selectedSubjectId) {
      queryClient.invalidateQueries(["folders", selectedSubjectId]);
    }
  }, [selectedSubjectId, queryClient]);

  useEffect(() => {
    if (files.length > 0) {
      setName(files[0].name.replace(".pdf", ""));
      setUrl(files[0].url);
    }
  }, [files]);

  function createNewSubject() {
    if (!selectedSubjectId) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Please select a subject first",
      });
      return;
    }
    if (!selectedFolderId) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Please select a folder first",
      });
      return;
    }
    if (!url || files.length === 0) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Please upload a file first",
      });
      return;
    }

    console.log("Creating note:", {
      name,
      url,
      user_id,
      folder_id: selectedFolderId,
    });

    createNote.mutate({
      name: name,
      url: url,
      user_id: user_id,
      folder_id: selectedFolderId,
    });

    toast({
      title: "✅ Success",
      description: "Note created successfully",
    });

    updateSubjectLastUpdated(selectedSubjectId);
    setFiles([]);
    setName("");
    setUrl("");
  }

  if (isLoading) {
    return <div>Loading subjects...</div>;
  }

  if (isError) {
    return (
      <div className="text-red-500">
        Error loading subjects: {error?.message || "Unknown error"}
      </div>
    );
  }

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

      {/* Rest of your component remains the same */}
      <div
        className={`w-full h-54 min-h-16 ${
          !selectedSubjectId || !selectedFolderId || files.length > 0
            ? "pointer-events-none opacity-25"
            : ""
        }`}
      >
        <div className="w-full h-full border border-border rounded-md border-dashed">
          <UploadDropzone
            className="h-full w-full ut-button:bg-primary/75 ut-button:p-0 ut-button:text-sm ut-button:h-8 ut-label:text-primary/75 ut-label:text-sm ut-label:font-semibold ut-upload-icon:text-text/75 ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-util/50 ut-button:ut-uploading::after:bg-util ut-bar"
            endpoint="pdfUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              setFiles([...files, ...res]);
              toast({
                title: "✅ Upload Complete",
                description: `${res.length} file(s) uploaded successfully`,
              });
            }}
            onUploadError={(error) => {
              toast({
                variant: "destructive",
                title: "🚧 Error",
                description: error,
              });
            }}
          />
        </div>
      </div>

      <div className="file list flex flex-col py-2">
        {files &&
          files.map((file) => (
            <Link
              target="_blank"
              href={file.url}
              key={file.id}
              className="min-w-64 flex flex-col bg-primary/10 w-fit rounded-md px-4 py-2"
            >
              <span className="font-semibold">{file.name}</span>
            </Link>
          ))}
      </div>
      <div className="flex gap-1 text-center items-center justify-center">
        <span>Add </span>
        <span className="gap-1 flex font-medium text-primary/75">
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
          <span className="text-xs font-bold px-1 text-text/50">NAME</span>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="p-2 border border-border rounded text-white"
          />
        </div>
      )}

      <Button
        disabled={files.length === 0}
        onClick={createNewSubject}
        className="p-2 bg-primary/15 border-[1.5px] border-border text-text rounded hover:bg-primary/25 hover:text-text"
      >
        Create Note
      </Button>
    </div>
  );
};

export default UploadPage;
