import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${outfit.variable} font-sans antialiased`}>
        <Navbar />
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
