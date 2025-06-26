import { SignupForm } from "@/components/signup-form";
import Logo from "../components/Logo";
export default function SignupPage() {
  return (
    <div className="bg-muted min-h-svh flex flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Logo />
        <SignupForm />
      </div>
    </div>
  );
}
