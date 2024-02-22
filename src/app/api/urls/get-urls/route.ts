import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    console.log("route called");
    const user = await getCurrentUser();
    if (!user)
      return NextResponse.json({
        error: "You must be logged in to do that",
      });

    const urls = await db.url.findMany({
      where: {
        userId: user?.id,
      },
    });
    const aggregate = await db.url.aggregate({
      where: {
        userId: user?.id,
      },
      orderBy: {
        clicks: "asc",
      },
    });
    console.log(aggregate);
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
