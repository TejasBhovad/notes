import React from "react";
import Home from "./logo/Home";
import { searchSubjects, searchNotes, getSubjectName } from "@/src/queries";
import Link from "next/link";
import { CommandLoading } from "cmdk";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "./ui/button";
import Archive from "./logo/Archive";
const SearchBar = () => {
  const isMac =
    typeof window !== "undefined"
      ? navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
      : false;

  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  const [value, setValue] = React.useState("");

  // subject data
  const [subjectsData, setSubjectsData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // notes data
  const [notesData, setNotesData] = React.useState(null);
  const [loadingNotes, setLoadingNotes] = React.useState(false);

  // open the command dialog when cmd/ctrl + j is pressed
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // when enter is pressed, navigate to the selected subject
  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        console.log("Enter Pressed", value);
        // Check if value is / to go to home page
        if (value === "/") {
          router.push("/");
          setOpen(false);
        } else {
          const slug = value.replace(/\s+/g, "-").toLowerCase();
          // if starts with http, open in new tab
          if (value.startsWith("http")) {
            window.open(value, "_blank");
          } else {
            router.push(`/${slug}`);
          }
          setOpen(false);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [value]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Debounce time in milliseconds

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // main search function
  const handleSearch = (value) => {
    setLoading(true);
    setLoadingNotes(true);
    console.log("Search Operation", value);
    searchSubjects(value).then((data) => {
      setSubjectsData(data);
      setLoading(false);
    });
    searchNotes(value).then((data) => {
      setNotesData(data);
      setLoadingNotes(false);
    });
  };

  // log search term when it changes
  React.useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm === "") {
      // console.log("Empty Search");
    } else {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-start bg-base text-white/85 border-[1.5px] border-white/5 font-medium text-md rounded-md py-1 px-2 hover:bg-white/5 hover:text-white/100 transition-all duration-200 ease-in-out"
      >
        <p className="text-sm flex gap-1 sm:gap-2 text-white/85 ">
          Press
          <kbd className="hidden sm:flex pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white/10 text-white border-white/15 px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">
              {isMac && isMounted ? "⌘" : "Ctrl +"}
            </span>
            J
          </kbd>
          <span>to Search</span>
        </p>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} isMobile="true">
        <CommandInput
          placeholder="Type a command or search..."
          serach={searchTerm}
          setSearch={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>
            No results found.
            {/* map subjectData anin command input with name*/}
          </CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              className="flex items-end gap-1 h-10 w-full"
              onSelect={() => setValue("/")}
            >
              <Link
                href="/"
                className="w-full h-full flex gap-1 items-center"
                onClick={() => setOpen(false)}
              >
                <Home />
                <span className="w-full h-full flex items-center">Home</span>
              </Link>
            </CommandItem>
            <CommandItem
              className="flex items-end gap-1 h-10 w-full"
              onSelect={() => setValue("archived")}
            >
              <Link
                href="/archived"
                className="w-full h-full flex gap-1 items-center"
                onClick={() => setOpen(false)}
              >
                <Archive />
                <span className="w-full h-full flex items-center">
                  Archived Subjects
                </span>
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Subjects">
            {loading && <CommandLoading>Fetching Subjects...</CommandLoading>}
            {subjectsData &&
              subjectsData.map((subject) => (
                <CommandItem
                  key={`subject-${subject.name}`}
                  value={subject.name}
                  onSelect={() => setValue(subject.name)}
                >
                  <Link
                    href={`/${subject.name.replace(/\s+/g, "-").toLowerCase()}`}
                    className="w-full h-full flex gap-1 items-center"
                    onClick={() => setOpen(false)}
                  >
                    <span className="w-full h-full flex items-center">
                      {subject.name}
                    </span>
                  </Link>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Notes">
            {loadingNotes && <CommandLoading>Fetching Notes...</CommandLoading>}
            {notesData &&
              notesData.map((note) => (
                <CommandItem
                  key={`note-${note.id}`}
                  value={note.name}
                  onSelect={() => setValue(note.url)}
                >
                  <Link
                    href={`${note.url}`}
                    className="w-full h-full flex gap-1 items-center"
                    onClick={() => setOpen(false)}
                  >
                    <span className="w-full h-full flex items-center">
                      {note.name}
                    </span>
                  </Link>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchBar;
