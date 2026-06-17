import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Palette = "segal" | "tribunal" | "toga" | "notario" | "codex";
export type Density = "compact" | "regular" | "comfortable";
export type FontSet = "classic" | "contemporary" | "grotesk";

export const DENSITY_TOKENS: Record<Density, { rowH: number; pad: number; gap: number; fontBody: number; fontMicro: number }> = {
  compact:     { rowH: 36, pad: 12, gap: 8,  fontBody: 13, fontMicro: 11 },
  regular:     { rowH: 44, pad: 16, gap: 12, fontBody: 14, fontMicro: 12 },
  comfortable: { rowH: 56, pad: 22, gap: 16, fontBody: 15, fontMicro: 13 },
};

interface ThemeContextValue {
  palette: Palette;
  setPalette: (p: Palette) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  toggleDark: () => void;
  density: Density;
  setDensity: (d: Density) => void;
  fontSet: FontSet;
  setFontSet: (f: FontSet) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<Palette>(() => load("fj-palette", "segal"));
  const [dark, setDarkState] = useState<boolean>(() => load("fj-dark", false));
  const [density, setDensityState] = useState<Density>(() => load("fj-density", "regular"));
  const [fontSet, setFontSetState] = useState<FontSet>(() => load("fj-font", "classic"));

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.palette = palette;
    root.dataset.font = fontSet;
    root.dataset.density = density;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [palette, dark, density, fontSet]);

  const setPalette = (p: Palette) => { save("fj-palette", p); setPaletteState(p); };
  const setDark    = (d: boolean) => { save("fj-dark", d);    setDarkState(d); };
  const toggleDark = () => setDark(!dark);
  const setDensity = (d: Density) => { save("fj-density", d); setDensityState(d); };
  const setFontSet = (f: FontSet) => { save("fj-font", f);    setFontSetState(f); };

  return (
    <ThemeContext.Provider value={{ palette, setPalette, dark, setDark, toggleDark, density, setDensity, fontSet, setFontSet }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
