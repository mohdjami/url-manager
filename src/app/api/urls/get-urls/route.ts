import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function GET(req: Request) {
  const supabase = createClient();
  try {
    console.log("route called");
    // const user = await getCurrentUser();
    // console.log(user);
    // if (!user)
    //   return NextResponse.json({
    //     error: "You must be logged in to do that",
    //   });
    // = await db.url.findMany();
    const { data: urls, error } = await supabase.from("Url").select("*");
    if (error) {
      console.log(error);
      return NextResponse.json({
        error: "An error occured",
      });
    }
    // const urls = await supabase.from("Url").select("*");
    console.log(urls);
    // const aggregate = await db.url.aggregate({
    //   where: {
    //     userId: user?.id,
    //   },
    //   orderBy: {
    //     clicks: "asc",
    //   },
    // });
    // console.log(aggregate);
    return NextResponse.json({
      urls,
    });
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
