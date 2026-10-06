export const runtime="nodejs";
const PAYPAL_BASE="https://api-m.paypal.com";
async function accessToken(){
 const id=process.env.PAYPAL_CLIENT_ID, secret=process.env.PAYPAL_CLIENT_SECRET;
 if(!id||!secret) throw new Error("PayPal is not configured.");
 const auth=Buffer.from(id+":"+secret).toString("base64");
 const r=await fetch(PAYPAL_BASE+"/v1/oauth2/token",{method:"POST",headers:{Authorization:"Basic "+auth,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",cache:"no-store"});
 const data=await r.json(); if(!r.ok) throw new Error(data?.error_description||"Unable to authenticate with PayPal.");
 return data.access_token;
}
export async function POST(request,{params}){
 try{
  const {orderId}=await params; if(!orderId) return Response.json({error:"Missing PayPal order."},{status:400});
  const token=await accessToken();
  const r=await fetch(PAYPAL_BASE+"/v2/checkout/orders/"+encodeURIComponent(orderId)+"/capture",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","PayPal-Request-Id":"capture-"+orderId},cache:"no-store"});
  const data=await r.json();
  if(!r.ok) return Response.json({error:data?.message||"Unable to capture PayPal payment.",details:data},{status:r.status});
  const unit=data.purchase_units?.[0]; const cap=unit?.payments?.captures?.[0];
  const paid=data.status==="COMPLETED"&&cap?.status==="COMPLETED"&&cap?.amount?.currency_code==="EUR"&&cap?.amount?.value==="1.00";
  if(!paid) return Response.json({error:"Payment was not completed."},{status:409});
  return Response.json({status:"COMPLETED",orderId:data.id,captureId:cap.id});
 }catch(e){return Response.json({error:e.message||"Unable to capture PayPal payment."},{status:500})}
}