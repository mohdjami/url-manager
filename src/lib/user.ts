import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function userExist(email: string) {
  const supabase = createClient();
  const { data: userExist, error: userError } = await supabase
    .from("User")
    .select("*")
    .eq("email", email)
    .single();
  if (userError || !userExist) {
    console.error("User does not exist in the custom table:", userError);

    return false;
  }
  return userExist;
}

export async function createUser(id: string, email: string) {
  const supabase = createClient();
  const { error: userError } = await supabase.from("User").insert([
    {
      id, // Use the user ID from the authentication data
      email,
      registered_at: new Date().toISOString(),
      // Add other fields as necessary
    },
  ]);

  if (userError) {
    console.error("Error adding user to custom table:", userError);

    return NextResponse.json({
      error: "Error creating user",
    });
  }
  return true;
}
