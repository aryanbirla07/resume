import React from 'react';
import {ArrowLeft,ArrowUpRight,Download,Mail,Github,Linkedin} from 'lucide-react';
import {portfolio} from '../data/portfolio';

const LinkButton=({href,children})=>href?<a href={href} target={href.startsWith('mailto:')?'_self':'_blank'} rel="noreferrer" className="resume-link">{children}<ArrowUpRight size={13}/></a>:null;
const displayText=(value,fallback='—')=>{
  if(value===null||value===undefined||value==='')return fallback;
  if(typeof value==='string'||typeof value==='number')return String(value);
  if(Array.isArray(value))return value.map(item=>displayText(item,'')).filter(Boolean).join(' · ')||fallback;
  if(typeof value==='object')return Object.values(value).map(item=>displayText(item,'')).filter(Boolean).join(' · ')||fallback;
  return fallback;
};

export function ResumeView({embedded=false,onClose}){
  return <article className={'resume-view '+(embedded?'resume-embedded':'')} id="readable-resume">
    <header className="resume-topline">
      {embedded?<button type="button" className="resume-back" onClick={onClose}><ArrowLeft size={17}/> BACK TO THE JOURNEY</button>:<a className="resume-back" href="/"><ArrowLeft size={17}/> RETURN TO THE JOURNEY</a>}
      <span>THE CHRONICLE · TEXT EDITION</span>
    </header>
    <div className="resume-title-group"><div className="kicker">01 / THE PERSON BEHIND THE WORK</div>
      <h1>{portfolio.name}</h1><p className="resume-title">{portfolio.title}</p>
      <p className="resume-muted">{portfolio.location} · {portfolio.phone}</p>
      <p className="resume-summary">{portfolio.introduction}</p>
      <div className="resume-links">
        <LinkButton href={portfolio.email&&`mailto:${portfolio.email}`}><Mail size={16}/> Email</LinkButton>
        <LinkButton href={portfolio.github}><Github size={16}/> GitHub</LinkButton>
        <LinkButton href={portfolio.linkedin}><Linkedin size={16}/> LinkedIn</LinkButton>
        {portfolio.resumeUrl?<LinkButton href={portfolio.resumeUrl}><Download size={16}/> PDF resume</LinkButton>:null}
      </div>
    </div>
    <div className="resume-grid">
      <section><div className="kicker">02 / ABOUT</div><h2>My story.</h2><p>{portfolio.about}</p></section>
      <section><div className="kicker">03 / CRAFT</div><h2>What I work with.</h2>
        {portfolio.skills.map(skill=><div key={skill.group} className="resume-row"><strong>{skill.group}</strong><span>{skill.items.join(' · ')}</span></div>)}
      </section>
      <section className="span-two"><div className="kicker">04 / SELECTED WORK</div><h2>Things I’ve built.</h2>
        {portfolio.projects.map(project=><div key={project.id} className="resume-entry"><div><small>{displayText(project.category,'PROJECT')}</small><h3>{displayText(project.title,'Selected work')}</h3><p>{displayText(project.description,'Project details will be added here.')}</p><p className="resume-muted">{displayText(project.stack,'Details coming soon').replaceAll(' · ',' / ')}</p></div>{project.href&&<LinkButton href={project.href}>View project</LinkButton>}</div>)}
      </section>
      <section className="span-two"><div className="kicker">05 / EXPERIENCE</div><h2>Along the way.</h2>
        {portfolio.experience.map(exp=><div className="resume-entry" key={exp.id}><div><small>{exp.period}</small><h3>{exp.role}</h3><div className="resume-muted">{exp.company}</div><p>{exp.description}</p></div></div>)}
      </section>
      <section className="span-two"><div className="kicker">06 / EDUCATION</div><h2>What I studied.</h2>
        {portfolio.education.map(item=><div className="resume-entry" key={item.qualification}><div><small>{item.period}</small><h3>{item.qualification}</h3><div className="resume-muted">{item.institution}</div></div></div>)}
      </section>
      <section><div className="kicker">07 / CERTIFICATIONS</div><h2>Learning.</h2>
        {portfolio.achievements.map(item=><div className="resume-row" key={item.number}><strong>{item.label}</strong><span>{item.detail}</span></div>)}
      </section>
      <section><div className="kicker">08 / LANGUAGES</div><h2>Languages.</h2>
        {portfolio.languages.map(item=><div className="resume-row" key={item.name}><strong>{item.name}</strong><span>{item.level}</span></div>)}
      </section>
    </div>
    <footer className="resume-footer">HANDCRAFTED ON THE WEB · {new Date().getFullYear()} · AN ORIGINAL WIZARDING WORLD</footer>
  </article>;
}
