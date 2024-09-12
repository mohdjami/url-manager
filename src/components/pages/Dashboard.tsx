"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { DialogDemo } from "../dialogs/edit-dialogue";
import { AddNewUrl } from "../dialogs/add-new-dialogue";
import { DeleteButton } from "../buttons/url-delete-button";
import { Icons } from "../Icons";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
interface Copy {
  [key: string]: boolean;
}
export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [copy, setCopy] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<Copy>({
    "": false,
  });
  const handleCopy = (slug: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/up/${slug}`);
    setCopyStatus((prevStatus) => ({ ...prevStatus, [slug]: true }));
    setTimeout(() => {
      setCopyStatus((prevStatus) => ({ ...prevStatus, [slug]: false }));
    }, 2000);
  };
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function searchUrls() {
      try {
        setLoading(true);
        const res = await fetch("api/v2/urls/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: search }),
        });
        const data = await res.json();
        data.urls ? setUrls(data.urls) : setUrls([]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
    searchUrls();
  }, [search]);

  return (
    <div className=" flex flex-col w-full py-12 min-h-screen">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Links</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here are the links you&apos;ve created. Share them with the world
            and track their performance.
          </p>
        </div>
        <div className="flex items-center gap-4 mt-8">
          <div className="flex-1">
            <Input
              placeholder="Search links..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <AddNewUrl />
        </div>
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Link</TableHead>
                <TableHead className="w-1/3">Original</TableHead>
                <TableHead className="w-1/6">Clicks</TableHead>
                <TableHead className="w-1/6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <div className="flex justify-center items-center mt-10 text-xl md:text-xl dark:text-gray-400">
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                </div>
              ) : urls.length > 0 ? (
                urls.map((url: any) => (
                  <TableRow className="divide-y rounded-lg" key={url.id}>
                    <TableCell
                      className="font-semibold flex gap-2"
                      typeof="url"
                    >
                      {" "}
                      <div className="flex items-start gap-2">
                        <Link
                          className="flex  items-center gap-2"
                          href={`${process.env.NEXT_PUBLIC_URL}/up/${url.shortUrl}`}
                        >
                          {`${process.env.NEXT_PUBLIC_URL}/up/${url.shortUrl}`}
                        </Link>
                        <Button
                          className=" ml-4 h-8 w-8"
                          key={url.shortUrl}
                          onClick={() => {
                            handleCopy(url.shortUrl);
                          }}
                          size="icon"
                        >
                          {copyStatus[url.shortUrl] ? (
                            <CopyCheckIcon className="h-4 w-4" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-500">
                      <span className="sr-only">Original URL:</span>
                      <div className="flex items-start gap-2">
                        <Link className="w-[300px]" href={`${url.originalUrl}`}>
                          {`${url.originalUrl}`}
                        </Link>
                        <Button
                          className=" ml-4 h-8 w-8"
                          key={url.originalUrl}
                          onClick={() => {
                            handleCopy(url.originalUrl);
                          }}
                          size="icon"
                        >
                          {copyStatus[url.originalUrl] ? (
                            <CopyCheckIcon className="h-4 w-4" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{`${url.clicks}`}</TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost">
                        <DialogDemo id={url.id} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <DeleteButton id={url.id} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableCell className="font-semibold">
                  <Link href="/dashboard">
                    Knock! Knock! Lets create a URL right?
                  </Link>
                </TableCell>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
