"use client";
import Error from "@/app/Error";
import { useState, useEffect } from "react";
import CreateReferences from "@/components/CreateReference";
import LinkContainer from "@/components/LinkContainer";
import ReferenceContainer from "@/components/ReferenceContainer";
import { useFetchSubjects } from "@/data/subject";
import { useFetchReferences } from "@/data/reference";
import { getUserByEmail } from "@/src/queries";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
const page = ({ params }) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [email, setEmail] = useState(session?.user?.email);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);
  useEffect(() => {
    if (email) {
      getUserByEmail(email).then((res) => {
        setUser(res[0]);
      });
    }
  }, [email]);
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
      ?.id;

  const {
    data: references,
    isLoading,
    error: referenceError,
  } = useFetchReferences(subject_id);

  const videoReferences = references?.filter(
    (reference) => reference.type === "video"
  );
  const linkReferences = references?.filter(
    (reference) => reference.type === "link"
  );
  // if the current subject is not found, return a 404 page
  if (
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
  // if no references, return a message
  if (!references) {
    return (
      <div className="p-4 flex flex-col gap-6">
        <span>
          <h1 className="text-3xl font-semibold">References</h1>
          <span className="uppercase text-sm font-semibold text-textMuted">
            {subjectName.replace(/-/g, " ")}
          </span>
          <span>
            <h2 className="text-md font-regular text-danger py-2">
              No references found
            </h2>
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6 h-[85vh] overflow-y-auto">
      {formattedSubjects && (
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold">References</h1>
          <span className="uppercase text-sm font-semibold text-textMuted">
            {subjectName.replace(/-/g, " ")}
          </span>
        </div>
      )}
      {user?.role === "admin" && subject_id && (
        <CreateReferences
          subject_id={subject_id}
          subjectName={subjectName}
          user_id={user?.id}
          user={user}
        />
      )}
      {videoReferences && (
        <div className="w-full flex flex-wrap gap-4">
          {videoReferences && (
            <h2 className="text-2xl font-semibold px-2">Video References</h2>
          )}
          <div className="w-full gap-2 flex flex-wrap">
            {videoReferences.map((reference) => (
              <ReferenceContainer
                id={reference.id}
                key={reference.id}
                name={reference.name}
                url={reference.url}
                role={user?.role}
                type={reference.type}
              />
            ))}
          </div>
        </div>
      )}
      {linkReferences && (
        <div className="w-full flex flex-col gap-4">
          {linkReferences && (
            <h2 className="text-2xl font-semibold px-2">Link References</h2>
          )}
          <div className="w-full gap-2 flex flex-wrap">
            {linkReferences.map((reference) => (
              <LinkContainer
                id={reference.id}
                key={reference.id}
                name={reference.name}
                url={reference.url}
                role={user?.role}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
