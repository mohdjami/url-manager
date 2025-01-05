import db from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { redis } from "@/lib/redis";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache"

export async function DELETE(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');

  try {
    const { id } = await req.json();
    const { supabase, user } = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const { data: url, error } = await supabase
      .from("Url")
      .select("*")
      .eq("id", id)
      .single();

    if (!url || error) {
      return NextResponse.json({
        error: "ur not found",
      });
    }
    await redis.del(url?.shortUrl);
    await supabase.from("Url").delete().eq("id", id);
    await supabase.from("urlClick").delete().eq("urlId", id);
    revalidatePath(path!)
    return NextResponse.json(
      {
        message: "Url deleted",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occured",
      },
      {
        status: 500,
      }
    );
  }
}
