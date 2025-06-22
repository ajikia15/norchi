"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Settings, BookOpen, Workflow, Users } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Logo href="/" size="sm" showSubtitle={false} />

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
                onClick={() => router.push("/admin")}
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
          </div>
        </div>
      </div>
    </nav>
  );
}
