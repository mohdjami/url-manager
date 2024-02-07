//logic for sending mails to the user with the link
import sgMail from "@sendgrid/mail";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    const dbUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!dbUser) {
      return NextResponse.json(
        { user: null, message: "user not found" },
        { status: 404 }
      );
    }
    const token = dbUser.id.toString();
    console.log("token for email verification is=", token);
    if (dbUser) {
      // Send verification email
      await sendEmail(email, token);
      console.log("email sent");
    } else {
      console.log("email not sent email= ", email);
    }

    return NextResponse.json(
      {
        user: null,
        message: "email sent successfully",
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

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email: string, userId: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/api/verify-email?token=${userId}`;
  console.log("url=", verificationUrl);

  const msg = {
    from: "mohdjamikhann@gmail.com",
    to: email,
    subject: "Verify Your Email Address",
    html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};
