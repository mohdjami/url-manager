"use client";
import { UrlSchema } from "./validations/urls";

export const fetchUrl = async (url: string, code: string) => {
  const parsedUrl = UrlSchema.parse({ url }).url;
  const res = await fetch("api/v2/urls/create-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parsedUrl, code }),
  });
  return res;
};
