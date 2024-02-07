import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    console.log(email);
    const dbUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (dbUser) {
      if (dbUser?.emailVerified === null) {
        return NextResponse.json(
          { user: null, message: "something went wrong" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          user: null,
          message: "User verified",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { user: null, message: "User not found" },
        { status: 409 }
      );
    }
  } catch (error) {
    console.log("fial error", error);
    return NextResponse.json(
      { user: null, message: "something went wrong" },
      { status: 500 }
    );
  }
}
