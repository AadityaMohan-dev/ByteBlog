// app/api/blog/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) return NextResponse.json([]);

  const blogs = await prisma.blog.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { contentHtml: { contains: query, mode: "insensitive" } },
        { categories: { has: query } },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(blogs);
}
