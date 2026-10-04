"use client";
import {useEffect,useState} from "react";

const ES={
"OVERVIEW":"INICIO","ABOUT":"SOBRE EL PROYECTO","FIND MY MEMORY":"ENCONTRAR MI MEMORIA","ADD YOUR MEMORY":"AÑADE TU MEMORIA","MENU":"MENÚ",
"A COLLECTIVE MEMORY PROJECT":"UN PROYECTO DE MEMORIA COLECTIVA","20 YEARS.":"20 AÑOS.","20,000 MEMORIES.":"20.000 MEMORIAS.","ONE SOUND.":"UN SONIDO.",
"Every memory finds its place.":"Cada memoria encuentra su lugar.","The first memory":"La primera memoria","is waiting.":"está esperando.","EXPLORE THE IMAGE ↓":"EXPLORA LA IMAGEN ↓",
"ABOUT THE ARTWORK":"SOBRE LA OBRA","IBIZA SONICA · 20 YEARS":"IBIZA SONICA · 20 AÑOS",
"Twenty years of Ibiza Sonica, told through the people who listened, danced, broadcast, travelled and shared the sound with us. 20,000 real memories becoming one collective image.":"Veinte años de Ibiza Sonica contados a través de las personas que escucharon, bailaron, emitieron, viajaron y compartieron el sonido con nosotros. 20.000 memorias reales convirtiéndose en una imagen colectiva.",
"CHOOSE A MEMORY.":"ELIGE UNA MEMORIA.","One photograph from a moment that connects you to Ibiza Sonica. A broadcast, a party, a journey, a song, a place or simply a moment you still remember.":"Una fotografía de un momento que te conecte con Ibiza Sonica. Una emisión, una fiesta, un viaje, una canción, un lugar o simplemente un momento que todavía recuerdes.",
"FIND YOUR PLACE.":"ENCUENTRA TU LUGAR.","For €1, your photograph receives one equal position in the artwork. Every SUPERSONICO has the same space. No premium positions. No hierarchy.":"Por 1 €, tu fotografía recibe un lugar igual dentro de la obra. Cada SUPERSONICO tiene el mismo espacio. Sin posiciones premium. Sin jerarquías.",
"BECOME PART OF THE IMAGE.":"FORMA PARTE DE LA IMAGEN.","Step back and you see one image of Ibiza Sonica. Move closer and it opens into the people, years and moments that made twenty years of sound.":"Aléjate y verás una imagen de Ibiza Sonica. Acércate y aparecerán las personas, los años y los momentos que construyeron veinte años de sonido.",
"COMPLETE THE ARTWORK.":"COMPLETA LA OBRA.","Memory by memory, the image gives way to the community inside it. The artwork is complete when Memory #20,000 finds its place.":"Memoria a memoria, la imagen deja paso a la comunidad que contiene. La obra estará completa cuando la Memoria #20.000 encuentre su lugar.",
"A living archive of the people who made Ibiza Sonica part of their lives, wherever in the world they listened.":"Un archivo vivo de las personas que hicieron de Ibiza Sonica parte de sus vidas, desde cualquier lugar del mundo.",
"BEFORE YOU TAKE PART":"ANTES DE PARTICIPAR","PARTICIPATION":"NORMAS DE","RULES.":"PARTICIPACIÓN.",
"WE ARE SUPERSONICOS is built from real memories shared by real people. These rules protect the artwork and everyone who becomes part of it.":"WE ARE SUPERSONICOS se construye con memorias reales compartidas por personas reales. Estas normas protegen la obra y a todas las personas que forman parte de ella.",
"YOUR PHOTO.":"TU FOTO.","You must own the photograph or have the right to share it.":"Debes ser propietario de la fotografía o tener derecho a compartirla.",
"PEOPLE IN YOUR PHOTO.":"PERSONAS EN TU FOTO.","You must have the necessary permission to publish identifiable people appearing in the photograph.":"Debes tener el permiso necesario para publicar a las personas identificables que aparezcan en la fotografía.",
"NO MINORS.":"SIN MENORES.","Photographs containing identifiable minors are not accepted.":"No se aceptan fotografías con menores identificables.",
"NO EXPLICIT SEXUAL CONTENT.":"SIN CONTENIDO SEXUAL EXPLÍCITO.","Sexually explicit or pornographic material is not accepted. Swimwear, beach, pool and normal nightlife imagery are welcome.":"No se acepta material sexualmente explícito o pornográfico. Sí se permiten imágenes normales de bañadores, playa, piscina y vida nocturna.",
"NO GRAPHIC OR ABUSIVE CONTENT.":"SIN CONTENIDO GRÁFICO O ABUSIVO.","Graphic violence, hateful, threatening or clearly abusive material is not accepted.":"No se acepta violencia gráfica ni material de odio, amenazante o claramente abusivo.",
"AUTOMATIC MODERATION.":"MODERACIÓN AUTOMÁTICA.","Images may be automatically checked before publication. Content may be rejected or held for review when necessary.":"Las imágenes pueden comprobarse automáticamente antes de publicarse. El contenido puede rechazarse o quedar pendiente de revisión cuando sea necesario.",
"ONE REAL MEMORY.":"UNA MEMORIA REAL.","Submit a genuine photograph connected to your experience of Ibiza Sonica.":"Envía una fotografía real conectada con tu experiencia de Ibiza Sonica.",
"By participating, you agree to these rules and to the Terms of Participation and Privacy Policy.":"Al participar, aceptas estas normas, los Términos de Participación y la Política de Privacidad.",
"QUESTIONS ABOUT THE ARTWORK":"PREGUNTAS SOBRE LA OBRA","WHAT IS WE ARE SUPERSONICOS?":"¿QUÉ ES WE ARE SUPERSONICOS?","WHAT KIND OF PHOTO CAN I ADD?":"¿QUÉ TIPO DE FOTO PUEDO AÑADIR?","DOES IT COST ANYTHING?":"¿CUÁNTO CUESTA?","WHAT HAPPENS AFTER I ADD MY PHOTO?":"¿QUÉ PASA DESPUÉS DE AÑADIR MI FOTO?","WHAT IS THE PASSPORT?":"¿QUÉ ES EL PASSPORT?","WHAT DOES SHARE DO?":"¿QUÉ HACE SHARE?","HOW IS MY PLACE CHOSEN?":"¿CÓMO SE ELIGE MI LUGAR?","WHAT HAPPENS WHEN IT REACHES 20,000?":"¿QUÉ PASA CUANDO LLEGUE A 20.000?",
"A collective digital artwork made from 20,000 real memories from the Ibiza Sonica community around the world. Each photograph becomes one equal part of a single image celebrating 20 years of Ibiza Sonica.":"Una obra digital colectiva creada con 20.000 memorias reales de la comunidad de Ibiza Sonica en todo el mundo. Cada fotografía se convierte en una parte igual de una única imagen que celebra 20 años de Ibiza Sonica.",
"Any photograph connected to a real memory of Ibiza Sonica. It can come from Ibiza or anywhere the sound travelled with you, and it can be recent or decades old.":"Cualquier fotografía conectada con una memoria real de Ibiza Sonica. Puede ser de Ibiza o de cualquier lugar al que el sonido haya viajado contigo, reciente o de hace décadas.",
"Yes. Adding one memory costs €1. One euro gives your photograph one equal place in the artwork. No premium positions, no larger spaces, no hierarchy.":"Sí. Añadir una memoria cuesta 1 €. Un euro da a tu fotografía un lugar igual en la obra. Sin posiciones premium, espacios mayores ni jerarquías.",
"Your memory receives its own number and position inside the artwork. You can return directly to it through its individual URL.":"Tu memoria recibe su propio número y posición dentro de la obra. Puedes volver directamente a ella mediante su URL individual.",
"Your Passport is the personal visual record of your participation: your photograph, name, year and unique Memory number. It is designed to be saved and shared.":"Tu Passport es el registro visual personal de tu participación: tu fotografía, nombre, año y número único de Memoria. Está diseñado para guardarlo y compartirlo.",
"SHARE creates a direct link to your memory inside the artwork, so other people can find your exact place — and add their own memory.":"SHARE crea un enlace directo a tu memoria dentro de la obra para que otras personas encuentren tu lugar exacto y puedan añadir su propia memoria.",
"Every memory has an equal-sized position. The final system places photographs according to visual characteristics such as colour and light so that, together, they reconstruct the master image of Ibiza Sonica.":"Cada memoria ocupa un espacio del mismo tamaño. El sistema coloca las fotografías según características visuales como el color y la luz para que, juntas, reconstruyan la imagen maestra de Ibiza Sonica.",
"The artwork is complete. The Ibiza Sonica Master Image has been progressively replaced by 20,000 real memories from the Ibiza Sonica community — while remaining visible from a distance through those memories.":"La obra queda completa. La imagen maestra de Ibiza Sonica habrá sido sustituida progresivamente por 20.000 memorias reales de su comunidad, manteniéndose visible desde la distancia a través de esas memorias.",
"TERMS":"TÉRMINOS","PRIVACY":"PRIVACIDAD","COOKIES":"COOKIES","LEGAL":"LEGAL","REMOVAL":"RETIRADA","FIT IMAGE":"AJUSTAR IMAGEN",
"LEGAL NOTICE":"AVISO LEGAL","PRIVACY POLICY":"POLÍTICA DE PRIVACIDAD","TERMS OF PARTICIPATION":"TÉRMINOS DE PARTICIPACIÓN","COOKIE POLICY":"POLÍTICA DE COOKIES","REMOVAL & TAKEDOWN":"RETIRADA DE CONTENIDO",
"Operator":"Titular","Website":"Sitio web","Intellectual property":"Propiedad intelectual","Applicable law":"Legislación aplicable","Controller":"Responsable del tratamiento","Data we process":"Datos que tratamos","Why we use it":"Finalidades","Legal bases":"Bases jurídicas","Public nature of a Memory":"Carácter público de una Memoria","Service providers and transfers":"Proveedores y transferencias","Retention":"Conservación","Your rights":"Tus derechos","Image moderation":"Moderación de imágenes","Security":"Seguridad","Changes":"Cambios",
"The project":"El proyecto","Your contribution":"Tu aportación","Your rights and permissions":"Tus derechos y permisos","Participation Rules":"Normas de participación","Moderation":"Moderación","Placement":"Colocación","Removal":"Retirada","Price and payment":"Precio y pago",
"Essential technologies":"Tecnologías esenciales","Analytics":"Analítica","Your choice":"Tu elección","Updates":"Actualizaciones","When to contact us":"Cuándo contactar","What to send":"Qué enviar","What happens next":"Qué ocurre después","Urgent safety concerns":"Cuestiones urgentes de seguridad"
};
const originals=new WeakMap();
function walk(root,lang){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let n;while(n=walker.nextNode()){
  if(!originals.has(n)) originals.set(n,n.nodeValue);
  const en=originals.get(n),key=en.trim();
  if(lang==="es"&&ES[key]) n.nodeValue=en.replace(key,ES[key]); else n.nodeValue=en;
 }
 document.documentElement.lang=lang;
}
export default function LanguageToggle(){
 const [lang,setLang]=useState("en");
 useEffect(()=>{
  const saved=localStorage.getItem("supersonicos-lang")||"en";
  setLang(saved);
  const sync=e=>{if(e.detail==="en"||e.detail==="es")setLang(e.detail)};
  window.addEventListener("supersonicos-language",sync);
  return()=>window.removeEventListener("supersonicos-language",sync);
 },[]);
 useEffect(()=>{walk(document.body,lang);localStorage.setItem("supersonicos-lang",lang);const o=new MutationObserver(()=>walk(document.body,lang));o.observe(document.body,{childList:true,subtree:true});return()=>o.disconnect()},[lang]);
 return <div className="languageToggle" aria-label="Language"><button className={lang==="en"?"active":""} onClick={()=>setLang("en")}>EN</button><span>/</span><button className={lang==="es"?"active":""} onClick={()=>setLang("es")}>ES</button></div>
}