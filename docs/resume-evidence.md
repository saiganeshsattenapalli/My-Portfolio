# Resume evidence

Last reviewed September 14, 2026. This is the internal Phase 1 evidence and positioning record, separate from the candidate-facing resumes. Phase 1 consolidates facts and future generation requirements. It does not create the two proposed resumes or change the existing builder, PDF, DOCX, layout or visual website design.

## Source priority

For technical and project claims, resolve conflicts in this order:

1. Current source implementation and directly observed behavior.
2. Repository metadata, including verified remotes, manifests and commit history.
3. README files and other project documentation.
4. Older resumes and portfolio copy.

Code supports a description of the implemented mechanism. It does not, by itself, establish a successful deployment, an end-to-end test result, user adoption, predictive performance or professional employment. A declared dependency does not establish proficiency or completed integration. Commit dates establish observed repository activity, not employment dates or a project's founding date.

The user's direct confirmation controls personal facts such as current year of study and internship history. Source priority above applies to project evidence; it must not override that confirmation. Keep existing implementation and future direction separate. Roadmap descriptions, brand language and research interests are not completed engineering work.

## Candidate information

- Name: Saiganesh Sattenapalli. The older PDF header has a spelling typo; the portfolio, repository owner name, email and GitHub consistently support Sattenapalli.
- Hyderabad, India; +91 9346753626; saiganeshsattenapalli26@gmail.com. Source: the older resume in `~/Downloads/Saiganesh Sattenapalli Hyderabad, India | 9346753626 | saiganeshsattenapalli26@gmail.pdf`. The user directed use of the contact details in the Downloads resume.
- B.Tech in Computer Science (AIML), Malla Reddy College of Engineering, Hyderabad, expected graduation 2029. Source: the older resume; earlier portfolio HTML supports 2025-2029. The user confirmed currently being in the second year.
- The user confirmed no internship experience. Use project experience only; do not imply employment. No verified GPA, awards or issued certifications were found.
- GitHub profile: https://github.com/saiganeshsattenapalli . The verified portfolio repository is https://github.com/saiganeshsattenapalli/My-Portfolio . A deployed portfolio URL has not been verified in this evidence review; the existing resume correctly labels the repository link **Portfolio source**.
- LinkedIn remains unresolved: the older PDF ends in `4b3a65372`, while portfolio files end in `23b183373`. Preserve the omission unless the user confirms the intended URL or stronger evidence resolves it.

## Two resume positions

These are the two intended resume versions for a later authorized generation phase. They use the same candidate facts and project evidence. Neither title asserts previous employment, and both summaries must explicitly state second-year student status and internship interest. Do not create a third generic resume position.

### Primary position

Title: **Python Backend & Applied AI Engineer**.

Scope: Python backend and applied AI internship opportunities. Lead with FastAPI request handling, PostgreSQL/Psycopg data access, pretrained text and vision model integration, and model lifecycle management. Present Curiora as a collection of student projects and experiments.

Project order by canonical ID: `campus`, `pay`, `research`.

Emphasis: Campus/Curio's async endpoint and thread-pool dispatch; local runtime adapters and model switching; Pay's parameterized SQL transaction workflows and pandas CSV generation; Research's lazy model loading and serialized inference. Describe GPT-OSS-20B and Qwen3-VL-8B as integrated pretrained models.

### Secondary position

Title: **Data & Machine Learning Intern**.

Scope: data and machine learning internship opportunities. Lead with Python, SQL, pandas, NumPy, PostgreSQL/Psycopg, feature preparation and scikit-learn. Use the same projects, reordered to make the verified data work visible first.

Project order by canonical ID: `pay`, `campus`, `research`.

Emphasis: SQL transaction retrieval and aggregation; pandas CSV reporting; balance and transaction-count features; a small synthetic logistic-regression learning demonstration. Campus and Research provide supporting evidence for model inference integration and input handling, not a claim of foundation-model training or evaluated ML research.

## Canonical project data contract

`data/projects.json` is the canonical public project data source being consolidated in Phase 1. It remains an array, with stable IDs `campus`, `pay`, `research`, `foundations`, `design-system` and `website`. Project names, repository links, technologies, supported implementation claims, limitations and direction should be maintained there according to the source priority above. See `docs/content-schema.md` for the public schema.

The next resume-generation phase must consume `data/projects.json` by ID instead of duplicating project metadata in `scripts/build_resume.py`. Use `name`, `github_url`, `link_kind`, `status`, `tech_stack`, `capabilities` (objects with `id` and `text`), `limitations` and `models` for the relevant project facts. Select capabilities by their IDs when choosing role-specific bullets. The builder may own document formatting, the two role-specific titles, selection/order and concise wording, but those words must be derived from the canonical facts. If source code contradicts the public data, correct the canonical record before generating either resume. This document supplies provenance and claim boundaries; it is not a second public project catalog.

The `models` data distinguishes pretrained integrations from Pay’s explicitly qualified synthetic-data classifier demonstration. Campus architecture keeps implemented mechanisms and product direction separate; only implemented mechanisms substantiate completed-work bullets. `foundations` has kind `learning_collection` and a GitHub profile link, which must not be relabeled as a repository. `design-system` and `website` have kind `supporting_project`. Do not turn category, focus, status or marketing/card text into stronger implementation claims.

`data/research.json` contains topic references to the canonical project IDs. Research interests and future direction must not be promoted to completed resume skills solely because they appear there. The three selected resume projects are `campus`, `pay` and `research`; `foundations`, `design-system` and `website` are supporting portfolio context unless a later approved resume brief calls for them.

## Implementation evidence and claim boundaries

Source paths in this section are relative to `~/my projects/Curiora/`. Line references reflect the source reviewed and may move after later changes.

### Campus and Curio

Canonical ID: `campus`.

- `Curiora-Campus/app/routers/curio.py:35` defines an async FastAPI endpoint for text and image requests. Lines 72 and 154 dispatch synchronous model work with `await run_in_threadpool`. Safe wording is **async request handling with blocking inference dispatched to a thread pool**. Do not describe the model computation itself as asynchronous inference or imply concurrent GPU throughput.
- The same router validates supported image MIME types, empty input and a 15 MB upload limit, manages temporary image files and returns conversation identifiers.
- `Curiora-Campus/app/services/model_gateway.py` selects GPT-OSS-20B for text and Qwen3-VL-8B for vision. Its concrete model identifiers include MLX community variants and the upstream PyTorch model IDs. This is pretrained model integration, not original model development or training.
- `Curiora-Campus/app/core/runtime.py` implements selection for Apple Silicon MLX, NVIDIA CUDA and PyTorch CPU. `app/runtimes/mlx_runtime.py` and `torch_runtime.py` contain loading, generation and release paths; the latter imports Hugging Face Transformers model/tokenizer classes.
- Model unloading before a mode/model switch and locks around inference are implemented mechanisms. They support lifecycle-management wording without a quantified memory-saving, latency or performance claim. Runtime branches existing in source do not establish that every hardware configuration was tested.
- Conversation identifiers refer to application-managed, in-memory conversation state; do not imply durable conversation storage.
- Current scope is a local AI application prototype within a campus project. Campus authentication, issue-report and database workflows are scaffolded. Do not reuse the older resume's campus complaint database claims as completed work without implementation evidence.
- Agent orchestration, autonomous action/verification loops, RAG and the broader campus ecosystem are future direction unless separately supported by current code.
- Earlier repository review observed commits from August 8 through September 11, 2026. A resume may use project year 2026; these are not employment dates.

### Curiora Pay

Canonical ID: `pay`.

- `Curiora-Pay/services/bank_engine.py:1` imports Psycopg as `sql`; transaction methods use `sql.connect`, cursors and parameterized queries. Deposits, withdrawals, transfers and transaction-history retrieval have service implementations. Safe wording is **PostgreSQL data access using Psycopg and parameterized SQL in a banking prototype**.
- Current banking service methods and routes in `routers/authentication.py` and `routers/dashboard.py` are synchronous `def` functions using synchronous connections. Do not call Pay an end-to-end async database backend.
- `Curiora-Pay/database.py` contains a separate `setup_database_async` helper using `sql.AsyncConnection.connect` and awaited SQL execution. Its runner is commented out, and `main.py` does not wire it into application startup. The reviewed users-table DDL also has a trailing comma before its closing parenthesis. Treat this as an unverified setup attempt, not evidence that async schema initialization or an async request path works. Psycopg's support for async does not make the current transaction paths async.
- `bank_engine.py:199-213` selects account balance, computes transaction count with SQL, constructs a NumPy feature array and calls the classifier. This supports feature preparation and model-integration wording.
- `Curiora-Pay/ai for loan.py:7-20` builds a pandas DataFrame with eight hard-coded synthetic examples and fits scikit-learn `LogisticRegression` on balance and transaction count. Retain the small synthetic learning-dataset qualifier. No held-out evaluation, meaningful predictive accuracy, calibrated credit-risk scoring or real-world lending suitability is established.
- `bank_engine.py:221-229` implements SQL-to-pandas statement generation and writes a local CSV. The statement route in `routers/dashboard.py` returns HTML status text; it does not return the CSV as a downloadable file response. Describe **CSV generation/export**, not a completed self-service statement-download feature.
- `bank_engine.py` includes Argon2 password hashing and Fernet encryption for transaction notes. These specific mechanisms can be named if relevant, without describing the application as security-audited, production-safe or compliant banking software.
- Current scope is a banking and data workflow prototype. A transaction service implementation is not proof of comprehensive authorization, concurrency safety, robust error handling or end-to-end reliability. Do not imply real customers or money handled.
- Earlier repository review observed commits from December 29, 2025 through September 6, 2026. A resume may use 2025-2026 as project activity, not employment.

### Curiora Research

Canonical ID: `research`.

- `Curiora-Research/app/services/vision.py` integrates pretrained Qwen3-VL-8B through `mlx_vlm`. It implements double-checked lazy loading with `model_lock` and uses `inference_lock` to serialize generation.
- The system prompt requires answers supported by the supplied image and explicit uncertainty. Safe wording describes the prompt design; it must not claim measured hallucination prevention or validated reasoning quality.
- `Curiora-Research/app/routers/curio.py` provides upload validation, thread-pool dispatch and temporary-file cleanup.
- Current scope is a local visual intelligence experiment. Camera preview is not evidence of continuous video analysis. Do not claim an original foundation model, novel architecture, training pipeline, fine-tuning, published research, benchmark or production serving validation.
- Earlier repository review observed commits from August 11 through August 21, 2026. A resume may use project year 2026.

## Skills supported by this evidence

- Backend: Python, FastAPI, async request handling and thread-pool dispatch in Campus/Curio, PostgreSQL, Psycopg, parameterized SQL, Jinja2 and Git. Keep Pay's synchronous data-access limitation explicit in the internal record.
- Applied AI: pretrained text/vision model integration, local inference, MLX, PyTorch and Hugging Face Transformers integration, model loading/unloading and serialized inference. Package use is not evidence of training expertise.
- Data and ML: SQL querying and transaction-count aggregation, pandas DataFrames/CSV export, NumPy feature arrays, scikit-learn and a synthetic logistic-regression demonstration. Feature preparation here means selecting balance and transaction count, not a broad feature-engineering or model-evaluation pipeline.
- Supporting frontend work: JavaScript, HTML and CSS are demonstrated in the project interfaces. They can remain secondary skills for these two resume positions.

Matplotlib, Seaborn, SQLite and Titanic analysis occur in older resume claims or learning material. Do not elevate them above more recent implementation evidence. The older Titanic 80% accuracy figure lacks the corresponding evaluated source and remains excluded. Self-paced learning entries are not issued certifications.

No Tableau, Power BI, Excel, substantial EDA study, A/B testing, deployed model monitoring, large-scale dataset work, RAG system or autonomous agent implementation is established by the evidence above. Treat relevant research topics as interests or direction, not completed resume claims. Do not invent metrics to make a bullet appear outcome-driven; describe the concrete behavior the code enables.

## Existing artifacts and historical quality assurance

The current `scripts/build_resume.py` and `static/downloads/saiganesh-sattenapalli-resume.docx` / `.pdf` still represent the earlier broad **Data Analysis and AI Engineering** resume. Their presence does not mean either of the two positions above has been generated. The old generic file is a historical artifact, not a third intended resume version. Phase 1 does not update or rebuild it.

Historical QA on September 12, 2026 found the old resume to be one Letter-size page with 11 pt Arial body text, semantic heading styles, native bullets, no tables or text boxes, and seven hyperlinks: phone, email, GitHub profile, portfolio source and three project repositories. Text extraction and all-page visual inspection passed. A read-only audit on September 13 reconfirmed that old output's layout and links. These checks do not validate future Backend/AI or Data/ML outputs.

## Requirements for the later generation phase

- Create only the primary Backend/AI and secondary Data/ML versions after that phase is authorized. Consume canonical project data as described above; do not silently keep the builder's current duplicated metadata.
- Preserve an ATS-readable single-column structure, one page per version, readable body text, semantic headings and native bullets. Keep verified GitHub/project links clickable and label a source repository accurately until a live portfolio URL is verified. Resolve LinkedIn separately without guessing.
- Use the Codex bundled Python runtime and the documents skill's `render_docx.py --emit_pdf`. The bundled LibreOffice wrapper is `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice`; never use installed desktop LibreOffice. Keep QA intermediates outside public downloads, for example under `/private/tmp/portfolio-resume/`.
- Render and visually inspect every page of each new DOCX/PDF. Verify page count, complete text extraction, distinct intended titles, correct contact details and hyperlinks, no clipping/overlap/missing glyphs, and no unsupported claims. Record new QA separately from the historical checks above.
