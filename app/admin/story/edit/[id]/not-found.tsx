import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl mb-6 text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">გზა ვერ მოიძებნა</h2>
        <p className="mb-4">გზა, რომლის რედაქტირებასაც ცდილობთ, არ არსებობს.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/admin">ადმინისტრატორის პანელზე დაბრუნება</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
