import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { HandMetal } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UserAccountNav from "./user/UserAccountNav";
import { ModeToggle } from "./mode-toggle";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div className=" bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <HandMetal className="dark:  text-black" />
        </Link>
        <ModeToggle />
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

export default Navbar;
