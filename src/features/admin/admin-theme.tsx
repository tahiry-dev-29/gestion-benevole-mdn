"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";
const THEME_KEY = "app-theme";

const emptySubscribe = () => () => {};

/**
 * `false` pendant le rendu serveur et le tout premier rendu client, puis `true`.
 * Evite tout setState dans un effet et garantit un rendu hydraté identique.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useAdminTheme() {
  return useContext(ThemeContext);
}

export function AdminThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialisation paresseuse : le theme est lu une seule fois au montage du
  // provider, sans setState dans un effet.
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);

  // Effet limite a la synchronisation du DOM externe, plus aucun setState ici.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
