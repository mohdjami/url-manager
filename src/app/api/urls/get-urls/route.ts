import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  //   if (!session)
  //     return NextResponse.json({
  //       error: "You must be logged in to do that",
  //     });

  const urls = await db.url.findMany({
    where: {
      userId: session?.user.id,
    },
  });
  return NextResponse.json({
    urls,
  });
}
