"use client";
import { useEffect, useState } from "react";

// Matches the breakpoint where decorative windows are hidden in globals.css (max-width: 960px).
export default function useIsDesktop(breakpoint = 960) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isDesktop;
}
