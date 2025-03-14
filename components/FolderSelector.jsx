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
  const [searchQuery, setSearchQuery] = React.useState("");

  // Debug logging
  useEffect(() => {
    console.log("FolderSelector received folders:", folders);
    console.log("Selected subject ID:", selectedSubjectId);
  }, [folders, selectedSubjectId]);

  // Update value when selectedFolder changes from parent
  useEffect(() => {
    setValue(selectedFolder || "");
  }, [selectedFolder]);

  // Ensure folders is always an array
  const safeFolders = Array.isArray(folders) ? folders : [];

  // Handle folder selection
  const handleSelect = (newValue) => {
    console.log("Folder selected:", newValue);
    setValue(newValue);
    setSelectedFolder(newValue);

    // Find the folder with the matching value
    const selectedFolderObj = safeFolders.find(
      (folder) => folder.value === newValue
    );
    console.log("Found folder:", selectedFolderObj);

    if (selectedFolderObj) {
      setSelectedFolderId(selectedFolderObj.id);
    } else {
      console.warn("Selected folder not found in folders array");
    }
    setOpen(false);
  };

  // Create a new folder
  const createFolder = useCreateFolderMutation();

  function createNewFolder() {
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
        description: "Folder name is required",
      });
      return;
    }

    console.log("Creating folder:", {
      name: newFolder,
      subject_id: selectedSubjectId,
      user_id: user.id,
    });

    createFolder.mutate(
      {
        name: newFolder,
        subject_id: selectedSubjectId,
        user_id: user.id,
      },
      {
        onSuccess: (data) => {
          console.log("Folder created successfully:", data);
          toast({
            title: "✅ Success",
            description: "Folder created successfully",
          });

          // Clear input field
          setNewFolder("");

          // Note: You might need to refresh the folders list here
          // This depends on how your React Query cache is set up
        },
        onError: (error) => {
          console.error("Error creating folder:", error);
          toast({
            variant: "destructive",
            title: "🚧 Error",
            description: error.message || "Failed to create folder",
          });
        },
      }
    );
  }

  // Fix: Separate the button click from the Popover trigger
  const handleButtonClick = (e) => {
    if (!selectedSubjectId) {
      toast({
        variant: "destructive",
        title: "🚧 Select Subject",
        description: "Please select a subject before choosing a folder",
      });
      return;
    }

    e.preventDefault(); // Prevent default behavior
    setOpen(!open);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={!selectedSubjectId}
          className={`md:w-[200px] w-1/2 justify-between border-[1.5px] border-border hover:bg-util hover:text-text ${
            !selectedSubjectId ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleButtonClick}
        >
          {value && safeFolders.length > 0
            ? safeFolders.find((folder) => folder.value === value)?.label ||
              "Select folder..."
            : "Select folder..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-50">
        <Command>
          <CommandInput
            placeholder="Search folder..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            autoFocus={true}
          />
          <CommandList>
            <CommandEmpty className="w-full px-3 py-2 flex flex-col gap-2">
              <span className="font-semibold text-sm">Add a new folder</span>
              <Input
                placeholder="Type a new folder..."
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
              />
              <Button
                onClick={createNewFolder}
                className="w-full bg-primary/30 hover:bg-primary/40 text-text hover:text-text/90"
              >
                Add
              </Button>
            </CommandEmpty>
            <CommandGroup heading="Available folders">
              {safeFolders && safeFolders.length > 0 ? (
                safeFolders
                  .filter(
                    (folder) =>
                      !searchQuery ||
                      folder.label
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((folder) => (
                    <CommandItem
                      key={folder.value}
                      value={folder.value}
                      onSelect={handleSelect}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === folder.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {folder.label}
                    </CommandItem>
                  ))
              ) : (
                <CommandItem disabled>
                  {selectedSubjectId
                    ? "No folders available"
                    : "Select a subject first"}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FolderSelector;
