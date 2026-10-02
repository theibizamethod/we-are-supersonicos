const SUPABASE_URL="https://yiflmsubkrlwhweenvca.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpZmxtc3Via3Jsd2h3ZWVudmNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjE0NTUsImV4cCI6MjEwNjMzNzQ1NX0.sPbEvNX6-MDM42NLM1V-S3xtBm-lFdWHkRhQ2sH0qtY";

export async function generateMetadata({params}){
 const {slug}=await params;
 let memory=null;
 try{
  const r=await fetch(SUPABASE_URL+"/rest/v1/memories?select=memory_number,participant_name,memory_year,image_path&public_slug=eq."+encodeURIComponent(slug)+"&publish_status=eq.published&limit=1",{headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY},next:{revalidate:60}});
  if(r.ok){const rows=await r.json();memory=rows[0]||null}
 }catch(e){}
 if(!memory)return {title:"IBIZA I WAS HERE",description:"One million memories. One image of Ibiza."};
 const num=String(memory.memory_number).padStart(6,"0");
 const title="MEMORY #"+num+" · "+memory.participant_name+" · IBIZA I WAS HERE";
 const description="I WAS HERE. "+memory.participant_name+" · Ibiza · "+memory.memory_year+". One million memories. One image of Ibiza.";
 const image=SUPABASE_URL+"/storage/v1/object/public/memories/"+memory.image_path;
 const url="https://ibizaiwashere.com/memory/"+slug;
 return {
  title,description,
  alternates:{canonical:url},
  openGraph:{title,description,url,type:"website",siteName:"IBIZA I WAS HERE",images:[{url:image,alt:"Memory #"+num+" · "+memory.participant_name}]},
  twitter:{card:"summary_large_image",title,description,images:[image]}
 };
}

export default function MemoryLayout({children}){return children}
