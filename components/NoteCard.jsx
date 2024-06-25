import Doc from "./logo/Doc";
import Options from "./logo/Options";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteNoteMutation } from "@/data/notes";

const NoteCard = ({ id, name, url }) => {
  const deleteMutation = useDeleteNoteMutation();

  function deleteNote() {
    deleteMutation.mutate(id);
  }

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
    <div className="w-48 h-48 bg-secondary border-[1.5px] border-white/10 rounded-lg">
      <div className="h-auto w-full border-b-[1.5px] border-white/0 flex items-center justify-between px-4 py-1">
        {name}
        <DropdownMenu>
          <DropdownMenuTrigger className="hover:bg-white/5 rounded-full p-[1.75px] flex justify-end">
            <Options />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Editing {name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {/* link to open pdf in new tab */}
              <Link href={url} target="_blank">
                Open in browser
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={downloadPDF}>Download</DropdownMenuItem>
            <DropdownMenuItem
              onClick={deleteNote}
              className="hover:bg-red-500/50"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className=" w-full h-5/6 pb-5 px-3">
        <div className="bg-white/5 w-full text-white/50 h-full rounded-md flex items-center justify-center">
          <Doc />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
