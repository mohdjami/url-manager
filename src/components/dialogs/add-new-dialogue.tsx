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
import { fetchUrl } from "@/lib/fetchUrl";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { Icons } from "../Icons";

export function AddNewUrl() {
  const [url, setUrl] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const { toast } = useToast();

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await fetchUrl(url, code);
      const data = await res.json();
      setCode(data.code);
      if (!res.ok) {
        setLoading(false);
        toast({ title: data.error, variant: "destructive" });
      } else {
        toast({ title: "Shortened URL has been created", variant: "default" });
        setUrl("");
        setCode("");
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (!session) {
        toast({
          title: "You must be signed in to create a URL",
          variant: "destructive",
        });
      } else if (error instanceof z.ZodError) {
        console.log(error.errors[0].message);
        toast({
          title: error.errors[0].message,
          description: "Urls must start with http:// or https://",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          Add New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Shorten New URL</DialogTitle>
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
              type="url"
              defaultValue="youroriginalurl.com"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Slug
            </Label>
            <Input
              id="code"
              className="col-span-3"
              placeholder="Slug || custom"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreate}>
            {loading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <div className="flex space-x-3">
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Create
              </div>
            )}{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
