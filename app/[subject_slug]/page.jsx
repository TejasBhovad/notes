"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Pin from "@/components/logo/Pin";
import Folder from "@/components/logo/Folder";
import { useFetchSubjects } from "@/data/subject";
import { useFetchFolders } from "@/data/folder";
const page = ({ params }) => {
  const { data: subjects, error } = useFetchSubjects();
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
  }));

  // if no folders, return a message along with references
  if (!folders) {
    return (
      <div className="p-4 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold capitalize">
          {/* replace all ash with spafe in subject id*/}
          {params.subject_slug.replace(/_/g, " ")}
        </h1>
        <span>
          <span className="uppercase text-sm font-semibold text-white/50">
            No folders found
          </span>
        </span>
        <Link
          className="w-48 flex gap-2 bg-white/5 hover:bg-white/10 transition-all items-center justify-start px-2 py-2 rounded-sm font-medium text-lg"
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
            className="w-48 flex gap-2 bg-white/5 hover:bg-white/10 transition-all items-center justify-start px-2 py-2 rounded-sm font-medium text-lg"
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
              className="w-48 flex gap-2 bg-white/5 hover:bg-white/10 transition-all items-center justify-start px-2 py-2 rounded-sm font-medium text-lg"
              href={`/${params.subject_slug}/${folder.slug}`}
              key={folder.id}
            >
              <Folder dim={27} />
              <li key={folder.id}>{folder.name}</li>
            </Link>{" "}
          </motion.div>
        ))}
      </ul>
    </div>
  );
};

export default page;
