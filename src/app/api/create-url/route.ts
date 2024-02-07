import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import createShortUrl from "@/lib/urls";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // const session = await getServerSession(authOptions);
  const code = await createShortUrl();

  const { url } = await req.json();
  // if (!session?.user.id) {
  //   return NextResponse.json(
  //     {
  //       error: "Unauthorized",
  //     },
  //     {
  //       status: 401,
  //     }
  //   );
  // } // Create a url and corresponding short url.
  const Url = await db.url.create({
    data: {
      originalUrl: url,
      shortUrl: code,
      userId: "1",
    },
  });
  return NextResponse.json({
    url: Url,
    code,
  });
  // Save the url and short url to the database.

  // Return the short url.
}
