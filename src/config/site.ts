import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Url-shortener",
  author: "mohdjami",
  description:
    "Shorten your long urls with fast  and reliable url shortening service.",
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
  },
  ogImage: `${process.env.NEXT_PUBLIC_URL}/favicon.ico`,
};
