"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <div className="lg:hidden text-center mb-12">
            <Image
              src="/norchi2.png"
              alt="Norchi"
              width={160}
              height={160}
              className="inline-block rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            სიმართლისკენ მიმავალი გზა
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            გაიარე ინტერაქტიული დიალოგები, აღმოაჩინე ახალი არგუმენტები და
            გაიმყარე საკუთარი პრინციპები.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" onClick={() => scrollTo("hot-questions")}>
              ცხელი კითხვები
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("stories")}
            >
              ისტორიების ნახვა
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow items-center justify-center">
          <Image
            src="/norchi2.png"
            alt="Norchi"
            width={400}
            height={400}
            className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
          />
        </div>
      </div>
    </div>
  );
}
