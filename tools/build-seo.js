/* =========================================================
   搜尋引擎與 AI 可讀資訊產生器
   ---------------------------------------------------------
   改完 js/*.js 的內容後，在網站資料夾執行：
       node tools/build-seo.js
   會更新：
     - 每頁 <head> 的標題、說明、分享預覽、GA 追蹤、結構化資料（JSON-LD）
     - 每頁 <noscript> 靜態摘要（給不執行 JavaScript 的 AI 與爬蟲）
     - llms.txt、llms-full.txt、sitemap.xml、robots.txt
   每頁 <!--SEO:START-->…<!--SEO:END--> 之間的內容由本程式產生，請勿手改。
   ========================================================= */
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const BASE = "https://juliechang0520.github.io/qionglin-cai/";
const GA_ID = "G-BVGJB2GGVE";
const SITE_NAME = "金門瓊林蔡氏";

global.window = {};
for (const f of ["data", "rites", "plaques", "hunt", "news"]) require(path.join(ROOT, "js", f + ".js"));
const W = global.window;

const clean = t => String(t == null ? "" : t).replace(/\[\[(.+?)\]\]/g, "$1");
const esc = t => clean(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const arr = v => [].concat(v || []);

/* ---------- 每頁設定 ---------- */
const PAGES = [
  { file: "index.html", title: "金門瓊林蔡氏｜七座八祠・宗祠、族譜與祭祖",
    desc: "金門瓊林蔡氏的源流、族譜、七座八祠（國定古蹟）、宗祠建築、科舉人物、戰地歲月與春秋二祭。瓊林是金門最大的傳統聚落，明清出了六位進士。", name: "今日瓊林" },
  { file: "family.html", title: "家族與族譜｜金門瓊林蔡氏",
    desc: "瓊林蔡氏從開基祖十七郎公到今日：源流年表、族譜樹、九房四甲、四十九世字輩查詢、族譜六修與三層譜例、明清人物與典故。", name: "家族" },
  { file: "architecture.html", title: "宗祠與建築・七座八祠｜金門瓊林蔡氏",
    desc: "金門瓊林七座八祠（國定古蹟）導覽：各宗祠的奉祀、匾額與燈號，四甲分布地圖，祠堂五層次，閩南宗祠立面、平面與工藝，以及學堂怡穀堂。", name: "宗祠與建築" },
  { file: "history.html", title: "歷史・科舉與戰地｜金門瓊林蔡氏",
    desc: "瓊林蔡氏的科舉之路、古文文獻原文與白話、1949 年後的戰地歲月，以及聚落為什麼保存得這麼完整。附名詞總表。", name: "歷史" },
  { file: "rites.html", title: "春秋二祭與祭祖｜金門瓊林蔡氏",
    desc: "瓊林蔡氏家廟祭祖儀典（金門縣無形文化資產）：祭前抽鬮、兩回出主、神主座次、大三獻口令、祭文白話、祭品、清明墓祭，以及過去與現在的變化。", name: "祭祀" },
  { file: "guide.html", title: "拍匾額聽故事・匾額與彩繪導覽｜金門瓊林蔡氏",
    desc: "到瓊林宗祠現場用：12 面匾額的人物故事、八座祠堂 91 面匾額清冊，以及家廟彩繪尋寶 20 組（含科舉暗號圖案）。", name: "現場導覽" }
];

/* ---------- 共用：地點與網站 ---------- */
const place = {
  "@type": ["LandmarksOrHistoricalBuildings", "TouristAttraction"], "@id": BASE + "#qionglin-ancestral-halls",
  name: "瓊林蔡氏祠堂（七座八祠）", alternateName: ["瓊林七座八祠", "瓊林蔡氏家廟", "Qionglin Cai Family Ancestral Halls"],
  description: "金門瓊林蔡氏的七座建築、八座宗祠，1985 年列為古蹟，今為國定古蹟；包括大宗家廟、竹溪公、樂圃公、廷輔公、前庭房、柏崖公、十一世及藩伯宗祠。",
  address: { "@type": "PostalAddress", addressCountry: "TW", addressRegion: "金門縣", addressLocality: "金湖鎮", streetAddress: "瓊林里" },
  geo: { "@type": "GeoCoordinates", latitude: W.GEO.center[0], longitude: W.GEO.center[1] },
  sameAs: ["https://nchdb.boch.gov.tw/assets/overview/monument/19850819000089"],
  isAccessibleForFree: true
};
const website = { "@type": "WebSite", "@id": BASE + "#website", url: BASE, name: SITE_NAME, alternateName: "瓊林蔡氏", inLanguage: "zh-Hant",
  description: PAGES[0].desc, about: { "@id": place["@id"] } };

/* ---------- 每頁的結構化資料 ---------- */
function pageLD(p) {
  const url = BASE + (p.file === "index.html" ? "" : p.file);
  const g = [website, {
    "@type": "WebPage", "@id": url + "#page", url, name: p.title, description: p.desc, inLanguage: "zh-Hant",
    isPartOf: { "@id": website["@id"] }, about: { "@id": place["@id"] }, image: BASE + "og.png",
    dateModified: W.SITE.updated
  }, {
    "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: BASE },
      ...(p.file === "index.html" ? [] : [{ "@type": "ListItem", position: 2, name: p.name, item: url }])]
  }];
  if (p.file === "index.html") g.push(place);
  if (p.file === "family.html") g.push({ "@type": "ItemList", name: "瓊林蔡氏歷史人物", itemListElement: W.PEOPLE.map((x, i) => ({
    "@type": "ListItem", position: i + 1, item: { "@type": "Person", name: x.name, description: clean(`${x.era}・${x.title}。${x.text}`), familyName: "蔡" } })) });
  if (p.file === "architecture.html") g.push({ "@type": "ItemList", name: "瓊林七座八祠", itemListElement: W.HALLS.map((h, i) => ({
    "@type": "ListItem", position: i + 1, item: { "@type": "LandmarksOrHistoricalBuildings", name: h.name, description: clean(`${h.one}。${h.built}。${h.worship}`), containedInPlace: { "@id": place["@id"] } } })) });
  if (p.file === "history.html") g.push({ "@type": "DefinedTermSet", name: "瓊林蔡氏名詞解釋", hasDefinedTerm: W.GLOSSARY.map(t => ({ "@type": "DefinedTerm", name: t.term, description: clean(t.desc) })) });
  if (p.file === "rites.html") g.push({ "@type": "Article", headline: "瓊林蔡氏家廟祭祖儀典", about: ["春秋二祭", "大三獻", "兩回出主"], inLanguage: "zh-Hant",
    description: "每年農曆二月初七（春祭）、十月初六（秋祭）在大宗家廟舉行，2011 年登錄為金門縣無形文化資產。" });
  if (p.file === "guide.html") g.push({ "@type": "ItemList", name: "瓊林宗祠匾額故事", itemListElement: W.PLAQUES.map((x, i) => ({
    "@type": "ListItem", position: i + 1, item: { "@type": "CreativeWork", name: `「${x.text}」匾（${x.person}）`, description: clean(x.hook) } })) });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": g }, null, 1).replace(/<\//g, "<\\/");
}

/* ---------- 每頁的純文字內容（noscript 與 llms-full.txt 共用） ---------- */
function lineageLines(n, out) {
  if (!n.tbd && n.name) out.push(`${typeof n.gen === "number" ? n.gen + " 世　" : ""}${n.name}${n.note ? "：" + n.note : ""}`);
  arr(n.children).forEach(c => lineageLines(c, out));
  return out;
}
function sections(file) {
  const S = [];
  const sec = (h, items) => { items = items.filter(Boolean).map(clean); if (items.length) S.push({ h, items }); };
  if (file === "index.html") {
    sec("簡介", [W.SITE.tagline, "瓊林位於金門島中央的金湖鎮，是蔡氏單姓聚落，有「七座八祠」國定古蹟，明清兩代出了六位進士，燈號「文武世家」。"]);
    sec("一年中的祭典", W.CALENDAR.map(c => `${c.when}　${c.name}：${c.text}`));
    sec("參訪資訊", W.VISIT.map(v => `${v.title}：${v.text}`));
    sec("最新公告", W.NEWS.filter(n => !n.sample).map(n => `${n.date}　${n.title}：${n.body}`));
  }
  if (file === "family.html") {
    sec("源流年表", W.TIMELINE.map(t => `${t.year}　${t.title}：${t.text}`));
    sec("族譜樹（只列已過世的先人）", lineageLines(W.LINEAGE, []));
    sec("九房四甲", [W.FANG9.note, ...W.FANG9.pai.map(p => `${p.name}（${p.root}）：${p.fang.join("、")}`), "四甲：" + W.FANG9.jia.join("、")]);
    sec("字輩（四十九世昭穆）", [W.ZIBEI.join("")]);
    sec("族譜六修", W.EDITIONS.map(e => `${e.year}　${e.who}：${e.what}`));
    sec("人物", W.PEOPLE.map(x => `${x.name}（${x.era}・${x.title}）：${x.text}`));
    sec("典故", W.STORIES.map(x => `${x.title}【${x.tag}】：${x.text}`));
  }
  if (file === "architecture.html") {
    sec("七座八祠", W.HALLS.map(h => `${h.name}（${h.gen}，${h.luo}）：${h.one}。建造：${h.built}。奉祀：${h.worship}。匾額：${h.plaques}。燈號：${h.lamp}。${h.feature}${h.now}`));
    sec("四甲與宗祠", [W.MAP.jia.intro, ...W.MAP.jia.list.map(j => `${j.name}（${j.pai}）：${j.fang.join("、")}。${j.text}`), W.MAP.jia.common]);
    sec("祠堂五層次", [...W.TIERS.map(t => `第 ${t.lv} 層　${t.name}（${t.who}）：${t.halls.map(h => h.n + "－" + h.f).join("；")}`), W.TIERS_STORY]);
    sec("由前到後，走進宗祠", W.PLAN.map(p => `${p.name}：${p.text}`));
    sec("建築語彙", W.ARCH.map(a => `${a.term}：${a.text}`));
    sec("匠師工藝", W.CRAFT.map(c => `${c.name}：${c.text}`));
    sec("怡穀堂：瓊林的學堂", [W.YIGU.intro, ...W.YIGU.facts.map(f => `${f.k}：${f.v}`), ...W.YIGU.windows.map(w => `${w.name}：${w.text}`), ...W.YIGU.words.map(w => `${w.t}：${w.text}`), W.YIGU.painting.text]);
  }
  if (file === "history.html") {
    sec("科舉階梯", W.EXAM.map(e => `${e.step}（${e.sub}）：取得${e.get}。${e.modern}`));
    sec("古文文獻（原文與白話）", W.CLASSICS.map(c => `${c.from}：「${c.text}」白話：${c.plain}`));
    sec("戰地歲月", [W.WAR.intro, ...W.WAR.events.map(e => `${e.year}　${e.title}：${e.text}`), ...W.WAR.life.map(l => `${l.title}：${l.text}`)]);
    sec("為什麼保存得這麼完整", [W.PRESERVE.verdict, ...W.PRESERVE.reasons.map(r => `${r.title}：${r.text}`), ...W.PRESERVE.caveats.map(r => `${r.title}：${r.text}`)]);
    sec("名詞解釋", W.GLOSSARY.map(t => `${t.term}：${t.desc}`));
  }
  if (file === "rites.html") {
    sec("祭祖的一天", W.R_DAY.map(d => `${d.t}　${d.h}：${d.p}`));
    sec("大三獻步驟", W.R_STEPS.map((s, i) => `${i + 1}. ${s.h}：${s.plain}`));
    sec("角色", W.R_ROLES.map(r => `${r.h}（${r.n}）：${r.p}`));
    sec("祭文格式（原文與白話）", arr(W.R_TEXT.frame).map(f => `${f.o}　白話：${f.p}`));
    sec("祭品", W.R_OFFER.map(o => `${o.h}：${o.items.join("、")}`));
    sec("墓祭", W.R_GRAVE.map(g => `${g.when}　${g.h}：${g.p}`));
    sec("過去與現在", W.R_THEN_NOW.map(r => `過去：${r.then}。現在：${r.now}`));
    sec("學者怎麼看", W.R_WHY.map(r => `${r.who}〈${r.h}〉：${r.p}`));
  }
  if (file === "guide.html") {
    sec("匾額故事", W.PLAQUES.map(x => `「${x.text}」（${x.kind}・${x.person}・${x.year}）：${x.hook}${x.who}`));
    const names = Object.fromEntries(W.HALLS.map(h => [h.id, h.name]));
    sec("各祠匾額清冊（2014 年彩繪調查）", Object.entries(W.PLAQUE_LIST.halls).map(([id, rows]) => `${names[id] || id}（${rows.length} 面）：${rows.map(r => r[1]).join("、")}`));
    sec("家廟彩繪尋寶", W.HUNT.items.map(x => `${x.t}（${x.zone}・${x.where}）：${x.mean}`));
  }
  return S;
}
const srcList = () => W.SOURCES.slice().sort((a, b) => a.id - b.id).map(s => `${s.id}. ${s.title}${s.url ? " " + s.url : ""}`);

/* ---------- 寫入每頁 ---------- */
const MARK = /<!--SEO:START-->[\s\S]*?<!--SEO:END-->\n?/g;
for (const p of PAGES) {
  const f = path.join(ROOT, p.file);
  let h = fs.readFileSync(f, "utf8").replace(MARK, "");
  h = h.replace(/<title>[\s\S]*?<\/title>\n?/, "").replace(/<meta name="description"[^>]*>\n?/, "");
  const url = BASE + (p.file === "index.html" ? "" : p.file);
  const head = `<!--SEO:START-->
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="zh_TW">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="text/plain" title="給 AI 的網站介紹" href="llms.txt">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}");</script>
<script type="application/ld+json">
${pageLD(p)}
</script>
<!--SEO:END-->
`;
  h = h.replace(/(<meta name="viewport"[^>]*>\n)/, `$1${head}`);
  const S = sections(p.file);
  const body = `<!--SEO:START-->
<noscript><article class="seo-text">
<h1>${esc(p.title)}</h1>
<p>${esc(p.desc)}</p>
${S.map(s => `<h2>${esc(s.h)}</h2>\n<ul>\n${s.items.map(i => `<li>${esc(i)}</li>`).join("\n")}\n</ul>`).join("\n")}
<p>網站其他頁面：${PAGES.filter(x => x !== p).map(x => `<a href="${x.file}">${esc(x.name)}</a>`).join("、")}。給 AI 的完整文字版：<a href="llms-full.txt">llms-full.txt</a>。</p>
</article></noscript>
<!--SEO:END-->
`;
  h = h.replace(/(<body[^>]*>\n)/, `$1${body}`);
  fs.writeFileSync(f, h);
}

/* ---------- llms.txt / llms-full.txt ---------- */
const intro = `${PAGES[0].desc}\n\n本站由編者整理文獻與田野資料，內容改寫自學術論文、政府委託調查報告與新聞，各段附出處編號。族譜只列已過世的先人。`;
fs.writeFileSync(path.join(ROOT, "llms.txt"), `# ${SITE_NAME}

> ${PAGES[0].desc}

${intro.split("\n\n")[1]}

## 頁面
${PAGES.map(p => `- [${p.name}](${BASE}${p.file === "index.html" ? "" : p.file})：${p.desc}`).join("\n")}

## 完整文字版
- [llms-full.txt](${BASE}llms-full.txt)：全站內容的純文字版，含出處清單。

## 重點事實
- 地點：臺灣金門縣金湖鎮瓊林里，金門島中央。
- 開基祖：南宋初年蔡十七郎入贅平林陳家；五世祖靜山公是今日族人的共同祖先。
- 九房：竹溪派（上坑墘、下坑墘、前坑墘、大厝）、樂圃派（新倉長房、新倉上二房、新倉下二房、新倉三房、前庭）；分住大厝甲、坑墘甲、樓仔下甲、大宅甲四甲。
- 七座八祠：七棟建築、八座宗祠（樂圃公宗祠與廷輔公宗祠同棟），國定古蹟。
- 明代進士：蔡貴易（1568）、蔡守愚（1586）、蔡獻臣（1589）、蔡懋賢（1589）、蔡國光（1634）；清代進士蔡廷蘭（1845）；武將蔡攀龍官至提督。
- 春秋二祭：農曆二月初七、十月初六（另有二月初六、十月初七一說），2011 年登錄為金門縣無形文化資產。
`);
fs.writeFileSync(path.join(ROOT, "llms-full.txt"), `# ${SITE_NAME}（全站文字版）

${intro}
網址：${BASE}
更新：${W.SITE.updated}

${PAGES.map(p => `\n## ${p.name}｜${p.title}\n${BASE}${p.file === "index.html" ? "" : p.file}\n\n${p.desc}\n\n${sections(p.file).map(s => `### ${s.h}\n${s.items.map(i => "- " + i).join("\n")}`).join("\n\n")}`).join("\n")}

## 出處
${srcList().join("\n")}
`);

/* ---------- sitemap.xml / robots.txt ---------- */
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map(p => `  <url><loc>${BASE}${p.file === "index.html" ? "" : p.file}</loc><lastmod>${W.SITE.updated}</lastmod></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `# 歡迎搜尋引擎與 AI 讀取本站
User-agent: *
Allow: /

Sitemap: ${BASE}sitemap.xml
`);
console.log("done:", PAGES.length, "pages, llms.txt, llms-full.txt, sitemap.xml, robots.txt");
