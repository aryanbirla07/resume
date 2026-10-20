# The Enchanted Journey — Cinematic V4

**A darker, more mature interactive fantasy portfolio.** This package contains an upgraded React + Three.js website, original generated key art, new procedurally generated material maps, a 14-chapter scroll route, five aerial skill challenges, and a standalone self-contained interactive design preview.

## Start here

**See the visual direction immediately:** open `interactive-visual-preview.html` in a normal desktop/mobile browser. It is a 2D art-direction preview with working scroll and chapter navigation. It is **not a recording or substitute for the WebGL website**.

**Run the actual Three.js website:**

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

**Build for production:**

```bash
npm run build
npm run preview
```

**Run checks:**

```bash
npm run check:syntax
npm run check:journey
```

Node 20+ recommended. All packages are declared in `package.json`. Dependencies are not included in this ZIP; your computer will need internet access for `npm install`.

## Project layout

```text
src/
  data/portfolio.js          Your real resume content, 14 locations and skill rings
  main.jsx                   React UI, atlas, scroll progression, settings and HUD
  style.css                  Mature cinematic visual system
  experience/
    World.jsx                R3F Canvas + shared PBR materials
    route.js                 3D waypoints + dwell timing
    FlightDirector.jsx       Smoothed chase camera and broom movement
    BroomRider.jsx           Detailed PROCEDURAL character placeholder
  world/
    Architecture.jsx         Original castle + hall + library + portals + towers
    CinematicDistricts.jsx  Viaduct, arena, courtyard, forge, relic hall
    Environment.jsx          Moonlight, forest, mountains, fog and atmospheric layers
  ui/ResumeView.jsx          Text resume when WebGL isn't desired
public/
  art/                       Cinematic background art / moodboard
  textures/                  Color, normal and roughness prototype maps
scripts/
  build-visual-preview.py
  generate_cinematic_textures.py
  verify-journey.mjs
  verify-syntax.cjs
docs/
  CINEMATIC_DESIGN_SYSTEM.md
  14_CHAPTER_STORYBOARD.md
  3D_ASSET_PRODUCTION.md
```

## Update with your real portfolio

Edit `src/data/portfolio.js` only for identity, summary, skills, project studies, company roles, achievements, social links and downloadable resume.

All personal details, jobs and results are **explicit sample placeholders**, not claims about a real person. Put `resume.pdf` under `public/` and set `resumeUrl:'/resume.pdf'` in the data. Use real external URLs for GitHub, LinkedIn and project links.

- Main experience: `/`
- Accessible non-WebGL resume: `/resume`
- Main chapter atlas and five ring unlocks: click / scroll within the app.

## What's actually changed in V4

1. Fully replaced the bubbly, game-for-children style with mature dark editorial HTML/CSS.
2. New cinematic entry art and thin aged-brass typography and border system.
3. Expanded to fourteen named locations on an authored spline flight route.
4. Added an actual large oval Sky Arena with five animated brass trial rings.
5. Ring progress is genuinely linked to scroll progress and reverses on backwards scroll.
6. Added structural environment meshes: ruined Gothic viaduct, courtyard, forge, achievement hall.
7. Darkened, textured architecture with custom color, normal and roughness maps.
8. Improved the procedural rider's hood / layered coat / belt / gloves / bridle details.
9. Redesigned world atlas, project case-study panel, HUD, status toasts and résumé fallback.
10. Added data + source checks and an accessible reduced-motion switch.

## Visual fidelity / validation disclosures

- The **interactive visual preview** has been tested in headless Chromium: it shows the preview UI, scroll updates the arena counter, the Atlas opens and no JavaScript errors occurred during that test.
- The **React app** passes JSX/JS syntax checks and the custom journey-data tests. It has **not** passed a full `npm run build` or real WebGL browser run here because dependencies could not be installed in this container. Please run the commands above locally before deploying.
- The key art is **cinematic concept artwork**, not an actual output of the procedural 3D renderer. This separation is intentional and disclosed.
- The rider, buildings and materials in the package are improved procedural **prototypes**. A genuinely photorealistic hero model, cloth simulation and professional architecture require authored/licensed optimized GLBs as described in `docs/3D_ASSET_PRODUCTION.md`.

## Copyright

Original fantasy styling without official franchise logos, named characters, licensed game/movie models or soundtrack. The generated cinematic art is included as a design asset. The production site should only use independently created or appropriately licensed art.
