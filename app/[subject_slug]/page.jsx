"use client";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { motion } from "framer-motion";
import Pin from "@/components/logo/Pin";
import Folder from "@/components/logo/Folder";
import { useFetchSubjects } from "@/data/subject";
import Error from "@/app/Error";
import { useFetchFolders } from "@/data/folder";
const page = ({ params }) => {
  const { data: subjects, isLoading, error } = useFetchSubjects();

  const formattedSubjects = subjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
  }));
  const subject_id =
    formattedSubjects &&
    formattedSubjects.find((subject) => subject.slug === params.subject_slug)
      ?.id;
  const subjectName =
    formattedSubjects &&
    formattedSubjects.find((subject) => subject.slug === params.subject_slug)
      ?.name;

  const { data: folders, error: folderError } = useFetchFolders(subject_id);
  const formattedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
    last_updated: folder.updated_at,
  }));
  // if the current subject is not found, return a 404 page
  if (
    !isLoading &&
    !formattedSubjects?.find((subject) => subject.slug === params.subject_slug)
  ) {
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
  if (!folders) {
    return (
      <div className="p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold capitalize">
          {/* replace all ash with spafe in subject id*/}
          {params.subject_slug.replace(/_/g, " ")}
        </h1>
        <span>
          <span className="uppercase text-sm font-semibold text-danger">
            No folders found
          </span>
        </span>
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
      <h1 className="text-2xl font-semibold">{subjectName}</h1>

      <ul className="flex flex-col gap-3">
        <motion.div
          className=""
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.3 }}
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
            className=""
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Link
              className="w-full flex gap-2 bg-util hover:bg-border transition-all items-center justify-between px-2 py-2 rounded-sm font-medium text-lg"
              href={`/${params.subject_slug}/${folder.slug}`}
              key={folder.id}
            >
              <div className="w-auto flex gap-2">
                <Folder dim={27} />
                <li key={folder.id}>{folder.name}</li>
              </div>

              <span className="text-sm text-textMuted px-2">
                Updated{" "}
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
