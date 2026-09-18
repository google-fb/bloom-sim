"use client";

import { useEffect, useState } from "react";
import { useStudioStore } from "@/lib/ikebana/store";

function alreadyHydrated(): boolean {
  return typeof window !== "undefined" && Boolean(useStudioStore.persist?.hasHydrated());
}

/** 等待 localStorage 內容還原完成，避免伺服器與客戶端畫面不一致 */
export function useStoreHydration(): boolean {
  const [hydrated, setHydrated] = useState(alreadyHydrated);

  useEffect(() => {
    const persist = useStudioStore.persist;
    const unsubscribe = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) {
      queueMicrotask(() => setHydrated(true));
    } else {
      void persist.rehydrate();
    }
    return unsubscribe;
  }, []);

  return hydrated;
}
