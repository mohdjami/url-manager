//logic for sending mails to the user with the link

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
// import { useRouter } from "next/navigation";

// Path: src/app/api/reset-password/route.ts

export async function POST(req: Request) {
  // const router = useRouter();
  try {
    const { password, email } = await req.json();
    // console.log(password, token, email);
    const hashedPassword = await hash(password, 10);

    const user = await db.user.update({
      where: { email: email },
      data: {
        password: hashedPassword,
      },
    });
    // router.push("/sign-in");
    return NextResponse.json(
      { user: user, message: "Password has been updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { user: null, message: "something went wrong" },
      { status: 500 }
    );
  }
}
