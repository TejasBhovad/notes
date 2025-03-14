"use client";

import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useCreateSubjectMutation } from "@/data/subject";
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

const SubjectSelector = ({
  setSelectedSubject,
  selectedSubject,
  selectedSubjectId,
  setSelectedSubjectId,
  subjects,
  user,
  user_id,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedSubject || "");
  const [newSubject, setNewSubject] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Update value when selectedSubject changes from parent
  useEffect(() => {
    setValue(selectedSubject || "");
  }, [selectedSubject]);

  // Ensure subjects is always an array
  const safeSubjects = Array.isArray(subjects) ? subjects : [];

  // Handle selection of a subject
  const handleSelect = (newValue) => {
    // console.log("Subject selected:", newValue);
    setValue(newValue);
    setSelectedSubject(newValue);

    // Find the subject with the matching value
    const selectedSubjectObj = safeSubjects.find(
      (subject) => subject.value === newValue
    );
    // console.log("Found subject:", selectedSubjectObj);

    if (selectedSubjectObj) {
      setSelectedSubjectId(selectedSubjectObj.id);
    } else {
      console.warn("Selected subject not found in subjects array");
    }
    setOpen(false);
  };

  // Create a new subject
  const createSubject = useCreateSubjectMutation();
  function createNewSubject() {
    if (user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Only administrators can create new subjects",
      });
      return;
    }
    if (!newSubject) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Subject name is required",
      });
      return;
    }
    if (!newDescription) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Subject description is required",
      });
      return;
    }

    console.log("Creating new subject:", {
      name: newSubject,
      created_by: user_id,
      description: newDescription,
    });

    createSubject.mutate(
      {
        name: newSubject,
        created_by: user_id,
        description: newDescription,
      },
      {
        onSuccess: (data) => {
          console.log("Subject created successfully:", data);
          toast({
            title: "✅ Success",
            description: "Subject created successfully",
          });

          // After successful creation, we should find the new subject in the updated list
          // But for now, we can use the created subject directly
          setNewSubject("");
          setNewDescription("");

          // Note: You'll need to refresh the subjects list after creating a new subject
          // This is typically handled by invalidating the React Query cache in the parent component
        },
        onError: (error) => {
          console.error("Error creating subject:", error);
          toast({
            variant: "destructive",
            title: "🚧 Error",
            description: error.message || "Failed to create subject",
          });
        },
      }
    );
  }

  // Fix: Separate the button click from the Popover trigger
  const handleButtonClick = (e) => {
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
          className="md:w-[200px] w-1/2 justify-between border-[1.5px] border-border hover:bg-util hover:text-text"
          onClick={handleButtonClick}
        >
          {value && safeSubjects.length > 0
            ? safeSubjects.find((subject) => subject.value === value)?.label ||
              "Select subject..."
            : "Select subject..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-50">
        {" "}
        {/* Added higher z-index */}
        <Command>
          <CommandInput
            placeholder="Search subject..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            autoFocus={true} // Add autofocus to improve usability
          />
          <CommandList>
            {/* Simplified CommandEmpty condition */}
            <CommandEmpty className="w-full px-3 py-2 flex flex-col gap-2">
              <span className="font-semibold text-sm">Add a new subject</span>
              <Input
                placeholder="Type a new subject..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
              <Input
                placeholder="Type a description..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <Button
                onClick={createNewSubject}
                className="w-full bg-primary/30 hover:bg-primary/40 text-text hover:text-text/90"
              >
                Add
              </Button>
            </CommandEmpty>

            <CommandGroup heading="Available subjects">
              {safeSubjects && safeSubjects.length > 0 ? (
                safeSubjects
                  .filter(
                    (subject) =>
                      !searchQuery ||
                      subject.label
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .map((subject) => (
                    <CommandItem
                      key={subject.value}
                      value={subject.value}
                      onSelect={handleSelect}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === subject.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {subject.label}
                    </CommandItem>
                  ))
              ) : (
                <CommandItem disabled>No subjects available</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SubjectSelector;
