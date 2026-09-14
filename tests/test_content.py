"""Content contract and propagation checks; no models or project databases loaded.

Run: python -m unittest discover -s tests -v
Requires the portfolio dependencies and httpx (FastAPI TestClient).
"""
import copy
from html.parser import HTMLParser
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.parse import urlparse

from fastapi.testclient import TestClient
import main

ROOT = Path(__file__).resolve().parents[1]


class PageContent(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.ids = []
        self.anchors = []
        self.scripts = []
        self.embedded_json = ""
        self.visible_text = []
        self.cards = {}
        self.active_card = None
        self.active_script = None
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a":
            self.anchors.append(attrs.get("href", ""))
        if tag == "script":
            self.active_script = attrs.get("id", "anonymous")
            self.scripts.append(attrs)
        if tag == "article" and "data-categories" in attrs:
            self.active_card = attrs["id"]
            self.cards[self.active_card] = []

    def handle_endtag(self, tag):
        if tag == "script":
            self.active_script = None
        if tag == "article":
            self.active_card = None

    def handle_data(self, data):
        if self.active_script == "project-data":
            self.embedded_json += data
        if self.active_script is None:
            self.visible_text.append(data)
            if self.active_card:
                self.cards[self.active_card].append(data)

    def card_text(self, project_id):
        return " ".join(" ".join(self.cards[project_id + "-project"]).split())


class ContentTests(unittest.TestCase):
    def setUp(self):
        self.projects = json.loads((ROOT / "data/projects.json").read_text())
        self.research = json.loads((ROOT / "data/research.json").read_text())
        self.by_id = {project["id"]: project for project in self.projects}
        self.client = TestClient(main.app)
        self.addCleanup(self.client.close)

    def test_project_contract_and_references(self):
        self.assertEqual(len(self.projects), len(self.by_id), "IDs must be unique")
        required = {
            "id", "name", "component", "kind", "description", "github_url", "link_kind",
            "status", "focus", "categories", "featured", "tech_stack", "tags", "question",
            "capabilities", "approach", "limitations", "models", "architecture", "card", "reviewed_at",
        }
        for project in self.projects:
            with self.subTest(project=project["id"]):
                self.assertEqual(set(project), required)
                self.assertRegex(project["id"], r"^[a-z][a-z0-9-]*$")
                self.assertIn(project["kind"], {"project", "learning_collection", "supporting_project"})
                self.assertTrue(project["description"].strip())
                self.assertTrue(set(project["tags"]).issubset(project["tech_stack"]))
                self.assertTrue(set(project["categories"]) <= {"backend", "data", "ml", "ai", "product"})
                url = urlparse(project["github_url"])
                self.assertEqual((url.scheme, url.netloc), ("https", "github.com"))
                parts = url.path.strip("/").split("/")
                self.assertEqual(len(parts), 1 if project["link_kind"] == "profile" else 2)
                caps = project["capabilities"]
                self.assertTrue(caps)
                self.assertEqual(len(caps), len({cap["id"] for cap in caps}))
                self.assertTrue(all(cap["text"].strip() for cap in caps))
                self.assertTrue(project["limitations"])
        self.assertEqual(self.by_id["foundations"]["kind"], "learning_collection")
        self.assertEqual(self.by_id["foundations"]["link_kind"], "profile")

    def test_research_resolves_projects_models_and_architecture(self):
        self.assertEqual(len(self.research), len({item["id"] for item in self.research}))
        for topic in self.research:
            with self.subTest(topic=topic["id"]):
                self.assertTrue(set(topic["project_ids"]) <= self.by_id.keys())
                self.assertTrue(topic["claim_scope"])
                for ref in topic.get("model_refs", []):
                    self.assertIn(ref["project_id"], topic["project_ids"])
                    model_ids = {model["id"] for model in self.by_id[ref["project_id"]]["models"]}
                    self.assertIn(ref["model_id"], model_ids)
                if "architecture_ref" in topic:
                    ref = topic["architecture_ref"]
                    self.assertIn(ref["field"], self.by_id[ref["project_id"]]["architecture"])
                    self.assertEqual(topic["status"], "Product direction")

    def test_models_and_future_architecture_cannot_be_misrepresented(self):
        campus = self.by_id["campus"]
        models = {model["id"]: model for model in campus["models"]}
        self.assertEqual(models["text"]["name"], "GPT-OSS 20B")
        self.assertEqual(models["vision"]["name"], "Qwen3-VL 8B")
        for project_id in ("campus", "research"):
            self.assertTrue(all(model["trained_by_author"] is False for model in self.by_id[project_id]["models"]))
        architecture = campus["architecture"]
        self.assertEqual(architecture["implemented"]["stages"], [
            "Input", "Validation", "Modality routing", "Model gateway", "Runtime", "Inference", "Response / cleanup",
        ])
        direction = {stage["name"]: stage for stage in architecture["product_direction"]["stages"]}
        self.assertEqual(list(direction), ["Perceive", "Understand", "Route", "Act", "Verify"])
        self.assertEqual(direction["Act"]["status"], "Planned")
        self.assertEqual(direction["Verify"]["status"], "Planned")
        self.assertIn("synthetic", self.by_id["pay"]["description"])
        self.assertEqual(self.by_id["pay"]["models"][0]["evaluation"], "No held-out evaluation")

    def test_api_jinja_and_dialog_payload_share_one_snapshot(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        page = PageContent(response.text)
        self.assertEqual(json.loads(page.embedded_json), self.client.get("/projects").json())
        self.assertEqual(self.client.get("/projects").json(), self.projects)
        self.assertEqual(self.client.get("/research").json(), self.research)
        self.assertEqual(len(page.cards), 4)
        for project in self.projects:
            self.assertIn(project["github_url"], page.anchors)
            if project["card"]:
                self.assertIn(project["name"], page.card_text(project["id"]))
                self.assertIn(project["description"], page.card_text(project["id"]))
        # Visible in the main card without opening a dialog or reading a script.
        campus = page.card_text("campus")
        self.assertIn("Text → GPT-OSS 20B", campus)
        self.assertIn("Vision / Multimodal → Qwen3-VL 8B", campus)

    def test_canonical_edit_propagates_to_copy_facts_links_and_payload(self):
        changed = copy.deepcopy(self.projects)
        changed[0]["name"] = "Canonical name for propagation test"
        changed[0]["description"] = "A changed canonical description reaches every consumer."
        changed[0]["github_url"] = "https://github.com/example/canonical-project"
        changed[1]["capabilities"][2]["text"] = "A changed reporting fact reaches the existing evidence panel."
        with tempfile.TemporaryDirectory() as temporary:
            fixture = Path(temporary)
            (fixture / "data").mkdir()
            (fixture / "data/projects.json").write_text(json.dumps(changed))
            (fixture / "data/research.json").write_text(json.dumps(self.research))
            with patch.object(main, "BASE_DIR", fixture):
                response = self.client.get("/")
                api_projects = self.client.get("/projects").json()
            self.assertEqual(response.status_code, 200)
            page = PageContent(response.text)
            self.assertIn(changed[0]["name"], page.card_text("campus"))
            self.assertIn(changed[0]["description"], page.card_text("campus"))
            self.assertIn(changed[0]["github_url"], page.anchors)
            self.assertIn(changed[1]["capabilities"][2]["text"], "".join(page.visible_text))
            self.assertEqual(json.loads(page.embedded_json), changed)
            self.assertEqual(api_projects, changed)

    def test_inline_json_and_html_escape_script_like_content(self):
        changed = copy.deepcopy(self.projects)
        changed[0]["description"] = '</script><script id="untrusted">alert("test")</script> & <b>text</b>'
        original_loader = main.load_json
        with patch.object(main, "load_json", side_effect=lambda name: changed if name == "projects.json" else original_loader(name)):
            response = self.client.get("/")
        page = PageContent(response.text)
        self.assertNotIn("untrusted", page.ids)
        self.assertEqual(len(page.scripts), 2)
        self.assertEqual(json.loads(page.embedded_json)[0]["description"], changed[0]["description"])
        self.assertIn(changed[0]["description"], page.card_text("campus"))

    def test_navigation_static_assets_and_existing_resume_still_resolve(self):
        page = PageContent(self.client.get("/").text)
        self.assertEqual(len(page.ids), len(set(page.ids)))
        for href in page.anchors:
            if href.startswith("#"):
                self.assertIn(href[1:], page.ids)
            elif href.startswith("/"):
                self.assertEqual(self.client.get(href).status_code, 200, href)
        for script in page.scripts:
            if "src" in script:
                self.assertEqual(self.client.get(script["src"]).status_code, 200)
        self.assertEqual(self.client.get("/static/css/portfolio.css").status_code, 200)
        response = self.client.get("/resume")
        self.assertEqual(response.headers["content-type"], "application/pdf")
        self.assertTrue(response.content.startswith(b"%PDF-"))
        self.assertEqual(response.content, (ROOT / "static/downloads/saiganesh-sattenapalli-resume.pdf").read_bytes())


if __name__ == "__main__":
    unittest.main()
