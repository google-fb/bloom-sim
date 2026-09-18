# 花道練習室｜插花模擬器

在瀏覽器裡練習插花的互動教學工具。使用者依照真・副・控的比例與角度引導，在花器中擺放花材；系統即時檢查每一枝的長度、角度、前後位置，並依七項構成原則給出評析。

## 功能

- **學習課程**（3 堂）：基本立真型盛花、基本傾真型盛花、色彩／留白／焦點。每一步在畫布上標出目標區域，即時列出通過／未通過的條件，卡關時可以「看示範擺放」。
- **自由創作**：5 款花器、17 種花材（枝材／花材／葉材，各有多種顏色），即時評析：線塊面、色彩節制、高低層次、留白、不對稱平衡、焦點、奇數原則。
- **互動畫布**：拖曳花頭改變長度與角度、拖曳花莖旋轉、拖曳基部左右移動；可調整彎曲、前後位置、翻轉與角色標記。支援量角器、角色標籤、目標引導的開關，以及復原／重做。課程模式中點選花材會在畫布角落出現精簡調整卡；長度會依角度自動限制，花頭永遠留在畫布內。
- **匯出 PNG**：把作品輸出成 1600×1600 的圖片。
- **自動保存**：作品、課程進度與偏好設定保存在瀏覽器的 localStorage。
- 桌面三欄工作區與手機版分頁佈局。

## 技術

- Next.js 16（App Router）、React 19、TypeScript
- Tailwind CSS v4、shadcn/ui（Base UI）
- Zustand（含 persist）
- 花材、花器與畫布全部以 SVG 程式繪製，位於 `src/lib/ikebana/`

## 本機執行

```bash
npm install
npm run dev -- -p 5390
```

開啟 <http://localhost:5390>。

其他指令：

```bash
npm run lint   # ESLint
npm run build  # 產生生產版本
npm start      # 執行生產版本
```

## 部署（GitHub Pages）

儲存庫：<https://github.com/google-fb/bloom-sim>

公開測試網址：<https://google-fb.github.io/bloom-sim/>

專案為純靜態輸出（`output: "export"`）。`.github/workflows/deploy-pages.yml` 會在推送到 `main` 時自動建置並部署。

**第一次部署必須先開啟 Pages：**

1. 開啟 [Settings → Pages](https://github.com/google-fb/bloom-sim/settings/pages)
2. Build and deployment → Source 選 **GitHub Actions**
3. 到 [Actions](https://github.com/google-fb/bloom-sim/actions) 把最新的 **Deploy to GitHub Pages** 工作流程 **Re-run**

之後每次 `git push` 到 `main` 都會更新網站。若 deploy 停在 `github-pages` environment，用 GitHub 帳號核准一次即可。

## 專案結構

```
src/
  app/                    頁面（首頁、/studio 練習室）
  components/
    landing/              首頁區塊（示範作品、課程卡片、原則圖解）
    studio/               練習室 UI（畫布、花材庫、屬性面板、課程面板、評析）
    ui/                   shadcn/ui 元件
  lib/ikebana/
    types.ts              領域型別
    geometry.ts           畫布座標、花莖曲線、角度換算
    vases.tsx             花器定義與 SVG
    materials/            花材定義與 SVG（枝材、花材、葉材）
    lessons.ts            課程內容與每一步的目標
    evaluate.ts           課程檢查與評析規則
    store.ts              Zustand 狀態（含復原／重做、課程進度、persist）
    export.ts             SVG → PNG 匯出
```

## 教學模型說明

尺寸與角度採用草月流基本型的簡化模型：

- 基本寸法 ＝ 花器直徑 ＋ 花器高度
- 真 ＝ 基本寸法 × 1.5；副 ＝ 真 × 3/4；控 ＝ 副 × 3/4
- 立真型：真 10–15°、副 45°、控 75°（控向右並靠前）；傾真型將真與副的角度對調

畫布為二維正面視角，「前後位置」以縮放與基部位移示意。實際插作請以老師的指導與花材特性為準。
