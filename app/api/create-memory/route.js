export const runtime="nodejs";
const PAYPAL_BASE="https://api-m.paypal.com";
const SUPABASE_URL="https://yiflmsubkrlwhweenvca.supabase.co";\nconst MAILERLITE_GROUP_ID="200657218546173573";

async function paypalToken(){
 const id=process.env.PAYPAL_CLIENT_ID,secret=process.env.PAYPAL_CLIENT_SECRET;
 if(!id||!secret)throw new Error("PayPal is not configured.");
 const auth=Buffer.from(id+":"+secret).toString("base64");
 const r=await fetch(PAYPAL_BASE+"/v1/oauth2/token",{method:"POST",headers:{Authorization:"Basic "+auth,"Content-Type":"application/x-www-form-urlencoded"},body:"grant_type=client_credentials",cache:"no-store"});
 const d=await r.json();if(!r.ok)throw new Error(d?.error_description||"Unable to authenticate with PayPal.");return d.access_token;
}
async function verifyPayment(orderId,captureId){
 const token=await paypalToken();
 const r=await fetch(PAYPAL_BASE+"/v2/checkout/orders/"+encodeURIComponent(orderId),{headers:{Authorization:"Bearer "+token},cache:"no-store"});
 const d=await r.json();if(!r.ok)throw new Error("Unable to verify PayPal payment.");
 const cap=d.purchase_units?.flatMap(u=>u.payments?.captures||[]).find(c=>c.id===captureId);
 if(d.status!=="COMPLETED"||!cap||cap.status!=="COMPLETED"||cap.amount?.currency_code!=="EUR"||cap.amount?.value!=="1.00")throw new Error("Confirmed €1 PayPal payment is required.");
 return true;
}
export async function POST(request){
 try{
  const form=await request.formData();
  const orderId=String(form.get("paypal_order_id")||"").trim(),captureId=String(form.get("paypal_capture_id")||"").trim();
  if(!orderId||!captureId)return Response.json({error:"Confirmed payment is required."},{status:402});
  await verifyPayment(orderId,captureId);
  const key=process.env.SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||"sb_publishable_dhZvmnCkAjySaNgKeQESng_pSjLhE91";
  const r=await fetch(SUPABASE_URL+"/functions/v1/create-memory",{method:"POST",headers:{Authorization:"Bearer "+key,apikey:key},body:form,cache:"no-store"});
  const d=await r.json();
  if(r.ok&&d?.memory&&process.env.MAILERLITE_API_TOKEN){
   const email=String(form.get("email")||"").trim();
   if(email){
    const memoryNo=String(d.memory.memory_number).padStart(6,"0");
    const memoryUrl="https://supersonicos.ibizasonica.com/memory/"+d.memory.public_slug;
    try{
     const ml=await fetch("https://connect.mailerlite.com/api/subscribers",{method:"POST",headers:{Authorization:"Bearer "+process.env.MAILERLITE_API_TOKEN,"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({email,fields:{name:String(form.get("name")||"").trim(),supersonicos_memory:"#"+memoryNo,supersonicos_url:memoryUrl},groups:[MAILERLITE_GROUP_ID]}),cache:"no-store"});
     if(!ml.ok)console.error("MailerLite subscriber sync failed",ml.status);
    }catch(e){console.error("MailerLite subscriber sync failed",e)}
   }
  }
  return Response.json(d,{status:r.status});
 }catch(e){return Response.json({error:e?.message||"Unable to create memory."},{status:500})}
}