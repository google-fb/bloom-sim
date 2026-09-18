import type { Metadata } from "next";
import { Suspense } from "react";
import { StudioRoute } from "@/components/studio/StudioRoute";

export const metadata: Metadata = {
  title: "練習室",
};

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioRoute />
    </Suspense>
  );
}
