"use client";
import { formatDistance } from "date-fns";
import RVContainer from "@/components/RVContainer";
import React from "react";
import Time from "@/components/logo/Time";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Archive from "@/components/logo/Archive";
import { useGetUserByEmail } from "@/data/user";
import { NotesContext } from "@/providers/NotesContext";
import { useContext } from "react";

const page = () => {
  const { data: notes, isLoading, isError, error } = useContext(NotesContext);

  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>Error: {error.message}</div>;

  const { data: session, status } = useSession();
  const { data: user, error: userError } = useGetUserByEmail(
    session?.user?.email
  );

  const formattedSubjects = notes
    ?.map((subject) => ({
      name: subject.subject.name,
      slug: subject.subject.name.toLowerCase().replace(/\s+/g, "-"),
      id: subject.subject.id,
      last_updated: subject.subject.updated_at,
    }))
    .sort((a, b) => {
      // Move the "Curriculum" subject to the front of the array
      if (a.name.toLowerCase() === "curriculum") return -1;
      if (b.name.toLowerCase() === "curriculum") return 1;
      return 0;
    });
  return (
    <div className="w-full h-[85vh] overflow-y-auto flex flex-col gap-8 p-4">
      <div className="w-full h-auto flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="flex flex-col gap-3 w-full h-auto">
          {formattedSubjects?.map((subject) => (
            <Link
              key={subject.id}
              href={`/${subject.slug}`}
              className="h-24 bg-util hover:bg-border/75 transition-all ease-in-out duration-150 px-5 rounded-md shadow-md w-full flex items-center justify-between"
            >
              <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                <span className="text-xl font-semibold ">{subject.name}</span>
                <span className="flex sm:hidden text-sm gap-1 text-textMuted">
                  <span className="">Updated </span>
                  {formatDistance(new Date(subject.last_updated), new Date(), {
                    addSuffix: true,
                  })}
                </span>
                <span className="text-xs text-textMuted capitalize gap-1 hidden sm:flex">
                  <span className="">Updated </span>
                  {formatDistance(new Date(subject.last_updated), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </Link>
          ))}
          <Link
            href={`/archived`}
            className="h-24 bg-util hover:bg-border transition-all ease-in-out duration-300 px-5 rounded-md shadow-md w-full flex items-center justify-between"
          >
            <div className="w-full flex flex-row justify-between items-center">
              <div className="flex gap-2 items-center text-text">
                <Archive dim={27} />
                <span className="text-xl font-semibold text-text">
                  Archived Subjects
                </span>
              </div>

              <span className="text-sm text-textMuted hidden sm:flex">
                View
              </span>
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-1">
          <Time dim={27} />
          Recently Viewed
        </h1>
        {session && user && (
          <div className="w-full h-fit flex flex-col sm:flex-row gap-2 truncate">
            {/* {JSON.stringify(user[0].recently_viewed)} */}
            {/* map over ecently viewed */}
            {user[0].recently_viewed.map((item) => (
              <RVContainer
                key={item.url}
                type={item.type}
                url={item.url}
                name={item.name}
                last_viewed={item.last_viewed}
              />
            ))}
          </div>
        )}
        {!session && status !== "loading" && (
          <div className="">Sign in to view Recently viewed</div>
        )}
      </div>
    </div>
  );
};

export default page;
