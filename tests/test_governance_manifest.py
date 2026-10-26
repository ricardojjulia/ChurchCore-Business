import json
import importlib.util
import unittest
from unittest import mock
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_manifest():
    manifest_path = ROOT / "docs" / "governance-sync" / "manifest.json"
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def load_script(name):
    script_path = ROOT / "scripts" / name
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), script_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


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

    def test_academy_acknowledgment_does_not_promote_unverified_compliance(self):
        fleet_path = ROOT / "dashboard" / "fleet-data.json"
        fleet = json.loads(fleet_path.read_text(encoding="utf-8"))
        academy = next(
            product
            for product in fleet["products"]
            if product["product_id"] == "churchcore-academy"
        )

        compliance = academy["governance_compliance"]
        # REQ-002-01 is now implemented and evidenced for Academy (2026-10-26): the badge renders on
        # https://www.churchcoreacademy.io and ChurchCore-Academy docs/council/ACKNOWLEDGMENTS.md records
        # src/components/branding/churchcore-trust-badge.tsx with component tests. The flag may be true only
        # alongside an evidence pointer, so acknowledgment alone still never promotes compliance.
        self.assertTrue(compliance["brand_house_compliant"])
        self.assertIn("ACKNOWLEDGMENTS.md", compliance.get("verification_note", ""))
        self.assertTrue(compliance["sovereign_db_isolation_verified"])
        self.assertIn("COUNCIL-2026-006", compliance["council_decisions_acknowledged"])
        self.assertEqual(
            academy["online_status"]["production_authorization"]["status"],
            "not_granted",
        )

    def test_activation_defaults_governance_claims_fail_closed(self):
        script = (ROOT / "scripts" / "activate-product-repos.py").read_text(encoding="utf-8")

        self.assertIn('"council_decisions_acknowledged": []', script)
        self.assertIn('"brand_house_compliant": False', script)
        self.assertIn('"sovereign_db_isolation_verified": False', script)
        self.assertIn('telemetry_payload["governance_compliance"] = existing_tdata["governance_compliance"]', script)

    def test_governance_sync_does_not_promote_blocked_or_unverified_claims(self):
        sync = load_script("sync-governance.py")

        self.assertEqual(sync.normalize_status("VERIFICATION BLOCKED"), "⚪ PENDING")
        self.assertEqual(sync.normalize_status("NOT VERIFIED"), "⚪ PENDING")
        self.assertEqual(sync.normalize_status("ACKNOWLEDGED & IN PROGRESS"), "🟡 IN PROGRESS")
        self.assertEqual(sync.normalize_status("IMPLEMENTED & VERIFIED"), "✅ IMPLEMENTED")

        academy_table = """| Council | Requirement | Status | Evidence |
| --- | --- | --- | --- |
| COUNCIL-2026-001 | REQ-001-01 RLS mandate | Verification blocked | Missing grants |
| COUNCIL-2026-006 | REQ-006-01 Testing Council | Implemented in this change | PR #251 |
"""
        parsed = sync.parse_acknowledgments(academy_table)
        self.assertEqual(sync.normalize_status(parsed["REQ-001-01"]), "⚪ PENDING")
        self.assertEqual(sync.normalize_status(parsed["REQ-006-01"]), "✅ IMPLEMENTED")

    def test_control_plane_prefers_published_main_over_local_feature_branch(self):
        sync = load_script("control-plane-sync.py")
        remote = {
            "product_id": "churchcore-academy",
            "repo_name": "ChurchCore-Academy",
            "version": "0.10.0",
            "report_timestamp": "2026-10-18T00:00:00+00:00",
            "online_status": {
                "is_online": False,
                "vercel_status": "none",
                "supabase_status": "local_only",
                "readiness_assessment": {"readiness_score_pct": 33},
            },
            "mvp_status": {"completion_pct": 100},
            "latest_changes": [],
            "next_steps": [],
            "ai_session_telemetry": {},
            "deployment_diagnostics": {},
            "governance_compliance": {
                "brand_house_compliant": False,
                "sovereign_db_isolation_verified": False,
            },
        }
        response = mock.MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(remote).encode("utf-8")
        source = {
            "product_id": "churchcore-academy",
            "repo": "ricardojjulia/ChurchCore-Academy",
            "local_paths": ["/a/local/feature/branch"],
        }

        gh_failure = mock.MagicMock(returncode=1, stdout="")
        with mock.patch.object(sync.subprocess, "run", return_value=gh_failure), mock.patch(
            "urllib.request.urlopen", return_value=response
        ):
            loaded = sync.load_telemetry(source)

        self.assertEqual(loaded["_source_type"], "remote")
        self.assertFalse(loaded["online_status"]["is_online"])

    def test_live_probe_never_sets_readiness_or_clears_blockers(self):
        """REQ-008-02: a reachable URL proves availability, not readiness (FaithFull challenge 2026-10-20)."""
        manifest = load_manifest()
        req = next(
            requirement
            for decision in manifest["decisions"]
            for requirement in decision.get("requirements", [])
            if requirement["req_id"] == "REQ-008-02"
        )
        self.assertNotIn("readiness_score_pct to 100", req["description"])
        self.assertIn("never sets readiness_score_pct", req["description"])
        council_text = (ROOT / "docs" / "council" / "COUNCIL-2026-008.md").read_text(encoding="utf-8")
        self.assertNotIn("is automatically set to `100`", council_text)

    def test_faithfull_rows_follow_the_canonical_plan(self):
        for name in ("COUNCIL-2026-005.md", "COUNCIL-2026-006.md"):
            text = (ROOT / "docs" / "council" / name).read_text(encoding="utf-8")
            row = next(line for line in text.splitlines() if line.startswith("| **FaithFull Scholars**"))
            self.assertNotIn("85%", row)
            self.assertNotIn("monograph", row.lower())
            self.assertIn("40%", row)

    def test_report_telemetry_live_probe_keeps_readiness_and_blockers(self):
        """A 200 from the live site must not raise readiness, clear blockers, or claim a DB connection."""
        import importlib.util
        import sys
        import tempfile

        spec = importlib.util.spec_from_file_location("report_telemetry", ROOT / "scripts" / "report-telemetry.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        with tempfile.TemporaryDirectory() as repo:
            control = Path(repo) / "docs" / "control-plane"
            control.mkdir(parents=True)
            before = {
                "online_status": {
                    "is_online": False,
                    "vercel_url": "https://example.invalid",
                    "supabase_status": "local_only",
                    "readiness_assessment": {"readiness_score_pct": 45, "blockers": ["six Phase 1 items open"], "next_required_actions": []},
                },
                "mvp_status": {"phase": "beta", "completion_pct": 40},
            }
            (control / "telemetry.json").write_text(json.dumps(before), encoding="utf-8")
            for argv in (["--auto"], ["--online", "true"], ["--vercel-url", "https://example.invalid"]):
                with mock.patch.object(module, "probe_url", return_value=True), mock.patch.object(
                    sys, "argv", ["report-telemetry.py", "--repo", repo, *argv]
                ), mock.patch("builtins.print"):
                    module.main()
                after = json.loads((control / "telemetry.json").read_text(encoding="utf-8"))
                readiness = after["online_status"]["readiness_assessment"]
                self.assertTrue(after["online_status"]["is_online"], argv)
                self.assertEqual(readiness["readiness_score_pct"], 45, argv)
                self.assertEqual(readiness["blockers"], ["six Phase 1 items open"], argv)
                self.assertEqual(after["online_status"]["supabase_status"], "local_only", argv)
                self.assertEqual(after["mvp_status"]["completion_pct"], 40, argv)
                self.assertEqual(after["mvp_status"]["phase"], "beta", argv)

    def test_daily_briefing_prefers_published_main_plan_over_local_checkout(self):
        """A local checkout's unmerged plan must not drive the daily report (FaithFull, 2026-10-20)."""
        import base64
        import importlib.util
        import tempfile

        spec = importlib.util.spec_from_file_location("daily_fleet_briefing", ROOT / "scripts" / "daily-fleet-briefing.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        published = "## Phase 1: Remaining\n### [ ] B2 Email outbox\n* **Scope:** Resend outbox\n## Phase 2: Trials\n"
        local = "## Phase 1: Remaining\n### [x] Feature 1: Monograph Index (unmerged)\n## Phase 2: Trials\n"
        with tempfile.TemporaryDirectory() as repo:
            (Path(repo) / "docs").mkdir()
            (Path(repo) / "docs" / "mvp-100-plan.md").write_text(local, encoding="utf-8")
            ok = mock.MagicMock(returncode=0, stdout=base64.b64encode(published.encode()).decode())
            with mock.patch.object(module.subprocess, "run", return_value=ok):
                features = module.parse_mvp_plan(repo, "ricardojjulia/FaithFullScholars")
            self.assertEqual([f["title"] for f in features], ["B2 Email outbox"])
            failed = mock.MagicMock(returncode=1, stdout="")
            with mock.patch.object(module.subprocess, "run", return_value=failed):
                offline = module.parse_mvp_plan(repo, "ricardojjulia/FaithFullScholars")
            self.assertEqual([f["title"] for f in offline], ["Feature 1: Monograph Index (unmerged)"])
        self.assertTrue(all(r.get("repo") for r in module.REPOS))


if __name__ == "__main__":
    unittest.main()
