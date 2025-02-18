"use client";
import { useEffect } from "react";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useCreateFolderMutation } from "@/data/folder";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
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

const FolderSelector = ({
  user,
  user_id,
  selectedFolder,
  setSelectedFolder,
  folders,
  selectedSubjectId,
  setSelectedFolderId,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedFolder || "");
  const [newFolder, setNewFolder] = React.useState("");

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

  const createfolder = useCreateFolderMutation();
  function createnewFolder() {
    if (!selectedSubjectId) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Please select a subject first",
      });
      return;
    }
    if (user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "You are not authorized to create a new folder",
      });
      return;
    }
    if (!newFolder) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "folder name is required",
      });
      return;
    }
    // console.log("creating folder", newFolder, selectedSubjectId, user_id);
    createfolder.mutate(
      {
        name: newFolder,
        subject_id: selectedSubjectId,
        user_id: user.id,
      },
      {
        onSuccess: () => {
          // find new folder from folders and set it as selected
          const newFolder = folders.find(
            (folder) => folder.value === newFolder
          );
          if (newFolder) {
            setValue(newFolder.value);
            setSelectedFolder(newFolder.value);
            setSelectedFolderId(newFolder.id);
          }
          setNewFolder("");
          toast({
            title: "✅ Success",
            description: "Folder created successfully",
          });
        },
      }
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={!selectedSubjectId}>
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
              <span className="font-semibold text-sm"> Add a new folder</span>
              <Input
                placeholder="Type a new folder..."
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
              />
              <Button
                onClick={createnewFolder}
                className="w-full bg-primary/30 hover:bg-primary/40 text-text hover:text-text/90"
              >
                Add
              </Button>
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

export default FolderSelector;
