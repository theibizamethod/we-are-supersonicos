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
export async function POST(request){
 try{
  const {email}=await request.json();
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({error:"A valid email is required."},{status:400});
  const token=await accessToken();
  const r=await fetch(PAYPAL_BASE+"/v2/checkout/orders",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json","PayPal-Request-Id":crypto.randomUUID()},body:JSON.stringify({intent:"CAPTURE",purchase_units:[{reference_id:"supersonicos-memory",description:"WE ARE SUPERSONICOS · Memory",amount:{currency_code:"EUR",value:"1.00"}}],payment_source:{paypal:{experience_context:{brand_name:"WE ARE SUPERSONICOS",shipping_preference:"NO_SHIPPING",user_action:"PAY_NOW"}}}}),cache:"no-store"});
  const data=await r.json(); if(!r.ok) return Response.json({error:data?.message||"Unable to create PayPal order.",details:data},{status:r.status});
  return Response.json({id:data.id});
 }catch(e){return Response.json({error:e.message||"Unable to create PayPal order."},{status:500})}
}