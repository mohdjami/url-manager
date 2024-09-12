import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { slugSchema } from "@/lib/validations/urls";
import { z } from "zod";
import { findSlug, urlExists } from "@/lib/urls";
import { UrlExistsResult } from "@/types";
import { rateLimiting } from "@/lib/rate-limiting";

export async function POST(req: NextRequest) {
  try {
    const { supabase, user } = await getCurrentUser();
    const ip = req.headers.get("x-forwarded-for") || req.ip;
    await rateLimiting(ip!);
    if (!user)
      return NextResponse.json({
        error: "You must be logged in to do that",
      });
    const { id, shortUrl } = await req.json();
    const parsedCode = slugSchema.parse({ slug: shortUrl });

    if (!parsedCode) {
      return NextResponse.json(
        { message: "Missing parameter" },
        { status: 400 }
      );
    }
    const url = await findSlug(parsedCode.slug);
    if (await findSlug(parsedCode.slug)) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }
    const originalUrlExists = (await urlExists(
      url?.originalUrl!,
      user.id
    )) as UrlExistsResult;

    await redis.del(originalUrlExists?.shortUrl!);
    await redis.set(parsedCode.slug, url?.originalUrl!);
    await db.url.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        originalUrl: url?.originalUrl! || originalUrlExists?.originalUrl,
        shortUrl: parsedCode.slug || originalUrlExists?.shortUrl,
        updatedAt: new Date(Date.now()),
      },
    });
    return NextResponse.json(
      {
        message: "Url updated",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("errors is:", error.errors);

      return NextResponse.json(
        {
          error: error.errors,
        },
        {
          status: 500,
        }
      );
    }
  }
}
