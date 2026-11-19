/* 插圖產生器：沒有照片時顯示的閩南風 SVG 插圖。換上照片後就不會顯示。 */
(function(){
const C={sky1:"#F3E6D0",sky2:"#E8D5B5",brick:"#A63A2B",brick2:"#8C3022",roof:"#3B2E28",stone:"#CFC6B6",stone2:"#B7AC99",ink:"#2B211B",gold:"#B08A3E",door:"#5B2A1C"};
const svg=(vb,body,bg)=>`<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky1}"/><stop offset="1" stop-color="${C.sky2}"/></linearGradient><pattern id="bk" width="16" height="8" patternUnits="userSpaceOnUse"><rect width="16" height="8" fill="${C.brick}"/><path d="M0 8H16M8 0V4M0 4H16M0 4V8M16 4V8" stroke="#7a2a1e" stroke-width=".7" opacity=".55"/></pattern><pattern id="tl" width="8" height="10" patternUnits="userSpaceOnUse"><rect width="8" height="10" fill="${C.roof}"/><path d="M4 0V10" stroke="#5a4840" stroke-width="2"/></pattern></defs>${bg===false?"":`<rect width="100%" height="100%" fill="url(#sk)"/>`}${body}</svg>`;
// 燕尾屋脊（x1..x2 at y, rise=r）
const ridge=(x1,x2,y,r,w)=>`<path d="M${x1-r*0.9} ${y-r} Q${x1-r*0.2} ${y+2} ${x1+r} ${y} L${x2-r} ${y} Q${x2+r*0.2} ${y+2} ${x2+r*0.9} ${y-r}" fill="none" stroke="${C.roof}" stroke-width="${w||6}" stroke-linecap="round"/><path d="M${x1-r*0.9} ${y-r} l-${r*0.35} -${r*0.25} M${x2+r*0.9} ${y-r} l${r*0.35} -${r*0.25}" stroke="${C.roof}" stroke-width="${(w||6)*0.6}" stroke-linecap="round"/>`;
const roof=(x1,x2,y,ey,ov)=>`<path d="M${x1} ${y} L${x2} ${y} L${x2+ov} ${ey} L${x1-ov} ${ey} Z" fill="url(#tl)"/>`;
function hall(x,y,w,h,opt){opt=opt||{};const ry=y-h*0.42;let s="";
  s+=roof(x+w*0.08,x+w*0.92,ry,y,w*0.06);
  s+=ridge(x+w*0.08,x+w*0.92,ry,h*0.16,Math.max(3,w/60));
  if(opt.three){const cx=x+w/2,cw=w*0.18;s+=roof(cx-cw,cx+cw,ry-h*0.12,ry+h*0.06,4)+ridge(cx-cw,cx+cw,ry-h*0.12,h*0.12,Math.max(3,w/70));}
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h*0.62}" fill="url(#bk)"/>`;
  s+=`<rect x="${x}" y="${y+h*0.48}" width="${w}" height="${h*0.14}" fill="${C.stone}"/>`;
  s+=`<rect x="${x}" y="${y}" width="${w}" height="${h*0.06}" fill="${C.stone2}"/>`;
  const dw=w*0.16;s+=`<rect x="${x+w/2-dw/2}" y="${y+h*0.16}" width="${dw}" height="${h*0.46}" fill="${C.door}"/><line x1="${x+w/2}" y1="${y+h*0.16}" x2="${x+w/2}" y2="${y+h*0.62}" stroke="${C.gold}" stroke-width="1.2"/>`;
  if(opt.side!==false){[0.26,0.74].forEach(f=>{s+=`<rect x="${x+w*f-dw*0.3}" y="${y+h*0.26}" width="${dw*0.6}" height="${h*0.36}" fill="${C.door}" opacity=".9"/>`});}
  return s;}
const ground=(y,W)=>`<rect x="0" y="${y}" width="${W}" height="400" fill="#D9CBB1"/><rect x="0" y="${y}" width="${W}" height="4" fill="#C3B394"/>`;
const label=(t,W,H)=>t?`<text x="${W-14}" y="${H-14}" text-anchor="end" font-size="${Math.round(W/32)}" fill="${C.ink}" opacity=".55" font-family="serif">${t}</text>`:"";

const A={};
A.hero=()=>{const W=1600,H=700;let s=`<rect width="${W}" height="${H}" fill="#7E2A1F"/><circle cx="1260" cy="190" r="90" fill="#E9B872" opacity=".55"/>`;
  s+=`<g opacity=".55">${hall(60,430,330,200)}${hall(1180,440,360,190)}</g>`;
  s+=`<g opacity=".85">${hall(330,400,420,240,{three:true})}${hall(860,410,380,230)}</g>`;
  s+=hall(560,380,520,300,{three:true});
  s+=`<rect x="0" y="566" width="${W}" height="140" fill="#3a1b14"/>`;
  return svg(`0 0 ${W} ${H}`,s,false);};
A.hall=(t,n)=>{const W=400,H=250;n=n||0;const three=n%2===0;let s=ground(200,W);
  s+=`<circle cx="${70+n*35}" cy="58" r="22" fill="#E9B872" opacity=".5"/>`;
  if(n%3===1)s+=`<g opacity=".5">${hall(-40,150,150,90,{side:false})}</g>`;
  if(n%3===2)s+=`<g opacity=".5">${hall(300,150,150,90,{side:false})}</g>`;
  s+=hall(80,130,240,120,{three});
  s+=`<rect x="40" y="185" width="10" height="16" fill="${C.stone2}"/><line x1="45" y1="185" x2="45" y2="70" stroke="${C.stone2}" stroke-width="3"/>`;
  return svg(`0 0 ${W} ${H}`,s+label(t,W,H));};
A.facade=()=>{const W=1000,H=560;let s=ground(500,W);
  s+=`<path d="M150 150 L850 150 L900 232 L100 232 Z" fill="url(#tl)"/>`;
  s+=`<path d="M380 110 L620 110 L650 175 L350 175 Z" fill="url(#tl)"/>`;
  s+=ridge(150,850,150,70,9)+ridge(380,620,110,40,8);
  s+=`<path d="M270 148 q20 -40 50 -38 q10 2 6 10 q-18 0 -26 14 q16 -6 22 4" fill="${C.roof}" stroke="${C.roof}" stroke-width="3"/><circle cx="312" cy="114" r="3" fill="#fff"/>`;
  s+=`<rect x="125" y="232" width="750" height="24" fill="#E9DCC2" stroke="${C.roof}" stroke-width="2"/>`;
  for(let i=0;i<14;i++)s+=`<circle cx="${150+i*52}" cy="244" r="6" fill="${i%2?C.gold:"#5d8a7a"}" opacity=".8"/>`;
  s+=`<rect x="140" y="256" width="720" height="244" fill="url(#bk)"/>`;
  s+=`<rect x="140" y="410" width="720" height="90" fill="${C.stone}"/>`;
  [370,630].forEach(x=>{s+=`<rect x="${x-10}" y="256" width="20" height="212" fill="${C.stone2}"/><rect x="${x-17}" y="466" width="34" height="34" rx="6" fill="#a89d8a"/>`;});
  s+=`<rect x="440" y="290" width="120" height="210" fill="${C.door}"/><line x1="500" y1="290" x2="500" y2="500" stroke="${C.gold}" stroke-width="3"/>`;
  [470,530].forEach(x=>{s+=`<ellipse cx="${x}" cy="350" rx="16" ry="20" fill="#c98a4b"/><rect x="${x-20}" y="370" width="40" height="70" rx="8" fill="#9d3b26"/><path d="M${x-14} 336 l14 -14 l14 14" fill="#2b211b"/>`;});
  [[270,340],[650,720]].forEach(([a,b])=>{s+=`<rect x="${a}" y="330" width="${b-a}" height="170" fill="${C.door}" opacity=".92"/>`;});
  s+=`<rect x="195" y="300" width="125" height="95" fill="#d8cfbf" stroke="#9c917e" stroke-width="3"/><path d="M215 375 q20 -40 40 -10 q20 -40 40 0" stroke="#9c917e" stroke-width="3" fill="none"/><circle cx="257" cy="330" r="10" fill="none" stroke="#9c917e" stroke-width="3"/>`;
  s+=`<rect x="680" y="300" width="125" height="95" fill="#d8cfbf" stroke="#9c917e" stroke-width="3"/><path d="M700 375 q20 -40 40 -10 q20 -40 40 0" stroke="#9c917e" stroke-width="3" fill="none"/>`;
  s+=`<rect x="44" y="470" width="34" height="32" fill="${C.stone2}"/><rect x="56" y="200" width="10" height="272" fill="#8a7f6c"/>`;
  return svg(`0 0 ${W} ${H}`,s);};
A.scroll=()=>{const W=400,H=250;let s=`<rect x="60" y="40" width="280" height="170" fill="#f8f1e3" stroke="${C.gold}" stroke-width="2"/><rect x="48" y="34" width="14" height="182" rx="6" fill="${C.brick2}"/><rect x="338" y="34" width="14" height="182" rx="6" fill="${C.brick2}"/>`;
  for(let c=0;c<9;c++)for(let r=0;r<6;r++)s+=`<rect x="${300-c*28}" y="${60+r*24}" width="12" height="12" fill="${C.ink}" opacity="${0.15+((c*7+r*3)%5)/10}"/>`;
  s+=`<rect x="90" y="60" width="40" height="40" fill="none" stroke="${C.brick}" stroke-width="2"/><text x="110" y="88" text-anchor="middle" font-size="20" fill="${C.brick}" font-family="serif">譜</text>`;
  return svg(`0 0 ${W} ${H}`,s);};
A.tunnel=()=>{const W=400,H=250;let s=`<rect width="${W}" height="${H}" fill="#4a443c"/><path d="M80 250 L80 120 Q200 20 320 120 L320 250 Z" fill="#1d1a16"/><path d="M130 250 L150 140 Q200 90 250 140 L270 250 Z" fill="#2c2822"/><path d="M175 250 L185 160 Q200 145 215 160 L225 250Z" fill="#E9B872" opacity=".35"/>`;
  for(let i=0;i<6;i++)s+=`<circle cx="${110+i*36}" cy="${120-(i%5?Math.abs(2.5-i)*10:0)}" r="3" fill="#E9B872"/>`;
  return svg(`0 0 ${W} ${H}`,s,false);};
A.rite=()=>{const W=400,H=250;let s=ground(190,W)+hall(70,110,260,120,{three:true});
  for(let i=0;i<9;i++)s+=`<g transform="translate(${60+i*34},${196+(i%2)*8})"><circle cx="0" cy="0" r="7" fill="#3b2e28"/><rect x="-8" y="6" width="16" height="26" rx="5" fill="${i%3?"#2b3f5c":"#5a3a2a"}"/></g>`;
  s+=`<rect x="185" y="175" width="30" height="14" fill="${C.gold}"/>`;
  return svg(`0 0 ${W} ${H}`,s);};
A.village=()=>{const W=400,H=250;let s=ground(200,W);
  [[-20,150,130,70],[100,140,140,80],[230,150,130,70],[330,145,120,75]].forEach(([x,y,w,h],i)=>{s+=hall(x,y,w,h,{side:false,three:i==1});});
  s+=`<path d="M0 230 Q200 210 400 236" stroke="#bfae8c" stroke-width="8" fill="none"/>`;
  return svg(`0 0 ${W} ${H}`,s);};
// 建築語彙小圖
A["arch-yanwei"]=()=>svg("0 0 400 300",`<path d="M40 220 L360 220 L360 300 L40 300Z" fill="url(#tl)"/>`+ridge(90,310,220,110,16));
A["arch-longyin"]=()=>svg("0 0 400 300",`<rect x="0" y="210" width="400" height="90" fill="url(#tl)"/><rect x="0" y="200" width="400" height="14" fill="${C.roof}"/><path d="M150 205 q10 -90 90 -110 q30 -6 40 14 q-30 0 -50 20 q40 -10 50 20 q-30 -6 -44 10 q20 10 10 40 Z" fill="${C.roof}"/><circle cx="262" cy="112" r="6" fill="#fff"/>`);
A["arch-qigan"]=()=>svg("0 0 400 300",ground(240,400)+`<rect x="150" y="200" width="30" height="50" fill="${C.stone2}"/><rect x="220" y="200" width="30" height="50" fill="${C.stone2}"/><rect x="190" y="20" width="20" height="230" fill="#8a7f6c"/><path d="M210 30 L300 50 L210 70Z" fill="${C.brick}"/>`);
A["arch-sanchuan"]=()=>svg("0 0 400 300",ground(250,400)+hall(50,150,300,140,{three:true}));
A["arch-menshen"]=()=>{let s=`<rect x="80" y="20" width="240" height="280" fill="${C.door}"/><line x1="200" y1="20" x2="200" y2="300" stroke="${C.gold}" stroke-width="4"/>`;[140,260].forEach(x=>{s+=`<ellipse cx="${x}" cy="100" rx="30" ry="36" fill="#c98a4b"/><path d="M${x-28} 70 l28 -30 l28 30" fill="${C.ink}"/><rect x="${x-40}" y="136" width="80" height="140" rx="14" fill="#9d3b26"/><rect x="${x-40}" y="180" width="80" height="12" fill="${C.gold}"/>`;});return svg("0 0 400 300",s);};
A["arch-luo"]=()=>svg("0 0 400 300",ground(260,400)+`<g opacity=".45">${hall(110,120,180,90,{side:false})}</g><g opacity=".7">${hall(80,160,240,100,{side:false})}</g>${hall(50,200,300,100)}`);
A["arch-fengshi"]=()=>svg("0 0 400 300",ground(270,400)+`<rect x="150" y="250" width="100" height="24" fill="${C.stone2}"/><path d="M160 250 L165 150 Q160 100 200 90 Q240 100 235 150 L240 250Z" fill="#d6cdbd" stroke="#9c917e" stroke-width="3"/><circle cx="200" cy="80" r="42" fill="#d6cdbd" stroke="#9c917e" stroke-width="3"/><circle cx="186" cy="74" r="5" fill="${C.ink}"/><circle cx="214" cy="74" r="5" fill="${C.ink}"/><path d="M182 96 q18 14 36 0" stroke="${C.brick}" stroke-width="4" fill="none"/><path d="M200 130 v-0" /><rect x="238" y="120" width="6" height="110" fill="#8a7f6c"/><path d="M244 122 l40 10 l-40 12z" fill="${C.brick}"/>`);
A["arch-brick"]=()=>svg("0 0 400 300",`<rect width="400" height="210" fill="url(#bk)"/><rect y="210" width="400" height="90" fill="${C.stone}"/><path d="M0 210 H400" stroke="#9c917e" stroke-width="4"/><path d="M0 255 H400 M100 210 V300 M240 210 V300" stroke="#a89d8a" stroke-width="2"/>`);

window.ART=function(kind,label,n){
  if(A[kind])return A[kind](label,n);
  if(kind.startsWith("hall"))return A.hall(label,n);
  if(kind.startsWith("war"))return A.tunnel();
  return A.hall(label,n);
};
/* ---------- 宗祠鳥瞰示意圖（「由前到後，走進宗祠」用） ----------
   通用二進宗祠，格局參考大宗家廟；等角鳥瞰，正廳屋頂掀開以看見內部。
   座標：u 左右（-8~8）、v 由前往後（前埕 -1~7、三川門 7~11、天井與兩廊 11~16、正廳 16~22）、z 高度。
   PLAN_ZONES 是六個區塊的地面範圍，互動時用來畫亮框，順序對應 data.js 的 PLAN。 */
window.PLAN_ZONES=[[[-10,10,0,6.6,0.3]],[[-8,8,7,11,7]],[[-4,4,11,16,0.1]],[[-8,-4,11,16,3.9],[4,8,11,16,3.9]],[[-8,8,16,22,5]],[[-3.6,3.6,18.8,21.6,4.1]]];
window.PLAN_AERIAL=function(opt){opt=opt||{};const LB=opt.labels||["前埕","三川門","天井","兩廊","正廳","祖龕"],NT=opt.notes||["示意圖：通用二進宗祠，格局參考大宗家廟，非實際比例","虛線：正廳屋頂（已掀開）"];
  const k=14,cx=347,cy=436;
  const P=(u,v,z)=>[cx+(u*0.94+v*0.34)*k, cy+(u*0.34-v*0.94)*k-(z||0)*0.55*k];
  const f=n=>n.toFixed(1),pt=(u,v,z)=>{const p=P(u,v,z);return f(p[0])+","+f(p[1]);};
  const ink="#2B211B",SW='stroke="#2B211B" stroke-width=".7" stroke-linejoin="round"';
  const poly=(L,fill,ex)=>`<polygon points="${L.map(p=>pt(...p)).join(" ")}" fill="${fill}" ${ex===undefined?SW:ex}/>`;
  const line=(a,b,st)=>{const p=P(...a),q=P(...b);return `<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" ${st}/>`;};
  const FR=(u1,u2,v,z1,z2,fill,ex)=>poly([[u1,v,z1],[u2,v,z1],[u2,v,z2],[u1,v,z2]],fill,ex);   // 正面（朝前，受光）
  const RT=(u,v1,v2,z1,z2,fill,ex)=>poly([[u,v1,z1],[u,v2,z1],[u,v2,z2],[u,v1,z2]],fill,ex);   // 右側面（背光）
  const TP=(u1,u2,v1,v2,z,fill,ex)=>poly([[u1,v1,z],[u2,v1,z],[u2,v2,z],[u1,v2,z]],fill,ex);
  const box=(u1,u2,v1,v2,z1,z2,cf,cr,ct)=>FR(u1,u2,v1,z1,z2,cf)+RT(u2,v1,v2,z1,z2,cr)+TP(u1,u2,v1,v2,z2,ct);
  const course='stroke="#5e1d14" stroke-width=".45" opacity=".45"';
  const brickF=(u1,u2,v,z1,z2)=>{let o="";for(let z=z1+0.4;z<z2-0.05;z+=0.4)o+=line([u1,v,z],[u2,v,z],course);return o;};
  const brickR=(u,v1,v2,z1,z2)=>{let o="";for(let z=z1+0.4;z<z2-0.05;z+=0.4)o+=line([u,v1,z],[u,v2,z],course);return o;};
  const C={brick:"#A63A2B",brickS:"#7E2B1F",stone:"#D3CABA",stoneS:"#ABA08D",stoneT:"#E4DDD0",wood:"#5B2A1C",woodS:"#3F1C12",gold:"#B08A3E",tileF:"#4A3B34",tileB:"#2E241F",plate:"#E6DCC8",plateF:"#C9BDA6",plateR:"#B3A68D",pave:"#DDD1BB",court:"#CFC2A8",floor:"#E8DDC8",white:"#EFE7DA"};
  // 兩坡硬山屋頂（屋脊沿 u），含右側山牆、簷口厚度、瓦壟、燕尾脊
  const roof=(u1,u2,v1,v2,h,r,ov,op)=>{const m=(v1+v2)/2,e=h-ov*0.45,L=u1-ov,R=u2+ov,O=op==null?1:op,FO=`fill-opacity="${O}" stroke="#2B211B" stroke-width=".7" stroke-linejoin="round"`;let o="";
    o+=poly([[L,m,h+r],[R,m,h+r],[R,v2+ov,e],[L,v2+ov,e]],C.tileB,FO);
    o+=poly([[u2,v1,h],[u2,v2,h],[u2,m,h+r]],C.brickS)+brickR(u2,v1+0.6,v2-0.6,h,h+r*0.7);
    o+=poly([[L,v1-ov,e],[R,v1-ov,e],[R,m,h+r],[L,m,h+r]],C.tileF,FO);
    for(let u=L+0.42;u<R-0.1;u+=0.42)o+=line([u,v1-ov,e],[u,m,h+r],`stroke="#6b5a50" stroke-width=".6" opacity="${0.8*O}"`);
    o+=FR(L,R,v1-ov,e-0.22,e,"#241B17",`fill-opacity="${Math.min(1,O+0.3)}"`);                                   // 簷口
    o+=poly([[R,v1-ov,e-0.22],[R,v1-ov,e],[R,m,h+r],[R,m,h+r-0.22]],"#241B17"); // 山牆收邊
    const a=P(L+0.6,m,h+r),b=P(R-0.6,m,h+r),t1=P(L-1.3,m,h+r+1.1),t2=P(R+1.3,m,h+r+1.1),q1=P(L-0.2,m,h+r),q2=P(R+0.2,m,h+r);
    o+=`<path d="M${f(t1[0])} ${f(t1[1])} Q${f(q1[0])} ${f(q1[1]+3)} ${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])} Q${f(q2[0])} ${f(q2[1]+3)} ${f(t2[0])} ${f(t2[1])}" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`;
    o+=`<path d="M${f(a[0])} ${f(a[1]-1.6)} L${f(b[0])} ${f(b[1]-1.6)}" stroke="#7a6a60" stroke-width="1"/>`;
    return o;};
  const col=(u,v,z1,z2)=>box(u-0.3,u+0.3,v-0.3,v+0.3,z1,z1+0.25,C.stone,C.stoneS,C.stoneT)+box(u-0.18,u+0.18,v-0.18,v+0.18,z1+0.25,z2,"#7A2E22","#5A2018","#8A3A2C");
  const person=(u,v,col1)=>{const p=P(u,v,0);return `<g><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="3.6" ry="1.6" fill="#000" opacity=".15"/><path d="M${f(p[0]-2.6)} ${f(p[1])} L${f(p[0]-2.2)} ${f(p[1]-10)} Q${f(p[0])} ${f(p[1]-13)} ${f(p[0]+2.2)} ${f(p[1]-10)} L${f(p[0]+2.6)} ${f(p[1])} Z" fill="${col1}"/><circle cx="${f(p[0])}" cy="${f(p[1]-15)}" r="2.6" fill="${ink}"/></g>`;};
  const G=(i,body)=>`<g class="pz" data-i="${i}">${body}</g>`;
  let out="";
  // 基地台座
  out+=FR(-10.6,10.6,-0.6,-0.6,0,C.plateF)+RT(10.6,-0.6,23,-0.6,0,C.plateR)+TP(-10.6,10.6,-0.6,23,0,C.plate);
  // 0 前埕：石板鋪面
  let pz=TP(-10,10,0,6.6,0.01,C.pave);
  for(let v=0.4;v<6.6;v+=1.3)pz+=line([-10,v,0.01],[10,v,0.01],'stroke="#B9AC94" stroke-width=".5"');
  for(let u=-9;u<10;u+=1.6)pz+=line([u,0,0.01],[u,6.6,0.01],'stroke="#C6BAA3" stroke-width=".4"');
  out+=G(0,pz);
  // 2 天井
  let ct=TP(-4,4,11,16,0.02,C.court)+TP(-3.4,3.4,11.6,15.4,0.03,"#C4B699",'stroke="#A89A80" stroke-width=".5"');
  for(let u=-2.6;u<3.4;u+=0.85)ct+=line([u,11.6,0.03],[u,15.4,0.03],'stroke="#B1A387" stroke-width=".4"');
  for(let v=12.4;v<15.4;v+=0.85)ct+=line([-3.4,v,0.03],[3.4,v,0.03],'stroke="#B1A387" stroke-width=".4"');
  out+=G(2,ct);
  // 4 正廳（屋頂掀開）
  const hz=0.35,hh=5;let hl="";
  hl+=FR(-8,8,16,0,hz,C.stone)+TP(-7.6,7.6,16,21.6,hz,C.floor);
  for(let u=-7;u<7.6;u+=0.8)hl+=line([u,16,hz],[u,21.6,hz],'stroke="#CDBFA6" stroke-width=".4"');
  for(let v=16.8;v<21.6;v+=0.8)hl+=line([-7.6,v,hz],[7.6,v,hz],'stroke="#CDBFA6" stroke-width=".4"');
  hl+=FR(-7.6,7.6,21.6,hz,hh,C.brick)+brickF(-7.6,7.6,21.6,hz+0.8,hh)+FR(-7.6,7.6,21.6,hz,hz+0.8,C.stone)+TP(-8,8,21.6,22,hh,C.stoneT);
  hl+=RT(-7.6,16,21.6,hz,hh,C.brickS)+brickR(-7.6,16,21.6,hz+0.8,hh)+RT(-7.6,16,21.6,hz,hz+0.8,C.stoneS)+TP(-8,-7.6,16,22,hh,C.stoneT);
  // 家訓匾（後牆）
  hl+=FR(-1.6,1.6,21.58,4.0,4.7,"#2A1C16")+FR(-1.45,1.45,21.57,4.08,4.62,"none",'stroke="#B08A3E" stroke-width=".8"');
  out+=G(4,hl);
  // 5 祖龕與供桌
  let kn=box(-3.2,3.2,20.6,21.5,hz,hz+3.4,C.wood,C.woodS,"#6B3524")+box(-3.4,3.4,20.45,21.55,hz+3.4,hz+3.75,"#7A3A26","#5B2A1C","#8A4A33");
  kn+=FR(-2.7,2.7,20.6,hz+1.0,hz+3.0,"#2E140C",'stroke="#B08A3E" stroke-width=".6"');
  [-2.1,-1.05,0,1.05,2.1].forEach(u=>{kn+=FR(u-0.3,u+0.3,20.59,hz+1.1,hz+(u==0?2.75:2.4),C.gold,'stroke="#7E5F25" stroke-width=".5"');});
  kn+=box(-2.8,2.8,18.8,19.7,hz,hz+1.15,"#7A3A26","#5B2A1C","#8C4C35")+box(-0.35,0.35,19.0,19.5,hz+1.15,hz+1.6,C.gold,"#8E6F2F","#C9A25A");
  out+=G(5,kn);
  // 正廳柱、樑、右牆
  let hc=[-5.4,-2.2,2.2,5.4].map(u=>col(u,19.2,hz,hh-0.4)).join("")+[-5.4,-2.2,2.2,5.4].map(u=>col(u,16.5,hz,hh-0.4)).join("");
  hc+=box(-7.6,7.6,16.3,16.7,hh-0.75,hh-0.35,"#6E2A1F","#4E1D15","#7E3528");
  hc+=FR(-1.3,1.3,16.28,hh-1.6,hh-0.85,"#2A1C16")+FR(-1.17,1.17,16.27,hh-1.52,hh-0.93,"none",'stroke="#B08A3E" stroke-width=".8"');
  hc+=TP(7.6,8,16,22,hh,C.stoneT)+FR(7.6,8,16,0,hh,C.brick)+RT(8,16,22,0,hh,C.brickS)+brickR(8,16,22,0.8,hh)+RT(8,16,22,0,0.8,C.stoneS);
  hc+=poly([[-8.5,15.5,hh+0.05],[8.5,15.5,hh+0.05],[8.5,22.5,hh+0.05],[-8.5,22.5,hh+0.05]],"none",'stroke="#2B211B" stroke-width=".9" stroke-dasharray="4 3" opacity=".55"');
  out+=G(4,hc);
  // 3 兩廊
  const corr=(u1,u2,hi,lo)=>{let o=TP(u1,u2,11,16,0.2,"#E3D7C1");const inner=u1<0?u2-0.3:u1+0.3;
    [11.6,13.5,15.4].forEach(v=>o+=col(inner,v,0.2,lo-0.05));
    if(u2>0)o+=RT(u2,11,16,0,hi,C.brickS)+brickR(u2,11,16,0.8,hi)+RT(u2,11,16,0,0.8,C.stoneS);
    const A=u1<0?[u1,hi]:[u1-0.4,lo-0.1],B=u1<0?[u2+0.4,lo-0.1]:[u2,hi];
    o+=poly([[A[0],10.9,A[1]],[B[0],10.9,B[1]],[B[0],16.1,B[1]],[A[0],16.1,A[1]]],"#433530");
    for(let v=11.3;v<16.1;v+=0.42)o+=line([A[0],v,A[1]],[B[0],v,B[1]],'stroke="#6b5a50" stroke-width=".55" opacity=".8"');
    o+=FR(A[0],B[0],10.9,Math.min(A[1],B[1])-0.18,Math.min(A[1],B[1]),"#241B17","");
    if(u2>0)o+=RT(B[0],10.9,16.1,B[1]-0.2,B[1],"#241B17");
    return o;};
  out+=G(3,corr(-8,-4,3.8,2.9)+corr(4,8,3.8,2.9));
  // 1 三川門
  const fh=4.4;let fr="";
  // 內部：地面、後牆（通天井的門）、左牆內面
  fr+=TP(-7.6,7.6,7.4,10.6,0.3,C.floor)+FR(-7.6,7.6,10.6,0.3,fh,C.brick)+brickF(-7.6,7.6,10.6,1.1,fh)+FR(-7.6,7.6,10.6,0.3,1.1,C.stone)+FR(-1.6,1.6,10.6,0.3,3.3,"#3A1A10");
  fr+=RT(-7.6,7.4,10.6,0.3,fh,C.brickS)+brickR(-7.6,7.4,10.6,1.1,fh)+TP(-8,-7.6,7,11,fh,C.stoneT)+TP(-7.6,7.6,10.6,11,fh,C.stoneT);
  // 正面
  fr+=FR(-8,8,7,0,fh,C.brick)+brickF(-8,8,7,0.9,3.55)+FR(-8,8,7,0,0.9,C.stone)+TP(-8,8,7,7.4,fh,C.stoneT);
  [[-7.6,-5.9],[-3.3,-1.9],[1.9,3.3],[5.9,7.6]].forEach(([a,b])=>fr+=FR(a,b,7,0.15,0.75,"#E2DACB",'stroke="#9C907C" stroke-width=".5"'));
  fr+=FR(-8,8,7,3.55,4.0,C.white)+[-6.5,-4,-1.5,1.5,4,6.5].map(u=>FR(u-0.5,u+0.5,7,3.63,3.92,u%3==0?"#5F7A6A":"#C9A25A","")).join("");
  const door=(a,b,h,god)=>{let o=FR(a-0.3,b+0.3,7,0.9,h+0.3,C.stone)+FR(a,b,7,0.12,h,C.wood);const m=(a+b)/2;
    o+=line([m,7,0.12],[m,7,h],`stroke="${C.gold}" stroke-width=".8"`);
    if(god){o+=FR(a+0.2,m-0.12,7,0.7,h-0.6,"#8A3426",'stroke="#B08A3E" stroke-width=".6"')+FR(m+0.12,b-0.2,7,0.7,h-0.6,"#8A3426",'stroke="#B08A3E" stroke-width=".6"');}
    return o;};
  fr+=door(-1.4,1.4,3.2,true)+door(-5.3,-3.9,2.7,false)+door(3.9,5.3,2.7,false);
  fr+=TP(7.6,8,7,11,fh,C.stoneT)+RT(8,7,11,0,fh,C.brickS)+brickR(8,7,11,0.9,fh)+RT(8,7,11,0,0.9,C.stoneS);
  fr+=roof(-8,8,7,11,fh,1.7,0.55)+roof(-3,3,7,11,fh+0.75,1.7,0.4);
  fr+=box(-2.2,2.2,6.2,7,0,0.18,C.stone,C.stoneS,C.stoneT)+box(-1.9,1.9,6.5,7,0.18,0.34,C.stone,C.stoneS,C.stoneT);
  out+=G(1,fr);
  // 前埕：旗杆座與人物
  let fp="";[-5.6,5.6].forEach(u=>{fp+=box(u-0.55,u-0.2,2.7,3.3,0,1.3,C.stone,C.stoneS,C.stoneT)+box(u+0.2,u+0.55,2.7,3.3,0,1.3,C.stone,C.stoneS,C.stoneT)+line([u,3,0],[u,3,7.2],'stroke="#5B2A1C" stroke-width="2.2" stroke-linecap="round"');});
  fp+=person(-2.6,2.2,"#5F7A6A")+person(1.2,0.8,"#8A3426")+person(2.0,1.3,"#B08A3E");
  out+=G(0,fp);
  // 標籤
  const lab=(i,u,v,z,t,side)=>{const [px,py]=P(u,v,z),dx=side=="l"?-1:1,lx=px+dx*(side=="l"?64:110),ly=py-(side=="l"?0:6);
    return `<g class="pz-lab" data-i="${i}"><line x1="${f(px)}" y1="${f(py)}" x2="${f(lx)}" y2="${f(ly)}" stroke="${ink}" stroke-width=".8"/><circle cx="${f(px)}" cy="${f(py)}" r="2.6" fill="${ink}"/><circle class="pz-num" cx="${f(lx)}" cy="${f(ly)}" r="12" fill="#A63A2B"/><text x="${f(lx)}" y="${f(ly+4.5)}" text-anchor="middle" font-size="13" fill="#fff" font-family="sans-serif">${i+1}</text><text x="${f(lx+dx*18)}" y="${f(ly+5.5)}" text-anchor="${side=="l"?"end":"start"}" font-size="16" fill="${ink}" stroke="#F3E6D0" stroke-width="4" paint-order="stroke" font-family="'Noto Serif TC',serif">${t}</text></g>`;};
  // 點擊區：每區取地面與頂高的投影外框（凸包）；祖龕放最後，疊在正廳上方
  const hull=ps=>{ps=ps.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
    for(const p of ps){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
    for(const p of ps.slice().reverse()){while(up.length>1&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}
    return lo.slice(0,-1).concat(up.slice(0,-1));};
  const zonePoly=(i,cls)=>window.PLAN_ZONES[i].map(([u1,u2,v1,v2,h])=>{const pts=[];[u1,u2].forEach(u=>[v1,v2].forEach(v=>[0,h].forEach(z=>pts.push(P(u,v,z)))));
    return `<polygon class="${cls}" data-i="${i}" points="${hull(pts).map(p=>f(p[0])+","+f(p[1])).join(" ")}"/>`;}).join("");
  out+=`<g class="pa-hl">${[0,1,2,3,4,5].map(i=>zonePoly(i,"pa-glow")).join("")}</g><g class="pa-hits">${[0,4,3,1,2,5].map(i=>zonePoly(i,"pa-hit")).join("")}</g>`;
  out+=lab(0,-7,2,0,LB[0],"l")+lab(1,-6.5,7,2.2,LB[1],"l")+lab(3,-6,12.5,3.4,LB[3],"l")+lab(2,1.5,15,0,LB[2],"r")+lab(4,6.5,18.4,hz,LB[4],"r")+lab(5,1.6,21,hz+3.75,LB[5],"r");
  return `<svg viewBox="0 0 720 505" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="宗祠鳥瞰示意圖"><rect width="720" height="505" fill="#F3E6D0"/>${out}<text x="16" y="24" font-size="12" fill="#6b5d52" font-family="sans-serif">${NT[0]}</text><text x="16" y="42" font-size="12" fill="#6b5d52" font-family="sans-serif">${NT[1]}</text></svg>`;
};
})();
