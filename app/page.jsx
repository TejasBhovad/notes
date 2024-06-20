"use client";
import React from "react";
import Link from "next/link";
import { useMediaQuery } from "@/lib/media";
const page = () => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <div className="w-full h-full flex flex-col gap-2 p-4">
      <span className="font-semibold">Go to test</span>
      <Link
        href="/test"
        className="rounded-sm px-4 py-1 bg-slate-700 w-fit hover:scale-95 active:scale-100 transition-transform duration-75 ease-in-out"
      >
        <span>test</span>
      </Link>
      <span>
        {isSmallScreen ? "This is a small screen" : "This is a big screen"}
      </span>
    </div>
  );
};

export default page;
