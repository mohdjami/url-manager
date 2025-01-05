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
import { useToast } from "@/components/ui/use-toast";
import { UpdateUrl } from "@/components/dialogs/edit-dialogue";
import { AddNewUrl } from "@/components/dialogs/add-new-dialogue";
import { DeleteButton } from "@/components/buttons/url-delete-button";
import { Icons } from "@/components/Icons";
import { CopyCheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UrlData {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
}

interface CopyStatus {
  [key: string]: boolean;
}

export default function Dashboard() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus((prevStatus) => ({ ...prevStatus, [text]: true }));
    toast({
      title: "Copied to clipboard",
      description: "The URL has been copied to your clipboard.",
    });
    setTimeout(() => {
      setCopyStatus((prevStatus) => ({ ...prevStatus, [text]: false }));
    }, 2000);
  };

  useEffect(() => {
    const searchUrls = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v2/urls/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search }),
        });
        if (!res.ok) throw new Error("Failed to fetch URLs");
        const data = await res.json();
        setUrls(data.urls || []);
      } catch (error) {
        console.error("Error fetching URLs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch URLs. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUrls, 300);
    return () => clearTimeout(debounce);
  }, [search, toast]);

  const renderUrlCell = (url: string, isShortUrl: boolean = false) => (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={
                isShortUrl ? `${process.env.NEXT_PUBLIC_URL}/up/${url}` : url
              }
              className="truncate hover:underline text-primary max-w-[150px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {isShortUrl ? `${process.env.NEXT_PUBLIC_URL}/up/${url}` : url}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isShortUrl ? `${process.env.NEXT_PUBLIC_URL}/up/${url}` : url}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          handleCopy(
            isShortUrl ? `${process.env.NEXT_PUBLIC_URL}/up/${url}` : url
          )
        }
      >
        {copyStatus[url] ? (
          <CopyCheckIcon className="h-4 w-4" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </Button>
      <Button variant="ghost" size="icon" asChild>
        <Link
          href={isShortUrl ? `${process.env.NEXT_PUBLIC_URL}/up/${url}` : url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLinkIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col w-full py-6 md:py-12 min-h-screen mt-20 md:mt-10">
      <Card className="mx-auto w-full max-w-7xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Links Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <p className="text-muted-foreground">
              Manage and track your shortened links. Share them with the world
              and monitor their performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:flex-1">
                <Input
                  placeholder="Search links..."
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              <AddNewUrl />
            </div>
            <div className="w-full overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Shortened Link</TableHead>
                    <TableHead className="w-[40%]">Original URL</TableHead>
                    <TableHead className="w-[10%] text-center">
                      Clicks
                    </TableHead>
                    <TableHead className="w-[20%] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 mx-auto" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : urls.length > 0 ? (
                    urls.map((url) => (
                      <TableRow key={url.id}>
                        <TableCell>
                          {renderUrlCell(url.shortUrl, true)}
                        </TableCell>
                        <TableCell>{renderUrlCell(url.originalUrl)}</TableCell>
                        <TableCell className="text-center">
                          {url.clicks}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <UpdateUrl id={url.id} />
                            <DeleteButton id={url.id} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No links found. Create your first shortened URL!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
