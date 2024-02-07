import { db } from "@/lib/db";
import { Slice } from "lucide-react";
import next from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { slug } = await req.json();
  console.log(slug);
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
}
