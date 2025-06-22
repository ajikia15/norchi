"use client";

import Link from "next/link";
import Image from "next/image";

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
      icon: "w-8 h-8",
      iconInner: "h-5 w-5",
      title: "font-bold text-base",
      subtitle: "text-xs",
    },
    md: {
      container: "gap-3",
      icon: "w-10 h-10",
      iconInner: "h-7 w-7",
      title: "font-bold text-xl",
      subtitle: "text-xs",
    },
    lg: {
      container: "gap-4",
      icon: "w-12 h-12",
      iconInner: "h-8 w-8",
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
        <Image
          src="/norchi2.png"
          alt="Norchi Logo"
          width={32}
          height={32}
          priority
          className={`${styles.iconInner} object-contain [filter:brightness(0)_saturate(100%)_invert(100%)_sepia(0%)_saturate(0%)_hue-rotate(0deg)_brightness(100%)_contrast(100%)]`}
        />
      </div>
      <div>
        <h1 className={`${styles.title} text-gray-900 font-bold`}>ნორჩი</h1>
        {showSubtitle && (
          <p className={`${styles.subtitle} text-muted-foreground`}>
            Logical Challenges
          </p>
        )}
      </div>
    </Link>
  );
}
