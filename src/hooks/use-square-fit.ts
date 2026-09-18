"use client";

import { useEffect, useRef, useState } from "react";

/** 量測容器，回傳能塞進容器的最大正方形邊長 */
export function useSquareFit<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [side, setSide] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSide(Math.floor(Math.max(0, Math.min(rect.width, rect.height))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, side };
}
