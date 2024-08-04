import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { logout } from "@/serverActions/auth";
import { Routes } from "@/constants/routes";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";

export default async function Navbar() {
  const { user } = await validateRequest();

  if (!user) return redirect(Routes.AUTHENTICATE);

  return (
    <nav className="flex items-center justify-between p-2">
      <div className="flex items-center gap-5">
        <h1 className="font-semibold text-xl">TM Check-in</h1>
        <Link
          href={Routes.PROJECT_JOURNAL}
          className="hidden md:flex items-center gap-1 font-sm"
        >
          <span>Project Journal </span>
          <NotebookPen size={16} />
        </Link>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage alt="profile" src="" />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className="flex items-center justify-between w-full"
                href={Routes.PROJECT_JOURNAL}
              >
                Journal
                <NotebookPen size={14} />
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={logout} className="h-full w-full">
                <button
                  className="h-full w-full flex items-center justify-between"
                  type="submit"
                >
                  Logout
                  <ArrowRight size={14} />
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
