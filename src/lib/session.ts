import { createClient } from "@/supabase/server";

export async function getCurrentUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("*")
    .eq("email", data.user?.email);
  if (userError || !userData) {
    console.error("User does not exist in the custom table:", userError);
    return { supabase, user: null };
  }

  return { supabase, user: userData[0] };
}
