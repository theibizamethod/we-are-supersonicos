import {NextResponse} from "next/server";
import {DetectFacesCommand,DetectModerationLabelsCommand,RekognitionClient} from "@aws-sdk/client-rekognition";

export const runtime="nodejs";

const client=new RekognitionClient({
 region:process.env.AWS_REGION,
 credentials:{
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
 }
});

const BLOCK_PATTERNS=[
 /Explicit Nudity/i,/Sexual Activity/i,/Graphic (Male|Female) Nudity/i,/Exposed (Male|Female) Genitalia/i,
 /Sex Toys/i,/Graphic Violence/i,/Hate Symbols/i,/Hate Groups/i
];
const REVIEW_PATTERNS=[/Non-Explicit Nudity/i,/Suggestive/i,/Violence/i,/Visually Disturbing/i];

export async function POST(request){
 try{
  if(!process.env.AWS_ACCESS_KEY_ID||!process.env.AWS_SECRET_ACCESS_KEY||!process.env.AWS_REGION){
   return NextResponse.json({error:"Moderation service is not configured."},{status:503});
  }
  const form=await request.formData();
  const photo=form.get("photo");
  if(!photo||typeof photo.arrayBuffer!=="function")return NextResponse.json({error:"Photograph required."},{status:400});
  if(photo.size>15*1024*1024)return NextResponse.json({error:"Photograph is too large."},{status:413});
  const bytes=new Uint8Array(await photo.arrayBuffer());
  const [moderation,faces]=await Promise.all([
   client.send(new DetectModerationLabelsCommand({Image:{Bytes:bytes},MinConfidence:70})),
   client.send(new DetectFacesCommand({Image:{Bytes:bytes},Attributes:["ALL"]}))
  ]);
  const labels=(moderation.ModerationLabels||[]).map(x=>({name:x.Name||"",parent:x.ParentName||"",confidence:x.Confidence||0}));
  const names=labels.map(x=>x.name);
  const blocked=names.filter(n=>BLOCK_PATTERNS.some(r=>r.test(n)));
  const review=names.filter(n=>REVIEW_PATTERNS.some(r=>r.test(n)));
  const ages=(faces.FaceDetails||[]).map(f=>f.AgeRange).filter(Boolean);
  // Rekognition age ranges are estimates, so possible minors are held for review rather than auto-rejected.
  const possibleMinor=ages.some(a=>typeof a.Low==="number"&&a.Low<18);
  if(blocked.length)return NextResponse.json({decision:"reject",reason:"This photograph cannot be accepted under the Participation Rules."});
  if(possibleMinor||review.length)return NextResponse.json({decision:"review",reason:"This photograph needs a quick review before it can be published."});
  const faceBoxes=(faces.FaceDetails||[]).map(f=>f.BoundingBox).filter(Boolean);
  const primaryFace=faceBoxes.sort((a,b)=>(b.Width||0)*(b.Height||0)-(a.Width||0)*(a.Height||0))[0];
  const focus=primaryFace?{
   x:Math.max(0,Math.min(1,(primaryFace.Left||0)+(primaryFace.Width||0)/2)),
   y:Math.max(0,Math.min(1,(primaryFace.Top||0)+(primaryFace.Height||0)/2))
  }:null;
  return NextResponse.json({decision:"allow",focus});
 }catch(error){
  console.error("Rekognition moderation error",error?.name||error);
  return NextResponse.json({error:"We could not check this photograph right now. Please try again."},{status:502});
 }
}
