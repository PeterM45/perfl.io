"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading } =
    api.user.getProfile.useQuery(
      { userId: user?.id ?? "" },
      { enabled: !!user?.id },
    );

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setBio(profile.bio ?? "");
      setImageUrl(profile.imageUrl ?? "");
    }
  }, [profile]);

  const updateProfile = api.user.updateProfile.useMutation({
    onSuccess: () => {
      toast({ description: "Profile updated successfully" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message || "Failed to update profile",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      // Update database
      await updateProfile.mutateAsync({
        userId: user.id,
        displayName,
        bio,
        imageUrl,
      });

      // Update Clerk profile
      if (user) {
        // Update username and metadata
        await user.update({
          username: displayName.toLowerCase().replace(/\s+/g, "_"),
          unsafeMetadata: {
            bio,
          },
        });

        if (imageUrl && imageUrl !== user.imageUrl) {
          try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error("Failed to fetch image");
            const blob = await response.blob();
            await user.setProfileImage({ file: blob });
          } catch (imageError) {
            console.error("Error updating profile image:", imageError);
            toast({
              variant: "destructive",
              description: "Failed to update profile image",
            });
          }
        }
      }

      toast({ description: "Profile and image updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
    }
  };

  if (!isLoaded || isProfileLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="displayName">Display Name</label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio">Bio</label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl">Profile Image URL</label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                type="url"
                placeholder="https://example.com/your-image.jpg"
              />
              {imageUrl && (
                <div className="mt-2">
                  <Image
                    src={imageUrl}
                    alt="Profile preview"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={updateProfile.isLoading}
            >
              {updateProfile.isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
