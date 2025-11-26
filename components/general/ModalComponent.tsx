"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserFollowers, getUserFollowing } from "@/src/action/follow.action";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  followers: number;
}

export function FollowersModal({
  userId,
  count,
}: {
  userId: string;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getUserFollowers(userId)
        .then(setFollowers)
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <p className="text-2xl font-bold text-green-700">{count}</p>
          <p className="text-xs text-gray-500">Followers</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : followers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No followers yet</p>
          ) : (
            <div className="space-y-3">
              {followers.map((follower) => (
                <Link
                  key={follower.id}
                  href={`/user/${follower.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={follower.avatarUrl || "/img3.png"}
                      alt={`${follower.firstName}'s avatar`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {follower.firstName} {follower.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {follower.followers} followers
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FollowingModal({
  userId,
  count,
}: {
  userId: string;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getUserFollowing(userId)
        .then(setFollowing)
        .finally(() => setLoading(false));
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <p className="text-2xl font-bold text-blue-700">{count}</p>
          <p className="text-xs text-gray-500">Following</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Following</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : following.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Not following anyone yet
            </p>
          ) : (
            <div className="space-y-3">
              {following.map((user) => (
                <Link
                  key={user.id}
                  href={`/user/${user.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={user.avatarUrl || "/img3.png"}
                      alt={`${user.firstName}'s avatar`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.followers} followers
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}