# PRODUCTION ASSET PIPELINE — FROM PROCEDURAL DEMO TO BELIEVABLE REALISM

The V4 package includes procedural geometry; it does not pretend to include a licensed premium GLB pack. To reach the realism of the cinematic key art, build or license the assets below, checking commercial usage and attribution for every download.

## Hero rider — production specification

**Look:** adult traveler, athletic but natural proportions, expressive silhouette, hooded layered cloak, belted leather chest, reinforced boots, gloves, realistic grip and believable seat on a single wooden broom.

**Asset:** `public/models/hero-rider.glb`

**Rig:** root / hips / spine / chest / neck / head, arms with fingers for grip, legs and knees, cloth secondary bones or baked cloth mesh animations. Retopologize for deformation rather than using a massive unoptimized sculpt.

**Animation clips:** `idle-breath`, `mount`, `takeoff`, `flight-idle`, `bank-left`, `bank-right`, `dive`, `brake`, `landing`, `look-at`, `dismount`. Blend across clips in React Three Fiber's animation mixer. Avoid changing pose discretely on a progress threshold.

**Materials:** fabric base/normal/roughness; leather base/normal/roughness; wood grain along broom shaft; metal roughness and mask. Add controlled dirt, directional wear and jacket seams.

**LOD:** LOD0 under 60k–100k tris for rider/broom combined (art-dependent; test on hardware), lower distant and mobile levels. One skeleton and bounded materials per LOD. Bake tiny details instead of modeling each stitch.

## Environment assets

| Group | Content | Placement |
|---|---|---|
| Cliff | Layered ground, wet-rock edge, scattered stones | 00 |
| Forest | 3–6 variants of real tree profiles + 2 LODs each | 01 |
| Viaduct | Modular arch spans, damaged pieces, parapet | 02 |
| Gatehouse | Gothic arch entry, large hinged gate, masonry | 03 |
| Great Hall | Ribbed ceiling, columns, chandeliers, windows | 04 |
| Courtyard | Column sets, statues, fountain/compass | 05 |
| Arena | Oval stands, tower variants, five hoop assets | 06 |
| Forge | Anvil, furnace, gear train, bench, tools | 07 |
| Library | Shelves, varied books, railings, stairways | 08 |
| Nexus | 3 portal arches + platforms; keep shader energy separate | 09 |
| Clock | Tower structure, gears, clock face | 10 |
| Relic gallery | 3 pedestals and deliberate sculptural pieces | 11 |
| Observatory | Tall parapet, telescope, owl and message envelope | 12 |
| Finale | Distant panorama / sky dome / cloud cards | 13 |

## Workflow

1. Blockout scenes at correct dimensions. Match camera path before sculpting detailed geometry.
2. Sculpt or assemble architecture with physically plausible spans and structural support.
3. Retopologize or decimate deliberately; UV unwrap and atlas repeating assets.
4. Bake normal, roughness, AO and curvature masks. Avoid generic all-over noise.
5. Export GLB with clear node names. Use axes/origin conventions consistently; verify transforms.
6. Validate LODs and texture compression. Measure mobile memory and draw calls.
7. Plug authored GLBs into world modules, replacing procedural placeholders one location at a time.
8. QA each entry/exit camera path for clipping, lighting discontinuities and impossible geometry.

## Lighting

Separate cold exterior moonlight from selective warm lamps. Prefer baked lighting on buildings, one key directional moon and a few localized moving fire sources. Use contact and AO details where needed, but avoid blanket black shadows obscuring the content.

## Animation

- Flight pose blends driven by speed and turn curvature, not decorative sine movement alone.
- Cloak: approximate wind direction from actual spline tangent and speed.
- Gate: eased hinge rotation, preceded by a short weighty initial movement.
- Flags: restrained procedural cloth motion with asymmetry.
- Score rings: a small warm reaction, then retained discovered state.
- Clockwork: different gear rotations with consistent relationships rather than arbitrary speed.

## Intellectual property

Make an original wizarding world. Avoid copying Hogwarts geometry, named houses, protected insignias, official character likenesses, or licensed soundtrack. Generic Gothic architecture, flying brooms, castles and fantasy stadiums can be independently designed.

## Honest delivery state

**Working prototype:** Vite/React/Three.js with geometry, materials, procedural animation, game HUD and scroll system.

**Target fidelity:** cinematic realistic environment and hero character. This is a separate paid/creative asset production task; the included code cannot substitute for these models on its own.
