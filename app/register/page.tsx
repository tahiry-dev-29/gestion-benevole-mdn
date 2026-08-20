import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { RegisterForm } from "@/components/register-form";
import { Toaster } from "@/components/ui/sonner";
import { isAuth0Enabled } from "@/lib/oauth";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <Toaster richColors position="top-right" />
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Gestion Bénévole
        </Link>
        <RegisterForm auth0Enabled={isAuth0Enabled()} />
      </div>
    </div>
  );
}