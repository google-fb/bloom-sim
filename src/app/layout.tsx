import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sansTC = Noto_Sans_TC({
  variable: "--font-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const serifTC = Noto_Serif_TC({
  variable: "--font-serif-tc",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "花道練習室｜插花模擬器",
    template: "%s｜花道練習室",
  },
  description:
    "在瀏覽器裡練習插花：依照真・副・控的比例與角度引導擺放花材，即時獲得評析，學會盛花的基本型。",
};

export const viewport: Viewport = {
  themeColor: "#f6f2ea",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-Hant" className={`${sansTC.variable} ${serifTC.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
