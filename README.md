# 瓊林蔡氏網站

金門瓊林蔡氏的源流、祖譜、七座八祠、建築、歷史與公告。純靜態網站，不需要伺服器或資料庫，放在 GitHub Pages 就能免費公開。

## 檔案結構

```
index.html          首頁・今日瓊林（公告、一年五祭、參訪）
family.html         第一章・家族（源流、祖譜、九房四甲、字輩查詢、族譜六修、人物、典故）
architecture.html   第二章・宗祠與建築（七座八祠、比較表、五層祠堂、立面、語彙、工藝）
history.html        第三章・歷史（科舉、古文、戰地、保存、名詞總表）
rites.html          第四章・祭祀（祭祖一天、抽鬮、座次、三獻禮、祭文、墓祭、過去與現在）
guide.html          現場導覽：拍匾額聽故事
css/style.css       全站樣式（開頭的 :root 是設計參數）
js/news.js          ★ 公告欄：只改這個檔就能更新公告
js/data.js          ★ 網站所有內容（文字、族譜、宗祠、人物、名詞、地圖…）
js/plaques.js       ★ 匾額故事與宗祠經緯度（GEO）
js/rites.js         ★ 祭祀頁內容（座次、步驟、祭文、角色）
js/guide.js         現場導覽程式
js/art.js           沒有照片時顯示的插圖
js/site.js          程式（一般不用改）
images/             照片放這裡
images/對照表.csv    照片檔名對照表
拍照清單.md          拍照清單
```

## 常見的修改

**新增公告**：打開 `js/news.js`，複製一段 `{ ... },` 貼在最上面，改日期、標題、內容。範例公告的 `sample: true` 要刪掉或改成 `false`。

**換照片**：照片依 `images/對照表.csv` 的檔名命名（例如 `hall-dazong-front.jpg`），放進 `images/` 資料夾，網站會自動換掉插圖。支援 jpg、png、webp。建議長邊 1600–2000 像素、每張 1 MB 以內。

**補族譜**：打開 `js/data.js`，找到 `window.LINEAGE`，在對應的 `children: [ ... ]` 裡加一筆：
```js
{ gen: 7, name: "某某公", note: "說明文字" },
```
已確認的人物，把 `guess: true` 刪掉，網站上的「推定」標籤就會消失。

**加名詞解釋**：在 `window.GLOSSARY` 加一筆。內文裡用 `[[名詞]]` 包起來，網站會自動變成可點的名詞。

**編者觀點**：`js/rites.js` 最後的 `R_EDITOR` 是祭祀頁「編者觀點」摺疊區的文字，可以換成你自己的段落。

**隱私原則**：族譜只放已過世的先人；祭文裡的當祭裔孫姓名不上網；報告裡的圖片一律自己重繪。

**改設計**：`css/style.css` 開頭的 `:root` 集中了顏色、字型、間距，改這裡就能換整站風格。

**新增匾額故事**：打開 `js/plaques.js`，複製一筆改內容；封面照片命名為 `images/plaque-<id>.jpg`。

**填入宗祠位置（讓定位自動判斷在哪座宗祠）**：在 `js/plaques.js` 最下方的 `GEO.halls` 填入經緯度，例如 `"hall-dazong": [24.4549, 118.3735]`。拍照時開啟手機定位，把照片給我，我可以幫你讀出來。

## 在 GitHub 上發佈（一次設定）

1. 在 GitHub 建立新的 repository（例如 `qionglin-cai`），把整個資料夾上傳。
2. 進入 repository 的 **Settings → Pages**。
3. Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
4. 一兩分鐘後網址會出現在同一頁，格式是 `https://你的帳號.github.io/qionglin-cai/`。

之後只要在 GitHub 網頁上編輯檔案並 Commit，網站約 1–3 分鐘就會自動更新。

## 隱私提醒

- 族譜只公開已過世的先人，在世族人的姓名、生日不要放上網。
- 有人臉的照片，上網前請先取得當事人同意。
- 引用文化局報告的圖面前，請先取得授權並註明出處。

## 搜尋引擎、AI 與 GA 追蹤

- 網址：https://juliechang0520.github.io/qionglin-cai/
- GA 評估 ID：`G-BVGJB2GGVE`（寫在 `tools/build-seo.js` 開頭）
- 每頁 `<head>` 有標題、說明、分享預覽（`og.png`）、GA、結構化資料（JSON-LD）；`<body>` 開頭有給不執行 JavaScript 的 AI 讀的 `<noscript>` 摘要。
- 根目錄的 `llms.txt`、`llms-full.txt` 是給 AI 的網站介紹與全文；`sitemap.xml`、`robots.txt` 給搜尋引擎。
- **改完 `js/*.js` 的內容後**，在網站資料夾執行 `node tools/build-seo.js`，上面這些會自動更新。HTML 裡 `<!--SEO:START-->` 到 `<!--SEO:END-->` 之間是自動產生的，不要手改。
- 上線後到 Google Search Console 新增網站，提交 `sitemap.xml`。
