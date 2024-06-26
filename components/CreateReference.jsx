"use client";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
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
  const { toast } = useToast();
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
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Please enter a title",
      });
      return;
    }
    if (!url) {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "Please enter a URL",
      });
      return;
    }
    if (user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "You do not have permission to add references",
      });
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
          toast({
            title: "✅ Success",
            description: "Reference added successfully",
          });
          setIsDialogOpen(false);
        },
      }
    );
  };

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
