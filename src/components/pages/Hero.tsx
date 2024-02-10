"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps, use, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../ui/card";
import { useToast } from "../ui/use-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
const FormSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL")
    .startsWith("http://", "URL must start with http://")
    .startsWith("https://", "URL must start with https://"),
});

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
      if (!session) {
        toast({
          title: "Please sign in to create a shortened URL",
          variant: "destructive",
        });
      }
      const parsedUrl = FormSchema.parse({ url });

      const res = await fetch("api/urls/create-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parsedUrl, code }),
      });
      const data = await res.json();
      setCode(data.code);
      setDisplayCode(data.code);
      if (!res.ok) {
        toast({ title: data.error, variant: "destructive" });
      } else {
        setSucces(true);
        toast({ title: "Shortened URL has been created", variant: "default" });
        setCode("");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: error.errors[0].message,
          description: "Urls must start with http:// or https://",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] py-8">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="py-5">
                  <div className="py-3">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                      URL Shortener
                    </h1>
                  </div>
                  <div className="py-3">
                    <div className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      The essential tool for sharing. Create custom short links,
                      measure traffic, and grow your audience.
                    </div>
                  </div>
                  <div>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Enter your URL below to shorten it. Share it with the
                      world.
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
                    {" "}
                    <form className="flex space-x-2" onSubmit={handleSubmit}>
                      <Input
                        className="max-w-lg flex-1"
                        placeholder="Enter your URL"
                        type="url"
                        onChange={(e) => {
                          setUrl(e.target.value);
                        }}
                      />
                      <Button type="submit" onClick={handleSubmit}>
                        Shorten
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
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row  w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
