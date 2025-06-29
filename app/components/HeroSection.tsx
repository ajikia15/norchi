"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayIcon, VideoIcon } from "lucide-react";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left Column */}
        <div className="relative bg-white px-6 py-24 sm:py-32 lg:px-8">
          {/* Background Logo Watermark */}
          <div className="pointer-events-none absolute inset-0 -z-0">
            <Image
              src="/logo36.png"
              alt=""
              width={1000}
              height={1000}
              className="absolute -left-[70%] top-1/2 h-auto w-[140%] max-w-none -translate-y-1/2 opacity-5"
            />
          </div>

          {/* Text Content */}
          <div className="relative">
            <h2 className="text-xl font-medium text-gray-700">
              ნორჩის სტუმარო!
            </h2>

            <div className="mt-6 space-y-6">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                ან გირჩელი ხარ, ან გირჩელ მეგობარს აქვს იმედი რომ{" "}
                <strong className="text-primary">
                  განსხვავებული აზრის მოსმენა შეგიძლია
                </strong>
                .
              </h1>
              <p className="text-lg leading-8 text-gray-600">
                გაიგე პასუხები ხშირად დასმულ კითხვებზე, გაანადგურე ჩაგონებული
                დეზინფორმაცია, გაიარე გირჩული &quot;გზები&quot;, ან ნახე ამ
                საზოგადოების საყვარელი ვიდეოები.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-x-6">
              <Button size="lg" onClick={() => scrollTo("hot-questions")}>
                <PlayIcon />
                მათამაშე
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/treasury">
                  <VideoIcon /> საუნჯე
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column (Placeholder) */}
        <div className="flex min-h-[400px] items-center justify-center bg-gray-50 p-8">
          <div className="text-center">
            <p className="text-gray-400">Right column placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}
