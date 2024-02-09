import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({
        error: "You must be logged in to do that",
      });

    const urls = await db.url.findMany({
      where: {
        userId: session?.user.id,
      },
    });

    return NextResponse.json({
      urls,
    });
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
