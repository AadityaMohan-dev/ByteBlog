import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// export async function POST(req: Request) {
//   const { name, email } = await req.json();
//   const user = await prisma.user.create({
//     data: { name, email },
//   });
//   return new Response(JSON.stringify(user), {
//     status: 201,
//     headers: { "Content-Type": "application/json" },
//   });
// }
