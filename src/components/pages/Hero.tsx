"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { JSX, SVGProps, use, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { useToast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import createShortUrl from "@/lib/urls";
import { fetchUrl } from "@/lib/fetchUrl";
import { z } from "zod";
import { Icons } from "../Icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Hero() {
  const { data: session } = useSession();
  const [url, setUrl] = useState<string>("");
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
    } catch (error) {
      setLoading(false);
      if (!session) {
        toast({
          title: "You must be signed in to create a URL",
          variant: "destructive",
        });
      } else if (error instanceof z.ZodError) {
        toast({
          title: error.errors[0].message,
          description: "Urls must start with http:// or https://",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container flex flex-col py-4">
      <main className="flex-1">
        <section className="w-full py-8 md:py-24 lg:py-32 xl:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-4  sm:grid-cols-2 items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="py-5">
                  <div className="py-3">
                    <h1 className="text-3xl font-bold tracking-tighter text-left sm:text-4xl md:text-5xl lg:text-6xl/none">
                      URL Shortener
                    </h1>
                  </div>
                  <div className="py-6 text-left font-medium">
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      The essential tool for Creating and Sharing custom short
                      links, measure traffic, and grow your audience.
                    </p>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Enter your URL to shorten it and share it with the world.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 min-w-[300px]">
                <Card className="py-3 px-5">
                  <CardTitle className="py-3 px-5">
                    <form className="flex space-x-2">
                      <div className="flex flex-row justify-between">
                        <p className="mx-auto max-w-[700px] text-black md:text-xl dark:text-white">
                          {`${process.env.NEXT_PUBLIC_URL}/up/`}
                        </p>
                        &nbsp;
                        <Input
                          className="max-w-lg flex-1"
                          placeholder="Custom"
                          type="name"
                          onChange={(e) => {
                            setCode(e.target.value);
                          }}
                        />
                      </div>
                    </form>
                  </CardTitle>
                  <CardDescription className="py-3">
                    <form className="flex space-x-2" onSubmit={handleSubmit}>
                      <Input
                        className="max-w-lg flex-1"
                        placeholder={
                          displayCode || success
                            ? "Enter your URL"
                            : "Enter your URL"
                        }
                        type="url"
                        onChange={(e) => {
                          setUrl(e.target.value);
                        }}
                      />
                      <Button type="submit" onClick={handleSubmit}>
                        {loading ? (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Shorten"
                        )}
                      </Button>
                    </form>
                  </CardDescription>
                </Card>{" "}
                <Card>
                  <CardDescription>
                    <CardTitle className="py-5">
                      {displayCode || success ? (
                        <Link
                          className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
                          href={`${process.env.NEXT_PUBLIC_URL}/up/${displayCode}`}
                        >
                          {`${process.env.NEXT_PUBLIC_URL}/up/${displayCode}`}
                        </Link>
                      ) : (
                        <CardContent>
                          <p>Create a URL</p>
                        </CardContent>
                      )}
                    </CardTitle>
                  </CardDescription>
                </Card>
              </div>
              <Link
                href={siteConfig.links.github}
                className="rounded-2xl px-4 py-1.5 text-sm bg-black text-white font-medium dark:bg-muted  dark:text-white"
                target="_blank"
              >
                Feel Free to View Codebase On my Github
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
