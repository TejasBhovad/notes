"use client";
import Doc from "./logo/Doc";
import Options from "./logo/Options";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { deleteFiles } from "@/src/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import { useDeleteNoteMutation } from "@/data/notes";

const NoteCard = ({ id, name, url }) => {
  const { toast } = useToast();
  const deleteMutation = useDeleteNoteMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function deleteNote() {
    if (!url) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "No file found to delete",
      });
    }

    deleteFiles(url);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "✅ Note deleted",
          description: "The note has been successfully deleted",
        });
      },
    });
  }

  const clickDelete = (event) => {
    event.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  function downloadPDF() {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  }

  return (
    <div className="w-48 h-auto pb-4 pt-2 bg-secondary border-[1.5px] border-border rounded-lg">
      <div className="h-auto w-full border-b-[1.5px] border-white/0 flex items-center justify-between px-4 py-2">
        <span className="w-full h-auto text-nowrap overflow-x-auto">
          {name}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-util rounded-full p-[1.75px] flex justify-end">
            <Options />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-secondary border-[1.5px] border-border rounded-lg">
            <DropdownMenuLabel>Editing {name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-util cursor-pointer">
              <Link href={url} target="_blank">
                Open in browser
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={downloadPDF}
              className="hover:bg-util cursor-pointer"
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={clickDelete}
              className="hover:bg-util cursor-pointer"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" w-full h-5/6 pb-5 px-3">
        <div className="bg-util w-full text-text/50 h-full rounded-md flex items-center justify-center">
          <Doc />
        </div>
      </div>

      {isDeleteDialogOpen && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                file named {name}. Are you sure you want to delete this file?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-border">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={deleteNote} className="bg-primary/50">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default NoteCard;
