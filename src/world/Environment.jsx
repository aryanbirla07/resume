import React, {useEffect, useMemo, useRef} from 'react';
import * as THREE from 'three';
import {Stars, Sparkles} from '@react-three/drei';
import {useFrame} from '@react-three/fiber';

const seeded=(n)=>{
  const x=Math.sin(n*127.1+78.233)*43758.5453;
  return x-Math.floor(x);
};

function Forest({materials,quality}){
  const trees=useMemo(()=>{
    const count=quality==='high'?310:155;
    const list=[];
    for(let i=0;i<count;i++){
      const x=(seeded(i*7.19+1)-.5)*210;
      const z=105-seeded(i*9.73+8)*245;
      // Reserve central flight and castle corridors.
      if((Math.abs(x)<16&&z<50)||(Math.abs(x)<30&&z<-10))continue;
      const s=.65+seeded(i*3.41+9)*2.1;
      list.push({x,z,s,h:seeded(i*2.17+4)});
    }
    return list;
  },[quality]);
  const trunk=useRef(),a=useRef(),b=useRef(),c=useRef();
  useEffect(()=>{
    const dummy=new THREE.Object3D();
    [trunk,a,b,c].forEach((ref,j)=>{
      if(!ref.current)return;
      trees.forEach(({x,z,s,h},i)=>{
        dummy.position.set(x,-7.7+(j===0?1.1:2.5+j*1.15)*s,z);
        dummy.scale.set(s*(j===0?.45:1.05-j*.13),s,s*(j===0?.45:1.05-j*.13));
        dummy.rotation.y=h*Math.PI*2;
        dummy.updateMatrix();ref.current.setMatrixAt(i,dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate=true;
    });
  },[trees]);
  return <group>
    <instancedMesh ref={trunk} args={[undefined,undefined,trees.length]} material={materials.wood} frustumCulled={false}>
      <cylinderGeometry args={[.27,.44,2.2,6]}/>
    </instancedMesh>
    {[a,b,c].map((ref,j)=><instancedMesh key={j} ref={ref} args={[undefined,undefined,trees.length]} frustumCulled={false}>
      <coneGeometry args={[1.8-j*.16,3.45-j*.35,7]}/>
      <meshStandardMaterial color={['#1b2825','#17241f','#24332a'][j]} roughness={1} flatShading/>
    </instancedMesh>)}
  </group>;
}

function Ridge({x,z,w=25,h=31,color='#29343a'}){
  const geometry=useMemo(()=>{
    const mesh=new THREE.ConeGeometry(1,2.15,5,1);
    return mesh;
  },[]);
  return <group position={[x,-8,z]} scale={[w,h,w*.78]}>
    <mesh material={undefined} geometry={geometry} position={[0,.9,0]}>
      <meshStandardMaterial color={color} flatShading roughness={1}/>
    </mesh>
    <mesh position={[0,1.76,0]}>
      <coneGeometry args={[.23,.46,5]}/>
      <meshStandardMaterial color="#667d87" roughness={1} flatShading/>
    </mesh>
  </group>;
}

function MountainRange(){
  const peaks=useMemo(()=>Array.from({length:29},(_,i)=>({
    x:(i%2===0?-1:1)*(28+seeded(i*3.9+5)*130),
    z:125-i*17,
    w:15+seeded(i*1.2+9)*26,
    h:21+seeded(i*4.1)*30,
    color:i%3===0?'#20292d':i%3===1?'#27323a':'#19242b'
  })),[]);
  return <group>{peaks.map((p,i)=><Ridge key={i} {...p}/>)}</group>;
}

function Cliff({materials}){
 return <group position={[0,-9,96]}>
   <mesh position={[0,0,0]} material={materials.stone}>
      <cylinderGeometry args={[16,20,9,9]}/>
   </mesh>
   <mesh position={[0,4.6,0]} material={materials.floor}>
     <cylinderGeometry args={[15.9,16.2,.38,9]}/>
   </mesh>
   {[[-8,3],[7,-5],[-6,-8]].map(([x,z],i)=><mesh key={i} position={[x,5.2,z]} material={materials.trim} rotation={[0,i*.6,.3]}>
     <icosahedronGeometry args={[1.4+i*.3,0]}/>
   </mesh>)}
 </group>;
}

function Bridge({materials}){
  return <group position={[0,-8,-11]}>
    <mesh material={materials.trim} position={[0,.25,0]}><boxGeometry args={[13,1.6,31]}/></mesh>
    <mesh material={materials.floor} position={[0,1.1,0]}><boxGeometry args={[11,.2,29]}/></mesh>
    {[-1,1].map(s=><group key={s}>
      <mesh material={materials.stone} position={[s*6,.8,0]}><boxGeometry args={[.9,1.6,29]}/></mesh>
      {[-13,-7,0,7,13].map(z=><mesh key={z} position={[s*6,2.5,z]} material={materials.trim}>
        <boxGeometry args={[1.1,2.5,1.1]}/>
      </mesh>)}
    </group>)}
  </group>;
}

function FloatingStones({materials}){
  const stones=useMemo(()=>Array.from({length:22},(_,i)=>({
    x:(seeded(i*.72+8)-.5)*65,
    y:17+seeded(i*1.78+12)*26,
    z:-10-seeded(i*.23+2)*210,
    r:.35+seeded(i*3.11+7)*1.1
  })),[]);
  const r=useRef();
  useFrame(({clock})=>{if(r.current)r.current.rotation.y=clock.elapsedTime*.014;});
  return <group ref={r}>{stones.map((s,i)=><mesh key={i} position={[s.x,s.y,s.z]} rotation={[i*.2,.4,i]} material={materials.stone}>
     <dodecahedronGeometry args={[s.r,0]}/>
  </mesh>)}</group>;
}

function Moon(){
 const tex=useMemo(()=>{
   const c=document.createElement('canvas');c.width=c.height=128;
   const ctx=c.getContext('2d');const g=ctx.createRadialGradient(64,64,0,64,64,64);
   g.addColorStop(0,'rgba(213,229,243,.23)');g.addColorStop(.25,'rgba(196,213,230,.16)');g.addColorStop(.72,'rgba(139,165,202,.05)');g.addColorStop(1,'rgba(80,99,138,0)');
   ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
   const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
 },[]);
 const glow=useMemo(()=>new THREE.SpriteMaterial({map:tex,depthWrite:false,transparent:true,blending:THREE.AdditiveBlending,fog:false}),[tex]);
 return <group position={[-86,108,-195]}>
   <mesh><sphereGeometry args={[13,36,36]}/><meshBasicMaterial color="#d8dee3" fog={false}/></mesh>
   <sprite scale={[60,60,1]} material={glow}/>
 </group>;
}

function Fireflies({quality}){
 const count=quality==='high'?110:42;
 const ref=useRef();const points=useMemo(()=>Array.from({length:count},(_,i)=>({
   x:(seeded(i*18.21)-.5)*75,
   y:2+seeded(i*7.71+2)*18,
   z:20-seeded(i*.91+3)*250,
   seed:seeded(i*11.7+3)*6.28
 })),[count]);
 const geo=useMemo(()=>{const g=new THREE.BufferGeometry();const a=new Float32Array(count*3);
   points.forEach((p,i)=>{a[i*3]=p.x;a[i*3+1]=p.y;a[i*3+2]=p.z;});
   g.setAttribute('position',new THREE.BufferAttribute(a,3));return g;
 },[points,count]);
 useFrame(({clock})=>{if(ref.current){ref.current.rotation.y=Math.sin(clock.elapsedTime*.05)*.012;
   ref.current.material.opacity=.45+Math.sin(clock.elapsedTime*2.5)*.15;}});
 return <points ref={ref} geometry={geo}>
   <pointsMaterial color="#a58c64" size={.21} transparent opacity={.5} sizeAttenuation depthWrite={false}/>
 </points>;
}

export function Environment({materials,quality}){
  return <group>
    <ambientLight color="#8b99a6" intensity={.35}/>
    <hemisphereLight args={['#8a9eac','#151d18',.91]}/>
    <directionalLight color="#aec0c9" position={[-55,85,15]} intensity={1.65}/>
    <directionalLight color="#9e744e" position={[48,52,-115]} intensity={.45}/>
    <fogExp2 attach="fog" args={['#09141b',.0052]}/>
    <Stars radius={320} depth={170} count={quality==='high'?2000:800} factor={4.3} fade speed={.18}/>
    <Moon/>
    <mesh position={[0,-8.6,-70]} rotation={[-Math.PI/2,0,0]} material={materials.ground} receiveShadow>
      <planeGeometry args={[800,800]}/>
    </mesh>
    <mesh position={[0,-7.8,-270]} rotation={[-Math.PI/2,0,0]}>
      <planeGeometry args={[450,400]}/>
      <meshStandardMaterial color="#0c1820" roughness={.28} metalness={.27}/>
    </mesh>
    <Forest materials={materials} quality={quality}/>
    <MountainRange/>
    <Bridge materials={materials}/>
    <Cliff materials={materials}/>
    <FloatingStones materials={materials}/>
    <Fireflies quality={quality}/>
    <Sparkles count={quality==='high'?38:16} speed={.23} scale={[105,28,290]} position={[0,4,-65]} size={quality==='high'?2:1.3} opacity={.22} color="#9f8768"/>
  </group>;
}
