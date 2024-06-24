"use client";
import SubjectSelector from "./SubjectSelector";
import { useFetchSubjects, useCreateSubjectMutation } from "@/data/subject";
import { useState, useEffect } from "react";
const UploadPage = ({ session, user }) => {
  const { data, isLoading, isError, error } = useFetchSubjects();
  const transformedData =
    data &&
    data.map((item) => ({
      value: item.name.toLowerCase().replace(/\s/g, "-"),
      label: item.name,
    }));

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");

  // const createSubject = useCreateSubjectMutation();
  // function createNewSubject() {
  //   // console.log("creating reference", name, subject_id, type, url, user_id);
  //   createSubject.mutate({
  //     name: "Machine learning",
  //     created_by: user.id,
  //     description: "basic ml concepts",
  //   });
  // }
  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-white">Upload Page</h1>
      <SubjectSelector
        user={user}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        subjects={transformedData}
      />
      <span>{selectedSubject}</span>

      {/* btn to create subject */}
      {/* <button onClick={createNewSubject}>Create Subject</button> */}

      <span>{JSON.stringify(transformedData)}</span>
    </div>
  );
};

export default UploadPage;
