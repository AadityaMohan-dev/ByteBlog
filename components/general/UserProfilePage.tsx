// app/profile/page.tsx
import UserProfile from "@/components/general/UserProfile";
import { getFollowStats } from "@/src/action/follow.action";
import { getUserByClerkId } from "@/src/action/user.action";
import { auth } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const { userId } = await auth();
  
  if (!userId) {
    return <div>Please sign in</div>;
  }

  const user = await getUserByClerkId(userId);
  const followStats = user ? await getFollowStats(user.id) : undefined;

  return <UserProfile followStats={followStats} />;
}