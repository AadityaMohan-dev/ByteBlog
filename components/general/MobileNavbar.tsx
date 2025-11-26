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
  UserCircle,
  LogOutIcon,
  LogInIcon,
  BookOpenIcon,
  SearchIcon,
  PlusCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

export function MobileNavbar({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean;
  user?: { firstName?: string; lastName?: string; imageUrl?: string };
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setShowMobileMenu(false);
  };

  const isActive = (path: string) => pathname === path;

  const navLinks: NavLink[] = [
    {
      href: "/",
      label: "Home",
      icon: <HomeIcon className="w-5 h-5" />,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      requiresAuth: true,
    },
    {
      href: "/blogs",
      label: "Browse Blogs",
      icon: <BookOpenIcon className="w-5 h-5" />,
    },
    {
      href: "/search",
      label: "Search",
      icon: <SearchIcon className="w-5 h-5" />,
    },
    {
      href: "/create",
      label: "Create Blog",
      icon: <PlusCircleIcon className="w-5 h-5" />,
      requiresAuth: true,
    },
  ];

  const visibleLinks = navLinks.filter(
    (link) => !link.requiresAuth || isAuthenticated
  );

  return (
    <div className="flex md:hidden items-center">
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 pt-6 pb-4 border-b">
              <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>

            <nav className="flex-1 flex flex-col overflow-y-auto">
              {/* User Info Section (if authenticated) */}
              {isAuthenticated && (
                <div className="mx-4 mt-4 mb-2">
                  <Link
                    href="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors"
                  >
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={`${user.firstName}'s profile`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <UserCircle className="w-12 h-12 text-gray-400" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.firstName || "User"}
                      </span>
                      <span className="text-xs text-gray-600">
                        View Profile
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="px-4 py-4 space-y-1">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(link.href)
                        ? "bg-green-50 text-green-700 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Auth Section */}
              <div className="p-4 border-t bg-gray-50">
                {isAuthenticated ? (
                  <SignOutButton redirectUrl="/">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={handleLinkClick}
                    >
                      <LogOutIcon className="w-5 h-5" />
                      Sign Out
                    </Button>
                  </SignOutButton>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      className="w-full justify-start gap-3 bg-green-950 hover:bg-green-900"
                      onClick={handleLinkClick}
                    >
                      <LogInIcon className="w-5 h-5" />
                      Sign In
                    </Button>
                  </SignInButton>
                )}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}