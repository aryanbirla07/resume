import React, {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Sparkles} from '@react-three/drei';
import * as THREE from 'three';

const ebony=new THREE.MeshStandardMaterial({color:'#1a1d1e',roughness:.97,side:THREE.DoubleSide});
const linen=new THREE.MeshStandardMaterial({color:'#413e37',roughness:.97});
const leather=new THREE.MeshStandardMaterial({color:'#302721',roughness:.88});
const skin=new THREE.MeshStandardMaterial({color:'#86705e',roughness:.94});
const copper=new THREE.MeshStandardMaterial({color:'#90764e',metalness:.8,roughness:.48});
const wood=new THREE.MeshStandardMaterial({color:'#4e382a',roughness:.92});
const bristle=new THREE.MeshStandardMaterial({color:'#756346',roughness:1});

function Limb({start,end,radius=.14,material}){
  const a=new THREE.Vector3(...start),b=new THREE.Vector3(...end);
  const v=b.clone().sub(a);const center=a.clone().add(b).multiplyScalar(.5);
  const quat=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());
  return <mesh position={center.toArray()} quaternion={quat} material={material}>
    <cylinderGeometry args={[radius*.83,radius,v.length(),8]}/>
  </mesh>;
}

function FabricCape(){
  const ref=useRef();
  const base=useMemo(()=>{
    const geom=new THREE.PlaneGeometry(2.2,3.9,12,20);
    const pos=geom.attributes.position;
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i);const v=1-(pos.getY(i)+1.95)/3.9;
      pos.setXYZ(i,x*(.56+v*.65),.6-v*.65, .25+v*3.2);
    }
    pos.needsUpdate=true;geom.computeVertexNormals();
    return geom;
  },[]);
  useFrame(({clock})=>{
    if(!ref.current)return;
    const geo=ref.current.geometry;
    const a=geo.attributes.position;
    for(let i=0;i<a.count;i++){
      const x=base.attributes.position.getX(i);
      const y=base.attributes.position.getY(i);
      const z=base.attributes.position.getZ(i);
      const w=Math.max(0,(z-.25)/3.2);
      a.setXYZ(i,x+Math.sin(clock.elapsedTime*2.1+z*1.8)*.19*w,y+Math.sin(clock.elapsedTime*3+z*.9)*.13*w,z);
    }
    a.needsUpdate=true;geo.computeVertexNormals();
  });
  // Clone because the base positions must never be altered by animation.
  const animated=useMemo(()=>base.clone(),[base]);
  return <mesh ref={ref} geometry={animated} material={ebony} />;
}

function MagicalBroom(){
 return <group>
   <mesh rotation={[Math.PI/2,0,0]} material={wood}>
     <cylinderGeometry args={[.10,.14,5.75,12]}/>
   </mesh>
   <mesh position={[0,0,-2.75]} material={copper} rotation={[Math.PI/2,0,0]}>
     <coneGeometry args={[.21,.55,9]}/>
   </mesh>
   {[1.65,1.94,2.24].map(z=><mesh key={z} position={[0,0,z]} material={copper} rotation={[Math.PI/2,0,0]}>
     <cylinderGeometry args={[.14,.14,.11,12]}/>
   </mesh>)}
   <mesh position={[0,0,2.55]} material={bristle} rotation={[Math.PI/2,0,0]}>
     <coneGeometry args={[.38,2.14,18]}/>
   </mesh>
   {Array.from({length:18},(_,i)=>{
     const a=i*Math.PI*2/18;
     return <mesh key={i} position={[Math.sin(a)*.24,Math.cos(a)*.24,2.8]} rotation={[Math.PI/2+Math.sin(a)*.14,0,Math.cos(a)*.15]} material={bristle}>
       <coneGeometry args={[.044,1.7,5]}/>
     </mesh>;
   })}
 </group>;
}

export function BroomRider({quality='high'}){
 const torso=useRef(),scarf=useRef();
 useFrame(({clock})=>{
   const t=clock.elapsedTime;
   if(torso.current)torso.current.rotation.z=Math.sin(t*1.3)*.035;
   if(scarf.current)scarf.current.rotation.x=.21+Math.sin(t*3.5)*.13;
 });
 return <group>
   <MagicalBroom/>
   <group ref={torso}>
     <mesh position={[0,.85,.28]} rotation={[-.25,0,0]} material={ebony}>
       <cylinderGeometry args={[.48,.56,1.35,12]}/>
     </mesh>
     <mesh position={[0,1.1,.06]} material={linen}><sphereGeometry args={[.26,12,12]}/></mesh>
     {/* Tailored hood, rather than an exaggerated pointed wizard hat. */}
     <mesh position={[0,1.76,.22]} scale={[.43,.51,.38]} material={ebony}><sphereGeometry args={[1,26,20]}/></mesh>
     <mesh position={[0,1.69,.53]} scale={[.285,.33,.16]} material={skin}><sphereGeometry args={[1,18,16]}/></mesh>
     <mesh position={[0,2.02,.49]} material={ebony} rotation={[-.12,0,0]}><torusGeometry args={[.32,.11,9,24,Math.PI]}/></mesh>
     <mesh position={[0,1.61,.685]} material={skin} rotation={[Math.PI/2,0,0]}><coneGeometry args={[.075,.19,7]}/></mesh>
     <mesh position={[0,1.27,.28]} rotation={[.24,0,0]} material={leather}><torusGeometry args={[.34,.11,8,24]}/></mesh>
     {/* Folded coat panels and diagonal equipment strap create human-scale complexity. */}
     <mesh position={[-.24,.6,.59]} rotation={[-.18,-.08,-.12]} material={linen}><boxGeometry args={[.39,1.0,.10]}/></mesh>
     <mesh position={[.24,.6,.59]} rotation={[-.18,.08,.12]} material={ebony}><boxGeometry args={[.39,1.0,.10]}/></mesh>
     <mesh position={[.10,.95,.55]} rotation={[.05,0,-.61]} material={leather}><boxGeometry args={[.12,1.22,.1]}/></mesh>
     <mesh position={[0,.39,.43]} material={leather}><boxGeometry args={[1.04,.17,.24]}/></mesh>
     <mesh position={[.06,.39,.61]} material={copper}><boxGeometry args={[.26,.24,.07]}/></mesh>
     <mesh position={[0,.52,.2]} material={leather}><sphereGeometry args={[.48,10,10]}/></mesh>
     {[-1,1].map(s=><group key={s}>
        <Limb start={[s*.4,1.28,.14]} end={[s*.52,.74,-.68]} material={ebony} radius={.15}/>
        <Limb start={[s*.52,.74,-.68]} end={[s*.27,.31,-1.2]} material={linen} radius={.13}/>
        <mesh position={[s*.27,.27,-1.2]} material={leather}><sphereGeometry args={[.15,9,9]}/></mesh>
        <Limb start={[s*.32,.42,.54]} end={[s*.50,-.12,-.35]} material={ebony} radius={.17}/>
        <Limb start={[s*.50,-.12,-.35]} end={[s*.45,-.48,-.96]} material={leather} radius={.14}/>
        <mesh position={[s*.45,-.47,-1.06]} material={leather} rotation={[0,0,s*.1]}><boxGeometry args={[.33,.34,.58]}/></mesh>
        <mesh position={[s*.45,-.27,-.91]} material={copper}><torusGeometry args={[.17,.037,8,15]}/></mesh>
        <mesh position={[s*.48,.60,-.71]} material={leather}><sphereGeometry args={[.16,12,9]}/></mesh>
        <mesh position={[s*.35,1.0,-.37]} material={linen} rotation={[0,s*.12,0]}><cylinderGeometry args={[.18,.22,.43,11]}/></mesh>
     </group>)}
     <FabricCape/>
     <group ref={scarf} position={[0,1.25,.47]}>
       <mesh material={copper} position={[.1,0,.52]} rotation={[Math.PI/2,.2,.14]}>
         <cylinderGeometry args={[.11,.12,1.16,8]}/>
       </mesh>
     </group>
   </group>
   <pointLight position={[0,0,2.15]} color="#96774c" intensity={quality==='high'?.75:.35} distance={4}/>
   <Sparkles count={quality==='high'?12:5} position={[0,-.15,2.8]} scale={[1.7,1.0,5.0]} size={1.5} speed={.5} color="#c5ab82" opacity={.38}/>
 </group>;
}
