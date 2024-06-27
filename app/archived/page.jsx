"use client";
import React from "react";
import Link from "next/link";
import { useFetchArchivedSubjects } from "@/data/subject";
const page = () => {
  const { data: subjects, error } = useFetchArchivedSubjects();
  const formattedSubjects = subjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
  }));
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Archived Subjects</h1>
      <div className="flex flex-col gap-2 w-full h-full">
        {formattedSubjects?.map((subject) => (
          <Link
            key={subject.id}
            href={`/${subject.slug}`}
            className="h-24 bg-white/5 hover:bg-white/10 transition-all ease-in-out duration-300 px-5 rounded-md shadow-md w-full flex items-center justify-between"
          >
            <div className="w-full flex flex-row justify-between items-center">
              <span className="text-xl font-semibold">{subject.name}</span>
              <span className="text-sm text-gray-500">View</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
