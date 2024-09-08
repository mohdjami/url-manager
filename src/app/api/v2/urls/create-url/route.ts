import db from "@/lib/db";
import createShortUrl from "@/lib/urls";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { redis } from "@/lib/redis";
import { findSlug, urlExists } from "@/lib/utils";
import { slugSchema } from "@/lib/validations/urls";
import { z } from "zod";
import { rateLimiting } from "@/lib/rate-limiting";
import { createClient } from "@/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      return NextResponse.json({
        error: "Unauthorized",
        status: 401,
      });
    }
    const user = data?.user;
    const ip = req.headers.get("x-forwarded-for") || req.ip;
    await rateLimiting(ip!);
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
    console.log(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.errors[0].message!,
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Something went very wrong",
      },
      {
        status: 500,
      }
    );
  }
}
