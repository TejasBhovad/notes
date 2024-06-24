"use client";
import { useQueryClient } from "@tanstack/react-query";
import SubjectSelector from "./SubjectSelector";
import FolderSelector from "./FolderSelector";
import { useFetchSubjects } from "@/data/subject";
import { useFetchFolders } from "@/data/folder";
import { useState, useEffect } from "react";

const UploadPage = ({ session, user }) => {
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (selectedSubjectId) {
      queryClient.invalidateQueries(["folders", selectedSubjectId]);
    }
  }, [selectedSubjectId]);

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-white">Upload Page</h1>
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
      <span>{selectedSubjectId}</span>
      <span>{selectedFolderId}</span>

      {/* btn to create subject
      <button onClick={createNewFolder}>Create Folder</button> */}

      <span>{JSON.stringify(transformedFoldersData)}</span>
    </div>
  );
};

export default UploadPage;
