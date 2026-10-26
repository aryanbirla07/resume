import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,Check,ChevronRight,Compass,Download,ExternalLink,Github,Linkedin,Mail,Map,Menu,Pause,Play,Settings2,Volume2,VolumeX,X} from 'lucide-react';
import {World} from './experience/World';
import {portfolio,chapters,arenaRingProgress,chapterAt,skillRingCount,journeyCompletion,clamp01} from './data/portfolio';
import {ResumeView} from './ui/ResumeView';
import './style.css';

gsap.registerPlugin(ScrollTrigger);
const chapterIndex=(chapter)=>chapters.findIndex(c=>c.id===chapter.id);

class WorldBoundary extends React.Component{
  constructor(props){super(props);this.state={failed:false};}
  static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(error){console.error('3D experience unavailable. The content remains accessible.',error);}
  render(){return this.state.failed?<div className="scene-fallback" aria-label="Interactive scene unavailable"/>:this.props.children;}
}

function displayText(value,fallback='—'){
  if(value===null||value===undefined||value==='')return fallback;
  if(typeof value==='string'||typeof value==='number')return String(value);
  if(Array.isArray(value))return value.map(item=>displayText(item,'')).filter(Boolean).join(' · ')||fallback;
  if(typeof value==='object')return Object.values(value).map(item=>displayText(item,'')).filter(Boolean).join(' · ')||fallback;
  return fallback;
}

function displayList(value){
  if(!Array.isArray(value))return [];
  return value.map(item=>displayText(item,'')).filter(Boolean);
}

function useAmbientSound(){
  const ref=useRef(null);const [enabled,setEnabled]=useState(false);
  const toggle=async()=>{
    try{
      if(!ref.current){
        const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
        const ctx=new Audio(),master=ctx.createGain();master.gain.value=.0001;master.connect(ctx.destination);
        const tones=[[55,.15],[82.41,.12],[110,.075],[164.81,.042]].map(([freq,vol])=>{
          const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(master);o.start();return o;
        });
        ref.current={ctx,master,tones};
      }
      const {ctx,master}=ref.current;
      if(!enabled)await ctx.resume();
      master.gain.setTargetAtTime(enabled?.0001:.14,ctx.currentTime,.33);
      setEnabled(!enabled);
    }catch(e){console.warn('Sound playback unavailable',e);setEnabled(false);}
  };
  useEffect(()=>()=>{const a=ref.current;if(a){a.tones.forEach(t=>{try{t.stop()}catch{}});a.ctx.close().catch(()=>{});}},[]);
  return{enabled,toggle};
}

function Insignia({size=34}){
  return <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden="true"><path d="M26 2 46 26 26 50 6 26 26 2Z" stroke="currentColor" strokeWidth=".9"/><path d="M26 10 40 26 26 42 12 26 26 10Z" stroke="currentColor" strokeOpacity=".45" strokeWidth=".7"/><path d="M26 11v30M11 26h30M18 18l16 16M34 18 18 34" stroke="currentColor" strokeWidth=".55"/><circle cx="26" cy="26" r="3.9" fill="currentColor"/></svg>;
}
function Brand({onClick}){
  return <button className="brand" onClick={onClick} aria-label="Return to beginning"><Insignia size={35}/><span className="brand-word"><strong>THE ENCHANTED JOURNEY</strong><small>AN INTERACTIVE CHRONICLE</small></span></button>;
}
function Eyebrow({children,number}){return <div className="eyebrow">{number&&<span className="eyebrow-number">{number}</span>}<span className="eyebrow-line"/>{children}</div>;}
function ActionLink({href,children}){return href?<a href={href} target="_blank" rel="noreferrer" className="text-link">{children}<ArrowUpRight size={15}/></a>:null;}

function ProjectGallery({projects,onProject}){
  return <div className="project-gallery" aria-label="Selected projects">
    {projects.slice(0,4).map((project,index)=>{
      const stack=displayList(project.stack);
      const content=<>
        <span className="project-card-index">{displayText(project.number,String(index+1).padStart(2,'0'))}</span>
        <span className="project-card-category">{displayText(project.category,'PROJECT')}</span>
        <strong>{displayText(project.title,'Selected work')}</strong>
        <span className="project-card-description">{displayText(project.description,'Project details coming soon.')}</span>
        <span className="project-card-stack">{stack.length?stack.slice(0,3).join(' · '):'Details coming soon'}</span>
        <span className="project-card-link">{project.href?'OPEN PROJECT':'URL TO BE ADDED'} {project.href?<ArrowUpRight size={16}/>:<span aria-hidden="true">—</span>}</span>
      </>;
      return project.href?
        <a key={project.id} className="project-card project-card-linkable" href={project.href} target="_blank" rel="noreferrer">{content}</a>:
        <button key={project.id} className="project-card" onClick={()=>onProject(project)}>{content}</button>;
    })}
  </div>;
}

function Intro({onBegin,onAtlas}){
  return <div className="intro-screen">
    <div className="intro-atmosphere intro-depth-back" aria-hidden="true"/>
    <div className="intro-atmosphere intro-depth-front" aria-hidden="true"/>
    <div className="intro-content">
      <Eyebrow number="PROLOGUE">A CHRONICLE OF CODE & CURIOSITY</Eyebrow>
      <div className="intro-index">ISSUE Nº 001 <span>—</span> 2026</div>
      <h1>Some stories<br/>aren't written.<br/><em>They're built.</em></h1>
      <p className="intro-role">{portfolio.title}<span className="role-separator"/>{portfolio.location}</p>
      <p className="intro-sub">A personal journey across architecture, imagination and the things I've made. Best experienced slowly.</p>
      <div className="intro-actions">
        <button className="primary-cta" onClick={onBegin}>ENTER THE JOURNEY <ArrowRight size={16}/></button>
        <button className="secondary-cta" onClick={onAtlas}>VIEW WORLD MAP <Compass size={16}/></button>
      </div>
    </div>
    <div className="intro-endnote"><span>01 — ORIGINAL INTERACTIVE WORLD</span><i/><span>BUILT FOR THE CURIOUS</span></div>
    <div className="intro-side-note">EST. IN IMAGINATION <span> / </span> CRAFTED IN CODE</div>
  </div>;
}

function AtlasModal({onClose,onTravel,currentIndex,unlocked}){
  return <div className="modal-shade" onMouseDown={onClose}>
    <div className="modal-content atlas-modal" role="dialog" aria-modal="true" aria-label="World map" onMouseDown={e=>e.stopPropagation()}>
      <div className="modal-heading"><Eyebrow number="THE ATLAS">DIRECT TRAVEL</Eyebrow><button className="bare-close" onClick={onClose} aria-label="Close map"><X size={21}/></button></div>
      <h2>The kingdom<br/><em>is yours to explore.</em></h2>
      <p>Every location tells a different part of the story. Visit any chapter without completing a challenge first.</p>
      <div className="atlas-grid">
        {chapters.map((chapter,i)=><button onClick={()=>onTravel(chapter.id)} key={chapter.id} className={'atlas-entry '+(currentIndex===i?'selected':'')}>
          <span className="atlas-entry-number">{chapter.index}</span>
          <span className="atlas-entry-copy"><strong>{chapter.name}</strong><small>{chapter.tag} · {chapter.mood}</small></span>
          <span className="atlas-entry-end">{i<=unlocked?<Check size={15}/>:<ArrowUpRight size={15}/>}</span>
        </button>)}
      </div>
      <div className="modal-foot">CHOOSE A DESTINATION <span>·</span> THE FLIGHT IS ALWAYS YOURS</div>
    </div>
  </div>;
}
function ProjectModal({project,onClose}){
  if(!project)return null;
  const stack=displayList(project.stack);
  return <div className="modal-shade" onMouseDown={onClose}>
    <div className="modal-content detail-modal" role="dialog" aria-modal="true" aria-label={`${project.title} details`} onMouseDown={e=>e.stopPropagation()}>
      <div className="modal-heading"><Eyebrow number={`ARCHIVE ${project.number}`}>PROJECT STUDY</Eyebrow><button onClick={onClose} className="bare-close" aria-label="Close project details"><X size={20}/></button></div>
      <div className="detail-visual" aria-hidden="true"><div className="detail-symbol"><Insignia size={106}/></div><span>SELECTED WORK — {project.number}</span></div>
      <div className="fine-label">{displayText(project.category,'PROJECT')}</div>
      <h2>{displayText(project.title,'Selected work')}</h2>
      <p className="modal-lead">{displayText(project.description,'Project details will be added here.')}</p>
      <div className="detail-lines"><div><small>TECHNOLOGIES</small><p>{stack.length?stack.join(' / '):'Details coming soon'}</p></div><div><small>THE OUTCOME</small><p>{displayText(project.outcome,'Details coming soon')}</p></div></div>
      <div className="modal-actions">{project.href&&<ActionLink href={project.href}>LIVE PROJECT</ActionLink>}{project.source&&<ActionLink href={project.source}>SOURCE CODE</ActionLink>}{!project.href&&!project.source&&<span className="placeholder-note">Add verified project URLs in <code>src/data/portfolio.js</code>.</span>}</div>
    </div>
  </div>;
}

function DisplayCard({chapter,children,wide=false}){
  return <section className={'display-section '+(wide?'wide':'')} aria-labelledby={'section-'+chapter.id}>
    <div className="display-meta"><Eyebrow number={chapter.index}>{chapter.tag}</Eyebrow><span className="display-region">{chapter.location}</span></div>
    {children}
    <div className="display-edge">THE ENCHANTED JOURNEY <span> / </span> {chapter.index}—13</div>
  </section>;
}
function FlightCard({chapter,progress}){
  return <div className="flight-story">
    <Eyebrow number={chapter.index}>{chapter.tag}</Eyebrow>
    <h2>{chapter.id==='forest'?<>Let the world<br/><em>fall away.</em></>:chapter.id==='viaduct'?<>Across what<br/><em>time forgot.</em></>:<>Through the<br/><em>iron gates.</em></>}</h2>
    <p>{chapter.subtitle}</p>
    <div className="flight-note"><span className="round-graphic">↘</span><span>SCROLL CONTROLS YOUR FLIGHT</span><span className="flight-note-n">{journeyCompletion(progress)}%</span></div>
  </div>;
}
function ArenaCard({chapter,progress}){
  const unlocked=skillRingCount(progress), suggested=Math.min(4,Math.max(0,unlocked===0?0:unlocked-1));
  const [selection,setSelection]=useState(null);
  const selected=selection===null?suggested:selection;
  const skill=portfolio.skills[selected];
  return <DisplayCard chapter={chapter} wide>
    <div className="arena-header"><div><div className="panel-overline">THE AERIAL TRIALS</div><h2>Craft is <em>earned.</em></h2><p>Five passes. Five disciplines. Every ring reveals a different part of the work.</p></div>
      <div className="arena-score"><small>RINGS CROSSED</small><strong>{String(unlocked).padStart(2,'0')}<span> / 05</span></strong><i/></div></div>
    <div className="trial-track" aria-label="Five aerial skill challenges">
      {portfolio.skills.map((s,i)=><button key={s.id} className={'trial-node '+(i===selected?'active':'')+' '+(i<unlocked?'earned':'')} onClick={()=>setSelection(i)} title={s.group}>
        <span className="trial-orbit">{i<unlocked?<Check size={15}/>:String(i+1).padStart(2,'0')}</span><small>{s.short}</small>
      </button>)}
    </div>
    <div className="trial-detail" key={selected}>
      <div><div className="fine-label">DISCIPLINE {String(selected+1).padStart(2,'0')} / 05</div><h3>{skill.group}</h3><p>{skill.note}</p><div className="microchips">{skill.items.map(item=><span key={item}>{item}</span>)}</div></div>
      <div className="trial-evidence"><span>PROOF OF PRACTICE</span><p>{skill.evidence}</p></div>
    </div>
    <div className="panel-bottom-line"><span>THE PATH ADVANCES AS YOU SCROLL</span><span>{unlocked===5?'TRIAL COMPLETE':'FOLLOW THE NEXT RING'} <ArrowDown size={13}/></span></div>
  </DisplayCard>;
}
function StageContent({chapter,progress,onTravel,onProject}){
  switch(chapter.kind){
    case 'intro':return <div className="flight-story"><Eyebrow number="00">THE FIRST STEP</Eyebrow><h2>The story<br/><em>begins here.</em></h2><p>Scroll forward. The broom follows an authored route through the kingdom.</p><div className="flight-note"><span className="round-graphic">↓</span><span>SCROLL TO LAUNCH</span></div></div>;
    case 'flight':return <FlightCard chapter={chapter} progress={progress}/>;
    case 'about':return <DisplayCard chapter={chapter}>
      <div className="fine-label">THE PERSON BEHIND THE WORK</div>
      <h2>Curiosity meets<br/><em>craft.</em></h2>
      <p className="display-lead">I'm {portfolio.name}, a {portfolio.title.toLowerCase()}.</p>
      <p>{portfolio.introduction}</p>
      <div className="section-rule"><Insignia size={25}/></div>
      <p className="display-muted">{portfolio.about}</p>
      <button className="section-link" onClick={()=>onTravel('courtyard')}>THE NEXT CHAPTER <ArrowRight size={16}/></button>
    </DisplayCard>;
    case 'identity':return <DisplayCard chapter={chapter}>
      <div className="fine-label">WHAT GUIDES THE WORK</div><h2>Built on<br/><em>principle.</em></h2>
      <p>To create something memorable, the decisions beneath the surface matter as much as the visuals above it.</p>
      <div className="values-list"><div><span>01</span><strong>Clarity</strong><small>Make complex things feel simple.</small></div><div><span>02</span><strong>Craft</strong><small>Care about the overlooked details.</small></div><div><span>03</span><strong>Curiosity</strong><small>Keep learning, building and questioning.</small></div></div>
    </DisplayCard>;
    case 'arena':return <ArenaCard chapter={chapter} progress={progress}/>;
    case 'forge':return <DisplayCard chapter={chapter}>
      <div className="fine-label">FROM IDEA TO EXECUTION</div><h2>Ideas enter.<br/><em>Systems emerge.</em></h2>
      <p>Every product starts with a question. The forge represents a practical process, not a list of buzzwords.</p>
      <div className="process-list"><div><b>01</b><strong>Understand</strong><span>Explore the problem and its constraints.</span></div><div><b>02</b><strong>Build</strong><span>Prototype, ship, iterate and communicate.</span></div><div><b>03</b><strong>Refine</strong><span>Measure, simplify and improve the experience.</span></div></div>
    </DisplayCard>;
    case 'library':return <DisplayCard chapter={chapter}>
      <div className="fine-label">CONTINUOUS STUDY</div><h2>The mind is<br/><em>never finished.</em></h2>
      <p>Ideas gathered along the way. These categories should ultimately contain only the tools you genuinely use.</p>
      <div className="archive-list">{portfolio.skills.slice(0,4).map((item,i)=><div key={item.id}><span>{String(i+1).padStart(2,'0')}</span><strong>{item.group}</strong><small>{item.items.slice(0,2).join(' · ')}</small></div>)}</div>
    </DisplayCard>;
    case 'projects':return <section className="project-stage" aria-labelledby="project-stage-title">
      <div className="project-stage-heading"><div><Eyebrow number={chapter.index}>{chapter.tag}</Eyebrow><div className="fine-label">SELECTED PROJECTS</div><h2 id="project-stage-title">Built for<br/><em>the real world.</em></h2></div><span className="project-stage-location">{chapter.location}</span></div>
      <p className="project-stage-lead">Four selected pieces, presented directly. Open a verified project link or choose a card to read the available details.</p>
      <ProjectGallery projects={portfolio.projects} onProject={onProject}/>
      <div className="project-stage-foot">SELECTED WORK <span>/</span> FOUR STORIES <span>/</span> DIRECT LINKS WHERE VERIFIED</div>
    </section>;
    case 'experience':return <DisplayCard chapter={chapter}>
      <div className="fine-label">AN EVOLVING PRACTICE</div><h2>Every chapter<br/><em>leaves a mark.</em></h2>
      <p>Work, lessons and the people who helped shape the next decision.</p>
      <div className="chronology">{portfolio.experience.map(item=><div key={item.id} className="chrono-event"><span>{item.period}</span><strong>{item.role}</strong><small>{item.company}</small><p>{item.description}</p></div>)}</div>
    </DisplayCard>;
    case 'achievements':return <DisplayCard chapter={chapter}>
      <div className="fine-label">MILESTONES & CONTRIBUTIONS</div><h2>What remains<br/><em>after the work.</em></h2><p>Not invented awards or vanity scores: real milestones, when you're ready to add them.</p>
      <div className="relic-list">{portfolio.achievements.map(a=><div key={a.number}><span>{a.number}</span><strong>{a.label}</strong><small>{a.detail}</small></div>)}</div>
    </DisplayCard>;
    case 'contact':return <DisplayCard chapter={chapter}>
      <div className="fine-label">THE LETTER NEVER SENT</div><h2>Write the<br/><em>next chapter.</em></h2>
      <p>Have a project, collaboration or opportunity in mind? Let's make something worth remembering.</p>
      <div className="contact-link-list">
        {portfolio.email?<a href={`mailto:${portfolio.email}`}>SEND A MESSAGE <ArrowUpRight size={17}/></a>:<span>Add your email in portfolio.js to enable contact.</span>}
        {portfolio.github&&<ActionLink href={portfolio.github}>GITHUB</ActionLink>}
        {portfolio.linkedin&&<ActionLink href={portfolio.linkedin}>LINKEDIN</ActionLink>}
      </div>
    </DisplayCard>;
    case 'finale':return <div className="finale-story"><Eyebrow number="EPILOGUE">THE GOLDEN HORIZON</Eyebrow><h2>The story<br/><em>continues.</em></h2><p>{portfolio.tagline}</p><button className="primary-cta" onClick={()=>onTravel('arrival')}>FLY AGAIN <ArrowRight size={16}/></button><a className="understated-link" href="/resume">OPEN READABLE RESUME <ArrowUpRight size={14}/></a></div>;
    default:return null;
  }
}

function SettingsPanel({quality,setQuality,motion,setMotion,sound,onClose}){
  return <div className="prefs" role="dialog" aria-label="Journey preferences"><div className="prefs-title"><span>EXPERIENCE SETTINGS</span><button onClick={onClose} aria-label="Close settings"><X size={16}/></button></div>
    <div className="pref-line"><span>Visual detail</span><div className="pref-buttons"><button className={quality==='standard'?'active':''} onClick={()=>setQuality('standard')}>BALANCED</button><button className={quality==='high'?'active':''} onClick={()=>setQuality('high')}>HIGH</button></div></div>
    <div className="pref-line"><span>Reduced motion</span><button className={'pref-switch '+(motion?'on':'')} onClick={()=>setMotion(m=>!m)} aria-pressed={motion}>{motion?'ON':'OFF'}</button></div>
    <div className="pref-line"><span>Ambient audio</span><button className={'pref-switch '+(sound.enabled?'on':'')} onClick={sound.toggle} aria-pressed={sound.enabled}>{sound.enabled?'ON':'OFF'}</button></div>
    <p>The route and content remain available when animations are disabled. Audio starts muted.</p>
  </div>;
}

function App(){
  const [started,setStarted]=useState(false),[progress,setProgress]=useState(0);
  const [modal,setModal]=useState(''),[project,setProject]=useState(null),[prefs,setPrefs]=useState(false),[mobileMenu,setMobileMenu]=useState(false);
  const [reduceMotion,setReduceMotion]=useState(false),[webgl,setWebgl]=useState(true),[quality,setQuality]=useState('high'),[toast,setToast]=useState(null),[paused,setPaused]=useState(false);
  const [maxChapter,setMaxChapter]=useState(0);
  const progressRef=useRef(0),startedRef=useRef(false),pointerRef=useRef({x:0,y:0}),journey=useRef(null),lastRing=useRef(0),sound=useAmbientSound();
  const active=chapterAt(progress),index=chapterIndex(active),ringCount=skillRingCount(progress);
  const view3d=webgl&&!reduceMotion;
  useEffect(()=>{
    const mq=window.matchMedia('(prefers-reduced-motion:reduce)');setReduceMotion(mq.matches);
    if(window.innerWidth<850||(navigator.deviceMemory&&navigator.deviceMemory<=4))setQuality('standard');
    try{const canvas=document.createElement('canvas');setWebgl(!!(canvas.getContext('webgl2')||canvas.getContext('webgl')));}catch{setWebgl(false);}
    const follow=e=>{
      const x=clamp01(e.clientX/window.innerWidth)*2-1,y=clamp01(e.clientY/window.innerHeight)*2-1;
      pointerRef.current={x,y};
      document.documentElement.style.setProperty('--pointer-x',`${x}`);
      document.documentElement.style.setProperty('--pointer-y',`${y}`);
    };
    window.addEventListener('pointermove',follow,{passive:true});return()=>window.removeEventListener('pointermove',follow);
  },[]);
  useEffect(()=>{startedRef.current=started;},[started]);
  useEffect(()=>{
    if(!started||!journey.current)return;
    const trigger=ScrollTrigger.create({trigger:journey.current,start:'top top',end:'bottom bottom',onUpdate:self=>{
      if(paused)return;
      const value=clamp01(self.progress);progressRef.current=value;
      setProgress(prev=>Math.abs(prev-value)>.001?Math.round(value*1000)/1000:prev);
      const count=skillRingCount(value);
      if(count>lastRing.current){const skill=portfolio.skills[count-1];setToast({title:'SKILL DISCOVERED',detail:skill.group,number:`0${count} / 05`});}
      lastRing.current=count;
    }});
    ScrollTrigger.refresh();return()=>trigger.kill();
  },[started,paused]);
  useEffect(()=>{setMaxChapter(m=>Math.max(m,index));},[index]);
  useEffect(()=>{if(!toast)return;const id=window.setTimeout(()=>setToast(null),2500);return()=>clearTimeout(id);},[toast]);
  useEffect(()=>{document.body.style.overflow=modal||project?'hidden':'';return()=>{document.body.style.overflow='';};},[modal,project]);
  const travel=(chapterId)=>{
    const dest=chapters.find(c=>c.id===chapterId)||chapters[0];setModal('');setMobileMenu(false);setPrefs(false);setProject(null);setPaused(false);
    if(dest.id==='arrival'&&started){setStarted(false);setProgress(0);progressRef.current=0;lastRing.current=0;window.scrollTo({top:0,behavior:'instant'});return;}
    if(!started)setStarted(true);
    const scroll=()=>{
      if(!journey.current){requestAnimationFrame(scroll);return;}
      const rect=journey.current.getBoundingClientRect();
      const start=window.scrollY+rect.top;
      const distance=Math.max(0,journey.current.offsetHeight-window.innerHeight);
      window.scrollTo({top:start+dest.progress*distance,behavior:reduceMotion?'instant':'smooth'});
    };
    requestAnimationFrame(()=>requestAnimationFrame(scroll));
  };
  useEffect(()=>{
    const handler=e=>{
      if(e.key==='Escape'){setModal('');setPrefs(false);setProject(null);setMobileMenu(false);}
      if(!started||modal||project||prefs||e.altKey||e.ctrlKey||e.metaKey)return;
      if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
      if(e.key==='PageDown'||e.key==='PageUp'){
        e.preventDefault();const offset=e.key==='PageDown'?1:-1;
        const target=chapters[Math.max(0,Math.min(chapters.length-1,index+offset))];travel(target.id);
      }
    };
    window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler);
  },[started,index,modal,project,prefs,reduceMotion]);
  if(window.location.pathname.replace(/\/$/,'')==='/resume')return <ResumeView/>;
  return <div className={'site '+(started?'journey-active':'journey-intro')+(reduceMotion?' low-motion':'')}>
    <a className="skip-link" href="/resume">Skip animation and open readable resume</a>
    <div className="scene-layer scene-depth-back" aria-hidden="true"><WorldBoundary>{view3d?<World quality={quality} progressRef={progressRef} startedRef={startedRef} pointerRef={pointerRef}/>:<div className="scene-fallback"/>}</WorldBoundary></div>
    <div className="world-veil" aria-hidden="true"/><div className="film-grain" aria-hidden="true"/>
    <header className="topbar">
      <Brand onClick={()=>travel('arrival')}/>
      <nav className="top-links" aria-label="Main navigation"><button onClick={()=>setModal('atlas')}>WORLD ATLAS</button><button onClick={()=>travel('arena')}>SKILLS TRIALS</button><button onClick={()=>travel('nexus')}>SELECTED WORK</button><button onClick={()=>travel('owl')}>CONTACT</button></nav>
      <div className="top-actions"><a href="/resume" className="resume-action">THE RESUME <ArrowUpRight size={13}/></a><button className="menu-icon" onClick={()=>setMobileMenu(v=>!v)} aria-label="Toggle navigation" aria-expanded={mobileMenu}>{mobileMenu?<X size={22}/>:<Menu size={22}/>}</button></div>
    </header>
    {mobileMenu&&<nav className="mobile-menu" aria-label="Mobile chapters">{chapters.map(c=><button key={c.id} onClick={()=>travel(c.id)}><span>{c.index}</span>{c.name}<ArrowRight size={14}/></button>)}<a href="/resume">THE TEXT RESUME <ArrowUpRight size={15}/></a></nav>}
    {!started?<Intro onBegin={()=>setStarted(true)} onAtlas={()=>setModal('atlas')}/>:<main ref={journey} className="journey-track"><div className="journey-sticky">
      <div key={active.id} className="chapter-stage"><StageContent chapter={active} progress={progress} onTravel={travel} onProject={setProject}/></div>
      <div className="stage-counter" aria-hidden="true"><span>CHAPTER {active.index}</span><i/><span>{active.name.toUpperCase()}</span></div>
      <div className="waypoints" aria-label="Chapter destinations">{chapters.map((c,i)=><button key={c.id} aria-label={`Go to ${c.name}`} aria-current={i===index?'step':undefined} className={i===index?'current':i<index?'visited':''} onClick={()=>travel(c.id)}><span className="waypoint-dot"/><span className="waypoint-tooltip">{c.name}</span></button>)}</div>
    </div></main>}
    <div className="chrome-side" aria-hidden="true"><span>WORLD Nº 01</span><i/><span>DESIGNED TO BE EXPLORED</span></div>
    <footer className="game-hud"><div className="hud-location"><Insignia size={31}/><div><small>CURRENT LOCATION</small><strong>{started?active.location:'THE NORTHERN CLIFF'}</strong></div></div>
      <div className="hud-center"><span>{started?String(index+1).padStart(2,'0'):'00'}</span><div className="hud-progress"><i style={{transform:`scaleX(${started?progress:0})`}}/></div><span>{chapters.length}</span></div>
      <div className="hud-prompt">{started&&active.kind==='arena'?'SCROLL TO CROSS THE TRIAL RINGS':started?'SCROLL TO CONTINUE':'YOUR STORY AWAITS'}<ArrowDown size={15}/></div></footer>
    <div className="utility-rail"><button onClick={()=>setModal('atlas')} title="World atlas" aria-label="World atlas"><Compass size={18}/></button><button onClick={()=>setPrefs(v=>!v)} aria-label="Display and motion settings" title="Preferences"><Settings2 size={18}/></button><button onClick={sound.toggle} aria-label={sound.enabled?'Mute audio':'Enable audio'} title="Sound">{sound.enabled?<Volume2 size={18}/>:<VolumeX size={18}/>}</button></div>
    {toast&&started&&<div className="achievement-toast" role="status"><span>✦</span><div><small>{toast.title} · {toast.number}</small><strong>{toast.detail}</strong></div></div>}
    {prefs&&<SettingsPanel quality={quality} setQuality={setQuality} motion={reduceMotion} setMotion={setReduceMotion} sound={sound} onClose={()=>setPrefs(false)}/>}
    {modal==='atlas'&&<AtlasModal onClose={()=>setModal('')} onTravel={travel} currentIndex={index} unlocked={maxChapter}/>}
    {project&&<ProjectModal project={project} onClose={()=>setProject(null)}/>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
