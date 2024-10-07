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
    console.log(id, parsedCode);
    if (!parsedCode) {
      return NextResponse.json(
        { message: "Missing parameter" },
        { status: 404 }
      );
    }
    const slugExists = await findSlug(parsedCode.slug);
    if (slugExists) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 409 }
      );
    }
    const { data: urlExists, error: urlExistError } = await supabase
      .from("Url")
      .select("*")
      .eq("id", id)
      .single();
    await redis.del(urlExists?.shortUrl!);
    await redis.set(parsedCode.slug, urlExists.originalUrl!);
    const { error } = await supabase
      .from("Url")
      .update({
        shortUrl: parsedCode.slug,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      console.log("error updating url", error);
      return NextResponse.json(
        { message: "Error Updating the URL" },
        { status: 400 }
      );
    }
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
