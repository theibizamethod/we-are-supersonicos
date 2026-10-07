"use client";
import {useEffect,useRef,useState} from "react";
import {createPortal} from "react-dom";
import {formatMemoryNumber,prototypePlacement} from "../lib/memory-engine";
const SUPABASE_URL="https://yiflmsubkrlwhweenvca.supabase.co"; // SUPERSONICOS / ibiza-i-was-here
const SUPABASE_KEY="sb_publishable_dhZvmnCkAjySaNgKeQESng_pSjLhE91"; // publishable client key
const MASTER="/sonica_master.png";
export default function Home(){
 const viewerEl=useRef(null), viewer=useRef(null), previewUrl=useRef(null);
 const [intro,setIntro]=useState(true),[selected,setSelected]=useState(null),[open,setOpen]=useState(false),[zoom,setZoom]=useState(1),[faqOpen,setFaqOpen]=useState(null);
 const [file,setFile]=useState(null),[preview,setPreview]=useState(null),[name,setName]=useState(""),[year,setYear]=useState(""),[result,setResult]=useState(null),[error,setError]=useState(""),[saving,setSaving]=useState(false),[photoFocus,setPhotoFocus]=useState(null);
 const [memories,setMemories]=useState([]),[passport,setPassport]=useState(null),[checkout,setCheckout]=useState(false),[mobileMenu,setMobileMenu]=useState(false),[rulesAccepted,setRulesAccepted]=useState(false),[lang,setLang]=useState("en"),[mounted,setMounted]=useState(false),[findOpen,setFindOpen]=useState(false),[findNumber,setFindNumber]=useState(""),[findError,setFindError]=useState(""),[checkoutEmail,setCheckoutEmail]=useState(""),[paypalReady,setPaypalReady]=useState(false),[paypalError,setPaypalError]=useState("");
 const ES={
  "MEMORIES":"MEMORIAS","OVERVIEW":"INICIO","ABOUT":"ACERCA DE","FIND MY MEMORY":"ENCUENTRA MI MEMORIA","ADD YOUR MEMORY":"AÑADE TU MEMORIA","Participation Rules":"Normas de participación","Terms of Participation":"Términos de participación","Privacy Policy":"Política de privacidad",
  "A COLLECTIVE MEMORY PROJECT":"UN PROYECTO DE MEMORIA COLECTIVA","20 YEARS.":"20 AÑOS.","20,000 MEMORIES.":"20.000 MEMORIAS.","ONE SOUND.":"UN SONIDO.",
  "Every memory finds its place.":"Cada memoria encuentra su lugar.","The first memory":"La primera memoria","is waiting.":"está esperando.","Every memory":"Cada memoria","finds its place.":"encuentra su lugar.",
  "EXPLORE THE IMAGE ↓":"EXPLORA LA IMAGEN ↓","SCROLL TO ZOOM":"SCROLL PARA AMPLIAR","PINCH TO ZOOM":"PELLIZCA PARA AMPLIAR",
  "ABOUT THE ARTWORK":"SOBRE LA OBRA","IBIZA SONICA · 20 YEARS":"IBIZA SONICA · 20 AÑOS",
  "Twenty years of Ibiza Sonica, told through the people who listened, danced, broadcast, travelled and shared the sound with us. 20,000 real memories becoming one collective image.":"Veinte años de Ibiza Sonica contados a través de quienes escucharon, bailaron, emitieron, viajaron y compartieron el sonido con nosotros. 20.000 memorias reales convirtiéndose en una imagen colectiva.",
  "CHOOSE A MEMORY.":"ELIGE UNA MEMORIA.","FIND YOUR PLACE.":"ENCUENTRA TU LUGAR.","BECOME PART OF THE IMAGE.":"FORMA PARTE DE LA IMAGEN.","COMPLETE THE ARTWORK.":"COMPLETA LA OBRA.",
  "One photograph from a moment that connects you to Ibiza Sonica. A broadcast, a party, a journey, a song, a place or simply a moment you still remember.":"Una fotografía de un momento que te conecte con Ibiza Sonica. Una emisión, una fiesta, un viaje, una canción, un lugar o simplemente un momento que todavía recuerdes.",
  "For €1, your photograph receives one equal position in the artwork. Every SUPERSONICO has the same space. No premium positions. No hierarchy.":"Por 1 €, tu fotografía recibe un lugar igual en la obra. Cada SUPERSONICO tiene el mismo espacio. Sin posiciones premium. Sin jerarquías.",
  "Step back and you see one image of Ibiza Sonica. Move closer and it opens into the people, years and moments that made twenty years of sound.":"Aléjate y verás una imagen de Ibiza Sonica. Acércate y descubrirás las personas, los años y los momentos que construyeron veinte años de sonido.",
  "Memory by memory, the image gives way to the community inside it. The artwork is complete when Memory #20,000 finds its place.":"Memoria a memoria, la imagen da paso a la comunidad que contiene. La obra se completa cuando la Memoria #20.000 encuentra su lugar.",
  "A living archive of the people who made Ibiza Sonica part of their lives, wherever in the world they listened.":"Un archivo vivo de las personas que hicieron de Ibiza Sonica parte de sus vidas, desde cualquier lugar del mundo donde la escucharon.",
  "BEFORE YOU TAKE PART":"ANTES DE PARTICIPAR","PARTICIPATION":"NORMAS DE","RULES.":"PARTICIPACIÓN.","YOUR PHOTO.":"TU FOTO.","PEOPLE IN YOUR PHOTO.":"PERSONAS EN TU FOTO.","NO MINORS.":"SIN MENORES.","NO EXPLICIT SEXUAL CONTENT.":"SIN CONTENIDO SEXUAL EXPLÍCITO.","NO GRAPHIC OR ABUSIVE CONTENT.":"SIN CONTENIDO GRÁFICO O ABUSIVO.","AUTOMATIC MODERATION.":"MODERACIÓN AUTOMÁTICA.","ONE REAL MEMORY.":"UNA MEMORIA REAL.",
  "You must own the photograph or have the right to share it.":"Debes ser propietario de la fotografía o tener derecho a compartirla.",
  "You must have the necessary permission to publish identifiable people appearing in the photograph.":"Debes tener el permiso necesario para publicar a las personas identificables que aparezcan en la fotografía.",
  "Photographs containing identifiable minors are not accepted.":"No se aceptan fotografías con menores identificables.",
  "Sexually explicit or pornographic material is not accepted. Swimwear, beach, pool and normal nightlife imagery are welcome.":"No se acepta material sexualmente explícito o pornográfico. Sí se aceptan imágenes normales de baño, playa, piscina y vida nocturna.",
  "Graphic violence, hateful, threatening or clearly abusive material is not accepted.":"No se acepta violencia gráfica ni material de odio, amenazante o claramente abusivo.",
  "Images may be automatically checked before publication. Content may be rejected or held for review when necessary.":"Las imágenes pueden comprobarse automáticamente antes de publicarse. El contenido puede rechazarse o quedar pendiente de revisión cuando sea necesario.",
  "Submit a genuine photograph connected to your experience of Ibiza Sonica.":"Envía una fotografía real conectada con tu experiencia de Ibiza Sonica.",
  "QUESTIONS ABOUT THE ARTWORK":"PREGUNTAS SOBRE LA OBRA","WHAT IS WE ARE SUPERSONICOS?":"¿QUÉ ES WE ARE SUPERSONICOS?","WHAT KIND OF PHOTO CAN I ADD?":"¿QUÉ TIPO DE FOTO PUEDO AÑADIR?","DOES IT COST ANYTHING?":"¿CUÁNTO CUESTA?","WHAT HAPPENS AFTER I ADD MY PHOTO?":"¿QUÉ PASA DESPUÉS DE AÑADIR MI FOTO?","WHAT IS THE PASSPORT?":"¿QUÉ ES EL PASSPORT?","WHAT DOES SHARE DO?":"¿QUÉ HACE SHARE?","HOW IS MY PLACE CHOSEN?":"¿CÓMO SE ELIGE MI LUGAR?","WHAT HAPPENS WHEN IT REACHES 20,000?":"¿QUÉ PASA CUANDO LLEGAMOS A 20.000?",
  "20,000 REAL MEMORIES · ONE EQUAL PLACE EACH.":"20.000 MEMORIAS REALES · UN LUGAR IGUAL PARA CADA UNA.","TERMS":"TÉRMINOS","PRIVACY":"PRIVACIDAD","COOKIES":"COOKIES","LEGAL":"LEGAL","REMOVAL":"RETIRADA","FIT IMAGE":"AJUSTAR IMAGEN",
  "WE ARE SUPERSONICOS is built from real memories shared by real people. These rules protect the artwork and everyone who becomes part of it.":"WE ARE SUPERSONICOS se construye con memorias reales compartidas por personas reales. Estas normas protegen la obra y a todas las personas que forman parte de ella.",
  "By participating, you agree to these rules and to the Terms of Participation and Privacy Policy.":"Al participar, aceptas estas normas, los Términos de participación y la Política de privacidad.",
  "A collective digital artwork made from 20,000 real memories from the Ibiza Sonica community around the world. Each photograph becomes one equal part of a single image celebrating 20 years of Ibiza Sonica.":"Una obra digital colectiva formada por 20.000 memorias reales de la comunidad de Ibiza Sonica en todo el mundo. Cada fotografía se convierte en una parte igual de una única imagen que celebra 20 años de Ibiza Sonica.",
  "Any photograph connected to a real memory of Ibiza Sonica. It can come from Ibiza or anywhere the sound travelled with you, and it can be recent or decades old.":"Cualquier fotografía conectada con una memoria real de Ibiza Sonica. Puede ser de Ibiza o de cualquier lugar al que el sonido haya viajado contigo, y puede ser reciente o de hace décadas.",
  "Yes. Adding one memory costs €1. One euro gives your photograph one equal place in the artwork. No premium positions, no larger spaces, no hierarchy.":"Sí. Añadir una memoria cuesta 1 €. Un euro da a tu fotografía un lugar igual en la obra. Sin posiciones premium, sin espacios mayores, sin jerarquías.",
  "Your memory receives its own number and position inside the artwork. You can return directly to it through its individual URL.":"Tu memoria recibe su propio número y posición dentro de la obra. Puedes volver directamente a ella mediante su URL individual.",
  "Your Passport is the personal visual record of your participation: your photograph, name, year and unique Memory number. It is designed to be saved and shared.":"Tu Passport es el registro visual personal de tu participación: tu fotografía, nombre, año y número único de Memoria. Está diseñado para guardarse y compartirse.",
  "SHARE creates a direct link to your memory inside the artwork, so other people can find your exact place — and add their own memory.":"COMPARTIR crea un enlace directo a tu memoria dentro de la obra para que otras personas puedan encontrar tu lugar exacto y añadir su propia memoria.",
  "Every memory has an equal-sized position. The final system places photographs according to visual characteristics such as colour and light so that, together, they reconstruct the master image of Ibiza Sonica.":"Cada memoria ocupa un espacio del mismo tamaño. El sistema final coloca las fotografías según características visuales como el color y la luz para que, juntas, reconstruyan la imagen maestra de Ibiza Sonica.",
  "The artwork is complete. The Ibiza Sonica Master Image has been progressively replaced by 20,000 real memories from the Ibiza Sonica community — while remaining visible from a distance through those memories.":"La obra queda completa. La Imagen Maestra de Ibiza Sonica habrá sido sustituida progresivamente por 20.000 memorias reales de la comunidad de Ibiza Sonica, permaneciendo visible desde la distancia a través de esas memorias.",
  "I confirm that my photo follows the ":"Confirmo que mi foto cumple las ",
  ", that I have the right to share it and the necessary permissions for identifiable people shown in it. I agree to the ":", que tengo derecho a compartirla y los permisos necesarios de las personas identificables que aparecen en ella. Acepto los ",
  " and ":" y ",
  "No photograph was selected.":"No se ha seleccionado ninguna fotografía.",
  "Choose a photograph first.":"Elige primero una fotografía.",
  "Add your name.":"Añade tu nombre.",
  "Add the year of this memory.":"Añade el año de esta memoria.",
  "Unable to check this photograph.":"No se ha podido comprobar esta fotografía.",
  "This photograph cannot be accepted under the Participation Rules.":"Esta fotografía no puede aceptarse según las Normas de participación.",
  "This photograph needs review before it can be published.":"Esta fotografía necesita revisión antes de poder publicarse.",
  "Unable to check this photograph. Please try again.":"No se ha podido comprobar esta fotografía. Inténtalo de nuevo.",
  "CHECKING PHOTO…":"COMPROBANDO FOTO…",
  "ADDING YOUR MEMORY…":"AÑADIENDO TU MEMORIA…",
  "Your photograph becomes one equal part of the collective artwork.":"Tu fotografía se convierte en una parte igual de la obra colectiva.",
  "Every memory has exactly the same space. No premium positions. No hierarchy.":"Cada memoria tiene exactamente el mismo espacio. Sin posiciones premium. Sin jerarquías.",
  "DEMO MODE · PAYMENT WILL BE CONNECTED AT LAUNCH":"MODO DEMO · EL PAGO SE CONECTARÁ EN EL LANZAMIENTO",
  "Your memory has a place in the artwork.":"Tu memoria ya tiene un lugar en la obra.",
  "I AM":"SOY",
  "SUPERSONICO":"SUPERSONICO",
  "I AM SUPERSONICO":"SOY SUPERSONICO",
  "Open memory ":"Abrir memoria ",
  "Your memory":"Tu memoria",
  "Selected memory":"Memoria seleccionada",
  "WE ARE SUPERSONICOS":"WE ARE SUPERSONICOS",
  "I AM":"SOY",
  "SUPERSONICO":"SUPERSONICO",
  "Memory":"Memoria",
  "MEMORY":"MEMORIA","YOUR EMAIL":"TU EMAIL","We use it to send and recover your memory. It will never be public.":"Lo usamos para enviarte y recuperar tu memoria. Nunca será público.","Add a valid email.":"Añade un email válido.","Payment cancelled. Your memory has not been created.":"Pago cancelado. Tu memoria no se ha creado.","Unable to complete payment. Please try again.":"No se ha podido completar el pago. Inténtalo de nuevo.",
  "Your memory":"Tu memoria",
  "Selected memory":"Memoria seleccionada",
  "ONE PHOTO.":"UNA FOTO.",
  "ONE MEMORY.":"UNA MEMORIA.",
  "ONE PLACE.":"UN LUGAR.",
  "Every photograph holds a moment. A night, a journey, a song, a DJ booth, a sunrise or simply an instant you still remember.":"Cada foto guarda un momento. Una noche, un viaje, una canción, una cabina, un amanecer o simplemente un instante que todavía recuerdas.",
  "WE ARE SUPERSONICOS brings these memories together to build, collectively, an image of 20 years of Ibiza Sonica. We want every one of them to be real, personal and part of the story we have shared.":"WE ARE SUPERSONICOS reúne esas memorias para construir entre todos una imagen de 20 años de Ibiza Sonica. Queremos que cada una sea real, personal y forme parte de la historia que hemos compartido.",
  "So we only ask one simple thing: share a memory that is truly yours and respect the people who appear in it.":"Por eso solo te pedimos algo muy sencillo: comparte una memoria que sea realmente tuya y respeta a las personas que aparecen en ella.",
  "ADD YOUR":"AÑADE TU","MEMORY.":"MEMORIA.","Choose one photograph that holds a real memory of Ibiza Sonica.":"Elige una fotografía que guarde un recuerdo real de Ibiza Sonica.","It will become one equal part of the collective image.":"Se convertirá en una parte igual de la imagen colectiva.","Photograph selected · click to change":"Fotografía seleccionada · haz clic para cambiarla","JPG, PNG, WEBP or HEIC · Your original stays yours.":"JPG, PNG, WEBP o HEIC · Tu original sigue siendo tuyo.","We only need these details to give your memory its place in the artwork.":"Solo necesitamos estos datos para dar a tu memoria su lugar en la obra.","YOUR PHOTO":"TU FOTO","YOUR NAME":"TU NOMBRE","YEAR OF THIS MEMORY":"AÑO DE ESTA MEMORIA","Choose a photograph":"Elige una fotografía","Your name":"Tu nombre","Your year":"Tu año","FIND MY PLACE":"ENCUENTRA MI LUGAR","ONE PHOTO. ONE MEMORY. ONE PLACE.":"UNA FOTO. UNA MEMORIA. UN LUGAR.","YOUR PLACE HAS BEEN FOUND":"TU LUGAR HA SIDO ENCONTRADO","VIEW MY MEMORY":"VER MI MEMORIA","YOUR PLACE IN THE ARTWORK":"TU LUGAR EN LA OBRA","ADD MY MEMORY":"AÑADIR MI MEMORIA","PASSPORT":"PASSPORT","SHARE":"COMPARTIR","SHARE PASSPORT":"COMPARTIR PASSPORT","MEMORY":"MEMORIA","ENTER YOUR MEMORY NUMBER":"INTRODUCE EL NÚMERO DE TU MEMORIA","Memory number":"Número de memoria","FIND MEMORY":"BUSCAR MEMORIA","We could not find that memory.":"No hemos encontrado esa memoria."
 };
 const EN=Object.fromEntries(Object.entries(ES).map(([en,es])=>[es,en]));
 const t=s=>lang==="es"?(ES[s]||s):s;
 useEffect(()=>{
  if(typeof window==="undefined")return;
  const saved=localStorage.getItem("supersonicos-lang")||"en";
  setLang(saved);
  const sync=e=>{if(e.detail==="en"||e.detail==="es")setLang(e.detail)};
  window.addEventListener("supersonicos-language",sync);
  return()=>window.removeEventListener("supersonicos-language",sync);
 },[]);
 const setLanguage=next=>{
  setLang(next);
  if(typeof window!=="undefined"){
   localStorage.setItem("supersonicos-lang",next);
   window.dispatchEvent(new CustomEvent("supersonicos-language",{detail:next}));
  }
 };
 const liveOverlays=useRef(new Map()),pendingSlug=useRef(null),viewerReady=useRef(false);
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
   el.className="memoryTile";el.type="button";el.dataset.memorySlug=m.slug;el.setAttribute("aria-label",(lang==="es"?"Abrir memoria ":"Open memory ")+m.num);
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
    el.classList.toggle("memoryTileVisible",z>=1);
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
    mouseNavEnabled:true,
    animationTime:.55,blendTime:.12,
    zoomPerClick:1.35,zoomPerScroll:1.16,
    minZoomImageRatio:.78,maxZoomPixelRatio:64,
    visibilityRatio:.65,constrainDuringPan:true,homeFillsViewer:false,
    gestureSettingsMouse:{clickToZoom:false,dblClickToZoom:false,dragToPan:false,scrollToZoom:false},
    gestureSettingsTouch:{pinchToZoom:true,dragToPan:true},
   });
   viewer.current=v;
   v.addHandler("open",()=>{viewerReady.current=true;v.viewport.goHome(true);setZoom(v.viewport.getZoom(true));});
   v.addHandler("zoom",()=>setZoom(v.viewport.getZoom(true)));
   // Touch navigation stays enabled so mobile visitors can inspect memories naturally.

  })();
  return()=>{alive=false;viewer.current?.destroy();viewer.current=null;if(previewUrl.current)URL.revokeObjectURL(previewUrl.current)};
 },[]);
 useEffect(()=>{setMounted(true)},[]);
 const dismissIntro=()=>{setIntro(false)};
 const zoomBy=f=>{setIntro(false);const v=viewer.current;if(!v)return;v.viewport.zoomBy(f);v.viewport.applyConstraints();};
 const home=()=>{viewer.current?.viewport.goHome();setSelected(null);setIntro(true);window.scrollTo({top:0,behavior:"smooth"})};
 const showAbout=()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth",block:"start"});
 const chooseFile=e=>{
  const input=e.target;
  const next=input.files&&input.files.length?input.files[0]:null;
  if(!next){setFile(null);setPreview("");setError(t("No photograph was selected."));return;}
  setFile(next);setResult(null);setError("");
  setPreview(URL.createObjectURL(next));
 };
 const validateMemory=async()=>{setError("");const y=Number(year);if(!file){setError(t("Choose a photograph first."));return}if(!name.trim()){setError(t("Add your name."));return}if(!Number.isInteger(y)||y<1900||y>new Date().getFullYear()){setError(t("Add the year of this memory."));return}setSaving(true);try{const form=new FormData();form.append("photo",file);const response=await fetch("/api/moderate",{method:"POST",body:form});const contentType=response.headers.get("content-type")||"";if(!contentType.includes("application/json")){const body=await response.text();console.error("Moderation endpoint returned non-JSON",response.status,body.slice(0,160));throw new Error(lang==="es"?"El servicio de moderación no respondió correctamente. Inténtalo de nuevo.":"The moderation service did not respond correctly. Please try again.");}const payload=await response.json();if(!response.ok)throw new Error(payload.error||"Unable to check this photograph.");if(payload.decision==="reject"){setError(t("This photograph cannot be accepted under the Participation Rules."));return}if(payload.decision==="review"){setError(t("This photograph needs review before it can be published."));return}setPhotoFocus(payload.focus||null);setCheckout(true);}catch(e){setError(e.message||"Unable to check this photograph. Please try again.");}finally{setSaving(false)}};
 const createMemory=async(payment)=>{const y=Number(year);setError("");setSaving(true);try{if(!SUPABASE_URL||!SUPABASE_KEY){await new Promise(resolve=>setTimeout(resolve,650));const placement=prototypePlacement({name:name.trim(),year:y,fileName:file?.name||"memory"});const slug="demo-"+placement.memoryNumber+"-"+Date.now();const created={x:placement.x,y:placement.y,num:formatMemoryNumber(placement.memoryNumber),name:name.trim(),year:y,photo:preview,slug,focus:photoFocus,demo:true};setResult(created);setMemories(current=>[...current,created]);setCheckout(false);return;}const form=new FormData();form.append("photo",file);form.append("name",name.trim());form.append("year",String(y));form.append("email",checkoutEmail.trim());form.append("language",lang==="es"?"es":"en");form.append("paypal_order_id",payment?.orderId||"");form.append("paypal_capture_id",payment?.captureId||"");const response=await fetch("/api/create-memory",{method:"POST",body:form});const payload=await response.json();if(!response.ok)throw new Error(payload.error||"Unable to create memory.");const m=payload.memory;const created={x:m.position_x,y:m.position_y,num:formatMemoryNumber(Number(m.memory_number)),name:m.participant_name,year:m.memory_year,photo:m.image_url,slug:m.public_slug,focus:photoFocus};setResult(created);setMemories(current=>[...current.filter(x=>x.slug!==created.slug),created]);setCheckout(false);}catch(e){setError(e.message||"Unable to create memory.");}finally{setSaving(false);}};
 useEffect(()=>{
  if(!checkout||result||!mounted)return;
  let cancelled=false;
  setPaypalReady(false);setPaypalError("");
  (async()=>{
   try{
    const cfg=await fetch("/api/paypal/config",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"PayPal configuration unavailable.");return d});
    if(cancelled)return;
    if(!window.paypal){
     await new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(cfg.clientId)+"&currency=EUR&intent=capture&components=buttons";s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error("Unable to load PayPal."));document.head.appendChild(s)});
    }
    if(cancelled)return;setPaypalReady(true);
   }catch(e){if(!cancelled)setPaypalError(e.message||"Unable to load PayPal.")}
  })();
  return()=>{cancelled=true};
 },[checkout,result,mounted]);
 useEffect(()=>{
  if(!checkout||result||!paypalReady||!window.paypal)return;
  const container=document.getElementById("paypal-button-container");if(!container)return;
  container.innerHTML="";
  const buttons=window.paypal.Buttons({
   style:{layout:"vertical",shape:"rect",label:"paypal",height:48},
   onClick:(data,actions)=>{
    setPaypalError("");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutEmail.trim())){setPaypalError(t("Add a valid email."));return actions.reject()}
    return actions.resolve();
   },
   createOrder:async()=>{
    const r=await fetch("/api/paypal/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:checkoutEmail.trim()})});
    const d=await r.json();if(!r.ok)throw new Error(d.error||"Unable to create PayPal order.");return d.id;
   },
   onApprove:async data=>{
    setSaving(true);setPaypalError("");
    try{
     const r=await fetch("/api/paypal/orders/"+encodeURIComponent(data.orderID)+"/capture",{method:"POST"});
     const d=await r.json();if(!r.ok||d.status!=="COMPLETED")throw new Error(d.error||"Payment was not completed.");
     await createMemory({orderId:d.orderId,captureId:d.captureId});
    }catch(e){setPaypalError(e.message||"Unable to complete payment.");setSaving(false)}
   },
   onCancel:()=>setPaypalError(t("Payment cancelled. Your memory has not been created.")),
   onError:e=>{console.error(e);setPaypalError(t("Unable to complete payment. Please try again."));setSaving(false)}
  });
  buttons.render("#paypal-button-container").catch(e=>setPaypalError(e.message||"Unable to load PayPal."));
  return()=>{try{buttons.close()}catch{}};
 },[checkout,result,paypalReady,checkoutEmail]);

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
  if(!pendingSlug.current||!memories.length||!viewer.current||!viewerReady.current||!viewer.current.world.getItemAt(0))return;
  const target=memories.find(m=>m.slug===pendingSlug.current||String(Number(m.num))===pendingSlug.current||m.num===pendingSlug.current);
  if(!target)return;
  pendingSlug.current=null;
  window.setTimeout(()=>flyToMemory(target),350);
 },[memories,zoom]);
 const openMemoryUrl=m=>{
  if(typeof window!=="undefined")window.history.pushState({},"","/memory/"+m.slug);
  flyToMemory(m);
 };
 const openFindMemory=()=>{setFindNumber("");setFindError("");setFindOpen(true)};
 const findMyMemory=()=>{
  const raw=findNumber.trim().replace(/^#/,"");
  const n=Number(raw);
  const target=memories.find(m=>Number(m.num)===n||m.num===raw.padStart(6,"0"));
  if(!target){setFindError(t("We could not find that memory."));return}
  setFindOpen(false);openMemoryUrl(target);
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
  const imageY=150,imageH=560,scale=Math.min(W/img.width,imageH/img.height),dw=img.width*scale,dh=img.height*scale,dx=(W-dw)/2,dy=imageY+(imageH-dh)/2;
  ctx.fillStyle="#f3f4f7";ctx.fillRect(0,imageY,W,imageH);ctx.drawImage(img,dx,dy,dw,dh);
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
  <header className="topbar"><button className="brand brandLogo" onClick={home} aria-label="WE ARE SUPERSONICOS home"><strong>WE ARE</strong><span>SUPERSONICOS</span></button><div className="progress"><b>{memories.length.toLocaleString("en-US")}</b><span>/ 20,000 MEMORIES</span></div><nav><div className="languageSelector languageToggleStyle" aria-label="Language selector"><button className={lang==="es"?"active":""} onClick={()=>setLanguage("es")}>ES</button><span>/</span><button className={lang==="en"?"active":""} onClick={()=>setLanguage("en")}>EN</button></div><button onClick={home}>{t("OVERVIEW")}</button><button onClick={showAbout}>{t("ABOUT")}</button>{memories.length>0&&<button onClick={openFindMemory}>{t("FIND MY MEMORY")}</button>}<button className="add" onClick={()=>setOpen(true)}>{t("ADD YOUR MEMORY")} <b>→</b></button></nav>
   <div className="mobileNav"><button className="add" onClick={()=>setOpen(true)}>{t("ADD YOUR MEMORY")} <b>→</b></button></div>
   {mobileMenu&&<div className="mobileMenu"><button onClick={()=>{setMobileMenu(false);home()}}>{t("OVERVIEW")}</button><button onClick={()=>{setMobileMenu(false);showAbout()}}>{t("ABOUT")}</button>{memories.length>0&&<button onClick={()=>{setMobileMenu(false);openFindMemory()}}>{t("FIND MY MEMORY")}</button>}</div>}</header>
  <section className="viewport osdViewport" onPointerDown={dismissIntro}>
   <div ref={viewerEl} className="deepViewer" onPointerDown={e=>e.preventDefault()} onDragStart={e=>e.preventDefault()}/>
   <div className={"mosaicGuide "+(zoom>7?"visible":"")}/>
   <div className={"intro "+(!intro?"hidden":"")}><p>{t("A COLLECTIVE MEMORY PROJECT")}</p><h1>{t("20 YEARS.")}<br/>{t("20,000 MEMORIES.")}<br/>{t("ONE SOUND.")}</h1><h2>{t("Every memory finds its place.")}</h2><div className="counter"><strong>{memories.length.toLocaleString("en-US")} / 20,000</strong><span>{memories.length===0?<>{t("The first memory")}<br/>{t("is waiting.")}</>:<>{t("Every memory")}<br/>{t("finds its place.")}</>}</span><i/></div><button className="enter" onClick={()=>zoomBy(1.35)}>{t("EXPLORE THE IMAGE ↓")}</button></div>
   <div className="zoom" onPointerDown={e=>e.stopPropagation()}><button onClick={()=>zoomBy(1.22)}>+</button><span>{zoom<10?Math.round(zoom*100)+"%":zoom.toFixed(1)+"×"}</span><button onClick={()=>zoomBy(1/1.22)}>−</button></div>
   {!intro&&<div className="hint"><span className="desktopHint">{t("SCROLL TO ZOOM")}</span><span className="mobileHint">{t("PINCH TO ZOOM")}</span></div>}
   {selected&&<div className="memoryCard testMemoryCard"><button className="memoryClose" onClick={()=>setSelected(null)}>×</button><img className="memoryPreview" src={selected.photo} alt={t("Memory")} style={{objectPosition:selected.focus?`${selected.focus.x*100}% ${selected.focus.y*100}%`:"50% 50%"}}/>{<div className="memoryActions memoryActionsBand"><button onClick={()=>setPassport(selected)}>{t("PASSPORT")}</button><button onClick={()=>shareMemory(selected)}>{t("SHARE")}</button></div>}<div className="memoryContent"><small>WE ARE SUPERSONICOS</small><h3>{selected.name}</h3><p>IBIZA · {selected.year}</p><b>{t("MEMORY")} #{selected.num}</b></div></div>}
  </section>
  <section className="about" id="about">
   <div className="aboutEyebrow">{t("ABOUT THE ARTWORK")}</div>
   <div className="aboutHero"><div><h2>WE ARE<br/>SUPERSONICOS.</h2><span className="aboutLine">{t("IBIZA SONICA · 20 YEARS")}</span></div><p>{t("Twenty years of Ibiza Sonica, told through the people who listened, danced, broadcast, travelled and shared the sound with us. 20,000 real memories becoming one collective image.")}</p></div>
   <div className="aboutGrid">
    <article><span>01</span><h3>{t("CHOOSE A MEMORY.")}</h3><p>{t("One photograph from a moment that connects you to Ibiza Sonica. A broadcast, a party, a journey, a song, a place or simply a moment you still remember.")}</p></article>
    <article><span>02</span><h3>{t("FIND YOUR PLACE.")}</h3><p>{t("For €1, your photograph receives one equal position in the artwork. Every SUPERSONICO has the same space. No premium positions. No hierarchy.")}</p></article>
    <article><span>03</span><h3>{t("BECOME PART OF THE IMAGE.")}</h3><p>{t("Step back and you see one image of Ibiza Sonica. Move closer and it opens into the people, years and moments that made twenty years of sound.")}</p></article>
    <article><span>04</span><h3>{t("COMPLETE THE ARTWORK.")}</h3><p>{t("Memory by memory, the image gives way to the community inside it. The artwork is complete when Memory #20,000 finds its place.")}</p></article>
   </div>
   <div className="aboutFinal"><p>{t("A living archive of the people who made Ibiza Sonica part of their lives, wherever in the world they listened.")}</p><h2>{t("20 YEARS.")}<br/>{t("20,000 MEMORIES.")}<br/>{t("ONE SOUND.")}</h2><button onClick={()=>setOpen(true)}>{t("ADD YOUR MEMORY")} <b>→</b></button></div>
   <section className="participationRules" id="participation-rules">
    <div className="rulesHead"><span>{t("BEFORE YOU TAKE PART")}</span><h2>{t("PARTICIPATION")}<br/>{t("RULES.")}</h2><div className="rulesIntro"><p><strong>{t("Every photograph holds a moment. A night, a journey, a song, a DJ booth, a sunrise or simply an instant you still remember.")}</strong></p><p>{t("WE ARE SUPERSONICOS brings these memories together to build, collectively, an image of 20 years of Ibiza Sonica. We want every one of them to be real, personal and part of the story we have shared.")}</p><p>{t("So we only ask one simple thing: share a memory that is truly yours and respect the people who appear in it.")}</p></div></div>
    <div className="rulesGrid">
     <article><span>01</span><h3>{t("YOUR PHOTO.")}</h3><p>{t("You must own the photograph or have the right to share it.")}</p></article>
     <article><span>02</span><h3>{t("PEOPLE IN YOUR PHOTO.")}</h3><p>{t("You must have the necessary permission to publish identifiable people appearing in the photograph.")}</p></article>
     <article><span>03</span><h3>{t("NO MINORS.")}</h3><p>{t("Photographs containing identifiable minors are not accepted.")}</p></article>
     <article><span>04</span><h3>{t("NO EXPLICIT SEXUAL CONTENT.")}</h3><p>{t("Sexually explicit or pornographic material is not accepted. Swimwear, beach, pool and normal nightlife imagery are welcome.")}</p></article>
     <article><span>05</span><h3>{t("NO GRAPHIC OR ABUSIVE CONTENT.")}</h3><p>{t("Graphic violence, hateful, threatening or clearly abusive material is not accepted.")}</p></article>
     <article><span>06</span><h3>{t("AUTOMATIC MODERATION.")}</h3><p>{t("Images may be automatically checked before publication. Content may be rejected or held for review when necessary.")}</p></article>
     <article><span>07</span><h3>{t("ONE REAL MEMORY.")}</h3><p>{t("Submit a genuine photograph connected to your experience of Ibiza Sonica.")}</p></article>
    </div>
    <p className="rulesLegal">{t("By participating, you agree to these rules and to the Terms of Participation and Privacy Policy.")}</p>
   </section>
   <div className="faq"><div className="faqHead"><span>{t("QUESTIONS ABOUT THE ARTWORK")}</span><h2>FAQ.</h2></div>
   <div className={"faqItem "+(faqOpen===0?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===0?null:0)}><span>{t("WHAT IS WE ARE SUPERSONICOS?")}</span><b>{faqOpen===0?"−":"+"}</b></button><div className="faqAnswer"><p>{t("A collective digital artwork made from 20,000 real memories from the Ibiza Sonica community around the world. Each photograph becomes one equal part of a single image celebrating 20 years of Ibiza Sonica.")}</p></div></div><div className={"faqItem "+(faqOpen===1?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===1?null:1)}><span>{t("WHAT KIND OF PHOTO CAN I ADD?")}</span><b>{faqOpen===1?"−":"+"}</b></button><div className="faqAnswer"><p>{t("Any photograph connected to a real memory of Ibiza Sonica. It can come from Ibiza or anywhere the sound travelled with you, and it can be recent or decades old.")}</p></div></div><div className={"faqItem "+(faqOpen===2?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===2?null:2)}><span>{t("DOES IT COST ANYTHING?")}</span><b>{faqOpen===2?"−":"+"}</b></button><div className="faqAnswer"><p>{t("Yes. Adding one memory costs €1. One euro gives your photograph one equal place in the artwork. No premium positions, no larger spaces, no hierarchy.")}</p></div></div><div className={"faqItem "+(faqOpen===3?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===3?null:3)}><span>{t("WHAT HAPPENS AFTER I ADD MY PHOTO?")}</span><b>{faqOpen===3?"−":"+"}</b></button><div className="faqAnswer"><p>{t("Your memory receives its own number and position inside the artwork. You can return directly to it through its individual URL.")}</p></div></div><div className={"faqItem "+(faqOpen===4?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===4?null:4)}><span>{t("WHAT IS THE PASSPORT?")}</span><b>{faqOpen===4?"−":"+"}</b></button><div className="faqAnswer"><p>{t("Your Passport is the personal visual record of your participation: your photograph, name, year and unique Memory number. It is designed to be saved and shared.")}</p></div></div><div className={"faqItem "+(faqOpen===5?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===5?null:5)}><span>{t("WHAT DOES SHARE DO?")}</span><b>{faqOpen===5?"−":"+"}</b></button><div className="faqAnswer"><p>{t("SHARE creates a direct link to your memory inside the artwork, so other people can find your exact place — and add their own memory.")}</p></div></div><div className={"faqItem "+(faqOpen===6?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===6?null:6)}><span>{t("HOW IS MY PLACE CHOSEN?")}</span><b>{faqOpen===6?"−":"+"}</b></button><div className="faqAnswer"><p>{t("Every memory has an equal-sized position. The final system places photographs according to visual characteristics such as colour and light so that, together, they reconstruct the master image of Ibiza Sonica.")}</p></div></div><div className={"faqItem "+(faqOpen===7?"open":"")}><button onClick={()=>setFaqOpen(faqOpen===7?null:7)}><span>{t("WHAT HAPPENS WHEN IT REACHES 20,000?")}</span><b>{faqOpen===7?"−":"+"}</b></button><div className="faqAnswer"><p>{t("The artwork is complete. The Ibiza Sonica Master Image has been progressively replaced by 20,000 real memories from the Ibiza Sonica community — while remaining visible from a distance through those memories.")}</p></div></div>
   </div>
  </section>
  <footer className="siteFooter"><span>{t("20,000 REAL MEMORIES · ONE EQUAL PLACE EACH.")}</span><nav className="legalNav"><a href="/terms">{t("TERMS")}</a><a href="/privacy">{t("PRIVACY")}</a><a href="/cookies">{t("COOKIES")}</a><a href="/legal-notice">{t("LEGAL")}</a><a href="/removal">{t("REMOVAL")}</a></nav><button onClick={home}>{t("FIT IMAGE")}</button></footer>
  {passport&&<div className="passportModal" onClick={()=>setPassport(null)}><div className="passport" onClick={e=>e.stopPropagation()}><button className="passportClose" onClick={()=>setPassport(null)}>×</button><div className="passportTop"><div className="passportBrand"><strong>WE ARE</strong><span>SUPERSONICOS</span><small>SUPERSONICOS.IBIZASONICA.COM</small></div></div><img src={passport.photo} alt="Ibiza memory"/><div className="passportBody"><div className="passportClaim"><strong>{t("20 YEARS.")} {t("20,000 MEMORIES.")}</strong><span>{t("ONE SOUND.")}</span></div><h2>{t("I AM")}<br/>{t("SUPERSONICO")}</h2><div className="passportIdentity"><p>{passport.name}</p><span>IBIZA · {passport.year}</span></div><div className="passportNumber"><span>{t("MEMORY")}</span><b>#{passport.num}</b></div><button className="passportShare" onClick={()=>sharePassport(passport)}>{t("SHARE PASSPORT")} <b>→</b></button></div></div></div>}
  {mounted&&findOpen&&createPortal(<div className="modal paymentModal" onClick={()=>setFindOpen(false)}><div className="card paymentCard" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setFindOpen(false)}>×</button><small>WE ARE SUPERSONICOS</small><h2>{t("FIND MY MEMORY")}</h2><p className="lead">{t("ENTER YOUR MEMORY NUMBER")}</p><input autoFocus inputMode="numeric" placeholder="#000001" value={findNumber} onChange={e=>{setFindNumber(e.target.value);setFindError("")}} onKeyDown={e=>{if(e.key==="Enter")findMyMemory()}} style={{width:"100%",fontSize:"28px",padding:"16px 0",border:"0",borderBottom:"1px solid #999",background:"transparent",outline:"none",margin:"10px 0 18px"}}/>{findError&&<p className="error">{findError}</p>}<button className="continue" onClick={findMyMemory} disabled={!findNumber.trim()}><span>{t("FIND MEMORY")}</span><b>→</b></button></div></div>,document.body)}
  {mounted&&checkout&&!result&&createPortal(<div className="modal paymentModal" onClick={()=>{if(!saving)setCheckout(false)}}><div className="card paymentCard" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setCheckout(false)} disabled={saving}>×</button><small>WE ARE SUPERSONICOS</small><h2>{t("ONE PHOTO.")}<br/>{t("ONE MEMORY.")}<br/>{t("ONE PLACE.")}</h2><p className="lead">{t("Your photograph becomes one equal part of the collective artwork.")}</p><label><span className="fieldTitle">{t("YOUR EMAIL")}</span><input type="email" autoComplete="email" placeholder="you@email.com" value={checkoutEmail} onChange={e=>{setCheckoutEmail(e.target.value);setPaypalError("")}} disabled={saving} style={{fontSize:"20px",padding:"16px 0 12px",lineHeight:"1.3"}}/></label><p className="paymentEquality">{t("We use it to send and recover your memory. It will never be public.")}</p><div className="paymentSummary"><span>{t("YOUR PLACE IN THE ARTWORK")}</span><strong>€1</strong></div><p className="paymentEquality">{t("Every memory has exactly the same space. No premium positions. No hierarchy.")}</p>{paypalError&&<p className="error">{paypalError}</p>}<div id="paypal-button-container" style={{minHeight:48,opacity:saving?.55:1,pointerEvents:saving?"none":"auto"}}/>{!paypalReady&&!paypalError&&<em className="demoPayment">PAYPAL · LOADING…</em>}{saving&&<em className="demoPayment">{t("ADDING YOUR MEMORY…")}</em>}</div></div>,document.body)}
  {open&&<div className="modal" onClick={()=>setOpen(false)}><div className="card" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(false)}>×</button>{!result?<><small>WE ARE SUPERSONICOS</small><h2>{t("ADD YOUR")}<br/>{t("MEMORY.")}</h2><p className="lead">{t("Choose one photograph that holds a real memory of Ibiza Sonica.")}<br/>{t("It will become one equal part of the collective image.")}</p><label className="photoUpload"><span className="fieldTitle">{t("YOUR PHOTO")}</span><span className="uploadBox">{preview?<img src={preview} alt={t("Selected memory")}/>:<span className="uploadPlus">+</span>}<span><strong>{file?file.name:t("Choose a photograph")}</strong><small>{file?t("Photograph selected · click to change"):t("JPG, PNG, WEBP or HEIC · Your original stays yours.")}</small></span></span><input className="nativePhotoInput" type="file" accept="image/*,.heic,.heif" onChange={chooseFile}/></label><div className="row"><label><span className="fieldTitle">{t("YOUR NAME")}</span><input placeholder={t("Your name")} value={name} onChange={e=>setName(e.target.value)}/></label><label><span className="fieldTitle">{t("YEAR OF THIS MEMORY")}</span><input inputMode="numeric" type="number" min="2005" max={new Date().getFullYear()} placeholder={t("Your year")} value={year} onChange={e=>setYear(e.target.value)}/></label></div>{error&&<p className="formError">{error}</p>}<label className="rulesConsent"><input type="checkbox" checked={rulesAccepted} onChange={e=>setRulesAccepted(e.target.checked)}/><span>{t("I confirm that my photo follows the ")}<a href="#participation-rules" onClick={()=>setOpen(false)}>{t("Participation Rules")}</a>{t(", that I have the right to share it and the necessary permissions for identifiable people shown in it. I agree to the ")}<a href="/terms">{t("Terms of Participation")}</a>{t(" and ")}<a href="/privacy">{t("Privacy Policy")}</a>.</span></label><div className="formNote"><b>{t("ONE PHOTO. ONE MEMORY. ONE PLACE.")}</b><span>{t("We only need these details to give your memory its place in the artwork.")}</span></div><button className="continue" onClick={validateMemory} disabled={!rulesAccepted||saving||!!error}><span>{t(saving?"CHECKING PHOTO…":"FIND MY PLACE")}</span><span className="price">€1</span><b>→</b></button></>:<div className="placementResult"><small>{t("YOUR PLACE HAS BEEN FOUND")}</small><h2>{t("I AM")}<br/>{t("SUPERSONICO")}</h2><img src={result.photo} alt={t("Your memory")}/><p>{t("Your memory has a place in the artwork.")}</p><strong>{t("MEMORY")} #{result.num}</strong><span>{result.name} · IBIZA · {result.year}</span><button className="continue" onClick={showResult}><span>{t("VIEW MY MEMORY")}</span><b>→</b></button></div>}</div></div>}
 </main>
}