"use client";
import { useUser } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="flex h-full flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold">{user?.username}&apos;s Profile</h1>
      <p className="mt-4 text-lg">This is your profile page.</p>
    </div>
  );
}
