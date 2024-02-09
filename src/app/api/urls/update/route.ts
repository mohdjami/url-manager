import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { id, originalUrl, shortUrl } = await req.json();
    const url = await db.url.findUnique({
      where: {
        id,
      },
      select: { userId: true, shortUrl: true, originalUrl: true },
    });
    if (!url) {
      return NextResponse.json({ message: "Url not found" }, { status: 404 });
    }
    if (!session || session.user.id !== url.userId)
      return NextResponse.json({
        error: "You must be logged in to do that",
      });
    if (!originalUrl || !shortUrl)
      return NextResponse.json(
        { message: "Missing parameter" },
        { status: 400 }
      );
    await db.url.updateMany({
      where: {
        id,
      },
      data: {
        originalUrl: originalUrl || url.originalUrl,
        shortUrl: shortUrl || url.shortUrl,
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
