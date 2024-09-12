import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { slugSchema } from "@/lib/validations/urls";
import { z } from "zod";
import { UrlExistsResult } from "@/types";
import { rateLimiting } from "@/lib/rate-limiting";
import { findSlug, urlExists } from "@/lib/urls";

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
    const slugExists = await findSlug(parsedCode.slug);
    if (slugExists) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }
    const { data: urlExists, error: urlExistError } = await supabase
      .from("Url")
      .select("*")
      .eq("id", id)
      .single();

    await redis.del(urlExists?.shortUrl!);
    await redis.set(parsedCode.slug, urlExists.originalUrl!);
    await supabase.from("Url").update({
      originalUrl: urlExists?.originalUrl! || urlExists?.originalUrl,
      shortUrl: parsedCode.slug || urlExists?.shortUrl,
      updatedAt: new Date(Date.now()),
    });
    // await db.url.updateMany({
    //   where: {
    //     id,
    //     userId: user.id,
    //   },
    //   data: {
    //     originalUrl: url?.originalUrl! || originalUrlExists?.originalUrl,
    //     shortUrl: parsedCode.slug || originalUrlExists?.shortUrl,
    //     updatedAt: new Date(Date.now()),
    //   },
    // });
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
