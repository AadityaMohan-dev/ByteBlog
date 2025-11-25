import AllBlogs from "./AllBlogs";

export default function AllBlogsWrapper({ userId }: { userId: string }) {
  return <AllBlogs userId={userId} />;
}
