import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

export default function ExplorePage() {
  // Example data
  const users: User[] = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Product Designer",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 2,
      name: "Sarah Park",
      role: "Developer",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 3,
      name: "Mike Ross",
      role: "3D Artist",
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 4,
      name: "Emma Liu",
      role: "UI Designer",
      avatar: "/api/placeholder/32/32",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background bg-black p-6">
      {/* Search Header */}
      <div className="mx-auto mb-8 max-w-3xl">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-black text-muted-foreground" />
          <Input
            placeholder="Search creators..."
            className="h-10 bg-white pl-9"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent/80"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
