"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import UserEditForm from "./UserEditForm";
import AllBlogs from "./AllBlogs";
import AllBlogsWrapper from "./AllBlogsWrapper";

function UserProfile() {
  const { user, isLoaded } = useUser();
  const [selected, setSelected] = useState<"edit" | "blogs">("edit");

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="m-10">
      <ul className="flex  justify-center py-2">
        <li className="px-2 border-r cursor-pointer" onClick={() => setSelected("edit")}>
          Edit
        </li>
        <li className="px-2 cursor-pointer" onClick={() => setSelected("blogs")}>
          Blogs
        </li>
      </ul>

      <div className="flex mt-10">
        <div className="flex flex-col items-center max-w-fit px-10">
          <div className="h-36 w-36 rounded-full border overflow-hidden">
            <img src={user?.imageUrl || "/img4.png"} className="h-full w-full object-cover" />
          </div>

          <h1 className="text-2xl mt-2">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500">
            {user?.emailAddresses?.[0]?.emailAddress}
          </p>
        </div>

        {selected === "edit" ? (
          <UserEditForm
            user={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.emailAddresses?.[0]?.emailAddress || ""
            }}
          />
        ) : (
          <AllBlogsWrapper userId={user?.id as string} />
        )}
      </div>
    </div>
  );
}

export default UserProfile;
