import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { HandMetal, Menu, MusicIcon } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import UserAccountNav from "./user/UserAccountNav";
import { ModeToggle } from "./mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
const HeaderRoutes = async () => {
  const session = await getServerSession(authOptions);

  const loggedIn = [
    {
      href: "/#home",
      label: "Home",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
    },

    {
      href: "/#features",
      label: "Features",
    },
  ];
  const loggedOut = [
    {
      href: "/#home",
      label: "Home",
    },
    {
      href: "/features",
      label: "Features",
    },
  ];
  const user = session?.user;

  const routes = user ? loggedIn : loggedOut;
  return (
    <>
      <div className="flex items-center">
        <Sheet>
          <SheetTrigger>
            <Menu className="h-6 md:hidden w-6 text-white dark:text-black" />
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              {routes.map((route, i) => (
                <Link
                  key={i}
                  href={route.href}
                  className="block px-2 py-1 text-lg "
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link className="flex items-center justify-center" href="/">
          <Link href="/">
            <HandMetal className=" md:block hidden text-[#ffffff] dark:text-black" />
          </Link>{" "}
          <span className="ml-2 text-lg font-bold text-[#ffffff] dark:text-black">
            URL Shortener
          </span>
        </Link>
      </div>
      <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
        {routes.map((route, i) => (
          <Link
            key={i}
            href={route.href}
            className="text-sm font-medium transition-colors text-[#ffffff] dark:text-black"
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default HeaderRoutes;
