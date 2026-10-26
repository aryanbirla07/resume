import React, {useMemo, useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Float} from '@react-three/drei';
import * as THREE from 'three';

const brass='#d4ad6b';

function Box({position, size, material, rotation, castShadow=false}){
  return <mesh position={position} rotation={rotation} castShadow={castShadow} receiveShadow material={material}>
    <boxGeometry args={size}/>
  </mesh>;
}

const windowShape=(()=>{
  const s=new THREE.Shape();s.moveTo(-.38,-.72);s.lineTo(.38,-.72);s.lineTo(.38,.34);
  s.quadraticCurveTo(.38,.77,0,1.12);s.quadraticCurveTo(-.38,.77,-.38,.34);s.closePath();return s;
})();

function Lancet({position=[0,0,0],rotation=[0,0,0],scale=1,materials}){
  return <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0,0,.015]} material={materials.darkMetal}>
      <shapeGeometry args={[windowShape]}/>
    </mesh>
    <mesh position={[0,0,.028]} scale={[.72,.84,1]} material={materials.glass}>
      <shapeGeometry args={[windowShape]}/>
    </mesh>
    <Box position={[0,-.04,.065]} size={[.045,1.2,.06]} material={materials.brass}/>
    <Box position={[0,.09,.07]} size={[.6,.04,.06]} material={materials.brass}/>
  </group>;
}

function Crown({radius=3,y=0,count=12,materials}){
  return <group>
    {Array.from({length:count},(_,i)=>{
      const a=i*Math.PI*2/count;
      return <Box key={i} position={[Math.sin(a)*radius,y,Math.cos(a)*radius]}
          rotation={[0,a,0]} size={[radius*.47,1.3,.82]} material={materials.stone}/>;
    })}
  </group>;
}

function Banner({position,rotation=[0,0,0],materials}){
  const group=useRef();const rand=position[0]*.19+position[2]*.01;
  useFrame(({clock})=>{if(group.current)group.current.rotation.y=Math.sin(clock.elapsedTime*1.65+rand)*.13;});
  return <group position={position} rotation={rotation}>
    <Box position={[0,1.15,0]} size={[1.6,.09,.08]} material={materials.brass}/>
    <group ref={group} position={[0,1.08,.05]}>
      <mesh position={[0,-1.2,0]} material={materials.banner}>
        <planeGeometry args={[1.35,2.45]}/>
      </mesh>
      <mesh position={[0,-.98,.02]} material={materials.brass}>
        <torusGeometry args={[.31,.045,7,28]}/>
      </mesh>
      <Box position={[0,-.98,.03]} size={[.09,.7,.045]} material={materials.brass}/>
      <Box position={[0,-.98,.03]} size={[.72,.09,.045]} material={materials.brass}/>
    </group>
  </group>;
}

function Torch({position,materials,quality='high'}){
  const flame=useRef();
  useFrame(({clock})=>{if(flame.current){const f=clock.elapsedTime+position[0]*6;
    flame.current.scale.setScalar(1+Math.sin(f*8)*.16);}});
  return <group position={position}>
    <Box position={[0,-.5,0]} size={[.11,1,.13]} material={materials.darkMetal}/>
    <mesh position={[0,0,0]} material={materials.darkMetal}><cylinderGeometry args={[.32,.19,.5,8]}/></mesh>
    <group ref={flame}>
      <mesh position={[0,.31,0]} material={materials.fire}>
        <coneGeometry args={[.17,.72,7]}/>
      </mesh>
    </group>
    {quality==='high'&&<pointLight color="#ff9e45" intensity={3.2} distance={9} decay={2}/>}
  </group>;
}

export function Tower({position=[0,0,0],radius=3.3,height=23,roofHeight=8,materials,topWindows=true}){
  const bays=9;
  return <group position={position}>
    <mesh position={[0,height/2,0]} material={materials.stone} receiveShadow castShadow>
      <cylinderGeometry args={[radius*.88,radius,height,12]}/>
    </mesh>
    {[1.3,height*.38,height*.75,height-1.4].map((y,i)=><mesh key={i} position={[0,y,0]} material={materials.trim}>
      <cylinderGeometry args={[radius*1.04,radius*1.04,.42,12]}/>
    </mesh>)}
    {Array.from({length:bays},(_,i)=>{
      const a=i*Math.PI*2/bays;
      return <group key={i}>
        <Box position={[Math.sin(a)*radius*.99,height*.49,Math.cos(a)*radius*.99]}
          rotation={[0,a,0]} size={[.24,height*.62,.45]} material={materials.trim}/>
        {topWindows&&i%2===0&&<Lancet materials={materials} position={[Math.sin(a)*(radius*.885+.13),height*.72,Math.cos(a)*(radius*.885+.13)]} rotation={[0,a,0]} scale={1.06}/>}
      </group>;
    })}
    <Crown radius={radius*.9} y={height+.35} count={12} materials={materials}/>
    {roofHeight>0&&<mesh position={[0,height+roofHeight/2+.75,0]} material={materials.roof} castShadow>
      <coneGeometry args={[radius*1.12,roofHeight,12]}/>
    </mesh>}
    <mesh position={[0,height+roofHeight+1.0,0]} material={materials.brass}>
      <sphereGeometry args={[.31,10,10]}/>
    </mesh>
    <mesh position={[0,height+roofHeight+1.55,0]} material={materials.brass}>
      <coneGeometry args={[.15,.9,8]}/>
    </mesh>
  </group>;
}

function Wall({position, size, materials, crenels=true, windows=0}){
  const [w,h,d]=size;
  return <group position={position}>
    <Box position={[0,h/2,0]} size={[w,h,d]} material={materials.stone}/>
    <Box position={[0,h-.24,0]} size={[w,.5,d+.42]} material={materials.trim}/>
    {crenels&&Array.from({length:Math.floor(w/2.2)},(_,i)=>
      <Box key={i} position={[-w/2+.9+i*2.2,h+.56,0]} size={[1.13,1.12,d+.3]} material={materials.stone}/>)}
    {windows>0&&Array.from({length:windows},(_,i)=>
      <Lancet key={i} materials={materials} position={[-w/2+w*(i+1)/(windows+1),h*.56,d/2+.08]} scale={1.25}/>)}
  </group>;
}

function GothicGate({materials,progress}){
  const left=useRef(),right=useRef();
  useFrame((_,dt)=>{
    const open=THREE.MathUtils.smoothstep(progress.current,.19,.29);
    const a=1-Math.exp(-dt*3);
    if(left.current)left.current.rotation.y=THREE.MathUtils.lerp(left.current.rotation.y,-open*1.38,a);
    if(right.current)right.current.rotation.y=THREE.MathUtils.lerp(right.current.rotation.y,open*1.38,a);
  });
  return <group position={[0,0,-23]}>
    {[-1,1].map(sign=><group key={sign} position={[sign*4.75,0,0]}>
      <Box position={[0,4.4,0]} size={[1.45,24,3.8]} material={materials.trim}/>
      <Box position={[-sign*.68,14,0]} size={[1.65,2.9,4.1]} rotation={[0,0,sign*.45]} material={materials.trim}/>
    </group>)}
    <Box position={[0,17.7,0]} size={[12,4.4,3.8]} material={materials.stone}/>
    <Wall materials={materials} position={[-17.8,-8,0]} size={[22,23,3.8]} windows={3}/>
    <Wall materials={materials} position={[17.8,-8,0]} size={[22,23,3.8]} windows={3}/>
    <group ref={left} position={[-3.9,0,1.98]}>
      <Box position={[1.95,2.3,0]} size={[3.9,19.6,.52]} material={materials.wood}/>
      {Array.from({length:4},(_,i)=><Box key={i} position={[.5+i*.99,2.3,.31]} size={[.065,19.0,.09]} material={materials.darkMetal}/>)}
      {[-3,2.5,8.5].map(y=><Box key={y} position={[1.9,y,.35]} size={[3.6,.22,.16]} material={materials.darkMetal}/>)}
    </group>
    <group ref={right} position={[3.9,0,1.98]}>
      <Box position={[-1.95,2.3,0]} size={[3.9,19.6,.52]} material={materials.wood}/>
      {Array.from({length:4},(_,i)=><Box key={i} position={[-.5-i*.99,2.3,.31]} size={[.065,19.0,.09]} material={materials.darkMetal}/>)}
      {[-3,2.5,8.5].map(y=><Box key={y} position={[-1.9,y,.35]} size={[3.6,.22,.16]} material={materials.darkMetal}/>)}
    </group>
    <mesh position={[0,15.6,2.02]} material={materials.brass}>
      <torusGeometry args={[1.12,.13,8,32]}/>
    </mesh>
    <Torch materials={materials} position={[-7.7,11,3.0]}/>
    <Torch materials={materials} position={[7.7,11,3.0]}/>
    <Banner position={[-13.4,12,2.26]} materials={materials}/>
    <Banner position={[13.4,12,2.26]} materials={materials}/>
  </group>;
}

function Courtyard({materials}){
  return <group>
    <Box position={[0,-5,-44]} size={[17,.8,47]} material={materials.floor}/>
    <mesh position={[0,-4.5,-53]} rotation={[-Math.PI/2,0,0]} material={materials.darkMetal}><circleGeometry args={[3.8,32]}/></mesh>
    <mesh position={[0,-4.35,-53]} rotation={[-Math.PI/2,0,0]} material={materials.brass}><torusGeometry args={[3.9,.12,8,48]}/></mesh>
    <mesh position={[0,-1.9,-53]} material={materials.aura}><cylinderGeometry args={[1.8,2.3,2.4,12]}/></mesh>
    <mesh position={[0,-.45,-53]} material={materials.brass}><icosahedronGeometry args={[.72,1]}/></mesh>
    {[[-21,-42],[21,-42],[-21,-63],[21,-63]].map(([x,z],i)=><Tower key={i} materials={materials} position={[x,-8,z]} height={25+(i%2)*4} radius={3.6} roofHeight={8}/>)}
    {[-1,1].map(s=><group key={s}>
      <Wall materials={materials} position={[s*17,-7,-53]} size={[3.7,20,68]} crenels={true}/>
      {[-39,-51,-63].map(z=><Torch key={z} materials={materials} position={[s*14.4,6,z]}/>)}
    </group>)}
    {[-7,7].map(x=><mesh key={x} position={[x,-4.5,-53]} rotation={[-Math.PI/2,0,0]} material={materials.brass}>
       <planeGeometry args={[.16,29]}/>
      </mesh>)}
  </group>;
}

export function CastleDistrict({materials,progress,quality}){
  return <group>
    <GothicGate materials={materials} progress={progress}/>
    {[-25,-15,15,25].map((x,i)=><Tower key={i} materials={materials} position={[x,-9,-20+(i%2)*5]} radius={i%3===0?4.3:3.3} height={24+(i%3)*7} roofHeight={10+(i%2)*3}/>)}
    <Tower materials={materials} position={[27,-8,-47]} radius={7.2} height={32} roofHeight={14}/>
    <Courtyard materials={materials}/>
    <GrandHall materials={materials} quality={quality}/>
  </group>;
}

function HallPillar({position,materials}){
  return <group position={position}>
    <Box position={[0,1.05,0]} size={[2.3,2.1,2.3]} material={materials.trim}/>
    <mesh position={[0,15,0]} material={materials.stone}>
      <cylinderGeometry args={[.86,1.1,28,8]}/>
    </mesh>
    {[2.5,27.6].map(y=><Box key={y} position={[0,y,0]} size={[2.3,.8,2.3]} material={materials.trim}/>)}
    <Box position={[0,29.3,0]} size={[3.5,1.2,3.5]} material={materials.stone}/>
  </group>;
}

function Chandelier({position,materials}){
 const ref=useRef();
 useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=Math.sin(clock.elapsedTime*.25)*.25;});
 return <group ref={ref} position={position}>
   <Box position={[0,2,0]} size={[.13,4,.13]} material={materials.darkMetal}/>
   <mesh rotation={[Math.PI/2,0,0]} material={materials.brass}><torusGeometry args={[3,.16,9,40]}/></mesh>
   {Array.from({length:10},(_,i)=>{
     const a=i*Math.PI/5;
     return <group key={i} position={[Math.sin(a)*3,0,Math.cos(a)*3]}>
       <Box position={[0,.28,0]} size={[.1,.55,.1]} material={materials.brass}/>
       <mesh position={[0,.68,0]} material={materials.fire}><coneGeometry args={[.13,.45,8]}/></mesh>
     </group>;
   })}
   <pointLight color="#e6a46f" intensity={8} distance={19}/>
 </group>;
}

function GrandHall({materials,quality}){
 return <group position={[0,-8,-73]}>
   <Box position={[0,-.12,-2]} size={[29,.9,46]} material={materials.floor}/>
    {[-1,1].map(s=><Box key={'aisle'+s} position={[s*4.8,.38,-2]} size={[.2,.035,42]} material={materials.brass}/>)}
    <Box position={[0,.4,-2]} size={[7.2,.08,38]} material={materials.darkMetal}/>
    <Box position={[0,.46,-2]} size={[6.8,.035,37.5]} material={materials.trim}/>
   {[-1,1].map(s=><group key={s}>
     <Wall materials={materials} position={[s*16.5,0,-3]} size={[3.3,32,47]} crenels={false}/>
     {[-21,-11,0,11,21].map(z=><HallPillar key={z} position={[s*11.7,0,z]} materials={materials}/>)}
     {[-13,1,14].map(z=><Lancet key={z} materials={materials} position={[s*14.74,13,z]} rotation={[0,s*Math.PI/2,0]} scale={2}/>)}
   </group>)}
   {[[-11,-11],[11,-11],[-11,11],[11,11]].map(([x,z],i)=><Banner key={i} materials={materials} position={[x,18,z]} rotation={[0,Math.PI/2,0]}/>)}
   <Box position={[0,31,-2]} size={[38,1.2,51]} material={materials.roof}/>
    {[-10,0,10].map(x=><Box key={x} position={[x,29.8,-2]} size={[.55,1.2,49]} material={materials.wood}/>)}
   <Chandelier position={[0,27,3]} materials={materials}/>
   <Chandelier position={[0,27,-16]} materials={materials}/>
    {quality==='high'&&<pointLight position={[0,17,-5]} color="#b88959" intensity={20} distance={35}/>}
    <pointLight position={[0,5,-20]} color="#8ea6b0" intensity={4} distance={18}/>
 </group>;
}

function Book({position,rotation,scale=1,color='#843e46'}){
 return <group position={position} rotation={rotation} scale={scale}>
   <mesh><boxGeometry args={[.59,.83,.15]}/><meshStandardMaterial color={color} roughness={.72}/></mesh>
   <mesh position={[.02,0,.088]}><boxGeometry args={[.47,.72,.025]}/><meshStandardMaterial color="#b7a77f" roughness={.84}/></mesh>
   <mesh position={[-.27,0,.1]}><boxGeometry args={[.045,.76,.02]}/><meshStandardMaterial color="#d8b875" metalness={.6} roughness={.35}/></mesh>
 </group>;
}

function ShelfBooks(){
 const coverRef=useRef(),paperRef=useRef();
 React.useEffect(()=>{
   const dummy=new THREE.Object3D();let index=0;
   const colors=['#3b4e6b','#6c3b4c','#405b4c','#807044','#704b32'];
   for(let row=0;row<4;row++){
     for(let i=0;i<12;i++){
       const x=-3.2+i*.56;const y=.7+row*2.18+.05;
       dummy.position.set(x,y,.64);
       dummy.rotation.set(0,(i%3-1)*.08,(i%4-1)*.025);
       dummy.scale.setScalar(1.43);
       dummy.updateMatrix();coverRef.current.setMatrixAt(index,dummy.matrix);
       coverRef.current.setColorAt(index,new THREE.Color(colors[(i*3+row)%colors.length]));
       dummy.position.set(x+.02,y,.75);
       dummy.rotation.set(0,(i%3-1)*.08,(i%4-1)*.025);
       dummy.updateMatrix();paperRef.current.setMatrixAt(index,dummy.matrix);
       index++;
     }
   }
   coverRef.current.instanceMatrix.needsUpdate=true;
   paperRef.current.instanceMatrix.needsUpdate=true;
   if(coverRef.current.instanceColor)coverRef.current.instanceColor.needsUpdate=true;
 },[]);
 return <group>
   <instancedMesh ref={coverRef} args={[undefined,undefined,48]} frustumCulled={false}>
     <boxGeometry args={[.59,.83,.15]}/>
     <meshStandardMaterial color="#ded9ca" roughness={.75}/>
   </instancedMesh>
   <instancedMesh ref={paperRef} args={[undefined,undefined,48]} frustumCulled={false}>
     <boxGeometry args={[.47,.72,.025]}/>
     <meshStandardMaterial color="#b8ae8b" roughness={.88}/>
   </instancedMesh>
 </group>;
}

function Shelf({position,rotation=[0,0,0],materials}){
 return <group position={position} rotation={rotation}>
   <Box position={[0,4.5,0]} size={[7.6,9.4,1.05]} material={materials.wood}/>
   {Array.from({length:4},(_,row)=><Box key={row} position={[0,.7+row*2.18-.79,.64]} size={[7.4,.16,1.26]} material={materials.trim}/>)}
   <ShelfBooks/>
   <Box position={[-3.7,4.5,.7]} size={[.3,9.8,1.6]} material={materials.trim}/>
   <Box position={[3.7,4.5,.7]} size={[.3,9.8,1.6]} material={materials.trim}/>
 </group>;
}

export function LibraryDistrict({materials,quality}){
  return <group position={[0,-8,-119]}>
    <Box position={[0,.08,0]} size={[37,.8,48]} material={materials.floor}/>
    {[-1,1].map(s=><group key={s}>
      <Wall position={[s*20.3,0,-2]} size={[3,28,51]} materials={materials} crenels={false}/>
      {[-18,-9,0,9,18].map(z=><Shelf key={z} position={[s*16.2,1.0,z]} rotation={[0,s*Math.PI/2,0]} materials={materials}/>)}
      {[-19,0,19].map(z=><Torch key={z} position={[s*18.4,13,z]} materials={materials} quality={quality}/>)}
    </group>)}
    {[[-7,7],[9,-7],[-2,-17]].map(([x,z],i)=><Float key={i} speed={.8+i*.25} rotationIntensity={.4} floatIntensity={.9}>
       <Book position={[x,13+i*3,z]} rotation={[.2,i*.7,.1]} scale={2.1} color={['#6b5262','#556b83','#746341'][i]}/>
     </Float>)}
    <mesh position={[0,8,0]} material={materials.aura}>
      <icosahedronGeometry args={[2.1,1]}/>
    </mesh>
    <mesh position={[0,.55,0]} rotation={[-Math.PI/2,0,0]} material={materials.darkMetal}><circleGeometry args={[5.8,48]}/></mesh>
    <mesh position={[0,.58,0]} rotation={[-Math.PI/2,0,0]} material={materials.brass}><torusGeometry args={[5.9,.12,8,64]}/></mesh>
    {[-1,1].map(s=><Box key={s} position={[s*7.8,15,0]} size={[.35,24,30]} material={materials.wood}/>)}
    <mesh position={[0,8,0]} material={materials.brass} rotation={[0,0,.4]}>
      <torusGeometry args={[3.1,.09,8,48]}/>
    </mesh>
    <Box position={[0,27,0]} size={[43,1.0,53]} material={materials.roof}/>
  </group>;
}

const portalVertex=`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const portalFrag=`uniform float uTime;uniform vec3 uColor;varying vec2 vUv;
float noise(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){vec2 p=vUv-.5;float r=length(p);float a=atan(p.y,p.x);float swirl=sin(a*7.0+r*29.0-uTime*2.1)*.16;float streak=sin(r*45.0-a*3.0+uTime*1.8)*.1;float ring=pow(max(0.,1.-r*2.),.9);float aura=ring*(.44+swirl+streak);float flecks=step(.985,noise(floor((p+vec2(uTime*.013,0.))*140.)));vec3 col=mix(uColor*.14,uColor*1.85,clamp(aura*2.,0.,1.));col+=flecks*uColor*.5;float opacity=clamp((ring*.95+flecks*.16)*(1.-smoothstep(.43,.5,r)),0.,.9);gl_FragColor=vec4(col,opacity);}`;
function Portal({position,color,materials}){
 const shader=useRef();const uniforms=useMemo(()=>({uTime:{value:0},uColor:{value:new THREE.Color(color)}}),[color]);
 useFrame(({clock})=>{if(shader.current)shader.current.uniforms.uTime.value=clock.elapsedTime;});
 return <group position={position}>
   <mesh material={materials.trim}><torusGeometry args={[4.6,.45,12,70]}/></mesh>
   <mesh rotation={[0,0,.02]} material={materials.brass}><torusGeometry args={[4.95,.075,6,72]}/></mesh>
   <mesh><circleGeometry args={[4.2,72]}/>
      <shaderMaterial ref={shader} uniforms={uniforms} vertexShader={portalVertex} fragmentShader={portalFrag} transparent depthWrite={false} side={THREE.DoubleSide}/>
   </mesh>
   {[0,1,2,3].map(i=>{
     const a=i*Math.PI/2;
     return <mesh key={i} position={[Math.cos(a)*4.6,Math.sin(a)*4.6,.2]} material={materials.brass}>
       <octahedronGeometry args={[.4]}/>
     </mesh>;
   })}
   <pointLight position={[0,0,1.2]} color={color} distance={13} intensity={3.5}/>
 </group>;
}

export function PortalDistrict({materials}){
 return <group position={[0,-8,-146]}>
   <Box position={[0,.2,0]} size={[44,1,40]} material={materials.floor}/>
   {[-1,1].map(s=><Wall key={s} position={[s*23,0,0]} size={[3.4,22,42]} materials={materials} crenels={false}/>)}
   <Portal position={[-13.1,10.8,-8]} color="#6c9695" materials={materials}/>
   <Portal position={[0,12,-10]} color="#a58c69" materials={materials}/>
   <Portal position={[13.1,10.8,-8]} color="#7d8a9d" materials={materials}/>
   {[-13.1,0,13.1].map(x=><group key={x}>
       <Box position={[x,1.1,-8]} size={[10,2.2,3.5]} material={materials.trim}/>
       <Box position={[x,2.3,-8]} size={[7.7,.24,3.7]} material={materials.brass}/>
     </group>)}
   {[-19,19].map(x=><Torch key={x} position={[x,9,2]} materials={materials}/>)}
 </group>;
}

export function TimeTower({materials}){
 const hand=useRef();const gear1=useRef(),gear2=useRef();
 useFrame(({clock})=>{
   const t=clock.elapsedTime;
   if(hand.current)hand.current.rotation.z=-t*.11;
   if(gear1.current)gear1.current.rotation.z=t*.1;
   if(gear2.current)gear2.current.rotation.z=-t*.16;
 });
 return <group position={[21,-9,-182]}>
   <Tower materials={materials} height={36} roofHeight={15} radius={8}/>
   <group position={[0,25,8.0]}>
     <mesh material={materials.darkMetal}><circleGeometry args={[6.1,80]}/></mesh>
     <mesh position={[0,0,.12]} material={materials.brass}><torusGeometry args={[5.95,.34,9,80]}/></mesh>
     <mesh position={[0,0,.18]} material={materials.brass}><torusGeometry args={[5.04,.06,7,80]}/></mesh>
     {Array.from({length:12},(_,i)=>{
       const a=i*Math.PI/6;
       return <Box key={i} position={[Math.sin(a)*5.5,Math.cos(a)*5.5,.29]} rotation={[0,0,-a]} size={[.12,i%3===0?.86:.45,.16]} material={materials.brass}/>;
     })}
     <group ref={hand} position={[0,0,.44]}>
       <Box position={[0,1.9,0]} size={[.23,3.8,.2]} material={materials.brass}/>
       <Box position={[0,-1.1,.03]} rotation={[0,0,.9]} size={[.2,2.5,.2]} material={materials.trim}/>
     </group>
     <mesh position={[0,0,.63]} material={materials.brass}><sphereGeometry args={[.48,12,12]}/></mesh>
   </group>
   <group ref={gear1} position={[-10,19,0]}>
     <mesh rotation={[0,0,0]} material={materials.brass}><torusGeometry args={[3.9,.31,9,16]}/></mesh>
     {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <Box key={i} position={[Math.sin(a)*3.9,Math.cos(a)*3.9,0]} rotation={[0,0,-a]} size={[.82,1.5,.45]} material={materials.brass}/>;})}
   </group>
   <group ref={gear2} position={[11,17,-2]}>
     <mesh material={materials.trim}><torusGeometry args={[2.8,.22,8,16]}/></mesh>
   </group>
   <Banner position={[-7,27,4]} materials={materials}/>
 </group>;
}

export function OwlPost({materials}){
 const owl=useRef();
 useFrame(({clock})=>{if(owl.current){owl.current.position.y=Math.sin(clock.elapsedTime*1.3)*.18;owl.current.rotation.y=Math.sin(clock.elapsedTime*.4)*.3;}});
 return <group position={[0,-8,-210]}>
   <Tower materials={materials} radius={7.5} height={38} roofHeight={0} topWindows={true}/>
   <Box position={[0,39,0]} size={[18,1,18]} material={materials.trim}/>
   <Crown radius={8.3} y={39.3} count={14} materials={materials}/>
   <group ref={owl} position={[5,42,3]}>
     <mesh material={materials.parchment}><sphereGeometry args={[.63,12,12]}/></mesh>
     <mesh position={[0,.8,0]} material={materials.parchment}><sphereGeometry args={[.49,12,12]}/></mesh>
     {[-.21,.21].map(x=><mesh key={x} position={[x,.84,.42]} material={materials.darkMetal}><sphereGeometry args={[.14,10,10]}/></mesh>)}
     <mesh position={[0,.66,.51]} material={materials.brass}><coneGeometry args={[.13,.4,5]}/></mesh>
     {[-1,1].map(s=><mesh key={s} position={[s*.69,0,0]} rotation={[0,0,s*.45]} material={materials.parchment}><coneGeometry args={[.42,1.3,8]}/></mesh>)}
   </group>
   <pointLight position={[0,42,0]} color="#f2bc77" intensity={14} distance={31}/>
 </group>;
}
