"use client";
import {useEffect,useState} from "react";

export default function CookieConsent(){
 const [choice,setChoice]=useState(null),[settings,setSettings]=useState(false);
 useEffect(()=>{setChoice(localStorage.getItem("supersonicos-cookie-consent"))},[]);
 useEffect(()=>{if(choice!=="accepted"||document.getElementById("supersonicos-ga"))return;window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag("js",new Date());window.gtag("config","G-GJYWW5L5TM");const s=document.createElement("script");s.id="supersonicos-ga";s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id=G-GJYWW5L5TM";document.head.appendChild(s)},[choice]);
 const decide=v=>{localStorage.setItem("supersonicos-cookie-consent",v);setChoice(v);setSettings(false)};
 return <>
  
  {!choice&&<div className="cookieBanner"><div><strong>YOUR PRIVACY.</strong><p>We use optional analytics to understand how WE ARE SUPERSONICOS is used. You can accept or reject analytics. Essential technologies remain active.</p><a href="/cookies">Cookie Policy</a></div><div className="cookieActions"><button onClick={()=>decide("rejected")}>REJECT</button><button onClick={()=>decide("accepted")}>ACCEPT</button></div></div>}
  {settings&&<div className="cookieBanner cookieSettings"><div><strong>COOKIE SETTINGS.</strong><p>Analytics is currently {choice==="accepted"?"accepted":"rejected"}. You can change your choice at any time.</p><a href="/cookies">Cookie Policy</a></div><div className="cookieActions"><button onClick={()=>decide("rejected")}>REJECT</button><button onClick={()=>decide("accepted")}>ACCEPT</button></div></div>}
  {choice&&<button className="cookieSettingsBtn" onClick={()=>setSettings(true)}>COOKIE SETTINGS</button>}
 </>;
}