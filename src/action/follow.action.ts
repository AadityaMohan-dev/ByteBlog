"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Follow a user
 */
export async function followUser(targetUserId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    // Don't allow following yourself
    if (currentUser.id === targetUserId) {
      return { success: false, error: "Cannot follow yourself" };
    }

    // Check if already following
    const isFollowing = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        following: {
          some: {
            id: targetUserId,
          },
        },
      },
    });

    if (isFollowing) {
      return { success: false, error: "Already following this user" };
    }

    // Create follow relationship and increment follower count
    await prisma.$transaction([
      prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            connect: { id: targetUserId },
          },
        },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followers: { increment: 1 } },
      }),
    ]);

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Error following user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to follow user",
    };
  }
}

/**
 * Unfollow a user
 */
export async function unfollowUser(targetUserId: string) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    // Check if following
    const isFollowing = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        following: {
          some: {
            id: targetUserId,
          },
        },
      },
    });

    if (!isFollowing) {
      return { success: false, error: "Not following this user" };
    }

    // Delete follow relationship and decrement follower count
    await prisma.$transaction([
      prisma.user.update({
        where: { id: currentUser.id },
        data: {
          following: {
            disconnect: { id: targetUserId },
          },
        },
      }),
      prisma.user.update({
        where: { id: targetUserId },
        data: { followers: { decrement: 1 } },
      }),
    ]);

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/blog");

    return { success: true };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unfollow user",
    };
  }
}

/**
 * Check if current user is following target user
 */
export async function checkIsFollowing(targetUserId: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    
    if (!userId) return false;

    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) return false;

    const isFollowing = await prisma.user.findFirst({
      where: {
        id: currentUser.id,
        following: {
          some: {
            id: targetUserId,
          },
        },
      },
    });

    return !!isFollowing;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

/**
 * Get user's followers with details
 */
export async function getUserFollowers(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            followers: true,
          },
        },
      },
    });

    return user?.followedBy || [];
  } catch (error) {
    console.error("Error getting followers:", error);
    return [];
  }
}

/**
 * Get users that the user is following
 */
export async function getUserFollowing(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            followers: true,
          },
        },
      },
    });

    return user?.following || [];
  } catch (error) {
    console.error("Error getting following:", error);
    return [];
  }
}

/**
 * Get follow statistics for a user
 */
export async function getFollowStats(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            followedBy: true,
            following: true,
          },
        },
      },
    });

    if (!user) {
      return {
        followers: 0,
        following: 0,
      };
    }

    return {
      followers: user._count.followedBy,
      following: user._count.following,
    };
  } catch (error) {
    console.error("Error getting follow stats:", error);
    return {
      followers: 0,
      following: 0,
    };
  }
}