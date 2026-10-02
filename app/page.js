"use client";
import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {formatMemoryNumber} from "../lib/memory-engine";
const SUPABASE_URL=""; // isolated until SUPERSONICOS Supabase is connected
const SUPABASE_KEY=""; // isolated until SUPERSONICOS Supabase is connected
const MASTER="/sonica_master.png";
export default function Home(){
 const viewerEl=useRef(null), viewer=useRef(null), previewUrl=useRef(null);
 const [intro,setIntro]=useState(true),[selected,setSelected]=useState(null),[open,setOpen]=useState(false),[zoom,setZoom]=useState(1),[faqOpen,setFaqOpen]=useState(null);
 const [file,setFile]=useState(null),[preview,setPreview]=useState(null),[name,setName]=useState(""),[year,setYear]=useState(""),[result,setResult]=useState(null),[error,setError]=useState(""),[saving,setSaving]=useState(false),[photoFocus,setPhotoFocus]=useState(null);
 const [memories,setMemories]=useState([]),[passport,setPassport]=useState(null),[checkout,setCheckout]=useState(false),[mobileMenu,setMobileMenu]=useState(false),[rulesAccepted,setRulesAccepted]=useState(false);
 const liveOverlays=useRef(new Map()),pendingSlug=useRef(null);
 useEffect(()=>{
  if(typeof window!=="undefined"){
   const match=window.location.pathname.match(/^\/memory\/([^/]+)\/?$/);
   if(match)pendingSlug.current=decodeURIComponent(match[1]);
  }
 },[]);
 useEffect(()=>{
  let cancelled=false;
  fetch(SUPABASE_URL+"/rest/v1/memories?select=memory_number,public_slug,participant_name,memory_year,position_x,position_y,image_path&publish_status=eq.published&order=memory_number.asc",{headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY}})
   .then(r=>r.ok?r.json():Promise.reject(new Error("Unable to load memories")))
   .then(rows=>{if(!cancelled)setMemories(rows.map(m=>({x:m.position_x,y:m.position_y,num:formatMemoryNumber(Number(m.memory_number)),name:m.participant_name,year:m.memory_year,photo:SUPABASE_URL+"/storage/v1/object/public/memories/"+m.image_path,slug:m.public_slug})))})
   .catch(()=>{});
  return()=>{cancelled=true};
 },[]);
 useEffect(()=>{
  if(!viewer.current||!memories.length)return;
  const v=viewer.current,item=v.world.getItemAt(0);
  if(!item)return;
  const size=item.getContentSize();
  memories.forEach(m=>{
   if(liveOverlays.current.has(m.slug))return;
   const el=document.createElement("button");
   el.className="memoryTile";el.type="button";el.dataset.memorySlug=m.slug;el.setAttribute("aria-label","Open memory "+m.num);
   const img=document.createElement("img");img.src=m.photo;img.alt="";el.appendChild(img);
   el.addEventListener("pointerdown",e=>e.stopPropagation());
   el.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();setIntro(false);setSelected(m)});
   const p=item.imageToViewportCoordinates(new window.OpenSeadragon.Point(size.x*m.x,size.y*m.y));
   v.addOverlay({element:el,location:p,placement:window.OpenSeadragon.Placement.CENTER,checkResize:false});
   liveOverlays.current.set(m.slug,el);
  });
  const sync=()=>{
   const z=v.viewport.getZoom(true);
   liveOverlays.current.forEach(el=>{
    el.classList.toggle("memoryTileVisible",z>=7);
    el.classList.toggle("memoryTileClose",z>=16);
   });
  };
  sync();v.addHandler("zoom",sync);
  return()=>v.removeHandler("zoom",sync);
 },[memories]);
 useEffect(()=>{
  let alive=true;
  (async()=>{
   const OSD=(await import("openseadragon")).default;
   window.OpenSeadragon=OSD;
   if(!alive||!viewerEl.current)return;
   const v=OSD({
    element:viewerEl.current,
    tileSources:{type:"image",url:MASTER,buildPyramid:true},
    showNavigationControl:false,showNavigator:false,
    animationTime:.55,blendTime:.12,
    zoomPerClick:1.35,zoomPerScroll:1.16,
    minZoomImageRatio:.78,maxZoomPixelRatio:64,
    visibilityRatio:.65,constrainDuringPan:true,homeFillsViewer:false,
    gestureSettingsMouse:{clickToZoom:false,dblClickToZoom:true,dragToPan:false,scrollToZoom:true},
    gestureSettingsTouch:{pinchToZoom:true,dragToPan:false}
   });
   viewer.current=v;
   v.addHandler("open",()=>{
    v.viewport.goHome(true);
    v.gestureSettingsMouse.dragToPan=false;
    v.gestureSettingsTouch.dragToPan=false;
    setZoom(v.viewport.getZoom(true));
   });
   v.addHandler("zoom",()=>setZoom(v.viewport.getZoom(true)));
  })();
  return()=>{alive=false;viewer.current?.destroy();viewer.current=null;if(previewUrl.current)URL.revokeObjectURL(previewUrl.current)};
 },[]);
 const dismissIntro=()=>{setIntro(false)};
 const zoomBy=f=>{setIntro(false);viewer.current?.viewport.zoomBy(f);viewer.current?.viewport.applyConstraints()};
 const home=()=>{viewer.current?.viewport.goHome();setSelected(null);setIntro(true);window.scrollTo({top:0,behavior:"smooth"})};
 const showAbout=()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth",block:"start"});
 const chooseFile=e=>{
  const input=e.target;
  const next=input.files&&input.files.length?input.files[0]:null;
  if(!next){setFile(null);setPreview("");setError("No photograph was selected.");return;}
  setFile(next);setResult(null);setError("");
  setPreview(URL.createObjectURL(next));
 };
 const validateMemory=async()=>{setError("");const y=Number(year);if(!file){setError("Choose a photograph first.");return}if(!name.trim()){setError("Add your name.");return}if(!Number.isInteger(y)||y<1900||y>new Date().getFullYear()){setError("Add the year of this memory.");return}setSaving(true);try{const form=new FormData();form.append("photo",file);const response=await fetch("/api/moderate",{method:"POST",body:form});const payload=await response.json();if(!response.ok)throw new Error(payload.error||"Unable to check this photograph.");if(payload.decision==="reject"){setError(payload.reason||"This photograph cannot be accepted under the Participation Rules.");return}if(payload.decision==="review"){setError(payload.reason||"This photograph needs review before it can be published.");return}setPhotoFocus(payload.focus||null);setCheckout(true);}catch(e){setError(e.message||"Unable to check this photograph. Please try again.");}finally{setSaving(false)}};
 const createMemory=async()=>{const y=Number(year);setError("");setSaving(true);try{const form=new FormData();form.append("photo",file);form.append("name",name.trim());form.append("year",String(y));const response=await fetch(SUPABASE_URL+"/functions/v1/create-memory",{method:"POST",headers:{Authorization:"Bearer "+SUPABASE_KEY,apikey:SUPABASE_KEY},body:form});const payload=await response.json();if(!response.ok)throw new Error(payload.error||"Unable to create memory.");const m=payload.memory;const created={x:m.position_x,y:m.position_y,num:formatMemoryNumber(Number(m.memory_number)),name:m.participant_name,year:m.memory_year,photo:m.image_url,slug:m.public_slug,focus:photoFocus};setResult(created);setMemories(current=>[...current.filter(x=>x.slug!==created.slug),created]);setCheckout(false);}catch(e){setError(e.message||"Unable to create memory.");}finally{setSaving(false);}};
 const flyToMemory=m=>{
  if(!m||!viewer.current)return;
  const v=viewer.current,item=v.world.getItemAt(0);
  if(!item)return;
  const size=item.getContentSize();
  const point=item.imageToViewportCoordinates(new window.OpenSeadragon.Point(m.x*size.x,m.y*size.y));
  setOpen(false);setIntro(false);setSelected(null);
  v.viewport.panTo(point);
  v.viewport.zoomTo(Math.max(v.viewport.getZoom(),20),point);
  v.viewport.applyConstraints();
  window.setTimeout(()=>setSelected(m),650);
 };
 useEffect(()=>{
  if(!pendingSlug.current||!memories.length||!viewer.current)return;
  const target=memories.find(m=>m.slug===pendingSlug.current||String(Number(m.num))===pendingSlug.current||m.num===pendingSlug.current);
  if(!target)return;
  pendingSlug.current=null;
  window.setTimeout(()=>flyToMemory(target),350);
 },[memories]);
 const openMemoryUrl=m=>{
  if(typeof window!=="undefined")window.history.pushState({},"","/memory/"+m.slug);
  flyToMemory(m);
 };
 const showResult=()=>openMemoryUrl(result);
 const generatePassport=async m=>{
  const W=1080,H=1350,canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#f6f3ec";ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#101722";ctx.textBaseline="top";
  ctx.font='800 42px Inter, Arial, sans-serif';ctx.fillText("IBIZA",70,36);
  ctx.font='700 17px Inter, Arial, sans-serif';ctx.fillText("I  W A S  H E R E",70,80);
  ctx.font='600 13px Inter, Arial, sans-serif';ctx.fillStyle="#5e6266";ctx.fillText("SUPERSONICOS.IBIZASONICA.COM",70,111);
  const img=new Image();img.crossOrigin="anonymous";
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=m.photo});
  const imageY=150,imageH=560,scale=Math.max(W/img.width,imageH/img.height),sw=W/scale,sh=imageH/scale,focusX=m.focus?.x??.5,focusY=m.focus?.y??.5,sx=Math.max(0,Math.min(img.width-sw,img.width*focusX-sw/2)),sy=Math.max(0,Math.min(img.height-sh,img.height*focusY-sh/2));
  ctx.drawImage(img,sx,sy,sw,sh,0,imageY,W,imageH);
  ctx.fillStyle="#101722";
  ctx.font='700 26px Inter, Arial, sans-serif';ctx.fillText("20 YEARS. 20,000 MEMORIES.",70,745);
  ctx.font='500 22px Inter, Arial, sans-serif';ctx.fillStyle="#5e6266";ctx.fillText("ONE SOUND.",70,783);
  ctx.fillStyle="#101722";ctx.font='400 96px Inter, Arial, sans-serif';ctx.fillText("I AM",70,835);ctx.fillText("SUPERSONICO",70,925);
  ctx.font='500 38px Inter, Arial, sans-serif';ctx.fillText(m.name,70,1080);
  ctx.font='700 22px Inter, Arial, sans-serif';ctx.fillText("IBIZA · "+m.year,70,1135);
  ctx.strokeStyle="#c9c7c0";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(70,1195);ctx.lineTo(1010,1195);ctx.stroke();
  ctx.font='700 22px Inter, Arial, sans-serif';ctx.fillText("MEMORY",70,1235);
  ctx.textAlign="right";ctx.fillText("#"+m.num,1010,1235);ctx.textAlign="left";
  return await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",.94));
 };
 const sharePassport=async m=>{
  try{
   const blob=await generatePassport(m);if(!blob)throw new Error("Unable to generate passport");
   const file=new File([blob],"i-am-supersonico-memory-"+m.num+".jpg",{type:"image/jpeg"});
   if(navigator.canShare?.({files:[file]})&&navigator.share){const memoryUrl=window.location.origin+"/memory/"+m.slug;await navigator.share({files:[file],title:"WE ARE SUPERSONICOS · MEMORY #"+m.num,text:"I AM SUPERSONICO. · "+m.name+" · IBIZA · "+m.year+"\nMemory #"+m.num+" of 20,000 memories.\nFind my memory — and add yours:\n"+memoryUrl});return;}
   const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){setError("Unable to generate your Passport image.");}
 };
 const shareMemory=async m=>{
  const url=window.location.origin+"/memory/"+m.slug;
  const text="I AM SUPERSONICO. I'm Memory #"+m.num+" in WE ARE SUPERSONICOS.\n20 years. 20,000 memories. One sound.\nFind my memory — and add yours.\n"+url;
  const data={title:"WE ARE SUPERSONICOS · MEMORY #"+m.num,text};
  try{
   if(navigator.share){await navigator.share(data);return;}
   await navigator.clipboard.writeText(text);setSelected(s=>s?{...s,copied:true}:s);window.setTimeout(()=>setSelected(s=>s?{...s,copied:false}:s),1800);
  }catch(e){}
 };
 return <main className="app">
  <header className="topbar"><button className="brand brandLogo" onClick={home} aria-label="WE ARE SUPERSONICOS home"><strong>WE ARE</strong><span>SUPERSONICOS</span></button><div className="progress"><b>{memories.length.toLocaleString("en-US")}</b><span>/ 20,000 MEMORIES</span></div><nav><button onClick={home}>OVERVIEW</button><button onClick={showAbout}>ABOUT</button>{memories.length>0&&<button onClick={()=>openMemoryUrl(memories[memories.length-1])}>FIND MY MEMORY</button>}<button className="add" onClick={()=>setOpen(true)}>ADD YOUR MEMORY <b>→</b></button></nav>
   <div className="mobileNav"><button className="mobileMenuBtn" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Open menu">MENU</button><button className="add" onClick={()=>setOpen(true)}>ADD YOUR MEMORY <b>→</b></button></div>
   {mobileMenu&&<div className="mobileMenu"><button onClick={()=>{setMobileMenu(false);home()}}>OVERVIEW</button><button onClick={()=>{setMobileMenu(false);showAbout()}}>ABOUT</button>{memories.length>0&&<button onClick={()=>{setMobileMenu(false);openMemoryUrl(memories[memories.length-1])}}>FIND MY MEMORY</button>}</div>}</header>
  <section className="viewport osdViewport" onPointerDown={dismissIntro}>
   <div ref={viewerEl} className="deepViewer"/>
   <div className={"mosaicGuide "+(zoom>7?"visible":"")}/>
   <div className={"intro "+(!intro?"hidden":"")}><p>A COLLECTIVE MEMORY PROJECT</p><h1>20 YEARS.<br/>20,000 MEMORIES.<br/>ONE SOUND.</h1><h2>Every memory finds its place.</h2><div className="counter"><strong>{memories.length.toLocaleString("en-US")} / 20,000</strong><span>{memories.length===0?<>The first memory<br/>is waiting.</>:<>Every memory<br/>finds its place.</>}</span><i/></div><button className="enter" onClick={()=>zoomBy(1.35)}>EXPLORE THE IMAGE ↓</button></div>
   <div className="zoom" onPointerDown={e=>e.stopPropagation()}><button onClick={()=>zoomBy(1.22)}>+</button><span>{zoom<10?Math.round(zoom*100)+"%":zoom.toFixed(1)+"×"}</span><button onClick={()=>zoomBy(1/1.22)}>−</button></div>
   {!intro&&<div className="hint"><span className="desktopHint">SCROLL TO ZOOM</span><span className="mobileHint">PINCH TO ZOOM</span></div>}
   {selected&&<div className="memoryCard testMemoryCard"><button className="memoryClose" onClick={()=>setSelected(null)}>×</button><img className="memoryPreview" src={selected.photo} alt="Memory" style={{objectPosition:selected.focus?`${selected.focus.x*100}% ${selected.focus.y*100}%`:"50% 50%"}}/>{<div className="memoryActions memoryActionsBand"><button onClick={()=>setPassport(selected)}>PASSPORT</button><button onClick={()=>shareMemory(selected)}>SHARE</button></div>}<div className="memoryContent"><small>WE ARE SUPERSONICOS</small><h3>{selected.name}</h3><p>IBIZA · {selected.year}</p><b>MEMORY #{selected.num}</b></div></div>}
  </section>
  <section className="about" id="about">
   <div className="aboutEyebrow">ABOUT THE ARTWORK</div>
   <div className="aboutHero"><div><h2>WE ARE<br/>SUPERSONICOS.</h2><span className="aboutLine">IBIZA SONICA · 20 YEARS</span></div><p>Twenty years of Ibiza Sonica, told through the people who listened, danced, broadcast, travelled and shared the sound with us. 20,000 real memories becoming one collective image.</p></div>
   <div className="aboutGrid">
    <article><span>01</span><h3>CHOOSE A MEMORY.</h3><p>One photograph from a moment that connects you to Ibiza Sonica. A broadcast, a party, a journey, a song, a place or simply a moment you still remember.</p></article>
    <article><span>02</span><h3>FIND YOUR PLACE.</h3><p>For €1, your photograph receives one equal position in the artwork. Every SUPERSONICO has the same space. No premium positions. No hierarchy.</p></article>
    <article><span>03</span><h3>BECOME PART OF THE IMAGE.</h3><p>Step back and you see one image of Ibiza Sonica. Move closer and it opens into the people, years and moments that made twenty years of sound.</p></article>
    <article><span>04</span><h3>COMPLETE THE ARTWORK.</h3><p>Memory by memory, the image gives way to the community inside it. The artwork is complete when Memory #20,000 finds its place.</p></article>
   </div>
   <div className="aboutFinal"><p>A living archive of the people who made Ibiza Sonica part of their lives.</p><h2>20 YEARS.<br/>20,000 MEMORIES.<br/>ONE SOUND.</h2><button onClick={()=>setOpen(true)}>ADD YOUR MEMORY <b>→</b></button></div>
   <section className="participationRules" id="participation-rules">
    <div className="rulesHead"><span>BEFORE YOU TAKE PART</span><h2>PARTICIPATION<br/>RULES.</h2><p>WE ARE SUPERSONICOS is built from real memories shared by real people. These rules protect the artwork and everyone who becomes part of it.</p></div>
    <div className="rulesGrid">
     <article><span>01</span><h3>YOUR PHOTO.</h3><p>You must own the photograph or have the right to share it.</p></article>
     <article><span>02</span><h3>PEOPLE IN YOUR PHOTO.</h3><p>You must have the necessary permission to publish identifiable people appearing in the photograph.</p></article>
     <article><span>03</span><h3>NO MINORS.</h3><p>Photographs containing identifiable minors are not accepted.</p></article>
     <article><span>04</span><h3>NO EXPLICIT SEXUAL CONTENT.</h3><p>Sexually explicit or pornographic material is not accepted. Swimwear, beach, pool and normal nightlife imagery are welcome.</p></article>
     <article><span>05</span><h3>NO GRAPHIC OR ABUSIVE CONTENT.</h3><p>Graphic violence, hateful, threatening or clearly abusive material is not accepted.</p></article>
     <article><span>06</span><h3>AUTOMATIC MODERATION.</h3><p>Images may be automatically checked before publication. Content may be rejected or held for review when necessary.</p></article>
     <article><span>07</span><h3>ONE REAL MEMORY.</h3><p>Submit a genuine photograph connected to your experience of Ibiza.</p></article>
    </div>
    <p className="rulesLegal">By participating, you agree to these rules and to the Terms of Participation and Privacy Policy.</p>
   </section>
   <div className="faq"><div className="faqHead"><span>QUESTIONS ABOUT THE ARTWORK</span><h2>FAQ.</h2></div>
   <div className={"faqItem "+(faqOpen===0?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===0?null:0)}><span>WHAT IS WE ARE SUPERSONICOS?</span><b>{faqOpen===0?"−":"+"}</b></button><div className="faqAnswer"><p>A collective digital artwork made from 20,000 real memories from the Ibiza Sonica community around the world. Each photograph becomes one equal part of a single image celebrating 20 years of Ibiza Sonica.</p></div></div><div className={"faqItem "+(faqOpen===1?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===1?null:1)}><span>WHAT KIND OF PHOTO CAN I ADD?</span><b>{faqOpen===1?"−":"+"}</b></button><div className="faqAnswer"><p>Any photograph connected to a real memory of Ibiza Sonica. It can come from Ibiza or anywhere the sound travelled with you, and it can be recent or decades old.</p></div></div><div className={"faqItem "+(faqOpen===2?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===2?null:2)}><span>DOES IT COST ANYTHING?</span><b>{faqOpen===2?"−":"+"}</b></button><div className="faqAnswer"><p>Yes. Adding one memory costs €1. One euro gives your photograph one equal place in the artwork. No premium positions, no larger spaces, no hierarchy.</p></div></div><div className={"faqItem "+(faqOpen===3?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===3?null:3)}><span>WHAT HAPPENS AFTER I ADD MY PHOTO?</span><b>{faqOpen===3?"−":"+"}</b></button><div className="faqAnswer"><p>Your memory receives its own number and position inside the artwork. You can return directly to it through its individual URL.</p></div></div><div className={"faqItem "+(faqOpen===4?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===4?null:4)}><span>WHAT IS THE PASSPORT?</span><b>{faqOpen===4?"−":"+"}</b></button><div className="faqAnswer"><p>Your Passport is the personal visual record of your participation: your photograph, name, year and unique Memory number. It is designed to be saved and shared.</p></div></div><div className={"faqItem "+(faqOpen===5?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===5?null:5)}><span>WHAT DOES SHARE DO?</span><b>{faqOpen===5?"−":"+"}</b></button><div className="faqAnswer"><p>SHARE creates a direct link to your memory inside the artwork, so other people can find your exact place — and add their own memory.</p></div></div><div className={"faqItem "+(faqOpen===6?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===6?null:6)}><span>HOW IS MY PLACE CHOSEN?</span><b>{faqOpen===6?"−":"+"}</b></button><div className="faqAnswer"><p>Every memory has an equal-sized position. The final system places photographs according to visual characteristics such as colour and light so that, together, they reconstruct the master image of Ibiza Sonica.</p></div></div><div className={"faqItem "+(faqOpen===7?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===7?null:7)}><span>WHAT HAPPENS WHEN IT REACHES 20,000?</span><b>{faqOpen===7?"−":"+"}</b></button><div className="faqAnswer"><p>The artwork is complete. The original image of Ibiza has been progressively replaced by 20,000 real memories from the Ibiza Sonica community — while remaining visible from a distance through those memories.</p></div></div>
   </div>
  </section>
  <footer className="siteFooter"><span>20,000 REAL MEMORIES · ONE EQUAL PLACE EACH.</span><nav className="legalNav"><a href="/terms">TERMS</a><a href="/privacy">PRIVACY</a><a href="/cookies">COOKIES</a><a href="/legal-notice">LEGAL</a><a href="/removal">REMOVAL</a></nav><button onClick={home}>FIT IMAGE</button></footer>
  {passport&&<div className="passportModal" onClick={()=>setPassport(null)}><div className="passport" onClick={e=>e.stopPropagation()}><button className="passportClose" onClick={()=>setPassport(null)}>×</button><div className="passportTop"><div className="passportBrand"><strong>WE ARE</strong><span>SUPERSONICOS</span><small>SUPERSONICOS.IBIZASONICA.COM</small></div></div><img src={passport.photo} alt="Ibiza memory"/><div className="passportBody"><div className="passportClaim"><strong>20 YEARS. 20,000 MEMORIES.</strong><span>ONE SOUND.</span></div><h2>I AM<br/>SUPERSONICO</h2><div className="passportIdentity"><p>{passport.name}</p><span>IBIZA · {passport.year}</span></div><div className="passportNumber"><span>MEMORY</span><b>#{passport.num}</b></div><button className="passportShare" onClick={()=>sharePassport(passport)}>SHARE PASSPORT <b>→</b></button></div></div></div>}
  {checkout&&!result&&createPortal(<div className="modal paymentModal" onClick={()=>setCheckout(false)}><div className="card paymentCard" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setCheckout(false)}>×</button><small>WE ARE SUPERSONICOS</small><h2>ONE PHOTO.<br/>ONE MEMORY.<br/>ONE PLACE.</h2><p className="lead">Your photograph becomes one equal part of the collective artwork.</p><div className="paymentSummary"><span>YOUR PLACE IN THE ARTWORK</span><strong>€1</strong></div><p className="paymentEquality">Every memory has exactly the same space. No premium positions. No hierarchy.</p><button className="continue" onClick={createMemory} disabled={saving}><span>{saving?"ADDING YOUR MEMORY…":"ADD MY MEMORY"}</span><span className="price">€1</span><b>→</b></button><em className="demoPayment">DEMO MODE · PAYMENT WILL BE CONNECTED AT LAUNCH</em></div></div>,document.body)}
  {open&&<div className="modal" onClick={()=>setOpen(false)}><div className="card" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(false)}>×</button>{!result?<><small>WE ARE SUPERSONICOS</small><h2>ADD YOUR<br/>MEMORY.</h2><p className="lead">Choose one photograph that holds a real memory of Ibiza.<br/>It will become one equal part of the collective image.</p><label className="photoUpload"><span className="fieldTitle">YOUR PHOTO</span><span className="uploadBox">{preview?<img src={preview} alt="Selected memory"/>:<span className="uploadPlus">+</span>}<span><strong>{file?file.name:"Choose a photograph"}</strong><small>{file?"Photograph selected · click to change":"JPG, PNG, WEBP or HEIC · Your original stays yours."}</small></span></span><input className="nativePhotoInput" type="file" accept="image/*,.heic,.heif" onChange={chooseFile}/></label><div className="row"><label><span className="fieldTitle">YOUR NAME</span><input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/></label><label><span className="fieldTitle">YEAR OF THIS MEMORY</span><input inputMode="numeric" placeholder="Your year" value={year} onChange={e=>setYear(e.target.value)}/></label></div>{error&&<p className="formError">{error}</p>}<label className="rulesConsent"><input type="checkbox" checked={rulesAccepted} onChange={e=>setRulesAccepted(e.target.checked)}/><span>I confirm that my photo follows the <a href="#participation-rules" onClick={()=>setOpen(false)}>Participation Rules</a>, that I have the right to share it and the necessary permissions for identifiable people shown in it. I agree to the <a href="/terms">Terms of Participation</a> and <a href="/privacy">Privacy Policy</a>.</span></label><div className="formNote"><b>ONE PHOTO. ONE MEMORY. ONE PLACE.</b><span>We only need these details to give your memory its place in the artwork.</span></div><button className="continue" onClick={validateMemory} disabled={!rulesAccepted||saving}><span>{saving?"CHECKING PHOTO…":"FIND MY PLACE"}</span><span className="price">€1</span><b>→</b></button></>:<div className="placementResult"><small>YOUR PLACE HAS BEEN FOUND</small><h2>YOU WERE<br/>SUPERSONICO</h2><img src={result.photo} alt="Your memory"/><p>Your memory has a place in the artwork.</p><strong>MEMORY #{result.num}</strong><span>{result.name} · IBIZA · {result.year}</span><button className="continue" onClick={showResult}><span>VIEW MY MEMORY</span><b>→</b></button></div>}</div></div>}
 </main>
}