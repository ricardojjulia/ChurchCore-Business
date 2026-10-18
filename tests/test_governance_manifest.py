import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_manifest():
    manifest_path = ROOT / "docs" / "governance-sync" / "manifest.json"
    return json.loads(manifest_path.read_text(encoding="utf-8"))


class TestGovernanceManifest(unittest.TestCase):

    def test_manifest_has_unique_decision_and_requirement_ids(self):
        manifest = load_manifest()
        decisions = manifest["decisions"]

        decision_ids = [decision["id"] for decision in decisions]
        self.assertEqual(len(decision_ids), len(set(decision_ids)))

        requirement_ids = [
            requirement["req_id"]
            for decision in decisions
            for requirement in decision.get("requirements", [])
        ]
        self.assertEqual(len(requirement_ids), len(set(requirement_ids)))

    def test_council_005_dispatch_preserves_automated_testing_in_phase_one(self):
        manifest = load_manifest()
        council = next(
            decision
            for decision in manifest["decisions"]
            if decision["id"] == "COUNCIL-2026-005"
        )
        phased_gate = next(
            requirement
            for requirement in council["requirements"]
            if requirement["req_id"] == "REQ-005-02"
        )

        description = phased_gate["description"]
        self.assertIn("Automated unit, regression, authorization, security, and route tests", description)
        self.assertIn("Human Trials Commence After MVP Code Completion", phased_gate["title"])

    def test_council_005_academy_status_uses_real_commands_and_human_gate(self):
        council_path = ROOT / "docs" / "council" / "COUNCIL-2026-005.md"
        council_text = council_path.read_text(encoding="utf-8")
        academy_row = next(
            line for line in council_text.splitlines() if line.startswith("| **ChurchCore Academy**")
        )

        self.assertIn("100% functional MVP scope", academy_row)
        self.assertIn("Colegio Biblos participant-browser login and uncoached session", academy_row)
        self.assertIn("npm run verify", academy_row)
        self.assertIn("npm run test:full -- --reset-db", academy_row)
        self.assertIn("npm run verify:pilot-readiness", academy_row)
        self.assertNotIn("test:sis:e2e", academy_row)

    def test_council_006_respects_edge_canonical_guides_and_delivery_gates(self):
        manifest = load_manifest()
        council = next(
            decision
            for decision in manifest["decisions"]
            if decision["id"] == "COUNCIL-2026-006"
        )
        requirements = {
            requirement["req_id"]: requirement
            for requirement in council["requirements"]
        }

        self.assertIn("repository-owned canonical roadmap", requirements["REQ-006-01"]["description"])
        self.assertIn("limited to the central governance PR", requirements["REQ-006-04"]["verification"])
        self.assertIn("pr-review", requirements["REQ-006-04"]["verification"])

    def test_academy_compliance_flags_require_merged_evidence(self):
        fleet_path = ROOT / "dashboard" / "fleet-data.json"
        fleet = json.loads(fleet_path.read_text(encoding="utf-8"))
        academy = next(
            product
            for product in fleet["products"]
            if product["product_id"] == "churchcore-academy"
        )

        compliance = academy["governance_compliance"]
        self.assertFalse(compliance["brand_house_compliant"])
        self.assertFalse(compliance["sovereign_db_isolation_verified"])
        self.assertNotIn("COUNCIL-2026-006", compliance["council_decisions_acknowledged"])
        self.assertTrue(academy["online_status"]["readiness_assessment"]["blockers"])


if __name__ == "__main__":
    unittest.main()
