import { auth, currentUser } from "@clerk/nextjs/server";
import CreateBlog from "@/components/general/CreateBlog";

function serializeUser(user: any) {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.firstName + " " + user.lastName,
    email: user.emailAddresses?.[0]?.emailAddress || null,
    imageUrl: user.imageUrl,
  };
}

export default async function Page() {
  const { isAuthenticated } = await auth();
  const rawUser = await currentUser();
  const user = serializeUser(rawUser);

  return (
    <CreateBlog 
      user={user}          
      isAuthenticated={isAuthenticated}
    />
  );
}
