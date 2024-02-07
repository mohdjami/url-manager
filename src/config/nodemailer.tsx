import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey", // SendGrid API key ID
    pass: process.env.SENDGRID_API_KEY, // SendGrid API key
  },
});
