import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
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
            userId: session.user.id,
          },
        ],
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
