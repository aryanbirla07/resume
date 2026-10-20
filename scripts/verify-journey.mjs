import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chapters,portfolio,chapterAt,skillRingCount,journeyCompletion,arenaRingProgress} from '../src/data/portfolio.js';

const tests=[];
function test(label,fn){fn();tests.push(label);}

test('Fourteen authored chapters exist',()=>assert.equal(chapters.length,14));
test('Unique chapter identifiers and positions',()=>{
 assert.equal(new Set(chapters.map(c=>c.id)).size,14);
 assert.equal(chapters[0].progress,0);
 for(let i=1;i<chapters.length;i++)assert.ok(chapters[i].progress>chapters[i-1].progress,`chapter ${i} in wrong order`);
});
test('Journey chapter transitions are deterministic',()=>{
 assert.equal(chapterAt(0).id,'arrival');assert.equal(chapterAt(.425).id,'arena');
 assert.equal(chapterAt(.742).id,'nexus');assert.equal(chapterAt(.998).id,'horizon');
});
test('Five ring unlock thresholds fit inside arena',()=>{
 assert.equal(arenaRingProgress.length,5);
 assert.ok(arenaRingProgress[0]>.425&&arenaRingProgress.at(-1)<.615);
 assert.ok(arenaRingProgress.every((p,i)=>!i||p>arenaRingProgress[i-1]));
});
test('Scroll-only ring progression is reversible',()=>{
 assert.equal(skillRingCount(0),0);assert.equal(skillRingCount(.445),0);
 assert.equal(skillRingCount(.446),1);assert.equal(skillRingCount(.5),2);
 assert.equal(skillRingCount(.574),5);assert.equal(skillRingCount(.8),5);
 assert.equal(skillRingCount(.5),2);assert.equal(skillRingCount(0),0);
});
test('Progress clamps correctly',()=>{
 assert.equal(journeyCompletion(-.5),0);assert.equal(journeyCompletion(1.5),100);
 assert.equal(journeyCompletion(.501),50);
});
test('Demo portfolio has skill, project and experience sections',()=>{
 assert.equal(portfolio.skills.length,5);assert.ok(portfolio.projects.length>=3);
 assert.ok(portfolio.experience.length>=2);assert.ok(portfolio.skills.every(s=>s.items.length>0));
});
test('Generated art and PBR textures exist',()=>{
 ['public/art/castle-key-art.webp','public/textures/aged-stone-color.jpg','public/textures/aged-stone-normal.jpg','public/textures/aged-stone-roughness.jpg','public/textures/aged-timber-color.jpg'].forEach(f=>assert.ok(fs.statSync(new URL(`../${f}`,import.meta.url)).size>1000,f));
});
test('Standalone visual preview is self-contained',()=>{
 const preview=fs.readFileSync(new URL('../interactive-visual-preview.html',import.meta.url),'utf8');
 assert.ok(preview.includes('data:image/webp;base64,'));
 assert.ok(preview.includes('THE ENCHANTED JOURNEY'));
 assert.ok(preview.includes('SCROLL-DRIVEN SKILL CHALLENGES'));
});
test('New scenery and arena files are included',()=>{
 const content=fs.readFileSync(new URL('../src/world/CinematicDistricts.jsx',import.meta.url),'utf8');
 ['BrokenViaduct','SkyArena','IdentityCourt','ArcaneForge','HallOfRelics','TrialRing'].forEach(x=>assert.ok(content.includes(x)));
});
console.log(tests.map((t,i)=>`PASS ${String(i+1).padStart(2,'0')} ${t}`).join('\n'));
console.log(`Passed ${tests.length} journey/data/assets checks.`);
