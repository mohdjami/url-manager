/// lib/passwordReset.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";

const EmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is not set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email: string, url: string) => {
  const msg = {
    to: EmailSchema.parse(email).email,
    from: "mohdjamikhann@gmail.com",
    subject: "Password Reset",
    text: `Click on this link to reset your password: ${url}`,
    html: `<b>Click on this link to reset your password:</b> <a href="${url}">${url}</a>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};
