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

  const createSubject = useCreateSubjectMutation();
  function createNewSubject() {
    if (user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Friday, February 10, 2023 at 5:57 PM",
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
    createSubject.mutate(
      {
        name: newSubject,
        created_by: user_id,
        description: newDescription,
      },
      {
        onSuccess: () => {
          const newSubject = subjects.find(
            (subject) => subject.value === newSubject
          );
          if (newSubject) {
            setValue(newSubject.value);
            setSelectedSubject(newSubject.value);
            setSelectedSubjectId(newSubject.id);
          }
          toast({
            title: "✅ Success",
            description: "Subject created successfully",
          });
          setNewSubject("");
          setNewDescription("");
        },
      }
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="md:w-[200px] w-1/2 justify-between border-[1.5px] border-border hover:bg-util hover:text-text"
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
          <CommandInput
            placeholder="Search subject..."
            onValueChange={(value) => setNewSubject(value)}
          />
          <CommandList>
            <CommandEmpty className="w-full px-3 py-2 flex flex-col gap-2">
              <span className="font-semibold text-sm"> Add a new subject</span>
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

export default SubjectSelector;
