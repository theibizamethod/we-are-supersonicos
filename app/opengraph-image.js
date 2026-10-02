import {ImageResponse} from "next/og";

export const runtime="edge";
export const alt="WE ARE SUPERSONICOS";
export const size={width:1200,height:630};
export const contentType="image/png";

export default function Image(){
 return new ImageResponse(
  <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",background:"#080808",color:"#f5f5f2",padding:"72px 82px",fontFamily:"Arial, sans-serif"}}>
   <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
    <div style={{fontSize:34,fontWeight:700,lineHeight:1,letterSpacing:"7px",color:"#ffd400"}}>WE ARE</div>
    <div style={{fontSize:35,fontWeight:700,letterSpacing:"7px",marginTop:"18px"}}>I AM HERE</div>
   </div>
   <div style={{display:"flex",width:"100%",alignItems:"flex-end",justifyContent:"space-between"}}>
    <div style={{fontSize:39,fontWeight:500,lineHeight:1.05,letterSpacing:"-1px"}}>20 YEARS. 20,000 MEMORIES.<br/>ONE SOUND.</div>
    <div style={{fontSize:18,letterSpacing:"2px"}}>IBIZA SONICA · 20 YEARS</div>
   </div>
  </div>,
  size
 );
}
