"use client";
import { formatDistance } from "date-fns";
import RVContainer from "@/components/RVContainer";
import React from "react";
import Time from "@/components/logo/Time";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Archive from "@/components/logo/Archive";
import { useFetchSubjects } from "@/data/subject";
import { useGetUserByEmail } from "@/data/user";
const page = () => {
  const { data: session, status } = useSession();
  const { data: subjects, error } = useFetchSubjects();
  const { data: user, error: userError } = useGetUserByEmail(
    session?.user?.email
  );

  const formattedSubjects = subjects
    ?.map((subject) => ({
      name: subject.name,
      slug: subject.name.toLowerCase().replace(/\s+/g, "-"),
      id: subject.id,
      last_updated: subject.updated_at,
    }))
    .sort((a, b) => {
      // Move the "Curriculum" subject to the front of the array
      if (a.name.toLowerCase() === "curriculum") return -1;
      if (b.name.toLowerCase() === "curriculum") return 1;
      return 0;
    });

  return (
    <div className="w-full h-full flex flex-col gap-5 p-4">
      <div className="w-full h-auto flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="flex flex-col gap-3 w-full h-auto">
          {formattedSubjects?.map((subject) => (
            <Link
              key={subject.id}
              href={`/${subject.slug}`}
              className="h-24 bg-util/50 hover:bg-border/50 transition-all ease-in-out duration-300 px-5 rounded-md shadow-md w-full flex items-center justify-between"
            >
              <div className="w-full flex flex-row justify-between items-center">
                <span className="text-xl font-semibold">{subject.name}</span>
                <span className="text-sm text-textMuted">
                  Updated{" "}
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

              <span className="text-sm text-textMuted">View</span>
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
          <div className="w-full h-fit flex flex-col sm:flex-row gap-2">
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
