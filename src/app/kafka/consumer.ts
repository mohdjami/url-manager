import { Kafka, Producer } from "kafkajs";
import sgMail from "@sendgrid/mail";
import { db } from "@/lib/db";
import path from "path";
import fs from "fs";
export const kafka = new Kafka({
  clientId: "url-shortener",
  brokers: [process.env.KAFKA_BROKER || ""],
  ssl: {
    ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
  },
  sasl: {
    mechanism: "plain",
    username: "avnadmin",
    password: process.env.KAFKA_PASSWORD || "",
  },
});
export async function startMessageConsumer() {
  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "EMAILS", fromBeginning: true });
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ topic, partition, message, pause }) => {
      console.log(`New EMAIL: ${message}`);
      if (!message.value) return;
      try {
        const dbUser = await db.user.findUnique({
          where: {
            email: message.value.toString(),
          },
        });
        if (!dbUser) {
          return;
        }
        const token = dbUser.id.toString();
        console.log("token for email verification is=", token);
        if (dbUser) {
          // Send verification email
          try {
            await sendEmail(message.value.toString(), token);
            console.log("email sent");
          } catch (error) {
            console.log(
              "email not sent email= ",
              message.value.toString(),
              error
            );
          }
        } else {
          console.log("email not sent email= ", message.value.toString());
        }
      } catch (error) {
        console.log("Something is wrong");
        console.error(error);
        pause();
        setTimeout(() => {
          console.log("Resuming");
          consumer.resume([
            {
              topic: "EMAILS",
            },
          ]);
        }, 60 * 1000);
      }
    },
  });
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
