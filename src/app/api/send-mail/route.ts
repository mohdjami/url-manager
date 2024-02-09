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

    await produceMessage("EMAILS", email);
    console.log("consumer and email ");

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
