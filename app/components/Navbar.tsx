"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Home,
  Settings,
  Users,
  HelpCircle,
  BookOpen,
  Menu,
} from "lucide-react";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const navigationItems = [
    {
      href: "/",
      label: "მთავარი",
      icon: Home,
      isActive: isHome,
    },
    {
      href: "/hot-questions",
      label: "ცხელი კითხვები",
      icon: HelpCircle,
      isActive: pathname === "/hot-questions",
    },
    {
      href: "/stories",
      label: "ლოგიკური გზები",
      icon: BookOpen,
      isActive: pathname === "/stories",
    },
    {
      href: "/admin",
      label: "ადმინი",
      icon: Settings,
      isActive: isAdmin,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/95 font-firago backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Logo href="/" size="sm" showSubtitle={false} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}

            <Button variant="ghost" size="sm" className="gap-2" disabled>
              <Users className="h-4 w-4" />
              საზოგადოება
            </Button>
          </div>

          {/* Mobile Menu Sheet */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">ნავიგაცია</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navigationItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={closeSheet}>
                      <Button
                        variant={item.isActive ? "default" : "ghost"}
                        size="lg"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}

                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start gap-3 h-12"
                    disabled
                  >
                    <Users className="h-5 w-5" />
                    საზოგადოება
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
