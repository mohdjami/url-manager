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
import { URLShortenerService } from "@/services/url.service";

export async function POST(req: NextRequest) {
  const urlService = new URLShortenerService();
  let data: any;

  try {
    // console.log("route called");
    const { supabase, user } = await getCurrentUser();
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
    //if code is provided then create the url with that code
    if(code) {
      data = await urlService.createShortURL(parsedUrl, user.id, code);
      if (!data || !data.code) {
        NextResponse.json(
          {
            error: "Something went very wrong",
          },
          {
            status: 500,
          }
        );
      }
      code = data.code;
    }
    data = await urlService.createShortURL(parsedUrl, user.id);
    const parsedCode = slugSchema.parse({ slug: code }); 
    await redis.set(parsedCode.slug, parsedUrl, "EX", 60 * 60 * 24 * 7); // expire in one week
    revalidatePath("/dashboard");
    return NextResponse.json({
      Url: data.url,
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
