import { db } from "@/lib/db";
import { rateLimiting } from "@/lib/rate-limiting";
import { redis } from "@/lib/redis";
import { updateClicks } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const slug = req.url.split("/").pop();
    const ip = req.headers.get("x-forwarded-for") || req.ip;
    await rateLimiting(ip!);
    const cachedUrl = await redis.get(slug!);
    console.log("route called");
    if (!slug) {
      return NextResponse.json(
        {
          error: "No slug provided",
        },
        {
          status: 400,
        }
      );
    }

    if (cachedUrl) {
      await updateClicks(slug);
      return NextResponse.redirect(cachedUrl || "/", {
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
    const url = await db.url.findUnique({
      where: {
        shortUrl: slug,
      },
      select: {
        originalUrl: true,
        clicks: true,
        shortUrl: true,
        id: true,
      },
    });
    if (!url) {
      return NextResponse.json(
        {
          error: "No url found",
        },
        {
          status: 404,
        }
      );
    }

    await updateClicks(slug);
    await redis.set(slug, url?.originalUrl);
    return NextResponse.redirect(url?.originalUrl || "/", {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      if (error.message === "Prisma Client") {
        let n = 16; // Number of retries
        while (n > 0) {
          await db.url.findMany();
          n = n / 2;
        }
      }
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
