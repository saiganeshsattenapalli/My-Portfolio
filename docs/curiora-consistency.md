# Curiora consistency review

The earlier Phase 2 preview was a first material pass. This follow-up compares the actual local implementation sources and corrects the flattened surfaces and missing interaction states.

## Sources inspected and decisions

| Source | Implementation inspected | Applied to portfolio |
| --- | --- | --- |
| Curiora Campus | `static/css/design-system.css`, `components.css`, `home.css`, `animations.css`, `static/js/app.js` | Canonical palette, glass filter, blue-tinted shadows, moving signature highlight, button lift, 12s/16s orbit timing |
| Curiora Design System | `css/tokens.css`, `glass.css`, `components.css`, `js/interactions.js`, `js/signature.js` | Shared durations/easing, interactive glass lift, pill controls, pointer highlight reset and reduced-motion handling |
| Curiora Research | `static/css/research.css`, `static/js/research.js` | Neutral surfaces, dark headline treatment, navigation color and 1px lift; research.js contains initialization only |
| Spoorthi birthday | `static/styles.css`, `static/script.js` | Bounded 140ms reveal stagger, soft pointer-responsive lighting, arrow travel and button press feedback |

Campus remains the canonical palette where the folders conflict. The standalone Design System has different neutral text values and glass opacity; those do not override Campus. The birthday project also contains dark theatrical scenes, long typing sequences, and continuous animation loops; only its small interaction patterns are adapted. No birthday content, contact data, photos, or videos are copied.

## Corrections

- Restored near-white material depth rather than gradients whose color stops were all the same gray.
- Restored visible but fine research grid lines.
- Kept major typography dark and reserved Azure for controls, links, selected states, and subtle material refraction.
- Added Campus's moving radial signature highlight, with reset on pointer exit and pause.
- Matched Campus orbit angle ranges and timing, with no extra animation subsystem.
- Added Design System card lift (4px), Campus button lift (2px), Research navigation lift (1px), and birthday arrow feedback (4px).
- Shared hover shadows, highlight colors, and surface states live in design-system.css. portfolio.css contains no independent palette.
- Hover movement is limited to fine pointers; reduced-motion users receive static hover color feedback and visible content.
- Preserved project facts, current/planned architecture distinctions, hero wording, and resume files. Presentation markup now uses shared button classes for action links.

## Verification and delivery

Run `tests/browser_content.cjs` and `tests/browser_design.cjs` against the FastAPI preview. The design check saves current desktop, navbar, selected-work, and mobile screenshots plus computed-token evidence in `docs/previews/current/`.

Chrome is tested with an isolated headless desktop profile. Safari remains unverified after the previously reported automatic approval rejection; no Chrome result is represented as Safari evidence.

README setup now uses the correct root `main:app`. `render.yaml` prepares a free native Python web service using the official Render FastAPI commands. No hosting credentials or existing deployment were found, so publishing a live service requires a connected hosting account.

## Slim navigation and breathing core refinement

The navbar now follows Campus's 52px height and 1100px maximum width. Azure primary buttons and black secondary buttons replace action text links across the hero, project cards, evidence links, ecosystem links, resume, and contact area. Navigation links retain their navigation treatment.

The signature is now a single glass capsule with CURIO lettering. Removed the detailed chip header, footer, and inset frame. A separate wrapper carries its eight-second float, leaving pointer tilt independent; a synchronized soft shadow and twelve-second ambient glow add gentle breathing. All continuous scene motion responds to the existing pause, visibility, and reduced-motion controls. Hero copy arrives once with a short stagger.

Python content tests and both Chrome browser suites pass. The design suite checks the 52px navbar, black secondary material, absence of old card labels, floating animation pause, and reduced-motion fallback. Current hero, navbar, mobile, and selected-work screenshots were refreshed and visually reviewed.
