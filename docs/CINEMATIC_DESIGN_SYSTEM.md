# THE ENCHANTED JOURNEY — CINEMATIC REALISM DESIGN SYSTEM

**Version:** 4.0 — mature visual redesign

## North star

A weathered, believable fantasy kingdom through which an adult developer's career is revealed. It should feel photographed from an unusually beautiful fantasy game, rather than assembled from a collection of cute floating shapes. The environment is the stage; real, verifiable work is the substance. Everything remains scroll-controllable, with no difficult controls between a recruiter and the relevant information.

Reference adjectives: **monumental, restrained, tactile, ancient, intentional, atmospheric, editorial**.

Avoid: candy-colored magic, bouncing elements, friendly round cards, giant emoji or repetitive neon outlines, toy geometry in production, excessive bloom, arbitrary percent scores for skills, game mechanics that obstruct a resume.

## Color and materials

| Token | Hex | Role |
|---|---|---|
| Obsidian | `#07090C` | Site chrome, nocturnal backgrounds |
| Deep iron | `#11171B` | Panels and modal surfaces |
| Weathered slate | `#303B43` | Cold building accents |
| Aged brass | `#B9A078` | Thin rules, progress, active states |
| Warm paper | `#E8DFCF` | Primary text |
| Ash gray | `#A7A59E` | Supporting text |
| Tarnished copper | `#8D7755` | Minimal secondary gold |
| Ember | `#CB824A` | Local fire sources only |
| Deep moss | `#24332A` | Organic environment undertone |

Lighting ratio: moonlit exterior dominant; concentrated amber at windows, torches and forges. All magical light sources must feel motivated by something physically in the world.

## Material rules

Stone: PBR albedo, normal, roughness and optional ambient occlusion; vary stones subtly, with grime in recesses, moss in damp zones, worn stone on steps, soot beneath torches. Avoid uniformly tiled artificial bricks.

Wood: directional grain, beveled edges, exposed end grain on beams, darkening around fittings. Leather: fine grain, roughness variation and actual seams or stitched strips at hero-camera range.

Metal: dark iron with scratched corners; brass tarnished except at touched edges. Glass: avoid fluorescent saturation; use colored, dirty panes and warm transmission/emissive where supported.

Fabric: a layered cloak with weight, seams, a restrained woven normal and motion driven by airspeed. Avoid rigid triangular capes and a pointed costume hat.

## Architectural language

Primary architecture: pointed Gothic windows, ribbed vaults, buttresses, restrained crenellations, plausible masonry joints, bridges carrying actual loads, believable entry sizes, accessible stairs, narrow alcoves, ironwork and rainwater markings.

Each hero building needs three levels of detail:

1. **Silhouette:** the recognizable composition from far away (spires, roofline, buttresses, terraces).
2. **Structural language:** beams, columns, buttresses, lintels, bridge supports, arches.
3. **Human-scale detail:** window reveals, wear, railings, hinges, step edges, flags, hanging chains, lamps, plaques, dripping moss.

Hand-authored irregularity is essential: use small purposeful asymmetries, never random scatter for its own sake.

## Character direction

Adult-sized rider, shoulders and hand grip plausible, body inclined into flight. Blackened olive / charcoal layered travel coat, weathered leather chest strap, gloves, durable boots, hood instead of novelty pointed hat. The broom should be ash wood with fine taper, leather grip bands, brass ferrules and multiple uneven bristle bundles.

**Animation clips for production GLB:** `idle-breath`, `mount`, `takeoff`, `flight-idle`, `bank-left`, `bank-right`, `dive`, `brake`, `landing`, `look-at`, `dismount`. Blend pose changes over 0.4–1.2s, adjust cape simulation with speed, allow very small head and hand reaction. Camera bob must stay secondary to the subject.

The bundled rider is a *procedural placeholder* with a darker silhouette and more costume detail. It is not equivalent to a sculpted, retopologized, fully rigged hero character.

## Typography / HUD

- Main narrative: Cormorant Garamond (elegant editorial serif); fallback Georgia.
- Small section numbering: Cinzel, only for microtext, chapter numbers and insignias.
- Technical content: DM Sans / system sans for readable text.
- Hero title: `clamp(76px, 7.8vw, 148px)` desktop; generous negative tracking, compact line height.
- Editorial panels: around 620px wide, left-anchored, clean rows and hairline borders.
- Minimal radii: 0–2px; **no rounded card zoo**.

The interface uses 1px patinated rules, a carved insignia and high-contrast warm cream. HUD copy stays short. Text panels are rendered as real HTML over WebGL; never texture-map essential resume text into inaccessible 3D canvases.

## Motion principles

- Scroll progress is the source of truth, from 0 to 1.
- Camera is damped in `useFrame` using delta time; no sharp teleports except user-initiated chapter jumps, which are themselves smoothed.
- Rider banks gently with curvature; banking is less pronounced while docked at a content stop.
- Major gates have mass and delay. Do not bounce them open.
- Ring activation is brief brass emission and visual confirmation, not neon explosions.
- Overlay titles enter with 0.4–0.65s low-velocity fade / upward drift.
- UI must not animate for no reason while someone is reading.
- Magic particles are sparse; ambient sparks should feel like atmosphere, not confetti.
- Respect `prefers-reduced-motion` and expose a persistent-in-visit toggle.

Easing: cubic Bezier `(.22,.61,.36,1)` for title entrances, exp damping for chase camera, smoothstep spline interpolation for authored knots. No spring overshoot on critical UI.

## Scroll-only game layer

Game-state source: normalized scroll progress. At five sky-arena thresholds, rings activate and show a grounded skill discipline. Scrolling backwards reverses completion; no persistence is implied. Manual clicking of discipline tabs is **inspection**, not a second control scheme required to continue.

- Enter arena at ~42.5% of tour.
- Ring thresholds: 44.6%, 47.8%, 51.0%, 54.2%, 57.4%.
- Flight travels ring-to-ring while the user's scroll advances.
- UI shows `RINGS CROSSED 00 / 05` plus short toast when a new ring is crossed.
- A reader can jump to any chapter with the Atlas; progress is never an accessibility gate.

## Scene composition constraints

Foreground: character/broom, nearby stone, railings, rain, selected torches. Midground: castle facades, bridge spans, structural scenery and interactive rings. Background: distant rooflines, high ridges, forests and dramatic sky. Atmosphere: fog and selective moon haze.

Depth cannot be replaced by indiscriminate bloom; use fog and lighting to separate objects by distance. Exterior blue-green and warm interior gold should remain desaturated.

## Rendering and optimization

- Use physically based materials, compressed textures and curated LODs.
- Keep dynamic lights local. Bake most building illumination in texture or lightmaps where possible.
- Use KTX2/Basis for production textures and Draco/Meshopt GLBs where suitable.
- Reuse geometry/materials; instance distant masonry, windows and trees.
- Use camera frustum culling and unload zones well behind the rider.
- Set separate desktop high / balanced mobile profiles.
- Aim for 60fps on a capable desktop, 30fps on supported mobile, but validate on physical hardware rather than treating this as guaranteed.
- Render a static title screen immediately and allow resume access if WebGL is unavailable.

## Source of truth

All personal data is in `src/data/portfolio.js`. Empty contact fields deliberately prevent fake contact links. Real projects and awards are **not** invented. Replace demo placeholders before publishing.

## Produced in V4 / intentionally not claimed

Included: dramatic cinematic key art, dark editorial UI, scroll path with 14 chapters, game HUD, five ring thresholds, procedural stone viaduct, arena architecture, forge, identity court, relic hall, darkened material palette and improved procedural rider.

Not included: photoreal authored GLB character, full motion-capture animation, a production-grade scanned castle, cinematic cloud volumes or independently verified production browser performance. These require the separate art pipeline below and visual QA on installed dependencies.
