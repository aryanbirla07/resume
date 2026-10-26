import React,{useMemo,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Sparkles} from '@react-three/drei';
import * as THREE from 'three';

const cloak=new THREE.MeshStandardMaterial({color:'#202527',roughness:.94,side:THREE.DoubleSide});
const coat=new THREE.MeshStandardMaterial({color:'#514b42',roughness:.91});
const shirt=new THREE.MeshStandardMaterial({color:'#817563',roughness:.96});
const leather=new THREE.MeshStandardMaterial({color:'#2b211d',roughness:.87});
const boot=new THREE.MeshStandardMaterial({color:'#17181a',roughness:.9});
const skin=new THREE.MeshStandardMaterial({color:'#947864',roughness:.92});
const brass=new THREE.MeshStandardMaterial({color:'#a17c47',metalness:.78,roughness:.42});
const wood=new THREE.MeshStandardMaterial({color:'#513a2a',roughness:.9});
const bristle=new THREE.MeshStandardMaterial({color:'#6e5a40',roughness:1});

const vector=(x,y,z)=>new THREE.Vector3(x,y,z);

function Limb({start,end,radius=.12,material=coat}){
  const a=vector(...start),b=vector(...end),delta=b.clone().sub(a);
  const center=a.clone().add(b).multiplyScalar(.5);
  const quat=new THREE.Quaternion().setFromUnitVectors(vector(0,1,0),delta.clone().normalize());
  return <mesh position={center.toArray()} quaternion={quat} material={material}>
    <capsuleGeometry args={[radius,Math.max(.04,delta.length()-radius*2),8,6]}/>
  </mesh>;
}

function Boot({position,rotation=[0,0,0]}){
  return <group position={position} rotation={rotation}>
    <mesh material={boot}><boxGeometry args={[.28,.34,.7]}/></mesh>
    <mesh position={[0,-.19,.11]} material={boot}><boxGeometry args={[.34,.12,.83]}/></mesh>
    <mesh position={[0,.1,-.31]} material={leather}><torusGeometry args={[.16,.035,7,12]}/></mesh>
  </group>;
}

function HoodedHead(){
  return <group position={[0,1.82,.31]}>
    <mesh scale={[.42,.48,.39]} material={cloak}><sphereGeometry args={[1,20,16]}/></mesh>
    <mesh position={[0,-.08,.27]} scale={[.28,.32,.2]} material={skin}><sphereGeometry args={[1,16,12]}/></mesh>
    <mesh position={[0,-.06,.44]} scale={[.22,.14,.08]} material={skin}><sphereGeometry args={[1,12,8]}/></mesh>
    <mesh position={[0,.34,.31]} rotation={[Math.PI/2,0,0]} material={cloak}><torusGeometry args={[.36,.105,8,22,Math.PI*1.35]}/></mesh>
    <mesh position={[0,.02,.49]} material={cloak}><boxGeometry args={[.42,.1,.06]}/></mesh>
    <mesh position={[-.1,-.08,.45]} material={brass}><sphereGeometry args={[.025,8,8]}/></mesh>
    <mesh position={[.1,-.08,.45]} material={brass}><sphereGeometry args={[.025,8,8]}/></mesh>
  </group>;
}

function AnimatedCape(){
  const ref=useRef();
  const base=useMemo(()=>{
    const g=new THREE.PlaneGeometry(1.9,2.7,10,12),p=g.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),t=(y+1.35)/2.7;
      p.setXYZ(i,x*(.46+t*.44),y-.16,.18+(1-t)*1.55);
    }
    g.computeVertexNormals();
    return g;
  },[]);
  const geometry=useMemo(()=>base.clone(),[base]);
  useFrame(({clock})=>{
    if(!ref.current)return;
    const positions=ref.current.geometry.attributes.position;
    for(let i=0;i<positions.count;i++){
      const z=base.attributes.position.getZ(i),weight=Math.max(0,(z-.18)/1.55);
      positions.setX(i,base.attributes.position.getX(i)+Math.sin(clock.elapsedTime*2.2+z*2.1)*.12*weight);
      positions.setY(i,base.attributes.position.getY(i)+Math.sin(clock.elapsedTime*2.8+z)*.08*weight);
      positions.setZ(i,z);
    }
    positions.needsUpdate=true;
    ref.current.geometry.computeVertexNormals();
  });
  return <mesh ref={ref} geometry={geometry} position={[0,.95,.22]} rotation={[-.08,0,0]} material={cloak}/>;
}

function MagicalBroom(){
  return <group>
    <mesh rotation={[Math.PI/2,0,0]} material={wood}><cylinderGeometry args={[.095,.14,5.9,14]}/></mesh>
    <mesh position={[0,0,-2.83]} rotation={[Math.PI/2,0,0]} material={brass}><coneGeometry args={[.22,.58,10]}/></mesh>
    <mesh position={[0,.12,.06]} material={leather}><boxGeometry args={[.68,.14,.72]}/></mesh>
    <mesh position={[0,.23,.02]} material={brass}><torusGeometry args={[.36,.045,8,22]}/></mesh>
    <mesh position={[0,0,2.54]} rotation={[Math.PI/2,0,0]} material={bristle}><coneGeometry args={[.38,2.2,18]}/></mesh>
    {Array.from({length:20},(_,i)=>{
      const angle=i*Math.PI*2/20;
      return <mesh key={i} position={[Math.sin(angle)*.23,Math.cos(angle)*.23,2.82]} rotation={[Math.PI/2+Math.sin(angle)*.12,0,Math.cos(angle)*.14]} material={bristle}>
        <coneGeometry args={[.035,1.72,5]}/>
      </mesh>;
    })}
  </group>;
}

export function BroomRider({quality='high'}){
  const rider=useRef(),cape=useRef(),scarf=useRef();
  useFrame(({clock})=>{
    const t=clock.elapsedTime;
    if(rider.current)rider.current.rotation.z=Math.sin(t*1.25)*.018;
    if(cape.current)cape.current.rotation.x=.08+Math.sin(t*1.7)*.035;
    if(scarf.current)scarf.current.rotation.z=.1+Math.sin(t*3.5)*.12;
  });
  return <group>
    <MagicalBroom/>
    <group ref={rider} rotation={[-.12,0,0]}>
      <mesh position={[0,.72,.12]} rotation={[-.42,0,0]} material={coat}><capsuleGeometry args={[.43,.72,10,8]}/></mesh>
      <mesh position={[0,.94,.39]} rotation={[-.42,0,0]} material={shirt}><capsuleGeometry args={[.31,.5,9,7]}/></mesh>
      <mesh position={[0,.37,.12]} material={leather}><capsuleGeometry args={[.47,.2,10,7]}/></mesh>
      <mesh position={[0,.37,.35]} material={brass}><torusGeometry args={[.33,.035,8,20]}/></mesh>
      <HoodedHead/>
      <Limb start={[-.31,1.18,.25]} end={[-.47,.93,-.33]} radius={.13}/>
      <Limb start={[-.47,.93,-.33]} end={[-.22,.74,-.72]} radius={.105} material={shirt}/>
      <Limb start={[.31,1.18,.25]} end={[.47,.93,-.33]} radius={.13}/>
      <Limb start={[.47,.93,-.33]} end={[.22,.74,-.72]} radius={.105} material={shirt}/>
      <mesh position={[-.22,.72,-.76]} material={skin}><sphereGeometry args={[.12,12,9]}/></mesh>
      <mesh position={[.22,.72,-.76]} material={skin}><sphereGeometry args={[.12,12,9]}/></mesh>
      <mesh position={[0,.72,-.78]} rotation={[0,Math.PI/2,0]} material={wood}><cylinderGeometry args={[.075,.075,.62,10]}/></mesh>
      <Limb start={[-.3,.46,.12]} end={[-.53,.12,-.42]} radius={.17} material={coat}/>
      <Limb start={[-.53,.12,-.42]} end={[-.42,-.05,-.86]} radius={.14} material={leather}/>
      <Limb start={[.3,.46,.12]} end={[.53,.12,-.42]} radius={.17} material={coat}/>
      <Limb start={[.53,.12,-.42]} end={[.42,-.05,-.86]} radius={.14} material={leather}/>
      <Boot position={[-.42,-.16,-.91]} rotation={[.16,.12,-.12]}/>
      <Boot position={[.42,-.16,-.91]} rotation={[.16,-.12,.12]}/>
      <mesh position={[-.54,.14,-.42]} rotation={[0,0,-.38]} material={brass}><torusGeometry args={[.16,.035,8,16]}/></mesh>
      <mesh position={[.54,.14,-.42]} rotation={[0,0,.38]} material={brass}><torusGeometry args={[.16,.035,8,16]}/></mesh>
      <mesh position={[0,.86,.62]} rotation={[0,0,-.42]} material={leather}><boxGeometry args={[.1,.92,.08]}/></mesh>
      <mesh position={[0,.76,.51]} material={brass}><boxGeometry args={[.18,.2,.05]}/></mesh>
      <group ref={scarf} position={[0,1.42,.45]}><mesh rotation={[Math.PI/2,.14,.2]} material={brass}><cylinderGeometry args={[.08,.1,1.05,8]}/></mesh></group>
      <group ref={cape}><AnimatedCape/></group>
    </group>
    <pointLight position={[0,.45,-.25]} color="#c18a52" intensity={quality==='high'?.75:.35} distance={4.5}/>
    <Sparkles count={quality==='high'?14:6} position={[0,-.08,2.8]} scale={[1.6,.9,4.7]} size={1.35} speed={.45} color="#d0b37c" opacity={.34}/>
  </group>;
}