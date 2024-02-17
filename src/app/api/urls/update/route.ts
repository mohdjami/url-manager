import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({
        error: "You must be logged in to do that",
      });
    const { id, originalUrl, shortUrl } = await req.json();
    if (!originalUrl || !shortUrl) {
      return NextResponse.json(
        { message: "Missing parameter" },
        { status: 400 }
      );
    }
    const slug = await db.url.findUnique({
      where: {
        shortUrl,
      },
    });
    if (slug) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }
    const originalUrlExists = await db.url.findUnique({
      where: {
        userId: session?.user.id,
        id,
      },
      select: { userId: true, shortUrl: true, originalUrl: true },
    });
    if (originalUrlExists?.originalUrl !== originalUrl) {
      return NextResponse.json(
        { message: "Url should be same." },
        { status: 400 }
      );
    }

    await db.url.updateMany({
      where: {
        id,
      },
      data: {
        originalUrl: originalUrl || originalUrlExists?.originalUrl,
        shortUrl: shortUrl || originalUrlExists?.shortUrl,
      },
    });
    return NextResponse.json(
      {
        message: "Url updated",
      },
      {
        status: 200,
      }
    );
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
