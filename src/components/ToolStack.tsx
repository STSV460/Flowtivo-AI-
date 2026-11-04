import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { tools } from '../data/tools';

const rings=[
  {size:56,duration:72,direction:1,phase:0},
  {size:66,duration:72,direction:1,phase:90},
  {size:77,duration:72,direction:1,phase:45},
  {size:88,duration:72,direction:1,phase:135},
];

function ToolSymbol({slug,color}:{slug:string,color:string}) {
  if(slug==='google-workspace')return <img className="orbit-tool-image" src="/tools/google-workspace.png" alt="" width={20} height={20}/>;
  if(slug==='retell'||slug==='bolna')return <img className="orbit-tool-image" src={`/tools/${slug}.svg`} alt="" width={slug==='retell'?346:66} height={slug==='retell'?346:42}/>;
  return <span className="tool-brand-icon" style={{backgroundColor:color,maskImage:`url(/tools/${slug}.svg)`,WebkitMaskImage:`url(/tools/${slug}.svg)`}}/>;
}

function OrbitScene({running,onHoverChange}:{running:boolean,onHoverChange:(hovered:boolean)=>void}) {
  const stageRef=useRef<HTMLDivElement>(null),canvasRef=useRef<HTMLCanvasElement>(null);
  const nodesRef=useRef<(HTMLSpanElement|null)[]>([]),clockRef=useRef(0);
  useEffect(()=>{
    const stage=stageRef.current!,canvas=canvasRef.current!;
    const context=canvas.getContext('2d');if(!context)return;
    const points=Array.from({length:950},(_,index)=>{
      const y=1-2*(index+.5)/950,radius=Math.sqrt(1-y*y),angle=index*2.3999632297;
      return {x:Math.cos(angle)*radius,y,z:Math.sin(angle)*radius,size:index%23===0?2.1:index%7===0?1.55:1.15};
    });
    let size=0,stageWidth=0,stageHeight=0,frame=0,lastTime=0;
    let orbitRadii:number[]=[];
    function placeTools(){
      nodesRef.current.forEach((node,index)=>{
        if(!node)return;
        const ring=rings[Math.floor(index/2)];
        const radius=orbitRadii[Math.floor(index/2)]||0;
        const angle=(ring.phase+(index%2)*180)*Math.PI/180+clockRef.current*Math.PI*2*ring.direction/ring.duration;
        // Translate positions only. The mark and its caption never rotate.
        node.style.transform=`translate(${Math.cos(angle)*radius}px,${Math.sin(angle)*radius}px)`;
      });
    }
    function draw(){
      if(!context||!size)return;
      context.clearRect(0,0,size,size);
      const half=size/2,radius=size*.455,angle=.35+clockRef.current*.12;
      const cosine=Math.cos(angle),sine=Math.sin(angle),tilt=-.18;
      const glow=context.createRadialGradient(half,half,0,half,half,half);
      glow.addColorStop(0,'rgba(71,112,165,.07)');glow.addColorStop(1,'rgba(71,112,165,0)');
      context.fillStyle=glow;context.fillRect(0,0,size,size);
      const visiblePoints=points.map(point=>{
        const x=point.x*cosine+point.z*sine,z=-point.x*sine+point.z*cosine;
        const y=point.y*Math.cos(tilt)-z*Math.sin(tilt),depth=point.y*Math.sin(tilt)+z*Math.cos(tilt),perspective=1/(1-depth*.08);
        return {x:half+x*radius*perspective,y:half+y*radius*perspective,depth,size:point.size*(size/520)*perspective};
      }).sort((a,b)=>a.depth-b.depth);
      for(const point of visiblePoints){
        context.fillStyle=`rgba(204,222,242,${.18+(point.depth+1)*.36})`;
        context.beginPath();context.arc(point.x,point.y,Math.max(.8,point.size),0,Math.PI*2);context.fill();
      }
      placeTools();
    }
    function resize(){
      const bounds=stage.getBoundingClientRect();stageWidth=bounds.width;stageHeight=bounds.height;
      const badges=Array.from(stage.querySelectorAll<HTMLElement>('.orbit-badge'));
      const labels=Array.from(stage.querySelectorAll<HTMLElement>('.orbit-label'));
      const badgeSize=Math.max(0,...badges.map(node=>node.getBoundingClientRect().height));
      const labelHeight=Math.max(0,...labels.map(node=>node.getBoundingClientRect().height));
      const labelWidth=Math.max(0,...labels.map(node=>node.getBoundingClientRect().width));
      const labelGap=labels[0]?Math.max(0,parseFloat(getComputedStyle(labels[0]).top)-badgeSize):6;
      const maxRadius=Math.max(0,Math.min(stageWidth/2-Math.max(badgeSize,labelWidth)/2-8,stageHeight/2-badgeSize/2-labelGap-labelHeight-8));
      orbitRadii=rings.map(ring=>maxRadius*ring.size/rings[rings.length-1].size);
      stage.querySelectorAll<HTMLElement>('.orbit-track').forEach((track,index)=>track.style.setProperty('--orbit-size',`${orbitRadii[index]*2}px`));
      size=canvas.getBoundingClientRect().width;
      const dpr=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);
      context!.setTransform(dpr,0,0,dpr,0,0);draw();
    }
    function tick(time:number){
      if(lastTime&&time-lastTime<32){frame=requestAnimationFrame(tick);return;}
      const delta=lastTime?Math.min((time-lastTime)/1000,.08):0;
      lastTime=time;clockRef.current+=delta;draw();frame=requestAnimationFrame(tick);
    }
    const observer=new ResizeObserver(resize);observer.observe(stage);resize();
    if(running)frame=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(frame);observer.disconnect();};
  },[running]);
  return <div ref={stageRef} className={`tools-stage ${running?'is-running':''}`} aria-hidden="true">
    <canvas ref={canvasRef} className="orbit-globe"/>
    {rings.map(ring=><div key={ring.size} className="orbit-track" style={{'--orbit-size':`${ring.size}%`} as CSSProperties}/>)}
    {tools.map((tool,index)=>{
      return <span key={tool.slug} ref={node=>{nodesRef.current[index]=node;}} className="orbit-moving-node" style={{'--tool-color':tool.color} as CSSProperties}>
        <span className="orbit-badge" onPointerEnter={event=>{if(event.pointerType==='mouse')onHoverChange(true);}} onPointerLeave={()=>onHoverChange(false)}><ToolSymbol slug={tool.slug} color={tool.color}/><span className="orbit-label">{tool.name}</span></span>
      </span>;
    })}
  </div>;
}

export function ToolStack() {
  const sectionRef=useRef<HTMLElement>(null);
  const [visible,setVisible]=useState(false),[pageVisible,setPageVisible]=useState(!document.hidden);
  const [paused,setPaused]=useState(false),[hovered,setHovered]=useState(false);
  const reduced=Boolean(useReducedMotion());
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.05});observer.observe(sectionRef.current!);
    const visibility=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',visibility);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
  },[]);
  const running=visible&&pageVisible&&!paused&&!hovered&&!reduced;
  return <section ref={sectionRef} id="tools" tabIndex={-1} className="container tools-section anchor-target" aria-labelledby="tools-heading">
    <div className="tools-heading"><span className="eyebrow">OUR TOOLKIT</span><h2 id="tools-heading">The right tools.<br/><span className="gradient-text">One connected system.</span></h2><p>Automation, AI, data and development—brought together around the way your business works.</p></div>
    <div className="tool-animation-controls">{!reduced&&<button type="button" aria-pressed={paused} aria-label={paused?'Resume toolkit animation':'Pause toolkit animation'} onClick={()=>setPaused(value=>!value)}>{paused?<Play size={13}/>:<Pause size={13}/>}<span>{paused?'Resume':'Pause'}</span></button>}</div>
    <OrbitScene running={running} onHoverChange={setHovered}/>
    <ul className="tool-legend" aria-label="Tools we work with">{tools.map(tool=><li key={tool.slug}>{tool.name}</li>)}</ul>
  </section>;
}
