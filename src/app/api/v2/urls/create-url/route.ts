import db from "@/lib/db";
import createShortUrl, { findSlug, urlExists } from "@/lib/urls";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { redis } from "@/lib/redis";

import { slugSchema } from "@/lib/validations/urls";
import { z } from "zod";
import { rateLimiting } from "@/lib/rate-limiting";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    // console.log("route called");
    const { supabase, user } = await getCurrentUser();
    console.log(user.id);
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
    console.log(parsedCode);
    await redis.set(parsedCode.slug, parsedUrl, "EX", 60 * 60 * 24 * 7); // expire in one week
    const slugExists = await findSlug(parsedCode.slug);
    const urlExist = await urlExists(user.id, parsedUrl);
    if (slugExists || urlExist)
      return NextResponse.json({
        error: `${slugExists} and ${urlExist}`,
        status: 409,
      });
    console.log(slugExists, urlExist);

    const { data: Url, error: InsertError } = await supabase
      .from("Url")
      .insert({
        originalUrl: parsedUrl,
        shortUrl: parsedCode.slug,
        userId: user.id,
      });
    if (InsertError) {
      console.log(InsertError);
      return NextResponse.json(
        {
          error: "An error occured",
        },
        {
          status: 500,
        }
      );
    }
    // const Url = await db.url.create({
    //   data: {
    //     originalUrl: parsedUrl,
    //     shortUrl: parsedCode.slug,
    //     userId: user.id,
    //   },
    // });
    revalidatePath("/dashboard");
    return NextResponse.json({
      url: Url,
      code,
    });
  } catch (error) {
    console.log(error);
    // if (error instanceof z.ZodError) {
    //   return NextResponse.json(
    //     {
    //       error: error.errors[0].message!,
    //     },
    //     {
    //       status: 500,
    //     }
    //   );
    // }
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
