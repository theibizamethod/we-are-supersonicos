import "./globals.css";
import Script from "next/script";
import CookieConsent from "./cookie-consent";

export const metadata={
 metadataBase:new URL("https://ibizaiwashere.com"),
 title:"IBIZA I WAS HERE",
 description:"One million memories. One image of Ibiza.",
 openGraph:{
  title:"IBIZA I WAS HERE",
  description:"One million memories. One image of Ibiza.",
  url:"https://ibizaiwashere.com",
  siteName:"IBIZA I WAS HERE",
  type:"website",
  images:[{url:"/opengraph-image",width:1200,height:630,alt:"IBIZA I WAS HERE"}]
 },
 twitter:{
  card:"summary_large_image",
  title:"IBIZA I WAS HERE",
  description:"One million memories. One image of Ibiza.",
  images:["/opengraph-image"]
 }
};

export default function RootLayout({children}){
 return <html lang="en">
  <body>
   {children}
   <CookieConsent/>
  </body>
 </html>
}