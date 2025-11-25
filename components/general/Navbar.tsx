import Link from "next/link";
import { SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { MobileNavbar } from "./MobileNavbar";
import { syncUser } from "@/src/action/user.action";
import { Button } from "../ui/button";

export default async function Navbar() {
  const { isAuthenticated } = await auth();
  const user = await currentUser();

  if (user) await syncUser();

  const userData = user ? { firstName: user.firstName || undefined } : undefined;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-5 md:px-0">
      <nav className="mx-auto max-w-7xl h-16 flex items-center justify-between ">
        {/* Left Section */}
        <div className="flex items-center space-x-16">
          <h1 className="text-2xl font-semibold">
            Byte<span className="text-green-600">Blog</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <div id="list" className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-green-700">Home</Link>
          </div>
          <div id="list" className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-green-700">About</Link>
          </div>
          <div id="list" className="hidden md:flex space-x-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-green-700">Settings</Link>
          </div>
        </div>

        {/* Desktop Auth */}
        <div id="desktop-view" className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
            href="/blog/create"
            className="bg-black text-white flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium hover:bg-green-700 transition"
          >
            Write
          </Link>
             <Link href = "/profile"><img src={user?.imageUrl} alt="User" className="rounded-full h-10 w-10" /></Link> 
              <SignOutButton redirectUrl="/main">
                <Button className="text-white hover:bg-red-500">Sign Out</Button>
              </SignOutButton>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <Button>Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="secondary">Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        <MobileNavbar isAuthenticated={isAuthenticated} user={userData} />
      </nav>
    </div>
  );
}
