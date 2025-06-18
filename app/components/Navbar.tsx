"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Home, Settings, BookOpen, Workflow, Users, Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show navbar on story play pages for immersion
  if (pathname.startsWith("/story/")) {
    return null;
  }

  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Norchi</h1>
              <p className="text-xs text-muted-foreground">
                Logical Challenges
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Main Navigation */}
            <div className="flex items-center gap-4">
              <Button
                variant={isHome ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push("/")}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Stories
              </Button>

              <Button
                variant={isAdmin ? "default" : "ghost"}
                size="sm"
                onClick={() => router.push("/admin/story")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Button>

              {/* Fake links for now */}
              <Button variant="ghost" size="sm" className="gap-2" disabled>
                <Users className="h-4 w-4" />
                Community
                <Badge variant="secondary" className="ml-1 text-xs">
                  Soon
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="gap-2" disabled>
                <BookOpen className="h-4 w-4" />
                Library
                <Badge variant="secondary" className="ml-1 text-xs">
                  Soon
                </Badge>
              </Button>

              <Button variant="ghost" size="sm" className="gap-2" disabled>
                <Workflow className="h-4 w-4" />
                Templates
                <Badge variant="secondary" className="ml-1 text-xs">
                  Soon
                </Badge>
              </Button>
            </div>

            {/* Admin breadcrumbs when in admin section */}
            {isAdmin && (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Badge variant="outline" className="text-xs">
                  {pathname === "/admin/story" && "Story Management"}
                  {pathname.includes("/admin/story/edit/") && "Story Editor"}
                  {pathname === "/admin" && "Admin Panel"}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
