"use client";
import { useEffect } from "react";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

const FolderFinder = ({
  selectedFolder,
  setSelectedFolder,
  folders,
  setSelectedFolderId,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedFolder || "");

  useEffect(() => {
    setValue(selectedFolder || "");
  }, [selectedFolder]);

  const handleSelect = (newValue) => {
    setValue(newValue);
    setSelectedFolder(newValue);
    setSelectedFolderId(
      folders.find((folder) => folder.value === newValue)?.id
    );
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!selectedSubjectId} className="bg-util">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:w-[200px] w-1/2 justify-between border-[1.5px] border-border hover:bg-util hover:text-text bg-util text-text"
          onClick={() => setOpen((prev) => !prev)}
        >
          {value
            ? folders.find((folder) => folder.value === value)?.label
            : "Select folder..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search folder..."
            onValueChange={(value) => setNewFolder(value)}
          />
          <CommandList>
            <CommandEmpty className="w-full px-3 py-2 flex flex-col gap-2">
              <span className="font-semibold text-sm"> No folder found</span>
            </CommandEmpty>
            <CommandGroup>
              {folders &&
                folders.map((folder) => (
                  <CommandItem
                    key={folder.value}
                    value={folder.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === folder.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {folder.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FolderFinder;
