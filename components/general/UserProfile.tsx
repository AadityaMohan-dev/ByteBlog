"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import UserEditForm from "./UserEditForm";
import AllBlogsWrapper from "./AllBlogsWrapper";
import { Edit, BookOpen, Loader2, Users, UserPlus } from "lucide-react";
import Image from "next/image";
import ClerkProfile from "./ClerkProfile";

interface FollowStats {
  followers: number;
  following: number;
}

function UserProfile({ followStats }: { followStats?: FollowStats }) {
  const { user, isLoaded } = useUser();
  const [selected, setSelected] = useState<"edit" | "blogs" | "settings">("edit");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-0">
      {/* Tab Navigation */}
      <ul className="flex  gap-8 py-4  mb-8">
        <li
          className={`px-4 py-2 cursor-pointer font-medium transition-colors ${
            selected === "edit"
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelected("edit")}
        >
          Edit Profile
        </li>
        <li
          className={`px-4 py-2 cursor-pointer font-medium transition-colors ${
            selected === "blogs"
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelected("blogs")}
        >
          My Blogs
        </li>
        <li
          className={`px-4 py-2 cursor-pointer font-medium transition-colors ${
            selected === "settings"
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setSelected("settings")}
        >
          Settings
        </li>
      </ul>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center bg-white rounded-lg shadow-sm border p-6 lg:sticky lg:top-8 lg:self-start min-w-[280px]">
          <div className="relative h-36 w-36 rounded-full border-4 border-gray-100 overflow-hidden shadow-md mb-4">
            <img
              src={user.imageUrl || "/img4.png"}
              alt={`${user.firstName}'s profile`}
              
              className="object-cover"
              
            />
          </div>

          <h2 className="text-2xl font-bold text-center">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500 text-sm text-center break-all mt-1">
            {user.emailAddresses?.[0]?.emailAddress}
          </p>

          {/* Follow Stats */}
          {followStats && (
            <div className="mt-6 pt-6 border-t w-full">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-green-700" />
                    <p className="text-2xl font-bold text-green-700">
                      {followStats.followers}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 mb-1">
                    <UserPlus className="w-4 h-4 text-blue-700" />
                    <p className="text-2xl font-bold text-blue-700">
                      {followStats.following}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Following</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {selected === "edit" ? (
            <UserEditForm
              user={{
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.emailAddresses?.[0]?.emailAddress || "",
                avatarUrl: user.imageUrl,
              }}
            />
          ) : selected === "blogs" ? (
            <AllBlogsWrapper userId={user.id} />
          ) : selected === "settings"?(
            <ClerkProfile/> 
          ): (<p>nothing to show</p>)}
      </div>

      </div>
    </div>
  );
}

export default UserProfile;