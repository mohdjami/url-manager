import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const slug = req.url.split("/").pop();
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
    const url = await db.url.findUnique({
      where: {
        shortUrl: slug,
      },
      select: {
        originalUrl: true,
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
    await db.url.update({
      where: {
        shortUrl: slug,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
    return NextResponse.redirect(url?.originalUrl || "/", {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
