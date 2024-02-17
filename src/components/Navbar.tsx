import Link from "next/link";
import UserAccountNav from "./user/UserAccountNav";
import HeaderRoutes from "./header-routes";
import { Mode } from "./theme";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "./ui/button";

const Navbar = async () => {
  const user = await getCurrentUser();
  return (
    <header className="sm:flex sm:justify-between   px-4  bg-slate-900 dark:bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-12 items-center justify-between w-full mx-auto max-w-7xl">
        <HeaderRoutes />
        <div className="flex items-center justify-center">
          <Mode />
          &nbsp; &nbsp;
          {user ? (
            <UserAccountNav />
          ) : (
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href="/sign-in"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
