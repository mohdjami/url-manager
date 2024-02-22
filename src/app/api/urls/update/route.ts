import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { slugSchema } from "@/lib/validations/urls";
import { z } from "zod";
import { findSlug, urlExists } from "@/lib/utils";
import { UrlExistsResult } from "@/types";
import { rateLimiting } from "@/lib/rate-limiting";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const ip = req.headers.get("x-forwarded-for") || req.ip;
    await rateLimiting(ip!);
    if (!user)
      return NextResponse.json({
        error: "You must be logged in to do that",
      });
    const { id, originalUrl, shortUrl } = await req.json();
    const parsedCode = slugSchema.parse({ slug: shortUrl });

    if (!originalUrl || !parsedCode) {
      return NextResponse.json(
        { message: "Missing parameter" },
        { status: 400 }
      );
    }

    if (await findSlug(parsedCode.slug)) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }
    const originalUrlExists = (await urlExists(
      originalUrl,
      user.id
    )) as UrlExistsResult;
    if (originalUrlExists.originalUrl !== originalUrl) {
      return NextResponse.json(
        { message: "Url should be same." },
        { status: 400 }
      );
    }

    await redis.del(originalUrlExists?.shortUrl!);
    await redis.set(parsedCode.slug, originalUrl);
    await db.url.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        originalUrl: originalUrl || originalUrlExists?.originalUrl,
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
