//logic for sending mails to the user with the link

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
// import { useRouter } from "next/navigation";

// Path: src/app/api/reset-password/route.ts
export async function GET(req: Request) {
  const token = req.url.split("=")[1];
  try {
    if (!token) {
      return NextResponse.json(
        {
          user: null,
          message: "Token is required",
        },
        { status: 400 }
      );
    }
    const id = token;
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        {
          user: null,
          message: "cant find the user",
        },
        { status: 404 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });
    return NextResponse.json(
      {
        user: null,
        message: "user successfully verified",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("fial error", error);
    return NextResponse.json(
      { user: null, message: "something went wrong" },
      { status: 500 }
    );
  }
}
