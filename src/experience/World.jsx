import React, {Suspense, useMemo} from 'react';
import {Canvas} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';
import * as THREE from 'three';
import {Environment} from '../world/Environment';
import {CastleDistrict,LibraryDistrict,PortalDistrict,TimeTower,OwlPost} from '../world/Architecture';
import {FlightDirector} from './FlightDirector';
import {BrokenViaduct,IdentityCourt,SkyArena,ArcaneForge,HallOfRelics} from '../world/CinematicDistricts';

function Materials({children}){
 const tex=useTexture({
   stone:'/textures/aged-stone-color.jpg',stoneNormal:'/textures/aged-stone-normal.jpg',stoneRoughness:'/textures/aged-stone-roughness.jpg',
   roof:'/textures/roof-slate.jpg',roofNormal:'/textures/roof-normal.jpg',
   ground:'/textures/forest-ground.jpg',wood:'/textures/aged-timber-color.jpg',parchment:'/textures/parchment.jpg'
 });
 const materials=useMemo(()=>{
   Object.entries(tex).forEach(([key,t])=>{
     t.wrapS=t.wrapT=THREE.RepeatWrapping;
     if(!key.toLowerCase().includes('normal')&&!key.toLowerCase().includes('roughness'))t.colorSpace=THREE.SRGBColorSpace;
     if(key==='ground')t.repeat.set(30,30);
     if(key==='roof'||key==='roofNormal')t.repeat.set(2,3);
     if(key==='stone'||key==='stoneNormal'||key==='stoneRoughness')t.repeat.set(1.5,2);
     if(key==='wood')t.repeat.set(2,2);
     t.anisotropy=4;
     t.needsUpdate=true;
   });
   return {
     stone:new THREE.MeshStandardMaterial({map:tex.stone,normalMap:tex.stoneNormal,roughnessMap:tex.stoneRoughness,roughness:.94,metalness:0,color:'#d5d2ca'}),
     trim:new THREE.MeshStandardMaterial({map:tex.stone,roughnessMap:tex.stoneRoughness,roughness:.91,color:'#b5aaa0'}),
     roof:new THREE.MeshStandardMaterial({map:tex.roof,normalMap:tex.roofNormal,roughness:.87,metalness:.04,color:'#7e878b'}),
     ground:new THREE.MeshStandardMaterial({map:tex.ground,roughness:1,color:'#657267'}),
     floor:new THREE.MeshStandardMaterial({map:tex.stone,roughnessMap:tex.stoneRoughness,roughness:.96,color:'#b3ada1'}),
     wood:new THREE.MeshStandardMaterial({map:tex.wood,color:'#af9e92',roughness:.89}),
     glass:new THREE.MeshStandardMaterial({color:'#b69c68',emissive:'#dc8742',emissiveIntensity:.95,roughness:.3,metalness:.16}),
     brass:new THREE.MeshStandardMaterial({color:'#8d7857',metalness:.81,roughness:.46,emissive:'#271d0d',emissiveIntensity:.045}),
     darkMetal:new THREE.MeshStandardMaterial({color:'#17191c',metalness:.81,roughness:.48}),
     banner:new THREE.MeshStandardMaterial({color:'#433333',side:THREE.DoubleSide,roughness:1}),
     parchment:new THREE.MeshStandardMaterial({map:tex.parchment,roughness:1}),
     fire:new THREE.MeshBasicMaterial({color:'#d18a50'}),
     aura:new THREE.MeshStandardMaterial({color:'#779397',emissive:'#365f68',emissiveIntensity:.48,metalness:.5,roughness:.48}),
   };
 },[tex]);
 return children(materials);
}

function WorldContent({progressRef,startedRef,pointerRef,quality}){
 return <Materials>{(materials)=><>
   <Environment materials={materials} quality={quality}/>
   <BrokenViaduct materials={materials}/>
   <CastleDistrict materials={materials} progress={progressRef} quality={quality}/>
   <IdentityCourt materials={materials}/>
   <SkyArena materials={materials} progressRef={progressRef} quality={quality}/>
   <ArcaneForge materials={materials} quality={quality}/>
   <HallOfRelics materials={materials}/>
   <LibraryDistrict materials={materials} quality={quality}/>
   <PortalDistrict materials={materials}/>
   <TimeTower materials={materials}/>
   <OwlPost materials={materials}/>
   <FlightDirector progressRef={progressRef} startedRef={startedRef} pointerRef={pointerRef} quality={quality}/>
 </>}</Materials>;
}

function WorldImpl({progressRef,startedRef,pointerRef,quality='high'}){
 return <Canvas
   camera={{position:[-25,18,125],near:.08,far:580,fov:46}}
   dpr={quality==='high'?[1,1.65]:[1,1.15]}
   gl={{antialias:quality==='high',alpha:false,powerPreference:'high-performance'}}
   onCreated={({scene,gl})=>{
     scene.background=new THREE.Color('#070a0e');
     gl.outputColorSpace=THREE.SRGBColorSpace;
     gl.toneMapping=THREE.ACESFilmicToneMapping;
     gl.toneMappingExposure=1.07;
   }}>
   <color attach="background" args={['#070a0e']}/>
   <Suspense fallback={null}>
     <WorldContent progressRef={progressRef} startedRef={startedRef} pointerRef={pointerRef} quality={quality}/>
   </Suspense>
 </Canvas>;
}

export const World=React.memo(WorldImpl);
