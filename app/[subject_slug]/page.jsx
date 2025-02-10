"use client";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { motion } from "framer-motion";
import Pin from "@/components/logo/Pin";
import Folder from "@/components/logo/Folder";
import { useFetchSubjects, useFetchArchivedSubjects } from "@/data/subject";
import Error from "@/app/Error";
import { useFetchFolders } from "@/data/folder";

const page = ({ params }) => {
  const { data: subjects, isLoading, error } = useFetchSubjects();
  const {
    data: archivedSubjects,
    archivedLoading,
    archivedError,
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

  // Check both regular and archived subjects for the current subject
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

  const {
    data: folders,
    isLoading: folderLoading,
    error: folderError,
  } = useFetchFolders(subject_id);

  const formattedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
    last_updated: folder.updated_at,
  }));

  // Check if subject exists in either regular or archived subjects
  if (!isLoading && !archivedLoading && !currentSubject) {
    return (
      <Error
        message={`The subject ${params.subject_slug.replace(
          /_/g,
          " "
        )} does not exist`}
      />
    );
  }

  // if no folders, return a message along with references
  if (!folders && !folderLoading && !isLoading) {
    return (
      <div className="p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold capitalize">
          {params.subject_slug.replace(/_/g, " ")}
        </h1>
        <div className="flex flex-col gap-2">
          {isArchived && (
            <span className="uppercase text-sm font-semibold text-warning">
              Archived Subject
            </span>
          )}
          <span className="uppercase text-sm font-semibold text-danger">
            No folders found
          </span>
        </div>
        <Link
          className="w-48 flex gap-2 bg-util hover:bg-border transition-all items-center justify-start px-2 py-2 rounded-sm font-medium text-lg"
          href={`/${params.subject_slug}/reference`}
        >
          <Pin dim={27} />
          <span>References</span>
        </Link>
      </div>
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
          className=""
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.175 }}
        >
          <Link
            className="w-full flex gap-2 bg-util hover:bg-border transition-all items-center justify-start px-2 py-2 rounded-sm font-medium text-lg"
            href={`/${params.subject_slug}/reference`}
          >
            <Pin dim={27} />
            <li>References</li>
          </Link>
        </motion.div>

        {formattedFolders?.map((folder) => (
          <motion.div
            key={folder.id}
            className=""
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Link
              className="w-full flex gap-2 bg-util hover:bg-border transition-all items-center justify-between px-2 py-2 rounded-sm font-medium text-lg"
              href={`/${params.subject_slug}/${folder.slug}`}
            >
              <div className="w-auto flex gap-2 capitalize">
                <Folder dim={27} />
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
        ))}
      </ul>
    </div>
  );
};

export default page;
