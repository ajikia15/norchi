"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Home,
  Settings,
  Users,
  HelpCircle,
  BookOpen,
  Menu,
  User,
  Heart,
} from "lucide-react";
import Logo from "./Logo";
import UserDropdown from "./UserDropdown";
import { Logout } from "./Logout";
import { Video } from "lucide-react";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
  isAdmin?: boolean;
}

export default function Navbar({ user, isAdmin = false }: NavbarProps = {}) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isHome = pathname === "/";

  const closeDrawer = () => {
    setIsDrawerOpen(false);
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
      href: "/treasury",
      label: "საუნჯე",
      icon: Video,
      isActive: pathname === "/treasury",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/95 font-firago backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Logo href="/" size="sm" showSubtitle={false} />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
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

            {user ? (
              <UserDropdown user={user} isAdmin={isAdmin} />
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  შესვლა
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Drawer */}
          <div className="md:hidden">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle className="text-center">ნავიგაცია</DrawerTitle>
                </DrawerHeader>
                <div className="flex flex-col gap-2 p-4 pb-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeDrawer}
                    >
                      <Button
                        variant={item.isActive ? "default" : "ghost"}
                        size="lg"
                        className="h-12 w-full justify-start gap-3"
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  ))}

                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-full justify-start gap-3"
                    disabled
                  >
                    <Users className="h-5 w-5" />
                    საზოგადოება
                  </Button>

                  {user ? (
                    <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                      <Link href="/profile" onClick={closeDrawer}>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12 w-full justify-start gap-3"
                        >
                          <User className="h-5 w-5" />
                          პროფილი
                        </Button>
                      </Link>

                      <Link href="/saved-hotcards" onClick={closeDrawer}>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="h-12 w-full justify-start gap-3"
                        >
                          <Heart className="h-5 w-5" />
                          შენახული კითხვები
                        </Button>
                      </Link>

                      {isAdmin && (
                        <Link href="/admin" onClick={closeDrawer}>
                          <Button
                            variant="ghost"
                            size="lg"
                            className="h-12 w-full justify-start gap-3"
                          >
                            <Settings className="h-5 w-5" />
                            ადმინ პანელი
                          </Button>
                        </Link>
                      )}

                      <div className="w-full p-3">
                        <Logout />
                      </div>
                    </div>
                  ) : (
                    <Link href="/login" onClick={closeDrawer}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="mt-4 w-full"
                      >
                        შესვლა
                      </Button>
                    </Link>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
}
