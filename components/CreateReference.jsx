"use client";
import { useState } from "react";
import { useCreateReferenceMutation } from "@/data/reference";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const CreateReference = ({ subject_id, subjectName, user_id, user }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createNewReference = useCreateReferenceMutation();

  const isYouTubeVideo = (url) => {
    const regex =
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  const getYouTubeVideoId = (url) => {
    const regex =
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }
    if (!url) {
      alert("Please enter a url");
      return;
    }
    if (user.role !== "admin") {
      alert("You do not have permission to add references");
      return;
    }
    let referenceType = isYouTubeVideo(url) ? "video" : "link";
    createNewReference.mutate(
      {
        name: title,
        url: url,
        type: referenceType,
        user_id: user.id,
        subject_id: subject_id,
      },
      {
        onSuccess: () => {
          setTitle("");
          setUrl("");
          alert("Reference added successfully");
          setIsDialogOpen(false);
        },
      }
    );
  };
  //   createfolder.mutate(
  // {
  //     name: newFolder,
  //     subject_id: selectedSubjectId,
  //     user_id: user.id,
  //   },
  //   {
  //     onSuccess: () => {
  //       // find new folder from folders and set it as selected
  //       const newFolder = folders.find(
  //         (folder) => folder.value === newFolder
  //       );
  //       if (newFolder) {
  //         setValue(newFolder.value);
  //         setSelectedFolder(newFolder.value);
  //         setSelectedFolderId(newFolder.id);
  //       }
  //       setNewFolder("");
  //       toast({
  //         title: "✅ Success",
  //         description: "Folder created successfully",
  //       });
  //     },
  //   }
  // );
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}
    >
      <DialogTrigger className="py-4 rounded-md border-2 border-white/15 bg-white/5">
        Add reference
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            Adding reference in{" "}
            <span className="capitalize text-md font-semibold text-primary/80">
              {subjectName.replace(/-/g, " ")}
            </span>
          </DialogTitle>
          <DialogDescription>
            References are urls to videos or links to educational content
          </DialogDescription>
        </DialogHeader>
        <Input
          label="Title"
          placeholder="Title of the reference"
          className="w-full border-white/15"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="URL"
          placeholder="URL of the reference"
          className="w-full border-white/15"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {isYouTubeVideo(url) && (
          <div className="aspect-video rounded-md overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              style={{ maxWidth: "560px", maxHeight: "315px" }}
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary/30 hover:bg-primary/50"
        >
          Add reference
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReference;
