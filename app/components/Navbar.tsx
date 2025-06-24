"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Settings, Users } from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/95 font-firago backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Logo href="/" size="sm" showSubtitle={false} />

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {/* Main Navigation */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant={isHome ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  მთავარი
                </Button>
              </Link>

              <Link href="/admin">
                <Button
                  variant={isAdmin ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  ადმინი
                </Button>
              </Link>

              <Button variant="ghost" size="sm" className="gap-2" disabled>
                <Users className="h-4 w-4" />
                საზოგადოება
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
