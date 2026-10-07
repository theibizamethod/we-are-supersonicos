const GRID_SIZE = 1000;
const TOTAL = GRID_SIZE * GRID_SIZE;

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function memoryNumberToPosition(memoryNumber) {
  const index = Math.max(0, Math.min(TOTAL - 1, memoryNumber - 1));
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  return {
    row,
    col,
    x: (col + 0.5) / GRID_SIZE,
    y: (row + 0.5) / GRID_SIZE,
  };
}

export function prototypePlacement({ name, year, fileName }) {
  const seed = hashString(`${name}|${year}|${fileName}`);
  const memoryNumber = (seed % TOTAL) + 1;
  return { memoryNumber, ...memoryNumberToPosition(memoryNumber) };
}

export function formatMemoryNumber(value) {
  return new Intl.NumberFormat("en-US", { minimumIntegerDigits: 6, useGrouping: false }).format(value);
}

export { GRID_SIZE, TOTAL };


const PLACEMENT_COLS = 160;
const PLACEMENT_ROWS = 125;

function loadImageSource(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function averageFileColor(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = 24; canvas.height = 24;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0, 24, 24);
  const data = ctx.getImageData(0, 0, 24, 24).data;
  let r=0,g=0,b=0,w=0;
  for(let i=0;i<data.length;i+=4){
    const a=data[i+3]/255;
    if(a<0.05) continue;
    r+=data[i]*a; g+=data[i+1]*a; b+=data[i+2]*a; w+=a;
  }
  bitmap.close?.();
  return w ? [r/w,g/w,b/w] : [0,0,0];
}

export async function colorMatchedPlacement(file, masterSrc, occupied=[]) {
  const [r,g,b] = await averageFileColor(file);
  const master = await loadImageSource(masterSrc);
  const canvas = document.createElement("canvas");
  canvas.width=PLACEMENT_COLS; canvas.height=PLACEMENT_ROWS;
  const ctx=canvas.getContext("2d",{willReadFrequently:true});
  ctx.drawImage(master,0,0,PLACEMENT_COLS,PLACEMENT_ROWS);
  const pixels=ctx.getImageData(0,0,PLACEMENT_COLS,PLACEMENT_ROWS).data;
  const used=new Set(occupied.map(m=>{
    const col=Math.max(0,Math.min(PLACEMENT_COLS-1,Math.floor(Number(m.x)*PLACEMENT_COLS)));
    const row=Math.max(0,Math.min(PLACEMENT_ROWS-1,Math.floor(Number(m.y)*PLACEMENT_ROWS)));
    return row*PLACEMENT_COLS+col;
  }));
  const lum=(rr,gg,bb)=>0.2126*rr+0.7152*gg+0.0722*bb;
  const photoLum=lum(r,g,b);
  let best=-1,bestScore=Infinity;
  for(let row=0;row<PLACEMENT_ROWS;row++){
    for(let col=0;col<PLACEMENT_COLS;col++){
      const cell=row*PLACEMENT_COLS+col;
      if(used.has(cell)) continue;
      const i=cell*4, mr=pixels[i], mg=pixels[i+1], mb=pixels[i+2];
      const dr=r-mr,dg=g-mg,db=b-mb;
      const color=Math.sqrt(dr*dr+dg*dg+db*db);
      const light=Math.abs(photoLum-lum(mr,mg,mb));
      const score=color*0.55+light*0.45;
      if(score<bestScore){bestScore=score;best=cell;}
    }
  }
  if(best<0) throw new Error("The artwork is complete.");
  const col=best%PLACEMENT_COLS,row=Math.floor(best/PLACEMENT_COLS);
  return {x:(col+0.5)/PLACEMENT_COLS,y:(row+0.5)/PLACEMENT_ROWS,gridX:col,gridY:row,color:{r:Math.round(r),g:Math.round(g),b:Math.round(b)}};
}
