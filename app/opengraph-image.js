import {ImageResponse} from "next/og";

export const runtime="edge";
export const alt="WE ARE SUPERSONICOS";
export const size={width:1200,height:630};
export const contentType="image/png";

export default function Image(){
 return new ImageResponse(
  <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"#f4f3ef",color:"#101722",padding:"72px 82px",fontFamily:"Arial, sans-serif"}}>
   <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
    <div style={{fontSize:92,fontWeight:800,lineHeight:.82,letterSpacing:"-5px"}}>IBIZA</div>
    <div style={{fontSize:35,fontWeight:700,letterSpacing:"7px",marginTop:"18px"}}>I AM HERE</div>
   </div>
   <div style={{display:"flex",width:"100%",alignItems:"flex-end",justifyContent:"space-between"}}>
    <div style={{fontSize:39,fontWeight:500,lineHeight:1.05,letterSpacing:"-1px"}}>20 YEARS. 20,000 MEMORIES.<br/>ONE SOUND.</div>
    <div style={{fontSize:18,letterSpacing:"2px"}}>EVERY MEMORY FINDS ITS PLACE.</div>
   </div>
  </div>,
  size
 );
}
