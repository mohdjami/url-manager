import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const url = await db.url.findUnique({
      where: {
        id: id,
      },
      select: {
        shortUrl: true,
      },
    });
    if (!url) {
      return NextResponse.json({
        error: "ur not found",
      });
    }
    await redis.del(url?.shortUrl);
    await db.url.deleteMany({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      {
        message: "Url deleted",
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
