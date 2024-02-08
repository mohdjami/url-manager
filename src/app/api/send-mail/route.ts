//logic for sending mails to the user with the link
import sgMail from "@sendgrid/mail";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { produceMessage } from "@/app/kafka/producer";
import { startMessageConsumer } from "@/app/kafka/consumer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    await startMessageConsumer();

    produceMessage("EMAILS", email);

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
  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/api/tokens/verify-email?token=${userId}`;
  const msg = {
    from: "mohdjamikhann@gmail.com",
    to: email,
    subject: "Verify Your Email Address",
    html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};
