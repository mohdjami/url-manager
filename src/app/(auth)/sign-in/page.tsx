import SignInForm from "@/components/form/SignInForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const page = async () => {
  const { supabase, user } = await getCurrentUser();
  if (user) return redirect("/dashboard");
  return (
    <div className="w-full">
      <SignInForm />
    </div>
  );
};

export default page;
