import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://tfetbksdzbvxnahyxfad.supabase.co";
const SUPABASE_KEY = "sb_publishable_RmrvpSeQPV367nQ5Xefryw_MGLHJqK1";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key:"beverages_alcoholic", name:"Alcohol", icon:"🍺",
    theme:{bg:"#0f1117",header:"linear-gradient(160deg,#1a1f2e,#161b27)",accent:"#f0c040",accentText:"#0f1117",card:"#1a1f2e",border:"#2a3050",sub:"#6b7280",badge:"#252c42",badgeBorder:"#3a4260",badgeText:"#9ba8c0",oosOverlay:"rgba(15,17,23,0.6)"},
    subcategories:[{key:"beer",name:"Beer",icon:"🍺"},{key:"wine",name:"Wine",icon:"🍷"},{key:"spirits",name:"Spirits",icon:"🥃"},{key:"hard_seltzer",name:"Hard Seltzer",icon:"🫧"},{key:"other_alcohol",name:"Other",icon:"🍶"}],
  },
  {
    key:"beverages_na", name:"Beverages", icon:"🥤",
    theme:{bg:"#0a1a0f",header:"linear-gradient(160deg,#0f2a18,#0a1a0f)",accent:"#2ecc71",accentText:"#0a1a0f",card:"#0f2018",border:"#1a4028",sub:"#4a8060",badge:"#0f2820",badgeBorder:"#1a4030",badgeText:"#5a9070",oosOverlay:"rgba(10,26,15,0.6)"},
    subcategories:[{key:"soda",name:"Soda",icon:"🥤"},{key:"water",name:"Water",icon:"💧"},{key:"juice",name:"Juice",icon:"🧃"},{key:"energy_drinks",name:"Energy Drinks",icon:"⚡"},{key:"sports_drinks",name:"Sports Drinks",icon:"🏃"},{key:"coffee_tea",name:"Coffee & Tea",icon:"☕"},{key:"other_drinks",name:"Other",icon:"🫙"}],
  },
  {
    key:"snacks_candy", name:"Snacks & Candy", icon:"🍫",
    theme:{bg:"#1a0a00",header:"linear-gradient(160deg,#2a1400,#1a0a00)",accent:"#ff6b35",accentText:"#fff",card:"#200f00",border:"#3a2010",sub:"#806040",badge:"#281500",badgeBorder:"#3a2010",badgeText:"#906040",oosOverlay:"rgba(26,10,0,0.6)"},
    subcategories:[{key:"chips",name:"Chips & Salty",icon:"🥨"},{key:"candy",name:"Candy",icon:"🍬"},{key:"gum_mints",name:"Gum & Mints",icon:"🌿"},{key:"nuts",name:"Nuts",icon:"🥜"},{key:"other_snacks",name:"Other",icon:"🍪"}],
  },
  {
    key:"grocery", name:"Grocery", icon:"🛒",
    theme:{bg:"#0a0a1a",header:"linear-gradient(160deg,#141428,#0a0a1a)",accent:"#7c83fd",accentText:"#fff",card:"#0f0f22",border:"#1e1e40",sub:"#505080",badge:"#101028",badgeBorder:"#202048",badgeText:"#6060a0",oosOverlay:"rgba(10,10,26,0.6)"},
    subcategories:[{key:"dairy",name:"Dairy",icon:"🥛"},{key:"bread",name:"Bread & Crackers",icon:"🍞"},{key:"pantry",name:"Pantry",icon:"🥫"},{key:"cooking",name:"Cooking",icon:"🧂"},{key:"frozen",name:"Frozen",icon:"🧊"},{key:"other_grocery",name:"Other",icon:"🛒"}],
  },
  {
    key:"tobacco_nicotine", name:"Tobacco", icon:"🚬",
    theme:{bg:"#111008",header:"linear-gradient(160deg,#1e1c0e,#111008)",accent:"#c8a84b",accentText:"#111008",card:"#181608",border:"#302c14",sub:"#706840",badge:"#201e08",badgeBorder:"#302c14",badgeText:"#907840",oosOverlay:"rgba(17,16,8,0.6)"},
    subcategories:[{key:"cigarettes",name:"Cigarettes",icon:"🚬"},{key:"cigars",name:"Cigars",icon:"💨"},{key:"nicotine_pouches",name:"Nicotine Pouches",icon:"🟢"},{key:"dip_snuff",name:"Dip & Snuff",icon:"🥫"},{key:"other_tobacco",name:"Other",icon:"📦"}],
  },
  {
    key:"household", name:"Household", icon:"🏠",
    theme:{bg:"#0a1218",header:"linear-gradient(160deg,#0f1e28,#0a1218)",accent:"#00b4d8",accentText:"#0a1218",card:"#0f1a24",border:"#1a2e3c",sub:"#405870",badge:"#0f2030",badgeBorder:"#1a3040",badgeText:"#506880",oosOverlay:"rgba(10,18,24,0.6)"},
    subcategories:[{key:"cleaning",name:"Cleaning",icon:"🧹"},{key:"paper_goods",name:"Paper Goods",icon:"🧻"},{key:"kitchen_basics",name:"Kitchen",icon:"🍽️"},{key:"personal_care",name:"Personal Care",icon:"🧴"},{key:"other_household",name:"Other",icon:"🏠"}],
  },
  {
    key:"misc", name:"Misc", icon:"📦",
    theme:{bg:"#121212",header:"linear-gradient(160deg,#1c1c1c,#121212)",accent:"#a0a0a0",accentText:"#121212",card:"#1a1a1a",border:"#2e2e2e",sub:"#585858",badge:"#1f1f1f",badgeBorder:"#303030",badgeText:"#686868",oosOverlay:"rgba(18,18,18,0.6)"},
    subcategories:[{key:"misc_other",name:"Other",icon:"📦"}],
  },
  {
    key:"print_cards", name:"Print & Cards", icon:"📰",
    theme:{bg:"#18080a",header:"linear-gradient(160deg,#280e12,#18080a)",accent:"#e84393",accentText:"#fff",card:"#200c10",border:"#381420",sub:"#704050",badge:"#200c10",badgeBorder:"#381420",badgeText:"#904060",oosOverlay:"rgba(24,8,10,0.6)"},
    subcategories:[{key:"newspapers",name:"Newspapers",icon:"📰"},{key:"magazines",name:"Magazines",icon:"📖"},{key:"greeting_cards",name:"Greeting Cards",icon:"💌"},{key:"other_print",name:"Other",icon:"📋"}],
  },
];

const SEVERITY_LEVELS = ["Low","Medium","High","Critical"];
const PACK_SIZES      = ["Single","4 Pack","6 Pack","12 Pack","15 Pack","18 Pack","30 Pack"];
const CONTAINER_TYPES = ["Can","Bottle"];
const WINE_TYPES      = ["Red","White","Rosé","Sparkling","Other"];
const PACK_SUBS       = ["beer","hard_seltzer","soda"];
const WINE_SUBS       = ["wine"];
const AUTO_DEPOSIT    = {"Single":0,"4 Pack":0.20,"6 Pack":0.30,"12 Pack":0.60,"15 Pack":0.75,"18 Pack":0.90,"30 Pack":1.50};
const THEME_KEY       = "proto-theme";
const DEFAULT_HOURS=[
  {days:"Sun",hours:"8 AM – 1 PM"},
  {days:"Mon – Thu",hours:"8 AM – 6:30 PM"},
  {days:"Fri – Sat",hours:"8 AM – 7:30 PM"},
];

function loadTheme(){try{return localStorage.getItem(THEME_KEY)||"dark";}catch{return "dark";}}

function emptyAlcoholForm(sub){
  if(PACK_SUBS.includes(sub)) return {packSize:"6 Pack",containerType:"Can",deposit:"0.30"};
  if(WINE_SUBS.includes(sub)) return {wineType:"Red"};
  return {};
}

function buildThemeVariant(theme,mode){
  if(mode==="light"){
    return {
      ...theme,
      bg: "#f8f8f0",
      header: "linear-gradient(160deg,#eeeee0,#e8e8d8)",
      card: "#ffffff",
      border: "#d8d8c8",
      badge: "#f0f0e8",
      badgeBorder: "#d0d0c0",
      badgeText: "#606050",
      sub: "#909080",
      oosOverlay: "rgba(248,248,240,0.6)",
    };
  }
  return theme;
}


const DT={appBg:"#0a0e1a",headerBg:"linear-gradient(160deg,#0d1120,#0a0e1a)",cardBg:"#0f1525",cardBorder:"#1e2d4a",accent:"#00d4ff",accentDim:"#00d4ff22",accentText:"#0a0e1a",text:"#c8d8f0",subText:"#4a6080",inputBg:"#080c18",inputBorder:"#1e2d4a",green:"#00ff88",red:"#ff4466"};

// ── CSV helpers ───────────────────────────────────────────────────────────────
function buildCSV(items){
  const h="Name,Category,Subcategory,Pack Size,Container,Wine Type,Price,Deposit,Location,Out of Stock";
  const rows=items.map(i=>[
    `"${(i.name||"").replace(/"/g,'""')}"`,i.category,i.subcategory||"",
    PACK_SUBS.includes(i.subcategory)?(i.packSize||""):"",
    PACK_SUBS.includes(i.subcategory)?(i.containerType||""):"",
    WINE_SUBS.includes(i.subcategory)?(i.wineType||""):"",
    (i.price||0).toFixed(2),(i.deposit||0).toFixed(2),
    `"${(i.location||"").replace(/"/g,'""')}"`,i.outOfStock?"Yes":"No",
  ].join(","));
  return [h,...rows].join("\n");
}

// ── Comet hook ────────────────────────────────────────────────────────────────
function useCometCanvas(btnRef,canvasRef,active){
  useEffect(()=>{
    const btn=btnRef.current,canvas=canvasRef.current;
    if(!btn||!canvas)return;
    const PAD=4,R=9,bw=btn.offsetWidth,bh=btn.offsetHeight;
    canvas.width=bw+PAD*2;canvas.height=bh+PAD*2;
    const pts=[],STEPS=300;
    const sT=bw-2*R,sR=bh-2*R,sB=bw-2*R,sL=bh-2*R,aC=(Math.PI/2)*R,total=sT+aC+sR+aC+sB+aC+sL+aC;
    for(let i=0;i<STEPS;i++){
      let d=(i/STEPS)*total;
      if(d<sT){pts.push([PAD+R+d,PAD]);continue;}d-=sT;
      if(d<aC){const a=-Math.PI/2+(d/aC)*(Math.PI/2);pts.push([PAD+bw-R+Math.cos(a)*R,PAD+R+Math.sin(a)*R]);continue;}d-=aC;
      if(d<sR){pts.push([PAD+bw,PAD+R+d]);continue;}d-=sR;
      if(d<aC){const a=(d/aC)*(Math.PI/2);pts.push([PAD+bw-R+Math.cos(a)*R,PAD+bh-R+Math.sin(a)*R]);continue;}d-=aC;
      if(d<sB){pts.push([PAD+bw-R-d,PAD+bh]);continue;}d-=sB;
      if(d<aC){const a=Math.PI/2+(d/aC)*(Math.PI/2);pts.push([PAD+R+Math.cos(a)*R,PAD+bh-R+Math.sin(a)*R]);continue;}d-=aC;
      if(d<sL){pts.push([PAD,PAD+bh-R-d]);continue;}d-=sL;
      const a=Math.PI+(d/aC)*(Math.PI/2);pts.push([PAD+R+Math.cos(a)*R,PAD+R+Math.sin(a)*R]);
    }
    const RAINBOW=[[255,255,255],[255,0,128],[255,100,0],[255,220,0],[0,210,80],[0,170,255],[140,80,220]];
    function lerp(frac){const idx=frac*(RAINBOW.length-1),lo=Math.floor(idx),hi=Math.min(lo+1,RAINBOW.length-1),t=idx-lo;return RAINBOW[lo].map((v,i)=>Math.round(v+(RAINBOW[hi][i]-v)*t));}
    const N=pts.length,tailLen=Math.floor(0.55*N);
    let t=0,raf;
    function draw(){
      const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);
      if(active.current){t=(t+0.004)%1;const head=Math.floor(t*N);
        for(let i=0;i<tailLen;i++){const frac=1-i/tailLen;const[px,py]=pts[(head-i+N)%N];const[r,g,b]=lerp(1-frac);
          ctx.beginPath();ctx.arc(px,py,0.5+frac*1.2,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${Math.pow(frac,1.5)})`;ctx.fill();}}
      raf=requestAnimationFrame(draw);
    }
    draw();return()=>cancelAnimationFrame(raf);
  },[]);
}

function CometButton({onClick,accent,accentText,cancelBg,cancelText,cancelBorder,showCancel}){
  const addBtnRef=useRef(null),addCanvasRef=useRef(null);
  const canBtnRef=useRef(null),canCanvasRef=useRef(null);
  const addActive=useRef(!showCancel),canActive=useRef(showCancel);
  useEffect(()=>{addActive.current=!showCancel;canActive.current=showCancel;},[showCancel]);
  useCometCanvas(addBtnRef,addCanvasRef,addActive);
  useCometCanvas(canBtnRef,canCanvasRef,canActive);

  // Card shuffle: both buttons occupy the same space, one on top of the other.
  // Active button: translateY(0), scale(1), zIndex 2, full opacity
  // Inactive button: translateY(10px), scale(0.92), zIndex 1, low opacity — peeking behind
  const addStyle={
    position:"absolute",top:0,left:0,
    transform:showCancel?"translateY(8px) scale(0.93)":"translateY(0) scale(1)",
    opacity:showCancel?0.45:1,
    zIndex:showCancel?1:2,
    transition:"transform 0.32s cubic-bezier(0.34,1.1,0.64,1), opacity 0.32s ease",
    pointerEvents:showCancel?"none":"auto",
  };
  const canStyle={
    position:"absolute",top:0,left:0,
    transform:showCancel?"translateY(0) scale(1)":"translateY(-8px) scale(0.93)",
    opacity:showCancel?1:0.45,
    zIndex:showCancel?2:1,
    transition:"transform 0.32s cubic-bezier(0.34,1.1,0.64,1), opacity 0.32s ease",
    pointerEvents:showCancel?"auto":"none",
  };

  return(
    <div style={{position:"relative",width:100,height:36,flexShrink:0}}>
      {/* Add button — back when form open */}
      <div style={{...addStyle,position:"absolute"}}>
        <div style={{position:"relative",display:"inline-flex"}}>
          <canvas ref={addCanvasRef} style={{position:"absolute",top:-4,left:-4,pointerEvents:"none",zIndex:3}}/>
          <button ref={addBtnRef} onClick={()=>onClick("add")}
            style={{background:accent,color:accentText,border:"none",borderRadius:8,padding:"8px 0",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",height:36,width:100,textAlign:"center"}}>
            + Add
          </button>
        </div>
      </div>
      {/* Cancel button — back when form closed */}
      <div style={{...canStyle,position:"absolute"}}>
        <div style={{position:"relative",display:"inline-flex"}}>
          <canvas ref={canCanvasRef} style={{position:"absolute",top:-4,left:-4,pointerEvents:"none",zIndex:3}}/>
          <button ref={canBtnRef} onClick={()=>onClick("cancel")}
            style={{background:cancelBg,color:cancelText,border:`1px solid ${cancelBorder}`,borderRadius:8,padding:"8px 0",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",height:36,width:100,textAlign:"center"}}>
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LockIcon ──────────────────────────────────────────────────────────────────
function LockIcon({unlocked,size=18}){
  // Shackle moves up and rotates when unlocking
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{display:"block",overflow:"visible"}}>
      <style>{`
        @keyframes shackleUnlock{
          0%{transform:rotate(0deg) translateY(0px);}
          40%{transform:rotate(-35deg) translateY(-2px);}
          100%{transform:rotate(-35deg) translateY(-2px);}
        }
        @keyframes shackleLock{
          0%{transform:rotate(-35deg) translateY(-2px);}
          60%{transform:rotate(5deg) translateY(1px);}
          100%{transform:rotate(0deg) translateY(0px);}
        }
        @keyframes bodyPop{
          0%{transform:scale(1);}
          50%{transform:scale(1.12);}
          100%{transform:scale(1);}
        }
        .shackle-unlocked{animation:shackleUnlock 0.38s cubic-bezier(0.34,1.2,0.64,1) 0.5s forwards;}
        .shackle-locked{animation:shackleLock 0.32s cubic-bezier(0.34,1.1,0.64,1) 0.5s forwards;}
        .body-pop{animation:bodyPop 0.3s ease 0.6s both;}
      `}</style>
      {/* Lock body */}
      <rect x="3" y="11" width="18" height="12" rx="2.5"
        fill="currentColor" opacity={unlocked?1:0.85}
        className="body-pop" key={String(unlocked)}/>
      {/* Keyhole */}
      <circle cx="12" cy="16.5" r="1.5" fill={unlocked?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.4)"}
        style={{transition:"fill 0.3s ease"}}/>
      <rect x="11.1" y="16.5" width="1.8" height="2.5" rx="0.9"
        fill={unlocked?"rgba(255,255,255,0.6)":"rgba(0,0,0,0.4)"}
        style={{transition:"fill 0.3s ease"}}/>
      {/* Shackle */}
      <g className={unlocked?"shackle-unlocked":"shackle-locked"}
        style={{transformOrigin:"7px 11px"}} key={`shackle-${unlocked}`}>
        <path d="M7 11V8a5 5 0 0 1 10 0v3"
          stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      </g>
    </svg>
  );
}

// ── Floor plan ────────────────────────────────────────────────────────────────
const FLOOR_ZONES = [
  {key:"back_room",         label:"Back Room",          x:8,   y:8,   w:22,  h:22,  color:"#141a14", tappable:true},
  {key:"counter",           label:"Counter",            x:51,  y:8,   w:18,  h:9,   color:"#2a1e0a", tappable:true},
  {key:"snacks_1",          label:"Snacks 1",           x:70,  y:8,   w:16,  h:8,   color:"#1e2a1e", tappable:true},
  {key:"wine_rack_4",       label:"Wine Rack 4",        x:33,  y:10,  w:5,   h:20,  color:"#1a2a3a", tappable:true},
  {key:"wine_rack_5",       label:"Wine Rack 5",        x:33,  y:8,   w:11,  h:4,   color:"#1a2a3a", tappable:true},
  {key:"wine_rack_6",       label:"Wine Rack 6",        x:39,  y:10,  w:5,   h:20,  color:"#1a2a3a", tappable:true},
  {key:"candy_3",           label:"Candy 3",            x:45,  y:10,  w:6,   h:20,  color:"#2a1a14", tappable:true},
  {key:"wine_rack_1",       label:"Wine Rack 1",        x:18,  y:38,  w:16,  h:8,   color:"#1a2a3a", tappable:true},
  {key:"wine_rack_2",       label:"Wine Rack 2",        x:13,  y:38,  w:4,   h:8,   color:"#1a2a3a", tappable:true},
  {key:"beer_wine_case_5",  label:"Beer/Wine Case 5",   x:13,  y:50,  w:6,   h:5,   color:"#0e2030", tappable:true},
  {key:"beer_case_4",       label:"Beer Case 4",        x:13,  y:56,  w:6,   h:7,   color:"#0e2030", tappable:true},
  {key:"meat_block",        label:"Meat Block (Table)", x:22,  y:52,  w:9,   h:8,   color:"#2a1a0a", tappable:true},
  {key:"wine_rack_3",       label:"Wine Rack 3",        x:33,  y:48,  w:6,   h:22,  color:"#1a2a3a", tappable:true},
  {key:"cigar_case_2",      label:"Cigar Case 2",       x:40,  y:44,  w:8,   h:20,  color:"#2a1a1a", tappable:true},
  {key:"greeting_cards",    label:"Greeting Cards",     x:51,  y:28,  w:6,   h:38,  color:"#1a1e2a", tappable:true},
  {key:"rack_sep_1",        label:"",                   x:58,  y:28,  w:2,   h:38,  color:"#0d0d0d", tappable:false},
  {key:"candy_2",           label:"Candy 2",            x:61,  y:28,  w:6,   h:38,  color:"#2a1a14", tappable:true},
  {key:"rack_sep_2",        label:"",                   x:68,  y:28,  w:2,   h:38,  color:"#0d0d0d", tappable:false},
  {key:"candy_1",           label:"Candy 1",            x:71,  y:28,  w:6,   h:38,  color:"#2a1a14", tappable:true},
  {key:"rack_sep_3",        label:"",                   x:78,  y:28,  w:2,   h:38,  color:"#0d0d0d", tappable:false},
  {key:"grocery_1",         label:"Grocery 1",          x:81,  y:28,  w:6,   h:20,  color:"#1a2a14", tappable:true},
  {key:"grocery_2",         label:"Grocery 2",          x:89,  y:44,  w:7,   h:10,  color:"#1a2a14", tappable:true},
  {key:"newspaper_stand",   label:"Newspaper Stand",    x:51,  y:69,  w:12,  h:8,   color:"#1a1a2a", tappable:true},
  {key:"cooler_3",          label:"Cooler 3",           x:89,  y:8,   w:7,   h:8,   color:"#0e2030", tappable:true},
  {key:"cooler_4",          label:"Cooler 4",           x:89,  y:17,  w:7,   h:8,   color:"#0e2030", tappable:true},
  {key:"cooler_5",          label:"Cooler 5",           x:89,  y:26,  w:7,   h:8,   color:"#0e2030", tappable:true},
  {key:"cooler_6",          label:"Cooler 6",           x:89,  y:35,  w:7,   h:8,   color:"#0e2030", tappable:true},
  {key:"cooler_2",          label:"Cooler 2",           x:89,  y:55,  w:7,   h:9,   color:"#0e2030", tappable:true},
  {key:"cooler_1",          label:"Cooler 1",           x:89,  y:65,  w:7,   h:9,   color:"#0e2030", tappable:true},
  {key:"household",         label:"Household",          x:89,  y:75,  w:7,   h:18,  color:"#1a2a2a", tappable:true},
  {key:"beer_case_3",       label:"Beer Case 3",        x:13,  y:82,  w:6,   h:12,  color:"#0e2030", tappable:true},
  {key:"beer_case_2",       label:"Beer Case 2",        x:20,  y:82,  w:6,   h:12,  color:"#0e2030", tappable:true},
  {key:"beer_case_1",       label:"Beer Case 1",        x:27,  y:82,  w:6,   h:12,  color:"#0e2030", tappable:true},
  {key:"ice_cream_3",       label:"Ice Cream 3",        x:34,  y:82,  w:5,   h:12,  color:"#0e2a3a", tappable:true},
  {key:"ice_cream_2",       label:"Ice Cream 2",        x:40,  y:82,  w:6,   h:12,  color:"#0e2a3a", tappable:true},
  {key:"ice_cream_1",       label:"Ice Cream 1",        x:47,  y:82,  w:9,   h:12,  color:"#0e2a3a", tappable:true},
  {key:"cigar_case_1",      label:"Cigar Case 1",       x:60,  y:79,  w:18,  h:15,  color:"#2a1a1a", tappable:true},
];

function FloorPlan({pinZone,onSelectZone,accent,readonly=false}){
  const [hovered,setHovered]=useState(null);
  const W=540, H=440;
  function px(x){return x/100*W;}
  function py(y){return y/100*H;}
  function pw(w){return w/100*W;}
  function ph(h){return h/100*H;}
  return(
    <div style={{position:"relative",width:"100%",borderRadius:10,overflow:"hidden",background:"#080808",border:"1px solid rgba(255,255,255,0.07)"}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block"}}>
        {/* Outer walls — red like the drawing */}
        <rect x={px(8)} y={py(7)} width={pw(88)} height={ph(89)} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2}/>
        {/* Back room inner walls */}
        <line x1={px(30)} y1={py(8)} x2={px(30)} y2={py(30)} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5}/>
        <line x1={px(8)}  y1={py(30)} x2={px(30)} y2={py(30)} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5}/>
        {/* Left wall horizontal shelf bar */}
        <line x1={px(13)} y1={py(35)} x2={px(33)} y2={py(35)} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5}/>
        {/* Diagonal display lines */}
        <line x1={px(30)} y1={py(37)} x2={px(38)} y2={py(46)} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round"/>
        <line x1={px(34)} y1={py(35)} x2={px(42)} y2={py(44)} stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round"/>
        {/* Entrance gap bottom center */}
        <rect x={px(43)} y={ph(95)} width={pw(10)} height={12} fill="#080808"/>
        <text x={px(48)} y={ph(99)} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.2)" fontFamily="inherit">ENTRANCE</text>
        {/* Zones */}
        {FLOOR_ZONES.map(zone=>{
          if(!zone.tappable) return <rect key={zone.key} x={px(zone.x)} y={py(zone.y)} width={pw(zone.w)} height={ph(zone.h)} fill="#0a0a0a" stroke="rgba(255,255,255,0.12)" strokeWidth={0.5}/>;
          const isPin=pinZone===zone.key;
          const isHov=hovered===zone.key;
          const x=px(zone.x),y=py(zone.y),w=pw(zone.w),h=ph(zone.h);
          const cx=x+w/2,cy=y+h/2;
          return(
            <g key={zone.key} onClick={()=>!readonly&&onSelectZone&&onSelectZone(zone.key)} onMouseEnter={()=>setHovered(zone.key)} onMouseLeave={()=>setHovered(null)} style={{cursor:readonly?"default":"pointer"}}>
              <rect x={x} y={y} width={w} height={h} rx={3}
                fill={isPin?`${accent}35`:isHov&&!readonly?`${zone.color}ff`:`${zone.color}cc`}
                stroke={isPin?accent:isHov&&!readonly?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.1)"} strokeWidth={isPin?1.5:0.8}/>
              {isPin&&<rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke={accent} strokeWidth={1.5} opacity={0.9} filter={`drop-shadow(0 0 5px ${accent})`}/>}
              {w>24&&h>12&&(
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
                  fontSize={Math.min(9,Math.max(5.5,Math.min(w/(zone.label.length*0.62),h/2.2)))}
                  fill={isPin?accent:"rgba(255,255,255,0.6)"} fontWeight={isPin?"700":"400"} fontFamily="inherit"
                  style={{pointerEvents:"none",userSelect:"none"}}>{zone.label}</text>
              )}
              {isPin&&<circle cx={cx} cy={y+7} r={4} fill={accent} filter={`drop-shadow(0 0 6px ${accent})`}/>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── SwipeRow ──────────────────────────────────────────────────────────────────
function SwipeRow({onSwipeLeft,children,accentColor}){
  const startX=useRef(null);
  const [offset,setOffset]=useState(0);
  const TH=72;
  return(
    <div style={{position:"relative",overflow:"hidden",borderRadius:12,marginBottom:10}}>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:TH,background:accentColor||"#f0c040",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"0 12px 12px 0"}}>
        <span style={{fontSize:20}}>✏️</span>
      </div>
      <div style={{transform:`translateX(${offset}px)`,transition:offset===0?"transform 0.2s":"none"}}
        onTouchStart={e=>{startX.current=e.touches[0].clientX;}}
        onTouchMove={e=>{if(startX.current===null)return;const dx=e.touches[0].clientX-startX.current;if(dx<0)setOffset(Math.max(dx,-TH));}}
        onTouchEnd={()=>{if(offset<=-TH){setOffset(0);onSwipeLeft();}else setOffset(0);startX.current=null;}}
      >{children}</div>
    </div>
  );
}

// ── ItemCard ──────────────────────────────────────────────────────────────────
function ItemCard({item,T,onDelete,onToggle,onEdit,forceExpand=false}){
  const [expanded,setExpanded]=useState(forceExpand);
  const [pressed,setPressed]=useState(false);
  const [mapExpanded,setMapExpanded]=useState(false);
  const [mapMini,setMapMini]=useState(true);
  const oos=item.outOfStock;
  const isPackSub=PACK_SUBS.includes(item.subcategory);
  const isWineSub=WINE_SUBS.includes(item.subcategory);
  const total=item.price+(item.deposit||0);
  const hasInventory=item.inventory!=null;
  const isLowStock=hasInventory&&item.inventory>0&&item.inventory<=5;
  const zoneName=FLOOR_ZONES.find(z=>z.key===item.mapZone)?.label||item.mapZone;
  return(
    <>
    {/* Fullscreen map takeover */}
    {mapExpanded&&(
      <div style={{
        position:"fixed",inset:0,zIndex:1000,
        background:"#050810",
        display:"flex",flexDirection:"column",
        animation:"fadeIn 0.25s ease",
      }}>
        {/* Top bar */}
        <div style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 20px",
          background:"linear-gradient(180deg,#0a0e1a,transparent)",
          position:"absolute",top:0,left:0,right:0,zIndex:2,
        }}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:"#f0f0f0"}}>{item.name}</div>
            <div style={{fontSize:12,color:T.accent,fontWeight:600,marginTop:2}}>📍 {zoneName}</div>
          </div>
          <button
            onClick={()=>setMapExpanded(false)}
            style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#f0f0f0",fontSize:18,fontFamily:"inherit"}}>
            ✕
          </button>
        </div>

        {/* Map — centered, fills available space */}
        <div style={{
          flex:1,display:"flex",alignItems:"center",justifyContent:"center",
          padding:"80px 20px 100px",
        }}>
          <div style={{width:"100%",maxWidth:480,animation:"modalIn 0.3s cubic-bezier(0.34,1.1,0.64,1)"}}>
            <FloorPlan pinZone={item.mapZone} accent={T.accent} readonly={true}/>
          </div>
        </div>

        {/* Bottom zone label */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,
          padding:"16px 20px 32px",
          background:"linear-gradient(0deg,#050810 60%,transparent)",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:14,border:`1px solid ${T.accent}28`,backdropFilter:"blur(10px)"}}>
            <div style={{width:12,height:12,borderRadius:"50%",background:T.accent,flexShrink:0,boxShadow:`0 0 10px ${T.accent}`,animation:"pulse 2s infinite"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:T.accent}}>{zoneName}</div>
              {item.location&&<div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:2}}>{item.location}</div>}
            </div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.05em"}}>TAP ✕ TO CLOSE</div>
          </div>
        </div>
      </div>
    )}

    <div
      onClick={()=>setExpanded(e=>!e)}
      onMouseDown={()=>setPressed(true)}
      onMouseUp={()=>setPressed(false)}
      onMouseLeave={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)}
      onTouchEnd={()=>setPressed(false)}
      style={{
        background:T.card,border:`1px solid ${oos?"#e74c3c44":isLowStock?"#e67e2244":T.border}`,borderRadius:12,padding:14,
        cursor:"pointer",position:"relative",overflow:"hidden",
        transform:pressed?"scale(0.985)":"scale(1)",
        transition:"transform 0.12s ease, box-shadow 0.2s ease",
        boxShadow:expanded?`0 4px 20px rgba(0,0,0,0.25)`:pressed?"none":"0 1px 4px rgba(0,0,0,0.1)",
      }}>
      {oos&&<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:T.oosOverlay,zIndex:1,borderRadius:12,pointerEvents:"none"}}/>}
      {oos&&<div style={{position:"absolute",top:6,right:8,fontSize:10,fontWeight:700,color:"#e74c3c",zIndex:2,letterSpacing:"0.05em",textTransform:"uppercase"}}>Out of Stock</div>}
      {!oos&&isLowStock&&<div style={{position:"absolute",top:6,right:8,fontSize:10,fontWeight:700,color:"#e67e22",zIndex:2,letterSpacing:"0.05em",textTransform:"uppercase"}}>Low Stock</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative",zIndex:2}}>
        <div style={{flex:1}}>
          <div style={{fontSize:15,fontWeight:600,color:oos?T.sub:"#f0f0f0",marginBottom:6,textDecoration:oos?"line-through":"none"}}>{item.name}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {isPackSub&&item.packSize&&<span style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:6,padding:"2px 7px",fontSize:11,color:T.badgeText}}>{item.packSize}</span>}
            {isPackSub&&item.containerType&&<span style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:6,padding:"2px 7px",fontSize:11,color:T.badgeText}}>{item.containerType==="Can"?"🥫 Can":"🍶 Bottle"}</span>}
            {isWineSub&&item.wineType&&<span style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:6,padding:"2px 7px",fontSize:11,color:T.badgeText}}>🍷 {item.wineType}</span>}
            {hasInventory&&<span style={{background:isLowStock?"#e67e2222":oos?"#e74c3c22":T.badge,border:`1px solid ${isLowStock?"#e67e2244":oos?"#e74c3c44":T.badgeBorder}`,borderRadius:6,padding:"2px 7px",fontSize:11,color:isLowStock?"#e67e22":oos?"#e74c3c":T.badgeText}}>📦 {item.inventory} left</span>}
            {item.gilliesRecommendation&&<span style={{background:"#f0c04022",border:"1px solid #f0c04055",borderRadius:6,padding:"2px 7px",fontSize:11,color:"#f0c040",fontWeight:600}}>⭐ Gillie's Pick</span>}
            {item.location&&<span style={{fontSize:11,color:T.sub,display:"flex",alignItems:"center",gap:3}}>📍 {item.location}</span>}
            {item.expiryDate&&(()=>{
              const days=Math.ceil((new Date(item.expiryDate)-new Date())/(1000*60*60*24));
              if(days>7)return null;
              const color=days<=0?"#e74c3c":days<=3?"#e74c3c":"#e67e22";
              return <span style={{background:`${color}22`,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 7px",fontSize:11,color,fontWeight:600}}>{days<=0?"⚠️ Expired":`⚠️ Exp. ${days}d`}</span>;
            })()}
          </div>
        </div>
        <div style={{textAlign:"right",paddingLeft:12,flexShrink:0}}>
          <div style={{fontSize:20,fontWeight:700,color:oos?T.sub:T.accent}}>${item.price.toFixed(2)}</div>
          {item.deposit>0&&<div style={{fontSize:11,color:T.badgeText,marginTop:1}}>+${item.deposit.toFixed(2)} dep.</div>}
        </div>
      </div>
      {/* Animated expand section */}
      <div style={{display:"grid",gridTemplateRows:expanded?"1fr":"0fr",transition:"grid-template-rows 0.28s cubic-bezier(0.4,0,0.2,1)"}}>
        <div style={{overflow:"hidden"}}>
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`,position:"relative",zIndex:2}} onClick={e=>e.stopPropagation()}>
            {item.deposit>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:13,color:T.sub}}>Total w/ deposit:</span><span style={{fontSize:14,fontWeight:700,color:T.accent}}>${total.toFixed(2)}</span></div>}
            {item.notes&&<div style={{fontSize:12,color:T.sub,marginBottom:10,padding:"8px 10px",background:T.badge,borderRadius:8,border:`1px solid ${T.badgeBorder}`,lineHeight:1.5}}>📝 {item.notes}</div>}
            {item.expiryDate&&(()=>{
              const days=Math.ceil((new Date(item.expiryDate)-new Date())/(1000*60*60*24));
              const color=days<=0?"#e74c3c":days<=3?"#e74c3c":days<=7?"#e67e22":"#27ae60";
              const bg=days<=3?"#2e1a1a":days<=7?"#2e1e0a":"#0a1e0a";
              const border=days<=3?"#5a2a2a":days<=7?"#5a3a0a":"#1a4a1a";
              return(
                <div style={{fontSize:12,color,marginBottom:10,padding:"8px 10px",background:bg,borderRadius:8,border:`1px solid ${border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{days<=0?"⚠️ Expired":days<=7?"⚠️ Expiring soon":"✓ Next expiry"}</span>
                  <span style={{fontWeight:700}}>{days<=0?"Expired":days===1?"Tomorrow":`${days} days — ${new Date(item.expiryDate+"T12:00").toLocaleDateString("en",{month:"short",day:"numeric"})}`}</span>
                </div>
              );
            })()}
            {/* Map location — starts minimized */}
            {item.mapZone&&(
              <div style={{marginBottom:10}}>
                <button onClick={e=>{e.stopPropagation();setMapMini(m=>!m);}} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontFamily:"inherit",marginBottom:mapMini?0:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{fontSize:12}}>📍</span>
                    <span style={{fontSize:12,fontWeight:600,color:T.accent}}>{zoneName}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:10,color:T.sub,letterSpacing:"0.04em"}}>{mapMini?"Show Map":"Hide Map"}</span>
                    <span style={{fontSize:11,color:T.sub,transform:mapMini?"rotate(0deg)":"rotate(180deg)",transition:"transform 0.25s ease",display:"inline-block"}}>▾</span>
                  </div>
                </button>
                <div style={{display:"grid",gridTemplateRows:mapMini?"0fr":"1fr",transition:"grid-template-rows 0.28s cubic-bezier(0.4,0,0.2,1)"}}>
                  <div style={{overflow:"hidden"}}>
                    <div style={{paddingTop:6}}>
                      <FloorPlan pinZone={item.mapZone} accent={T.accent} readonly={true}/>
                      <div style={{display:"flex",justifyContent:"flex-end",marginTop:5}}>
                        <button onClick={e=>{e.stopPropagation();setMapExpanded(true);}} style={{fontSize:10,color:T.accent,background:"transparent",border:`1px solid ${T.accent}44`,borderRadius:5,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,letterSpacing:"0.04em"}}>⤢ Full Screen</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <button onClick={onToggle} style={{width:"100%",marginBottom:8,padding:"9px",background:oos?"#2e1a1a":"transparent",border:`1px solid ${oos?"#5a2a2a":T.border}`,borderRadius:8,color:oos?"#e07070":T.sub,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"background 0.2s"}}>
              {oos?"✅ Mark In Stock":"🚫 Mark Out of Stock"}
            </button>
            <div style={{display:"flex",gap:8}}>
              <button onClick={e=>{e.stopPropagation();onEdit(item);}} style={{flex:1,padding:"9px",background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:8,color:T.badgeText,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>✏️ Edit</button>
              <button onClick={onDelete} style={{flex:1,padding:"9px",background:"#2e1a1a",border:"1px solid #5a2a2a",borderRadius:8,color:"#e07070",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

// ── BugCard ───────────────────────────────────────────────────────────────────
function BugCard({bug,T,canDelete,onDelete}){
  const [expanded,setExpanded]=useState(false);
  const [pressed,setPressed]=useState(false);
  const sColor={Low:"#27ae60",Medium:"#f0c040",High:"#e67e22",Critical:"#e74c3c"}[bug.severity]||"#9ba8c0";
  return(
    <div
      onClick={()=>setExpanded(e=>!e)}
      onMouseDown={()=>setPressed(true)} onMouseUp={()=>setPressed(false)} onMouseLeave={()=>setPressed(false)}
      onTouchStart={()=>setPressed(true)} onTouchEnd={()=>setPressed(false)}
      style={{background:T.card||DT.cardBg,border:`1px solid ${T.border||DT.cardBorder}`,borderRadius:12,padding:14,marginBottom:10,cursor:"pointer",transform:pressed?"scale(0.985)":"scale(1)",transition:"transform 0.12s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600,color:T.text||DT.text,marginBottom:4}}>{bug.title}</div>
          <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:6,background:`${sColor}22`,color:sColor,border:`1px solid ${sColor}44`}}>{bug.severity}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:11,color:T.sub||DT.subText}}>{bug.status}</div>
          <div style={{fontSize:12,color:T.sub||DT.subText,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s ease"}}>▾</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateRows:expanded?"1fr":"0fr",transition:"grid-template-rows 0.28s cubic-bezier(0.4,0,0.2,1)"}}>
        <div style={{overflow:"hidden"}}>
          <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border||DT.cardBorder}`}} onClick={e=>e.stopPropagation()}>
            <p style={{fontSize:13,color:T.text||DT.text,lineHeight:1.6,marginBottom:8}}>{bug.description}</p>
            {bug.created_at&&<div style={{fontSize:11,color:T.sub||DT.subText,marginBottom:canDelete?10:0}}>Reported: {bug.created_at}</div>}
            {canDelete&&<button onClick={onDelete} style={{width:"100%",padding:"9px",background:"#2e1a1a",border:"1px solid #5a2a2a",borderRadius:8,color:"#e07070",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>🗑️ Delete</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ManagerButton ─────────────────────────────────────────────────────────────
function ManagerButton({isManager,isDev,isDark,onSignIn,onSignOut}){
  const [displayLabel,setDisplayLabel]=useState(isDev?"Developer":isManager?"Manager":"sign-out");
  const [textOpacity,setTextOpacity]=useState(1);

  const activeLabel = isDev?"Developer":isManager?"Manager":"sign-out";

  useEffect(()=>{
    setTextOpacity(0);
    const swap=setTimeout(()=>setDisplayLabel(activeLabel),180);
    const fadein=setTimeout(()=>setTextOpacity(1),200);
    return()=>{clearTimeout(swap);clearTimeout(fadein);};
  },[activeLabel]);

  const signedIn = isManager||isDev;
  const bg = isDev
    ? "linear-gradient(135deg,#00c4ef,#0090bb)"
    : isManager
    ? "linear-gradient(135deg,#f0c040,#e0a020)"
    : isDark?"#1a1f2e":"#e0e0d0";
  const shadow = isDev
    ? "0 2px 12px #00d4ff55"
    : isManager
    ? "0 2px 12px #f0c04055"
    : "none";
  const textColor = signedIn ? "#0a0e1a" : isDark?"#6b7280":"#909080";
  const minW = displayLabel==="sign-out"?140:displayLabel==="Developer"?114:92;

  return(
    <button
      onClick={signedIn?onSignOut:onSignIn}
      style={{
        display:"flex",alignItems:"center",gap:7,
        padding:"7px 13px",
        background:bg,
        border:signedIn?"none":isDark?"1px solid #2a3050":"1px solid #c8c8b8",
        borderRadius:20,cursor:"pointer",fontFamily:"inherit",
        boxShadow:shadow,color:textColor,
        transition:"background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, min-width 0.35s ease",
        minWidth:minW,flexShrink:0,
      }}>
      <LockIcon unlocked={signedIn} size={16}/>
      <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.04em",whiteSpace:"nowrap",opacity:textOpacity,transition:"opacity 0.18s ease",fontFamily:isDev?"'Courier New',monospace":"inherit"}}>
        {displayLabel==="sign-out"?"Manager Sign in":displayLabel}
      </span>
    </button>
  );
}

// ── HomeGrid ──────────────────────────────────────────────────────────────────
function HomeGrid({items,onSelectCategory,isManager,isDev,isDark,onSignIn,onSignOut,onToggleTheme,setItems,hasShownWelcomeRef,bannerOffset=0}){
  const [search,setSearch]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [showExport,setShowExport]=useState(false);
  const [showDataModal,setShowDataModal]=useState(false);
  const [showPasteModal,setShowPasteModal]=useState(false);
  const [pasteText,setPasteText]=useState("");
  const [showWelcome,setShowWelcome]=useState(false);
  const fileInputRef=useRef(null);

  useEffect(()=>{
    if(isDev&&!hasShownWelcomeRef.current.dev){
      hasShownWelcomeRef.current.dev=true;
      const t=setTimeout(()=>{
        setShowWelcome("dev");
        setTimeout(()=>setShowWelcome(false),3000);
      },600);
      return()=>clearTimeout(t);
    }
  },[isDev]);

  useEffect(()=>{
    if(isManager&&!isDev&&!hasShownWelcomeRef.current.manager){
      hasShownWelcomeRef.current.manager=true;
      const t=setTimeout(()=>{
        setShowWelcome("manager");
        setTimeout(()=>setShowWelcome(false),3000);
      },600);
      return()=>clearTimeout(t);
    }
  },[isManager,isDev]);

  function handleSearch(val){
    setSearch(val);
    if(!val.trim()){setSearchResults([]);return;}
    setSearchResults(items.filter(i=>i.name.toLowerCase().includes(val.toLowerCase())).slice(0,10));
  }
  function downloadCSV(){
    const csv=buildCSV(items);
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download="all-pricing.csv";a.click();
    URL.revokeObjectURL(url);setShowExport(false);
  }
  function handleImport(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{try{alert(`Import preview: ${ev.target.result.split("\n").length-1} rows found. (Full import wired in real app.)`);} catch{}};
    reader.readAsText(file);e.target.value="";setShowExport(false);
  }

  return(
    <div style={{minHeight:"100vh",background:isDark?"#080b12":"#f0f0e8",color:isDark?"#f0f0f0":"#1a1a1a",fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80,transition:"background 0.4s ease",paddingTop:bannerOffset}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes bannerSlide{from{opacity:0;transform:translateX(-50%) translateY(-100%)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.85)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
        .cat-card{transition:transform 0.18s ease,box-shadow 0.18s ease;}
        .cat-card:active{transform:scale(0.96)!important;}
        .cat-card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,0.35);}
        .search-result-row{transition:background 0.15s ease;}
        .search-result-row:hover{background:rgba(255,255,255,0.06);}
        .icon-btn{transition:transform 0.15s ease,opacity 0.15s ease;}
        .icon-btn:hover{transform:scale(1.08);}
        .icon-btn:active{transform:scale(0.94);}
        .export-item{transition:background 0.12s ease;}
        .export-item:hover{background:rgba(255,255,255,0.07)!important;}
        .tap-btn{transition:transform 0.1s ease,opacity 0.1s ease;}
        .tap-btn:active{transform:scale(0.94);opacity:0.8;}
        .slide-toggle{transition:background 0.22s ease;}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes devWelcome{
          0%  {transform:translateX(120%);opacity:0;}
          10% {transform:translateX(0%);opacity:1;}
          75% {transform:translateX(0%);opacity:1;}
          100%{transform:translateX(-120%);opacity:0;}
        }
      `}</style>

      {/* Header */}
      <div style={{padding:"24px 16px 16px",background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:isDark?"1px solid #141c2c":"1px solid #d8d8c8"}}>
        <div style={{fontSize:10,color:isDark?"#3a4a60":"#909080",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>Gil's Grocery</div>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:2}}>
          <div style={{fontSize:26,fontWeight:700,color:isDark?"#f0f0f0":"#1a1a1a"}}>Price Manager</div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {/* Theme toggle */}
            <button onClick={onToggleTheme} className="icon-btn" style={{background:isDark?"#1a1f2e":"#e0e0d0",border:isDark?"1px solid #2a3050":"1px solid #c8c8b8",borderRadius:8,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",position:"relative"}}>
              <span style={{position:"absolute",fontSize:16,transition:"transform 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.3s ease",transform:isDark?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)",opacity:isDark?1:0}}>☀️</span>
              <span style={{position:"absolute",fontSize:16,transition:"transform 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.3s ease",transform:isDark?"scale(0) rotate(-180deg)":"scale(1) rotate(0deg)",opacity:isDark?0:1}}>🌙</span>
            </button>
            {/* Import/export */}
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowExport(v=>!v)} className="icon-btn" style={{background:isDark?"#1a1f2e":"#e0e0d0",border:isDark?"1px solid #2a3050":"1px solid #c8c8b8",borderRadius:8,width:34,height:34,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>⇅</button>
              {showExport&&(
                <div style={{position:"absolute",right:0,top:40,background:isDark?"#1a1f2e":"#fff",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:12,padding:6,zIndex:300,minWidth:200,boxShadow:"0 6px 24px rgba(0,0,0,0.35)",animation:"slideDown 0.18s ease"}}>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:isDark?"#4a5568":"#909080",padding:"6px 12px 4px"}}>Export</div>
                  <button onClick={downloadCSV} className="export-item" style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",background:"none",border:"none",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:13,fontFamily:"inherit",cursor:"pointer",borderRadius:8}}>📥 Download All CSV</button>
                  <div style={{height:1,background:isDark?"#2a3050":"#e0e0d0",margin:"4px 0"}}/>
                  <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:isDark?"#4a5568":"#909080",padding:"4px 12px"}}>Import</div>
                  <button onClick={()=>fileInputRef.current?.click()} className="export-item" style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",background:"none",border:"none",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:13,fontFamily:"inherit",cursor:"pointer",borderRadius:8}}>📂 Import from CSV</button>
                  <button onClick={()=>{setShowPasteModal(true);setShowExport(false);}} className="export-item" style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",background:"none",border:"none",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:13,fontFamily:"inherit",cursor:"pointer",borderRadius:8}}>📋 Paste Data</button>
                  <div style={{height:1,background:isDark?"#2a3050":"#e0e0d0",margin:"4px 0"}}/>
                  <button onClick={()=>{setShowDataModal(true);setShowExport(false);}} className="export-item" style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"9px 12px",background:"none",border:"none",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:13,fontFamily:"inherit",cursor:"pointer",borderRadius:8}}>📤 Show my data</button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".csv" style={{display:"none"}} onChange={handleImport}/>
            </div>
            {/* Manager sign in/out — smooth both ways */}
            <ManagerButton isManager={isManager} isDev={isDev} isDark={isDark} onSignIn={onSignIn} onSignOut={onSignOut}/>
          </div>
        </div>
        <div style={{fontSize:12,color:isDark?"#3a4a60":"#909080",height:18,overflow:"hidden",position:"relative"}}>
          <span style={{position:"absolute",left:0,top:0,transition:"opacity 0.3s ease",opacity:showWelcome?0:1}}>
            {items.length} items · {CATEGORIES.length} categories
          </span>
          <span style={{
            position:"absolute",left:0,top:0,
            color:showWelcome==="dev"?DT.accent:"#f0c040",
            fontWeight:600,letterSpacing:"0.04em",
            whiteSpace:"nowrap",
            fontFamily:showWelcome==="dev"?"'Courier New',monospace":"'Georgia','Times New Roman',serif",
            animation:showWelcome?"devWelcome 2.8s cubic-bezier(0.25,0.1,0.25,1) forwards":"none",
            opacity:showWelcome?1:0,
          }}>
            {showWelcome==="dev"?"Welcome back, Developer.":"Welcome back, Manager."}
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{padding:"14px 16px"}}>
        <input value={search} onChange={e=>handleSearch(e.target.value)} placeholder="🔍  Search all items across categories..."
          style={{width:"100%",background:isDark?"#0f1525":"#ffffff",border:isDark?"1px solid #1e2a40":"1px solid #d0d0c0",borderRadius:12,padding:"12px 16px",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:14,fontFamily:"inherit",boxSizing:"border-box"}}/>
        {searchResults.length>0&&(
          <div style={{background:isDark?"#0f1525":"#fff",border:isDark?"1px solid #1e2a40":"1px solid #d0d0c0",borderRadius:10,marginTop:6,overflow:"hidden",animation:"slideDown 0.2s ease"}}>
            {searchResults.map((item,idx)=>{
              const cat=CATEGORIES.find(c=>c.key===item.category);
              return(
                <div key={item.id} className="search-result-row tap-btn" onClick={()=>{onSelectCategory(cat, item.id);setSearch("");setSearchResults([]);}}
                  style={{padding:"10px 14px",borderBottom:isDark?"1px solid #141c2c":"1px solid #e8e8d8",display:"flex",justifyContent:"space-between",alignItems:"center",animation:`fadeIn 0.15s ease ${idx*0.04}s both`,cursor:"pointer"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:isDark?"#f0f0f0":"#1a1a1a"}}>{item.name}</div>
                    <div style={{fontSize:11,color:isDark?"#3a4a60":"#909080"}}>{cat?.icon} {cat?.name}</div>
                  </div>
                  <div style={{fontSize:15,fontWeight:700,color:cat?.theme.accent||"#f0c040"}}>${item.price.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category grid */}
      <div style={{padding:"0 16px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}} onClick={()=>setShowExport(false)}>
        {CATEGORIES.map((cat,idx)=>{
          const count=items.filter(i=>i.category===cat.key).length;
          const oos=items.filter(i=>i.category===cat.key&&i.outOfStock).length;
          return(
            <div key={cat.key} onClick={()=>onSelectCategory(cat)} className="cat-card"
              style={{background:`linear-gradient(135deg,${cat.theme.card} 0%,${cat.theme.bg} 100%)`,border:`1px solid ${cat.theme.border}`,borderRadius:16,padding:"18px 14px",cursor:"pointer",position:"relative",overflow:"hidden",animation:`fadeUp 0.35s ease ${idx*0.07}s both`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:cat.theme.accent,borderRadius:"16px 16px 0 0",opacity:0.9}}/>
              <div style={{fontSize:26,marginBottom:8,animation:`fadeUp 0.35s ease ${idx*0.07+0.1}s both`}}>{cat.icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:"#f0f0f0",marginBottom:2}}>{cat.name}</div>
              <div style={{fontSize:11,color:cat.theme.sub}}>{count} item{count!==1?"s":""}{oos>0&&<span style={{color:"#e74c3c"}}> · {oos} out</span>}</div>
              <div style={{position:"absolute",bottom:-16,right:-16,width:50,height:50,borderRadius:"50%",background:cat.theme.accent,opacity:0.08,transition:"transform 0.3s ease",}}/>
            </div>
          );
        })}
        {/* Recommendations — double-wide */}
        {(()=>{
          const recCount=items.filter(i=>i.gilliesRecommendation).length;
          return(
            <div onClick={()=>onSelectCategory({key:"recommendations",name:"Gillie's Recommendations",icon:"⭐",theme:{bg:"#120e00",header:"linear-gradient(160deg,#1e1800,#120e00)",accent:"#f0c040",accentText:"#0f1117",card:"#1a1400",border:"#3a2e00",sub:"#806040",badge:"#1e1800",badgeBorder:"#3a2e00",badgeText:"#c0a040",oosOverlay:"rgba(18,14,0,0.6)"},subcategories:[]})}
              className="cat-card"
              style={{gridColumn:"1 / -1",background:"linear-gradient(135deg,#1a1400 0%,#120e00 100%)",border:"1px solid #3a2e00",borderRadius:16,padding:"18px 14px",cursor:"pointer",position:"relative",overflow:"hidden",animation:`fadeUp 0.35s ease ${CATEGORIES.length*0.07}s both`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"#f0c040",borderRadius:"16px 16px 0 0",opacity:0.9}}/>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{fontSize:36}}>⭐</div>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:"#f0c040",marginBottom:2}}>Gillie's Recommendations</div>
                  <div style={{fontSize:12,color:"#806040"}}>{recCount} item{recCount!==1?"s":""} personally recommended by the owner</div>
                </div>
              </div>
              <div style={{position:"absolute",bottom:-20,right:-20,width:70,height:70,borderRadius:"50%",background:"#f0c040",opacity:0.06}}/>
            </div>
          );
        })()}
      </div>

      {/* Data modal */}
      {showDataModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:isDark?"#1a1f2e":"#fff",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:16,padding:22,width:"100%",maxWidth:400,maxHeight:"80vh",display:"flex",flexDirection:"column",animation:"modalIn 0.25s ease"}}>
            <div style={{fontSize:17,fontWeight:700,color:isDark?"#f0f0f0":"#1a1a1a",marginBottom:10}}>📋 Your Data</div>
            <textarea readOnly value={JSON.stringify(items,null,2)} style={{flex:1,minHeight:200,background:isDark?"#0f1117":"#f8f8f0",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:10,padding:12,color:isDark?"#f0f0f0":"#1a1a1a",fontSize:11,fontFamily:"monospace",resize:"none"}} onFocus={e=>e.target.select()}/>
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button onClick={()=>setShowDataModal(false)} style={{flex:1,padding:11,background:"transparent",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:10,color:isDark?"#6b7280":"#909080",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Close</button>
              <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(items)).catch(()=>{})} style={{flex:2,padding:11,background:"#f0c040",border:"none",borderRadius:10,color:"#0f1117",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Copy</button>
            </div>
          </div>
        </div>
      )}
      {showPasteModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:isDark?"#1a1f2e":"#fff",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:16,padding:22,width:"100%",maxWidth:400,maxHeight:"80vh",display:"flex",flexDirection:"column",animation:"modalIn 0.25s ease"}}>
            <div style={{fontSize:17,fontWeight:700,color:isDark?"#f0f0f0":"#1a1a1a",marginBottom:10}}>📋 Paste Data</div>
            <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder="Paste JSON data here..." style={{flex:1,minHeight:200,background:isDark?"#0f1117":"#f8f8f0",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:10,padding:12,color:isDark?"#f0f0f0":"#1a1a1a",fontSize:11,fontFamily:"monospace",resize:"none"}}/>
            <div style={{display:"flex",gap:10,marginTop:12}}>
              <button onClick={()=>{setShowPasteModal(false);setPasteText("");}} style={{flex:1,padding:11,background:"transparent",border:isDark?"1px solid #2a3050":"1px solid #d0d0c0",borderRadius:10,color:isDark?"#6b7280":"#909080",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              <button onClick={()=>{try{const p=JSON.parse(pasteText);if(Array.isArray(p)){setItems(p);setShowPasteModal(false);setPasteText("");}}catch{alert("Invalid JSON");}}} style={{flex:2,padding:11,background:"#f0c040",border:"none",borderRadius:10,color:"#0f1117",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Import</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CategoryPage ──────────────────────────────────────────────────────────────
function CategoryPage({category,items,setItems,onBack,isManager,isDev,onRequireManager,isDark,onToggleTheme,onAuditLog,scrollToItem,managerDisabled=false,bannerOffset=0}){
  function requireManager(){
    if(!isManager){onRequireManager();return false;}
    if(managerDisabled&&!isDev){onRequireManager();return false;}
    return true;
  }
  // Special recommendations view
  if(category.key==="recommendations"){
    const recItems=items.filter(i=>i.gilliesRecommendation&&!i.outOfStock);
    const bg=isDark?"#120e00":"#fffff0";
    const card=isDark?"#1a1400":"#fffef0";
    const border=isDark?"#3a2e00":"#d0c080";
    const text=isDark?"#f0f0f0":"#1a1a1a";
    const sub=isDark?"#806040":"#907040";
    const accent="#f0c040";
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80}}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{background:isDark?"linear-gradient(160deg,#1e1800,#120e00)":"linear-gradient(160deg,#f8f0c0,#fffff0)",borderBottom:`1px solid ${border}`,padding:"16px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:0}}>
            <button onClick={onBack} style={{background:isDark?"#1a1400":"#f0e8a0",border:`1px solid ${border}`,borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:text,fontFamily:"inherit",flexShrink:0}}>←</button>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:accent}}>⭐ Gillie's Recommendations</div>
              <div style={{fontSize:11,color:sub}}>{recItems.length} item{recItems.length!==1?"s":""} · personally selected by the owner</div>
            </div>
          </div>
        </div>
        <div style={{padding:"14px"}}>
          {recItems.length===0&&(
            <div style={{textAlign:"center",padding:"50px 20px",color:sub}}>
              <div style={{fontSize:40,marginBottom:10}}>⭐</div>
              <div style={{fontSize:16,fontWeight:600,color:text,marginBottom:6}}>No recommendations yet</div>
              <div style={{fontSize:13}}>Toggle "Gillie's Recommendation" on any item to feature it here</div>
            </div>
          )}
          {recItems.map((item,idx)=>{
            const cat=CATEGORIES.find(c=>c.key===item.category);
            const T2=buildThemeVariant(cat?.theme||category.theme,isDark?"dark":"light");
            return(
              <div key={item.id} style={{animation:`fadeUp 0.22s ease ${idx*0.05}s both`,transition:"box-shadow 0.15s ease",cursor:"default"}}>
                <ItemCard item={item} T={T2} onEdit={()=>{}} onDelete={()=>{}} onToggle={()=>{}}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const baseT=category.theme;
  const T=buildThemeVariant(baseT,isDark?"dark":"light");
  const isAlcohol=category.key==="beverages_alcoholic";

  const [activeSub,setActiveSub]=useState(null);
  const [search,setSearch]=useState("");
  const [filterPack,setFilterPack]=useState("All");
  const [filterContainer,setFilterContainer]=useState("All");
  const [sortBy,setSortBy]=useState("name");
  const [showForm,setShowForm]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const [syncing,setSyncing]=useState(false);
  const [confirmDelete,setConfirmDelete]=useState(null);
  const [massSelectMode,setMassSelectMode]=useState(false);
  const [selected,setSelected]=useState(new Set());
  const [mapOpen,setMapOpen]=useState(false);
  const [highlightedItem,setHighlightedItem]=useState(scrollToItem||null);
  const itemRefs=useRef({});

  // Scroll to and open item when arriving from search
  useEffect(()=>{
    if(!scrollToItem)return;
    // Small delay to let items render
    const t=setTimeout(()=>{
      const el=itemRefs.current[scrollToItem];
      if(el){
        el.scrollIntoView({behavior:"smooth",block:"center"});
      }
      // Clear highlight after 2s
      const t2=setTimeout(()=>setHighlightedItem(null),2000);
      return()=>clearTimeout(t2);
    },300);
    return()=>clearTimeout(t);
  },[scrollToItem]);

  const emptyForm={name:"",subcategory:category.subcategories[0].key,price:"",location:"",inventory:"",notes:"",outOfStock:false,mapZone:null,expiryDate:"",gilliesRecommendation:false,...emptyAlcoholForm(category.subcategories[0].key)};
  const [form,setForm]=useState(emptyForm);

  function setSubcategory(sub){setForm(f=>({...f,subcategory:sub,...emptyAlcoholForm(sub)}));}

  const filtered=items
    .filter(i=>i.category===category.key)
    .filter(i=>!activeSub||i.subcategory===activeSub)
    .filter(i=>i.name.toLowerCase().includes(search.toLowerCase()))
    .filter(i=>filterPack==="All"||!PACK_SUBS.includes(i.subcategory)||i.packSize===filterPack)
    .filter(i=>filterContainer==="All"||!PACK_SUBS.includes(i.subcategory)||i.containerType===filterContainer)
    .sort((a,b)=>{
      if(sortBy==="type"&&WINE_SUBS.includes(activeSub||"wine")){
        const ta=WINE_TYPES.indexOf(a.wineType||"Other"),tb=WINE_TYPES.indexOf(b.wineType||"Other");
        return ta!==tb?ta-tb:a.name.localeCompare(b.name);
      }
      if(sortBy==="price_desc")return b.price-a.price;
      if(sortBy==="price_asc")return a.price-b.price;
      return a.name.localeCompare(b.name);
    });

  const hasFilters=search||filterPack!=="All"||filterContainer!=="All"||sortBy!=="name";
  function resetFilters(){setSearch("");setFilterPack("All");setFilterContainer("All");setSortBy("name");}

  function openEdit(item){
    if(!requireManager())return;
    setEditItem(item);
    setForm({name:item.name,subcategory:item.subcategory,price:String(item.price),location:item.location||"",
      packSize:item.packSize||"6 Pack",containerType:item.containerType||"Can",
      deposit:item.deposit!=null?String(item.deposit):"",wineType:item.wineType||"Red",
      inventory:item.inventory!=null?String(item.inventory):"",
      notes:item.notes||"",
      outOfStock:item.outOfStock||false,
      mapZone:item.mapZone||null,
      expiryDate:item.expiryDate||"",
      gilliesRecommendation:item.gilliesRecommendation||false});
    setMapOpen(!!item.mapZone);
    setShowForm(true);
  }

  function handleAddClick(action){
    if(action==="cancel"){setShowForm(false);setEditItem(null);setForm(emptyForm);setMapOpen(false);return;}
    if(!requireManager())return;
    setEditItem(null);setForm(emptyForm);setMapOpen(false);setShowForm(true);
  }

  async function handleSave(){
    if(!form.name.trim()||!form.price)return;
    setSyncing(true);
    const inventoryCount = form.inventory!==""?parseInt(form.inventory):null;
    const autoOos = inventoryCount===0 ? true : form.outOfStock;
    const autoLocation = form.location.trim() || (form.mapZone ? FLOOR_ZONES.find(z=>z.key===form.mapZone)?.label||"" : "");
    const base={
      name:form.name.trim(), subcategory:form.subcategory, price:parseFloat(form.price),
      location:autoLocation, notes:form.notes||"",
      inventory:inventoryCount, outOfStock:autoOos,
      mapZone:form.mapZone||null,
      expiryDate:form.expiryDate||"",
      gilliesRecommendation:form.gilliesRecommendation||false,
    };
    const extra=PACK_SUBS.includes(form.subcategory)
      ?{packSize:form.packSize,containerType:form.containerType,deposit:form.deposit?parseFloat(form.deposit):0}
      :WINE_SUBS.includes(form.subcategory)?{wineType:form.wineType}:{};
    // Build Supabase row (snake_case)
    const row={
      name:base.name, category:category.key, subcategory:base.subcategory,
      price:base.price, location:base.location, notes:base.notes,
      inventory:base.inventory, out_of_stock:base.outOfStock,
      map_zone:base.mapZone, expiry_date:base.expiryDate||null,
      gillies_recommendation:base.gilliesRecommendation||false,
      pack_size:extra.packSize||null, container_type:extra.containerType||null,
      deposit:extra.deposit??null, wine_type:extra.wineType||null,
    };
    const action=editItem?"edited":"added";
    try{
      if(editItem){
        const {error}=await sb.from("items").update(row).eq("id",editItem.id);
        if(!error)setItems(prev=>prev.map(i=>i.id===editItem.id?{...i,...base,...extra}:i));
      } else {
        const {data,error}=await sb.from("items").insert(row).select().single();
        if(!error&&data)setItems(prev=>[...prev,{id:data.id,category:category.key,...base,...extra}]);
      }
    }catch(e){console.error("Save error:",e);}
    const cat=CATEGORIES.find(c=>c.key===category.key);
    const sub=category.subcategories.find(s=>s.key===base.subcategory);
    onAuditLog&&onAuditLog({
      id:Date.now(), action, itemName:base.name,
      category:cat?.name||category.key, subcategory:sub?.name||base.subcategory,
      price:parseFloat(form.price),
      details:PACK_SUBS.includes(form.subcategory)?`${form.packSize} · ${form.containerType}`:WINE_SUBS.includes(form.subcategory)?form.wineType:"",
      timestamp:new Date(),
      role:isDev?"Developer":"Manager",
      // snapshot for undo: previous item state (for edits) or item id (for adds/deletes)
      snapshot:action==="edited"?editItem:null,
      itemId:action==="edited"?editItem?.id:null,
      categoryKey:category.key,
    });
    setSyncing(false);setEditItem(null);setShowForm(false);setForm(emptyForm);
  }

  // Pack size groups for beer view
  const packGroups=isAlcohol&&activeSub&&PACK_SUBS.includes(activeSub)&&sortBy==="name"
    ? PACK_SIZES.filter(p=>filtered.some(i=>i.packSize===p)) : null;
  // Wine type groups
  const wineGroups=isAlcohol&&activeSub==="wine"&&sortBy==="type"
    ? WINE_TYPES.filter(t=>filtered.some(i=>i.wineType===t)) : null;

  const showPackFilters=isAlcohol&&activeSub&&PACK_SUBS.includes(activeSub);
  const showWineSort=isAlcohol&&activeSub==="wine";

  const inp={background:isDark?baseT.bg:"#f8f8f0",border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:14,fontFamily:"inherit",width:"100%",boxSizing:"border-box"};
  const accentColor=baseT.accent;

  return(
    <div style={{minHeight:"100vh",background:T.bg,color:isDark?"#f0f0f0":"#1a1a1a",fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80,transition:"background 0.4s ease"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.87)}70%{transform:scale(1.03)}100%{opacity:1;transform:scale(1)}}
        .icon-btn{transition:transform 0.15s ease,opacity 0.15s ease;}
        .icon-btn:hover{transform:scale(1.08);}
        .icon-btn:active{transform:scale(0.94);}
        .tap-btn{transition:transform 0.1s ease,opacity 0.12s ease;}
        .tap-btn:active{transform:scale(0.95);opacity:0.8;}
        .item-row{transition:box-shadow 0.15s ease;}
        .item-row:hover{box-shadow:0 4px 18px rgba(0,0,0,0.22);}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>

      {/* Confirm delete modal */}
      {confirmDelete&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:24,width:"100%",maxWidth:320,animation:"popIn 0.25s cubic-bezier(0.34,1.1,0.64,1)"}}>
            <div style={{fontSize:28,textAlign:"center",marginBottom:10}}>🗑️</div>
            <div style={{fontSize:17,fontWeight:700,color:isDark?"#f0f0f0":"#1a1a1a",marginBottom:8,textAlign:"center"}}>
              {confirmDelete.ids?"Delete Items?":"Delete Item?"}
            </div>
            <div style={{fontSize:13,color:baseT.sub,marginBottom:20,textAlign:"center",lineHeight:1.5}}>
              {confirmDelete.ids
                ? <><span style={{color:"#e74c3c",fontWeight:700}}>{confirmDelete.name}</span> will be permanently removed.</>
                : <>"<span style={{color:isDark?"#f0f0f0":"#1a1a1a",fontWeight:600}}>{confirmDelete.name}</span>" will be permanently removed for everyone.</>
              }
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfirmDelete(null)} style={{flex:1,padding:12,background:"transparent",border:`1px solid ${T.border}`,borderRadius:10,color:baseT.sub,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              <button onClick={async()=>{
                if(confirmDelete.ids){
                  await sb.from("items").delete().in("id",confirmDelete.ids);
                  setItems(prev=>prev.filter(i=>!confirmDelete.ids.includes(i.id)));
                  setSelected(new Set());
                  setMassSelectMode(false);
                } else {
                  await sb.from("items").delete().eq("id",confirmDelete.id);
                  setItems(prev=>prev.filter(i=>i.id!==confirmDelete.id));
                }
                setConfirmDelete(null);
              }} style={{flex:2,padding:12,background:"#e74c3c",border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Mass delete confirm modal */}
      {massSelectMode&&(
        <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 32px)",maxWidth:448,zIndex:300,animation:"slideDown 0.2s ease"}}>
          <div style={{background:"#1a0a0a",border:"1px solid #5a2a2a",borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
            <div style={{fontSize:13,color:"#e07070",fontWeight:600}}>{selected.size} item{selected.size!==1?"s":""} selected</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setSelected(new Set(filtered.map(i=>i.id)))} style={{padding:"7px 12px",background:"transparent",border:"1px solid #3a2a2a",borderRadius:8,color:"#e07070",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Select All</button>
              <button onClick={()=>setConfirmDelete({id:"__mass__",name:`${selected.size} item${selected.size!==1?"s":""}`,ids:[...selected]})} style={{padding:"7px 14px",background:"#e74c3c",border:"none",borderRadius:8,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{background:baseT.header,borderBottom:`1px solid ${baseT.border}`,padding:"14px 14px 0",position:"sticky",top:bannerOffset,zIndex:100}}>
        {/* Manager disabled banner */}
        {managerDisabled&&!isDev&&(
          <div style={{background:"#e74c3c",borderRadius:8,padding:"7px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8,animation:"slideDown 0.25s ease"}}>
            <span style={{fontSize:13}}>🔒</span>
            <span style={{fontSize:12,fontWeight:600,color:"#fff"}}>Manager permissions are temporarily disabled</span>
          </div>
        )}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <button onClick={onBack} className="icon-btn" style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:8,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.badgeText,fontSize:16,flexShrink:0,fontFamily:"inherit"}}>←</button>
          <span style={{fontSize:20}}>{category.icon}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:17,fontWeight:700,color:accentColor}}>{category.name}</div>
            <div style={{fontSize:11,color:baseT.sub,textTransform:"uppercase",letterSpacing:"0.05em"}}>{filtered.length} item{filtered.length!==1?"s":""}{syncing&&<span style={{animation:"pulse 1s infinite"}}> · ⏳ Syncing…</span>}</div>
          </div>
          {/* Theme + lock */}
          {isDev&&(
            <button onClick={()=>{setMassSelectMode(m=>!m);setSelected(new Set());}} className="icon-btn"
              style={{background:massSelectMode?"#2a0a0a":T.badge,border:`1px solid ${massSelectMode?"#e74c3c44":T.badgeBorder}`,borderRadius:8,width:34,height:34,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.2s"}}>
              {massSelectMode?"✕":"🗑️"}
            </button>
          )}
          <button onClick={onToggleTheme} className="icon-btn" style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:8,width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden",position:"relative"}}>
            <span style={{position:"absolute",fontSize:15,transition:"transform 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.3s ease",transform:isDark?"scale(1) rotate(0deg)":"scale(0) rotate(180deg)",opacity:isDark?1:0}}>☀️</span>
            <span style={{position:"absolute",fontSize:15,transition:"transform 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.3s ease",transform:isDark?"scale(0) rotate(-180deg)":"scale(1) rotate(0deg)",opacity:isDark?0:1}}>🌙</span>
          </button>
          <button onClick={()=>onRequireManager()} className="icon-btn" style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:8,width:34,height:34,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:isManager?"#f0c040":baseT.sub}}><LockIcon unlocked={isManager} size={18}/></button>
          {/* Comet Add/Cancel */}
          <CometButton showCancel={showForm} onClick={handleAddClick}
            accent={accentColor} accentText={baseT.accentText}
            cancelBg={T.badge} cancelText={baseT.sub} cancelBorder={T.badgeBorder}/>
        </div>

        {/* Subcategory pills */}
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:10,scrollbarWidth:"none"}}>
          <button onClick={()=>{setActiveSub(null);setFilterPack("All");setFilterContainer("All");}} style={{flexShrink:0,padding:"6px 14px",borderRadius:20,border:`1px solid ${!activeSub?accentColor:baseT.border}`,background:!activeSub?accentColor:"transparent",color:!activeSub?baseT.accentText:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:!activeSub?700:400}}>All</button>
          {category.subcategories.map(sub=>(
            <button key={sub.key} onClick={()=>{setActiveSub(sub.key===activeSub?null:sub.key);setFilterPack("All");setFilterContainer("All");}}
              style={{flexShrink:0,padding:"6px 14px",borderRadius:20,border:`1px solid ${activeSub===sub.key?accentColor:baseT.border}`,background:activeSub===sub.key?accentColor:"transparent",color:activeSub===sub.key?baseT.accentText:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:activeSub===sub.key?700:400,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
              {sub.icon} {sub.name}
            </button>
          ))}
        </div>

        {/* Search + filters (hidden when form open) */}
        {!showForm&&(
          <div style={{paddingBottom:12}}>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..."
                style={{flex:1,background:T.badge,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 12px",color:isDark?"#f0f0f0":"#1a1a1a",fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/>
              {hasFilters&&<button onClick={resetFilters} style={{background:T.badge,border:`1px solid ${T.badgeBorder}`,borderRadius:8,padding:"9px 12px",color:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>✕ Reset</button>}
            </div>
            <div style={{display:"flex",gap:6}}>
              {showPackFilters&&<>
                <select value={filterPack} onChange={e=>setFilterPack(e.target.value)} style={{flex:1,background:T.badge,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 4px",color:baseT.sub,fontSize:12,fontFamily:"inherit"}}>
                  <option value="All">All Sizes</option>{PACK_SIZES.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <select value={filterContainer} onChange={e=>setFilterContainer(e.target.value)} style={{flex:1,background:T.badge,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 4px",color:baseT.sub,fontSize:12,fontFamily:"inherit"}}>
                  <option value="All">Can & Bottle</option>{CONTAINER_TYPES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </>}
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{flex:1,background:T.badge,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 4px",color:baseT.sub,fontSize:12,fontFamily:"inherit"}}>
                <option value="name">A–Z</option>
                {showWineSort&&<option value="type">By Type</option>}
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"14px 14px 20px"}}>
        {/* Add/Edit form */}
        {showForm&&(
          <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:18,marginBottom:16,animation:"slideDown 0.22s cubic-bezier(0.34,1.1,0.64,1)"}}>
            <div style={{fontSize:15,fontWeight:700,color:accentColor,marginBottom:14}}>{editItem?"✏️ Edit Item":"➕ New "+category.name+" Item"}</div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Item Name</div>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Bud Light" style={inp}/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Subcategory</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {category.subcategories.map(sub=>(
                  <button key={sub.key} onClick={()=>setSubcategory(sub.key)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${form.subcategory===sub.key?accentColor:T.border}`,background:form.subcategory===sub.key?accentColor:"transparent",color:form.subcategory===sub.key?baseT.accentText:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                    {sub.icon} {sub.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Pack size */}
            {PACK_SUBS.includes(form.subcategory)&&<>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Pack Size</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {PACK_SIZES.map(p=>(
                    <button key={p} onClick={()=>setForm(f=>({...f,packSize:p,deposit:String(AUTO_DEPOSIT[p]??0)}))} style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${form.packSize===p?accentColor:T.border}`,background:form.packSize===p?accentColor:"transparent",color:form.packSize===p?baseT.accentText:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:form.packSize===p?700:400}}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Container</div>
                <div style={{display:"flex",gap:6}}>
                  {CONTAINER_TYPES.map(c=>(
                    <button key={c} onClick={()=>setForm(f=>({...f,containerType:c}))} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${form.containerType===c?accentColor:T.border}`,background:form.containerType===c?accentColor:"transparent",color:form.containerType===c?baseT.accentText:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:form.containerType===c?700:400}}>{c==="Can"?"🥫 Can":"🍶 Bottle"}</button>
                  ))}
                </div>
              </div>
            </>}
            {/* Wine type */}
            {WINE_SUBS.includes(form.subcategory)&&(
              <div style={{marginBottom:10}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Wine Type</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {WINE_TYPES.map(w=>(
                    <button key={w} onClick={()=>setForm(f=>({...f,wineType:w}))} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${form.wineType===w?accentColor:T.border}`,background:form.wineType===w?accentColor:"transparent",color:form.wineType===w?baseT.accentText:baseT.sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:form.wineType===w?700:400}}>{w}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginBottom:PACK_SUBS.includes(form.subcategory)?10:12}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Price ($)</div>
                <input type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="0.00" style={inp}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Location Label</div>
                <input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="e.g. Aisle 2" style={inp}/>
              </div>
            </div>

            {/* Floor plan zone picker — collapsible */}
            <div style={{marginBottom:12}}>
              <button type="button" onClick={()=>setMapOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",padding:"0 0 5px",cursor:"pointer",fontFamily:"inherit"}}>
                <div style={{fontSize:11,color:baseT.sub,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  Pin on Floor Map {form.mapZone&&<span style={{color:accentColor}}>· {FLOOR_ZONES.find(z=>z.key===form.mapZone)?.label}</span>}
                </div>
                <span style={{fontSize:12,color:baseT.sub,transform:mapOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.25s ease",display:"inline-block"}}>▾</span>
              </button>
              <div style={{display:"grid",gridTemplateRows:mapOpen?"1fr":"0fr",transition:"grid-template-rows 0.28s cubic-bezier(0.4,0,0.2,1)"}}>
                <div style={{overflow:"hidden"}}>
                  <FloorPlan pinZone={form.mapZone} onSelectZone={z=>{
                    const newZone=form.mapZone===z?null:z;
                    const zoneLabel=newZone?FLOOR_ZONES.find(fz=>fz.key===newZone)?.label||"":"";
                    setForm(f=>({...f,mapZone:newZone,location:zoneLabel||f.location}));
                  }} accent={accentColor}/>
                  {form.mapZone&&(
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
                      <span style={{fontSize:11,color:accentColor,fontWeight:600}}>📍 {FLOOR_ZONES.find(z=>z.key===form.mapZone)?.label}</span>
                      <button onClick={()=>setForm(f=>({...f,mapZone:null}))} style={{fontSize:11,color:baseT.sub,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit"}}>✕ Clear</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {PACK_SUBS.includes(form.subcategory)&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Deposit ($) <span style={{opacity:0.5,fontWeight:400,textTransform:"none",letterSpacing:0}}>— auto-filled, editable</span></div>
                <input type="number" min="0" step="0.01" value={form.deposit||""} onChange={e=>setForm(f=>({...f,deposit:e.target.value}))} placeholder="0.00" style={inp}/>
              </div>
            )}

            {/* Inventory count */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                Inventory Count <span style={{opacity:0.5,fontWeight:400,textTransform:"none",letterSpacing:0}}>— optional · 0 = out of stock</span>
              </div>
              <input type="number" min="0" step="1" value={form.inventory}
                onChange={e=>{
                  const val=e.target.value;
                  setForm(f=>({...f,inventory:val,outOfStock:val!==""&&parseInt(val)===0?true:f.outOfStock}));
                }}
                placeholder="e.g. 24" style={inp}/>
            </div>

            {/* Out of stock toggle */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:"11px 14px",background:isDark?baseT.bg:"#f8f8f0",border:`1px solid ${form.outOfStock?"#e74c3c44":T.border}`,borderRadius:10,transition:"border-color 0.25s ease"}}>
              <div>
                <div style={{fontSize:14,color:isDark?"#f0f0f0":"#1a1a1a"}}>Out of Stock</div>
                {form.inventory!==""&&parseInt(form.inventory)===0&&<div style={{fontSize:11,color:"#e74c3c",marginTop:2}}>Auto-set because inventory is 0</div>}
              </div>
              <button onClick={()=>setForm(f=>({...f,outOfStock:!f.outOfStock}))}
                style={{width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",background:form.outOfStock?"#e74c3c":T.badge,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{width:20,height:20,borderRadius:10,background:"#fff",position:"absolute",top:3,left:form.outOfStock?25:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
              </button>
            </div>

            {/* Gillie's Recommendation toggle */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,padding:"11px 14px",background:isDark?baseT.bg:"#f8f8f0",border:`1px solid ${form.gilliesRecommendation?"#f0c04044":T.border}`,borderRadius:10,transition:"border-color 0.25s ease"}}>
              <div>
                <div style={{fontSize:14,color:isDark?"#f0f0f0":"#1a1a1a"}}>⭐ Gillie's Recommendation</div>
                <div style={{fontSize:11,color:isDark?"#3a4a60":"#909080",marginTop:2}}>Highlighted in the recommendations section</div>
              </div>
              <button onClick={()=>setForm(f=>({...f,gilliesRecommendation:!f.gilliesRecommendation}))}
                style={{width:48,height:26,borderRadius:13,border:"none",cursor:"pointer",background:form.gilliesRecommendation?"#f0c040":T.badge,position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{width:20,height:20,borderRadius:10,background:"#fff",position:"absolute",top:3,left:form.gilliesRecommendation?25:3,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
              </button>
            </div>

            {/* Notes */}
            <div style={{marginBottom:category.key==="grocery"?10:14}}>
              <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Notes <span style={{opacity:0.5,fontWeight:400,textTransform:"none",letterSpacing:0}}>— optional</span></div>
              <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Price change coming, check with supplier…" style={{...inp,minHeight:70,resize:"none",lineHeight:1.5}}/>
            </div>

            {/* Next Expiration Date — grocery only */}
            {category.key==="grocery"&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:baseT.sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>
                  Next Expiration Date <span style={{opacity:0.5,fontWeight:400,textTransform:"none",letterSpacing:0}}>— optional</span>
                </div>
                <input type="date" value={form.expiryDate} onChange={e=>setForm(f=>({...f,expiryDate:e.target.value}))} style={{...inp,colorScheme:isDark?"dark":"light"}}/>
                {form.expiryDate&&(()=>{
                  const days=Math.ceil((new Date(form.expiryDate)-new Date())/(1000*60*60*24));
                  const color=days<=3?"#e74c3c":days<=7?"#e67e22":"#27ae60";
                  return <div style={{fontSize:11,color,marginTop:4,fontWeight:600}}>{days<=0?"⚠️ Expired":days===1?"⚠️ Expires tomorrow":`✓ Expires in ${days} day${days!==1?"s":""}`}</div>;
                })()}
              </div>
            )}

            <button onClick={handleSave} disabled={syncing} className="tap-btn" style={{width:"100%",padding:"12px",background:accentColor,border:"none",borderRadius:10,color:baseT.accentText,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",opacity:syncing?0.7:1}}>
              {syncing?"Saving…":editItem?"Save Changes":"Add Item"}
            </button>
          </div>
        )}

        {filtered.length===0&&!showForm&&(
          <div style={{textAlign:"center",color:baseT.sub,padding:"50px 20px"}}>
            <div style={{fontSize:32,marginBottom:8}}>{category.icon}</div>
            <div style={{fontSize:14}}>No items{hasFilters?" matching filters":""}.{hasFilters&&<span style={{display:"block",fontSize:12,marginTop:4,opacity:0.7}}>Try resetting filters.</span>}</div>
          </div>
        )}

        {/* Render with grouping — hidden while form is open */}
        {!showForm&&(()=>{
          function renderItem(item,idx){
            const isChecked=selected.has(item.id);
            const isHighlighted=highlightedItem===item.id;
            const toggle=()=>{
              setSelected(prev=>{
                const n=new Set(prev);
                n.has(item.id)?n.delete(item.id):n.add(item.id);
                return n;
              });
            };
            if(massSelectMode){
              return(
                <div key={item.id} onClick={toggle} style={{animation:`fadeUp 0.22s ease ${idx*0.05}s both`,display:"flex",alignItems:"center",gap:10,marginBottom:10,cursor:"pointer"}}>
                  <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${isChecked?accentColor:T.border}`,background:isChecked?accentColor:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s ease"}}>
                    {isChecked&&<span style={{color:baseT.accentText,fontSize:13,fontWeight:700,lineHeight:1}}>✓</span>}
                  </div>
                  <div style={{flex:1,opacity:isChecked?1:0.6,transition:"opacity 0.15s",pointerEvents:"none"}}>
                    <ItemCard item={item} T={T} onEdit={()=>{}} onDelete={()=>{}} onToggle={()=>{}}/>
                  </div>
                </div>
              );
            }
            return(
              <div key={item.id} ref={el=>itemRefs.current[item.id]=el}
                className="item-row"
                style={{borderRadius:14,
                  animation:`fadeUp 0.22s ease ${idx*0.05}s both`,
                  borderRadius:14,
                  boxShadow:isHighlighted?`0 0 0 2px ${accentColor}, 0 0 20px ${accentColor}55`:"none",
                  transition:"box-shadow 0.4s ease",
                }}>
                <SwipeRow onSwipeLeft={()=>openEdit(item)} accentColor={accentColor}>
                  <ItemCard item={item} T={T} onEdit={()=>openEdit(item)}
                    forceExpand={isHighlighted}
                    onDelete={()=>{if(!requireManager())return;setConfirmDelete({id:item.id,name:item.name});}}
                    onToggle={()=>{if(!requireManager())return;const newOos=!item.outOfStock;sb.from('items').update({out_of_stock:newOos}).eq('id',item.id);setItems(prev=>prev.map(i=>i.id===item.id?{...i,outOfStock:newOos}:i));}}/>
                </SwipeRow>
              </div>
            );
          }
          return packGroups ? packGroups.map(pack=>(
            <div key={pack} style={{animation:"fadeUp 0.25s ease both"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:accentColor,margin:"18px 0 8px",opacity:0.8}}>{pack}</div>
              {filtered.filter(i=>i.packSize===pack).map((item,idx)=>renderItem(item,idx))}
            </div>
          )) : wineGroups ? wineGroups.map(type=>(
            <div key={type} style={{animation:"fadeUp 0.25s ease both"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:accentColor,margin:"18px 0 8px",opacity:0.8}}>🍷 {type}</div>
              {filtered.filter(i=>i.wineType===type).map((item,idx)=>renderItem(item,idx))}
            </div>
          )) : !activeSub ? category.subcategories.map(sub=>{
            const subItems=filtered.filter(i=>i.subcategory===sub.key);
            if(!subItems.length)return null;
            return(
              <div key={sub.key}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:accentColor,margin:"18px 0 8px",opacity:0.8,display:"flex",alignItems:"center",gap:6}}>{sub.icon} {sub.name}</div>
                {subItems.map((item,idx)=>renderItem(item,idx))}
              </div>
            );
          }) : filtered.map((item,idx)=>renderItem(item,idx));
        })()}
      </div>
    </div>
  );
}

// ── BugsPage ──────────────────────────────────────────────────────────────────
function BugsPage({T,isManager,onRequireManager,managerDisabled=false}){
  const [knownBugs,setKnownBugs]=useState([]);
  const [reports,setReports]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({title:"",description:"",severity:"Medium"});
  const inp={width:"100%",background:T.inputBg||"#0f1117",border:`1px solid ${T.inputBorder||"#2a3050"}`,borderRadius:10,padding:"10px 12px",color:"#f0f0f0",fontSize:14,fontFamily:"inherit",boxSizing:"border-box"};
  useEffect(()=>{
    sb.from("known_bugs").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setKnownBugs(data);});
  },[]);
  return(
    <div style={{padding:"20px 14px",fontFamily:"'Georgia','Times New Roman',serif"}}>
      <div style={{fontSize:22,fontWeight:700,color:T.accent,marginBottom:4}}>🐛 Known Bugs</div>
      <div style={{fontSize:12,color:T.sub||T.subText,marginBottom:16}}>Issues the team is aware of</div>
      {knownBugs.length===0&&<div style={{textAlign:"center",padding:"24px",background:T.card||T.cardBg,borderRadius:12,border:`1px solid ${T.border||T.cardBorder}`,marginBottom:20}}><div style={{fontSize:28,marginBottom:6}}>✅</div><div style={{fontSize:14,fontWeight:600,color:"#f0f0f0",marginBottom:2}}>No known bugs!</div><div style={{fontSize:12,color:T.sub||T.subText}}>Found something? Report it below.</div></div>}
      {knownBugs.map(bug=><BugCard key={bug.id} bug={bug} T={{card:T.card||T.cardBg,border:T.border||T.cardBorder,text:"#f0f0f0",sub:T.sub||T.subText}} canDelete={false}/>)}
      <div style={{height:1,background:T.border||T.cardBorder,margin:"24px 0"}}/>
      <div style={{fontSize:22,fontWeight:700,color:T.accent,marginBottom:4}}>📝 Report a Bug</div>
      <div style={{fontSize:12,color:T.sub||T.subText,marginBottom:16}}>Requires manager PIN</div>
      {!showForm?(
        <button onClick={()=>{if(!isManager||managerDisabled){onRequireManager();return;}setShowForm(true);}} style={{width:"100%",padding:"13px",background:T.accent,border:"none",borderRadius:10,color:T.accentText,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Submit Bug Report</button>
      ):(
        <div style={{background:T.card||T.cardBg,border:`1px solid ${T.border||T.cardBorder}`,borderRadius:14,padding:18}}>
          <div style={{marginBottom:10}}><div style={{fontSize:11,color:T.sub||T.subText,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Title</div><input style={inp} value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Short description"/></div>
          <div style={{marginBottom:10}}><div style={{fontSize:11,color:T.sub||T.subText,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Description</div><textarea style={{...inp,minHeight:80,resize:"none",lineHeight:1.5}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="What happened?"/></div>
          <div style={{marginBottom:14}}><div style={{fontSize:11,color:T.sub||T.subText,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>Severity</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {SEVERITY_LEVELS.map(s=>{const c={Low:"#27ae60",Medium:"#f0c040",High:"#e67e22",Critical:"#e74c3c"}[s];return <button key={s} onClick={()=>setForm(f=>({...f,severity:s}))} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${form.severity===s?c:T.border||T.cardBorder}`,background:form.severity===s?`${c}22`:"transparent",color:form.severity===s?c:T.sub||T.subText,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:form.severity===s?700:400}}>{s}</button>;})}
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowForm(false)} style={{flex:1,padding:12,background:"transparent",border:`1px solid ${T.border||T.cardBorder}`,borderRadius:10,color:T.sub||T.subText,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            <button onClick={async()=>{if(!form.title||!form.description)return;await sb.from("bug_reports").insert({title:form.title,description:form.description,severity:form.severity,status:"Open",created_at:new Date().toLocaleDateString()});setForm({title:"",description:"",severity:"Medium"});setShowForm(false);alert("Bug report submitted!");}} style={{flex:2,padding:12,background:T.accent,border:"none",borderRadius:10,color:T.accentText,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Submit</button>
          </div>
        </div>
      )}
      {reports.length>0&&<><div style={{height:1,background:T.border||T.cardBorder,margin:"24px 0"}}/><div style={{fontSize:14,fontWeight:700,color:"#f0f0f0",marginBottom:12}}>Reports ({reports.length})</div>{reports.map(r=><BugCard key={r.id} bug={r} T={{card:T.card||T.cardBg,border:T.border||T.cardBorder,text:"#f0f0f0",sub:T.sub||T.subText}} canDelete={false}/>)}</>}
    </div>
  );
}

// ── DevPage ───────────────────────────────────────────────────────────────────
// ── Notification Banner ───────────────────────────────────────────────────────
const NOTIF_COLORS={
  blue:  {label:"Blue",   bg:"#0d2540",border:"#2a6aaa",text:"#7ab8f5",dot:"#4a9af0",   bubble:"#4a9af0"},
  green: {label:"Green",  bg:"#0a2a0a",border:"#1a6a1a",text:"#4aaa4a",dot:"#27ae60",   bubble:"#27ae60"},
  yellow:{label:"Yellow", bg:"#2a2200",border:"#6a5500",text:"#f0c040",dot:"#f0c040",   bubble:"#f0c040"},
  red:   {label:"Red",    bg:"#2a0a0a",border:"#6a1a1a",text:"#e07070",dot:"#e74c3c",   bubble:"#e74c3c"},
  purple:{label:"Purple", bg:"#1a0a2a",border:"#4a1a6a",text:"#b070f0",dot:"#9b59b6",   bubble:"#9b59b6"},
  orange:{label:"Orange", bg:"#2a1400",border:"#6a3000",text:"#e09040",dot:"#e67e22",   bubble:"#e67e22"},
  teal:  {label:"Teal",   bg:"#0a2424",border:"#1a6060",text:"#40c0c0",dot:"#00b4d8",   bubble:"#00b4d8"},
  pink:  {label:"Pink",   bg:"#2a0a1a",border:"#6a1a4a",text:"#f070b0",dot:"#e84393",   bubble:"#e84393"},
};

function NotifBanner({notif,onExpire}){
  const col=NOTIF_COLORS[notif.color]||NOTIF_COLORS.blue;
  const expiresAt=notif.expiresAt?new Date(notif.expiresAt):null;
  const calcLeft=()=>expiresAt?Math.max(0,Math.floor((expiresAt-new Date())/1000)):null;
  const [timeLeft,setTimeLeft]=useState(calcLeft);

  useEffect(()=>{
    if(!expiresAt)return;
    const iv=setInterval(()=>{
      const s=calcLeft();
      setTimeLeft(s);
      if(s<=0){onExpire&&onExpire();clearInterval(iv);}
    },1000);
    return()=>clearInterval(iv);
  },[]);

  function fmtTime(s){
    if(s===null||s===undefined)return"";
    if(s<=0)return"Expired";
    const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
    if(h>0)return`${h}h ${m}m remaining`;
    if(m>0)return`${m}m ${sec}s remaining`;
    return`${sec}s remaining`;
  }

  return(
    <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:col.bg,borderBottom:`2px solid ${col.border}`,zIndex:199,padding:"9px 16px",animation:"bannerSlide 0.35s cubic-bezier(0.34,1.1,0.64,1)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:col.dot,flexShrink:0,boxShadow:`0 0 8px ${col.dot}88`}}/>
        <span style={{fontSize:12,fontWeight:600,color:col.text,flex:1}}>{notif.message}</span>
        {timeLeft!==null&&<span style={{fontSize:10,color:col.text,opacity:0.65,flexShrink:0,fontFamily:"'Courier New',monospace"}}>{fmtTime(timeLeft)}</span>}
      </div>
    </div>
  );
}

function DevPage({isDev,onUnlock,auditLog=[],taxRate=DEFAULT_TAX_RATE,onTaxRateChange,managerDisabledProp=false,onManagerDisabledChange,storeHours=DEFAULT_HOURS,onStoreHoursChange,setItems,activeNotif,onNotifChange}){
  const [knownBugs,setKnownBugs]=useState([]);
  const [reports,setReports]=useState([]);
  const [managerDisabled,setManagerDisabled]=useState(managerDisabledProp);

  // Load known bugs, reports from Supabase
  useEffect(()=>{
    sb.from("known_bugs").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setKnownBugs(data);});
    sb.from("bug_reports").select("*").order("created_at",{ascending:false}).then(({data})=>{if(data)setReports(data);});
  },[]);

  // Sync managerDisabled from parent
  useEffect(()=>{setManagerDisabled(managerDisabledProp);},[managerDisabledProp]);

  async function toggleManagerDisabled(){
    const next=!managerDisabled;
    setManagerDisabled(next);
    await sb.from("app_settings").upsert({key:"manager_disabled",value:String(next)},{onConflict:"key"});
    onManagerDisabledChange&&onManagerDisabledChange(next);
  }
  const [showAddBug,setShowAddBug]=useState(false);
  const [bugForm,setBugForm]=useState({title:"",description:"",severity:"Medium",status:"Open"});
  const [taxRateInput,setTaxRateInput]=useState(String((taxRate*100).toFixed(2)));
  const [taxRateSaved,setTaxRateSaved]=useState(false);
  const [confirmDisable,setConfirmDisable]=useState(false);
  const [showNotifForm,setShowNotifForm]=useState(false);
  const [notifMsg,setNotifMsg]=useState("");
  const [notifColor,setNotifColor]=useState("blue");
  const [notifDuration,setNotifDuration]=useState("60"); // minutes, "" = permanent
  function handleTaxSave(){
    const val=parseFloat(taxRateInput);
    if(isNaN(val)||val<0||val>100)return;
    onTaxRateChange&&onTaxRateChange(val/100);
    setTaxRateSaved(true);
    setTimeout(()=>setTaxRateSaved(false),2000);
  }
  if(!isDev)return(
    <div style={{minHeight:"100vh",background:DT.appBg,fontFamily:"'Courier New',Courier,monospace",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,paddingBottom:80}}>
      <div style={{fontSize:11,color:DT.subText,letterSpacing:"0.15em",marginBottom:12}}>// AUTHENTICATION REQUIRED</div>
      <div style={{fontSize:28,fontWeight:700,color:DT.accent,marginBottom:8,letterSpacing:"0.05em"}}>ACCESS_DENIED</div>
      <div style={{fontSize:12,color:DT.subText,marginBottom:32,letterSpacing:"0.05em"}}>Enter developer credentials to proceed</div>
      <button onClick={onUnlock} style={{padding:"13px 32px",background:DT.accent,border:"none",borderRadius:6,color:DT.accentText,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.1em"}}>ENTER_PIN →</button>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",background:DT.appBg,fontFamily:"'Courier New',Courier,monospace",paddingBottom:80}}>
      <div style={{background:DT.headerBg,borderBottom:`1px solid ${DT.cardBorder}`,padding:"16px 16px 14px"}}>
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",marginBottom:3}}>// developer console</div>
        <div style={{fontSize:20,fontWeight:700,color:DT.accent,letterSpacing:"0.05em",marginBottom:8}}>DEV MODE</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <span style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:`${DT.green}15`,color:DT.green,border:`1px solid ${DT.green}30`,letterSpacing:"0.08em"}}>● SESSION ACTIVE</span>
          <span style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:`${DT.accent}15`,color:DT.accent,border:`1px solid ${DT.accent}30`,letterSpacing:"0.08em"}}>● FULL ACCESS</span>
          {managerDisabled&&<span style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:`${DT.red}15`,color:DT.red,border:`1px solid ${DT.red}30`,letterSpacing:"0.08em"}}>● MANAGERS LOCKED</span>}
        </div>
      </div>
      <div style={{padding:"20px 14px"}}>
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// security.managerPin</div>
        <div style={{background:DT.cardBg,border:`1px solid ${managerDisabled?"#ff446644":DT.cardBorder}`,borderRadius:10,padding:16,marginBottom:24,transition:"border-color 0.3s"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:DT.text}}>Manager PIN</div>
            <span style={{fontSize:10,padding:"3px 8px",background:managerDisabled?`${DT.red}15`:`${DT.green}15`,color:managerDisabled?DT.red:DT.green,border:`1px solid ${managerDisabled?DT.red+"44":DT.green+"44"}`,borderRadius:4,letterSpacing:"0.06em"}}>{managerDisabled?"DISABLED":"ACTIVE"}</span>
          </div>
          {managerDisabled&&<div style={{fontSize:11,color:DT.red,marginBottom:12,padding:"8px 10px",background:"#ff446610",border:"1px solid #ff446630",borderRadius:6,letterSpacing:"0.05em"}}>// WARNING: Manager permissions currently DISABLED</div>}

          {/* Confirm modal */}
          {confirmDisable&&(
            <div style={{background:"#1a0a0a",border:"1px solid #ff446644",borderRadius:8,padding:14,marginBottom:10,animation:"popIn 0.2s ease"}}>
              <div style={{fontSize:12,color:DT.red,fontWeight:700,marginBottom:6,letterSpacing:"0.06em"}}>// CONFIRM: DISABLE_MANAGERS?</div>
              <div style={{fontSize:11,color:DT.subText,marginBottom:10,lineHeight:1.5}}>
                This will immediately block all manager PIN logins. You can re-enable at any time from this page, or via the Supabase SQL editor:<br/>
                <span style={{color:DT.accent,fontFamily:"'Courier New',monospace",fontSize:10}}>update app_settings set value='false' where key='manager_disabled';</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setConfirmDisable(false)} style={{flex:1,padding:"8px",background:"transparent",border:`1px solid ${DT.cardBorder}`,borderRadius:6,color:DT.subText,fontSize:11,cursor:"pointer",fontFamily:"'Courier New',monospace"}}>CANCEL</button>
                <button onClick={async()=>{setConfirmDisable(false);await toggleManagerDisabled();}} style={{flex:2,padding:"8px",background:"#ff446618",border:"1px solid #ff446644",borderRadius:6,color:DT.red,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.06em"}}>⊘ CONFIRM_DISABLE →</button>
              </div>
            </div>
          )}

          <button onClick={()=>managerDisabled?toggleManagerDisabled():setConfirmDisable(true)}
            style={{width:"100%",padding:"10px",background:managerDisabled?`${DT.green}15`:"#ff446615",border:`1px solid ${managerDisabled?DT.green+"44":"#ff446644"}`,borderRadius:6,color:managerDisabled?DT.green:DT.red,fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em",marginBottom:10,transition:"all 0.3s"}}>
            {managerDisabled?"✓ ENABLE_MANAGERS →":"⊘ DISABLE_MANAGERS →"}
          </button>
          <button style={{width:"100%",padding:"10px",background:"transparent",border:`1px solid ${DT.accent}44`,borderRadius:6,color:DT.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.08em"}}>CHANGE_PIN →</button>
        </div>
        <div style={{height:1,background:DT.cardBorder,margin:"20px 0"}}/>
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// config.taxRate</div>
        <div style={{background:DT.cardBg,border:`1px solid ${DT.cardBorder}`,borderRadius:10,padding:16,marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:DT.text}}>Sales Tax Rate</div>
            <span style={{fontSize:16,fontWeight:700,color:DT.accent}}>{(taxRate*100).toFixed(2)}%</span>
          </div>
          <div style={{fontSize:11,color:DT.subText,marginBottom:10,letterSpacing:"0.04em"}}>// affects Cash Tools tax calculator</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input type="number" min="0" max="100" step="0.01" value={taxRateInput}
              onChange={e=>{setTaxRateInput(e.target.value);setTaxRateSaved(false);}}
              style={{flex:1,background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"9px 12px",color:DT.text,fontSize:14,fontFamily:"'Courier New',monospace",boxSizing:"border-box"}}/>
            <span style={{display:"flex",alignItems:"center",fontSize:14,color:DT.subText,paddingRight:4}}>%</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setTaxRateInput(String((DEFAULT_TAX_RATE*100).toFixed(2)));setTaxRateSaved(false);}}
              style={{flex:1,padding:"9px",background:"transparent",border:`1px solid ${DT.cardBorder}`,borderRadius:6,color:DT.subText,fontSize:11,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em"}}>
              RESET_DEFAULT →
            </button>
            <button onClick={handleTaxSave}
              style={{flex:2,padding:"9px",background:taxRateSaved?`${DT.green}20`:`${DT.accent}15`,border:`1px solid ${taxRateSaved?DT.green:DT.accent}44`,borderRadius:6,color:taxRateSaved?DT.green:DT.accent,fontSize:11,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em",transition:"all 0.2s"}}>
              {taxRateSaved?"✓ SAVED":"SAVE_RATE →"}
            </button>
          </div>
        </div>
        <div style={{height:1,background:DT.cardBorder,margin:"20px 0"}}/>
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// config.storeHours</div>
        <div style={{background:DT.cardBg,border:`1px solid ${DT.cardBorder}`,borderRadius:10,padding:16,marginBottom:24}}>
          <div style={{fontSize:11,color:DT.subText,marginBottom:10,letterSpacing:"0.04em"}}>// shown on the schedule page</div>
          {(storeHours||DEFAULT_HOURS).map((row,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
              <input value={row.days} onChange={e=>{const h=[...(storeHours||DEFAULT_HOURS)];h[i]={...h[i],days:e.target.value};onStoreHoursChange&&onStoreHoursChange(h);}}
                style={{flex:"0 0 90px",background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"7px 10px",color:DT.text,fontSize:12,fontFamily:"'Courier New',monospace"}}/>
              <input value={row.hours} onChange={e=>{const h=[...(storeHours||DEFAULT_HOURS)];h[i]={...h[i],hours:e.target.value};onStoreHoursChange&&onStoreHoursChange(h);}}
                style={{flex:1,background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"7px 10px",color:DT.text,fontSize:12,fontFamily:"'Courier New',monospace"}}/>
              <button onClick={()=>{const h=(storeHours||DEFAULT_HOURS).filter((_,j)=>j!==i);onStoreHoursChange&&onStoreHoursChange(h);}}
                style={{background:"none",border:`1px solid ${DT.cardBorder}`,borderRadius:6,width:28,height:28,color:DT.red,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          ))}
          <button onClick={()=>onStoreHoursChange&&onStoreHoursChange([...(storeHours||DEFAULT_HOURS),{days:"",hours:""}])}
            style={{width:"100%",padding:"8px",background:"transparent",border:`1px solid ${DT.accent}44`,borderRadius:6,color:DT.accent,fontSize:11,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.06em",marginTop:4}}>
            + ADD_ROW →
          </button>
        </div>
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// bugs.known [{knownBugs.length}]</div>
        <button onClick={()=>setShowAddBug(v=>!v)} style={{width:"100%",padding:"10px",background:"transparent",border:`1px solid ${DT.accent}44`,borderRadius:6,color:DT.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.08em",marginBottom:12}}>{showAddBug?"✕ CANCEL":"+ ADD_KNOWN_BUG →"}</button>
        {showAddBug&&(
          <div style={{background:DT.cardBg,border:`1px solid ${DT.cardBorder}`,borderRadius:10,padding:16,marginBottom:14}}>
            <input style={{width:"100%",background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"9px 12px",color:DT.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",marginBottom:8}} placeholder="Bug title" value={bugForm.title} onChange={e=>setBugForm(f=>({...f,title:e.target.value}))}/>
            <textarea style={{width:"100%",background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"9px 12px",color:DT.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",minHeight:70,resize:"none",lineHeight:1.5,marginBottom:10}} placeholder="Description" value={bugForm.description} onChange={e=>setBugForm(f=>({...f,description:e.target.value}))}/>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {SEVERITY_LEVELS.map(s=>{const c={Low:"#00ff88",Medium:"#f0c040",High:"#e67e22",Critical:"#ff4466"}[s];return <button key={s} onClick={()=>setBugForm(f=>({...f,severity:s}))} style={{padding:"5px 10px",borderRadius:4,border:`1px solid ${bugForm.severity===s?c:DT.cardBorder}`,background:bugForm.severity===s?`${c}20`:"transparent",color:bugForm.severity===s?c:DT.subText,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{s.toUpperCase()}</button>;})}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowAddBug(false)} style={{flex:1,padding:"8px",background:"transparent",border:`1px solid ${DT.cardBorder}`,borderRadius:6,color:DT.subText,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>CANCEL</button>
              <button onClick={async()=>{if(!bugForm.title||!bugForm.description)return;const{data}=await sb.from("known_bugs").insert({title:bugForm.title,description:bugForm.description,severity:bugForm.severity,status:bugForm.status,created_at:new Date().toLocaleDateString()}).select().single();if(data)setKnownBugs(prev=>[data,...prev]);setBugForm({title:"",description:"",severity:"Medium",status:"Open"});setShowAddBug(false);}} style={{flex:2,padding:"8px",background:DT.accent,border:"none",borderRadius:6,color:DT.accentText,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.06em"}}>PUSH_BUG →</button>
            </div>
          </div>
        )}
        {knownBugs.length===0&&<div style={{fontSize:12,color:DT.subText,padding:"8px 0 20px",letterSpacing:"0.08em"}}>// array empty</div>}
        {knownBugs.map(bug=><BugCard key={bug.id} bug={bug} T={{card:DT.cardBg,border:DT.cardBorder,text:DT.text,sub:DT.subText}} canDelete onDelete={async()=>{await sb.from("known_bugs").delete().eq("id",bug.id);setKnownBugs(prev=>prev.filter(b=>b.id!==bug.id));}}/>)}

        <div style={{height:1,background:DT.cardBorder,margin:"20px 0"}}/>
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// bugs.reports [{reports.length}]</div>
        {reports.length===0&&<div style={{fontSize:12,color:DT.subText,padding:"8px 0 20px",letterSpacing:"0.08em"}}>// array empty</div>}
        {reports.map(r=><BugCard key={r.id} bug={r} T={{card:DT.cardBg,border:DT.cardBorder,text:DT.text,sub:DT.subText}} canDelete onDelete={async()=>{await sb.from("bug_reports").delete().eq("id",r.id);setReports(prev=>prev.filter(b=>b.id!==r.id));}}/>)}

        <div style={{height:1,background:DT.cardBorder,margin:"20px 0"}}/>

        {/* Audit log */}
        <div style={{height:1,background:DT.cardBorder,margin:"20px 0"}}/>

        {/* ── Notifications ── */}
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// system.notification</div>

        {/* Active notification */}
        {activeNotif?(
          <div style={{background:DT.cardBg,border:`2px solid ${NOTIF_COLORS[activeNotif.color]?.border||DT.cardBorder}`,borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:NOTIF_COLORS[activeNotif.color]?.dot||DT.accent,boxShadow:`0 0 6px ${NOTIF_COLORS[activeNotif.color]?.dot||DT.accent}`}}/>
              <span style={{fontSize:12,fontWeight:600,color:NOTIF_COLORS[activeNotif.color]?.text||DT.text,flex:1}}>{activeNotif.message}</span>
            </div>
            <div style={{fontSize:10,color:DT.subText,marginBottom:10,letterSpacing:"0.04em"}}>
              {activeNotif.expiresAt?`// expires: ${new Date(activeNotif.expiresAt).toLocaleTimeString()}`:"// permanent — no expiry set"}
            </div>
            <button onClick={()=>{onNotifChange&&onNotifChange(null);saveActiveNotif(null);}}
              style={{width:"100%",padding:"8px",background:"#ff446615",border:"1px solid #ff446644",borderRadius:6,color:DT.red,fontSize:11,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.06em"}}>
              ⊘ DISMISS_NOTIFICATION →
            </button>
          </div>
        ):(
          <div style={{fontSize:12,color:DT.subText,padding:"6px 0 10px",letterSpacing:"0.06em"}}>// no active notification</div>
        )}

        {/* New notification form */}
        <button onClick={()=>setShowNotifForm(v=>!v)}
          style={{width:"100%",padding:"9px",background:"transparent",border:`1px solid ${DT.accent}44`,borderRadius:6,color:DT.accent,fontSize:11,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.08em",marginBottom:showNotifForm?10:20}}>
          {showNotifForm?"✕ CANCEL":"+ NEW_NOTIFICATION →"}
        </button>

        {showNotifForm&&(
          <div style={{background:DT.cardBg,border:`1px solid ${DT.cardBorder}`,borderRadius:10,padding:16,marginBottom:20,animation:"slideDown 0.2s ease"}}>
            {/* Message */}
            <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.1em",marginBottom:5}}>// message</div>
            <input value={notifMsg} onChange={e=>setNotifMsg(e.target.value)}
              placeholder="e.g. Inventory check in progress..."
              style={{width:"100%",background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"9px 12px",color:DT.text,fontSize:13,fontFamily:"'Courier New',monospace",boxSizing:"border-box",marginBottom:12}}/>

            {/* Color picker */}
            <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.1em",marginBottom:8}}>// color</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {Object.entries(NOTIF_COLORS).map(([key,col])=>(
                <button key={key} onClick={()=>setNotifColor(key)}
                  title={col.label}
                  style={{width:26,height:26,borderRadius:"50%",background:col.bubble,border:`2px solid ${notifColor===key?"#fff":"transparent"}`,cursor:"pointer",boxShadow:notifColor===key?`0 0 8px ${col.bubble}88`:"none",transition:"all 0.15s",transform:notifColor===key?"scale(1.2)":"scale(1)"}}/>
              ))}
            </div>

            {/* Duration */}
            <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.1em",marginBottom:5}}>// duration (minutes — leave blank for permanent)</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
              {[{label:"15m",val:"15"},{label:"30m",val:"30"},{label:"1h",val:"60"},{label:"2h",val:"120"},{label:"4h",val:"240"},{label:"∞",val:""}].map(opt=>(
                <button key={opt.val} onClick={()=>setNotifDuration(opt.val)}
                  style={{padding:"5px 10px",borderRadius:6,border:`1px solid ${notifDuration===opt.val?DT.accent:DT.cardBorder}`,background:notifDuration===opt.val?`${DT.accent}20`:"transparent",color:notifDuration===opt.val?DT.accent:DT.subText,fontSize:11,cursor:"pointer",fontFamily:"'Courier New',monospace",transition:"all 0.15s"}}>
                  {opt.label}
                </button>
              ))}
              <input value={notifDuration} onChange={e=>setNotifDuration(e.target.value)}
                placeholder="custom"
                style={{width:60,background:DT.inputBg,border:`1px solid ${DT.inputBorder}`,borderRadius:6,padding:"5px 8px",color:DT.text,fontSize:11,fontFamily:"'Courier New',monospace",textAlign:"center"}}/>
              <span style={{display:"flex",alignItems:"center",fontSize:11,color:DT.subText}}>min</span>
            </div>

            {/* Preview */}
            {notifMsg.trim()&&(
              <div style={{background:NOTIF_COLORS[notifColor]?.bg||"#0d2540",border:`1px solid ${NOTIF_COLORS[notifColor]?.border||DT.cardBorder}`,borderRadius:8,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:NOTIF_COLORS[notifColor]?.dot||DT.accent,flexShrink:0}}/>
                <span style={{fontSize:12,color:NOTIF_COLORS[notifColor]?.text||DT.text,flex:1}}>{notifMsg}</span>
                {notifDuration&&<span style={{fontSize:10,color:NOTIF_COLORS[notifColor]?.text||DT.text,opacity:0.6,fontFamily:"'Courier New',monospace"}}>{notifDuration}m</span>}
              </div>
            )}

            <button onClick={()=>{
              if(!notifMsg.trim())return;
              const mins=notifDuration?parseInt(notifDuration):null;
              const expiresAt=mins?new Date(Date.now()+mins*60*1000).toISOString():null;
              const n={message:notifMsg.trim(),color:notifColor,expiresAt};
              onNotifChange&&onNotifChange(n);
              saveActiveNotif(n);
              setNotifMsg("");setShowNotifForm(false);
            }} style={{width:"100%",padding:"9px",background:`${DT.accent}20`,border:`1px solid ${DT.accent}44`,borderRadius:6,color:DT.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.08em"}}>
              BROADCAST_NOTIFICATION →
            </button>
          </div>
        )}

        <div style={{height:1,background:DT.cardBorder,margin:"0 0 20px"}}/>

        {/* Audit log */}
        <div style={{fontSize:10,color:DT.subText,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>// audit.log [last {auditLog.length}/10]</div>
        {auditLog.length===0?(
          <div style={{fontSize:12,color:DT.subText,padding:"8px 0",letterSpacing:"0.08em"}}>// array empty — no edits recorded this session</div>
        ):(
          auditLog.map((entry,i)=>{
            const actionColor=entry.action==="added"?DT.green:entry.action==="deleted"?DT.red:"#f0c040";
            const t=entry.timestamp instanceof Date?entry.timestamp:new Date(entry.timestamp);
            const timeStr=t?`${t.getHours().toString().padStart(2,"0")}:${t.getMinutes().toString().padStart(2,"0")}:${t.getSeconds().toString().padStart(2,"0")}`:"--:--:--";
            const canUndo=entry.action==="edited"&&entry.snapshot;
            return(
              <div key={entry.id} style={{background:DT.cardBg,border:`1px solid ${DT.cardBorder}`,borderRadius:8,padding:"12px 14px",marginBottom:8,borderLeft:`3px solid ${actionColor}`}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:actionColor,letterSpacing:"0.08em",textTransform:"uppercase"}}>{entry.action==="added"?"+ ADDED":entry.action==="deleted"?"✕ DELETED":"~ EDITED"}</span>
                    {entry.role&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:3,background:`${DT.accent}15`,color:DT.subText,border:`1px solid ${DT.cardBorder}`}}>{entry.role}</span>}
                  </div>
                  <span style={{fontSize:10,color:DT.subText,fontFamily:"'Courier New',monospace"}}>{timeStr}</span>
                </div>
                <div style={{fontSize:13,color:DT.text,fontWeight:600,marginBottom:3}}>{entry.itemName}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${DT.accent}15`,color:DT.accent,border:`1px solid ${DT.accent}30`}}>{entry.category}</span>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${DT.accent}10`,color:DT.subText,border:`1px solid ${DT.cardBorder}`}}>{entry.subcategory}</span>
                  {entry.details&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:`${DT.accent}10`,color:DT.subText,border:`1px solid ${DT.cardBorder}`}}>{entry.details}</span>}
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,background:"#f0c04015",color:"#f0c040",border:"1px solid #f0c04030"}}>${entry.price?.toFixed(2)}</span>
                </div>
                {canUndo&&(
                  <button onClick={async()=>{
                    const s=entry.snapshot;
                    const row={name:s.name,category:s.category,subcategory:s.subcategory,price:s.price,location:s.location||"",notes:s.notes||"",inventory:s.inventory??null,out_of_stock:s.outOfStock||false,map_zone:s.mapZone||null,expiry_date:s.expiryDate||null,pack_size:s.packSize||null,container_type:s.containerType||null,deposit:s.deposit??null,wine_type:s.wineType||null,gillies_recommendation:s.gilliesRecommendation||false};
                    const {error}=await sb.from("items").update(row).eq("id",s.id);
                    if(!error){setItems&&setItems(prev=>prev.map(i=>i.id===s.id?{...i,...s}:i));}
                  }} style={{marginTop:6,width:"100%",padding:"5px 10px",background:"#f0c04015",border:"1px solid #f0c04040",borderRadius:5,color:"#f0c040",fontSize:10,cursor:"pointer",fontFamily:"'Courier New',monospace",letterSpacing:"0.06em",textAlign:"center"}}>
                    ↩ UNDO EDIT
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── SchedulePage ──────────────────────────────────────────────────────────────
const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const HOURLY_RATE=15;

// ── Schedule shifts via Supabase ──────────────────────────────────────────────
// Persist month in sessionStorage so it remembers last viewed (UI state only)
function loadMonth(){try{const s=sessionStorage.getItem("sched-month");return s?JSON.parse(s):null;}catch{return null;}}
function saveMonth(m){try{sessionStorage.setItem("sched-month",JSON.stringify(m));}catch{}}

async function fetchShifts(){
  const {data,error}=await sb.from("schedule_shifts").select("*");
  if(error||!data)return{};
  // Convert array to {month-day: [...shifts]} map
  const map={};
  data.forEach(row=>{
    const key=row.day_key;
    if(!map[key])map[key]=[];
    map[key].push({id:row.id,name:row.name,startTime:row.start_time,endTime:row.end_time,notes:row.notes||""});
  });
  return map;
}

async function saveShiftToSupabase(dayKey,shift){
  const {data,error}=await sb.from("schedule_shifts").insert({
    day_key:dayKey,name:shift.name,start_time:shift.startTime,end_time:shift.endTime,notes:shift.notes||""
  }).select().single();
  if(error)throw error;
  return data.id;
}

async function updateShiftInSupabase(id,shift){
  await sb.from("schedule_shifts").update({
    name:shift.name,start_time:shift.startTime,end_time:shift.endTime,notes:shift.notes||""
  }).eq("id",id);
}

async function deleteShiftFromSupabase(id){
  await sb.from("schedule_shifts").delete().eq("id",id);
}

function parseHours(startTime,endTime){
  if(!startTime||!endTime)return 0;
  const [sh,sm]=startTime.split(":").map(Number);
  const [eh,em]=endTime.split(":").map(Number);
  const diff=(eh*60+em)-(sh*60+sm);
  return Math.max(0,diff/60);
}
function fmt12(t){
  if(!t)return"";
  const [h,m]=t.split(":").map(Number);
  const ampm=h>=12?"PM":"AM";
  const h12=h%12||12;
  return `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
}

function SchedulePage({isManager,isDark,onUnlock,storeHours=DEFAULT_HOURS}){
  const now=new Date();
  const currentYear=now.getFullYear();
  const saved=loadMonth();
  const [month,setMonth]=useState(saved?saved.month:now.getMonth());
  const [shifts,setShifts]=useState({});
  const [shiftsLoading,setShiftsLoading]=useState(true);
  const [focusDay,setFocusDay]=useState(null);
  const [showShiftForm,setShowShiftForm]=useState(false);
  const [editShift,setEditShift]=useState(null);
  const [shiftForm,setShiftForm]=useState({name:"",startTime:"09:00",endTime:"17:00",notes:""});

  const bg=isDark?"#080b12":"#f0f0e8";
  const card=isDark?"#0f1525":"#ffffff";
  const border=isDark?"#1e2a40":"#d0d0c0";
  const text=isDark?"#f0f0f0":"#1a1a1a";
  const sub=isDark?"#3a4a60":"#909080";
  const accent="#7c83fd";
  const inp={background:isDark?"#0a0f1e":"#f8f8f0",border:`1px solid ${border}`,borderRadius:8,padding:"9px 12px",color:text,fontSize:14,fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  useEffect(()=>{saveMonth({month});},[month]);

  // Load shifts from Supabase on mount
  useEffect(()=>{
    fetchShifts().then(data=>{setShifts(data);setShiftsLoading(false);}).catch(()=>setShiftsLoading(false));
  },[]);

  const firstDay=new Date(currentYear,month,1).getDay();
  const daysInMonth=new Date(currentYear,month+1,0).getDate();
  const cells=[];
  for(let i=0;i<firstDay;i++)cells.push(null);
  for(let d=1;d<=daysInMonth;d++)cells.push(d);

  function dayKey(d){return `${month}-${d}`;}
  function dayShifts(d){return shifts[dayKey(d)]||[];}

  async function addOrUpdateShift(){
    if(!shiftForm.name.trim())return;
    const key=dayKey(focusDay);
    const arr=[...(shifts[key]||[])];
    if(editShift!==null){
      // Update existing
      const existing=arr[editShift];
      await updateShiftInSupabase(existing.id,shiftForm);
      arr[editShift]={...existing,...shiftForm};
    } else {
      // Insert new
      const newId=await saveShiftToSupabase(key,shiftForm);
      arr.push({...shiftForm,id:newId});
    }
    setShifts(prev=>({...prev,[key]:arr}));
    setShiftForm({name:"",startTime:"09:00",endTime:"17:00",notes:""});
    setShowShiftForm(false);setEditShift(null);
  }

  async function deleteShift(day,idx){
    const key=dayKey(day);
    const arr=[...(shifts[key]||[])];
    const shift=arr[idx];
    if(shift?.id)await deleteShiftFromSupabase(shift.id);
    arr.splice(idx,1);
    setShifts(prev=>({...prev,[key]:arr}));
  }

  // Monthly earnings per person
  const earnings={};
  Object.entries(shifts).forEach(([k,arr])=>{
    if(!k.startsWith(`${month}-`))return;
    arr.forEach(s=>{
      const name=s.name.trim();
      if(!name)return;
      const hrs=parseHours(s.startTime,s.endTime);
      earnings[name]=(earnings[name]||0)+hrs;
    });
  });

  function nameColor(name,lightness){
    const hue=(name.split("").reduce((a,c)=>a+c.charCodeAt(0),0)*47)%360;
    return `hsl(${hue},55%,${lightness}%)`;
  }

  if(!isManager) return(
    <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,paddingBottom:80}}>
      <div style={{fontSize:40,marginBottom:12}}>📅</div>
      <div style={{fontSize:18,fontWeight:700,color:text,marginBottom:8}}>Manager Access Required</div>
      <div style={{fontSize:13,color:sub,marginBottom:28,textAlign:"center"}}>Sign in to view the work schedule.</div>
      <button onClick={onUnlock} className="tap-btn" style={{padding:"12px 28px",background:accent,border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Sign In</button>
    </div>
  );

  // ── Day detail view ────────────────────────────────────────────────────────
  if(focusDay!==null){
    const daySh=dayShifts(focusDay);
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80}}>
        <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"16px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{setFocusDay(null);setShowShiftForm(false);setEditShift(null);}} style={{background:isDark?"#1a1f2e":"#e0e0d0",border:`1px solid ${border}`,borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:text,fontFamily:"inherit",flexShrink:0}}>←</button>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:700,color:accent}}>{MONTH_NAMES[month]} {focusDay}</div>
              <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.05em"}}>{daySh.length} shift{daySh.length!==1?"s":""}</div>
            </div>
            <button onClick={()=>{setEditShift(null);setShiftForm({name:"",startTime:"09:00",endTime:"17:00",notes:""});setShowShiftForm(v=>!v);}} className="tap-btn"
              style={{padding:"8px 14px",background:showShiftForm?"transparent":accent,border:`1px solid ${showShiftForm?border:accent}`,borderRadius:20,cursor:"pointer",fontFamily:"inherit",color:showShiftForm?sub:"#fff",fontSize:12,fontWeight:700,transition:"all 0.2s"}}>
              {showShiftForm?"✕ Cancel":"+ Add Shift"}
            </button>
          </div>
        </div>
        <div style={{padding:"14px"}}>
          {showShiftForm&&(
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:14,animation:"slideDown 0.22s cubic-bezier(0.34,1.1,0.64,1)"}}>
              <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Name</div>
              <input value={shiftForm.name} onChange={e=>setShiftForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Alex" style={{...inp,marginBottom:10}}/>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Start</div>
                  <input type="time" value={shiftForm.startTime} onChange={e=>setShiftForm(f=>({...f,startTime:e.target.value}))} style={inp}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>End</div>
                  <input type="time" value={shiftForm.endTime} onChange={e=>setShiftForm(f=>({...f,endTime:e.target.value}))} style={inp}/>
                </div>
              </div>
              {(()=>{
                const hrs=parseHours(shiftForm.startTime,shiftForm.endTime);
                return hrs>0?(
                  <div style={{background:isDark?"#0a1a0a":"#f0faf0",border:`1px solid ${isDark?"#1a3a1a":"#b0d0b0"}`,borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:12,color:isDark?"#4aaa4a":"#2a7a2a"}}>{hrs.toFixed(1)}h @ $15/hr</span>
                    <span style={{fontSize:14,fontWeight:700,color:isDark?"#4aaa4a":"#2a7a2a"}}>${(hrs*HOURLY_RATE).toFixed(2)} before tax</span>
                  </div>
                ):null;
              })()}
              <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Notes <span style={{opacity:0.5,fontWeight:400,textTransform:"none",letterSpacing:0}}>— optional</span></div>
              <textarea value={shiftForm.notes} onChange={e=>setShiftForm(f=>({...f,notes:e.target.value}))} placeholder="Any notes…" style={{...inp,minHeight:54,resize:"none",lineHeight:1.5,marginBottom:12}}/>
              <button onClick={addOrUpdateShift} style={{width:"100%",padding:11,background:accent,border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                {editShift!==null?"Save Changes":"Add Shift"}
              </button>
            </div>
          )}
          {daySh.length===0&&!showShiftForm&&(
            <div style={{textAlign:"center",color:sub,padding:"50px 20px"}}>
              <div style={{fontSize:32,marginBottom:8}}>📋</div>
              <div style={{fontSize:14}}>No shifts scheduled. Tap + Add Shift.</div>
            </div>
          )}
          {daySh.map((s,idx)=>{
            const hrs=parseHours(s.startTime,s.endTime);
            return(
              <div key={s.id||idx} style={{background:card,border:`1px solid ${border}`,borderRadius:12,padding:14,marginBottom:10,animation:`fadeUp 0.22s ease ${idx*0.05}s both`,transition:"box-shadow 0.15s ease",cursor:"default"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:s.notes?6:0}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:nameColor(s.name,isDark?30:70),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:13,fontWeight:700,color:nameColor(s.name,isDark?80:20)}}>{s.name.trim()[0]?.toUpperCase()||"?"}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:600,color:text}}>{s.name}</div>
                    <div style={{fontSize:12,color:sub}}>{fmt12(s.startTime)} – {fmt12(s.endTime)} · {hrs.toFixed(1)}h</div>
                  </div>
                  <div style={{textAlign:"right",marginRight:4}}>
                    <div style={{fontSize:14,fontWeight:700,color:isDark?"#4aaa4a":"#2a7a2a"}}>${(hrs*HOURLY_RATE).toFixed(2)}</div>
                    <div style={{fontSize:10,color:sub}}>before tax</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    <button onClick={()=>{setEditShift(idx);setShiftForm({name:s.name,startTime:s.startTime,endTime:s.endTime,notes:s.notes||""});setShowShiftForm(true);}} style={{background:"none",border:"none",color:sub,fontSize:14,cursor:"pointer",padding:2}}>✏️</button>
                    <button onClick={()=>deleteShift(focusDay,idx)} style={{background:"none",border:"none",color:"#e07070",fontSize:14,cursor:"pointer",padding:2}}>🗑️</button>
                  </div>
                </div>
                {s.notes&&<div style={{fontSize:12,color:sub,padding:"6px 10px",background:isDark?"#0a0a18":"#f4f4f0",borderRadius:7,lineHeight:1.4}}>📝 {s.notes}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Month calendar view ────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80}}>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .cal-day{transition:transform 0.1s ease,box-shadow 0.15s ease;}
        .cal-day:active{transform:scale(0.95);}
        .cal-day:hover{box-shadow:0 4px 16px rgba(0,0,0,0.2);}
      `}</style>
      <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"20px 14px 14px"}}>
        <div style={{fontSize:10,color:sub,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>Gil's Grocery</div>
        <div style={{fontSize:18,fontWeight:700,color:accent,marginBottom:10}}>Work Schedule</div>

        {/* Store hours */}
        <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2}}>
          {(storeHours||DEFAULT_HOURS).map(({days,hours},i)=>{
            const colors=["#7c83fd",isDark?"#4aaa4a":"#2a7a2a","#e67e22"];
            return(
              <div key={i} style={{flexShrink:0,background:isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)",border:`1px solid ${isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.08)"}`,borderRadius:10,padding:"7px 10px"}}>
                <div style={{fontSize:9,fontWeight:700,color:colors[i%3],textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>{days}</div>
                <div style={{fontSize:11,fontWeight:600,color:text,whiteSpace:"nowrap"}}>{hours}</div>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setMonth(m=>(m+11)%12)} style={{background:isDark?"#1a1f2e":"#e0e0d0",border:`1px solid ${border}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:text,fontSize:16,fontFamily:"inherit",flexShrink:0}}>‹</button>
          <div style={{flex:1,display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2}}>
            {MONTH_NAMES.map((m,i)=>(
              <button key={i} onClick={()=>setMonth(i)} style={{flexShrink:0,padding:"5px 10px",borderRadius:20,border:`1px solid ${i===month?accent:border}`,background:i===month?accent:"transparent",color:i===month?"#fff":sub,fontSize:11,fontWeight:i===month?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",whiteSpace:"nowrap"}}>
                {m.slice(0,3)}
              </button>
            ))}
          </div>
          <button onClick={()=>setMonth(m=>(m+1)%12)} style={{background:isDark?"#1a1f2e":"#e0e0d0",border:`1px solid ${border}`,borderRadius:8,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:text,fontSize:16,fontFamily:"inherit",flexShrink:0}}>›</button>
        </div>
      </div>
      <div style={{padding:"12px 10px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:2,marginBottom:4}}>
          {DAY_NAMES.map(d=>(
            <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:sub,letterSpacing:"0.04em",padding:"4px 0",textTransform:"uppercase"}}>{d}</div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7, 1fr)",gap:3,animation:"fadeIn 0.3s ease"}}>
          {cells.map((day,i)=>{
            if(!day) return <div key={`e${i}`}/>;
            const sh=dayShifts(day);
            const names=[...new Set(sh.map(s=>s.name.trim()).filter(Boolean))];
            const isToday=now.getFullYear()===currentYear&&month===now.getMonth()&&day===now.getDate();
            return(
              <div key={day} className="cal-day tap-btn" onClick={()=>setFocusDay(day)}
                style={{background:card,border:`1px solid ${isToday?accent:border}`,borderRadius:10,padding:"5px 3px",minHeight:62,cursor:"pointer",position:"relative",boxShadow:isToday?`0 0 0 1.5px ${accent}44`:"none"}}>
                <div style={{fontSize:12,fontWeight:isToday?700:400,color:isToday?accent:text,marginBottom:3,textAlign:"center",lineHeight:1}}>{day}</div>
                <div style={{display:"flex",flexDirection:"column",gap:2}}>
                  {names.slice(0,3).map((name,ni)=>(
                    <div key={ni} style={{fontSize:9,fontWeight:600,borderRadius:3,padding:"1px 4px",background:nameColor(name,isDark?25:80),color:nameColor(name,isDark?75:20),whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{name}</div>
                  ))}
                  {names.length>3&&<div style={{fontSize:8,color:sub,textAlign:"center"}}>+{names.length-3}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Earnings summary — weekly + monthly */}
        {Object.keys(earnings).length>0&&(()=>{
          const SS_RATE=0.062, MED_RATE=0.0145;
          // Weekly: hrs in the selected week (days in current month / 7 approx) — we show per-week avg
          // Actually compute: weekly = monthly hrs / (daysInMonth/7)
          const weeksInMonth=daysInMonth/7;
          return(
            <div style={{marginTop:18,background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,animation:"fadeUp 0.3s ease"}}>
              <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,fontWeight:700}}>{MONTH_NAMES[month]} Pay Summary</div>
              {Object.entries(earnings).map(([name,monthHrs])=>{
                const weekHrs=monthHrs/weeksInMonth;
                const grossWeek=weekHrs*HOURLY_RATE;
                const grossMonth=monthHrs*HOURLY_RATE;
                const ssWeek=grossWeek*SS_RATE;
                const medWeek=grossWeek*MED_RATE;
                const netWeek=grossWeek-ssWeek-medWeek;
                const ssMonth=grossMonth*SS_RATE;
                const medMonth=grossMonth*MED_RATE;
                const netMonth=grossMonth-ssMonth-medMonth;
                return(
                  <div key={name} style={{marginBottom:14,background:isDark?"#0a0f1e":"#f8f8f0",border:`1px solid ${border}`,borderRadius:12,padding:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:nameColor(name,isDark?30:70),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <span style={{fontSize:11,fontWeight:700,color:nameColor(name,isDark?80:20)}}>{name[0]?.toUpperCase()}</span>
                      </div>
                      <div style={{fontSize:13,fontWeight:700,color:text}}>{name}</div>
                      <div style={{marginLeft:"auto",fontSize:11,color:sub}}>{monthHrs.toFixed(1)} hrs/mo · {weekHrs.toFixed(1)} hrs/wk avg</div>
                    </div>
                    {/* Weekly */}
                    <div style={{marginBottom:6}}>
                      <div style={{fontSize:10,color:sub,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Weekly (avg)</div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:2}}>
                        <span style={{color:sub}}>Gross</span><span style={{color:text,fontWeight:600}}>${grossWeek.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                        <span style={{color:sub}}>SS (6.2%)</span><span style={{color:"#e07070"}}>−${ssWeek.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                        <span style={{color:sub}}>Medicare (1.45%)</span><span style={{color:"#e07070"}}>−${medWeek.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,paddingTop:4,borderTop:`1px solid ${border}`}}>
                        <span style={{color:sub}}>Take-home</span><span style={{color:isDark?"#4aaa4a":"#2a7a2a"}}>${netWeek.toFixed(2)}</span>
                      </div>
                    </div>
                    {/* Monthly */}
                    <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${border}`}}>
                      <div style={{fontSize:10,color:sub,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Monthly</div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:2}}>
                        <span style={{color:sub}}>Gross</span><span style={{color:text,fontWeight:600}}>${grossMonth.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                        <span style={{color:sub}}>SS (6.2%)</span><span style={{color:"#e07070"}}>−${ssMonth.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                        <span style={{color:sub}}>Medicare (1.45%)</span><span style={{color:"#e07070"}}>−${medMonth.toFixed(2)}</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,fontWeight:700,paddingTop:4,borderTop:`1px solid ${border}`}}>
                        <span style={{color:sub}}>Take-home</span><span style={{color:isDark?"#4aaa4a":"#2a7a2a"}}>${netMonth.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{height:1,background:border,margin:"4px 0 10px"}}/>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:sub}}>Total gross payroll</span>
                <span style={{fontSize:14,fontWeight:700,color:isDark?"#4aaa4a":"#2a7a2a"}}>${(Object.values(earnings).reduce((a,h)=>a+h,0)*HOURLY_RATE).toFixed(2)}</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
// ── CashPage ──────────────────────────────────────────────────────────────────
const DEFAULT_TAX_RATE=0.0323;
async function fetchTaxRate(){
  const {data}=await sb.from("app_settings").select("value").eq("key","tax_rate").single();
  return data?parseFloat(data.value):DEFAULT_TAX_RATE;
}
async function saveTaxRate(r){
  await sb.from("app_settings").upsert({key:"tax_rate",value:String(r)},{onConflict:"key"});
}

async function fetchStoreHours(){
  try{
    const {data}=await sb.from("app_settings").select("value").eq("key","store_hours").single();
    if(!data||!data.value||data.value==="null")return DEFAULT_HOURS;
    const parsed=JSON.parse(data.value);
    return Array.isArray(parsed)&&parsed.length>0?parsed:DEFAULT_HOURS;
  }catch{return DEFAULT_HOURS;}
}
async function saveStoreHours(h){
  await sb.from("app_settings").upsert({key:"store_hours",value:JSON.stringify(h)},{onConflict:"key"});
}

async function fetchActiveNotif(){
  const {data}=await sb.from("app_settings").select("value").eq("key","active_notif").single();
  if(!data||!data.value||data.value==="null")return null;
  try{return JSON.parse(data.value);}catch{return null;}
}
async function saveActiveNotif(n){
  await sb.from("app_settings").upsert({key:"active_notif",value:JSON.stringify(n)},{onConflict:"key"});
}
const DENOMINATIONS=[
  {label:"Pennies",     value:0.01},
  {label:"Nickels",     value:0.05},
  {label:"Dimes",       value:0.10},
  {label:"Quarters",    value:0.25},
  {label:"Half Dollars",value:0.50},
  {label:"$1 Coins",   value:1.00},
  {label:"$1 Bills",   value:1.00},
  {label:"$2 Bills",   value:2.00},
  {label:"$5 Bills",   value:5.00},
  {label:"$10 Bills",  value:10.00},
  {label:"$20 Bills",  value:20.00},
  {label:"$50 Bills",  value:50.00},
  {label:"$100 Bills", value:100.00},
];

function CashPage({isDark,taxRate=DEFAULT_TAX_RATE}){
  const [tab,setTab]=useState("calc");
  const [display,setDisplay]=useState("0");
  const [prev,setPrev]=useState(null);
  const [op,setOp]=useState(null);
  const [fresh,setFresh]=useState(true);
  const [counts,setCounts]=useState(Object.fromEntries(DENOMINATIONS.map((_,i)=>[i,0])));
  const [taxInput,setTaxInput]=useState("");
  const [taxMode,setTaxMode]=useState("add");
  const [changeTotal,setChangeTotal]=useState("");
  const [changeGiven,setChangeGiven]=useState("");

  const bg=isDark?"#080b12":"#f0f0e8";
  const card=isDark?"#0f1525":"#ffffff";
  const border=isDark?"#1e2a40":"#d0d0c0";
  const text=isDark?"#f0f0f0":"#1a1a1a";
  const sub=isDark?"#3a4a60":"#909080";
  const accent="#f0c040";

  function calcPress(val){
    if(val==="C"){setDisplay("0");setPrev(null);setOp(null);setFresh(true);return;}
    if(val==="±"){setDisplay(d=>String(-parseFloat(d)));return;}
    if(val==="%"){setDisplay(d=>String(parseFloat(d)/100));return;}
    if(val==="⌫"){setDisplay(d=>d.length>1?d.slice(0,-1):"0");return;}
    if(["+","-","×","÷"].includes(val)){setPrev(parseFloat(display));setOp(val);setFresh(true);return;}
    if(val==="="){
      if(op&&prev!=null){
        const cur=parseFloat(display);
        const res=op==="+"?prev+cur:op==="-"?prev-cur:op==="×"?prev*cur:op==="÷"&&cur!==0?prev/cur:cur;
        setDisplay(String(parseFloat(res.toFixed(10))));setPrev(null);setOp(null);setFresh(true);
      }
      return;
    }
    if(val==="."){
      if(fresh){setDisplay("0.");setFresh(false);}
      else if(!display.includes("."))setDisplay(d=>d+".");
      return;
    }
    if(fresh){setDisplay(val);setFresh(false);}
    else setDisplay(d=>d==="0"?val:d+val);
  }

  const calcRows=[["C","±","%","÷"],["7","8","9","×"],["4","5","6","-"],["1","2","3","+"],["⌫","0",".","="]];
  const cashTotal=DENOMINATIONS.reduce((sum,d,i)=>sum+(counts[i]||0)*d.value,0);
  const taxAmt=taxInput?parseFloat(taxInput)*taxRate:0;
  const taxTotal=taxInput?parseFloat(taxInput)+(taxMode==="add"?taxAmt:-taxAmt):0;

  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"'Georgia','Times New Roman',serif",paddingBottom:80}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .calc-btn{transition:transform 0.08s ease;}
        .calc-btn:active{transform:scale(0.92);}
      `}</style>
      <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"20px 16px 14px"}}>
        <div style={{fontSize:10,color:sub,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>Gil's Grocery</div>
        <div style={{fontSize:20,fontWeight:700,color:accent,marginBottom:12}}>Cash Tools</div>
        <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2}}>
          {[{id:"calc",label:"Calculator"},{id:"change",label:"Change"},{id:"cash",label:"Cash Counter"},{id:"tax",label:"Tax"}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"8px 12px",borderRadius:10,border:`1px solid ${tab===t.id?accent:border}`,background:tab===t.id?accent:"transparent",color:tab===t.id?"#0f1117":sub,fontSize:12,fontWeight:tab===t.id?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",whiteSpace:"nowrap"}}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px"}}>

        {tab==="calc"&&(
          <div style={{animation:"fadeUp 0.2s ease"}}>
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:16,padding:"20px 20px 14px",marginBottom:12,textAlign:"right"}}>
              {op&&<div style={{fontSize:12,color:sub,marginBottom:2}}>{prev} {op}</div>}
              <div style={{fontSize:48,fontWeight:300,color:text,lineHeight:1,wordBreak:"break-all",minHeight:56}}>
                {display.length>10?parseFloat(display).toExponential(4):display}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {calcRows.flat().map(btn=>{
                const isOp=["+","-","×","÷"].includes(btn);
                const isEq=btn==="=";
                const isFn=["C","±","%","⌫"].includes(btn);
                return(
                  <button key={btn} className="calc-btn tap-btn" onClick={()=>calcPress(btn)} style={{
                    padding:"18px 0",borderRadius:14,border:"none",cursor:"pointer",
                    fontSize:isOp||isEq?22:18,fontWeight:isOp||isEq?700:400,fontFamily:"inherit",
                    background:isEq?accent:isOp?`${accent}22`:isFn?isDark?"#1e2a3a":"#e8e0d0":card,
                    color:isEq?"#0f1117":isOp?accent:text,
                    border:`1px solid ${isEq?accent:isOp?`${accent}44`:border}`,
                    boxShadow:isEq?`0 4px 16px ${accent}44`:"none",
                  }}>{btn}</button>
                );
              })}
            </div>
          </div>
        )}

        {tab==="cash"&&(
          <div style={{animation:"fadeUp 0.2s ease"}}>
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:"16px 18px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Total Cash</div>
                <div style={{fontSize:36,fontWeight:700,color:accent}}>${cashTotal.toFixed(2)}</div>
              </div>
              <button onClick={()=>setCounts(Object.fromEntries(DENOMINATIONS.map((_,i)=>[i,0])))} style={{padding:"8px 14px",background:"transparent",border:`1px solid ${border}`,borderRadius:10,color:sub,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Clear All</button>
            </div>
            {DENOMINATIONS.map((d,i)=>(
              <div key={i} style={{background:card,border:`1px solid ${border}`,borderRadius:12,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:text}}>{d.label}</div>
                  <div style={{fontSize:11,color:sub}}>${d.value.toFixed(2)} each · <span style={{color:accent,fontWeight:600}}>${((counts[i]||0)*d.value).toFixed(2)}</span></div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>setCounts(c=>({...c,[i]:Math.max(0,(c[i]||0)-1)}))} style={{width:30,height:30,borderRadius:8,border:`1px solid ${border}`,background:"transparent",color:text,fontSize:18,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                  <input type="number" min="0" value={counts[i]||0} onChange={e=>setCounts(c=>({...c,[i]:Math.max(0,parseInt(e.target.value)||0)}))} style={{width:44,textAlign:"center",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"6px 4px",color:text,fontSize:14,fontFamily:"inherit"}}/>
                  <button onClick={()=>setCounts(c=>({...c,[i]:(c[i]||0)+1}))} style={{width:30,height:30,borderRadius:8,border:`1px solid ${accent}44`,background:`${accent}11`,color:accent,fontSize:18,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab==="tax"&&(
          <div style={{animation:"fadeUp 0.2s ease"}}>
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:12}}>
              <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Tax Rate</div>
              <div style={{fontSize:28,fontWeight:700,color:accent}}>{(taxRate*100).toFixed(2)}%</div>
              <div style={{fontSize:11,color:sub,marginTop:2}}>Current sales tax rate</div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[{id:"add",label:"+ Add Tax to Price"},{id:"remove",label:"− Remove Tax from Total"}].map(m=>(
                <button key={m.id} onClick={()=>setTaxMode(m.id)} style={{flex:1,padding:"9px 6px",borderRadius:10,border:`1px solid ${taxMode===m.id?accent:border}`,background:taxMode===m.id?`${accent}22`:"transparent",color:taxMode===m.id?accent:sub,fontSize:12,fontWeight:taxMode===m.id?700:400,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                  {m.label}
                </button>
              ))}
            </div>
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:12}}>
              <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{taxMode==="add"?"Pre-Tax Price ($)":"Total with Tax ($)"}</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22,color:sub}}>$</span>
                <input type="number" min="0" step="0.01" value={taxInput} onChange={e=>setTaxInput(e.target.value)} placeholder="0.00" style={{flex:1,background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:10,padding:"12px 14px",color:text,fontSize:24,fontFamily:"inherit",fontWeight:300}}/>
              </div>
            </div>
            {taxInput&&!isNaN(parseFloat(taxInput))&&(
              <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:12,animation:"fadeUp 0.2s ease"}}>
                {[
                  {label:taxMode==="add"?"Pre-Tax Amount":"Total (with tax)",value:`$${parseFloat(taxInput).toFixed(2)}`,big:false},
                  {label:"Tax (3.23%)",value:`$${Math.abs(taxAmt).toFixed(2)}`,big:false},
                  {label:taxMode==="add"?"Total with Tax":"Pre-Tax Amount",value:`$${Math.abs(taxTotal).toFixed(2)}`,big:true},
                ].map((row,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<2?`1px solid ${border}`:"none"}}>
                    <span style={{fontSize:13,color:row.big?text:sub}}>{row.label}</span>
                    <span style={{fontSize:row.big?22:16,fontWeight:row.big?700:400,color:row.big?accent:text}}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16}}>
              <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Quick Reference</div>
              {[1,5,10,20,50,100].map(amt=>(
                <div key={amt} onClick={()=>setTaxInput(String(amt))} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${border}`,cursor:"pointer"}}>
                  <span style={{fontSize:13,color:sub}}>${amt}.00</span>
                  <span style={{fontSize:13,color:text}}>+${(amt*taxRate).toFixed(2)} tax</span>
                  <span style={{fontSize:13,fontWeight:700,color:accent}}>${(amt*(1+taxRate)).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Change Calculator ── */}
        {tab==="change"&&(
          <div style={{animation:"fadeUp 0.2s ease"}}>
            {/* Inputs */}
            <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:12}}>
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Sale Total ($)</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20,color:sub}}>$</span>
                  <input type="number" min="0" step="0.01" value={changeTotal}
                    onChange={e=>setChangeTotal(e.target.value)}
                    placeholder="0.00"
                    style={{flex:1,background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:10,padding:"12px 14px",color:text,fontSize:22,fontFamily:"inherit",fontWeight:300}}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:11,color:sub,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Amount Given ($)</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20,color:sub}}>$</span>
                  <input type="number" min="0" step="0.01" value={changeGiven}
                    onChange={e=>setChangeGiven(e.target.value)}
                    placeholder="0.00"
                    style={{flex:1,background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:10,padding:"12px 14px",color:text,fontSize:22,fontFamily:"inherit",fontWeight:300}}/>
                </div>
              </div>
            </div>

            {/* Quick "given" buttons */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {[1,5,10,20,50,100].map(amt=>(
                <button key={amt} onClick={()=>setChangeGiven(String(amt))}
                  style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${border}`,background:parseFloat(changeGiven)===amt?accent:"transparent",color:parseFloat(changeGiven)===amt?"#0f1117":sub,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>
                  ${amt}
                </button>
              ))}
            </div>

            {/* Result */}
            {(()=>{
              const total=parseFloat(changeTotal);
              const given=parseFloat(changeGiven);
              if(!changeTotal||!changeGiven||isNaN(total)||isNaN(given)) return(
                <div style={{textAlign:"center",color:sub,padding:"30px 20px",background:card,border:`1px solid ${border}`,borderRadius:14}}>
                  <div style={{fontSize:28,marginBottom:8}}>💰</div>
                  <div style={{fontSize:13}}>Enter the sale total and amount given</div>
                </div>
              );
              if(given<total) return(
                <div style={{background:"#2e1a1a",border:"1px solid #5a2a2a",borderRadius:14,padding:16,textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#e74c3c",marginBottom:4}}>Not Enough</div>
                  <div style={{fontSize:13,color:"#e07070"}}>Customer is ${(total-given).toFixed(2)} short</div>
                </div>
              );
              const changeDue=Math.round((given-total)*100)/100;
              if(changeDue===0) return(
                <div style={{background:isDark?"#0a1e0a":"#f0faf0",border:`1px solid ${isDark?"#1a4a1a":"#b0d0b0"}`,borderRadius:14,padding:16,textAlign:"center"}}>
                  <div style={{fontSize:16,fontWeight:700,color:"#27ae60",marginBottom:4}}>✓ Exact Change</div>
                  <div style={{fontSize:13,color:sub}}>No change needed</div>
                </div>
              );
              // Break into denominations (largest first, prefer fewer bills)
              const breakDown=[
                {label:"$100 Bills", value:100.00},
                {label:"$50 Bills",  value:50.00},
                {label:"$20 Bills",  value:20.00},
                {label:"$10 Bills",  value:10.00},
                {label:"$5 Bills",   value:5.00},
                {label:"$1 Bills",   value:1.00},
                {label:"Quarters",   value:0.25},
                {label:"Dimes",      value:0.10},
                {label:"Nickels",    value:0.05},
                {label:"Pennies",    value:0.01},
              ];
              const result=[];
              let remaining=Math.round(changeDue*100);
              breakDown.forEach(d=>{
                const count=Math.floor(remaining/Math.round(d.value*100));
                if(count>0){
                  result.push({...d,count});
                  remaining-=count*Math.round(d.value*100);
                }
              });
              return(
                <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,overflow:"hidden",animation:"fadeUp 0.2s ease"}}>
                  {/* Change due header */}
                  <div style={{background:`${accent}18`,borderBottom:`1px solid ${accent}33`,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:13,color:sub}}>Change Due</div>
                    <div style={{fontSize:32,fontWeight:700,color:accent}}>${changeDue.toFixed(2)}</div>
                  </div>
                  {/* Breakdown */}
                  {result.map((d,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderBottom:i<result.length-1?`1px solid ${border}`:"none"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:36,height:36,borderRadius:10,background:`${accent}18`,border:`1px solid ${accent}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:14,fontWeight:700,color:accent}}>{d.count}</span>
                        </div>
                        <span style={{fontSize:14,color:text}}>{d.label}</span>
                      </div>
                      <span style={{fontSize:13,color:sub}}>${(d.count*d.value).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Clear button */}
            {(changeTotal||changeGiven)&&(
              <button onClick={()=>{setChangeTotal("");setChangeGiven("");}}
                style={{width:"100%",marginTop:12,padding:11,background:"transparent",border:`1px solid ${border}`,borderRadius:10,color:sub,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                Clear
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── ChecklistsPage ────────────────────────────────────────────────────────────
function loadChecklists(){try{const s=localStorage.getItem("checklists");return s?JSON.parse(s):[];}catch{return[];}}
function saveChecklists(cl){try{localStorage.setItem("checklists",JSON.stringify(cl));}catch{}}

function ChecklistsPage({isDev,isDark,onUnlock}){
  const [lists,setLists]=useState(loadChecklists);
  const [focusList,setFocusList]=useState(null); // index
  const [showNewForm,setShowNewForm]=useState(false);
  const [newTitle,setNewTitle]=useState("");
  const [newItem,setNewItem]=useState("");

  const bg=isDark?"#080b12":"#f0f0e8";
  const card=isDark?"#0f1525":"#ffffff";
  const border=isDark?"#1e2a40":"#d0d0c0";
  const text=isDark?"#f0f0f0":"#1a1a1a";
  const sub=isDark?"#3a4a60":"#909080";
  const accent="#7c83fd";

  function persist(updated){setLists(updated);saveChecklists(updated);}

  function createList(){
    if(!newTitle.trim())return;
    persist([...lists,{id:Date.now(),title:newTitle.trim(),items:[]}]);
    setNewTitle("");setShowNewForm(false);
  }

  function deleteList(idx){persist(lists.filter((_,i)=>i!==idx));}

  function addItem(listIdx){
    if(!newItem.trim())return;
    const updated=lists.map((l,i)=>i===listIdx?{...l,items:[...l.items,{id:Date.now(),text:newItem.trim(),done:false}]}:l);
    persist(updated);setNewItem("");
  }

  function toggleItem(listIdx,itemId){
    const updated=lists.map((l,i)=>i===listIdx?{...l,items:l.items.map(it=>it.id===itemId?{...it,done:!it.done}:it)}:l);
    persist(updated);
  }

  function deleteItem(listIdx,itemId){
    const updated=lists.map((l,i)=>i===listIdx?{...l,items:l.items.filter(it=>it.id!==itemId)}:l);
    persist(updated);
  }

  function resetChecks(listIdx){
    const updated=lists.map((l,i)=>i===listIdx?{...l,items:l.items.map(it=>({...it,done:false}))}:l);
    persist(updated);
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if(focusList!==null){
    const list=lists[focusList];
    if(!list){setFocusList(null);return null;}
    const done=list.items.filter(i=>i.done).length;
    const pct=list.items.length?Math.round(done/list.items.length*100):0;
    return(
      <div style={{minHeight:"100vh",background:bg,fontFamily:"Georgia,serif",paddingBottom:80}}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"16px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>setFocusList(null)} style={{background:isDark?"#1a1f2e":"#e0e0d0",border:`1px solid ${border}`,borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:text,fontFamily:"inherit",flexShrink:0}}>←</button>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:700,color:accent}}>{list.title}</div>
              <div style={{fontSize:11,color:sub}}>{done}/{list.items.length} complete</div>
            </div>
            {isDev&&<button onClick={()=>resetChecks(focusList)} style={{fontSize:11,padding:"5px 10px",background:"transparent",border:`1px solid ${border}`,borderRadius:8,color:sub,cursor:"pointer",fontFamily:"inherit"}}>Reset</button>}
          </div>
          {list.items.length>0&&(
            <div style={{marginTop:10}}>
              <div style={{height:4,background:isDark?"#1e2a40":"#d0d0c0",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#27ae60":accent,borderRadius:4,transition:"width 0.3s ease"}}/>
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"14px"}}>
          {list.items.length===0&&(
            <div style={{textAlign:"center",color:sub,padding:"40px 20px"}}>
              <div style={{fontSize:32,marginBottom:8}}>📋</div>
              <div style={{fontSize:14}}>{isDev?"Add items below to build this checklist.":"No items yet."}</div>
            </div>
          )}
          {list.items.map((item,i)=>(
            <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:card,border:`1px solid ${item.done?accent+"33":border}`,borderRadius:12,marginBottom:8,animation:`fadeUp 0.2s ease ${i*0.04}s both`,transition:"border-color 0.2s"}}>
              <button onClick={()=>toggleItem(focusList,item.id)} style={{width:24,height:24,borderRadius:6,border:`2px solid ${item.done?accent:sub}`,background:item.done?accent:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                {item.done&&<span style={{color:"#0f1117",fontSize:14,fontWeight:900}}>✓</span>}
              </button>
              <span style={{flex:1,fontSize:14,color:item.done?sub:text,textDecoration:item.done?"line-through":"none",transition:"all 0.2s"}}>{item.text}</span>
              {isDev&&<button onClick={()=>deleteItem(focusList,item.id)} style={{background:"none",border:"none",color:"#e07070",fontSize:14,cursor:"pointer",padding:2,flexShrink:0}}>🗑️</button>}
            </div>
          ))}
          {isDev&&(
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem(focusList)}
                placeholder="Add item…"
                style={{flex:1,background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:10,padding:"10px 14px",color:text,fontSize:14,fontFamily:"inherit"}}/>
              <button onClick={()=>addItem(focusList)} style={{padding:"10px 16px",background:accent,border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"Georgia,serif",paddingBottom:80}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"20px 14px 14px"}}>
        <div style={{fontSize:10,color:sub,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>{"Gil's Grocery"}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:20,fontWeight:700,color:accent}}>Checklists</div>
          {isDev&&<button onClick={()=>setShowNewForm(v=>!v)} style={{padding:"7px 14px",background:showNewForm?"transparent":accent,border:`1px solid ${showNewForm?border:accent}`,borderRadius:20,color:showNewForm?sub:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>{showNewForm?"✕ Cancel":"+ New List"}</button>}
        </div>
      </div>
      <div style={{padding:"14px"}}>
        {showNewForm&&(
          <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:14,animation:"slideDown 0.2s ease"}}>
            <div style={{fontSize:11,color:sub,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>List Title</div>
            <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createList()}
              placeholder="e.g. Closing Checklist"
              style={{width:"100%",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:10,padding:"10px 14px",color:text,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",marginBottom:10}}/>
            <button onClick={createList} className="tap-btn" style={{width:"100%",padding:11,background:accent,border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Create Checklist</button>
          </div>
        )}
        {lists.length===0&&!showNewForm&&(
          <div style={{textAlign:"center",color:sub,padding:"60px 20px"}}>
            <div style={{fontSize:40,marginBottom:10}}>📋</div>
            <div style={{fontSize:16,fontWeight:600,color:text,marginBottom:6}}>No checklists yet</div>
            <div style={{fontSize:13}}>{isDev?"Tap + New List to create one":"No checklists have been created yet"}</div>
          </div>
        )}
        {lists.map((list,idx)=>{
          const done=list.items.filter(i=>i.done).length;
          const pct=list.items.length?Math.round(done/list.items.length*100):0;
          return(
            <div key={list.id} onClick={()=>setFocusList(idx)}
              style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer",animation:`fadeUp 0.22s ease ${idx*0.06}s both`,position:"relative"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:list.items.length?8:0}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:text}}>{list.title}</div>
                  <div style={{fontSize:11,color:sub,marginTop:1}}>{list.items.length} item{list.items.length!==1?"s":""}{list.items.length>0&&` · ${done} done`}</div>
                </div>
                {isDev&&<button onClick={e=>{e.stopPropagation();deleteList(idx);}} style={{background:"none",border:"none",color:sub,fontSize:14,cursor:"pointer",padding:4}}>🗑️</button>}
                <span style={{color:sub,fontSize:16}}>›</span>
              </div>
              {list.items.length>0&&(
                <div style={{height:3,background:isDark?"#1e2a40":"#d0d0c0",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:pct===100?"#27ae60":accent,borderRadius:3,transition:"width 0.3s"}}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ── CustomerCounter ───────────────────────────────────────────────────────────
function CustomerCounter(){
  const [count,setCount]=useState(0);
  const [visible,setVisible]=useState(false);
  const [pulse,setPulse]=useState(false);
  function tap(){
    setCount(n=>n+1);
    setPulse(true);
    setTimeout(()=>setPulse(false),200);
  }
  return(
    <div style={{position:"fixed",bottom:90,right:12,zIndex:190,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
      {visible&&(
        <div style={{background:"#0f1525",border:"1px solid #1e2a40",borderRadius:14,padding:"10px 14px",display:"flex",alignItems:"center",gap:12,animation:"popIn 0.2s ease",boxShadow:"0 4px 20px rgba(0,0,0,0.5)"}}>
          <button onClick={()=>setCount(n=>Math.max(0,n-1))} style={{width:30,height:30,borderRadius:8,border:"1px solid #1e2a40",background:"transparent",color:"#7c83fd",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",lineHeight:1}}>−</button>
          <div style={{textAlign:"center",minWidth:40}}>
            <div style={{fontSize:26,fontWeight:700,color:"#f0f0f0",lineHeight:1,transform:pulse?"scale(1.2)":"scale(1)",transition:"transform 0.15s ease"}}>{count}</div>
            <div style={{fontSize:9,color:"#3a4a60",letterSpacing:"0.08em",textTransform:"uppercase"}}>customers</div>
          </div>
          <button onClick={tap} style={{width:30,height:30,borderRadius:8,border:"1px solid #7c83fd44",background:"#7c83fd18",color:"#7c83fd",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",lineHeight:1}}>+</button>
          <button onClick={()=>setCount(0)} style={{fontSize:10,color:"#3a4a60",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:"0 0 0 4px"}}>reset</button>
        </div>
      )}
      <button onClick={()=>setVisible(v=>!v)} style={{width:44,height:44,borderRadius:"50%",background:visible?"#7c83fd":"#0f1525",border:"1px solid #7c83fd44",color:visible?"#fff":"#7c83fd",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.4)",transition:"all 0.2s ease"}}>
        👤
      </button>
    </div>
  );
}

// ── SuggestionsPage ───────────────────────────────────────────────────────────
function SuggestionsPage({isDark,isManager}){
  const [suggestions,setSuggestions]=useState([]);
  const [form,setForm]=useState({title:"",description:"",category:"Feature"});
  const [showForm,setShowForm]=useState(false);
  const [loading,setLoading]=useState(true);

  const bg=isDark?"#080b12":"#f0f0e8";
  const card=isDark?"#0f1525":"#ffffff";
  const border=isDark?"#1e2a40":"#d0d0c0";
  const text=isDark?"#f0f0f0":"#1a1a1a";
  const sub=isDark?"#3a4a60":"#909080";
  const accent="#7c83fd";

  useEffect(()=>{
    sb.from("suggestions").select("*").order("created_at",{ascending:false})
      .then(({data})=>{if(data)setSuggestions(data);setLoading(false);})
      .catch(()=>setLoading(false));
  },[]);

  async function submit(){
    if(!form.title.trim())return;
    const row={title:form.title.trim(),description:form.description.trim(),category:form.category,created_at:new Date().toLocaleDateString(),votes:0};
    const {data}=await sb.from("suggestions").insert(row).select().single();
    if(data){setSuggestions(prev=>[data,...prev]);}
    setForm({title:"",description:"",category:"Feature"});setShowForm(false);
  }

  async function vote(id){
    const s=suggestions.find(s=>s.id===id);
    if(!s)return;
    await sb.from("suggestions").update({votes:(s.votes||0)+1}).eq("id",id);
    setSuggestions(prev=>prev.map(s=>s.id===id?{...s,votes:(s.votes||0)+1}:s));
  }

  const cats=["Feature","Improvement","Bug","Other"];

  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"Georgia,serif",paddingBottom:80}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"20px 14px 14px"}}>
        <div style={{fontSize:10,color:sub,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>Gil's Grocery</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:20,fontWeight:700,color:accent}}>💡 Suggestions</div>
          <button onClick={()=>setShowForm(v=>!v)} style={{padding:"7px 14px",background:showForm?"transparent":accent,border:`1px solid ${showForm?border:accent}`,borderRadius:20,color:showForm?sub:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{showForm?"✕ Cancel":"+ Suggest"}</button>
        </div>
      </div>
      <div style={{padding:"14px"}}>
        {showForm&&(
          <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:14,animation:"slideDown 0.2s ease"}}>
            <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Title</div>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="What would you like to see?" style={{width:"100%",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"9px 12px",color:text,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",marginBottom:10}}/>
            <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Details <span style={{opacity:0.5,fontWeight:400,textTransform:"none"}}>— optional</span></div>
            <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Describe the idea..." style={{width:"100%",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"9px 12px",color:text,fontSize:14,fontFamily:"inherit",boxSizing:"border-box",minHeight:60,resize:"none",lineHeight:1.4,marginBottom:10}}/>
            <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
              {cats.map(cat=>(
                <button key={cat} onClick={()=>setForm(f=>({...f,category:cat}))} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${form.category===cat?accent:border}`,background:form.category===cat?`${accent}22`:"transparent",color:form.category===cat?accent:sub,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>{cat}</button>
              ))}
            </div>
            <button onClick={submit} style={{width:"100%",padding:11,background:accent,border:"none",borderRadius:10,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Submit Suggestion</button>
          </div>
        )}
        {loading&&<div style={{textAlign:"center",color:sub,padding:40}}>Loading…</div>}
        {!loading&&suggestions.length===0&&!showForm&&(
          <div style={{textAlign:"center",color:sub,padding:"50px 20px"}}>
            <div style={{fontSize:36,marginBottom:8}}>💡</div>
            <div style={{fontSize:15,fontWeight:600,color:text,marginBottom:4}}>No suggestions yet</div>
            <div style={{fontSize:13}}>Be the first to suggest a feature!</div>
          </div>
        )}
        {suggestions.map((s,i)=>{
          const catColor={Feature:accent,Improvement:"#27ae60",Bug:"#e74c3c",Other:"#f0c040"}[s.category]||sub;
          return(
            <div key={s.id} style={{background:card,border:`1px solid ${border}`,borderRadius:12,padding:"12px 14px",marginBottom:10,animation:`fadeUp 0.2s ease ${i*0.04}s both`}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <button onClick={()=>vote(s.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",minWidth:36,flexShrink:0}}>
                  <span style={{fontSize:12}}>▲</span>
                  <span style={{fontSize:12,fontWeight:700,color:text}}>{s.votes||0}</span>
                </button>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontSize:13,fontWeight:700,color:text}}>{s.title}</span>
                    <span style={{fontSize:10,padding:"1px 7px",borderRadius:10,background:`${catColor}22`,color:catColor,border:`1px solid ${catColor}44`}}>{s.category}</span>
                  </div>
                  {s.description&&<div style={{fontSize:12,color:sub,lineHeight:1.4,marginBottom:3}}>{s.description}</div>}
                  <div style={{fontSize:10,color:sub}}>{s.created_at}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── UpdateLogPage ─────────────────────────────────────────────────────────────
function UpdateLogPage({isDark,isDev}){
  const [logs,setLogs]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({version:"",title:"",notes:""});
  const [loading,setLoading]=useState(true);

  const bg=isDark?"#080b12":"#f0f0e8";
  const card=isDark?"#0f1525":"#ffffff";
  const border=isDark?"#1e2a40":"#d0d0c0";
  const text=isDark?"#f0f0f0":"#1a1a1a";
  const sub=isDark?"#3a4a60":"#909080";
  const accent="#f0c040";

  useEffect(()=>{
    sb.from("update_logs").select("*").order("created_at",{ascending:false})
      .then(({data})=>{if(data)setLogs(data);setLoading(false);})
      .catch(()=>setLoading(false));
  },[]);

  async function addLog(){
    if(!form.title.trim())return;
    const row={version:form.version.trim()||null,title:form.title.trim(),notes:form.notes.trim(),created_at:new Date().toLocaleDateString()};
    const {data}=await sb.from("update_logs").insert(row).select().single();
    if(data)setLogs(prev=>[data,...prev]);
    setForm({version:"",title:"",notes:""});setShowForm(false);
  }

  async function deleteLog(id){
    await sb.from("update_logs").delete().eq("id",id);
    setLogs(prev=>prev.filter(l=>l.id!==id));
  }

  return(
    <div style={{minHeight:"100vh",background:bg,fontFamily:"Georgia,serif",paddingBottom:80}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{background:isDark?"linear-gradient(160deg,#0f1320,#080b12)":"linear-gradient(160deg,#e8e8d8,#f0f0e8)",borderBottom:`1px solid ${border}`,padding:"20px 14px 14px"}}>
        <div style={{fontSize:10,color:sub,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>Gil's Grocery</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:20,fontWeight:700,color:accent}}>📋 Update Log</div>
          {isDev&&<button onClick={()=>setShowForm(v=>!v)} style={{padding:"7px 14px",background:showForm?"transparent":accent,border:`1px solid ${showForm?border:accent}`,borderRadius:20,color:showForm?sub:"#0f1117",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{showForm?"✕ Cancel":"+ Add Update"}</button>}
        </div>
      </div>
      <div style={{padding:"14px"}}>
        {isDev&&showForm&&(
          <div style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,marginBottom:14,animation:"slideDown 0.2s ease"}}>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <div style={{flex:"0 0 90px"}}>
                <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Version</div>
                <input value={form.version} onChange={e=>setForm(f=>({...f,version:e.target.value}))} placeholder="v1.2" style={{width:"100%",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"8px 10px",color:text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Title</div>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="What changed?" style={{width:"100%",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"8px 10px",color:text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{fontSize:11,color:sub,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Notes <span style={{opacity:0.5,fontWeight:400,textTransform:"none"}}>— optional</span></div>
            <textarea value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Details of what was added, fixed, or changed..." style={{width:"100%",background:isDark?"#0a0f1e":"#f4f4f0",border:`1px solid ${border}`,borderRadius:8,padding:"9px 12px",color:text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",minHeight:80,resize:"none",lineHeight:1.5,marginBottom:10}}/>
            <button onClick={addLog} style={{width:"100%",padding:11,background:accent,border:"none",borderRadius:10,color:"#0f1117",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Post Update</button>
          </div>
        )}
        {loading&&<div style={{textAlign:"center",color:sub,padding:40}}>Loading…</div>}
        {!loading&&logs.length===0&&!showForm&&(
          <div style={{textAlign:"center",color:sub,padding:"50px 20px"}}>
            <div style={{fontSize:36,marginBottom:8}}>📋</div>
            <div style={{fontSize:15,fontWeight:600,color:text,marginBottom:4}}>No updates posted yet</div>
            {isDev&&<div style={{fontSize:13}}>Tap + Add Update to post the first one</div>}
          </div>
        )}
        {logs.map((log,i)=>(
          <div key={log.id} style={{background:card,border:`1px solid ${border}`,borderRadius:14,padding:"14px 16px",marginBottom:12,animation:`fadeUp 0.2s ease ${i*0.05}s both`}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                  {log.version&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:`${accent}22`,color:accent,border:`1px solid ${accent}44`,fontWeight:700}}>{log.version}</span>}
                  <span style={{fontSize:14,fontWeight:700,color:text}}>{log.title}</span>
                </div>
                {log.notes&&<div style={{fontSize:13,color:sub,lineHeight:1.6,whiteSpace:"pre-line"}}>{log.notes}</div>}
                <div style={{fontSize:10,color:sub,marginTop:6}}>{log.created_at}</div>
              </div>
              {isDev&&<button onClick={()=>deleteLog(log.id)} style={{background:"none",border:"none",color:sub,fontSize:14,cursor:"pointer",padding:4,flexShrink:0}}>🗑️</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function BottomNav({page,setPage,activeCategoryTheme,isDark}){
  const bg=page==="dev"?DT.appBg:isDark?(activeCategoryTheme?.bg||"#080b12"):"#f0f0e8";
  const borderColor=page==="dev"?DT.cardBorder:isDark?(activeCategoryTheme?.border||"#141c2c"):"#d8d8c8";
  const tabs=[{id:"pricing",label:"Pricing",icon:"🏷️"},{id:"schedule",label:"Schedule",icon:"📅"},{id:"cash",label:"Cash",icon:"💵"},{id:"checklists",label:"Lists",icon:"📋"},{id:"suggestions",label:"Ideas",icon:"💡"},{id:"updates",label:"Updates",icon:"📋"},{id:"bugs",label:"Bugs",icon:"🐛"},{id:"dev",label:"Dev",icon:"👨‍💻"}];
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:bg,borderTop:`1px solid ${borderColor}`,display:"flex",zIndex:150,transition:"background 0.3s",overflowX:"auto",scrollbarWidth:"none"}}>
      {tabs.map(tab=>{
        const isActive=page===tab.id;
        const accentColor=tab.id==="dev"?DT.accent:activeCategoryTheme?.accent||"#f0c040";
        const textColor=isActive?accentColor:isDark?"#3a4a60":"#909080";
        return(
          <button key={tab.id} onClick={()=>setPage(tab.id)} style={{flex:1,padding:"10px 0 12px",background:"none",border:"none",cursor:"pointer",fontFamily:tab.id==="dev"?"'Courier New',monospace":"inherit",display:"flex",flexDirection:"column",alignItems:"center",gap:3,opacity:isActive?1:0.5,transition:"opacity 0.2s"}}>
            <span style={{fontSize:20}}>{tab.icon}</span>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:tab.id==="dev"?"0.08em":"0.04em",color:textColor,textTransform:"uppercase"}}>{tab.id==="dev"?"[DEV]":tab.label}</span>
            {isActive&&<div style={{width:20,height:2,borderRadius:2,background:accentColor,marginTop:1}}/>}
          </button>
        );
      })}
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App(){
  const [page,setPage]=useState("pricing");
  const [selectedCategory,setSelectedCategory]=useState(null);
  const [scrollToItem,setScrollToItem]=useState(null);
  const [items,setItems]=useState([]);
  const [isDev,setIsDev]=useState(()=>{try{return sessionStorage.getItem("isDev")==="true";}catch{return false;}});
  const [isManager,setIsManager]=useState(()=>{try{return sessionStorage.getItem("isManager")==="true";}catch{return false;}});
  const [showPinModal,setShowPinModal]=useState(false);
  const [pinInput,setPinInput]=useState("");
  const [pinError,setPinError]=useState(false);
  const [isDark,setIsDark]=useState(()=>loadTheme()==="dark");
  const [auditLog,setAuditLog]=useState([]);
  const [taxRate,setTaxRate]=useState(DEFAULT_TAX_RATE);
  const [loading,setLoading]=useState(true);
  const [managerDisabled,setManagerDisabled]=useState(false);
  const [showMgrDisabledModal,setShowMgrDisabledModal]=useState(false);
  const [storeHours,setStoreHours]=useState(DEFAULT_HOURS);
  const [activeNotif,setActiveNotif]=useState(null); // {message, color, expiresAt} or null

  // Load items and settings from Supabase on mount
  useEffect(()=>{
    async function init(){
      try{
        const {data:itemData}=await sb.from("items").select("*").order("name");
        if(itemData&&itemData.length>0){
          setItems(itemData.map(row=>({
            id:row.id, name:row.name, category:row.category,
            subcategory:row.subcategory||"", price:parseFloat(row.price),
            location:row.location||"", notes:row.notes||"",
            inventory:row.inventory??null, outOfStock:row.out_of_stock||false,
            mapZone:row.map_zone||null, expiryDate:row.expiry_date||"",
            packSize:row.pack_size||null, containerType:row.container_type||null,
            deposit:row.deposit!=null?parseFloat(row.deposit):null,
            wineType:row.wine_type||null,
            gilliesRecommendation:row.gillies_recommendation||false,
          })));
        }
        const rate=await fetchTaxRate();
        setTaxRate(rate);
        // Load managerDisabled
        const {data:md}=await sb.from("app_settings").select("value").eq("key","manager_disabled").single();
        if(md)setManagerDisabled(md.value==="true");
        // Load store hours
        const hours=await fetchStoreHours();
        setStoreHours(hours);
        // New year check — delete all shifts from previous years
        const storedYear=parseInt(localStorage.getItem("shifts_year")||"0");
        const thisYear=new Date().getFullYear();
        if(storedYear!==0&&storedYear!==thisYear){
          await sb.from("schedule_shifts").delete().neq("id",0);
          localStorage.setItem("shifts_year",String(thisYear));
        } else if(storedYear===0){
          localStorage.setItem("shifts_year",String(thisYear));
        }
        // Load active notification
        const notif=await fetchActiveNotif();
        if(notif&&notif.expiresAt&&new Date(notif.expiresAt)>new Date()){
          setActiveNotif(notif);
        } else if(notif&&!notif.expiresAt){
          setActiveNotif(notif); // permanent until deleted
        }
      }catch(e){console.error("Init error:",e);}
      finally{setLoading(false);}
    }
    init();
  },[]);
  // Lifted welcome refs so they survive navigation back to home
  const hasShownWelcomeRef=useRef({dev:false,manager:false});

  const MANAGER_PIN="3018",DEV_PIN="130654";

  function addAuditEntry(entry){
    setAuditLog(prev=>[entry,...prev].slice(0,10));
  }

  function submitPin(){
    if(managerDisabled&&pinInput===MANAGER_PIN){setPinError(true);setPinInput("");return;}
    if(pinInput===MANAGER_PIN||pinInput===DEV_PIN){
      setIsManager(true);
      if(pinInput===DEV_PIN)setIsDev(true);
      try{sessionStorage.setItem("isManager","true");if(pinInput===DEV_PIN)sessionStorage.setItem("isDev","true");}catch{}
      setShowPinModal(false);setPinInput("");setPinError(false);
    } else {setPinError(true);setPinInput("");}
  }  function logout(){
    setIsManager(false);setIsDev(false);
    try{sessionStorage.removeItem("isManager");sessionStorage.removeItem("isDev");}catch{}
    hasShownWelcomeRef.current={dev:false,manager:false};
  }
  function toggleTheme(){setIsDark(v=>{try{localStorage.setItem(THEME_KEY,v?"light":"dark");}catch{}return!v;});}

  const activeCatTheme=selectedCategory?.theme||null;
  // How many px of fixed banners are showing at top
  const bannerOffset=(managerDisabled&&!isDev?36:0)+(activeNotif&&!managerDisabled?36:0);
  const bugsT={accent:"#7c83fd",accentText:"#fff",card:"#0f0f22",border:"#1e1e40",sub:"#505080",inputBg:"#0a0a18",inputBorder:"#1e1e40"};

  function handlePageChange(p){setPage(p);if(p!=="pricing")setSelectedCategory(null);}

  return(
    <div style={{maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{`
        @keyframes popIn{0%{opacity:0;transform:scale(0.85)}70%{transform:scale(1.04)}100%{opacity:1;transform:scale(1)}}
        @keyframes bannerSlide{from{opacity:0;transform:translateY(-100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .tap-btn{transition:transform 0.1s ease,opacity 0.12s;}
        .tap-btn:active{transform:scale(0.95);opacity:0.8;}
      `}</style>
      {/* Loading screen */}
      {loading&&(
        <div style={{position:"fixed",inset:0,background:"#080b12",zIndex:999,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
          <div style={{fontSize:40,animation:"popIn 0.5s cubic-bezier(0.34,1.3,0.64,1)"}}>🏪</div>
          <div style={{fontSize:16,fontWeight:700,color:"#f0c040",fontFamily:"'Georgia',serif"}}>Gil's Grocery</div>
          <div style={{fontSize:12,color:"#3a4a60",letterSpacing:"0.1em",textTransform:"uppercase"}}>Loading…</div>
        </div>
      )}
      {/* Manager Disabled Modal */}
      {showMgrDisabledModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn 0.2s ease"}} onClick={()=>setShowMgrDisabledModal(false)}>
          <div style={{background:"#1a0f0f",border:"1px solid #e74c3c44",borderRadius:16,padding:28,width:"100%",maxWidth:300,textAlign:"center",animation:"popIn 0.3s cubic-bezier(0.34,1.1,0.64,1)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:36,marginBottom:10}}>🔒</div>
            <div style={{fontSize:18,fontWeight:700,color:"#e74c3c",marginBottom:8}}>Manager Access Disabled</div>
            <div style={{fontSize:13,color:"#c07070",marginBottom:20,lineHeight:1.5}}>Manager permissions have been temporarily disabled by the developer. Please check back later.</div>
            <button onClick={()=>setShowMgrDisabledModal(false)} style={{width:"100%",padding:12,background:"#e74c3c22",border:"1px solid #e74c3c44",borderRadius:10,color:"#e74c3c",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Manager disabled banner */}
      {managerDisabled&&!isDev&&(
        <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#e74c3c",zIndex:200,padding:"8px 16px",display:"flex",alignItems:"center",gap:8,animation:"bannerSlide 0.3s cubic-bezier(0.34,1.1,0.64,1)"}}>
          <span style={{fontSize:14}}>🔒</span>
          <span style={{fontSize:12,fontWeight:600,color:"#fff",flex:1}}>Manager permissions are temporarily disabled</span>
        </div>
      )}

      {/* Active dev notification banner */}
      {activeNotif&&!managerDisabled&&<NotifBanner notif={activeNotif} managerDisabled={managerDisabled} isDev={isDev} onExpire={()=>{setActiveNotif(null);saveActiveNotif(null);}}/>}

      {/* PIN Modal */}
      {showPinModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fadeIn 0.2s ease"}}>
          <div style={{background:"#1a1f2e",border:`1px solid ${managerDisabled?"#e74c3c44":"#2a3050"}`,borderRadius:16,padding:28,width:"100%",maxWidth:300,textAlign:"center",animation:"modalIn 0.25s ease"}}>
            <div style={{fontSize:32,marginBottom:8}}>{managerDisabled?"🔒":"🔒"}</div>
            <div style={{fontSize:18,fontWeight:700,color:"#f0f0f0",marginBottom:6}}>Sign In</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:4}}>Enter your PIN to continue</div>
            {managerDisabled&&<div style={{fontSize:11,color:"#e74c3c",marginBottom:12,padding:"6px 10px",background:"#e74c3c11",border:"1px solid #e74c3c33",borderRadius:8}}>Manager access is temporarily disabled</div>}
            {!managerDisabled&&<div style={{height:12,marginBottom:8}}/>}
            <input type="password" inputMode="numeric" maxLength={6} value={pinInput} autoFocus
              onChange={e=>{setPinInput(e.target.value);setPinError(false);}}
              onKeyDown={e=>e.key==="Enter"&&submitPin()}
              placeholder="••••"
              style={{width:"100%",background:"#0f1117",border:`2px solid ${pinError?"#e74c3c":"#2e3450"}`,borderRadius:10,padding:"14px",color:"#f0f0f0",fontSize:28,fontFamily:"inherit",boxSizing:"border-box",textAlign:"center",letterSpacing:"0.3em",marginBottom:8}}/>
            {pinError&&<div style={{fontSize:12,color:"#e74c3c",marginBottom:12}}>Incorrect PIN, try again</div>}
            {!pinError&&<div style={{height:20,marginBottom:12}}/>}
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setShowPinModal(false);setPinInput("");setPinError(false);}} style={{flex:1,padding:12,background:"transparent",border:"1px solid #2e3450",borderRadius:10,color:"#6b7280",fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
              <button onClick={submitPin} style={{flex:2,padding:12,background:"#f0c040",border:"none",borderRadius:10,color:"#0f1117",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {page==="pricing"&&(
        selectedCategory
          ?<CategoryPage category={selectedCategory} items={items} setItems={setItems} onBack={()=>{setSelectedCategory(null);setScrollToItem(null);}} isManager={isManager} isDev={isDev} managerDisabled={managerDisabled} onRequireManager={()=>managerDisabled&&!isDev?setShowMgrDisabledModal(true):setShowPinModal(true)} isDark={isDark} onToggleTheme={toggleTheme} onAuditLog={addAuditEntry} scrollToItem={scrollToItem} bannerOffset={bannerOffset}/>
          :<HomeGrid items={items} setItems={setItems} onSelectCategory={(cat,itemId)=>{setSelectedCategory(cat);setScrollToItem(itemId||null);}} isManager={isManager} isDev={isDev} isDark={isDark} onSignIn={()=>setShowPinModal(true)} onSignOut={logout} onToggleTheme={toggleTheme} hasShownWelcomeRef={hasShownWelcomeRef} bannerOffset={bannerOffset}/>
      )}
      {page==="schedule"&&<SchedulePage isManager={isManager} isDark={isDark} onUnlock={()=>setShowPinModal(true)} storeHours={storeHours} bannerOffset={bannerOffset}/>}
      {page==="cash"&&<CashPage isDark={isDark} taxRate={taxRate}/>}
      {page==="checklists"&&<ChecklistsPage isDev={isDev} isDark={isDark} bannerOffset={bannerOffset}/>}
      {page==="suggestions"&&<SuggestionsPage isDark={isDark} isManager={isManager}/>}
      {page==="updates"&&<UpdateLogPage isDark={isDark} isDev={isDev}/>}
      {page==="bugs"&&<div style={{minHeight:"100vh",background:"#0a0a1a",paddingBottom:80}}><BugsPage T={bugsT} isManager={isManager} managerDisabled={managerDisabled} onRequireManager={()=>managerDisabled&&!isDev?setShowMgrDisabledModal(true):setShowPinModal(true)}/></div>}
      {page==="dev"&&<DevPage isDev={isDev} onUnlock={()=>setShowPinModal(true)} auditLog={auditLog} taxRate={taxRate} onTaxRateChange={r=>{setTaxRate(r);saveTaxRate(r);}} managerDisabledProp={managerDisabled} onManagerDisabledChange={v=>{setManagerDisabled(v);if(v&&isManager&&!isDev){setIsManager(false);try{sessionStorage.removeItem("isManager");}catch{}}}} storeHours={storeHours} onStoreHoursChange={h=>{setStoreHours(h);saveStoreHours(h);}} setItems={setItems} activeNotif={activeNotif} onNotifChange={setActiveNotif}/>}      <CustomerCounter/>
      <BottomNav page={page} setPage={handlePageChange} activeCategoryTheme={activeCatTheme} isDark={isDark}/>
    </div>
  );
}
