"use client";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { motion } from "framer-motion";
import { Pin, Folder } from "lucide-react";
import { useFetchSubjects, useFetchArchivedSubjects } from "@/data/subject";
import Error from "@/app/Error";
import { useFetchFolders } from "@/data/folder";

const LoadingFolder = () => (
  <div className="w-full flex gap-2 bg-util/50 animate-pulse items-center justify-between px-2 py-2 rounded-sm h-[44px]">
    <div className="w-auto flex gap-2 h-full items-center">
      <div className="w-5 h-5 bg-text/10 rounded" />
      <div className="w-32 h-5 bg-text/10 rounded" />
    </div>
    <div className="w-24 h-3 bg-text/10 rounded" />
  </div>
);

const SubjectPage = ({ params }) => {
  const { data: subjects, isLoading: subjectsLoading } = useFetchSubjects();
  const { data: archivedSubjects, isLoading: archivedLoading } =
    useFetchArchivedSubjects();

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

  const currentSubject =
    formattedSubjects?.find(
      (subject) => subject.slug === params.subject_slug
    ) ||
    formattedArchivedSubjects?.find(
      (subject) => subject.slug === params.subject_slug
    );

  const subject_id = currentSubject?.id;
  const subjectName = currentSubject?.name;
  const isArchived = currentSubject?.isArchived;

  const { data: folders, isLoading: folderLoading } =
    useFetchFolders(subject_id);

  const formattedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
    last_updated: folder.updated_at,
  }));

  if (subjectsLoading || archivedLoading) {
    return (
      <div className="p-4 flex flex-col gap-6">
        <div className="w-48 h-8 bg-util/50 animate-pulse rounded-sm" />
        <div className="flex flex-col gap-3">
          <div className="w-full h-[44px] bg-util/50 animate-pulse rounded-sm" />
          {[1, 2, 3].map((i) => (
            <LoadingFolder key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Check if subject exists
  if (!currentSubject) {
    return (
      <Error
        message={`The subject ${params.subject_slug.replace(
          /_/g,
          " "
        )} does not exist`}
      />
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{subjectName}</h1>
        {isArchived && (
          <span className="uppercase text-sm font-semibold text-warning">
            Archived Subject
          </span>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            className="w-full flex gap-2 bg-util hover:bg-border transition-all items-center justify-start px-2 py-2 rounded-sm font-medium text-lg"
            href={`/${params.subject_slug}/reference`}
          >
            <Pin
              size={20}
              className="text-text hover:text-text/100 transition-all duration-200"
              fill="currentColor"
            />
            <li>References</li>
          </Link>
        </motion.div>

        {folderLoading ? (
          [1, 2, 3].map((i) => <LoadingFolder key={`folder-loading-${i}`} />)
        ) : folders?.length === 0 ? (
          <span className="uppercase text-sm font-semibold text-danger">
            No folders found
          </span>
        ) : (
          formattedFolders?.map((folder, index) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Link
                className="w-full flex gap-2 bg-util hover:bg-border transition-all items-center justify-between px-2 py-2 rounded-sm font-medium text-lg"
                href={`/${params.subject_slug}/${folder.slug}`}
              >
                <div className="w-auto flex gap-2 h-full items-center capitalize">
                  <Folder
                    size={20}
                    className="text-text/85"
                    fill="currentColor"
                  />
                  <li>{folder.name}</li>
                </div>
                <span className="text-xs text-textMuted px-2 capitalize flex gap-1">
                  <span className="hidden sm:flex">Updated </span>
                  {formatDistance(new Date(folder.last_updated), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </Link>
            </motion.div>
          ))
        )}
      </ul>
    </div>
  );
};

export default SubjectPage;
