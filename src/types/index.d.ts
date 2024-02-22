export interface URL {
  id: string;
  shortUrl: string;
  originalUrl: string;
  userId: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}
import { IconKeys } from "@/components/Icons";

export type SiteConfig = {
  name: string;
  author: string;
  description: string;
  keywords: Array<string>;
  url: {
    base: string;
    author: string;
  };
  links: {
    github: string;
  };
  ogImage: string;
};

export type UrlExistsResult = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: Date;
  clicks: number;
  updatedAt: Date;
  userId: string;
};
