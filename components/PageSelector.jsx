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
import ThemeSwitcher from "./ThemeSwitcher";
const PageSelector = () => {
  const router = useRouter();

  const [page, setPage] = useState("explore");
  function handlePageChange(page) {
    setPage(page);
    if (page === "explore") {
      router.push("/");
    } else if (page === "archived") {
      router.push("/archived");
    } else if (page === "upload") {
      router.push("/upload");
    } else if (page === "docs") {
      router.push("https://tejasbhovad.github.io/docs/");
    }
  }

  return (
    <Select
      className="bg-secondary"
      onValueChange={handlePageChange}
      defaultValue="explore"
      placeholder="Explore"
    >
      <SelectTrigger className="w-32 bg-secondary border-[1.5px] border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="explore">Explore</SelectItem>
        <SelectItem value="archived">Archived</SelectItem>
        <SelectItem value="docs">&lt;docs&gt;</SelectItem>
        <ThemeSwitcher isMobile={true} />
      </SelectContent>
    </Select>
  );
};

export default PageSelector;
