"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

interface LogoProps {
  onClick?: () => void;
  href?: string;
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  showSubtitle = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "gap-2",
      icon: "w-6 h-6",
      iconInner: "h-3.5 w-3.5",
      title: "font-bold text-base",
      subtitle: "text-xs",
    },
    md: {
      container: "gap-3",
      icon: "w-8 h-8",
      iconInner: "h-5 w-5",
      title: "font-bold text-xl",
      subtitle: "text-xs",
    },
    lg: {
      container: "gap-4",
      icon: "w-10 h-10",
      iconInner: "h-6 w-6",
      title: "font-bold text-2xl",
      subtitle: "text-sm",
    },
  };

  const styles = sizeClasses[size];

  return (
    <Link
      href="/"
      className={`flex items-center ${styles.container} cursor-pointer ${className}`}
    >
      <div
        className={`${styles.icon} bg-primary rounded-lg flex items-center justify-center`}
      >
        <Zap className={`${styles.iconInner} text-white`} />
      </div>
      <div>
        <h1 className={`${styles.title} text-gray-900`}>Norchi</h1>
        {showSubtitle && (
          <p className={`${styles.subtitle} text-muted-foreground`}>
            Logical Challenges
          </p>
        )}
      </div>
    </Link>
  );
}
