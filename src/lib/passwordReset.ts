/// lib/passwordReset.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";

const UserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (email: string, url: string) => {
  const msg = {
    to: email,
    from: "mohdjamikhann@gmail.com",
    subject: "Password Reset",
    text: `Click on this link to reset your password: ${url}`,
    html: `<b>Click on this link to reset your password:</b> <a href="${url}">${url}</a>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};

export async function forgotPassword(req: NextRequest, res: NextResponse) {
  try {
    const { email } = UserSchema.parse(await req.json());
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });

    if (!existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "user with this email does not exist" },
        { status: 409 }
      );
    }
    const token = uuidv4();
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 10);
    await db.user.update({
      where: { email: email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });
    const url = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}&email=${email}`;

    await sendEmail(email, url);
    return NextResponse.json(
      { email: email, message: "Link has been sent to the email" },
      { status: 200 }
    );
  } catch (error) {
    console.log("error in sending email:", error);
    return NextResponse.json(
      { user: null, message: "something went wrong" },
      { status: 500 }
    );
  }
}
export async function verifyToken(req: NextRequest, res: NextRequest) {
  // Handle token verification logic
  // ...
  return NextResponse.json(
    { message: "Token verification request handled" },
    { status: 200 }
  );
}

export async function resetPassword(req: NextRequest, res: NextRequest) {
  // Handle password reset logic
  // ...
  return NextResponse.json(
    { message: "Password reset request handled" },
    { status: 200 }
  );
}
