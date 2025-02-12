"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { fetchUrl } from "@/lib/fetchUrl";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Icons } from "../Icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../ui/card";
import { useToast } from "../ui/use-toast";

export default function Hero() {
  const [url, setUrl] = useState<string>("");
  const [copy, setCopy] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [success, setSucces] = useState(false);
  const [displayCode, setDisplayCode] = useState("");
  const { toast } = useToast();
  let [code, setCode] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    try {
      event.preventDefault();
      setLoading(true);
      const res = await fetchUrl(url, code);
      const data = await res.json();
      setCode(data.code);
      setDisplayCode(data.code);
      if (!res.ok) {
        setLoading(false);
        toast({ title: data.error, variant: "destructive" });
      } else {
        setSucces(true);
        toast({ title: "Shortened URL has been created", variant: "default" });
        setCode("");
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        toast({
          title: error.errors[0].message,
          description: "Urls must start with http:// or https://",
          variant: "destructive",
        });
      }
      toast({
        title: error.message,
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
      <main className="flex-1 w-full max-w-6xl mx-auto">
        <section className="py-12 md:py-20 lg:py-24 mt-20 lg:mt-10">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                URL Manager
              </h1>
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
                  The essential tool for Creating and Sharing custom short links,
                  measure traffic, and grow your audience.
                </p>
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
                  Enter your URL to shorten it and share it with the world.
                </p>
              </div>
              <Link
                href={siteConfig.links.github}
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors bg-black text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700"
                target="_blank"
              >
                View Codebase On Github
              </Link>
            </div>

            {/* Right Column - URL Shortener */}
            <div className="space-y-4 w-full max-w-md mx-auto lg:mx-0">
              <Card className="shadow-lg transition-shadow duration-200 hover:shadow-xl">
                <CardTitle className="p-6 border-b">
                  <form className="flex items-center space-x-2">
                    <span className="text-sm md:text-base font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {`${process.env.NEXT_PUBLIC_URL}/up/`}
                    </span>
                    <Input
                      className="flex-1 h-10"
                      placeholder="Custom"
                      type="name"
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </form>
                </CardTitle>
                <CardContent className="p-6">
                  <form className="flex space-x-2" onSubmit={handleSubmit}>
                    <Input
                      className="flex-1 h-10"
                      placeholder="Enter your URL"
                      type="url"
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button
                      type="submit"
                      className="h-10 px-6 transition-all duration-200 hover:scale-105"
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <Icons.spinner className="h-4 w-4 animate-spin" />
                      ) : (
                        "Shorten"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-md transition-all duration-200 hover:shadow-lg">
                <CardHeader className="p-6">
                  {displayCode || success ? (
                    <CardTitle className="p-6">

                      <div className="flex items-center justify-between gap-4">
                        <Link
                          className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium truncate hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          href={`${process.env.NEXT_PUBLIC_URL}/up/${displayCode}`}
                        >
                          {`${process.env.NEXT_PUBLIC_URL}/up/${displayCode}`}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:scale-110 transition-transform"
                          onClick={() => {
                            setCopy(true);
                            navigator.clipboard.writeText(
                              `${process.env.NEXT_PUBLIC_URL}/up/${displayCode}`
                            );
                            setTimeout(() => setCopy(false), 2000);
                          }}
                        >
                          {copy ? (
                            <CopyCheckIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <CopyIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardTitle>
                  ) : (
                    <CardContent className="p-0 text-center text-gray-500 dark:text-gray-400">
                      Create a URL
                    </CardContent>
                  )}
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
