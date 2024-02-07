//logic for sending mails to the user with the link

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
// import { useRouter } from "next/navigation";

// Path: src/app/api/reset-password/route.ts

export async function POST(req: Request) {
  // const router = useRouter();
  try {
    //here i will recieve the token and the data that the user has sent now i will verify if the token is valid or not AND IF IT is not then error but if it is valid then i will update the data
    const { password, email } = await req.json();
    // console.log(password, token, email);
    //verify the token is in the databse or not and if it is check the time stamp field compare the current time with the resettokenexpiry time if current tme is later than the expiry time then the token has been expired simple as that\
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
