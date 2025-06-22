import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-red-100 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl mb-6 text-center max-w-md">
        <h2 className="text-xl font-bold mb-2">ისტორია ვერ მოიძებნა</h2>
        <p className="mb-4">
          ისტორია, რომელსაც ეძებთ, არ არსებობს ან ჯერ არ არის მზად სათამაშოდ.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/">მთავარ გვერდზე დაბრუნება</Link>
          </Button>
          <Button asChild>
            <Link href="/admin">ადმინისტრატორის პანელი</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
