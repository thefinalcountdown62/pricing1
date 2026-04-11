import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const PACK_SIZES     = ["Single", "4 Pack", "6 Pack", "12 Pack", "15 Pack", "18 Pack", "30 Pack"];
const CONTAINER_TYPES = ["Can", "Bottle"];
const WINE_TYPES     = ["Red", "White", "Rosé", "Sparkling", "Other"];
const THEME_KEY      = "beer-pricing-theme";

const MANAGER_PIN = "3018";
const AUTH_KEY    = "beer-pricing-auth";

function loadAuth() { try { return localStorage.getItem(AUTH_KEY) === "true"; } catch { return false; } }
function saveAuth(v) { try { localStorage.setItem(AUTH_KEY, v ? "true" : "false"); } catch {} }
function loadTheme() { try { return localStorage.getItem(THEME_KEY) || "dark"; } catch { return "dark"; } }
function saveTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch {} }// Map DB snake_case → app camelCase
function fromDB(row) {
  return {
    id:            row.id,
    name:          row.name,
    category:      row.category,
    packSize:      row.pack_size    || "Single",
    containerType: row.container_type || "Bottle",
    wineType:      row.wine_type    || "Other",
    price:         parseFloat(row.price) || 0,
    deposit:       parseFloat(row.deposit) || 0,
    location:      row.location     || "",
    outOfStock:    row.out_of_stock || false,
  };
}

// Map app camelCase → DB snake_case
function toDB(item) {
  return {
    id:             item.id,
    name:           item.name,
    category:       item.category,
    pack_size:      item.packSize,
    container_type: item.containerType,
    wine_type:      item.wineType,
    price:          item.price,
    deposit:        item.deposit || 0,
    location:       item.location || "",
    out_of_stock:   item.outOfStock || false,
  };
}

const emptyBeerForm = { name: "", packSize: "6 Pack",  containerType: "Can",    price: "", deposit: "", location: "", wineType: "Other", outOfStock: false };
const emptyWineForm = { name: "", packSize: "Single",  containerType: "Bottle", price: "", deposit: "", location: "", wineType: "Red",   outOfStock: false };

// ── themes ───────────────────────────────────────────────────────────────────
function buildThemes(mode) {
  const dark = mode === "dark";
  return {
    beer: {
      appBg: dark?"#0f1117":"#f0f4ff", headerBg: dark?"linear-gradient(160deg,#1a1f2e,#161b27)":"linear-gradient(160deg,#dce4f8,#c8d4f0)",
      headerBorder: dark?"#2a2f42":"#b0bedd", accent:"#f0c040", accentText:"#0f1117",
      cardBg: dark?"#1a1f2e":"#ffffff", cardBorder: dark?"#2a3050":"#d0d8f0",
      badgeBg: dark?"#252c42":"#e8edfb", badgeBorder: dark?"#3a4260":"#c0cae8", badgeText: dark?"#9ba8c0":"#5060a0",
      inputBg: dark?"#0f1117":"#f8faff", inputBorder: dark?"#2e3450":"#c0cae8",
      searchBg: dark?"#1e2435":"#edf1ff", selectBg: dark?"#1e2435":"#edf1ff",
      sectionColor:"#f0c040", formCardBg: dark?"#1a1f2e":"#ffffff", formCardBorder: dark?"#2a3050":"#d0d8f0",
      text: dark?"#f0f0f0":"#1a1f2e", subText: dark?"#6b7280":"#7080a0", oosOverlay: dark?"rgba(15,17,23,0.6)":"rgba(240,244,255,0.6)",
    },
    wine: {
      appBg: dark?"#1a0a0e":"#fff5f7", headerBg: dark?"linear-gradient(160deg,#3a0d1a,#2a0a12,#1f1008)":"linear-gradient(160deg,#f5d0d8,#ecc0c8)",
      headerBorder: dark?"#5a2030":"#e0a0b0", accent: dark?"#c8922a":"#a0601a", accentText: dark?"#fff8f0":"#fff8f0",
      cardBg: dark?"#2a0f18":"#ffffff", cardBorder: dark?"#4a1a28":"#f0c0cc",
      badgeBg: dark?"#3a1020":"#fde8ec", badgeBorder: dark?"#5a2030":"#f0a0b0", badgeText: dark?"#c9a0a8":"#904060",
      inputBg: dark?"#1a0a0e":"#fff8fa", inputBorder: dark?"#5a2030":"#f0a0b0",
      searchBg: dark?"#2a0f18":"#fde8ec", selectBg: dark?"#2a0f18":"#fde8ec",
      sectionColor: dark?"#c8922a":"#a0601a", formCardBg: dark?"#2a0f18":"#ffffff", formCardBorder: dark?"#4a1a28":"#f0c0cc",
      text: dark?"#f0f0f0":"#2a0f18", subText: dark?"#6b7280":"#904060", oosOverlay: dark?"rgba(26,10,14,0.6)":"rgba(255,245,247,0.6)",
    },
  };
}

function buildCSV(items) {
  const h = "Name,Category,Pack Size,Container,Wine Type,Price,Deposit,Location,Out of Stock";
  const rows = items.map(i => [
    `"${(i.name||"").replace(/"/g,'""')}"`, i.category,
    i.category==="Beer"?(i.packSize||""):"",
    i.category==="Beer"?(i.containerType||""):"",
    i.category==="Wine"?(i.wineType||"Other"):"",
    (i.price||0).toFixed(2),(i.deposit||0).toFixed(2),
    `"${(i.location||"").replace(/"/g,'""')}"`,
    i.outOfStock?"Yes":"No",
  ].join(","));
  return [h,...rows].join("\n");
}

function parseCSV(text) {
  const lines = text.trim().split("\n").map(l=>l.trim()).filter(Boolean);
  if (lines.length < 2) return { items:[], errors:["File appears empty."] };
  const header = lines[0].toLowerCase();
  if (!header.includes("name")||!header.includes("price")) return { items:[], errors:["Missing required columns: Name, Price."] };
  const cols = lines[0].split(",").map(c=>c.trim().toLowerCase().replace(/\s+/g,"_"));
  function col(row,name){ const i=cols.indexOf(name); return i===-1?"":(row[i]||"").replace(/^"|"$/g,"").trim(); }
  const imported=[], errors=[];
  for (let i=1;i<lines.length;i++){
    const row=[]; let cur="",inQ=false;
    for(const ch of lines[i]+","){
      if(ch==='"'){inQ=!inQ;}else if(ch===','&&!inQ){row.push(cur);cur="";}else cur+=ch;
    }
    const name=col(row,"name"), price=parseFloat(col(row,"price"));
    if(!name||isNaN(price)){errors.push(`Row ${i+1}: skipped`);continue;}
    const category=col(row,"category")||"Beer";
    imported.push({ id:Date.now()+i, name, category:["Beer","Wine"].includes(category)?category:"Beer",
      packSize:col(row,"pack_size")||"Single", containerType:col(row,"container")||"Bottle",
      wineType:col(row,"wine_type")||"Other", price, deposit:parseFloat(col(row,"deposit"))||0,
      location:col(row,"location")||"", outOfStock:col(row,"out_of_stock").toLowerCase()==="yes" });
  }
  return { items:imported, errors };
}

const lbl = T => ({ display:"block", fontSize:12, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:T.subText, marginBottom:7, marginTop:16 });
const inp = T => ({ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:10, padding:"11px 14px", color:T.text, fontSize:16, fontFamily:"inherit", boxSizing:"border-box" });

// ── swipe row ────────────────────────────────────────────────────────────────
function SwipeRow({ onSwipeLeft, children }) {
  const startX=useRef(null);
  const [offset,setOffset]=useState(0);
  const T=72;
  return (
    <div style={{ position:"relative", overflow:"hidden", borderRadius:12, marginBottom:10 }}>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:T, background:"#f0c040", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"0 12px 12px 0" }}>
        <span style={{ fontSize:20 }}>✏️</span>
      </div>
      <div style={{ transform:`translateX(${offset}px)`, transition:offset===0?"transform 0.2s":"none" }}
        onTouchStart={e=>{startX.current=e.touches[0].clientX;}}
        onTouchMove={e=>{ if(startX.current===null)return; const dx=e.touches[0].clientX-startX.current; if(dx<0)setOffset(Math.max(dx,-T)); }}
        onTouchEnd={()=>{ if(offset<=-T){setOffset(0);onSwipeLeft();}else setOffset(0); startX.current=null; }}
      >{children}</div>
    </div>
  );
}

// ── comet hook ───────────────────────────────────────────────────────────────
function useCometCanvas(btnRef, canvasRef, active) {
  useEffect(() => {
    const btn=btnRef.current, canvas=canvasRef.current;
    if(!btn||!canvas) return;
    const PAD=4,R=9,bw=btn.offsetWidth,bh=btn.offsetHeight;
    canvas.width=bw+PAD*2; canvas.height=bh+PAD*2;
    const pts=[], STEPS=300;
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
      const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,canvas.width,canvas.height);
      if(active.current){ t=(t+0.004)%1; const head=Math.floor(t*N);
        for(let i=0;i<tailLen;i++){const frac=1-i/tailLen;const[px,py]=pts[(head-i+N)%N];const[r,g,b]=lerp(1-frac);
          ctx.beginPath();ctx.arc(px,py,0.5+frac*1.2,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${Math.pow(frac,1.5)})`;ctx.fill();}}
      raf=requestAnimationFrame(draw);
    }
    draw(); return ()=>cancelAnimationFrame(raf);
  },[]);
}

// ── combined comet buttons ───────────────────────────────────────────────────
function CombinedCometButtons({ showCancel, onAdd, onCancel, accent, accentText, cancelBg, cancelText, cancelBorder }) {
  const addBtnRef=useRef(null),addCanvasRef=useRef(null);
  const canBtnRef=useRef(null),canCanvasRef=useRef(null);
  const addActive=useRef(!showCancel), canActive=useRef(showCancel);
  useEffect(()=>{ addActive.current=!showCancel; canActive.current=showCancel; },[showCancel]);
  useCometCanvas(addBtnRef,addCanvasRef,addActive);
  useCometCanvas(canBtnRef,canCanvasRef,canActive);
  return (
    <div style={{ display:"inline-flex", alignItems:"stretch", position:"relative" }}>
      <div style={{ maxWidth:showCancel?120:0, overflow:"hidden", transition:"max-width 0.35s cubic-bezier(0.34,1.1,0.64,1)", position:"relative" }}>
        <div style={{ position:"relative", display:"inline-flex" }}>
          <canvas ref={canCanvasRef} style={{ position:"absolute", top:-4, left:-4, pointerEvents:"none", zIndex:3 }}/>
          <button ref={canBtnRef} onClick={onCancel} style={{ whiteSpace:"nowrap", background:cancelBg, color:cancelText, border:`1px solid ${cancelBorder}`, borderRight:"none", borderRadius:"8px 0 0 8px", padding:"8px 12px", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"block" }}>✕ Cancel</button>
        </div>
      </div>
      <div style={{ position:"relative", display:"inline-flex" }}>
        <canvas ref={addCanvasRef} style={{ position:"absolute", top:-4, left:-4, pointerEvents:"none", zIndex:3 }}/>
        <button ref={addBtnRef} onClick={onAdd} style={{ background:accent, color:accentText, border:"none", borderRadius:showCancel?"0 8px 8px 0":"8px", transition:"border-radius 0.35s", padding:"8px 14px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>+ Add</button>
      </div>
    </div>
  );
}

// ── item card ────────────────────────────────────────────────────────────────
function ItemCard({ item, T, isWine, onEdit, onDelete, onToggleStock }) {
  const [expanded,setExpanded]=useState(false);
  const total=item.price+(item.deposit||0), oos=item.outOfStock;
  return (
    <div style={{ background:T.cardBg, border:`1px solid ${oos?"#e74c3c55":T.cardBorder}`, borderRadius:12, padding:14, cursor:"pointer", position:"relative", overflow:"hidden" }} onClick={()=>setExpanded(e=>!e)}>
      {oos&&<div style={{ position:"absolute", top:0,left:0,right:0,bottom:0, background:T.oosOverlay, zIndex:1, borderRadius:12, pointerEvents:"none" }}/>}
      {oos&&<div style={{ position:"absolute", top:6,right:8, fontSize:10, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", color:"#e74c3c", zIndex:2 }}>Out of Stock</div>}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"relative", zIndex:2 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:600, marginBottom:6, color:oos?T.subText:T.text, textDecoration:oos?"line-through":"none" }}>{item.name}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {isWine&&item.wineType&&<span style={{ background:T.badgeBg, border:`1px solid ${T.badgeBorder}`, borderRadius:6, padding:"2px 8px", fontSize:11, color:T.badgeText }}>🍷 {item.wineType}</span>}
            {!isWine&&<span style={{ background:T.badgeBg, border:`1px solid ${T.badgeBorder}`, borderRadius:6, padding:"2px 8px", fontSize:11, color:T.badgeText }}>{item.packSize}</span>}
            {!isWine&&<span style={{ background:T.badgeBg, border:`1px solid ${T.badgeBorder}`, borderRadius:6, padding:"2px 8px", fontSize:11, color:T.badgeText }}>{item.containerType==="Can"?"🥫":"🍶"} {item.containerType}</span>}
          </div>
        </div>
        <div style={{ textAlign:"right", paddingLeft:12, position:"relative", zIndex:2 }}>
          <div style={{ fontSize:20, fontWeight:700, color:oos?T.subText:T.accent }}>${item.price.toFixed(2)}</div>
          {item.deposit>0&&<div style={{ fontSize:11, color:T.badgeText, marginTop:2 }}>+${item.deposit.toFixed(2)} dep.</div>}
        </div>
      </div>
      {expanded&&(
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${T.cardBorder}`, position:"relative", zIndex:2 }} onClick={e=>e.stopPropagation()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{ color:T.subText, fontSize:13 }}>{!isWine&&item.deposit>0?"Total w/ deposit:":"Total:"}</span>
            <span style={{ fontWeight:700, color:T.accent, fontSize:16 }}>${total.toFixed(2)}</span>
          </div>
          {item.location&&<div style={{ fontSize:12, color:T.badgeText, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}><span>📍</span><span>{item.location}</span></div>}
          <button onClick={onToggleStock} style={{ width:"100%", marginBottom:8, padding:"9px", background:oos?"#2e1a1a":T.badgeBg, border:`1px solid ${oos?"#5a2a2a":T.badgeBorder}`, borderRadius:8, color:oos?"#e07070":T.badgeText, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {oos?"✅ Mark In Stock":"🚫 Mark Out of Stock"}
          </button>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onEdit} style={{ flex:1, background:T.badgeBg, border:`1px solid ${T.badgeBorder}`, borderRadius:8, padding:"9px", color:T.badgeText, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>✏️ Edit</button>
            <button onClick={onDelete} style={{ flex:1, background:"#2e1a1a", border:"1px solid #5a2a2a", borderRadius:8, padding:"9px", color:"#e07070", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>🗑️ Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [items,setItems]                       = useState([]);
  const [loading,setLoading]                   = useState(true);
  const [syncing,setSyncing]                   = useState(false);
  const [activeCategory,setActiveCategory]     = useState("Beer");
  const [view,setView]                         = useState("list");
  const [form,setForm]                         = useState({...emptyBeerForm});
  const [editId,setEditId]                     = useState(null);
  const [search,setSearch]                     = useState("");
  const [filterPack,setFilterPack]             = useState("All");
  const [filterContainer,setFilterContainer]   = useState("All");
  const [sortBy,setSortBy]                     = useState("name");
  const [toast,setToast]                       = useState(null);
  const [confirmDelete,setConfirmDelete]       = useState(null);
  const [themeMode,setThemeMode]               = useState(loadTheme);
  const [isManager,setIsManager]               = useState(loadAuth);
  const [showPinModal,setShowPinModal]         = useState(false);
  const [pinInput,setPinInput]                 = useState("");
  const [pinError,setPinError]                 = useState(false);
  const [pendingAction,setPendingAction]       = useState(null);
  const [showExportMenu,setShowExportMenu]     = useState(false);
  const [importPreview,setImportPreview]       = useState(null);
  const [showDataModal,setShowDataModal]       = useState(false);
  const [showPasteModal,setShowPasteModal]     = useState(false);
  const [pasteText,setPasteText]               = useState("");
  const fileInputRef = useRef(null);

  const themes = buildThemes(themeMode);
  const T = activeCategory==="Wine"?themes.wine:themes.beer;
  const isWine = activeCategory==="Wine";
  const isDark = themeMode==="dark";

  // ── load all items from Supabase on mount ──
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      const { data, error } = await supabase.from("items").select("*").order("name");
      if (!error && data) setItems(data.map(fromDB));
      setLoading(false);
    }
    fetchItems();

    // ── real-time subscription ──
    const channel = supabase
      .channel("items-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, payload => {
        if (payload.eventType === "INSERT") {
          setItems(prev => [...prev, fromDB(payload.new)]);
        } else if (payload.eventType === "UPDATE") {
          setItems(prev => prev.map(i => i.id === payload.new.id ? fromDB(payload.new) : i));
        } else if (payload.eventType === "DELETE") {
          setItems(prev => prev.filter(i => i.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(()=>{ saveTheme(themeMode); },[themeMode]);

  function showToast(msg, type="success") { setToast({msg,type}); setTimeout(()=>setToast(null),2500); }

  function requireManager(action) {
    if (isManager) { action(); return; }
    setPendingAction(()=>action);
    setPinInput(""); setPinError(false);
    setShowPinModal(true);
  }

  function submitPin() {
    if (pinInput === MANAGER_PIN) {
      setIsManager(true); saveAuth(true);
      setShowPinModal(false);
      if (pendingAction) { pendingAction(); setPendingAction(null); }
    } else {
      setPinError(true); setPinInput("");
    }
  }

  function logout() { setIsManager(false); saveAuth(false); showToast("Logged out"); }

  function switchCategory(cat) {
    setActiveCategory(cat); setView("list");
    setSearch(""); setFilterPack("All"); setFilterContainer("All"); setSortBy("name");
  }

  function openAdd() { requireManager(()=>{ setForm(isWine?{...emptyWineForm}:{...emptyBeerForm}); setEditId(null); setView("add"); }); }

  function openEdit(item) {
    requireManager(()=>{
      setForm({ name:item.name, packSize:item.packSize||"Single", containerType:item.containerType||"Bottle",
        price:String(item.price), deposit:item.deposit?String(item.deposit):"",
        location:item.location||"", wineType:item.wineType||"Other", outOfStock:item.outOfStock||false });
      setEditId(item.id); setView("edit");
    });
  }

  async function handleSave() {
    if (!form.name.trim()) { showToast("Name is required","error"); return; }
    const price=parseFloat(form.price);
    if (isNaN(price)||price<0) { showToast("Enter a valid price","error"); return; }
    const deposit = isWine?0:(form.deposit!==""?parseFloat(form.deposit):0);
    const fields = { name:form.name.trim(), category:activeCategory, packSize:form.packSize,
      containerType:form.containerType, price, deposit, location:form.location.trim(),
      wineType:form.wineType, outOfStock:form.outOfStock };

    setSyncing(true);
    if (view==="edit") {
      const { error } = await supabase.from("items").update(toDB({...fields,id:editId})).eq("id",editId);
      if (error) { showToast("Save failed","error"); } else { showToast("Updated!"); }
    } else {
      const newItem = { ...fields, id: Date.now() };
      const { error } = await supabase.from("items").insert(toDB(newItem));
      if (error) { showToast("Save failed","error"); } else { showToast(`${isWine?"Wine":"Beer"} added!`); }
    }
    setSyncing(false);
    setView("list");
  }

  async function handleDelete(id) {
    setSyncing(true);
    const { error } = await supabase.from("items").delete().eq("id",id);
    if (error) showToast("Delete failed","error"); else showToast("Removed","error");
    setSyncing(false);
    setConfirmDelete(null); setView("list");
  }

  async function toggleOutOfStock(id) {
    requireManager(async ()=>{
      const item = items.find(i=>i.id===id);
      if (!item) return;
      const updated = { ...item, outOfStock: !item.outOfStock };
      const { error } = await supabase.from("items").update(toDB(updated)).eq("id",id);
      if (error) showToast("Update failed","error");
    });
  }

  async function bulkInsert(newItems) {
    setSyncing(true);
    const rows = newItems.map(i=>toDB({...i,id:Date.now()+Math.random()}));
    const { error } = await supabase.from("items").insert(rows);
    if (error) showToast("Import failed","error");
    else { showToast(`Imported ${newItems.length} items!`); }
    setSyncing(false);
  }

  async function replaceAll(newItems) {
    setSyncing(true);
    await supabase.from("items").delete().neq("id",0);
    const rows = newItems.map((i,idx)=>toDB({...i,id:Date.now()+idx}));
    const { error } = await supabase.from("items").insert(rows);
    if (error) showToast("Import failed","error");
    else showToast(`Imported ${newItems.length} items!`);
    setSyncing(false);
  }

  function confirmImport(mode) {
    const incoming = importPreview.items;
    if (mode==="replace") replaceAll(incoming);
    else bulkInsert(incoming);
    setImportPreview(null);
  }

  async function confirmPasteImport() {
    try {
      const parsed = JSON.parse(pasteText.trim());
      if (!Array.isArray(parsed)) throw new Error();
      await replaceAll(parsed.map(b=>({outOfStock:false,location:"",wineType:"Other",...b,category:b.category||"Beer"})));
      setShowPasteModal(false); setPasteText("");
    } catch { showToast("Invalid data","error"); }
  }

  function downloadExport(subset, filename) {
    const csv=buildCSV(subset);
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download=filename; a.click();
    URL.revokeObjectURL(url); setShowExportMenu(false); showToast("Download started!");
  }

  function handleImportFile(e) {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{ setImportPreview(parseCSV(ev.target.result)); };
    reader.readAsText(file); e.target.value=""; setShowExportMenu(false);
  }

  const filtered = items
    .filter(b=>b.category===activeCategory)
    .filter(b=>b.name.toLowerCase().includes(search.toLowerCase()))
    .filter(b=>!isWine&&filterPack!=="All"?b.packSize===filterPack:true)
    .filter(b=>!isWine&&filterContainer!=="All"?b.containerType===filterContainer:true)
    .sort((a,b)=>{
      if(isWine&&sortBy==="type"){const ta=WINE_TYPES.indexOf(a.wineType||"Other"),tb=WINE_TYPES.indexOf(b.wineType||"Other");return ta!==tb?ta-tb:a.name.localeCompare(b.name);}
      if(sortBy==="name") return a.name.localeCompare(b.name);
      if(sortBy==="price_desc") return b.price-a.price;
      return a.price-b.price;
    });

  const beerGroups  = PACK_SIZES.filter(p=>filtered.some(b=>b.packSize===p));
  const wineGroups  = sortBy==="type"?WINE_TYPES.filter(t=>filtered.some(b=>(b.wineType||"Other")===t)):null;
  const countInCat  = items.filter(b=>b.category===activeCategory).length;

  return (
    <div style={{ minHeight:"100vh", background:T.appBg, color:T.text, fontFamily:"'Georgia','Times New Roman',serif", maxWidth:480, margin:"0 auto", position:"relative", transition:"background 0.3s" }}>

      {/* ── HEADER ── */}
      <div style={{ background:T.headerBg, borderBottom:`1px solid ${T.headerBorder}`, padding:"14px 14px 0", position:"sticky", top:0, zIndex:100, transition:"background 0.3s" }}>

        {/* top row */}
        <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
          <div style={{ flex:1, display:"flex", borderRadius:10, overflow:"hidden", border:`1px solid ${T.headerBorder}` }}>
            {["Beer","Wine"].map(cat=>(
              <button key={cat} onClick={()=>switchCategory(cat)} style={{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:700, fontSize:15, transition:"background 0.3s,color 0.3s", background:activeCategory===cat?T.accent:"transparent", color:activeCategory===cat?T.accentText:T.subText }}>
                {cat==="Beer"?"🍺 Beer":"🍷 Wine"}
              </button>
            ))}
          </div>

          {/* sync indicator */}
          {syncing&&<div style={{ fontSize:11, color:T.subText, whiteSpace:"nowrap" }}>⏳ Syncing…</div>}

          {/* manager lock/unlock */}
          <button onClick={()=>isManager?logout():requireManager(()=>{})} style={{ background:T.cardBg, border:`1px solid ${T.cardBorder}`, borderRadius:8, width:38, height:38, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }} title={isManager?"Log out (manager)":"Manager login"}>
            {isManager?"🔓":"🔒"}
          </button>

          {/* theme */}
          <button onClick={()=>setThemeMode(m=>m==="dark"?"light":"dark")} style={{ background:T.cardBg, border:`1px solid ${T.cardBorder}`, borderRadius:8, width:38, height:38, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {isDark?"☀️":"🌙"}
          </button>

          {/* import/export */}
          <div style={{ position:"relative" }}>
            <button onClick={()=>setShowExportMenu(v=>!v)} style={{ background:T.cardBg, border:`1px solid ${T.cardBorder}`, borderRadius:8, width:38, height:38, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>⇅</button>
            {showExportMenu&&(
              <div style={{ position:"absolute", right:0, top:44, background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:12, padding:6, zIndex:300, minWidth:215, boxShadow:"0 6px 24px rgba(0,0,0,0.35)" }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.subText, padding:"6px 12px 4px" }}>Export</div>
                <button onClick={()=>downloadExport(items.filter(b=>b.category===activeCategory),`${activeCategory.toLowerCase()}-pricing.csv`)} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 12px", background:"none", border:"none", color:T.text, fontSize:14, fontFamily:"inherit", cursor:"pointer", borderRadius:8 }}>
                  <span>📥</span> Download {isWine?"Wines":"Beers"} CSV
                </button>
                <button onClick={()=>downloadExport(items,"all-pricing.csv")} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 12px", background:"none", border:"none", color:T.text, fontSize:14, fontFamily:"inherit", cursor:"pointer", borderRadius:8 }}>
                  <span>📥</span> Download All CSV
                </button>
                <div style={{ height:1, background:T.cardBorder, margin:"6px 0" }}/>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.subText, padding:"4px 12px" }}>Import</div>
                <button onClick={()=>fileInputRef.current?.click()} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 12px", background:"none", border:"none", color:T.text, fontSize:14, fontFamily:"inherit", cursor:"pointer", borderRadius:8 }}>
                  <span>📂</span> Import from CSV
                </button>
                <button onClick={()=>{setShowPasteModal(true);setShowExportMenu(false);}} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 12px", background:"none", border:"none", color:T.text, fontSize:14, fontFamily:"inherit", cursor:"pointer", borderRadius:8 }}>
                  <span>📋</span> Paste Data (from backup)
                </button>
                <div style={{ height:1, background:T.cardBorder, margin:"6px 0" }}/>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.subText, padding:"4px 12px" }}>Backup</div>
                <button onClick={()=>{setShowDataModal(true);setShowExportMenu(false);}} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 12px", background:"none", border:"none", color:T.text, fontSize:14, fontFamily:"inherit", cursor:"pointer", borderRadius:8 }}>
                  <span>📤</span> Show my data (copy to transfer)
                </button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" style={{ display:"none" }} onChange={handleImportFile}/>
          </div>
        </div>

        {/* title + buttons */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <span style={{ fontSize:24 }}>{isWine?"🍷":"🍺"}</span>
          <div>
            <div style={{ fontSize:19, fontWeight:700, color:T.accent }}>{isWine?"Wine Pricing":"Beer Pricing"}</div>
            <div style={{ fontSize:11, color:T.subText, letterSpacing:"0.05em", textTransform:"uppercase" }}>{countInCat} item{countInCat!==1?"s":""} · live</div>
          </div>
          <CombinedCometButtons showCancel={view!=="list"} onAdd={openAdd} onCancel={()=>setView("list")}
            accent={T.accent} accentText={T.accentText} cancelBg={T.cardBg} cancelText={T.subText} cancelBorder={T.inputBorder}/>
        </div>

        {/* search + filters */}
        {view==="list"&&(
          <div style={{ paddingBottom:12 }}>
            <input style={{ width:"100%", background:T.searchBg, border:`1px solid ${T.inputBorder}`, borderRadius:10, padding:"10px 14px", color:T.text, fontSize:14, fontFamily:"inherit", boxSizing:"border-box", marginBottom:8 }}
              placeholder={`🔍  Search ${isWine?"wines":"beers"}...`} value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{ display:"flex", gap:6 }}>
              {!isWine&&<>
                <select value={filterPack} onChange={e=>setFilterPack(e.target.value)} style={{ flex:1, background:T.selectBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 4px", color:T.subText, fontSize:12, fontFamily:"inherit" }}>
                  <option value="All">All Sizes</option>{PACK_SIZES.map(p=><option key={p} value={p}>{p}</option>)}
                </select>
                <select value={filterContainer} onChange={e=>setFilterContainer(e.target.value)} style={{ flex:1, background:T.selectBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 4px", color:T.subText, fontSize:12, fontFamily:"inherit" }}>
                  <option value="All">Can & Bottle</option>{CONTAINER_TYPES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </>}
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ flex:1, background:T.selectBg, border:`1px solid ${T.inputBorder}`, borderRadius:8, padding:"7px 4px", color:T.subText, fontSize:12, fontFamily:"inherit" }}>
                <option value="name">A–Z</option>
                {isWine&&<option value="type">By Type</option>}
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ── TOAST ── */}
      {toast&&<div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", padding:"12px 24px", borderRadius:30, color:"#fff", fontWeight:600, fontSize:14, zIndex:999, boxShadow:"0 4px 20px rgba(0,0,0,0.5)", fontFamily:"inherit", whiteSpace:"nowrap", background:toast.type==="error"?"#e74c3c":"#27ae60" }}>{toast.msg}</div>}

      {/* ── PIN MODAL ── */}
      {showPinModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:16, padding:28, width:"100%", maxWidth:300, textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔒</div>
            <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:6 }}>Manager Access</div>
            <div style={{ fontSize:13, color:T.subText, marginBottom:20 }}>Enter the manager PIN to continue</div>
            <input
              type="password" inputMode="numeric" maxLength={4}
              value={pinInput} onChange={e=>{setPinInput(e.target.value);setPinError(false);}}
              onKeyDown={e=>e.key==="Enter"&&submitPin()}
              placeholder="••••"
              autoFocus
              style={{ width:"100%", background:T.inputBg, border:`2px solid ${pinError?"#e74c3c":T.inputBorder}`, borderRadius:10, padding:"14px", color:T.text, fontSize:28, fontFamily:"inherit", boxSizing:"border-box", textAlign:"center", letterSpacing:"0.3em", marginBottom:8 }}
            />
            {pinError&&<div style={{ fontSize:12, color:"#e74c3c", marginBottom:12 }}>Incorrect PIN, try again</div>}
            {!pinError&&<div style={{ height:20, marginBottom:12 }}/>}
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>{setShowPinModal(false);setPendingAction(null);}} style={{ flex:1, padding:12, background:"transparent", border:`1px solid ${T.inputBorder}`, borderRadius:10, color:T.subText, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={submitPin} style={{ flex:2, padding:12, background:T.accent, border:"none", borderRadius:10, color:T.accentText, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {confirmDelete&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:16, padding:24, width:"100%", maxWidth:320 }}>
            <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:10 }}>Remove Item?</div>
            <div style={{ fontSize:14, color:T.subText, marginBottom:20 }}>"{confirmDelete.name}" will be deleted for everyone.</div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setConfirmDelete(null)} style={{ flex:1, background:"transparent", border:`1px solid ${T.inputBorder}`, borderRadius:10, padding:13, color:T.subText, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={()=>handleDelete(confirmDelete.id)} style={{ flex:2, background:"#e74c3c", border:"none", borderRadius:10, padding:13, color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMPORT PREVIEW ── */}
      {importPreview&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:16, padding:22, width:"100%", maxWidth:360, maxHeight:"80vh", overflowY:"auto" }}>
            <div style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:6 }}>📂 Import Preview</div>
            <div style={{ fontSize:13, color:T.subText, marginBottom:14 }}>Found <strong style={{color:T.accent}}>{importPreview.items.length}</strong> items.{importPreview.errors.length>0&&` ${importPreview.errors.length} skipped.`}</div>
            <div style={{ maxHeight:200, overflowY:"auto", marginBottom:14, borderRadius:8, border:`1px solid ${T.cardBorder}` }}>
              {importPreview.items.slice(0,30).map((item,i)=>(
                <div key={i} style={{ padding:"8px 12px", borderBottom:`1px solid ${T.cardBorder}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontSize:13, fontWeight:600, color:T.text }}>{item.name}</div><div style={{ fontSize:11, color:T.subText }}>{item.category}{item.category==="Wine"?` · ${item.wineType}`:` · ${item.packSize}`}</div></div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.accent }}>${item.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
              <button onClick={()=>confirmImport("merge")} style={{ padding:"11px", background:T.accent, border:"none", borderRadius:10, color:T.accentText, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>➕ Add to existing</button>
              <button onClick={()=>confirmImport("replace")} style={{ padding:"11px", background:"#2e1a1a", border:"1px solid #5a2a2a", borderRadius:10, color:"#e07070", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>🔄 Replace all data</button>
            </div>
            <button onClick={()=>setImportPreview(null)} style={{ width:"100%", padding:"10px", background:"transparent", border:`1px solid ${T.inputBorder}`, borderRadius:10, color:T.subText, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── SHOW DATA MODAL ── */}
      {showDataModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:16, padding:22, width:"100%", maxWidth:400, maxHeight:"80vh", display:"flex", flexDirection:"column" }}>
            <div style={{ fontSize:17, fontWeight:700, color:T.text, marginBottom:6 }}>📋 Your Data</div>
            <div style={{ fontSize:12, color:T.subText, marginBottom:12, lineHeight:1.5 }}>Long-press the text, select all, then copy. Paste into <strong style={{color:T.text}}>Paste Data</strong> on another device.</div>
            <textarea readOnly value={JSON.stringify(items,null,2)} style={{ flex:1, minHeight:200, background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:10, padding:12, color:T.text, fontSize:11, fontFamily:"monospace", resize:"none", lineHeight:1.5 }} onFocus={e=>e.target.select()}/>
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={()=>setShowDataModal(false)} style={{ flex:1, padding:12, background:"transparent", border:`1px solid ${T.inputBorder}`, borderRadius:10, color:T.subText, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
              <button onClick={()=>{ navigator.clipboard.writeText(JSON.stringify(items)).then(()=>showToast("Copied!")).catch(()=>showToast("Long-press the text to copy","error")); }} style={{ flex:2, padding:12, background:T.accent, border:"none", borderRadius:10, color:T.accentText, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Copy to Clipboard</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PASTE DATA MODAL ── */}
      {showPasteModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:16, padding:22, width:"100%", maxWidth:400, maxHeight:"80vh", display:"flex", flexDirection:"column" }}>
            <div style={{ fontSize:17, fontWeight:700, color:T.text, marginBottom:6 }}>📋 Paste Data</div>
            <div style={{ fontSize:12, color:T.subText, marginBottom:12, lineHeight:1.5 }}>Paste the JSON from <strong style={{color:T.text}}>Show my data</strong>. This replaces all current data.</div>
            <textarea value={pasteText} onChange={e=>setPasteText(e.target.value)} placeholder="Paste your data here..." style={{ flex:1, minHeight:200, background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:10, padding:12, color:T.text, fontSize:11, fontFamily:"monospace", resize:"none", lineHeight:1.5 }}/>
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={()=>{setShowPasteModal(false);setPasteText("");}} style={{ flex:1, padding:12, background:"transparent", border:`1px solid ${T.inputBorder}`, borderRadius:10, color:T.subText, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={confirmPasteImport} style={{ flex:2, padding:12, background:T.accent, border:"none", borderRadius:10, color:T.accentText, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Import Data</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view==="list"&&(
        <div style={{ padding:"14px 14px 80px" }} onClick={()=>setShowExportMenu(false)}>
          {loading&&<div style={{ textAlign:"center", color:T.subText, padding:"60px 20px", fontSize:15 }}>Loading…</div>}
          {!loading&&filtered.length===0&&<div style={{ textAlign:"center", color:T.subText, padding:"60px 20px", fontSize:15, lineHeight:2 }}>No {isWine?"wines":"beers"} yet.<br/><span style={{ fontSize:13, opacity:0.5 }}>Tap + Add to get started.</span></div>}

          {!isWine&&beerGroups.map(pack=>(
            <div key={pack}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.sectionColor, margin:"18px 0 8px", opacity:0.8 }}>{pack}</div>
              {filtered.filter(b=>b.packSize===pack).map(item=>(
                <SwipeRow key={item.id} onSwipeLeft={()=>openEdit(item)}>
                  <ItemCard item={item} T={T} isWine={false} onEdit={()=>openEdit(item)} onDelete={()=>requireManager(()=>setConfirmDelete({id:item.id,name:item.name}))} onToggleStock={()=>toggleOutOfStock(item.id)}/>
                </SwipeRow>
              ))}
            </div>
          ))}

          {isWine&&sortBy==="type"&&wineGroups&&wineGroups.map(type=>(
            <div key={type}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:T.sectionColor, margin:"18px 0 8px", opacity:0.8 }}>{type}</div>
              {filtered.filter(b=>(b.wineType||"Other")===type).map(item=>(
                <SwipeRow key={item.id} onSwipeLeft={()=>openEdit(item)}>
                  <ItemCard item={item} T={T} isWine={true} onEdit={()=>openEdit(item)} onDelete={()=>requireManager(()=>setConfirmDelete({id:item.id,name:item.name}))} onToggleStock={()=>toggleOutOfStock(item.id)}/>
                </SwipeRow>
              ))}
            </div>
          ))}
          {isWine&&sortBy!=="type"&&filtered.map(item=>(
            <SwipeRow key={item.id} onSwipeLeft={()=>openEdit(item)}>
              <ItemCard item={item} T={T} isWine={true} onEdit={()=>openEdit(item)} onDelete={()=>requireManager(()=>setConfirmDelete({id:item.id,name:item.name}))} onToggleStock={()=>toggleOutOfStock(item.id)}/>
            </SwipeRow>
          ))}
        </div>
      )}

      {/* ── ADD / EDIT FORM ── */}
      {(view==="add"||view==="edit")&&(
        <div style={{ padding:"14px 14px 80px" }}>
          <div style={{ background:T.formCardBg, border:`1px solid ${T.formCardBorder}`, borderRadius:14, padding:20 }}>
            <div style={{ fontSize:18, fontWeight:700, marginBottom:4, color:T.accent }}>{view==="edit"?`✏️  Edit ${isWine?"Wine":"Beer"}`:`➕  New ${isWine?"Wine":"Beer"}`}</div>
            <div style={{ fontSize:12, color:T.subText, marginBottom:16 }}>{isWine?"Wine section — no deposit":"Beer section"}</div>

            <label style={lbl(T)}>{isWine?"Wine":"Beer"} Name</label>
            <input style={inp(T)} placeholder={isWine?"e.g. Woodbridge Cabernet":"e.g. Bud Light"} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>

            {isWine&&<>
              <label style={lbl(T)}>Wine Type</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {WINE_TYPES.map(t=><button key={t} onClick={()=>setForm(f=>({...f,wineType:t}))} style={{ background:form.wineType===t?T.accent:T.inputBg, border:`1px solid ${form.wineType===t?T.accent:T.inputBorder}`, borderRadius:8, padding:"8px 12px", color:form.wineType===t?T.accentText:T.subText, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:form.wineType===t?700:400 }}>{t}</button>)}
              </div>
            </>}

            {!isWine&&<>
              <label style={lbl(T)}>Pack Size</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {PACK_SIZES.map(p=><button key={p} onClick={()=>setForm(f=>({...f,packSize:p}))} style={{ background:form.packSize===p?T.accent:T.inputBg, border:`1px solid ${form.packSize===p?T.accent:T.inputBorder}`, borderRadius:8, padding:"8px 12px", color:form.packSize===p?T.accentText:T.subText, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:form.packSize===p?700:400 }}>{p}</button>)}
              </div>
              <label style={lbl(T)}>Container</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {CONTAINER_TYPES.map(c=><button key={c} onClick={()=>setForm(f=>({...f,containerType:c}))} style={{ background:form.containerType===c?T.accent:T.inputBg, border:`1px solid ${form.containerType===c?T.accent:T.inputBorder}`, borderRadius:8, padding:"8px 12px", color:form.containerType===c?T.accentText:T.subText, fontSize:13, cursor:"pointer", fontFamily:"inherit", fontWeight:form.containerType===c?700:400 }}>{c==="Can"?"🥫 Can":"🍶 Bottle"}</button>)}
              </div>
            </>}

            <label style={lbl(T)}>Price ($)</label>
            <input style={inp(T)} type="number" min="0" step="0.01" placeholder="0.00" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>

            {!isWine&&<>
              <label style={lbl(T)}>Deposit Charge ($) <span style={{ opacity:0.5, fontWeight:400 }}>— optional</span></label>
              <input style={inp(T)} type="number" min="0" step="0.01" placeholder="0.00" value={form.deposit} onChange={e=>setForm(f=>({...f,deposit:e.target.value}))}/>
            </>}

            <label style={lbl(T)}>Location <span style={{ opacity:0.5, fontWeight:400 }}>— optional</span></label>
            <input style={inp(T)} placeholder="e.g. Back cooler, top shelf" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>

            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:20, padding:"12px 14px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:10 }}>
              <span style={{ fontSize:14, color:T.text }}>Mark as out of stock</span>
              <button onClick={()=>setForm(f=>({...f,outOfStock:!f.outOfStock}))} style={{ width:48, height:26, borderRadius:13, border:"none", cursor:"pointer", background:form.outOfStock?"#e74c3c":T.badgeBg, position:"relative", transition:"background 0.2s" }}>
                <div style={{ width:20, height:20, borderRadius:10, background:"#fff", position:"absolute", top:3, left:form.outOfStock?25:3, transition:"left 0.2s" }}/>
              </button>
            </div>

            <div style={{ marginTop:20 }}>
              <button onClick={handleSave} disabled={syncing} style={{ width:"100%", background:T.accent, border:"none", borderRadius:10, padding:13, color:T.accentText, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", opacity:syncing?0.7:1 }}>
                {syncing?"Saving…":view==="edit"?"Save Changes":`Add ${isWine?"Wine":"Beer"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
