import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) return;
        const existingUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });
        if (existingUser) return existingUser;
        return await prisma.user.create({
            data: {
                clerkId: userId,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.emailAddresses?.[0]?.emailAddress || "",
                avtarUrl: user.imageUrl || "",
            },
        });
    } catch (error) {
        console.error("Error syncing user:", error);
        throw new Error(
            "Failed to sync user: " + (error instanceof Error ? error.message : "Unknown error")
        );
    }
}

export async function getUserByClerkId(clerkId : string) {
    return prisma.user.findUnique({
        where: { clerkId },
    });
}



export async function getRandomUser(): Promise<any[]> {
  const total = await prisma.user.count();

  if (total === 0) return []; 

  const limit = 4;
  const skip = Math.floor(Math.random() * Math.max(1, total - limit));

  const users = await prisma.user.findMany({
    take: limit,
    skip,
    include: {
      followers: true, 
    },
  });

  return users; 
}

