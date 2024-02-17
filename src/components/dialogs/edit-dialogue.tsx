"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { SVGProps, use, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Eraser } from "lucide-react";
interface Props {
  id: string;
}
export function DialogDemo({ id }: Props) {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const { toast } = useToast();
  const handleUpdate = async () => {
    try {
      const res = await fetch("api/urls/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, originalUrl, shortUrl }),
      });
      const data = await res.json();
      if (res.status === 400) {
        toast({
          title: data.message,
          variant: "default",
        });
      }
      if (res.status === 200) {
        toast({
          title: "Updated Url",
          variant: "default",
        });
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast({
          title: error.message,
          variant: "destructive",
        });
      }
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <FileEditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit URL</DialogTitle>
          <DialogDescription>
            Make changes to your url here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Original URL
            </Label>
            <Input
              id="name"
              className="col-span-3"
              defaultValue="Youroriginalurl.com"
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Slug
            </Label>
            <Input
              id="url"
              className="col-span-3"
              defaultValue="Slug for your url"
              onChange={(e) => setShortUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
function FileEditIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
}
