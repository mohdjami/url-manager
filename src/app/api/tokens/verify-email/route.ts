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
    console.log("token and id after email verification clicked", id);
    const user = await db.user.findUnique({ where: { id } });
    //what i should do is that i should find the user by unique email and check if the token matches
    //but i dont need to do that also i just need to put the usr with the id to update the field
    if (!user) {
      return NextResponse.json(
        {
          user: null,
          message: "cant find the user",
        },
        { status: 404 }
      );
    }

    // Update the user's emailVerified field in the database
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
