import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { HandMetal, Menu, MusicIcon } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UserAccountNav from "./user/UserAccountNav";
import { ModeToggle } from "./mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import HeaderRoutes from "./header-routes";

const Navbar = async () => {
  return (
    <header className="sm:flex sm:justify-between   px-4  bg-slate-900 dark:bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="relative px-4 sm:px-6 lg:px-8 flex h-12 items-center justify-between w-full mx-auto max-w-7xl">
        <HeaderRoutes />
        <div className="flex items-center justify-center">
          <ModeToggle /> &nbsp; &nbsp;
          <UserAccountNav />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const Header = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <HandMetal className="dark:text-black" />
        </Link>
        <ModeToggle />
        <Sheet>
          <SheetTrigger>
            <Menu className="h-6 md:hidden w-6" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link
                className="text-sm font-medium hover:underline underline-offset-4 dark:text-black"
                href="#"
              >
                Features
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 dark:text-black"
          href="#"
        >
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 dark:text-black"
          href="#"
        >
          Pricing
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 dark:text-black"
          href="#"
        >
          About
        </Link>

        <Link
          className="text-sm font-medium hover:underline underline-offset-4 dark:text-black"
          href="#"
        >
          Contact
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 dark:text-black"
          href="/dashboard"
        >
          Dashboard
        </Link>
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
  );
};
