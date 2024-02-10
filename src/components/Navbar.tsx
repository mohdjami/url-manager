import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { HandMetal, Menu, MusicIcon } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UserAccountNav from "./user/UserAccountNav";
import { ModeToggle } from "./mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import HeaderRoutes from "./header-routes";
import { Mode } from "./theme";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <header className="sm:flex sm:justify-between   px-4  bg-slate-900 dark:bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-12 items-center justify-between w-full mx-auto max-w-7xl">
        <HeaderRoutes />
        <div className="flex items-center justify-center">
          <Mode />
          &nbsp; &nbsp;
          {session?.user ? (
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
