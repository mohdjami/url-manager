"use client";

import Link from "next/link";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

import { dashboardLinks } from "@/config/links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/Icons";
import { UserAvatar } from "@/components/user/user-avatar";
import { Logout } from "../dialogs/logout-dialog";
import { useState } from "react";
import { createClient } from "@/supabase/client";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

export function UserAccountNav2({ user }: UserAccountNavProps) {
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);
  const supabase = createClient();
  const handleLogout = async () => {
    setIsLogoutLoading(true);
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setIsLogoutLoading(false);
      setShowLogoutAlert(false);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {dashboardLinks.data.map((item, index) => {
          const Icon = Icons[item.icon || "next"];
          return (
            item.href && (
              <DropdownMenuItem key={index} className="cursor-pointer" asChild>
                <Link href={item.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            )
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            setShowLogoutAlert(true);
          }}
          disabled={isLogoutLoading}
        >
          <Logout
            open={showLogoutAlert}
            onClose={() => setShowLogoutAlert(false)}
            onLogout={handleLogout}
            isLoading={isLogoutLoading}
          />

          <Icons.signout className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
