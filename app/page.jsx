"use client";
import React, { useContext, useMemo } from "react";
import { formatDistance } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Time from "@/components/logo/Time";
import Archive from "@/components/logo/Archive";
import RVContainer from "@/components/RVContainer";
import { NotesContext } from "@/providers/NotesContext";
import { useGetUserByEmail } from "@/data/user";

const SubjectSkeleton = () => (
  <div className="h-24 bg-util animate-pulse px-5 rounded-md shadow-md w-full flex items-center">
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
      <div className="h-6 bg-border/50 rounded w-48"></div>
      <div className="h-4 bg-border/50 rounded w-32"></div>
    </div>
  </div>
);

const RecentlyViewedSkeleton = () => (
  <div className="w-full h-20 bg-util animate-pulse rounded-md"></div>
);

const SubjectsPage = () => {
  const { data: notes, isLoading: notesLoading } = useContext(NotesContext);
  const { data: session, status: sessionStatus } = useSession();
  const { data: user, isLoading: userLoading } = useGetUserByEmail(
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
      if (a.name.toLowerCase() === "curriculum") return -1;
      if (b.name.toLowerCase() === "curriculum") return 1;
      return 0;
    });

  const MemoizedArchive = useMemo(() => <Archive dim={27} />, []);
  const MemoizedTime = useMemo(() => <Time dim={27} />, []);

  return (
    <div className="w-full h-[85vh] overflow-y-auto flex flex-col gap-8 p-4">
      <div className="w-full h-auto flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="flex flex-col gap-3 w-full h-auto">
          {notesLoading ? (
            <>
              <SubjectSkeleton />
              <SubjectSkeleton />
              <SubjectSkeleton />
            </>
          ) : (
            <>
              {formattedSubjects?.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/${subject.slug}`}
                  className="h-24 bg-util hover:bg-border/75 transition-all  ease-in-out duration-150 px-5 rounded-md shadow-md w-full flex items-center justify-between"
                >
                  <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <span className="text-xl font-semibold">
                      {subject.name}
                    </span>
                    <span className="flex sm:hidden text-sm gap-1 text-textMuted">
                      <span>Updated </span>
                      {formatDistance(
                        new Date(subject.last_updated),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                    <span className="text-xs text-textMuted capitalize gap-1 hidden sm:flex">
                      <span>Updated </span>
                      {formatDistance(
                        new Date(subject.last_updated),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                </Link>
              ))}
              <Link
                href="/archived"
                className="h-24 bg-util hover:bg-border transition-all ease-in-out duration-300 px-5 rounded-md shadow-md w-full flex items-center justify-between"
              >
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex gap-2 items-center text-text">
                    {MemoizedArchive}
                    <span className="text-xl font-semibold text-text">
                      Archived Subjects
                    </span>
                  </div>
                  <span className="text-sm text-textMuted hidden sm:flex">
                    View
                  </span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="w-full h-auto flex flex-col gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-1">
          {MemoizedTime}
          Recently Viewed
        </h1>
        {sessionStatus === "loading" || userLoading ? (
          <RecentlyViewedSkeleton />
        ) : session && user ? (
          <div className="w-full h-fit flex flex-col sm:flex-row gap-2 truncate">
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
        ) : (
          <div className="text-textMuted">Sign in to view Recently viewed</div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
