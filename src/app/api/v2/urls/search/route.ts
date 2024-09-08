import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      {
        error: "You must be logged in to do that",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { search } = await req.json();
    const urls = await db.url.findMany({
      where: {
        AND: [
          {
            originalUrl: {
              contains: search,
            },
          },
          {
            userId: user.id,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        urls,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error,
      },
      { status: 500 }
    );
  }
}
