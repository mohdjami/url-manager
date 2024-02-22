import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";
import { db } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (message: string) => {
  return NextResponse.json({ error: message });
};

export const updateClicks = async (slug: string) => {
  const clicks = await db.url.update({
    where: {
      shortUrl: slug,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
    select: {
      clicks: true,
    },
  });
  const url = await db.url.findUnique({
    where: {
      shortUrl: slug,
    },
    select: {
      id: true,
    },
  });
  if (!url) {
    return;
  }
  await db.urlClick.create({
    data: {
      urlId: url?.id as string,
    },
  });

  return clicks;
};

export const findSlug = async (slug: string) => {
  const url = await db.url.findUnique({
    where: {
      shortUrl: slug,
    },
  });
  return url;
};

export const urlExists = async (parsedUrl: string, userId: string) => {
  try {
    const url = await db.url.findUnique({
      where: {
        originalUrl: parsedUrl,
        userId: userId,
      },
      select: {
        originalUrl: true,
        shortUrl: true,
      },
    });
    return url;
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
};
