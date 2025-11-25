import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, thumbnail, contentHtml, contentJson, categories } = body;
    
    const dbUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        description,
        thumbnail,
        contentHtml,
        contentJson,
        categories,
        authorId: dbUser.id,
      },
    });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("BLOG CREATE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
