import { customAlphabet } from "nanoid";
import { randomBytes } from "crypto";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

interface URLRecord {
  id: number;
  original_url: string;
  short_slug: string;
  created_at: Date;
  expires_at?: Date;
}

export class URLShortenerService {
  private readonly SLUG_LENGTH = 7;
  private readonly MAX_RETRIES = 3;
  private readonly BASE62_CHARS =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  private readonly nanoid: (size?: number) => string;

  constructor(private readonly supabase = createClient()) {
    // Initialize nanoid with our custom alphabet
    this.nanoid = customAlphabet(this.BASE62_CHARS, this.SLUG_LENGTH);
  }

  async createShortURL(
    originalURL: string,
    userId: string,
    code?: string,
    expiresIn?: number
  ): Promise<Object> {
    let attempts = 0;
    let slug: string;

    while (attempts < this.MAX_RETRIES) {
      try {
        // Generate a random slug using nanoid
        if (code) {
          slug = code;
        }
        slug = this.nanoid();

        // Calculate expiration date if provided
        const expiresAt = expiresIn
          ? new Date(Date.now() + expiresIn * 1000)
          : null;

        // Try to insert the URL record
        const { data: Url, error: InsertError } = await this.supabase
          .from("Url")
          .insert({
            originalUrl: originalURL,
            shortUrl: slug,
            userId,
          })
          .single();

        if (InsertError) {
          // If it's a unique constraint violation, retry
          if (InsertError.code === "23505") {
            // PostgreSQL unique violation code
            attempts++;
            continue;
          }
          NextResponse.json(
            {
              error: "Something went very wrong",
            },
            {
              status: 500,
            }
          );
        }
        const data = {
          Url: originalURL,
          code: slug,
        };
        return data;
      } catch (error) {
        attempts++;
        if (attempts === this.MAX_RETRIES) {
          throw new Error(
            "Failed to generate unique slug after maximum retries"
          );
        }
      }
    }

    throw new Error("Failed to generate short URL");
  }

  async getOriginalURL(slug: string): Promise<string> {
    const { data, error } = await this.supabase
      .from("Url")
      .select("originalUrl, expiresAt")
      .eq("shortUrl", slug)
      .single();

    if (error || !data) {
      throw new Error("Short URL not found");
    }

    // Check if URL has expired
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      throw new Error("Short URL has expired");
    }

    return data.originalUrl;
  }

  // Additional utility methods

  private generateRandomOffset(): number {
    // Generate a random offset to prevent sequential guessing
    const buffer = randomBytes(4);
    return buffer.readUInt32BE(0);
  }
}
