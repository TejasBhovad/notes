"use client";
import React from "react";
import { useFetchSubjects } from "@/data/subject";
import { useFetchReferences } from "@/data/reference";
const page = ({ params }) => {
  const subjectName = params.subject_slug;
  const { data: subjects, error } = useFetchSubjects();
  const formattedSubjects = subjects?.map((subject) => ({
    name: subject.name,
    slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
    id: subject.id,
  }));
  const subject_id =
    formattedSubjects &&
    formattedSubjects.find((subject) => subject.slug === params.subject_slug)
      .id;

  const { data: references, error: referenceError } =
    useFetchReferences(subject_id);
  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold">References</h1>
        <span className="uppercase text-sm font-semibold text-white/50">
          {subjectName.replace(/-/g, " ")}
        </span>
      </div>
      <span>{JSON.stringify(references)}</span>
    </div>
  );
};

export default page;
