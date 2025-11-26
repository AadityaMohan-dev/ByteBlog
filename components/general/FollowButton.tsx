"use client";

import React, { useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { unfollowUser, followUser } from "@/src/action/follow.action";

interface FollowButtonProps {
  authorId: string;
  initialIsFollowing?: boolean;
  showIcon?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function FollowButton({
  authorId,
  initialIsFollowing = false,
  showIcon = false,
  variant = "outline",
  size = "sm",
}: FollowButtonProps) {
  const { userId, isSignedIn } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [optimisticFollowing, setOptimisticFollowing] = useState(initialIsFollowing);

  // Don't show button if viewing own profile
  if (userId === authorId) {
    return null;
  }

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      // Redirect to sign in or show modal
      alert("Please sign in to follow users");
      return;
    }

    // Optimistic update
    setOptimisticFollowing(!isFollowing);

    startTransition(async () => {
      try {
        if (isFollowing) {
          const result = await unfollowUser(authorId);
          if (result.success) {
            setIsFollowing(false);
          } else {
            // Revert on failure
            setOptimisticFollowing(isFollowing);
          }
        } else {
          const result = await followUser(authorId);
          if (result.success) {
            setIsFollowing(true);
          } else {
            // Revert on failure
            setOptimisticFollowing(isFollowing);
          }
        }
      } catch (error) {
        console.error("Follow action failed:", error);
        // Revert on error
        setOptimisticFollowing(isFollowing);
      }
    });
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Variant classes
  const getVariantClasses = () => {
    const base = "font-medium rounded-full transition-all duration-200";
    
    if (optimisticFollowing) {
      return `${base} ${sizeClasses[size]} bg-gray-100 text-gray-700 border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300`;
    }

    switch (variant) {
      case "default":
        return `${base} ${sizeClasses[size]} bg-black text-white hover:bg-gray-800 border border-black`;
      case "ghost":
        return `${base} ${sizeClasses[size]} text-gray-700 hover:bg-gray-100`;
      default: // outline
        return `${base} ${sizeClasses[size]} border border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white`;
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`${getVariantClasses()} ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      } inline-flex items-center gap-1.5`}
      aria-label={optimisticFollowing ? "Unfollow" : "Follow"}
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : showIcon ? (
        optimisticFollowing ? (
          <UserCheck className="w-3 h-3" />
        ) : (
          <UserPlus className="w-3 h-3" />
        )
      ) : null}
      <span>{optimisticFollowing ? "Following" : "Follow"}</span>
    </button>
  );
}