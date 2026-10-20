# Cinematic Experience — Technical Design

## 1. World coordinates

The 3D flight generally proceeds **from positive Z to negative Z**. Scene clusters are physically placed at different Z coordinates and connected by a spline route; the visitor is not teleported between unrelated screenshots.

| Scene | Approximate coordinate / area | User-facing chapter |
| --- | --- | --- |
| Cliff and forests | Z +95 to +20 | Prologue / First Flight |
| Gatehouse, bridge | Z -23 | Approach |
| Courtyard / hall | Z -49 to -73 | Great Hall / About |
| Magical library | Z -119 | Skills |
| Project portals | Z -146 | Projects |
| Clock tower | Z -182 | Experience |
| Owl post | Z -210 | Contact |

`src/experience/route.js` contains the physical path (`flightCurve`) and the playback timing (`tempoMap`). Separate these concepts deliberately: **people need enough scroll distance to read chapters**, so the path pauses during panel interactions. After the visitor reaches a scene, a virtual hover maintains visual life even if the path is stationary.

## 2. Camera and rider

`FlightDirector` runs from R3F `useFrame`:

- Read `progressRef` directly (no re-render every 3D frame).
- Convert global scroll progress to spline progress through a piecewise time map.
- Smooth sudden jump-to-chapter changes exponentially.
- Sample spline position and both current / future tangent for heading and turn banking.
- Maintain a chase camera behind and slightly off-center from the rider.
- Shift FOV and camera offset when approaching a docked chapter.
- Add restrained pointer influence and idle bob so the view feels responsive.

## 3. Architecture assets

Buildings are currently assembled as reusable, textured Three.js meshes:

- Gatehouse: towers, banding, crenellations, recessed lancet windows, brass trims, buttresses and swinging doors.
- Great hall: pillars, vaulted-feel elevated roof, floating chandeliers, banners and floor details.
- Library: shelves with individual books, floating volumes, central magical object.
- Portal chamber: ring frames with animated fragment-shader materials.
- Time tower: clock face, numerals/tick marks, hands and animated gear rings.
- Owl post: accessible final platform with an owl placeholder.

Original procedural textures are stored locally and can be swapped for appropriately licensed PBR textures. More detailed licensed GLB production assets should replace whole clusters as they become available; preserve local world origin and path through the central safe corridor. Rig characters and animate in Blender rather than relying on component primitives for final realism.

### Recommended production GLB handoff convention

```text
public/models/
  world/
    cliff.glb
    gatehouse.glb
    great-hall.glb
    library.glb
    portal-chamber.glb
    time-tower.glb
  characters/
    broom-rider.glb
    owl.glb
```

Use meters as Blender units, Y-up at export, a consistent scale, baked textures and glTF 2.0. Keep source Blender files in a separate project repository. Implement scene-level dynamic GLB loading and preloading, and profile texture size, mesh count and GPU memory on midrange devices. Keep `GothicGate` door animation or transfer it into authored GLB animation clips.

## 4. UI + content separation

Resume facts are authored in `src/data/portfolio.js`. World objects never store professional content. React overlay panels render real HTML for keyboard/screen-reader access. The `/resume` view can be used without entering the 3D mode and should remain readable when WebGL or motion is unavailable.

Modal cards avoid inventing achievements or external user accounts. The sample entries are deliberately marked placeholders.

## 5. Performance strategy

- Instanced trees reduce draw calls compared with hundreds of individually mounted evergreen groups.
- A React-memoized World prevents UI scroll state from rerendering the main 3D scene tree.
- Generate and reuse world materials rather than making a new material per stone.
- DPR limited based on selected quality tier; render one Canvas, not one per scene.
- Keep shader animation on the GPU for the portals.
- On small screens choose balanced detail by default.
- Before release: implement visibility culling / dedicated scene streaming as needed, compressed textures, LOD, KTX2 / Meshopt for authored models and frame-time monitoring.

## 6. Known trade-offs

This iteration is intentionally **more elaborate and interactive than the first version**, but procedural geometry does not provide film-level masonry, realistic facial acting, cloth simulation or complex foliage. The next asset-driven phase requires art production. Texture normals and metallic response give more depth than simple flat materials; they do not substitute for real scan-based materials.

A complete npm install / 3D browser build was blocked by the build machine's network controls. JS/JSX syntax was verified with the system TypeScript parser. Validate the WebGL runtime on a developer machine before production use.
