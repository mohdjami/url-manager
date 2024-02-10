import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import createShortUrl from "@/lib/urls";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let { parsedUrl, code } = await req.json();
    if (!session?.user.id) {
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
    if (!code) {
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
      },
    });
    if (urlExists) {
      return NextResponse.json(
        {
          error: "This URL is already shortened",
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
        userId: session.user.id,
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
