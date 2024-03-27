import { siteConfig } from "@/config/site";
import Link from "next/link";
import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const About = () => {
  return (
    <footer className="grid sm:grid-cols-3 gap-2 sm:flex-row  w-full shrink-0 justify-between px-4 md:px-6 border-t">
      <p className="text-xs py-4 text-gray-500 dark:text-gray-400">
        All rights reserved.
      </p>

      <div className="flex justify-center py-4 space-x-4">
        <Link
          href={siteConfig.url.author}
          className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          target="_blank"
        >
          <FaGithub />
        </Link>
        <Link
          href={siteConfig.links.linkedin}
          className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          target="_blank"
        >
          <FaLinkedin />
        </Link>{" "}
        <Link
          href={siteConfig.links.twitter}
          className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          target="_blank"
        >
          <FaTwitter />
        </Link>
      </div>
      <nav className="sm:ml-auto flex py-4 gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Privacy
        </Link>
      </nav>
    </footer>
  );
};

export default About;
