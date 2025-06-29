import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavbarWrapper from "./components/NavbarWrapper";
import { contractica } from "./lib/fonts";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "ნორჩი",
  description:
    "თანამედროვე, ბარათებზე დაფუძნებული ლოგიკური გამოწვევის სისტემა, რომელიც წარმოგიდგენთ პროვოკაციულ განცხადებებს რწმენაზე დაფუძნებული მსჯელობის ნიმუშების შესასწავლად.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body className={`${contractica.className} antialiased`}>
        <NavbarWrapper />
        <main className="relative">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
