"use client";
import { useEffect } from "react";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SubjectFinder = ({
  setSelectedSubject,
  selectedSubject,
  setSelectedSubjectId,
  subjects,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedSubject || "");

  useEffect(() => {
    setValue(selectedSubject || "");
  }, [selectedSubject]);

  const handleSelect = (newValue) => {
    setValue(newValue);
    setSelectedSubject(newValue);
    setSelectedSubjectId(
      subjects.find((subject) => subject.value === newValue)?.id
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:w-auto w-1/2 overflow-hidden truncate justify-between border-[1.5px] border-border hover:bg-util hover:text-text"
          onClick={() => setOpen((prev) => !prev)}
        >
          {value
            ? subjects.find((subject) => subject.value === value)?.label
            : "Select subject..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search subject..." />
          <CommandList>
            <CommandEmpty className="w-full px-3 py-2 flex flex-col gap-2">
              <span className="font-semibold text-sm">No subject found</span>
            </CommandEmpty>
            <CommandGroup>
              {subjects &&
                subjects.map((subject) => (
                  <CommandItem
                    key={subject.value}
                    value={subject.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === subject.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {subject.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SubjectFinder;
