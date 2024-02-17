import { db } from "@/lib/db";
import createShortUrl from "@/lib/urls";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

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

    const codeExists = await db.url.findFirst({
      where: {
        shortUrl: code,
      },
    });
    if (codeExists) {
      return NextResponse.json(
        {
          error: "This slug is already in use. Please choose another one.",
        },
        {
          status: 409,
        }
      );
    }
    const urlExists = await db.url.findUnique({
      where: {
        originalUrl: parsedUrl,
        userId: user.id,
      },
      select: {
        userId: true,
      },
    });
    if (urlExists) {
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
        shortUrl: code,
        userId: user.id,
      },
    });
    return NextResponse.json({
      url: Url,
      code,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occured",
      },
      {
        status: 500,
      }
    );
  }
}
