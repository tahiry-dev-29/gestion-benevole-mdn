"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAdminTheme, useMounted } from "./admin-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();
  const mounted = useMounted();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Changer le thème clair/sombre"
      onClick={toggleTheme}
      className="size-9 rounded-lg border-border/80 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {mounted && theme === "light" ? (
        <Moon className="size-4 transition-transform duration-200" />
      ) : (
        <Sun className="size-4 transition-transform duration-200" />
      )}
    </Button>
  );
}
