import { ArrowRight, Flower2, MousePointer2, Ruler, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeroScene } from "@/components/landing/HeroScene";
import { LessonGrid } from "@/components/landing/LessonGrid";
import {
  AngleDiagram,
  ElementsDiagram,
  MeasureDiagram,
  OddDiagram,
  SpaceDiagram,
  ThreeStemsDiagram,
} from "@/components/landing/PrincipleDiagrams";
import { Button } from "@/components/ui/button";
import { LESSONS } from "@/lib/ikebana/lessons";
import { MATERIALS } from "@/lib/ikebana/materials";
import { VASES } from "@/lib/ikebana/vases";

const STEPS = [
  {
    icon: Ruler,
    title: "由花器決定尺寸",
    body: "選定花器後，系統會算出基本寸法與真・副・控的建議長度，畫布上的量角器隨時可用。",
  },
  {
    icon: MousePointer2,
    title: "拖曳擺放三主枝",
    body: "從花材庫點選枝材與花材，拖曳花頭調整長度與角度。課程模式會在畫布上標出目標區域。",
  },
  {
    icon: Sparkles,
    title: "即時評析與匯出",
    body: "七項構成原則即時評分：線塊面、色彩、層次、留白、平衡、焦點、奇數。完成後匯出 PNG 留念。",
  },
];

const PRINCIPLES = [
  {
    title: "真・副・控",
    body: "三主枝構成作品骨架。真最長、副次之、控最短，三者頂端連成不等邊三角形。",
    Diagram: ThreeStemsDiagram,
  },
  {
    title: "基本寸法",
    body: "花器直徑加高度就是基準。真約為其 1.5 倍，副是真的 3/4，控是副的 3/4。",
    Diagram: MeasureDiagram,
  },
  {
    title: "角度即姿態",
    body: "角度一律從垂直線量起。立真型：真 10–15°、副 45°、控 75°；改變真的角度就成了傾斜型。",
    Diagram: AngleDiagram,
  },
  {
    title: "留白",
    body: "花與花之間的空隙不是空缺，而是讓線條被看見的必要條件。花道是減法的藝術。",
    Diagram: SpaceDiagram,
  },
  {
    title: "奇數原則",
    body: "三、五、七枝的奇數配置帶來不對稱的節奏，避免左右對稱的呆板。",
    Diagram: OddDiagram,
  },
  {
    title: "線・塊・面",
    body: "枝材給線條與方向，花材給份量與焦點，葉材給面積與安定感。三者兼具，結構才完整。",
    Diagram: ElementsDiagram,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Flower2 className="size-5" />
            </span>
            <span className="font-heading text-xl font-semibold tracking-wide">花道練習室</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#how" className="transition-colors hover:text-foreground">
              怎麼學
            </a>
            <a href="#lessons" className="transition-colors hover:text-foreground">
              課程
            </a>
            <a href="#knowledge" className="transition-colors hover:text-foreground">
              花道知識
            </a>
          </nav>
          <Button nativeButton={false} render={<Link href="/studio" />} size="lg">
            進入練習室 <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="paper-grain relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_1fr] md:py-24">
            <div className="flex flex-col gap-6">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border bg-card/80 px-3 py-1 text-xs tracking-widest text-muted-foreground">
                插花模擬器 ・ IKEBANA SIMULATOR
              </p>
              <h1 className="font-heading text-4xl font-bold leading-[1.15] tracking-tight text-balance md:text-6xl">
                在瀏覽器裡，
                <br />
                學會插花的第一步
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-foreground/80">
                不用買花、不怕插壞。依照真・副・控的比例與角度引導擺放花材，
                系統即時檢查每一枝的長度、角度與位置，讓花道的基本型在手上真正長出來。
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button nativeButton={false} render={<Link href={`/studio?lesson=${LESSONS[0].id}`} />} size="lg" className="h-11 px-5 text-base">
                  開始第一課 <ArrowRight data-icon="inline-end" />
                </Button>
                <Button nativeButton={false} render={<Link href="/studio?mode=free" />} variant="outline" size="lg" className="h-11 px-5 text-base">
                  自由創作
                </Button>
              </div>
              <dl className="grid grid-cols-2 gap-4 pt-2 text-sm sm:grid-cols-4">
                {[
                  [String(LESSONS.length), "堂引導課程"],
                  [String(MATERIALS.length), "種花材"],
                  [String(VASES.length), "款花器"],
                  ["7", "項評析原則"],
                ].map(([n, label]) => (
                  <div key={label} className="rounded-xl border bg-card/60 px-3 py-2.5">
                    <dt className="text-[11px] text-muted-foreground">{label}</dt>
                    <dd className="font-heading text-2xl font-semibold">{n}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="relative mx-auto w-full max-w-[520px]">
              <div className="canvas-frame overflow-hidden rounded-3xl bg-[#f9f6f0]">
                <HeroScene className="block h-auto w-full" />
              </div>
              <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                基本立真型・黑釉水盤：真 54 cm・副 41 cm・控 30 cm，加入兩枝從枝共五枝
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="how" className="border-t bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="mb-10 flex flex-col gap-2">
              <p className="text-xs tracking-widest text-primary">HOW IT WORKS</p>
              <h2 className="font-heading text-3xl font-semibold">三個步驟，從量尺寸到完成作品</h2>
            </div>
            <ol className="grid gap-5 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex flex-col gap-3 rounded-2xl border bg-card p-6">
                  <span className="absolute right-5 top-4 font-heading text-4xl font-bold text-muted/90">0{i + 1}</span>
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <h3 className="font-heading text-xl font-semibold">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/75">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="lessons" className="border-t">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs tracking-widest text-primary">LESSONS</p>
                <h2 className="font-heading text-3xl font-semibold">循序漸進的三堂課</h2>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                以草月流的基本型為藍本。每一步都有畫布上的目標區域與即時檢查，卡關時可以直接看示範擺放。
              </p>
            </div>
            <LessonGrid />
          </div>
        </section>

        <section id="knowledge" className="border-t bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="mb-10 flex flex-col gap-2">
              <p className="text-xs tracking-widest text-primary">PRINCIPLES</p>
              <h2 className="font-heading text-3xl font-semibold">花道小知識</h2>
              <p className="max-w-2xl text-sm text-muted-foreground">
                練習室裡的引導與評析都建立在這六個觀念上。讀過一遍，再回到畫布會更有方向。
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map(({ title, body, Diagram }) => (
                <article key={title} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
                  <div className="rounded-xl bg-muted/50 p-2">
                    <Diagram />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/75">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-20 text-center">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">今天，插一件作品</h2>
            <p className="max-w-lg text-foreground/75">
              從第一課開始，或直接進入自由創作。你的進度與作品會自動保存在這個瀏覽器裡。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button nativeButton={false} render={<Link href={`/studio?lesson=${LESSONS[0].id}`} />} size="lg" className="h-11 px-5 text-base">
                開始第一課
              </Button>
              <Button nativeButton={false} render={<Link href="/studio?mode=free" />} variant="outline" size="lg" className="h-11 px-5 text-base">
                自由創作
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <Flower2 className="size-3.5" /> 花道練習室・插花模擬器
          </p>
          <p>尺寸與角度以草月流基本型的簡化教學模型為準，實際插作請以老師的指導與花材特性為依歸。</p>
        </div>
      </footer>
    </div>
  );
}
