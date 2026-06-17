import { useMemo } from "react";
import { useTheme } from "@/theme/ThemeProvider";

export interface TokenColors {
  primary: string;
  verde: string;
  rojo: string;
  amarillo: string;
  ink: string;
  ink3: string;
  line: string;
}

export function useTokenColors(): TokenColors {
  const { palette, dark } = useTheme();
  return useMemo(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      primary:  s.getPropertyValue("--fj-primary").trim(),
      verde:    s.getPropertyValue("--fj-verde").trim(),
      rojo:     s.getPropertyValue("--fj-rojo").trim(),
      amarillo: s.getPropertyValue("--fj-amarillo").trim(),
      ink:      s.getPropertyValue("--fj-ink").trim(),
      ink3:     s.getPropertyValue("--fj-ink3").trim(),
      line:     s.getPropertyValue("--fj-line").trim(),
    };
  }, [palette, dark]);
}
