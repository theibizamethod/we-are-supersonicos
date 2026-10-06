export const runtime="nodejs";
export async function GET(){
 const clientId=process.env.PAYPAL_CLIENT_ID;
 if(!clientId) return Response.json({error:"PayPal is not configured."},{status:500});
 return Response.json({clientId});
}