import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { createUser, userExist } from "@/lib/user";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/dashboard";
    const error_description = searchParams.get("error_description");
    if (code) {
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
              cookieStore.delete({ name, ...options });
            },
          },
        }
      );
      const { data: UserData, error } =
        await supabase.auth.exchangeCodeForSession(code);
      //Check if user exists in the database
      const userExists = await userExist(UserData.user?.email!);
      //Create if not exists
      if (!userExists) {
        const userData = await createUser(
          UserData.user?.id!,
          UserData.user?.email!
        );
      }
      // Redirect to the next page
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      } else {
        return NextResponse.json({
          error: error,
        });
      }
    } else if (error_description) {
      return NextResponse.json({
        error: error_description,
      });
    }
    return NextResponse.redirect(`${origin}/error`);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: error,
    });
  }

  // return the user to an error page with instructions
}
