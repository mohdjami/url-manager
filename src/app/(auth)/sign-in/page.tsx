import SignInForm from "@/components/form/SignInForm";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const page = async () => {
  return (
    <div className="w-full">
      <SignInForm />
    </div>
  );
};

export default page;
