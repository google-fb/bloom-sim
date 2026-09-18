"use client";

import { useSearchParams } from "next/navigation";
import { Studio } from "./Studio";

/** 在客戶端讀取網址參數，讓 /studio 能以靜態頁面輸出（GitHub Pages） */
export function StudioRoute() {
  const params = useSearchParams();
  return (
    <Studio
      initialLesson={params.get("lesson")}
      initialMode={params.get("mode")}
      restart={params.get("restart") === "1"}
    />
  );
}
