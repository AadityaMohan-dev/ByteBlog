"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Syncs the authenticated Clerk user with the database
 * Creates a new user if they don't exist, returns existing user if found
 */
export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.warn("No authenticated user found");
      return null;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        clerkId: userId,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        avatarUrl: user.imageUrl ?? "",
        followers: 0,
      },
    });

    console.log("New user created:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("Error syncing user:", error);
    throw new Error(
      "Failed to sync user: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/**
 * Get user by their Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    if (!clerkId) {
      throw new Error("Clerk ID is required");
    }

    return await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        followers: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error("Error getting user by Clerk ID:", error);
    throw new Error(
      "Failed to get user: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/**
 * Get random users for suggestions
 * Optimized with proper pagination
 */
export async function getRandomUser(limit: number = 4): Promise<any[]> {
  try {
    const total = await prisma.user.count();

    if (total === 0) {
      console.warn("No users found in database");
      return [];
    }

    // Calculate random skip value
    const actualLimit = Math.min(limit, total);
    const skip = Math.floor(Math.random() * Math.max(1, total - actualLimit));

    const users = await prisma.user.findMany({
      take: actualLimit,
      skip,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        followers: true,
      },
      orderBy: {
        followers: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error getting random users:", error);
    return [];
  }
}

/**
 * Get user profile with their blogs and stats
 * Optimized with selected fields only
 */
export async function getUserProfile(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        blog: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            categories: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            following: true,
            followedBy: true,
            blog: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error(
      "Failed to get user profile: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/**
 * Update user profile (simple version without file upload)
 */
export async function updateUserProfile(
  clerkId: string,
  data: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  }
) {
  try {
    if (!clerkId) {
      throw new Error("Clerk ID is required");
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: {
        ...(data.firstName !== undefined && { firstName: data.firstName }),
        ...(data.lastName !== undefined && { lastName: data.lastName }),
        ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(
      "Failed to update user: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/**
 * Get user's follower count
 */
export async function getUserFollowerCount(userId: string): Promise<number> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { followers: true },
    });

    return user?.followers ?? 0;
  } catch (error) {
    console.error("Error getting follower count:", error);
    return 0;
  }
}

/**
 * Convert file to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = buffer.toString("base64");
  return `data:${file.type};base64,${base64}`;
}

/**
 * Validate image file
 */
function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: "Image must be less than 5MB" };
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Only JPEG, PNG, WebP and GIF are allowed" };
  }

  return { valid: true };
}

/**
 * Update user with form data
 * Stores avatar as base64 in database (no external storage needed)
 */
export async function updateUser(formData: FormData) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    // Get form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const avatar = formData.get("avatar") as File;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim()) {
      return { success: false, error: "First name and last name are required" };
    }

    // Prepare update data
    const updateData: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    } = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    // Handle avatar upload if provided
    if (avatar && avatar.size > 0) {
      // Validate image
      const validation = validateImageFile(avatar);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      try {
        // Convert to base64 and store in database
        const base64Image = await fileToBase64(avatar);
        updateData.avatarUrl = base64Image;
      } catch (uploadError) {
        console.error("Error processing image:", uploadError);
        return {
          success: false,
          error: "Failed to process image. Please try again.",
        };
      }
    }

    // Update user in database using clerkId
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: updateData,
    });

    // Revalidate relevant pages
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

/**
 * Update user avatar only (useful for separate avatar upload)
 */
export async function updateUserAvatar(avatarUrl: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    if (!avatarUrl) {
      return { success: false, error: "Avatar URL is required" };
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { avatarUrl },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating avatar:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update avatar",
    };
  }
}

/**
 * Get all users with pagination and search
 * Optimized for performance
 */
export async function getAllUsers(options?: {
  limit?: number;
  cursor?: string;
  search?: string;
}) {
  try {
    const { limit = 20, cursor, search } = options || {};

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        followers: true,
        createdAt: true,
      },
    });

    let nextCursor: string | undefined;
    if (users.length > limit) {
      const nextItem = users.pop();
      nextCursor = nextItem?.id;
    }

    return {
      users,
      nextCursor,
    };
  } catch (error) {
    console.error("Error getting all users:", error);
    return { users: [], nextCursor: undefined };
  }
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string, limit: number = 10) {
  try {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        followers: true,
      },
      orderBy: {
        followers: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}

/**
 * Get user by ID (not Clerk ID)
 */
export async function getUserById(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        followers: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            following: true,
            followedBy: true,
            blog: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error getting user by ID:", error);
    throw new Error(
      "Failed to get user: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

/**
 * Delete user (for GDPR compliance)
 */
export async function deleteUser() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Not authenticated" };
    }

    await prisma.user.delete({
      where: { clerkId: userId },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}