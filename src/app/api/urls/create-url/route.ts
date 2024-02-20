import { db } from "@/lib/db";
import createShortUrl from "@/lib/urls";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { redis } from "@/lib/redis";
import { findSlug, urlExists } from "@/lib/utils";
import { slugSchema } from "@/lib/validations/urls";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    let { parsedUrl, code } = await req.json();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    if (!parsedUrl) {
      return NextResponse.json(
        {
          error: "parsedUrl is required",
        },
        {
          status: 400,
        }
      );
    }
    while (!code) {
      code = await createShortUrl();
    }
    const parsedCode = slugSchema.parse({ slug: code });
    await redis.set(parsedCode.slug, parsedUrl, "EX", 60 * 60 * 24 * 7); // expire in one week
    if (await findSlug(parsedCode.slug))
      return new Response(null, {
        status: 409,
      });
    if (await urlExists(parsedUrl, user.id)) {
      return NextResponse.json(
        {
          error: "This URL is already shortened please check your Dashboard",
        },
        {
          status: 409,
        }
      );
    }
    const Url = await db.url.create({
      data: {
        originalUrl: parsedUrl,
        shortUrl: parsedCode.slug,
        userId: user.id,
      },
    });
    return NextResponse.json({
      url: Url,
      code,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("errors is:", error.errors[0].message!);
      return NextResponse.json(
        {
          error: error.errors[0].message!,
        },
        {
          status: 500,
        }
      );
    }
  }
}
