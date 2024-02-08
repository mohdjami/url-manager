import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Slice } from "lucide-react";
import next from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user.id) {
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
