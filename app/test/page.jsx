"use client";
import { useToast } from "@/components/ui/use-toast";
import { Description } from "@radix-ui/react-dialog";
const page = () => {
  const { toast } = useToast();

  function clickToast() {
    toast({
      variant: "destructive",
      title: "Success",
      description: "This is a success message",
    });
  }
  return (
    <div>
      <button className="bg-green-500 px-2 py-1 w-auto" onClick={clickToast}>
        Click me
      </button>
    </div>
  );
};
export default page;
