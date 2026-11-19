/* 瓊林蔡氏網站主程式：共用版頭版尾＋各頁內容，資料來自 data.js / news.js */
(function(){
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const G={};(window.GLOSSARY||[]).forEach(g=>G[g.term]=g);
const rich=t=>esc(t).replace(/\[\[(.+?)\]\]/g,(m,k)=>G[k]?`<button class="term" data-t="${k}">${k}</button>`:k);
const src=n=>n==null?"":[].concat(n).map(i=>`<sup class="src"><a href="#src-${i}">${i}</a></sup>`).join("");
const page=document.body.dataset.page;
const set=(sel,html)=>{const el=$(sel);if(el)el.innerHTML=html;return el;};

/* ---------- 版頭・版尾（改選單只要改這裡） ---------- */
const MENU=[["index.html","今日瓊林","HOME","home"],["family.html","家族","FAMILY","family"],["architecture.html","宗祠與建築","ARCHITECTURE","arch"],["history.html","歷史","HISTORY","history"],["rites.html","祭祀","RITES","rites"],["guide.html","拍匾額聽故事","GUIDE","guide"],["en/","English","EN","en"]];
set("#site-h",`<div class="wrap"><a class="logo" href="index.html"><span class="seal">瓊<br>林</span>瓊林蔡氏</a><ul class="menu">${MENU.map(m=>`<li><a href="${m[0]}" class="${m[3]==page?"on":""}${m[3]=="guide"?" cta":""}"><small>${m[2]}</small>${m[1]}</a></li>`).join("")}</ul></div>`);
set("#site-f",`<div class="wrap"><div class="top"><div><div class="big">瓊林蔡氏</div><p>濟陽衍派・文武世家｜金門縣金湖鎮瓊林里</p>${SITE.contact?`<p class="f-contact">提供資料、勘誤或聯絡編者：<a href="mailto:${esc(SITE.contact)}">${esc(SITE.contact)}</a></p>`:""}</div><nav>${MENU.map(m=>`<a href="${m[0]}">${m[1]}</a>`).join("")}</nav></div>
<details><summary>參考資料（文中上標數字的出處）</summary><ol class="srcs">${SOURCES.map(s=>`<li id="src-${s.id}" value="${s.id}">${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`:`${esc(s.title)}<span class="muted">（紙本報告）</span>`}</li>`).join("")}</ol></details>
<p style="margin-top:30px;opacity:.7">內容整理自公開資料，歡迎宗親提供族譜、照片與勘誤。最後更新 ${esc(SITE.updated)}｜純靜態網站，不收集任何資料。</p></div>`);
// 點上標數字時自動展開出處
document.addEventListener("click",e=>{const a=e.target.closest('a[href^="#src-"]');if(a){const d=$("#site-f details");if(d)d.open=true;}});

/* ---------- 圖片：images/<id>.jpg|jpeg|png|webp，沒有就顯示插圖 ---------- */
const EXT=["jpg","jpeg","png","webp","JPG","JPEG","PNG"];let artN=0;
function fillPh(el){
  if(el.dataset.done)return;el.dataset.done=1;
  const id=el.dataset.img, kind=el.dataset.art||id;
  el.innerHTML=ART(kind,"",artN++)+`<span class="cap">${esc(id)}</span>`;
  let i=0;const next=()=>{if(i>=EXT.length)return;const im=new Image();im.onload=()=>{im.alt=el.dataset.alt||id;im.loading="lazy";el.innerHTML="";el.appendChild(im);el.classList.add("loaded");};im.onerror=next;im.src=`images/${id}.${EXT[i++]}`;};next();
}
const ph=(id,art,alt,cls)=>`<div class="ph ${cls||""}" data-img="${id}" data-art="${art||id}" data-alt="${esc(alt||"")}"></div>`;
const chips=(el,list,cur,on)=>{el.innerHTML=list.map(([v,l])=>`<button class="chip${v==cur?" on":""}" data-v="${esc(v)}">${esc(l)}</button>`).join("");el.onclick=e=>{const b=e.target.closest(".chip");if(!b)return;$$("#"+el.id+" .chip").forEach(x=>x.classList.toggle("on",x==b));on(b.dataset.v);};};
const strip=(el,arr)=>{el.innerHTML=arr.map(e=>`<div class="ev"><div class="y">${esc(e.year)}</div><h4>${esc(e.title)}</h4><p>${rich(e.text)}${src(e.src)}</p></div>`).join("");};
$$(".strip-nav").forEach(n=>{const t=$("#"+n.dataset.for);const [p,x]=n.querySelectorAll("button");p.onclick=()=>t.scrollBy({left:-300,behavior:"smooth"});x.onclick=()=>t.scrollBy({left:300,behavior:"smooth"});});

/* ================= 首頁 ================= */
if(page==="home"){
  const ch=[["family.html","第一章","家族","源流、祖譜、人物、典故","origin","scroll"],["architecture.html","第二章","宗祠與建築","七座八祠與閩南建築","hall-dazong-front","hall"],["history.html","第三章","歷史","科舉、古文、戰地歲月","war-old","tunnel"],["architecture.html#map","參訪","宗祠地圖","七座八祠怎麼走一圈","visit","village"]];
  set("#chap-list",ch.map(c=>`<a class="chap rv" href="${c[0]}">${ph(c[4],c[5],c[2])}<div class="n">${c[1]}</div><h3>${c[2]}</h3><p>${c[3]}</p></a>`).join(""));
  const list=(window.NEWS||[]).slice().sort((a,b)=>(b.pinned-a.pinned)||b.date.localeCompare(a.date));
  const draw=t=>set("#news-list",list.filter(n=>t=="全部"||n.type==t).map(n=>`<article><div class="d">${esc(n.date)}</div><div>${n.pinned?'<span class="tag fill">置頂</span>':""}<span class="tag">${esc(n.type)}</span>${n.sample?'<span class="tag grey">範例</span>':""}</div><div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p>${n.link?`<a class="go" href="${esc(n.link)}" target="_blank" rel="noopener">相關連結 →</a>`:""}</div></article>`).join("")||"<p>目前沒有公告。</p>");
  chips($("#news-chips"),[["全部","全部"],...[...new Set(list.map(n=>n.type))].map(t=>[t,t])],"全部",draw);draw("全部");
  set("#cal",CALENDAR.map(c=>`<div><div class="w">${esc(c.when)}</div><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p></div>`).join(""));
  set("#rites",RITES.map(r=>`<div class="item rule"><span class="tag">${esc(r.when)}</span><h3>${esc(r.title)}</h3><p>${rich(r.text)}</p></div>`).join(""));
  set("#visit-grid",VISIT.map(v=>`<div class="item rule"><h3>${esc(v.title)}</h3><p>${rich(v.text)}</p></div>`).join(""));
}

/* ================= 家族 ================= */
if(page==="family"){
  strip($("#timeline"),TIMELINE);
  // 族譜樹
  const flat=[];const gl=n=>typeof n.gen==="number"?`${n.gen}世`:(n.gen==="房"?"房":n.gen==="?"?"?世":`${n.gen}世`);
  const node=n=>{const i=flat.push(n)-1,k=n.children&&n.children.length;
    return `<li><button class="node${n.tbd?" tbd":""}" data-i="${i}"><span class="tg">${k?"▾":""}</span><span class="g">${gl(n)}</span>${esc(n.name)}${n.star?`<span class="st">${n.star}</span>`:""}${n.guess?'<span class="st" style="border-color:#bbb;color:#999">推定</span>':""}</button>${k?`<ul>${n.children.map(node).join("")}</ul>`:""}</li>`;};
  set("#tree",`<ul>${node(LINEAGE)}</ul>`);
  $("#tree").onclick=e=>{const b=e.target.closest(".node");if(!b)return;const n=flat[b.dataset.i],li=b.parentElement;
    if(e.target.classList.contains("tg")&&li.querySelector("ul")){li.classList.toggle("closed");e.target.textContent=li.classList.contains("closed")?"▸":"▾";return;}
    $$(".node.sel").forEach(x=>x.classList.remove("sel"));b.classList.add("sel");
    set("#t-detail",`<div class="gbig">${typeof n.gen==="number"?n.gen+" 世":n.gen==="?"?"世次待考":n.gen==="房"?"房派":n.gen+" 世"}</div><h3>${esc(n.name)}</h3><div>${n.star?`<span class="tag gold">${n.star=="武"?"武將":n.star=="文"?"科第":"鄉賢"}</span>`:""}${n.hall?`<span class="tag">${esc(n.hall)}</span>`:""}</div><p style="margin-top:12px">${rich(n.note)}</p>${n.guess?'<p class="small muted">依匾額所在宗祠與傳記資料推定，世次與父子關係待族譜確認。</p>':""}${n.tbd?'<p class="small muted">資料待補，歡迎宗親提供族譜。</p>':""}`);
    if(innerWidth<900)$("#t-detail").scrollIntoView({behavior:"smooth",block:"nearest"});};
  $("#t-open").onclick=()=>$$("#tree li").forEach(l=>{l.classList.remove("closed");const t=l.querySelector(":scope>.node .tg");if(t&&t.textContent)t.textContent="▾";});
  $("#t-close").onclick=()=>$$("#tree li").forEach(l=>{if(l.querySelector("ul")&&l.parentElement.parentElement.id!=="tree"){l.classList.add("closed");l.querySelector(":scope>.node .tg").textContent="▸";}});
  $("#c-year").oninput=e=>{const y=+e.target.value;if(!y||y<1800||y>2035){$("#c-out").textContent="";return;}const g=16+(y-1555)/30;$("#c-out").textContent=`約第 ${Math.floor(g-.8)}～${Math.ceil(g+.8)} 世`;};
  // 字輩查詢
  const ZB=window.ZIBEI||[];
  set("#zb-grid",ZB.map((c,i)=>`<button class="zb" data-i="${i}"><small>${i+1}</small>${c}</button>`).join(""));
  const zbShow=list=>{$$("#zb-grid .zb").forEach(b=>b.classList.toggle("on",list.includes(+b.dataset.i)));
    set("#zb-out",list.length?list.map(i=>`名字裡有「<b>${ZB[i]}</b>」→ 可能是<b class="g">第 ${i+1} 世</b>`).join("<br>")+(list.length>1?`<br><span class="small muted">同一個字出現兩次，要再看父祖輩的字輩確認。</span>`:""):"這個字不在字輩裡。很多人的字輩字放在「字」或「譜名」而不是身分證上的名字，可以問家中長輩。");};
  $("#zb-grid").onclick=e=>{const b=e.target.closest(".zb");if(b)zbShow([+b.dataset.i]);};
  $("#zb-q").oninput=e=>{const v=e.target.value.trim();if(!v){set("#zb-out","");$$("#zb-grid .zb").forEach(b=>b.classList.remove("on"));return;}
    const hit=[];[...v].forEach(ch=>ZB.forEach((c,i)=>{if(c==ch&&!hit.includes(i))hit.push(i);}));zbShow(hit);};
  // 族譜六修
  set("#editions",(window.EDITIONS||[]).map((e,i)=>`<div class="ed rv"><div class="n">第${"一二三四五六"[i]}修</div><div class="y">${esc(e.year)}</div><h4>${esc(e.who)}</h4><p>${rich(e.what)}${src(e.src)}</p></div>`).join(""));
  // 九房四甲
  const F9=window.FANG9;if(F9)set("#fang",`<div class="f9">${F9.pai.map(p=>`<div class="pai"><div class="pn">${esc(p.name)}<small>${esc(p.root)}</small></div><div class="fl">${p.fang.map(f=>`<span>${esc(f)}</span>`).join("")}</div></div>`).join("")}<div class="jia"><b>分住四甲</b>${F9.jia.map(j=>`<span>${esc(j)}</span>`).join("")}</div><p class="small">${rich(F9.note)}${src(F9.src)}</p></div>`);
  // 人物
  const nm={"全部":"全部","文":"文・科第","武":"武・將領","祖":"祖先","賢":"鄉賢"};
  const dp=k=>set("#p-grid",PEOPLE.filter(p=>k=="全部"||p.kind==k).map(p=>`<div class="person rv in"><div class="era">${esc(p.era)}</div><h3>${esc(p.name)}</h3><div class="t">${esc(p.title)}</div><p>${rich(p.text)}</p></div>`).join(""));
  chips($("#p-chips"),Object.entries(nm),"全部",dp);dp("全部");
  // 典故
  const ds=t=>set("#s-grid",STORIES.filter(s=>t=="全部"||s.tag==t).map(s=>`<div class="item rule"><span class="tag${s.tag=="史載"?" fill":s.tag=="傳說"?" gold":""}">${esc(s.tag)}</span><h3>${esc(s.title)}</h3><p>${rich(s.text)}</p></div>`).join(""));
  chips($("#s-chips"),[["全部","全部"],...[...new Set(STORIES.map(s=>s.tag))].map(t=>[t,t])],"全部",ds);ds("全部");
}

/* ================= 宗祠與建築 ================= */
if(page==="arch"&&window.TIERS){
  set("#tiers",TIERS.map(t=>`<div class="tier rv" style="--w:${100-(t.lv-1)*14}%"><div class="lv"><b>${t.lv}</b>${esc(t.name)}<small>${esc(t.who)}</small></div><div class="hs">${t.halls.map(h=>`<div class="h"><b>${esc(h.n)}</b><span>${esc(h.f)}</span></div>`).join("")}</div></div>`).join(""));
  set("#tiers-story",rich(TIERS_STORY)+src(30));
}
if(page==="arch"){
  set("#hall-grid",HALLS.map((h,i)=>`<button class="hall rv" data-i="${i}">${ph(h.id+"-front","hall",h.name)}<div class="one">${esc(h.one)}</div><div class="label"><b>${esc(h.name)}</b><br>${esc(h.built)}<br>燈號　${esc(h.lamp)}</div></button>`).join(""));
  const dlg=$("#hall-dlg");
  const openHall=i=>{const h=HALLS[i];
    dlg.innerHTML=`<button class="x" aria-label="關閉">×</button><div class="in">${ph(h.id+"-front","hall",h.name)}<div class="txt"><span class="tag">${esc(h.gen)}</span><h2>${esc(h.name)}</h2><div class="one">${esc(h.one)}</div>
    <dl><dt>建造</dt><dd>${esc(h.built)}</dd><dt>奉祀</dt><dd>${rich(h.worship)}</dd><dt>特色</dt><dd>${rich(h.feature)}</dd></dl>
    <details class="more"><summary>匾額、燈號與現況</summary><div><dl><dt>匾額</dt><dd>${esc(h.plaques)}</dd><dt>燈號</dt><dd>${esc(h.lamp)}</dd><dt>現況</dt><dd>${rich(h.now)}${src(h.src)}</dd></dl></div></details></div></div>`;
    dlg.querySelectorAll(".ph").forEach(fillPh);dlg.showModal();};
  $("#hall-grid").onclick=e=>{const b=e.target.closest(".hall");if(b)openHall(b.dataset.i);};
  /* 分布地圖 */
  (function(){
    const P=MAP.points, V=(x,y)=>`${x*10},${y*6.18}`, line=(pts,w,c,extra)=>`<polyline points="${pts.map(p=>V(p[0],p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra||""}/>`;
    const lanes=[[[25,45],[15,75],[4,98]],[[59,65],[76,68],[97,63]],[[65,48],[80,40],[99,46]],[[56,40],[63,22],[72,8]],[[44,76],[60,79],[80,81],[99,84]],[[84,16],[90,58],[94,100]],[[44,52],[42,75],[38,100]],[[54,56],[66,56],[84,60]]];
    const byId={};P.forEach((p,i)=>{p.n=i+1;byId[p.id]=p;});
    const JIA=MAP.jia, jiaOf=id=>JIA&&JIA.list.find(j=>j.id==id);
    let svg=`<svg viewBox="0 0 1000 618" preserveAspectRatio="none"><rect width="1000" height="618" fill="var(--paper)"/>
      <ellipse cx="640" cy="420" rx="330" ry="210" fill="var(--bg-alt)" opacity=".7"/>
      ${lanes.map(l=>line(l,3,"var(--line)")).join("")}
      ${line([[0,37],[100,-3]],14,"#E4DCCF")}${line([[0,37],[100,-3]],1,"#fff",'stroke-dasharray="10 10"')}
      ${line([[14,36],[25,45],[44,52],[54,56],[59,65],[64.5,81],[66,100]],8,"#E4DCCF")}
      ${JIA?`<g id="m-jia">${P.filter(p=>p.type=="hall"&&JIA.halls[p.id]).map(p=>{const h=JIA.halls[p.id],j=jiaOf(h.jia);return j?`<circle cx="${p.x*10}" cy="${p.y*6.18}" r="78" fill="${j.color}" opacity=".16"/><circle cx="${p.x*10}" cy="${p.y*6.18}" r="78" fill="none" stroke="${j.color}" stroke-width="1.5" stroke-dasharray="${h.guess?"5 6":"0"}" opacity=".55"/>`:"";}).join("")}</g>`:""}
      <polyline id="m-path" points="${MAP.route.map(id=>V(byId[id].x,byId[id].y)).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="7 7" opacity=".85"/>
      <text x="40" y="200" transform="rotate(-11 40 200)" font-size="15" fill="var(--ink-2)" letter-spacing="4">環島北路</text>
      <g transform="translate(950,50)"><path d="M0 -24 L7 8 L0 3 L-7 8Z" fill="var(--ink)"/><text y="26" text-anchor="middle" font-size="13" fill="var(--ink)">北</text></g></svg>`;
    const box=$("#map-box");
    box.innerHTML=svg+P.map(p=>{const h=JIA&&JIA.halls[p.id],j=h&&jiaOf(h.jia);return `<button class="pin ${p.type} lab-${p.lab||"r"}${h?" j-"+(j?"on":h.jia):""}" style="left:${p.x}%;top:${p.y}%${j?`;--jc:${j.color}`:""}" data-id="${p.id}" aria-label="${esc(p.name)}"><span class="d">${p.n}</span><span class="t">${esc(p.short||p.name)}</span></button>`;}).join("");
    const legend=`<ul class="map-legend">${P.map(p=>`<li data-id="${p.id}"><i class="${p.type}">${p.n}</i>${esc(p.name)}</li>`).join("")}</ul>`;
    const info=$("#map-info");
    let jiaOn=false;
    const jiaPanel=()=>`<h3>瓊林四甲</h3><p class="small">${rich(JIA.intro)}${src(JIA.src)}</p>
      <ul class="jia-list">${JIA.list.map(j=>`<li style="--jc:${j.color}"><i></i><div><b>${esc(j.name)}</b><span class="small muted">${esc(j.pai)}</span><br><span class="small">${j.fang.map(esc).join("、")}</span>${j.temple?`<br><span class="small muted">角頭廟：${esc(j.temple)}</span>`:""}${j.note?`<br><span class="small muted">※ ${esc(j.note)}</span>`:""}</div></li>`).join("")}
      <li class="all"><i></i><div><b>全族共有</b><br><span class="small">蔡氏家廟（大宗）</span></div></li></ul>
      <p class="small muted">${esc(JIA.common)}</p><p class="small muted">${esc(JIA.note)}${Object.values(JIA.halls).some(h=>h.guess)?"虛線圈是依房份推定的歸屬。":""}</p>
      <details class="jia-todo"><summary>待確認的資料（${JIA.todo.length}）</summary><ol>${JIA.todo.map(t=>`<li>${esc(t)}</li>`).join("")}</ol>${JIA.todoUrl?`<a class="go" href="${esc(JIA.todoUrl)}" target="_blank" rel="noopener">完整待確認清單（文獻對照文件）↗</a>`:""}</details>`;
    const home=()=>{info.innerHTML=jiaOn?jiaPanel():`<h3>點地圖上的編號</h3><p class="small muted">或從下面清單選一個地點。</p>${legend}`;$$(".pin").forEach(x=>x.classList.remove("on"));};
    const show=id=>{const p=byId[id];$$(".pin").forEach(x=>x.classList.toggle("on",x.dataset.id==id));
      let body="";if(p.type=="hall"){const i=HALLS.findIndex(h=>h.id==p.hall),h=HALLS[i];body=`<p style="font-family:var(--serif);color:var(--accent)">${esc(h.one)}</p><p class="small muted">${esc(h.built)}<br>燈號　${esc(h.lamp)}</p>${jiaOn&&JIA.halls[p.id]?(()=>{const h=JIA.halls[p.id],j=jiaOf(h.jia);return `<p class="jia-of small" style="--jc:${j?j.color:"var(--ink)"}"><b>${j?esc(j.name):"全族共有"}</b>${h.guess?'<span class="tag grey">推定</span>':""}<br>${esc(h.basis)}${src(h.src)}</p>`;})():""}<button class="go" data-hall="${i}">看這座宗祠的介紹 →</button>`;}
      else body=`<p>${rich(p.text)}</p>${p.more?`<a class="go" href="${esc(p.more)}">看專節介紹 →</a>`:""}`;
      info.innerHTML=`<div class="num">${String(p.n).padStart(2,"0")}</div><h3>${esc(p.name)}</h3>${body}<p style="margin-top:20px"><button class="go" data-home="1" style="color:var(--ink-2);border-color:var(--line)">← 回到清單</button></p>`;};
    box.onclick=e=>{const b=e.target.closest(".pin");if(b)show(b.dataset.id);};
    info.onclick=e=>{const li=e.target.closest("li[data-id]");if(li)return show(li.dataset.id);const g=e.target.closest("[data-hall]");if(g)return openHall(g.dataset.hall);if(e.target.closest("[data-home]"))home();};
    home();$("#m-note").textContent=MAP.note;
    $("#m-route").onclick=e=>{const on=e.target.classList.toggle("on");$("#m-path").style.display=on?"":"none";};
    const jb=$("#m-jia-btn");
    if(JIA&&jb){const rb=$("#m-route"),setJia=on=>{jiaOn=on;if(rb.classList.contains("on")==on)rb.click();jb.classList.toggle("on",on);box.classList.toggle("jia-on",on);$("#m-note").textContent=on?JIA.note:MAP.note;home();};
      jb.onclick=()=>setJia(!jiaOn);if(/[?&]jia=1/.test(location.search))setJia(true);}
    else if(jb)jb.remove();
    set("#map-out",MAP.outside.map(o=>`<div class="item rule"><span class="tag grey">${esc(o.where)}</span><h3>${esc(o.name)}</h3><p>${rich(o.text)}</p></div>`).join(""));
  })();
  dlg.onclick=e=>{if(e.target===dlg||e.target.classList.contains("x"))dlg.close();};
  const tb=v=>/待/.test(v)?`<span class="tbd">${esc(v)}</span>`:esc(v);
  set("#cmp",`<tr><th></th><th>宗祠</th><th>世次</th><th>一句話</th><th>建造</th><th>落數</th><th>屋脊</th><th>燈號</th><th>重要匾額</th><th>近年修復</th></tr>`+HALLS.map(h=>`<tr><td class="thumb">${ph(h.id+"-front","hall",h.name)}</td><td class="n">${esc(h.name)}</td><td>${esc(h.gen)}</td><td>${esc(h.one)}</td><td>${esc(h.built)}</td><td>${tb(h.luo)}</td><td>${tb(h.ridge)}</td><td>${esc(h.lamp)}</td><td>${esc(h.plaques)}</td><td>${tb(h.restore)}</td></tr>`).join(""));
  // 立面
  const f=$("#facade-box");f.insertAdjacentHTML("beforeend",FACADE.map((p,i)=>`<button class="hot" style="left:${p.x}%;top:${p.y}%" data-i="${i}" aria-label="${esc(p.name)}">${i+1}</button>`).join(""));
  const showF=i=>{const p=FACADE[i];$$(".hot").forEach((x,j)=>x.classList.toggle("on",j==i));set("#facade-info",`<div class="num">${String(+i+1).padStart(2,"0")}</div><h3>${esc(p.name)}</h3><p>${rich(p.text)}</p><div class="dots">${FACADE.map((q,j)=>`<button data-i="${j}" class="${j==i?"on":""}">${esc(q.name)}</button>`).join("")}</div>`);};
  f.onclick=e=>{const b=e.target.closest(".hot");if(b)showF(b.dataset.i);};
  $("#facade-info").onclick=e=>{const b=e.target.closest(".dots button");if(b)showF(b.dataset.i);};showF(0);
  // 平面
  if(window.PLAN_AERIAL)set("#plan-aerial",PLAN_AERIAL());
  set("#plan-bar",PLAN.map((p,i)=>`<button data-i="${i}" class="${i?"":"on"}"><small>0${i+1}</small><b>${esc(p.name)}</b></button>`).join(""));
  const showP=i=>set("#plan-info",`<h3 style="font-size:26px;margin-bottom:8px">${esc(PLAN[i].name)}</h3><p>${rich(PLAN[i].text)}</p>`);showP(0);
  let walkT=null;
  const pick=(i,fromWalk)=>{i=+i;$$("#plan-bar button").forEach(x=>x.classList.toggle("on",+x.dataset.i===i));
    $$("#plan-aerial .pa-glow").forEach(x=>x.classList.toggle("on",+x.dataset.i===i));
    $$("#plan-aerial .pz-lab").forEach(x=>x.classList.toggle("on",+x.dataset.i===i));showP(i);
    if(!fromWalk&&walkT){clearInterval(walkT);walkT=null;$("#plan-walk").textContent="▶ 從大門走進去";}};
  $("#plan-bar").onclick=e=>{const b=e.target.closest("button");if(b)pick(b.dataset.i);};
  const pa=$("#plan-aerial");
  if(pa){pa.onclick=e=>{const g=e.target.closest("[data-i]");if(g)pick(g.dataset.i);};
    pa.onmouseover=e=>{const g=e.target.closest(".pa-hit,.pz-lab");$$("#plan-aerial .pa-glow").forEach(x=>x.classList.toggle("hov",!!g&&x.dataset.i===g.dataset.i));};
    pa.onmouseleave=()=>$$("#plan-aerial .pa-glow").forEach(x=>x.classList.remove("hov"));
    pa.insertAdjacentHTML("beforebegin",'<div class="plan-ctl"><button type="button" class="g-btn" id="plan-walk">▶ 從大門走進去</button><span class="small muted">或直接點圖上的區塊</span></div>');
    $("#plan-walk").onclick=()=>{if(walkT){clearInterval(walkT);walkT=null;$("#plan-walk").textContent="▶ 從大門走進去";return;}
      let i=0;pick(0,true);$("#plan-walk").textContent="■ 停止";
      walkT=setInterval(()=>{i++;if(i>=PLAN.length){clearInterval(walkT);walkT=null;$("#plan-walk").textContent="↺ 再走一次";return;}pick(i,true);},2600);};
    pick(0);}
  set("#arch-grid",ARCH.map(a=>`<div class="item rv">${ph(a.img,a.id,a.term)}<h3>${esc(a.term)}</h3><p>${rich(a.text)}</p><div class="modern"><b>現代對照</b>${esc(a.modern)}</div></div>`).join(""));
  if(window.YIGU){const Y=YIGU;
    set("#yigu-intro",rich(Y.intro));
    set("#yigu-facts",Y.facts.map(f=>`<div class="item rule"><h3>${esc(f.k)}</h3><p>${rich(f.v)}${src(f.src)}</p></div>`).join(""));
    const W={fan:'<path d="M50 88 L8 40 A60 60 0 0 1 92 40 Z"/><path d="M50 88 L30 26 M50 88 L50 20 M50 88 L70 26" class="d"/>',
      vase:'<path d="M38 8 H62 V18 Q62 24 70 30 Q86 42 86 62 Q86 92 50 92 Q14 92 14 62 Q14 42 30 30 Q38 24 38 18 Z"/>',
      scroll:'<rect x="16" y="18" width="68" height="64" rx="4"/><path d="M16 18 Q6 18 6 28 Q6 36 16 36 M84 82 Q94 82 94 72 Q94 64 84 64" class="d"/><path d="M30 40 Q50 22 70 40 Q50 32 30 40 Z" class="d"/>',
      bamboo:'<rect x="20" y="8" width="60" height="84" rx="3"/><path d="M36 8 V92 M50 8 V92 M64 8 V92 M20 36 H80 M20 64 H80" class="d"/>',
      pome:'<path d="M42 10 L46 18 L50 8 L54 18 L58 10 L58 22 Q86 30 86 58 Q86 92 50 92 Q14 92 14 58 Q14 30 42 22 Z"/>'};
    const win=k=>`<svg viewBox="0 0 100 100" aria-hidden="true"><g class="yw-shape">${W[k]||W.scroll}</g></svg>`;
    set("#yw-btns",Y.windows.map((w,i)=>`<button data-i="${i}" class="${i?"":"on"}">${win(w.shape)}<span>${esc(w.name)}</span></button>`).join(""));
    const showW=i=>{const w=Y.windows[i];set("#yw-info",`<div class="yw-big">${win(w.shape)}</div><div><h3>${esc(w.name)}</h3><p>${rich(w.text)}${src(33)}</p></div>`);};showW(0);
    $("#yw-btns").onclick=e=>{const b=e.target.closest("button");if(!b)return;$$("#yw-btns button").forEach(x=>x.classList.toggle("on",x==b));showW(b.dataset.i);};
    set("#yigu-words",Y.words.map(w=>`<div class="yw-word"><b>${esc(w.t)}</b><p>${rich(w.text)}</p></div>`).join("")+`<p class="small muted">${src(33)}</p>`);
    set("#yigu-paint",`<h3 style="font-size:22px;margin-bottom:12px">${esc(Y.painting.title)}</h3><p>${rich(Y.painting.text)}${src(Y.painting.src)}</p>`);
    set("#yigu-note",esc(Y.note));
  }
  set("#craft-grid",CRAFT.map(c=>`<div class="item rule"><h3>${esc(c.name)}</h3><p>${rich(c.text)}</p><div class="modern"><b>現代對照</b>${esc(c.note)}</div></div>`).join(""));
}

/* ================= 歷史 ================= */
if(page==="history"){
  set("#ladder",EXAM.map((x,i)=>`<button class="rung${i==3?" on":""}" data-i="${i}"><small>第 ${i+1} 關</small><b>${esc(x.step)}</b><small>→ ${esc(x.get)}</small></button>`).join(""));
  const showL=i=>{const x=EXAM[i];set("#ladder-info",`<div><h3>${esc(x.step)}</h3><p class="muted">${esc(x.sub)}<br>主考　${esc(x.who)}<br>通過稱為　<b style="color:var(--ink)">${esc(x.get)}</b><br>難度　${esc(x.rate)}${src(13)}</p></div><div class="big-modern"><b>現代對照</b>${rich(x.modern)}<p class="small muted" style="font-family:var(--sans);margin-top:10px">${esc(x.note)}</p></div>`);};
  showL(3);$("#ladder").onclick=e=>{const b=e.target.closest(".rung");if(!b)return;$$(".rung").forEach(x=>x.classList.toggle("on",x==b));showL(b.dataset.i);};
  const vs=[["秀才","縣・府","取得國考應試資格，地方上受尊重"],["舉人","一省","通過全省高階國考，可任基層官"],["貢士","全國","全國數百名的頂尖考生"],["進士","皇帝親試","國考最高等級榜首＋博士學位的份量"],["知縣","正七品","縣長"],["布政使","從二品","省長或省府主要首長"],["提督","從一品","軍團或戰區司令"],["兵部尚書","部長級","國防部長"]];
  set("#vs",vs.map(v=>`<div class="row"><div class="a">${v[0]}<small>${v[1]}</small></div><div class="arrow">→</div><div class="b">${v[2]}</div></div>`).join(""));
  set("#classic-list",CLASSICS.map(c=>{const s=SOURCES.find(x=>x.id==c.src);return `<div class="classic rv"><div class="from">${esc(c.from)}</div><div class="text">${esc(c.text)}</div><div class="plain">${esc(c.plain)}</div>${s?(s.url?`<a class="lk" href="${esc(s.url)}" target="_blank" rel="noopener">出處：${esc(s.title)} ↗</a>`:`<span class="lk">出處：${esc(s.title)}</span>`):""}</div>`;}).join(""));
  $("#war-intro").textContent=WAR.intro;strip($("#war-tl"),WAR.events);
  set("#war-life",WAR.life.map(l=>`<div class="item rule"><h3>${esc(l.title)}</h3><p>${rich(l.text)}</p></div>`).join(""));
  const v=PRESERVE.verdict.split("：");
  set("#pv-verdict",`長期軍管、離島地理、解嚴後的國家公園修復，加上宗族一直在照顧，四者加起來才保存下來。<small>${rich(PRESERVE.verdict)}</small>`);
  set("#pv-reasons",PRESERVE.reasons.map((r,i)=>`<div class="item rule reason rv"><div class="n">0${i+1}</div><h3>${esc(r.title)}</h3><p>${rich(r.text)}${src(r.src)}</p></div>`).join(""));
  set("#pv-caveats",PRESERVE.caveats.map(r=>`<div class="item rule"><h3>${esc(r.title)}</h3><p>${rich(r.text)}${src(r.src)}</p></div>`).join(""));
  let cur="全部",q="";
  const dg=()=>{set("#g-grid",GLOSSARY.filter(g=>(cur=="全部"||g.cat==cur)&&(!q||(g.term+g.desc+g.modern).includes(q))).map(g=>`<div class="item" id="g-${esc(g.term)}"><span class="tag grey">${esc(g.cat)}</span><h3>${esc(g.term)}</h3><p>${esc(g.desc)}</p><div class="modern"><b>現代對照</b>${esc(g.modern)}</div></div>`).join("")||"<p>找不到這個名詞。</p>");};
  chips($("#g-chips"),[["全部","全部"],...[...new Set(GLOSSARY.map(g=>g.cat))].map(c=>[c,c])],"全部",c=>{cur=c;dg();});
  $("#g-q").oninput=e=>{q=e.target.value.trim();dg();};dg();
}

/* ================= 祭祀 ================= */
if(page==="rites"){
  set("#day",R_DAY.map((d,i)=>`<div class="ev"><div class="y">${esc(d.t)}</div><h4>${esc(d.h)}</h4><p>${rich(d.p)}</p></div>`).join(""));
  // 抽鬮
  const lotOf=n=>n<=4?R_LOTS[n-1]:n<=12?R_LOTS[4]:R_LOTS[5];
  set("#lot-list",R_LOTS.map(l=>`<div class="item rule"><span class="tag">${esc(l.n)}</span><p>${esc(l.job)}</p></div>`).join(""));
  set("#lot-note",esc(R_LOTS_NOTE)+src(31));
  $("#lot-btn").onclick=()=>{const b=$("#lot-ball");b.classList.remove("bump");void b.offsetWidth;let k=0;const t=setInterval(()=>{b.textContent=1+Math.floor(Math.random()*20);if(++k>12){clearInterval(t);const n=+b.textContent;b.classList.add("bump");set("#lot-res",`<b>你抽到第 ${n} 鬮</b>${esc(lotOf(n).job)}`);}},60);};
  // 座次
  const tab=n=>{const a=R_ANC[n];return a?`<button class="tab-s" data-n="${n}"><i>${a[0]}</i>${n}</button>`:`<span class="tab-s main"><i></i>${n.replace("考妣","")}<em>考妣</em></span>`;};
  const drawSeat=k=>{const S=R_SEATS[k];set("#seat",`<div class="seat-cap"><b>${esc(S.title)}</b>　首席：${esc(S.host)}</div>
    <div class="seat-plan"><div class="kan">祖龕</div>
    <div class="row3"><div class="side"><div class="lab">左桌・配享</div><div class="tabs">${S.left.map(tab).join("")}</div></div>
    <div class="mid"><div class="lab">主祭桌</div><div class="tabs">${S.center.map(tab).join("")}</div></div>
    <div class="side"><div class="lab">右桌・配享</div><div class="tabs">${S.right.map(tab).join("")}</div></div></div>
    <div class="front">前桌：主祭、陪祭站這裡行禮</div><div class="court">中庭：族人</div></div>
    <p class="small">${rich(S.note)}${src(31)}</p>`);set("#seat-info","點神主牌，看這位祖先是誰。");};
  chips($("#seat-chips"),[["頭停","頭停・祭始祖"],["二停","二停・祭五世祖"]],"頭停",drawSeat);drawSeat("頭停");
  $("#seat").onclick=e=>{const b=e.target.closest(".tab-s[data-n]");if(!b)return;$$(".tab-s.on").forEach(x=>x.classList.remove("on"));b.classList.add("on");const n=b.dataset.n,a=R_ANC[n];
    set("#seat-info",`<b>${n}公</b>　第 ${a[0]} 世<br>${esc(a[1])}${a[2]?`<br>本名 <b>${esc(a[2])}</b>`:""}`);};
  // 三獻禮
  let si=0;const st=()=>{const x=R_STEPS[si];set("#step",`<div class="sn">${si+1} / ${R_STEPS.length}</div><h3>${esc(x.h)}</h3><p>${rich(x.plain)}</p><div class="modern"><b>像是</b>${esc(x.modern)}</div>`);
    set("#step-dots",R_STEPS.map((_,i)=>`<button class="${i==si?"on":""}" data-i="${i}" aria-label="第${i+1}步"></button>`).join(""));};
  $("#step-prev").onclick=()=>{si=Math.max(0,si-1);st();};$("#step-next").onclick=()=>{si=Math.min(R_STEPS.length-1,si+1);st();};
  $("#step-dots").onclick=e=>{const b=e.target.closest("button");if(b){si=+b.dataset.i;st();}};st();
  set("#roles",R_ROLES.map(r=>`<div class="role rv"><div class="n">${esc(r.n)}</div><h3>${esc(r.h)}</h3><p>${rich(r.p)}</p><div class="modern"><b>現代對照</b>${esc(r.modern)}</div></div>`).join(""));
  // 祭文
  set("#jw-frame",R_TEXT.frame.map(f=>`<div class="jf"><div class="o">${esc(f.o)}</div><div class="p">${esc(f.p)}</div></div>`).join(""));
  const jw=x=>`<div class="from">${esc(x.from)}</div>${x.lines.map(l=>`<div class="jl"><div class="o">${esc(l[0])}</div><div class="p">${esc(l[1])}</div></div>`).join("")}`;
  set("#jw-1",jw(R_TEXT.first)+src(31));set("#jw-2",jw(R_TEXT.second)+src(31));
  set("#offer",R_OFFER.map(o=>`<div class="item rule"><h3>${esc(o.h)}</h3><ul class="dots">${o.items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>`).join(""));
  set("#feast-note",esc(R_FEAST_NOTE)+src(31));
  set("#grave",R_GRAVE.map(g=>`<div class="item rule"><span class="tag">${esc(g.when)}</span><h3>${esc(g.h)}</h3><p>${rich(g.p)}${src([31,32])}</p></div>`).join(""));
  set("#thennow",`<div class="tn-h"><span>過去</span><span>現在</span></div>`+R_THEN_NOW.map(r=>`<div class="tn"><div>${rich(r.then)}</div><div>${rich(r.now)}${src(r.src)}</div></div>`).join("")+`<p class="small muted">${src([31,32])}</p>`);
  set("#why",R_WHY.map(w=>`<div class="item rule"><div class="small muted">${esc(w.who)}</div><h3>${esc(w.h)}</h3><p>${rich(w.p)}${src(w.src)}</p></div>`).join(""));
  set("#editor",`<summary>${esc(R_EDITOR.title)}</summary><div>${R_EDITOR.body.map(p=>`<p>${rich(p)}</p>`).join("")}</div>`);
}

/* ---------- 名詞彈出框（全站） ---------- */
const pop=$("#pop");
document.addEventListener("click",e=>{const t=e.target.closest(".term");
  if(!t){if(!e.target.closest("#pop"))pop.hidden=true;return;}
  const g=G[t.dataset.t];if(!g)return;
  pop.innerHTML=`<b>${esc(g.term)}</b>${esc(g.desc)}<div class="m">現代對照：${esc(g.modern)}</div><div style="margin-top:8px"><a href="history.html#glossary">看名詞總表 →</a></div>`;
  const d=t.closest("dialog");(d||document.body).appendChild(pop);pop.hidden=false;
  const r=t.getBoundingClientRect(),pw=pop.offsetWidth;const left=Math.max(12,Math.min(r.left,innerWidth-pw-12));
  if(d){pop.style.position="fixed";pop.style.left=left+"px";pop.style.top=(r.bottom+8)+"px";}
  else{pop.style.position="absolute";pop.style.left=(left+scrollX)+"px";pop.style.top=(r.bottom+scrollY+8)+"px";}
});

/* ---------- 圖片與進場動畫 ---------- */
$$(".ph[data-img]").forEach(fillPh);
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target);}}),{rootMargin:"0px 0px -8% 0px"});
$$(".rv").forEach(el=>io.observe(el));
})();
