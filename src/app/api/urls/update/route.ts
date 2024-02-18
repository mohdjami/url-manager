import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user)
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
        userId: user.id,
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
    await redis.set(shortUrl, originalUrl);
    await db.url.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: {
        originalUrl: originalUrl || originalUrlExists?.originalUrl,
        shortUrl: shortUrl || originalUrlExists?.shortUrl,
        updatedAt: new Date(Date.now()),
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
