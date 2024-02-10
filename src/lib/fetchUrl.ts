"use client";
import { useState } from "react";
import * as z from "zod";
const FormSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL")

    .startsWith("https://" || "http://", "URL must start with https://"),
});

export const fetchUrl = async (url: string, code: string) => {
  console.log("code", code);
  const parsedUrl = FormSchema.parse({ url }).url;
  console.log(parsedUrl);
  const res = await fetch("api/urls/create-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parsedUrl, code }),
  });
  return res;
};
