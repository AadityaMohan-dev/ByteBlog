import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/src/action/user.action";
import UserProfile from "./UserProfile";

export default async function UserProfilePage() {
  const user = await currentUser();

  if (user) {
    await syncUser();
  }

  return <UserProfile />;
}
