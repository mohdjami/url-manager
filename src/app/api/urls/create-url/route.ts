import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import createShortUrl from "@/lib/urls";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  let { url, code } = await req.json();
  if (!session?.user.id) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  } // Create a url and corresponding short url.

  if (!url) {
    return NextResponse.json(
      {
        error: "Url is required",
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
        error: "Short url already exists",
      },
      {
        status: 400,
      }
    );
  }
  const Url = await db.url.create({
    data: {
      originalUrl: url,
      shortUrl: code,
      userId: session.user.id,
    },
  });
  return NextResponse.json({
    url: Url,
    code,
  });
  // Save the url and short url to the database.

  // Return the short url.
}
