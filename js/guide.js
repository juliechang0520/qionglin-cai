/* 現場導覽：拍照 → 讀取照片位置 → 選宗祠 → 選匾額 → 故事
   第二階段會在 recognize() 加入離線影像辨識（目前回傳 null，改走選單） */
(function(){
if(document.body.dataset.page!=="guide")return;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const H={};HALLS.forEach(h=>H[h.id]=h);
const hallName=id=>(H[id]?H[id].name:id);
const srcLink=i=>{const s=SOURCES.find(x=>x.id==i);return s?`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a></li>`:"";};

/* ---------- 匾額圖（有照片用照片，沒有用插圖） ---------- */
function plaqueSVG(t){const n=[...t].length,fs=n<=2?120:n<=4?86:n<=7?58:Math.floor(400/n)-4;
  return `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="600" height="300" fill="#EDE7DD"/><rect x="40" y="55" width="520" height="190" fill="#2A1C16"/><rect x="52" y="67" width="496" height="166" fill="none" stroke="#B08A3E" stroke-width="5"/><rect x="62" y="77" width="476" height="146" fill="none" stroke="#B08A3E" stroke-width="1.5" opacity=".6"/><text x="300" y="${150+fs*0.35}" text-anchor="middle" font-size="${fs}" fill="#D9B46A" font-family="'Noto Serif TC','Songti TC',serif" letter-spacing="${n<=2?40:n<=7?12:2}">${esc(t)}</text></svg>`;}
const EXT=["jpg","jpeg","png","webp","JPG"];
function plaqueImg(p){const d=document.createElement("div");d.className="ph plq";d.innerHTML=plaqueSVG(p.text);
  let i=0;const nx=()=>{if(i>=EXT.length)return;const im=new Image();im.onload=()=>{im.alt=p.person+" "+p.text;d.innerHTML="";d.appendChild(im);};im.onerror=nx;im.src=`images/plaque-${p.id}.${EXT[i++]}`;};nx();return d;}

/* ---------- 步驟指示 ---------- */
const step=n=>$$(".g-steps li").forEach(li=>li.classList.toggle("on",+li.dataset.s<=n));

/* ---------- 圖鑑 ---------- */
const card=p=>`<button class="plq-card" data-p="${p.id}"><div class="plq-slot" data-p="${p.id}"></div><div class="k">${esc(p.kind)}・${esc(p.year)}</div><h3>${esc(p.person)}</h3><p>${esc(p.hook)}</p></button>`;
function fillSlots(root){root.querySelectorAll(".plq-slot").forEach(s=>{const p=PLAQUES.find(x=>x.id==s.dataset.p);s.replaceWith(plaqueImg(p));});}
function drawAll(h){const g=$("#pl-grid");g.innerHTML=PLAQUES.filter(p=>h=="all"||p.halls.includes(h)).map(card).join("");fillSlots(g);}
const hallsWith=[...new Set(PLAQUES.flatMap(p=>p.halls))];
$("#pl-chips").innerHTML=[["all","全部"],...HALLS.filter(h=>hallsWith.includes(h.id)).map(h=>[h.id,h.name.replace(/（.*）/,"")])].map(([v,l],i)=>`<button class="chip${i?"":" on"}" data-v="${v}">${esc(l)}</button>`).join("");
$("#pl-chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;$$("#pl-chips .chip").forEach(x=>x.classList.toggle("on",x==b));drawAll(b.dataset.v);};
drawAll("all");
document.addEventListener("click",e=>{const c=e.target.closest(".plq-card");if(c){location.hash="p-"+c.dataset.p;}});

/* ---------- 讀照片 EXIF 的 GPS（只支援 JPEG） ---------- */
function exifGPS(buf){try{const v=new DataView(buf);if(v.getUint16(0)!==0xFFD8)return null;let o=2;
  while(o<v.byteLength){const m=v.getUint16(o);if(m===0xFFE1&&v.getUint32(o+4)===0x45786966){const t=o+10,le=v.getUint16(t)===0x4949;
      const u16=a=>v.getUint16(a,le),u32=a=>v.getUint32(a,le);const ifd0=t+u32(t+4);let gps=0;
      for(let i=0,n=u16(ifd0);i<n;i++){const e=ifd0+2+i*12;if(u16(e)===0x8825)gps=t+u32(e+8);}
      if(!gps)return null;const r={};
      for(let i=0,n=u16(gps);i<n;i++){const e=gps+2+i*12,tag=u16(e);
        if(tag===1||tag===3)r[tag]=String.fromCharCode(v.getUint8(e+8));
        if(tag===2||tag===4){const a=t+u32(e+8),q=k=>u32(a+k*8)/u32(a+k*8+4);r[tag]=q(0)+q(1)/60+q(2)/3600;}}
      if(r[2]==null||r[4]==null)return null;return [r[1]==="S"?-r[2]:r[2], r[3]==="W"?-r[4]:r[4]];}
    if((m&0xFF00)!==0xFF00)break;o+=2+v.getUint16(o+2);}}catch(e){}return null;}
const dist=(a,b)=>{const R=6371000,r=x=>x*Math.PI/180,dl=r(b[0]-a[0]),dn=r(b[1]-a[1]);const h=Math.sin(dl/2)**2+Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h));};
function nearestHall(pt){let best=null;Object.entries(GEO.halls).forEach(([id,c])=>{if(!c)return;const d=dist(pt,c);if(!best||d<best.d)best={id,d};});return best&&best.d<60?best.id:null;}

/* 第二階段：離線影像辨識（尚未啟用） */
async function recognize(img){return null;}

/* ---------- 流程 ---------- */
function showFlow(html){$("#flow").hidden=false;$("#story").hidden=true;$("#flow-in").innerHTML=html;$("#flow").scrollIntoView({behavior:"smooth"});}
function askHall(msg,thumb,guess){step(2);
  showFlow(`<div class="flow-grid">${thumb?`<img class="g-thumb" src="${thumb}" alt="你的照片">`:""}<div><p class="g-msg">${msg}</p><h2 class="h2" style="font-size:32px">你在哪座宗祠？</h2>
  <div class="hall-pick">${HALLS.filter(h=>hallsWith.includes(h.id)).map(h=>`<button class="chip${h.id==guess?" on":""}" data-h="${h.id}">${esc(h.name)}</button>`).join("")}</div></div></div><div id="pick"></div>`);
  $("#flow-in").querySelector(".hall-pick").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;$$(".hall-pick .chip").forEach(x=>x.classList.toggle("on",x==b));pickPlaque(b.dataset.h);};
  if(guess)pickPlaque(guess);}
function pickPlaque(h){step(3);const list=PLAQUES.filter(p=>p.halls.includes(h));
  $("#pick").innerHTML=`<h3 class="pick-h">${esc(hallName(h))}裡的匾額：哪一面是你拍的？</h3><div class="plaques">${list.map(card).join("")}</div>`;fillSlots($("#pick"));}
$("#g-file").onchange=async e=>{const f=e.target.files[0];if(!f)return;step(1);const url=URL.createObjectURL(f);
  const buf=await f.arrayBuffer();const gps=exifGPS(buf);const rec=await recognize(url);
  if(rec){location.hash="p-"+rec;return;}
  if(!gps)return askHall("這張照片沒有位置資訊（有些手機上傳時會移除）。沒關係，請直接選宗祠。",url);
  const d=dist(gps,GEO.center);
  if(d>GEO.radius)return askHall(`這張照片是在離瓊林約 ${(d/1000).toFixed(1)} 公里的地方拍的，可能不是在瓊林。你也可以直接選宗祠：`,url);
  const h=nearestHall(gps);askHall(h?`照片位置在「${hallName(h)}」附近。`:"照片是在瓊林拍的。請選你所在的宗祠：",url,h);};
$("#g-locate").onclick=()=>{if(!navigator.geolocation)return askHall("你的瀏覽器不支援定位，請直接選宗祠。");
  $("#g-locate").textContent="定位中…";
  navigator.geolocation.getCurrentPosition(pos=>{$("#g-locate").textContent="用手機定位找宗祠";const pt=[pos.coords.latitude,pos.coords.longitude],d=dist(pt,GEO.center);
    if(d>GEO.radius)return askHall(`你目前離瓊林約 ${(d/1000).toFixed(1)} 公里。不在現場也可以先逛逛：`);
    const h=nearestHall(pt);askHall(h?`你在「${hallName(h)}」附近。`:"你在瓊林！請選你所在的宗祠：",null,h);},
  ()=>{$("#g-locate").textContent="用手機定位找宗祠";askHall("無法取得定位（可能沒有開放權限）。請直接選宗祠：");},{enableHighAccuracy:true,timeout:10000});};

/* ---------- 故事頁 ---------- */
function journeySVG(p){const pts=p.journey.map(j=>PLACES[j.place]||PLACES["瓊林"]);const used=[...new Set(p.journey.map(j=>j.place))];
  const V=q=>`${q.x*6},${q.y*6}`;
  return `<svg viewBox="0 0 600 600" class="jmap"><rect width="600" height="600" fill="var(--paper)"/>
  <path d="M330 600 C 360 500 420 430 430 360 C 440 300 380 250 360 180 C 340 110 330 60 300 0" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="2 8"/>
  <text x="560" y="420" font-size="13" fill="var(--ink-2)" text-anchor="end" writing-mode="tb" letter-spacing="6">臺灣海峽</text>
  <polyline points="${pts.map(V).join(" ")}" fill="none" stroke="var(--line)" stroke-width="2"/>
  <polyline id="jtrail" points="${V(pts[0])}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
  ${used.map(k=>{const q=PLACES[k];return `<g><circle cx="${q.x*6}" cy="${q.y*6}" r="6" fill="var(--paper)" stroke="var(--ink)" stroke-width="2"/><text x="${q.x*6+(q.x>70?-12:12)}" y="${q.y*6+5}" font-size="16" text-anchor="${q.x>70?"end":"start"}" fill="var(--ink)" font-family="var(--serif)">${esc(q.label)}</text></g>`;}).join("")}
  <circle id="jdot" cx="${pts[0].x*6}" cy="${pts[0].y*6}" r="11" fill="var(--accent)"/></svg>`;}
function showStory(id){const p=PLAQUES.find(x=>x.id==id);if(!p)return;step(4);
  const i=PLAQUES.indexOf(p),prev=PLAQUES[(i-1+PLAQUES.length)%PLAQUES.length],next=PLAQUES[(i+1)%PLAQUES.length];
  $("#story-in").innerHTML=`<a href="#all" class="back">← 回到匾額圖鑑</a>
  <div class="st-top"><div id="st-img"></div><div><span class="tag">${esc(p.kind)}</span><h1 class="st-title">${esc(p.text)}</h1><p class="st-hook">${esc(p.hook)}</p>
    <div class="label st-label"><b>${esc(p.person)}</b>　${esc(p.gen)}・${esc(p.branch)}<br>${esc(p.year)}　${esc(p.rank)}<br>掛在：${p.halls.length?p.halls.map(hallName).map(esc).join("、"):"待補"}</div></div></div>
  <div class="st-block"><div class="eyebrow">WHO</div><p class="st-big">${esc(p.who)}</p></div>
  ${p.clues?`<div class="st-block"><div class="eyebrow">CASE NOTES</div><h2 class="h2" style="font-size:34px">偵探筆記</h2><p class="clue-q">${esc(p.clues.q)}</p>
    <ol class="clues">${p.clues.items.map((c,k)=>`<li><span class="cn">線索 ${k+1}</span><h3>${esc(c.t)}${c.tbd?'<span class="tag grey">待查</span>':""}</h3><p>${esc(c.text)}${[].concat(c.src||[]).map(n=>`<sup class="src"><a href="#src-${n}">${n}</a></sup>`).join("")}</p></li>`).join("")}</ol>
    <div class="yrs">${p.clues.years.map(y=>`<div><small>${esc(y.k)}</small><b>${esc(y.v)}</b><p>${esc(y.note)}</p></div>`).join("")}</div>
    <p class="verdict">${esc(p.clues.verdict)}${p.clues.byEditor?'<span class="tag grey">編者推論</span>':""}</p></div>`:""}
  <div class="st-block"><div class="eyebrow">JOURNEY</div><h2 class="h2" style="font-size:34px">${esc(p.journeyTitle||"他的路")}</h2>
    <div class="journey"><div>${journeySVG(p)}</div><div><ol class="jsteps">${p.journey.map((j,k)=>`<li data-k="${k}"><b>${esc(j.place)}</b>${esc(j.what)}</li>`).join("")}</ol>
    <div class="strip-nav"><button id="j-prev" aria-label="上一站">←</button><button id="j-next" aria-label="下一站">→</button><span class="small muted" style="align-self:center;margin-left:8px">一站一站往下走</span></div>
    <p class="small muted" style="margin-top:14px">地圖為示意，非實際比例。考試地點依明清制度：縣試在縣城、府試院試在府城、鄉試在福建省城福州、會試殿試在北京。</p></div></div></div>
  <div class="st-block grid c2"><div><div class="eyebrow">CONTEXT</div><h3 style="font-size:24px;margin-bottom:10px">那個年代</h3><ul class="st-list">${p.context.map(c=>`<li>${esc(c)}</li>`).join("")}</ul></div>
    ${p.modern?`<div><div class="eyebrow">TODAY</div><h3 style="font-size:24px;margin-bottom:10px">換算成現代</h3><p class="big-modern" style="font-size:20px">${esc(p.modern)}</p></div>`:""}</div>
  ${p.classic?(()=>{const s=SOURCES.find(x=>x.id==p.classic.src);return `<div class="st-block"><div class="classic" style="border-top:1px solid var(--ink);padding-right:0"><div class="from">原文</div><div class="text">${esc(p.classic.text)}</div><div class="plain">${esc(p.classic.plain)}</div>${s?`<a class="lk" href="${esc(s.url)}" target="_blank" rel="noopener">出處：${esc(s.title)} ↗</a>`:""}</div></div>`;})():""}
  <div class="st-block small"><details class="more"><summary>資料來源</summary><div><ul>${p.src.map(srcLink).join("")}</ul>${/推定|待/.test(p.gen+p.branch+p.year)?"<p>標示「推定」「待補」的部分，等族譜確認後更新。</p>":""}</div></details></div>
  <div class="st-nav"><a href="#p-${prev.id}">← ${esc(prev.person)}「${esc(prev.text)}」</a><a href="#p-${next.id}">${esc(next.person)}「${esc(next.text)}」→</a></div>`;
  $("#st-img").appendChild(plaqueImg(p));
  $("#story").hidden=false;$("#flow").hidden=true;$("#story").scrollIntoView();
  // 旅程動畫
  const pts=p.journey.map(j=>PLACES[j.place]||PLACES["瓊林"]);let k=0;
  const go=n=>{k=Math.max(0,Math.min(pts.length-1,n));const dot=$("#jdot");dot.setAttribute("cx",pts[k].x*6);dot.setAttribute("cy",pts[k].y*6);
    $("#jtrail").setAttribute("points",pts.slice(0,k+1).map(q=>`${q.x*6},${q.y*6}`).join(" "));$$(".jsteps li").forEach((li,j)=>{li.classList.toggle("on",j==k);li.classList.toggle("done",j<k);});};
  $("#j-prev").onclick=()=>go(k-1);$("#j-next").onclick=()=>go(k+1);$(".jsteps").onclick=e=>{const li=e.target.closest("li");if(li)go(+li.dataset.k);};go(0);}
/* ---------- 各祠匾額清冊（plaques.js 的 PLAQUE_LIST） ---------- */
const GL={};(window.GLOSSARY||[]).forEach(g=>GL[g.term]=g);
const rich=t=>esc(t).replace(/\[\[(.+?)\]\]/g,(m,k)=>GL[k]?`<button class="term" data-t="${k}">${k}</button>`:k);
const srcSup=n=>`<sup class="src"><a href="#src-${n}">${n}</a></sup>`;
$("#pl-count").textContent=PLAQUES.length;
if(window.PLAQUE_LIST){
  const PL=PLAQUE_LIST.halls,ids=Object.keys(PL),total=ids.reduce((a,k)=>a+PL[k].length,0);
  $("#pl-list-lead").innerHTML=`${PLAQUE_LIST.surveyed} 年的彩繪調查逐面登錄了七座八祠的木匾，共 ${total} 面${srcSup(PLAQUE_LIST.src)}。選一座祠堂，到現場對照看看。有故事的匾會標出來，點了就能看。`;
  $("#pl-list-hint").innerHTML="位置照調查報告的編號：三川殿是入口那一進，正廳是供奉神主那一進，「背面」是同一根[[檁]]的另一面。尺寸單位是公分。報告只登錄匾文，沒有逐面記錄立匾人，所以清冊不寫人名。".replace(/\[\[(.+?)\]\]/g,(m,k)=>`<button class="term" data-t="${k}">${k}</button>`);
  const short=id=>hallName(id).replace(/（.*）/,"");
  $("#pl-list-chips").innerHTML=ids.map((id,i)=>`<button class="chip${i?"":" on"}" data-v="${id}">${esc(short(id))}・${PL[id].length}</button>`).join("");
  const stories=(h,t)=>PLAQUES.filter(p=>p.halls.includes(h)&&(p.text==t||(p.alias||[]).includes(t)));
  const tally=rows=>{const c={};rows.forEach(r=>c[r[1]]=(c[r[1]]||0)+1);return Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<span>${esc(t)}${n>1?` ×${n}`:""}</span>`).join("");};
  const drawList=h=>{const rows=PL[h];
    $("#pl-list").innerHTML=`<div class="inv-sum"><b>${esc(hallName(h))}</b>　${rows.length} 面<div class="inv-tally">${tally(rows)}</div></div>
    <div class="cmp-wrap"><table class="cmp inv"><thead><tr><th>位置</th><th>匾文</th><th>尺寸</th><th>新舊</th><th>故事・備註</th></tr></thead><tbody>${rows.map(r=>{const st=stories(h,r[1]);
      return `<tr><td>${esc(r[0])}</td><td class="n">${esc(r[1])}</td><td class="sz">${esc(r[2]||"—")}</td><td><span class="tag${/新/.test(r[3])?" grey":""}">${esc(r[3]||"未記")}</span></td><td>${st.length>1?'<span class="or">可能是</span>':""}${st.map(p=>`<a class="inv-st" href="#p-${p.id}">${esc(p.person)}</a>`).join("、")}${r[4]?`<div class="inv-note">${esc(r[4])}</div>`:""}</td></tr>`;}).join("")}</tbody></table></div>`;};
  $("#pl-list-chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;$$("#pl-list-chips .chip").forEach(x=>x.classList.toggle("on",x==b));drawList(b.dataset.v);};
  drawList(ids[0]);
}

/* ---------- 家廟彩繪尋寶（hunt.js 的 HUNT） ---------- */
if(window.HUNT){
  const KEY="ql-hunt-found";let found={};try{found=JSON.parse(localStorage.getItem(KEY)||"{}")||{};}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(found));}catch(e){}};
  $("#hunt-lead").innerHTML=esc(HUNT.intro)+srcSup(HUNT.src);
  $("#hunt-hint").textContent=HUNT.howto+" 「找到了」只記在這支手機的瀏覽器裡。";
  const zones=[["all","全部"],["三川殿","三川殿（入口）"],["正廳","正廳（神主）"],["exam","科舉暗號"]];let cur="all";
  $("#hunt-chips").innerHTML=zones.map(([v,l],i)=>`<button class="chip${i?"":" on"}" data-v="${v}">${l}</button>`).join("");
  const score=()=>{const n=HUNT.items.filter(x=>found[x.id]).length;$("#hunt-score").innerHTML=`找到 <b>${n}</b> / ${HUNT.items.length}${n?' <button class="hunt-reset" type="button">重來</button>':""}`;};
  const drawHunt=()=>{$("#hunt-grid").innerHTML=HUNT.items.filter(x=>cur=="all"||(cur=="exam"?x.exam:x.zone==cur)).map(x=>{const p=x.link&&PLAQUES.find(q=>q.id==x.link);
    return `<article class="hunt-card${found[x.id]?" got":""}" data-id="${x.id}"><div class="hk"><span class="tag">${esc(x.zone)}</span><span class="tag grey">${esc(x.cat)}</span>${x.exam?'<span class="tag fill">科舉暗號</span>':""}</div>
      <h3>${esc(x.t)}</h3><dl><dt>去哪找</dt><dd>${rich(x.where)}</dd><dt>找什麼</dt><dd>${esc(x.look)}</dd></dl>
      <details><summary>看寓意</summary><p>${esc(x.mean)}</p>${p?`<a class="inv-st" href="#p-${p.id}">相關匾額：${esc(p.person)}「${esc(p.text)}」</a>`:""}</details>
      <button class="hunt-got" type="button">${found[x.id]?"✓ 找到了":"我找到了"}</button></article>`;}).join("");score();};
  $("#hunt-chips").onclick=e=>{const b=e.target.closest(".chip");if(!b)return;$$("#hunt-chips .chip").forEach(x=>x.classList.toggle("on",x==b));cur=b.dataset.v;drawHunt();};
  $("#hunt-grid").onclick=e=>{const b=e.target.closest(".hunt-got");if(!b)return;const id=b.closest(".hunt-card").dataset.id;if(found[id])delete found[id];else found[id]=1;save();drawHunt();};
  $("#hunt-score").onclick=e=>{if(e.target.closest(".hunt-reset")){found={};save();drawHunt();}};
  drawHunt();
}
function route(){const h=location.hash.slice(1);if(h.startsWith("p-"))showStory(h.slice(2));else{$("#story").hidden=true;}}
addEventListener("hashchange",route);route();
})();
