import React, {useMemo, useRef} from 'react';
import {useFrame,useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {BroomRider} from './BroomRider';
import {flightCurve, routeAt, isDocked} from './route';

/**
 * Authoritative world-space flight controller.
 * UI never updates the camera directly; it only updates progressRef.
 * The camera and rider interpolate on the render loop to avoid React render jitter.
 */
export function FlightDirector({progressRef,startedRef,pointerRef,quality}){
 const {camera}=useThree();
 const rider=useRef();
 const target=useMemo(()=>({
   position:new THREE.Vector3(),forward:new THREE.Vector3(),future:new THREE.Vector3(),right:new THREE.Vector3(),
   cam:new THREE.Vector3(),look:new THREE.Vector3(),lerpLook:new THREE.Vector3(0,9,-22),
   desiredQuat:new THREE.Quaternion(),up:new THREE.Vector3(0,1,0)
 }),[]);
 const motion=useRef({t:0,lastT:0,bank:0});
 useFrame(({clock},delta)=>{
   const dt=Math.min(delta,.05),tme=clock.elapsedTime;
   const started=startedRef.current;
   const scroll=started?progressRef.current:0;
   const rawT=started?routeAt(scroll):0;
   const docked=started && isDocked(scroll);
   // Scroll jumps damp in rather than teleporting the camera.
   const smooth=1-Math.exp(-dt*(started?2.2:1.1));
   motion.current.t=THREE.MathUtils.lerp(motion.current.t,rawT,smooth);
   const t=motion.current.t;
   const pos=flightCurve.getPoint(t,target.position);
   const futureT=Math.min(.999,t+.008);
   flightCurve.getTangent(t,target.forward).normalize();
   flightCurve.getTangent(futureT,target.future).normalize();
   const tangent=target.forward;
   const curveSign=tangent.x*target.future.z-tangent.z*target.future.x;
   const deltaT=(t-motion.current.lastT)/dt;motion.current.lastT=t;
   const speed=Math.min(1,Math.abs(deltaT)*4);
   const pointer=pointerRef.current;
   const steerX=pointer?.x??0;const steerY=pointer?.y??0;
   const wantedBank=THREE.MathUtils.clamp(curveSign*-13+steerX*.19,-.47,.47)*(docked?.22:1);
   motion.current.bank=THREE.MathUtils.damp(motion.current.bank,wantedBank,3.3,dt);
   const yaw=Math.atan2(-tangent.x,-tangent.z);
   const bob=Math.sin(tme*3.8)*.09+(docked?Math.sin(tme*1.7)*.15:0);
   if(rider.current){
     rider.current.position.set(pos.x,pos.y+bob,pos.z);
     rider.current.rotation.set(THREE.MathUtils.clamp(-tangent.y*.3,-.22,.22),yaw,motion.current.bank,'YXZ');
   }
   target.right.set(-tangent.z,0,tangent.x).normalize();
   if(!started){
     target.cam.set(-25,18,125);
     target.look.set(0,13,-4);
   }else{
     target.cam.copy(pos)
       .addScaledVector(tangent,-(docked?9:7.4))
       .addScaledVector(target.right,docked?5.4:2.1)
       .addScaledVector(target.up,docked?4.8:2.85);
     target.cam.y+=steerY*.55;
     target.cam.addScaledVector(target.right,steerX*.7);
     target.look.copy(pos).addScaledVector(tangent,docked?7.5:9.7);
     target.look.y+=docked?1.3:.7;
     target.look.addScaledVector(target.right,steerX*.4);
   }
   camera.position.lerp(target.cam,1-Math.exp(-dt*(started?2.1:1.15)));
   target.lerpLook.lerp(target.look,1-Math.exp(-dt*3.15));
   camera.lookAt(target.lerpLook);
   if(started)camera.rotateZ(-motion.current.bank*.075);
   const fov=started?(docked?50:60+speed*4):46;
   camera.fov=THREE.MathUtils.damp(camera.fov,fov,2,dt);
   camera.updateProjectionMatrix();
 });
 return <group ref={rider}>
   <BroomRider quality={quality}/>
 </group>;
}
