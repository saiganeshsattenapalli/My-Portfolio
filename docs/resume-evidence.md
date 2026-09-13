# Resume evidence

This is an internal source record for the resume, separate from the candidate-facing document. Prepared September 12, 2026. Local source review supports implementation descriptions; it does not establish production deployment, user adoption, performance, or professional employment.

## Candidate information

- Name: Saiganesh Sattenapalli. The existing PDF header has a spelling typo; the portfolio, repository owner name, email and GitHub consistently support Sattenapalli.
- Hyderabad, India; +91 9346753626; saiganeshsattenapalli26@gmail.com. Source: existing resume in `~/Downloads/Saiganesh Sattenapalli Hyderabad, India | 9346753626 | saiganeshsattenapalli26@gmail.pdf`.
- B.Tech in Computer Science (AIML), Malla Reddy College of Engineering, Hyderabad, expected 2029. Source: existing resume. The older portfolio HTML supports 2025-2029. The user confirmed currently being in the second year during this task.
- GitHub: https://github.com/saiganeshsattenapalli . Portfolio repository: https://github.com/saiganeshsattenapalli/My-Portfolio . No deployed portfolio URL verified, so the resume labels this link **Portfolio source**.
- LinkedIn omitted because the existing PDF ends in `4b3a65372` while current and earlier portfolio files end in `23b183373`. Await candidate confirmation before adding it.
- The user confirmed no internship experience. No verified work history, awards, GPA or issued certifications found. None were fabricated or implied. Target roles come from the user's request.

## Selected project evidence

Paths below are relative to `~/my projects/Curiora/`.

### Curiora CampusOS

- Repository: https://github.com/saiganeshsattenapalli/Curiora-CampusOS
- `Curiora-Campus/app/routers/curio.py`: unified text/image request handler, image MIME and 15 MB size validation, temporary image storage and cleanup, thread pool dispatch, conversation identifiers.
- `Curiora-Campus/app/services/model_gateway.py`: GPT-OSS-20B and Qwen3-VL-8B model integration and runtime construction.
- `Curiora-Campus/app/core/runtime.py`: MLX on Apple Silicon, NVIDIA CUDA and CPU runtime selection.
- `Curiora-Campus/app/runtimes/mlx_runtime.py` and `torch_runtime.py`: concrete loading/unloading code for text and vision models.
- Repository commit dates observed August 8 through September 11, 2026; resume uses project year 2026, not an employment period.
- Scope: local AI application prototype. Campus authentication, reports and database workflows remain scaffolded and are not resume claims. No model training, latency or accuracy claims.

### Curiora Pay

- Repository: https://github.com/Curiora-intelligence/Curiora-Pay
- `Curiora-Pay/services/bank_engine.py`: deposits, withdrawals and transfers; SQL transaction retrieval; `download_statement` uses `pd.read_sql_query` and `to_csv`.
- The same file's `apply_for_loan` selects balance, computes transaction count in SQL, constructs a NumPy feature array, and calls the classifier.
- `Curiora-Pay/ai for loan.py` fits scikit-learn LogisticRegression on eight hard-coded synthetic examples. Resume explicitly describes a learning demonstration with a small synthetic dataset; no predictive accuracy, credit-risk validity or real-world lending claims.
- Repository commit dates observed December 29, 2025 through September 6, 2026; resume uses 2025-2026 as project activity, not employment.
- Scope: banking and data workflow prototype. Not represented as a production banking system or security-audited product.

### Curiora Research

- Repository: https://github.com/saiganeshsattenapalli/Curiora-Research
- `Curiora-Research/app/services/vision.py`: Qwen3-VL-8B integration via `mlx_vlm`; double-checked lazy model loading with `model_lock`; `inference_lock` serializes generation; prompt requires visually supported answers and explicit uncertainty.
- `Curiora-Research/app/routers/curio.py`: upload validation, thread pool dispatch and temporary file cleanup.
- Repository commit dates observed August 11 through August 21, 2026; resume uses 2026.
- Scope: local visual intelligence experiment. Does not imply an original foundation model, training pipeline, benchmark or production serving validation.

## Skills and exclusions

- Repository-supported skills selected for the resume: Python, SQL, PostgreSQL, pandas, NumPy, scikit-learn, logistic regression, feature preparation, FastAPI, MLX, PyTorch/Transformers integration, Git, Jinja2, JavaScript, HTML and CSS.
- Matplotlib, Seaborn, SQLite and Titanic analysis occur as earlier resume claims or learning evidence. The resume prioritizes code-supported recent projects.
- The earlier resume's Titanic 80% accuracy figure lacks the corresponding evaluated source and is omitted. Its self-paced learning entries are not presented as certifications.
- RAG, agents and broader intelligent reasoning are roadmap items, omitted from completed-work claims.
- No Tableau, Power BI, Excel, A/B testing, deployed model monitoring or large-scale dataset claims are inferred.

## Build and quality assurance

- `scripts/build_resume.py` creates a single-column DOCX with semantic heading styles, normal text, native bullets and clickable profile/project links. No tables, text boxes or image-only text.
- Use the Codex bundled Python runtime and the documents skill's `render_docx.py --emit_pdf` to produce the PDF and page PNGs. The renderer resolves the bundled LibreOffice wrapper at `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/override/soffice`; never use installed desktop LibreOffice.
- The final resume is exported to `static/downloads/saiganesh-sattenapalli-resume.docx` and `.pdf`. Render intermediates belong in `/private/tmp/portfolio-resume/`.
- Validate one-page output, readable typography, complete text extraction and PDF hyperlinks; visually inspect every rendered page after any content/layout change.
- Final QA passed September 12, 2026: the rendered PDF is one Letter-size page; its page PNG was visually inspected with no clipping, overlap, missing glyphs or stray second page. Body text is 11 pt Arial. Key candidate, education and project text extract correctly. Both PDF and DOCX contain seven hyperlinks (email, phone, GitHub profile, portfolio source and three project repositories); the DOCX contains no tables or text boxes.
