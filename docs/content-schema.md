# Portfolio content contract

Phase 1 contract, reviewed September 14, 2026.

## Ownership and scope

`data/projects.json` is the canonical source for project identity, links, descriptions, technologies, model mappings, implemented capabilities, limitations, and architecture status. Edit a project there rather than in HTML or JavaScript.

`data/research.json` owns research/learning topics. It references projects and models by stable IDs instead of copying their descriptions, model names, or repository URLs.

`docs/resume-evidence.md` is the private editorial evidence ledger: source priority, candidate facts, code references, qualifications, and the approved two-resume strategy. It is not served by the app. Implementation code takes precedence over repository metadata, then README claims, then the historical resume.

Phase 1 does not change the hero, stylesheet implementation, signature interaction, resume layout, resume builder, or PDF/DOCX outputs. The existing generic resume is a historical artifact; it is not a third planned resume. Future resume work must read canonical project identity and facts from `projects.json`.

## Data flow

1. `main.py` reads both JSON files for each homepage request.
2. It derives `project_by_id` and `project_facts` lookup tables from those same records. These maps contain no separate authored copy.
3. `templates/components/project_content.html` renders the existing cards from a project record. Existing skill-evidence paragraphs use the capability lookup.
4. The template embeds the same project array in `script#project-data` with Jinja's `tojson` filter. Do not replace this with raw JSON interpolation or `safe`.
5. `static/js/app.js` reads the embedded snapshot and renders dialogs using `textContent`. It contains interaction logic and generic section labels, not a second project-content object.
6. `/projects` returns the canonical project array. `/research` returns the topic/reference array. Both endpoints retain their array response shape.

This keeps each rendered page internally consistent without a second browser fetch. A later edit appears on the next request/page load; an already open page keeps its original snapshot.

## Project record

The root is an array. Each record has these fields:

| Field | Meaning |
| --- | --- |
| `id` | Unique, stable lowercase identifier; used by templates, dialogs, research and future resumes. |
| `name`, `component` | Canonical project name and optional named component. `campus` is Curiora CampusOS; its component is Curio. |
| `kind` | `project`, `supporting_project`, or `learning_collection`. |
| `description` | One concise public description used verbatim in the card and dialog. |
| `github_url`, `link_kind` | Verified origin URL or a clearly identified GitHub `profile` link; `repository` links refer to implementation repositories. |
| `status`, `focus`, `categories`, `featured` | Honest maturity and editorial grouping. Categories describe the work, not production readiness or separate career identities. |
| `tech_stack`, `tags` | Full verified technologies and a display subset. Every tag must occur in the stack. Pretrained model names belong in `models`, rather than being represented as personally trained technologies. |
| `question`, `approach` | Editorial explanation of the question and engineering approach, grounded in the project. |
| `capabilities` | Objects with stable `id` and source-backed `text`. These feed dialogs and selected capability-evidence paragraphs. |
| `limitations` | Explicit boundaries that must accompany expanded project or resume interpretation. |
| `models` | Model ID, modality, name, integration/demo role, and `trained_by_author`. Pretrained integrations include runtime model IDs; the synthetic classifier includes training-data and evaluation scope. Empty when inapplicable. |
| `architecture` | Separate `implemented` and `product_direction` objects for Curio; otherwise `null`. |
| `card` | Existing card number, eyebrow, generic action labels and arrow flag. `null` for supporting projects currently displayed as ecosystem links. |
| `reviewed_at` | ISO date of source review, not a release, deployment, employment or benchmark date. |

No absolute local paths, secrets, candidate contact information, or private repository contents are embedded in public project data.

## Stable identities and source selection

| ID | Canonical identity | Link type / reason |
| --- | --- | --- |
| `campus` | Curiora CampusOS, with Curio as its intelligence component | Repository origin from local `Curiora-Campus`, whose actual API, gateway and runtime implementation was inspected. |
| `pay` | Curiora Pay | Implementation repository belongs to `Curiora-intelligence`, not the personal GitHub account. |
| `research` | Curiora Research | Implementation repository for the local visual-inference experiment. |
| `foundations` | The foundations matter. | Learning collection with a profile link; not an invented product or a claim that every local exercise is published. |
| `design-system` | Curiora Design System | Supporting visual primitives, not a target frontend career identity. |
| `website` | Curiora Website | Supporting landing-page prototype, not a production/deployment claim. |

The old separate Curio/Campus records are consolidated into one implementation-backed identity. The unsupported standalone Intelligence Lab entry is removed. The three primary resume projects remain CampusOS/Curio, Pay and Research.

## Model and architecture boundaries

Curio's models are explicitly mapped in both structured data and its visible card description:

- Text: GPT-OSS 20B, a pretrained integration.
- Vision / Multimodal: Qwen3-VL 8B, a pretrained integration.

Research also integrates pretrained Qwen3-VL 8B. Only Pay's small logistic-regression learning demonstration is marked as trained by the author; its eight synthetic rows and absent held-out evaluation are recorded explicitly.

`architecture.implemented` contains the source-backed request path:

Input → Validation → Modality routing → Model gateway → Runtime → Inference → Response / cleanup.

`architecture.product_direction` separately contains Perceive → Understand → Route → Act → Verify. Individual stages carry `name`, `status`, and `scope`. Act and Verify must remain `Planned` until executable action orchestration and independent outcome verification are evidenced. Input checks and image-grounding prompts do not establish an outcome verifier.

## Research record

Every topic has `id`, `topic`, `status`, `description`, `project_ids`, and `claim_scope`.

Optional `model_refs` contain `{project_id, model_id}` pairs resolving into `projects.json`. Optional `architecture_ref` identifies a project and the `product_direction` field. A learning goal may have an empty `project_ids` array and must not be represented as completed project evidence.

## Checks

Install development dependencies with `python -m pip install -r requirements-dev.txt` and run:

```sh
python -m unittest discover -s tests -v
```

The checks cover record/reference integrity, pretrained-model attribution, planned Act/Verify status, API/template/dialog snapshot equality, visible model mappings, canonical-edit propagation, script-safe escaping, local navigation/assets, and the unchanged existing resume response.

An optional real-browser smoke check uses an existing Playwright installation and an isolated Chrome profile. Start FastAPI with `python -m uvicorn main:app --host 127.0.0.1 --port 8765`, then run `node tests/browser_content.cjs`. Set `PLAYWRIGHT_MODULE` to the installed module path if needed; `PORTFOLIO_URL` can override the local base URL. This test covers content interactions, not the deferred full visual redesign/Safari QA phase.

Do not change IDs or capability keys referenced by templates without updating their consumers and checks. Do not reintroduce project prose literals into HTML or JavaScript.

## Phase 1 verification result

Verified September 14, 2026:

- Seven Python content/API tests passed.
- Isolated Chrome smoke check passed: all four card/dialog pairs match the canonical data; model mappings are visible; current architecture and planned Act/Verify remain separate; project links, filters, Escape/focus return, evidence navigation, and the existing resume response work.
- No JavaScript page errors or failed local HTTP resources were observed. No horizontal overflow at 1440, 768, 390, or 320 CSS pixels. Mobile dialog interaction passed.
- Hero markup, all CSS, signature/navigation/animation modules, resume builder, and existing PDF/DOCX bytes are unchanged from the Phase 1 baseline.
- `git diff --check` passed.

GitHub destinations were verified against the origins of the inspected local implementations. These checks do not establish public repository access, AI-model execution, database operation, Safari compatibility, or production deployment. Full browser/design QA belongs to a later approved phase.
