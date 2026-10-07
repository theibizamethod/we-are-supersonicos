"use client";
import {useEffect,useState} from "react";
const copy={
en:{title:"COOKIE POLICY",intro:"Information about cookies and similar technologies used on WE ARE SUPERSONICOS.",sections:[
["Essential technologies","Technologies strictly necessary to provide, secure or remember essential functions of the website may operate without optional consent where permitted by law."],
["Analytics","The project may use optional analytics only after the visitor has given the consent required for non-essential analytics technologies. The technologies actually enabled on the site and this policy must remain aligned as the project evolves."],
["Your choice","On your first visit you can accept or reject optional technologies with choices presented at the same level. You can change your choice later through Cookie Settings."],
["Updates","This policy will be updated if the technologies or providers used by the project change."]]},
es:{title:"POLÍTICA DE COOKIES",intro:"Información sobre las cookies y tecnologías similares utilizadas en WE ARE SUPERSONICOS.",sections:[
["Tecnologías esenciales","Las tecnologías estrictamente necesarias para prestar, proteger o recordar funciones esenciales del sitio web pueden funcionar sin consentimiento opcional cuando la ley lo permita."],
["Analítica","El proyecto puede utilizar analítica opcional únicamente después de que el visitante haya prestado el consentimiento exigido para tecnologías analíticas no esenciales. Las tecnologías realmente activadas en el sitio y esta política deben mantenerse alineadas a medida que evolucione el proyecto."],
["Tu elección","En tu primera visita puedes aceptar o rechazar las tecnologías opcionales mediante opciones presentadas al mismo nivel. Puedes cambiar tu elección posteriormente desde Configuración de cookies."],
["Actualizaciones","Esta política se actualizará si cambian las tecnologías o los proveedores utilizados por el proyecto."]]}};
export default function Page(){const[lang,setLang]=useState("en");useEffect(()=>setLang(localStorage.getItem("supersonicos-lang")||"en"),[]);const c=copy[lang];return <main className="legalPage"><a className="legalBack" href="/">← WE ARE SUPERSONICOS</a><h1>{c.title}</h1><p className="legalIntro">{c.intro}</p>{c.sections.map(([h,p])=><section key={h}><h2>{h}</h2><p>{p}</p></section>)}</main>}