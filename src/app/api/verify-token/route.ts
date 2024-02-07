import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { token, email } = await req.json();
    console.log("verify wala = ", token, email);

    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (user) {
      if (
        user.resetToken &&
        user.resetTokenExpiry &&
        user.resetToken === token
      ) {
        const expiryTimestamp = new Date(user.resetTokenExpiry).getTime();
        const isValid = expiryTimestamp > Date.now();
        return NextResponse.json(
          { isValid, message: "Request is successfull" },
          { status: 200 }
        );
      } else {
        console.log("token expired");
        return NextResponse.json(
          { user: null, message: "Invalid token or token expired" },
          { status: 401 }
        );
      }
    } else {
      console.log("user does not exist");
      return NextResponse.json(
        { user: null, message: "User does not exist" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { user: null, message: "something went wrong" },
      { status: 500 }
    );
  }
}
