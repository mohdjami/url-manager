import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Url-manager",
  author: "mohdjami",
  description:
    "Monitor your URLs, shorten your long urls with fast and reliable url managing service.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "shadcn/ui",
    "URL shortening",
    "Redis",
    "Kafka",
    "Upstash",
  ],
  url: {
    base: process.env.NEXT_PUBLIC_URL!,
    author: "https://github.com/mohdjami",
  },
  links: {
    github: "https://github.com/mohdjami/url-shortener",
    linkedin: "https://www.linkedin.com/in/mohdjami/",
    twitter: "https://github.com/mohdjami/url-shortener",
  },
  ogImage: `${process.env.NEXT_PUBLIC_URL}/favicon.ico`,
};
