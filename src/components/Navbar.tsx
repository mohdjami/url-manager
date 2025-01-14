import Link from "next/link";
import UserAccountNav from "./user/UserAccountNav";
import HeaderRoutes from "./header-routes";
import { Mode } from "./theme";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "./ui/button";
import { UserAccountNav2 } from "./user/user-account-nav";

const Navbar = async () => {
  const { supabase, user } = await getCurrentUser();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <HeaderRoutes />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Mode />
            {user ? (
              <UserAccountNav />
            ) : (
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar;
