"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps, useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import User from "./user/User";
export default function Hero() {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSucces] = useState(false);
  const { toast } = useToast();

  let [code, setCode] = useState("");

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const res = await fetch("api/urls/create-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, code }),
    });
    const data = await res.json();
    setCode(data.code);
    if (!res.ok) {
      toast({ title: data.error, variant: "destructive" });
    } else {
      setSucces(true);
      toast({ title: "Shortened URL has been created", variant: "default" });
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  URL Shortener
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Enter your URL below to shorten it. Share it with the world.
                </p>
              </div>
              <div className="space-y-2 min-w-[300px]">
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
                <Card>
                  <CardDescription>
                    <CardTitle className="py-5">
                      {code && success ? (
                        <Link
                          className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
                          href={`${process.env.NEXT_PUBLIC_URL}/up/${code}`}
                        >
                          {`${process.env.NEXT_PUBLIC_URL}/up/${code}`}
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
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acme Inc. All rights reserved.
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

function MountainIcon(
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
