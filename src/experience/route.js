import * as THREE from 'three';

/** An authored aerial path; its knots are not linked to scroll distance 1:1. */
const knots = [
  [0,10,104],[-6,17,75],[-13,22,38],[0,14,-17],
  [0,9,-70],[0,13,-90],[23,22,-97],
  [34,24,-99],[44,27,-104],[55,27,-111],[55,24,-122],[47,19,-132],
  [36,16,-138],[0,12,-121],[0,12,-148],[19,30,-183],
  [5,25,-194],[0,43,-210],[-13,55,-240],[-29,63,-268],
];
export const flightCurve = new THREE.CatmullRomCurve3(knots.map(k=>new THREE.Vector3(...k)), false, 'centripetal', .35);

const timeline=[
  [0,0],[.048,1],[.125,2],[.205,3],[.285,4],[.342,4],
  [.365,5],[.409,5],[.425,6],[.446,7],[.478,8],
  [.510,9],[.542,10],[.574,11],[.615,12],[.663,12],
  [.682,13],[.728,13],[.742,14],[.811,14],
  [.823,15],[.874,15],[.888,16],[.916,16],
  [.927,17],[.963,17],[.973,18],[1,19],
];
const n=knots.length-1;
const clamp01=n=>Math.min(1,Math.max(0,n));
const smoother=t=>t*t*(3-2*t);
export function routeAt(scrollProgress){
  const p=clamp01(scrollProgress);
  for(let i=1;i<timeline.length;i++){
    const [s1,k1]=timeline[i], [s0,k0]=timeline[i-1];
    if(p<=s1){
      const f=s1>s0?smoother(clamp01((p-s0)/(s1-s0))):0;
      return (k0+(k1-k0)*f)/n;
    }
  }
  return 1;
}
export function isDocked(p){
  return [[.285,.342],[.365,.409],[.615,.663],[.682,.728],[.742,.811],[.823,.874],[.888,.916],[.927,.963]].some(([a,b])=>p>=a&&p<=b);
}
export const waypointCount=knots.length;
