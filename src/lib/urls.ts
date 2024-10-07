import { createClient } from "@/supabase/server";
import { NextRequest } from "next/server";

export default function createShortUrl(): any {
  const code = "qwertyuioplkjhgfdsazxcvbnm";
  let shortUrl = "";
  for (let i = 0; i < 6; i++) {
    shortUrl += code[Math.floor(Math.random() * code.length)];
  }
  return shortUrl;
}

export const updateClicks = async (slug: string, req: NextRequest) => {
  const ip = req.headers.get("x-forwarded-for") || req.ip;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("url")
    .select("clicks")
    .eq("shortUrl", slug)
    .single();

  if (error) {
    console.error("Error fetching clicks:", error);
    return;
  }

  const currentClicks = data.clicks;

  const { data: updateData, error: updateError } = await supabase
    .from("url")
    .update({ clicks: currentClicks + 1 })
    .eq("shortUrl", slug)
    .select("clicks")
    .single();

  if (updateError) {
    console.error("Error updating clicks:", updateError);
    return;
  }

  const updatedClicks = updateData.clicks;
  // const clicks = await db.url.update({
  //   where: {
  //     shortUrl: slug,
  //   },
  //   data: {
  //     clicks: {
  //       increment: 1,
  //     },
  //   },
  //   select: {
  //     clicks: true,
  //   },
  // });
  const { data: id, error: errorUrl } = await supabase
    .from("Url")
    .select("id")
    .eq("shortUrl", slug);
  if (!errorUrl) {
    return;
  }
  await supabase.from("urlClick").insert({
    urlId: id,
    ipAddress: ip,
  });
  // await db.urlClick.create({
  //   data: {
  //     urlId: url?.id as string,
  //     ipAddress: ip,
  //   },
  // });

  return updateClicks;
};

export const findSlug = async (slug: string) => {
  const supabase = createClient();
  const { data: url, error } = await supabase
    .from("Url")
    .select("*")
    .eq("shortUrl", slug)
    .single();
  if (error) {
    console.log(error);
    return null;
  }
  return url;
};

export const urlExists = async (
  userId: string,
  parsedUrl?: string | null,
  shortUrl?: string | null
) => {
  const supabase = createClient();
  try {
    if (shortUrl) {
      const { data: url, error } = await supabase
        .from("Url")
        .select("*")
        .eq("shortUrl", shortUrl)
        .eq("userId", userId)
        .single();
      if (error) {
        console.log(error);
        return null;
      }
      return url;
    }
    const { data: url, error } = await supabase
      .from("Url")
      .select("*")
      .eq("originalUrl", parsedUrl)
      .eq("userId", userId)
      .single();
    if (error) {
      console.log(error);
      return null;
    }
    return url;
  } catch (error) {
    return new Response(null, {
      status: 500,
    });
  }
};
