"use client";
import { useCallback, useRef, useState } from "react";

// Tracks click/drag-to-front ordering for a set of window ids.
export default function useWindowStack(ids, base = 10) {
  const counter = useRef(base + ids.length);
  const [zIndexes, setZIndexes] = useState(() =>
    Object.fromEntries(ids.map((id, i) => [id, base + i]))
  );

  const focus = useCallback((id) => {
    counter.current += 1;
    const z = counter.current;
    setZIndexes((prev) => (prev[id] === z ? prev : { ...prev, [id]: z }));
  }, []);

  return { zIndexOf: (id) => zIndexes[id] ?? base, focus };
}
