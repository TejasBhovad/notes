"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const PageSelector = () => {
  const router = useRouter();

  const [page, setPage] = useState("explore");
  // //   based on page push to different pages
  // useEffect(() => {
  //   if (page === "explore") {
  //     router.push("/");
  //   } else if (page === "archived") {
  //     router.push("/archived");
  //   } else if (page === "upload") {
  //     router.push("/upload");
  //   }
  // }, [page]);
  function handlePageChange(page) {
    setPage(page);
    if (page === "explore") {
      router.push("/");
    } else if (page === "archived") {
      router.push("/archived");
    } else if (page === "upload") {
      router.push("/upload");
    }
  }

  return (
    <Select
      className="bg-secondary"
      onValueChange={handlePageChange}
      defaultValue="explore"
      placeholder="Explore"
    >
      <SelectTrigger className="w-32 bg-secondary border-[1.5px] border-white/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="explore">Explore</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
        <SelectItem value="upload">Upload</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PageSelector;
