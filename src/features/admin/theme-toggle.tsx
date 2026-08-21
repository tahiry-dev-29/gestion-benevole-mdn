"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAdminTheme } from "./admin-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Changer le thème clair/sombre"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}