import React, {useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {arenaRingProgress} from '../data/portfolio';

// All built here from procedural forms so the demo runs offline after npm install.
// Production art can replace any group with a properly authored, optimized GLB.
function Slab({position,size,material,rotation,castShadow=false}){
  return <mesh position={position} rotation={rotation} material={material} castShadow={castShadow} receiveShadow>
    <boxGeometry args={size}/>
  </mesh>;
}
function DarkMetalPillar({position,height=8,materials}){
  return <group position={position}>
    <mesh position={[0,height/2,0]} material={materials.darkMetal}><cylinderGeometry args={[.11,.16,height,8]}/></mesh>
    <mesh position={[0,height+.15,0]} material={materials.brass}><sphereGeometry args={[.22,12,10]}/></mesh>
  </group>;
}
function Obelisk({position,materials,height=8}){
  return <group position={position}>
    <mesh position={[0,height/2,0]} material={materials.stone}><cylinderGeometry args={[.85,1.15,height,8]}/></mesh>
    <mesh position={[0,height+.8,0]} material={materials.trim}><coneGeometry args={[1.0,1.6,8]}/></mesh>
    <Slab position={[0,.4,0]} size={[2.8,.8,2.8]} material={materials.trim}/>
    <Slab position={[0,height-.3,0]} size={[2.1,.55,2.1]} material={materials.trim}/>
  </group>;
}

function GothicPier({height=12,materials}){
  // Extruded with a pointed lancet void, not drawn as a flat decorative plane.
  const geometry=useMemo(()=>{
    const s=new THREE.Shape();
    const w=6.3,h=height;
    s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h);s.lineTo(-w/2,h);s.closePath();
    const hole=new THREE.Path();
    hole.moveTo(-2.05,-.25);hole.lineTo(2.05,-.25);hole.lineTo(2.05,h*.60);
    hole.quadraticCurveTo(1.85,h*.75,0,h*.91);
    hole.quadraticCurveTo(-1.85,h*.75,-2.05,h*.60);
    hole.closePath();s.holes.push(hole);
    const g=new THREE.ExtrudeGeometry(s,{depth:1.45,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.14,bevelThickness:.13,curveSegments:12});
    g.computeVertexNormals();return g;
  },[height]);
  return <mesh geometry={geometry} material={materials.stone} castShadow receiveShadow/>;
}

export function BrokenViaduct({materials}){
  return <group position={[0,-10,38]}>
    {Array.from({length:7},(_,i)=><group key={i} position={[-22.5+i*7.35,0,-3]}>
      <GothicPier height={15+(i%2)*1.4} materials={materials}/>
      <Slab position={[0,16.8,1]} size={[7.5,1.6,4.8]} material={materials.trim}/>
      {i%3!==1&&<Slab position={[0,18.1,.7]} size={[6.8,.65,4.3]} material={materials.stone}/>} 
      {i%2===0&&<mesh material={materials.brass} position={[0,14,2]}><torusGeometry args={[.37,.07,8,20]}/></mesh>}
    </group>)}
    {[-28,28].map((x,i)=><Obelisk key={x} position={[x,0,0]} height={19} materials={materials}/>)}
    <mesh position={[0,-1,4]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[94,44]}/><meshStandardMaterial color="#0c1c23" metalness={.38} roughness={.24}/>
    </mesh>
  </group>;
}

function CourtStatue({position,materials,angle=0}){
  return <group position={position} rotation={[0,angle,0]}>
    <Slab material={materials.trim} position={[0,1,0]} size={[3.2,2,3.2]}/>
    <Slab material={materials.darkMetal} position={[0,2.05,0]} size={[2.9,.18,2.9]}/>
    <mesh position={[0,3.5,0]} material={materials.stone}><cylinderGeometry args={[.63,.83,2.7,12]}/></mesh>
    <mesh position={[0,5.0,0]} material={materials.stone}><icosahedronGeometry args={[.9,2]}/></mesh>
    <mesh position={[0,5.4,.56]} material={materials.brass}><torusGeometry args={[.7,.06,7,32]}/></mesh>
  </group>;
}
export function IdentityCourt({materials}){
  return <group position={[0,-8,-90]}>
    <Slab position={[0,0,0]} size={[39,.75,22]} material={materials.floor}/>
    {[-1,1].map(s=><group key={s}>
      {[-8,0,8].map(z=><Obelisk key={z} position={[s*16,.25,z]} height={8} materials={materials}/>)}
      <Slab position={[s*16,9.8,0]} size={[3.8,.65,23]} material={materials.trim}/>
    </group>)}
    <CourtStatue materials={materials} position={[-7,.5,0]} angle={-.3}/>
    <CourtStatue materials={materials} position={[7,.5,0]} angle={.3}/>
    <mesh material={materials.brass} position={[0,1.08,0]} rotation={[-Math.PI/2,0,0]}>
      <torusGeometry args={[5.9,.12,8,64]}/>
    </mesh>
    <mesh material={materials.floor} position={[0,.72,0]}><cylinderGeometry args={[3.8,3.8,.65,40]}/></mesh>
  </group>;
}

function Railing({materials,length=8,position,rotation}){
  return <group position={position} rotation={rotation}>
    <Slab position={[0,1.5,0]} size={[length,.16,.16]} material={materials.darkMetal}/>
    <Slab position={[0,.35,0]} size={[length,.12,.16]} material={materials.darkMetal}/>
    {Array.from({length:Math.ceil(length/1.3)},(_,i)=><Slab key={i} position={[-length/2+.4+i*1.3,.9,0]} size={[.09,1.8,.11]} material={materials.brass}/>)}
  </group>;
}
function ArenaTower({position,materials,height=20,rotation=0}){
  const pennant=useRef();
  useFrame(({clock})=>{if(pennant.current)pennant.current.rotation.y=Math.sin(clock.elapsedTime*1.15+position[0])*.18;});
  return <group position={position} rotation={[0,rotation,0]}>
    <mesh position={[0,height/2,0]} material={materials.stone}><cylinderGeometry args={[1.6,2.1,height,12]}/></mesh>
    <mesh position={[0,height+.2,0]} material={materials.trim}><cylinderGeometry args={[2.0,2.0,1.2,12]}/></mesh>
    <mesh position={[0,height+5.2,0]} material={materials.roof}><coneGeometry args={[2.65,9,12]}/></mesh>
    {[4,height*.42,height*.72].map(y=><mesh key={y} material={materials.darkMetal} position={[0,y,1.62]}><boxGeometry args={[.65,2.2,.19]}/></mesh>)}
    <DarkMetalPillar materials={materials} position={[0,height+8.6,0]} height={3.2}/>
    <group ref={pennant} position={[.8,height+11.4,0]}>
      <mesh material={materials.banner} position={[1.15,-.42,0]}><planeGeometry args={[2.3,1.1]}/></mesh>
    </group>
  </group>;
}
const checkpoints=[
  [34,24,-99],[44,27,-104],[55,27,-111],[55,24,-122],[47,19,-132]
];
function TrialRing({position,index,progressRef,materials}){
  const glow=useRef();const outer=useRef();const material=useMemo(()=>new THREE.MeshStandardMaterial({color:'#665f50',metalness:.91,roughness:.32,emissive:'#9b7040',emissiveIntensity:.08}),[]);
  useFrame(({clock},dt)=>{
    const p=progressRef.current;
    const enabled=p+1e-6>=arenaRingProgress[index];
    const target=enabled?.75:(p>=.425?.26:.04);
    material.emissiveIntensity=THREE.MathUtils.damp(material.emissiveIntensity,target,2.5,Math.min(.05,dt));
    if(outer.current)outer.current.rotation.z=Math.sin(clock.elapsedTime*.36+index)*.045;
    if(glow.current)glow.current.scale.setScalar(1+Math.sin(clock.elapsedTime*1.8+index)*.024);
  });
  return <group position={position} rotation={[0,index%2===0?.23:-.18,index===2?-.18:.13]}>
    <mesh ref={outer} material={materials.darkMetal}><torusGeometry args={[4.15,.52,12,64]}/></mesh>
    <mesh ref={glow} material={material}><torusGeometry args={[4.15,.12,8,64]}/></mesh>
    {Array.from({length:12},(_,j)=>{
      const angle=j*Math.PI/6;
      return <mesh key={j} position={[Math.cos(angle)*4.15,Math.sin(angle)*4.15,.19]} material={materials.brass} rotation={[0,0,angle]}>
        <boxGeometry args={[.32,.63,.19]}/>
      </mesh>;
    })}
    {[-1,1].map(s=><group key={s}>
      <mesh position={[s*2.9,3.14,0]} rotation={[0,0,s*.7]} material={materials.darkMetal}><cylinderGeometry args={[.035,.035,8.5,6]}/></mesh>
    </group>)}
  </group>;
}
export function SkyArena({materials,progressRef,quality}){
  return <group>
    <group position={[44,-11,-114]}>
      {[0,1,2].map(i=><mesh key={i} position={[0,2+i*.5,0]} scale={[1.35,1,1]} rotation={[-Math.PI/2,0,0]} material={i===2?materials.trim:materials.stone}>
        <torusGeometry args={[37+i*1.8,2.3,7,110]}/>
      </mesh>)}
      {Array.from({length:12},(_,i)=>{
        const angle=i*Math.PI/6,rx=51,rz=40;
        return <ArenaTower key={i} materials={materials} height={18+(i%4)*3} position={[Math.sin(angle)*rx,0,Math.cos(angle)*rz]} rotation={angle}/>;
      })}
      {[0,1,2].map(i=><mesh key={'stand'+i} material={materials.stone} position={[0,3.5+i*.8,0]} rotation={[-Math.PI/2,0,0]} scale={[1.36,1,1]}>
        <torusGeometry args={[34+i*2,1,6,100]}/>
      </mesh>)}
      {[-1,1].map(s=><Railing key={s} materials={materials} length={22} position={[s*25,4,-21]} rotation={[0,s*.3,0]}/>)}
      <mesh position={[0,0,0]} rotation={[-Math.PI/2,0,0]}><circleGeometry args={[30,80]}/><meshStandardMaterial color="#14241e" roughness={1}/></mesh>
      <pointLight position={[0,35,0]} color="#9da9af" intensity={quality==='high'?13:3} distance={115}/>
    </group>
    {checkpoints.map((position,i)=><TrialRing key={i} index={i} position={position} progressRef={progressRef} materials={materials}/>)}
    <group position={[75,15,-112]}>
      <Slab material={materials.stone} position={[0,0,0]} size={[13,9,2.2]}/>
      <Slab material={materials.darkMetal} position={[0,.1,1.18]} size={[11.6,7.9,.15]}/>
      {[5.7,-5.7].map(s=><Slab key={s} material={materials.brass} position={[s,0,1.3]} size={[.13,8.1,.2]}/>)}
      {[-4,-2,0,2,4].map(x=><mesh key={x} material={materials.brass} position={[x,0,1.28]}><sphereGeometry args={[.15,10,10]}/></mesh>)}
    </group>
  </group>;
}

function ForgeGear({materials,position,speed=1}){
 const ref=useRef();useFrame(({clock})=>{if(ref.current)ref.current.rotation.z=clock.elapsedTime*.17*speed;});
 return <group ref={ref} position={position}>
  <mesh material={materials.brass}><torusGeometry args={[2.55,.33,8,24]}/></mesh>
  {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <Slab key={i} position={[Math.sin(a)*2.55,Math.cos(a)*2.55,0]} rotation={[0,0,-a]} size={[.65,1,.46]} material={materials.brass}/>;})}
  <mesh material={materials.darkMetal}><cylinderGeometry args={[.57,.57,.8,12]}/></mesh>
 </group>;
}
export function ArcaneForge({materials,quality}){
  return <group position={[36,-8,-139]}>
    <Slab position={[0,0,0]} size={[29,.9,21]} material={materials.floor}/>
    {[-12,12].map(x=><group key={x}>
      <Obelisk position={[x,0,-7]} materials={materials} height={12}/>
      <Obelisk position={[x,0,7]} materials={materials} height={12}/>
      <Slab material={materials.trim} position={[x,14,0]} size={[3.4,1,20]}/>
    </group>)}
    <Slab position={[0,14,-9]} size={[30,1,3]} material={materials.trim}/>
    <Slab position={[0,4,-8]} size={[14,8,2.3]} material={materials.stone}/>
    <mesh material={materials.fire} position={[0,4,-6.7]}><planeGeometry args={[7.2,4.8]}/></mesh>
    <Slab material={materials.darkMetal} position={[0,1,5]} size={[7,1.8,4.4]}/>
    <Slab material={materials.trim} position={[0,2.3,5]} size={[4.5,.55,3.2]}/>
    <ForgeGear materials={materials} position={[-6,8,-6.45]}/>
    <ForgeGear materials={materials} position={[6,8,-6.45]} speed={-1.3}/>
    <mesh position={[0,9,-5.6]} material={materials.darkMetal} rotation={[0,0,.35]}><torusGeometry args={[4.2,.17,8,50]}/></mesh>
    {quality==='high'&&<pointLight position={[0,4,-5]} color="#ef8447" intensity={11} distance={29}/>} 
  </group>;
}

export function HallOfRelics({materials}){
  return <group position={[5,-8,-194]}>
    <Slab position={[0,.1,0]} size={[29,1,21]} material={materials.floor}/>
    {[-9,0,9].map((x,i)=><group key={x} position={[x,0,0]}>
      <Obelisk materials={materials} position={[0,0,-8]} height={13}/>
      <Slab materials={materials} material={materials.trim} position={[0,1.35,0]} size={[5,2.2,5]}/>
      <Slab material={materials.darkMetal} position={[0,2.8,0]} size={[4.4,.22,4.4]}/>
      <mesh material={materials.brass} position={[0,5.6,0]} rotation={[0,0,(i-1)*.18]}>
        <octahedronGeometry args={[2.0+i*.2,1]}/>
      </mesh>
      <mesh material={materials.trim} position={[0,5.6,0]}><torusGeometry args={[2.8,.08,8,48]}/></mesh>
      <pointLight position={[0,8,0]} color="#9c835e" intensity={2.5} distance={12}/>
    </group>)}
    <Slab material={materials.stone} position={[0,14,-11]} size={[32,1,3]}/>
  </group>;
}
