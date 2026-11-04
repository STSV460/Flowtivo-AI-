import { useEffect, useRef } from 'react';
// Custom canvas alternative to tsParticles: bounded point count, one RAF, paused off-tab.
export function ParticleBackground() {
 const ref = useRef<HTMLCanvasElement>(null);
 useEffect(() => {
  const canvas = ref.current!; const ctx = canvas.getContext('2d'); if (!ctx) return;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, frame = 0, time = 0;
  const pointer = { x: -9999, y: -9999 };
  const points = Array.from({ length: 76 }, (_, i) => ({ x: ((i * 61.31) % 100) / 100, y: ((i * 37.83) % 100) / 100, r: i % 7 === 0 ? 2.1 : 1 }));
  function resize() { width = innerWidth; height = innerHeight; const dpr = Math.min(devicePixelRatio, 1.5); canvas.width = width*dpr; canvas.height = height*dpr; ctx!.setTransform(dpr,0,0,dpr,0,0); }
  function draw() {
   if (!ctx) return; ctx.clearRect(0,0,width,height); time += .002;
   const positions = points.map((p,i) => ({ x: p.x*width + Math.sin(time+i)*9, y: p.y*height + Math.cos(time+i)*10, r:p.r }));
   for (let i=0;i<positions.length;i++) {
    const p=positions[i];
    for(let j=i+1;j<positions.length;j++) { const q=positions[j]; const d=Math.hypot(p.x-q.x,p.y-q.y); if(d<160){ctx.strokeStyle=`rgba(61,147,226,${(1-d/160)*.20})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();} }
    const near=Math.hypot(p.x-pointer.x,p.y-pointer.y)<180;
    ctx.fillStyle=near?'#76eaff':`rgba(83,187,255,${p.r>1?.7:.35})`;ctx.shadowColor='#00d4ff';ctx.shadowBlur=near?15:7;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
   }
   if(!media.matches && !document.hidden) frame=requestAnimationFrame(draw);
  }
  function move(e:PointerEvent){pointer.x=e.clientX;pointer.y=e.clientY;}
  function resume(){cancelAnimationFrame(frame);if(!document.hidden)draw();}
  resize();draw();addEventListener('resize',resize);addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',resume);media.addEventListener('change',resume);
  return ()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',resume);media.removeEventListener('change',resume);};
 },[]);
 return <canvas ref={ref} className="particle-bg" aria-hidden="true" />;
}
