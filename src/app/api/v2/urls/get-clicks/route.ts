import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  try {
    if (!user?.id) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    const { slug } = await req.json();
    const clickss = await db.url.findUnique({
      where: {
        shortUrl: slug,
      },
      select: {
        clicks: true,
      },
    });
    return NextResponse.json(
      {
        clicks: clickss?.clicks,
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
