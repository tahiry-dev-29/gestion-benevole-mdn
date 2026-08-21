import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Toaster richColors position="top-right" />
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.png" alt="Logo" width={24} height={24} className="rounded-md" />
          Gestion Bénévole
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
