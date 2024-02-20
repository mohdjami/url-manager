import * as z from "zod";

export const slugSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(7)
    .regex(/^[^\s]*$/, "Slug cannot contain spaces"),
});

export const UrlSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Invalid URL")

    .startsWith("https://" || "http://", "URL must start with https://"),
});
