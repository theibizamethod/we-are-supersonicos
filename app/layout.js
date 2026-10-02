import "./globals.css";
import Script from "next/script";
import CookieConsent from "./cookie-consent";
import LanguageToggle from "./language-toggle";

export const metadata={
 metadataBase:new URL("https://supersonicos.ibizasonica.com"),
 title:"WE ARE SUPERSONICOS",
 description:"20 years. 20,000 memories. One sound.",
 openGraph:{
  title:"WE ARE SUPERSONICOS",
  description:"20 years. 20,000 memories. One sound.",
  url:"https://supersonicos.ibizasonica.com",
  siteName:"WE ARE SUPERSONICOS",
  type:"website",
  images:[{url:"/opengraph-image",width:1200,height:630,alt:"WE ARE SUPERSONICOS"}]
 },
 twitter:{
  card:"summary_large_image",
  title:"WE ARE SUPERSONICOS",
  description:"20 years. 20,000 memories. One sound.",
  images:["/opengraph-image"]
 }
};

export default function RootLayout({children}){
 return <html lang="en">
  <body>
   <LanguageToggle/>
   {children}
   <CookieConsent/>
  </body>
 </html>
}