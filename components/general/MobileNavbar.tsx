"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import {
  MenuIcon,
  HomeIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import Link from "next/link";
import { SignInButton, SignOutButton } from "@clerk/nextjs";

export function MobileNavbar({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean;
  user?: { firstName?: string };
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="flex md:hidden items-center">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-6 mt-6 px-2">

            {/* Universal Links */}
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-3 text-gray-700 hover:text-black"
              >
                <HomeIcon className="w-4 h-4" /> Home
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-3 text-gray-700 hover:text-black"
              >
                <LayoutDashboardIcon className="w-4 h-4" /> Dashboard
              </Link>
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="space-y-4">
                <span className="font-medium">
                  Hello, {user?.firstName || "User"}
                </span>

                <SignOutButton redirectUrl="/main">
                  <Button className="w-full bg-red-500 text-white hover:bg-red-600">
                    Sign Out
                  </Button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button className="w-full">Sign In</Button>
              </SignInButton>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
