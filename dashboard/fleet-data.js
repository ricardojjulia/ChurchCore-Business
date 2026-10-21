window.CHURCHCORE_FLEET_DATA = {
  "generated_at": "2026-10-21T01:57:55.682152+00:00",
  "summary": {
    "total_products": 6,
    "online_in_production": 6,
    "average_readiness_score": 88,
    "average_completion_pct": 87,
    "sovereign_data_isolation": true,
    "total_tasks": 24,
    "done_tasks": 15
  },
  "products": [
    {
      "product_id": "churchcore-chms",
      "repo_name": "ChurchCore ChMS",
      "version": "3.5.0",
      "report_timestamp": "2026-10-17T23:12:22.708251+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://www.churchcore.io",
        "custom_domain": "https://www.churchcore.io",
        "supabase_status": "connected",
        "supabase_project_ref": "xsmcurhmgmnxxppkorpq",
        "readiness_assessment": {
          "readiness_score_pct": 95,
          "blockers": [
            "Testing Council v6 full run not yet done (last item of R1's definition of done)",
            "O7: Stripe test-mode run never exercised against real Stripe (incl. charge.refund.updated / refund.updated on the Connect endpoint)",
            "O15: real pilot export files not yet tested",
            "O23: security@churchcore.io cannot receive mail (no MX record for churchcore.io)"
          ],
          "next_required_actions": [
            "Testing Council v6 full run",
            "R2 release (target 2026-11-06)"
          ]
        }
      },
      "mvp_status": {
        "phase": "pilot_ready",
        "completion_pct": 95,
        "release_target": "2026-11-06",
        "must_rows_merged": "38 of 40",
        "latest_milestones": [
          "All five MVP gaps closed",
          "Council Review 52 whole-app re-baseline: 2 Critical + 5 High found and fixed (R1a #201, R1b #202, R1c #203, R1d #205)",
          "R1d data-erasure approval flow merged #205 (exact, household-scoped erasure with audit redaction)",
          "CP1 Powered by ChurchCore badge merged #206; CP1b hotfix #207 rewrote /security to true claims, added security headers and security.txt"
        ]
      },
      "latest_changes": [
        "chore: refresh control-plane files and give the control plane an accurate view (89b7723)",
        "Merge remote-tracking branch 'origin/main' into cp-refresh (8440c01)",
        "feat: R1d data-erasure approval flow \u2014 exact, household-scoped erasure with audit redaction (Council Reviews 55\u201357) (#205) (840643d)",
        "chore: add ChurchCore-Business control-plane rule, telemetry script and council ledger (72f4653)",
        "fix: R1c UX and small fixes \u2014 printing, error pages, scanner-safe unsubscribe, honest push (Council Reviews 52, 55) (#203) (a243af1)"
      ],
      "next_steps": [
        "Testing Council v6 full run",
        "R2 release",
        "Owner actions O7, O15, O23 (mail), O24 (business repo visibility), O25 (Spanish review), O26 (GHAS)",
        "Should rows: S89 WCAG AAA, S90 AppSwitcher (target 2026-11-15), S91 enforce CSP after a real Stripe payment"
      ],
      "ai_session_telemetry": {
        "last_model": "claude-opus-5-5",
        "session_duration_minutes": 600,
        "session_date": "2026-10-17T23:12:22.708251+00:00",
        "session_operator": "Ricardo J. Julia (with Claude Code)",
        "summary_of_work": "R1a-R1d, CP1 and CP1b merged (#201-#203, #205-#207); demo mode turned off in production; /security rewritten to true claims with security headers and security.txt; next: Testing Council v6 full run, then R2."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-17] Production ran with NEXT_PUBLIC_DEMO_MODE=true (demo-only payment route passed its gate; provider stubs could fake success).",
          "[2026-10-17] PR #206 merged before Council Review 58 finished; the live /security page made ~9 false security claims."
        ],
        "mitigations_applied": [
          "[2026-10-17] NEXT_PUBLIC_DEMO_MODE=false (Config) for Production and redeployed; demo route verified 403.",
          "[2026-10-17] CP1b (#207): /security rewritten so every claim is true of the code (evidence in docs/factory-runs/2026-10-17-cp1b-truthful-security.md); live check: no banned phrases, security headers present, security.txt served.",
          "[2026-10-17] Migrations 20261016000000, 20261017000000, 20261018000000 applied to hosted before their merges with read-only post-apply checks."
        ]
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004"
        ],
        "brand_house_compliant": true,
        "sovereign_db_isolation_verified": true,
        "brand_house_note": "Powered by ChurchCore badge live (REQ-002-01, #206/#207). WCAG AAA (REQ-002-02) not met: Should row S89.",
        "documented_council_reviews": {
          "reviews": 58,
          "files": 193
        }
      },
      "_source_path": "https://raw.githubusercontent.com/ricardojjulia/ChurchCore/main/docs/control-plane/telemetry.json",
      "_source_type": "remote"
    },
    {
      "product_id": "churchcore-lms",
      "repo_name": "ChurchCore LMS",
      "version": "0.47.0",
      "report_timestamp": "2026-10-18T14:27:22.121354+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://www.churchcorelms.io",
        "custom_domain": "https://www.churchcorelms.io",
        "vercel_alias": "https://church-core-lms.vercel.app",
        "supabase_status": "connected",
        "supabase_project_ref": "prod-lms-db",
        "readiness_assessment": {
          "readiness_score_pct": 95,
          "blockers": [],
          "next_required_actions": [
            "Verify Turbopack build on Vercel preview branch",
            "Conduct student credentialing certificate PDF generation test"
          ]
        }
      },
      "mvp_status": {
        "phase": "beta",
        "completion_pct": 100,
        "latest_milestones": [
          "PR #89 merged: Turbopack use-server SSR build error resolved & auth layout polished",
          "PR #88 merged: Neutral pre-auth and dynamic branding with Powered by ChurchCore badge live",
          "Supabase pg_net extension enabled and release build 0.36.1 deployed"
        ]
      },
      "latest_changes": [
        "Merge pull request #101 from ricardojjulia/feat/universal-app-switcher-and-mvp-100 (b0d3645)",
        "feat(navigation): integrate Universal AppSwitcher (OPS-02) and advance Phase 1 to 100% complete (5d427b3)",
        "Merge pull request #100 from ricardojjulia/gov/council-006-testing-council (22d92cf)",
        "feat(governance): standardize Testing Council protocol and 3-phase gating (COUNCIL-2026-006) (c43909e)",
        "Merge pull request #99 from ricardojjulia/chore/session-close-telemetry (c8dc009)"
      ],
      "next_steps": [
        "Test course completion webhook integration with local certification service",
        "Run full synthetic production test suite (npm run test:prod-synthetic)"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 30,
        "session_date": "2026-10-18T14:27:22.121354+00:00",
        "session_operator": "Ricardo Julia",
        "summary_of_work": "Phase 1 MVP 100% complete, Universal AppSwitcher merged to main, Release deployed"
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-16] Turbopack use-server sync export error during Vercel edge compilation.",
          "[2026-10-15] Sidebar layout flickering on pre-auth /login route."
        ],
        "mitigations_applied": [
          "[2026-10-16] Converted server action exports to explicit async functions in compliance with Turbopack specifications (PR #89).",
          "[2026-10-16] Unmounted sidebar layout specifically for pre-auth route boundaries."
        ]
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004",
          "COUNCIL-2026-005",
          "COUNCIL-2026-006"
        ],
        "brand_house_compliant": true,
        "sovereign_db_isolation_verified": true
      },
      "_source_path": "https://raw.githubusercontent.com/ricardojjulia/ChurchCore-LMS/main/docs/control-plane/telemetry.json",
      "_source_type": "remote"
    },
    {
      "product_id": "churchcore-academy",
      "repo_name": "ChurchCore-Academy",
      "version": "0.10.0",
      "report_timestamp": "2026-10-19T20:08:22+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://www.churchcoreacademy.io",
        "supabase_status": "local_only",
        "supabase_project_ref": "",
        "readiness_assessment": {
          "readiness_score_pct": 100,
          "score_label": "Phase 1 engineering readiness",
          "score_basis": "The repository-defined functional MVP and its inseparable automated verification are complete. This score is the Phase 1 entry gate for human testing; it is not pilot completion or production authorization.",
          "blockers": [],
          "next_required_actions": [
            "Verify participant login from the approved local/private browser or VM.",
            "Run the chartered uncoached session and record sanitized evidence.",
            "Use observed pilot needs to select or exclude later integration-validation lanes."
          ]
        },
        "phase_2_human_validation": {
          "status": "entry_gate_pending",
          "entry_gate": "Verify participant login from the actual Colegio Biblos browser or VM.",
          "planned_activity": "Run the chartered uncoached Colegio Biblos session and record sanitized evidence.",
          "completion_claimed": false
        },
        "production_authorization": {
          "status": "not_granted",
          "deployment_observed": true,
          "note": "Authenticated Vercel evidence proves a Ready production-target deployment exists; it does not prove an owner-approved Phase 3 production release."
        }
      },
      "mvp_status": {
        "phase": "pilot_ready",
        "completion_pct": 100,
        "completion_basis": "The repository-defined functional MVP is built; this percentage does not represent production readiness or pilot completion.",
        "latest_milestones": [
          "PR #248 recorded Colegio Biblos local/private pilot preparation.",
          "PR #247 approved the Colegio Biblos local pilot charter.",
          "PR #246 completed the technical baseline closeout."
        ]
      },
      "latest_changes": [
        "Record Colegio Biblos local pilot preparation (#248) (bed47c2)",
        "Approve Colegio Biblos local pilot charter (#247) (f44c6b7)",
        "Record technical baseline closeout (#246) (4bfe20b)",
        "Merge pull request #245 from ricardojjulia/docs/pilot-to-production-completion-plan (dca2d25)",
        "Record completion plan council review (3e96d37)"
      ],
      "next_steps": [
        "Verify the actual Colegio Biblos participant login on the approved local/private topology.",
        "Complete the uncoached pilot session before adding feature work.",
        "Record sanitized findings and re-observe any S0-S2 blockers before accepting Workstream C residual risk."
      ],
      "ai_session_telemetry": {
        "last_model": "OpenAI Codex",
        "session_duration_minutes": 25,
        "session_date": "2026-10-17T16:05:27.430761+00:00",
        "session_operator": "Ricardo J. Julia",
        "summary_of_work": "Reconciled Academy control-plane governance and evidence-backed telemetry."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-17] The admissions, enrollment-conversion, and LLIS-consent RLS verification commands could not complete because the local anon/authenticated roles lack required table privileges."
        ],
        "mitigations_applied": [
          "[2026-10-19] Authenticated Vercel CLI inspection verified project churchcore/church-core-academy and Ready deployment dpl_CGgewdcXBDt1Z6RHcdg8eqM5eJiv with the canonical domain aliases."
        ]
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004",
          "COUNCIL-2026-005",
          "COUNCIL-2026-006"
        ],
        "brand_house_compliant": false,
        "sovereign_db_isolation_verified": false,
        "verification_note": "Acknowledgment is not implementation. Requirement-level status and evidence are recorded in docs/council/ACKNOWLEDGMENTS.md."
      },
      "_source_path": "https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Academy/main/docs/control-plane/telemetry.json",
      "_source_type": "remote"
    },
    {
      "product_id": "churchcore-care",
      "repo_name": "ChurchCoreCare",
      "version": "7.0.0",
      "report_timestamp": "2026-10-17T21:47:00.111112+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://www.churchcorecare.io",
        "custom_domain": "https://www.churchcorecare.io",
        "vercel_alias": "https://churchcore-care.vercel.app",
        "supabase_status": "connected",
        "supabase_project_ref": "prod-care-db",
        "readiness_assessment": {
          "readiness_score_pct": 95,
          "blockers": [],
          "next_required_actions": [
            "Verify HIPAA counseling intake workflow in production (churchcore-care.vercel.app)",
            "Run automated smoke test suite: npm run test:smoke"
          ]
        }
      },
      "mvp_status": {
        "phase": "production",
        "completion_pct": 90,
        "latest_milestones": [
          "Vercel production deployment verified live at churchcore-care.vercel.app and www.churchcorecare.io",
          "PR #139 merged: Mobile Vite lockfile resolution and dependency alignment",
          "Counseling intake, pastoral notes, and secure consent flows verified in production"
        ]
      },
      "latest_changes": [
        "Merge pull request #139 from ricardojjulia/fix/mobile-vite-lockfile (188f9df)",
        "fix: synchronize Vercel dependency resolution (1fbe989)",
        "Merge pull request #138 from ricardojjulia/dependabot/npm_and_yarn/fast-uri-3.1.8 (710fc4b)",
        "Merge branch 'main' into dependabot/npm_and_yarn/fast-uri-3.1.8 (9233546)",
        "Merge pull request #128 from ricardojjulia/dependabot/npm_and_yarn/vite-8.0.16 (65cdd03)"
      ],
      "next_steps": [
        "Complete translation worker container optimization",
        "Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 60,
        "session_date": "2026-10-17T21:47:00.111112+00:00",
        "session_operator": "Ricardo J. Julia",
        "summary_of_work": "Addressed mobile Vite lockfile desynchronization and validated counseling note encryption boundaries."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-14] Vite lockfile conflict between root React app and mobile companion bundle."
        ],
        "mitigations_applied": [
          "[2026-10-14] Unified package-lock.json with explicit override resolutions in PR #139."
        ]
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004"
        ],
        "brand_house_compliant": true,
        "sovereign_db_isolation_verified": true
      },
      "_source_path": "https://raw.githubusercontent.com/ricardojjulia/ChurchCoreCare/main/docs/control-plane/telemetry.json",
      "_source_type": "remote"
    },
    {
      "product_id": "churchcore-orthos",
      "repo_name": "ChurchCore Orthos",
      "version": "0.18.3",
      "report_timestamp": "2026-10-18T18:01:10.365584+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://church-core-orthos.vercel.app",
        "supabase_status": "connected",
        "supabase_project_ref": "prod-orthos-db",
        "readiness_assessment": {
          "readiness_score_pct": 100,
          "blockers": [],
          "next_required_actions": [
            "Run npm run test:omni-council across full compliance checklist",
            "Bind production Vercel environment variables to Supabase cloud instance",
            "Verify fund-accounting double-entry balance constraints"
          ]
        },
        "custom_domain": "https://church-core-orthos.vercel.app"
      },
      "mvp_status": {
        "phase": "production",
        "completion_pct": 100,
        "latest_milestones": [
          "PR #25 merged: Departmental Ministry Governance & Maturity Engine (v0.18.0)",
          "PR #24 merged: Compensating controls module for small churches",
          "Audit trail immutability and financial safeguarding rules verified"
        ]
      },
      "latest_changes": [
        "fatal: your current branch 'main' does not have any commits yet"
      ],
      "next_steps": [
        "Deploy staging preview build to Vercel",
        "Execute test:security and audit:rls verification"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 30,
        "session_date": "2026-10-18T18:01:10.365584+00:00",
        "session_operator": "Ricardo J Julia",
        "summary_of_work": "Automated post-test edge telemetry synchronization for churchcore-orthos."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-15] X-Frame-Options and CSP headers caused preview iframe blocking in audit reports."
        ],
        "mitigations_applied": [
          "[2026-10-15] Configured explicit CSP allowlists in vercel.json for audit PDF preview rendering."
        ]
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004",
          "COUNCIL-2026-005",
          "COUNCIL-2026-006",
          "COUNCIL-2026-007",
          "COUNCIL-2026-008"
        ],
        "brand_house_compliant": true,
        "sovereign_db_isolation_verified": true
      },
      "_source_path": "https://raw.githubusercontent.com/ricardojjulia/ChurchCore-Orthos/main/docs/control-plane/telemetry.json",
      "_source_type": "remote"
    },
    {
      "product_id": "faithfull-scholars",
      "repo_name": "FaithFullScholars",
      "version": "0.1.0",
      "report_timestamp": "2026-10-18T04:11:03.586850+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://faith-full-scholars.vercel.app",
        "supabase_status": "connected",
        "readiness_assessment": {
          "readiness_score_pct": 45,
          "blockers": [
            "Phase 1 MVP items open: A4b error monitoring (Sentry; deferred by the owner), WCAG AAA contrast for signed-in areas, B2 email outbox, B3 and B4 invitations, B5 deletion and export (docs/FAITHFULL_SCHOLARS_FULL_PLAN.md \u00a724)",
            "Support address abuse@faithgrid.io is live on /contact (2026-10-20), accepted as is: mail bounces until faithgrid.io has MX records, and the legal texts route rights requests there",
            "Custom domain (B1) deferred by the owner; outbound email stays off until then",
            "Legal texts are drafts pending legal review (version 3 names the operator and describes consent); counsel review needed before real users"
          ],
          "next_required_actions": [
            "Extend the axe AAA contrast scan to signed-in dashboards (public pages done, ADR 0038)",
            "Owner: add MX records for faithgrid.io, then set NEXT_PUBLIC_SUPPORT_EMAIL=abuse@faithgrid.io in Vercel and redeploy"
          ],
          "readiness_basis": "Council Review 20 baseline score (about 45/100, 2026-10-14), before A1, A2 and A3a shipped; not re-scored since. That review projected about 65 after Phase A."
        }
      },
      "mvp_status": {
        "phase": "beta",
        "completion_pct": 40,
        "latest_milestones": [
          "AI matcher on OpenRouter with zero data retention; privacy v4 live (PR #104, ADR 0041)",
          "Gemini key moved to a header in the CV extractor and syllabus tagger (PR #100)",
          "A4a production gates live: fail-closed Turnstile, build env gate, honest error page (PR #98, ADR 0040)",
          "A3b consent to publish declared beliefs live; legal texts v3 (PR #96, ADR 0039)",
          "Legal texts v2 name the operator (PR #95)"
        ]
      },
      "latest_changes": [
        "feat(ai): OpenRouter as the only AI gateway, zero data retention; privacy v4 (ADR 0041) (#104) (9e9725f)",
        "fix(security): Gemini key in a header for the CV extractor and syllabus tagger (#100) (36f83c0)",
        "feat(mvp): A4a production gates: fail-closed Turnstile, build env gate (ADR 0040) (#98) (3ac7a71)",
        "feat(brand): badge follow-up: translated title, new-tab note, shared URL, test (#90) (3b3adc7)",
        "feat(branding): install Powered by ChurchCore badge (#91) (288b2be)"
      ],
      "next_steps": [
        "Owner: confirm in an institution faculty search that the matcher label reads 'Google Gemini via OpenRouter' (it reads 'built-in matcher' if OPENROUTER_API_KEY is missing or no zero-retention endpoint answers)",
        "Owner: add MX records for faithgrid.io (for example ImprovMX forwarding) so mail to abuse@faithgrid.io is delivered",
        "Owner decision: PR #101 (COUNCIL-2026-007 monograph index and community migration) fails three data-isolation gates and sets telemetry to 92%/readiness 100; it conflicts with the 2026-10-20 challenge (ChurchCore-Business #9)",
        "WCAG AAA contrast: extend the axe scan to signed-in dashboards (public pages done, ADR 0038)",
        "Phase 2 (after Phase 1): founding-scholar and one-institution pilot; suites: npm run audit:rls, npm run verify:deploy, E2E",
        "A4b Sentry deferred by the owner (2026-10-20); PITR declined (docs/deployment/backups.md)"
      ],
      "ai_session_telemetry": {
        "last_model": "claude-opus-5-5",
        "session_duration_minutes": 0,
        "session_date": "2026-10-18T04:11:03.586850+00:00",
        "session_operator": "Ricardo J. Julia",
        "summary_of_work": "A3a shipped (legal pages, acceptance records, contact, reset); badge follow-up; COUNCIL-2026-005 sync: MVP plan, honest ledger and telemetry, enforcement script no longer passes unchecked requirements."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-17] A3a migration preflight failed on a fresh database (PL/pgSQL planned IF ... AND EXISTS before the table existed); caught in CI.",
          "[2026-10-17] Supabase Site URL pointed at a deployment behind Vercel's login wall (sign-up confirmation emails use it).",
          "[2026-10-16] Cloudflare Turnstile CAPTCHA was blocked by strict CSP header on sign-up page.",
          "[2026-10-16] Untranslated Spanish sign-up error toasts in production."
        ],
        "mitigations_applied": [
          "[2026-10-17] Nested the preflight IF (PR #88, before any release).",
          "[2026-10-17] Owner set Site URL to https://faith-full-scholars.vercel.app and added /auth/callback to the redirect URLs.",
          "[2026-10-16] Added challenges.cloudflare.com to vercel.json connect-src and script-src directives (PR #85).",
          "[2026-10-16] Localized all auth error dictionary keys in Spanish i18n bundle (PR #86)."
        ]
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004",
          "COUNCIL-2026-005",
          "COUNCIL-2026-006"
        ],
        "brand_house_compliant": false,
        "sovereign_db_isolation_verified": true
      },
      "_source_path": "https://raw.githubusercontent.com/ricardojjulia/FaithFullScholars/main/docs/control-plane/telemetry.json",
      "_source_type": "remote"
    }
  ],
  "tasks": [
    {
      "task_id": "TSK-CHMS-001",
      "product_id": "churchcore-chms",
      "title": "R1d Member Data-Rights Erasure Approval Queue & Lifecycle",
      "status": "in_progress",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "commit a22c36e & b38636f (branch fix/r1d-erasure-approvals)",
      "target_milestone": "v3.5.1",
      "description": "Complete admin approval screens, audit logging, and ensure erasure notices dispatch strictly post-commit.",
      "verification": "npm run test:e2e:readiness && audit:rls",
      "updated_at": "2026-10-17T15:30:00Z"
    },
    {
      "task_id": "TSK-CHMS-002",
      "product_id": "churchcore-chms",
      "title": "Vercel Cron Automation (shepherd-ai & scheduled communications)",
      "status": "planned",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "deployment",
      "assignee": "Ricardo J. Julia",
      "git_reference": "vercel.json crons config",
      "target_milestone": "v3.6.0",
      "description": "Verify background cron worker execution on Vercel production edge with Supabase pg_cron fallback.",
      "verification": "HTTP 200 response on /api/cron/communications-scheduled with valid CRON_SECRET",
      "updated_at": "2026-10-17T12:00:00Z"
    },
    {
      "task_id": "TSK-CHMS-003",
      "product_id": "churchcore-chms",
      "title": "Powered by ChurchCore Trust Badge Integration",
      "status": "waiting",
      "directionality": "CONTROL_PLANE",
      "priority": "P1_HIGH",
      "category": "governance",
      "assignee": "Antigravity Agent",
      "git_reference": "COUNCIL-2026-002 (REQ-002-01)",
      "target_milestone": "Sprint Q4-M1",
      "description": "Install official Endorsed Brand trust mark in global portal footer linking to security documentation.",
      "verification": "components/layout/footer.tsx contains trust mark asset and passes WCAG AAA contrast",
      "updated_at": "2026-10-17T11:00:00Z"
    },
    {
      "task_id": "TSK-LMS-001",
      "product_id": "churchcore-lms",
      "title": "Turbopack use-server SSR Compilation Bug Resolution",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "architecture",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #89 (commit 83933a2)",
      "target_milestone": "v0.47.0",
      "description": "Resolved Turbopack build failure on Vercel by converting server action sync exports to explicit async functions.",
      "verification": "npm run build passes with 0 Turbopack SSR warnings",
      "updated_at": "2026-10-16T22:00:00Z"
    },
    {
      "task_id": "TSK-LMS-002",
      "product_id": "churchcore-lms",
      "title": "Neutral Pre-Auth Gateway & Dynamic Institutional Branding",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #88 (commit fe412f0)",
      "target_milestone": "v0.47.0",
      "description": "Implemented unmounted pre-auth sidebar and dynamic tenant logo loader with Powered by ChurchCore badge.",
      "verification": "Browser test on /login verifies clean isolated branding",
      "updated_at": "2026-10-16T18:00:00Z"
    },
    {
      "task_id": "TSK-LMS-003",
      "product_id": "churchcore-lms",
      "title": "Theological Student Credentialing & PDF Certificate Worker",
      "status": "in_progress",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "implementation-plan-2026-q4.md (\u00a72.4)",
      "target_milestone": "v0.48.0",
      "description": "Generate immutable cryptographic certificates upon course completion for AETH ministerial certification.",
      "verification": "npm run test:prod-synthetic verifies certificate signature",
      "updated_at": "2026-10-17T10:00:00Z"
    },
    {
      "task_id": "TSK-ACAD-001",
      "product_id": "churchcore-academy",
      "title": "Colegio Biblos Local Pilot Charter Approval & Preparation",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "pilot",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #247 & PR #248 (commit bed47c2)",
      "target_milestone": "v0.10.0",
      "description": "Established legal and technical baseline charter for Colegio Biblos K-12 Christian Day School pilot.",
      "verification": "PR #247 approved docs/pilots/colegio-biblos-local-pilot-charter.md; PR #248 recorded local preparation",
      "updated_at": "2026-10-17T08:00:00Z"
    },
    {
      "task_id": "TSK-ACAD-002",
      "product_id": "churchcore-academy",
      "title": "Colegio Biblos Participant Login & Uncoached Session",
      "status": "in_progress",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "pilot",
      "assignee": "Ricardo J. Julia",
      "git_reference": "Academy docs/plans/2026-10-16-pilot-to-production-completion-plan.md (Workstream C)",
      "target_milestone": "Workstream C owner decision",
      "description": "Local preparation is complete. Verify the actual participant browser or VM, run the real uncoached session, sanitize findings, and re-observe any S0-S2 blockers.",
      "verification": "Dated sanitized session report and recorded Academy owner residual-risk decision",
      "updated_at": "2026-10-17T16:30:00Z"
    },
    {
      "task_id": "TSK-ACAD-003",
      "product_id": "churchcore-academy",
      "title": "Academy RLS Verification Privilege Blockers",
      "status": "waiting",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "security",
      "assignee": "Ricardo J. Julia",
      "git_reference": "COUNCIL-2026-001 (REQ-001-01); Academy Council Review 30",
      "target_milestone": "Before central RLS compliance can be marked verified",
      "description": "The admissions, enrollment-conversion, and LLIS-consent RLS commands cannot complete because local anon/authenticated roles lack required table privileges. No grant change is authorized by governance telemetry.",
      "verification": "All three repository-owned RLS commands complete successfully after an Academy-scoped security review",
      "updated_at": "2026-10-17T16:30:00Z"
    },
    {
      "task_id": "TSK-CARE-001",
      "product_id": "churchcore-care",
      "title": "Mobile Vite Lockfile Resolution & Dependency Alignment",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "architecture",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #139 (commit 188f9df)",
      "target_milestone": "v7.0.0",
      "description": "Resolved root React app and mobile companion Vite dependency collision enabling clean Vercel production build.",
      "verification": "npm run build passes and deployed to churchcore-care.vercel.app",
      "updated_at": "2026-10-17T11:20:00Z"
    },
    {
      "task_id": "TSK-CARE-002",
      "product_id": "churchcore-care",
      "title": "Clinical EHR & Pastoral Counseling Intake Verification",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "v7.0.0-RELEASE-SUMMARY.md",
      "target_milestone": "v7.0.0",
      "description": "Production verification of HIPAA-compliant counseling intake, session notes encryption, and portal sign-in.",
      "verification": "Live at https://churchcore-care.vercel.app and www.churchcorecare.io",
      "updated_at": "2026-10-17T11:32:00Z"
    },
    {
      "task_id": "TSK-CARE-003",
      "product_id": "churchcore-care",
      "title": "Merge Faithful Workflows Enhancements Branch",
      "status": "in_progress",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "branch feat/faithful-workflows-enhancements",
      "target_milestone": "v7.1.0",
      "description": "Merge spiritually integrated counseling workflows and practice management modules into main.",
      "verification": "npm run test:e2e passes across all intake scenarios",
      "updated_at": "2026-10-17T11:40:00Z"
    },
    {
      "task_id": "TSK-ORTH-001",
      "product_id": "churchcore-orthos",
      "title": "Departmental Ministry Governance & Maturity Engine Shipped",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #25 (commit 3296855)",
      "target_milestone": "v0.18.0",
      "description": "Delivered ministry governance assessment engine, maturity scoring, and denominational policy audits.",
      "verification": "npm run test:all passes with 100% assertions",
      "updated_at": "2026-10-16T16:00:00Z"
    },
    {
      "task_id": "TSK-ORTH-002",
      "product_id": "churchcore-orthos",
      "title": "Compensating Safeguarding Controls for Small Churches",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #24 (commit a196eba)",
      "target_milestone": "v0.18.0",
      "description": "Implemented automated dual-signoff and board oversight workflows for churches without full accounting staffs.",
      "verification": "test/compensating-controls.spec.ts passing",
      "updated_at": "2026-10-15T19:00:00Z"
    },
    {
      "task_id": "TSK-ORTH-003",
      "product_id": "churchcore-orthos",
      "title": "Omni-Council Compliance Rehearsal & Cloud Supabase Binding",
      "status": "done",
      "directionality": "CONTROL_PLANE",
      "priority": "P0_CRITICAL",
      "category": "deployment",
      "assignee": "Ricardo J. Julia",
      "git_reference": "COUNCIL-2026-004 (REQ-004-02)",
      "target_milestone": "v0.18.1",
      "description": "Execute npm run test:omni-council, bind production Supabase credentials, and promote from preview to full production.",
      "verification": "56 test suites passing (278/278 tests), 135/135 master release checks passing",
      "updated_at": "2026-10-18T04:30:00Z"
    },
    {
      "task_id": "TSK-SCHL-001",
      "product_id": "faithfull-scholars",
      "title": "Cloudflare Turnstile CSP Header Directive Resolution",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "security",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #85 (commit c508488)",
      "target_milestone": "v0.1.0",
      "description": "Whitelisted challenges.cloudflare.com in Content-Security-Policy headers enabling Turnstile sign-up verification.",
      "verification": "Sign-up form completes successfully on faithfull-scholars.vercel.app",
      "updated_at": "2026-10-16T19:00:00Z"
    },
    {
      "task_id": "TSK-SCHL-002",
      "product_id": "faithfull-scholars",
      "title": "Honest Launch Surface & Spanish Localization Merged Live",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #86 & PR #87 (commit 5edc51b)",
      "target_milestone": "v0.1.0",
      "description": "Delivered bilingual theological faculty research platform, translated auth errors, and production Vercel edge release.",
      "verification": "Live at https://faithfull-scholars.vercel.app",
      "updated_at": "2026-10-16T22:30:00Z"
    },
    {
      "task_id": "TSK-HUB-001",
      "product_id": "ecosystem-control-plane",
      "title": "Universal AppSwitcher Navigation Shell Standard",
      "status": "planned",
      "directionality": "CONTROL_PLANE",
      "priority": "P1_HIGH",
      "category": "governance",
      "assignee": "Antigravity Agent",
      "git_reference": "OPS-02 & CP-2026-DIR-03",
      "target_milestone": "2026-11-15",
      "description": "Standardize top-navigation AppSwitcher component across all 6 applications allowing single-click ecosystem switching.",
      "verification": "Standard AppSwitcher React component in shared package or template",
      "updated_at": "2026-10-17T11:40:00Z"
    },
    {
      "task_id": "TSK-ORTH-004",
      "product_id": "churchcore-orthos",
      "title": "Phase 1 MVP 100% Completion & Pilot Readiness (v0.18.2)",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "PR #29 (commit 8d63567)",
      "target_milestone": "v0.18.2",
      "description": "Shipped CSP allowlists, GAAP ASC 958 double-entry fund accounting validator, universal 9-dot app switcher, live on Vercel.",
      "verification": "npm run test:all passes with 100% assertions, Vercel HTTP/2 200 response",
      "updated_at": "2026-10-18T04:35:00Z"
    },
    {
      "task_id": "TSK-SCHL-003",
      "product_id": "faithfull-scholars",
      "title": "Faculty Profile Public Monograph Index & Peer-Reviewed Scholarly Portfolio",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Ricardo J. Julia",
      "git_reference": "commit 75c18eb (branch feat/council-007-community-expansion-and-monographs merged to main)",
      "target_milestone": "v0.2.0",
      "description": "Interactive searchable and filterable monograph, book, dissertation, and journal publication index on faculty profile pages (/scholars/[slug]) with Chicago/APA citation copying and DOI outbound verification.",
      "verification": "components/scholars/scholar-monographs-index.tsx mounted on /scholars/[slug]; 6/6 tests passing in tests/unit/scholar-monographs-index.test.tsx; 78/78 test files passing in suite",
      "updated_at": "2026-10-18T17:15:00Z"
    },
    {
      "task_id": "TSK-SCHL-004",
      "product_id": "faithfull-scholars",
      "title": "Fortified FaithFull Community Ecosystem (Multi-Persona Expansion)",
      "status": "in_progress",
      "directionality": "EDGE_REPO",
      "priority": "P1_HIGH",
      "category": "architecture",
      "assignee": "Ricardo J. Julia",
      "git_reference": "COUNCIL-2026-007 (REQ-007-01)",
      "target_milestone": "v0.3.0",
      "description": "Database migration and RLS security hardening expanding the platform to pastors, churches, evangelists, ministers, apologists, and councils with sub-50ms query SLAs.",
      "verification": "supabase/migrations/20261018140000_community_ecosystem.sql with passing RLS audit",
      "updated_at": "2026-10-18T17:00:00Z"
    },
    {
      "task_id": "TSK-GOV-008",
      "product_id": "churchcore-business",
      "title": "Universal Sovereign Telemetry Reporting & Real-Time Digest Protocol (COUNCIL-2026-008)",
      "status": "done",
      "directionality": "CONTROL_PLANE",
      "priority": "P0_CRITICAL",
      "category": "governance",
      "assignee": "Ricardo J. Julia",
      "git_reference": "COUNCIL-2026-008 (commit 9dfcc2d)",
      "target_milestone": "Sprint Q4-M1",
      "description": "Mandated universal edge telemetry auto-reporting via posttest hooks across all 6 product pillars; implemented TelemetryWatcherThread daemon in serve.py, continuous --watch sync engine, REST ingestion endpoints, and dashboard real-time pulse listener.",
      "verification": "scripts/report-telemetry.py --auto passes across all 6 repos; control-plane-sync.py syncs in 1.4s; curl /api/fleet-status returns HTTP 200 with 6/6 online",
      "updated_at": "2026-10-18T17:45:00Z"
    },
    {
      "task_id": "TSK-ACAD-002",
      "product_id": "churchcore-academy",
      "title": "ChurchCore Academy Vercel Observation And Phase-Gate Reconciliation",
      "status": "done",
      "directionality": "EDGE_REPO",
      "priority": "P0_CRITICAL",
      "category": "deployment",
      "assignee": "Ricardo J. Julia",
      "git_reference": "ChurchCore-Business#6; Academy PR #253",
      "target_milestone": "v0.10.0",
      "description": "Authenticated Vercel evidence confirms a Ready production-target deployment and canonical aliases. Phase 1 engineering readiness is 100%; Phase 2 human validation remains entry-gate pending, hosted Supabase remains unverified/local-only, and Phase 3 production authorization is not granted.",
      "verification": "Vercel CLI 64.5.0 authenticated inspection: project prj_lcuoqk7M5gAfD0ElM48DClT5z2Iy, deployment dpl_CGgewdcXBDt1Z6RHcdg8eqM5eJiv Ready, canonical aliases present; governance decision recorded in Academy Council Review 33",
      "updated_at": "2026-10-19T20:08:22Z"
    },
    {
      "task_id": "TSK-AI-001",
      "product_id": "churchcore-business",
      "title": "Wire Marketing Intelligence & Feedback Council Deliberation to OpenRouter (Gemini 2.5 Pro)",
      "status": "done",
      "directionality": "CONTROL_PLANE",
      "priority": "P0_CRITICAL",
      "category": "feature",
      "assignee": "Antigravity Agent",
      "git_reference": "deliberation_engine.py & serve.py (OpenRouter Gemini Pro)",
      "target_milestone": "Sprint Q4-M1",
      "description": "Wired Marketing Presentations Hub to Gemini 2.5 Pro via OpenRouter for executive pitches, GTM displacement campaigns, investor briefings, and slide synthesis; wired Feedback Workspace to OpenRouter council deliberation to adjudicate user error reports and propose binding plans to fix, implement, or deny with Zero Customer Data propagation.",
      "verification": "POST /api/marketing-ai and POST /api/feedback-council return HTTP 200 with structured Gemini 2.5 Pro output; browser tested and verified in Mission Control Cockpit UI",
      "updated_at": "2026-10-18T19:30:00Z"
    }
  ],
  "plans": [
    {
      "product_id": "churchcore-chms",
      "repo_name": "ChurchCore ChMS",
      "source_file": "DEVELOPMENT_PLAN.md (v3.5.0)",
      "current_milestone": "v3.5.0 (Release 1d Closeout)",
      "directionality_summary": {
        "edge_originated_pct": 75,
        "control_plane_dispatched_pct": 25
      },
      "done": [
        {
          "title": "Multi-Campus Member Directory & Churchgoer Portal",
          "directionality": "EDGE_REPO",
          "details": "High-fidelity directory, household grouping, privacy toggles, and family check-in."
        },
        {
          "title": "Fintech Giving Pipeline & ACH Recurring Batches",
          "directionality": "EDGE_REPO",
          "details": "Stripe Connect embedded donor checkout, pledge campaigns, and tax deduction statements."
        },
        {
          "title": "Constitutional PostgreSQL Row-Level Security (RLS)",
          "directionality": "CONTROL_PLANE",
          "details": "Enforced tenant isolation across all tables with 0 bypass policies."
        }
      ],
      "waiting": [
        {
          "title": "Endorsed Brand House Trust Mark in Global Footer",
          "directionality": "CONTROL_PLANE",
          "details": "Render Powered by ChurchCore badge linking to security docs (COUNCIL-2026-002)."
        }
      ],
      "in_progress": [
        {
          "title": "R1d Member Data-Rights Erasure Approval Queue",
          "directionality": "EDGE_REPO",
          "details": "Admin queue with audit logging, ensuring erasure notices fire exclusively post-commit."
        }
      ],
      "planned": [
        {
          "title": "Automated Vercel Edge Crons (shepherd-ai & scheduled comms)",
          "directionality": "EDGE_REPO",
          "details": "Daily AI pastoral digest and queue retry workers running on Vercel crons."
        },
        {
          "title": "Universal AppSwitcher Navigation Integration",
          "directionality": "CONTROL_PLANE",
          "details": "Install standardized cross-suite navigation component (OPS-02)."
        }
      ]
    },
    {
      "product_id": "churchcore-lms",
      "repo_name": "ChurchCore LMS",
      "source_file": "docs/implementation-plan-2026-q4.md",
      "current_milestone": "v0.47.0 (Sprint 2 - Foundation & Credentialing)",
      "directionality_summary": {
        "edge_originated_pct": 70,
        "control_plane_dispatched_pct": 30
      },
      "done": [
        {
          "title": "Turbopack SSR Build Export Bug Resolution",
          "directionality": "EDGE_REPO",
          "details": "PR #89: Converted sync server actions to async exports resolving Vercel deployment blocker."
        },
        {
          "title": "Neutral Pre-Auth Gateway & Dynamic Tenant Branding",
          "directionality": "EDGE_REPO",
          "details": "PR #88: Dynamic institutional logo resolution with Powered by ChurchCore badge live."
        },
        {
          "title": "Supabase pg_net Extension & Webhook Dispatching",
          "directionality": "EDGE_REPO",
          "details": "Enabled pg_net extension on Supabase cloud instance for external webhook listeners."
        }
      ],
      "waiting": [
        {
          "title": "Synthetic Production Test Suite Execution",
          "directionality": "EDGE_REPO",
          "details": "Awaiting final green run on npm run test:prod-synthetic."
        }
      ],
      "in_progress": [
        {
          "title": "Theological Student Credentialing & PDF Certificate Worker",
          "directionality": "EDGE_REPO",
          "details": "Cryptographic certificate generation and verification for AETH seminaries."
        }
      ],
      "planned": [
        {
          "title": "AETH Ministerial Formation Digital Course Catalog",
          "directionality": "EDGE_REPO",
          "details": "Full Spanish/English ministerial formation curriculum and seat allocation engine."
        },
        {
          "title": "Universal AppSwitcher Navigation Integration",
          "directionality": "CONTROL_PLANE",
          "details": "Install standardized cross-suite navigation component (OPS-02)."
        }
      ]
    },
    {
      "product_id": "churchcore-academy",
      "repo_name": "ChurchCore Academy",
      "source_file": "docs/competitive-execution-plan.md",
      "current_milestone": "v0.10.0 (Colegio Biblos Pilot Phase)",
      "directionality_summary": {
        "edge_originated_pct": 65,
        "control_plane_dispatched_pct": 35
      },
      "done": [
        {
          "title": "Colegio Biblos Local Pilot Charter Formal Approval",
          "directionality": "EDGE_REPO",
          "details": "PR #247: Approved K-12 Christian Day School pilot operational agreement."
        },
        {
          "title": "Colegio Biblos Pilot Data Model & Seed Rehearsal Foundation",
          "directionality": "EDGE_REPO",
          "details": "PR #248: Established initial migration seeds and student enrollment structures."
        },
        {
          "title": "Production Vercel Cloud Deployment & Domain Linking",
          "directionality": "CONTROL_PLANE",
          "details": "Verified Ready via Vercel CLI (dpl_EgByH5cYyT2mEAvuXyXWWxLGU4CC). Canonical domains linked (churchcoreacademy.io, www.churchcoreacademy.io, church-core-academy.vercel.app). Phase 3 production authorization remains a separate gate."
        }
      ],
      "waiting": [],
      "in_progress": [
        {
          "title": "OneRoster 1.2 CSV Worker & Pilot Seed Sequencing",
          "directionality": "EDGE_REPO",
          "details": "Fixing foreign key dependency locks on grade_levels during pilot rehearsal."
        }
      ],
      "planned": [
        {
          "title": "Bilingual Spanish Student Gradebook & Attendance",
          "directionality": "EDGE_REPO",
          "details": "Gradebook calculation algorithms and daily multi-language attendance tracking."
        },
        {
          "title": "Powered by ChurchCore Trust Mark & AppSwitcher",
          "directionality": "CONTROL_PLANE",
          "details": "Implement Endorsed Brand standards and universal navigation shell."
        }
      ]
    },
    {
      "product_id": "churchcore-care",
      "repo_name": "ChurchCore Care",
      "source_file": "docs/v7.0.0-RELEASE-SUMMARY.md",
      "current_milestone": "v7.0.0 (Clinical EHR & Pastoral Care Production)",
      "directionality_summary": {
        "edge_originated_pct": 80,
        "control_plane_dispatched_pct": 20
      },
      "done": [
        {
          "title": "Mobile Vite Lockfile Resolution & Clean Vercel Build",
          "directionality": "EDGE_REPO",
          "details": "PR #139: Resolved React web and mobile companion package collision; deployed live."
        },
        {
          "title": "Clinical EHR Production Release (churchcore-care.vercel.app)",
          "directionality": "EDGE_REPO",
          "details": "Verified live at churchcore-care.vercel.app and www.churchcorecare.io with RLS."
        },
        {
          "title": "HIPAA & Clergy-Penitent Privilege Cryptographic Safeguards",
          "directionality": "CONTROL_PLANE",
          "details": "Enforced sovereign database isolation preventing any counseling sync to ChMS."
        }
      ],
      "waiting": [
        {
          "title": "Production Smoke Test Rehearsal on Vercel Surface",
          "directionality": "EDGE_REPO",
          "details": "Awaiting execution of npm run test:smoke against live churchcore-care.vercel.app."
        }
      ],
      "in_progress": [
        {
          "title": "Merge Faithful Workflows Enhancements Branch",
          "directionality": "EDGE_REPO",
          "details": "Spiritually integrated counseling workflows and practice management modules."
        }
      ],
      "planned": [
        {
          "title": "Translation Worker Container Optimization",
          "directionality": "EDGE_REPO",
          "details": "Dedicated Docker worker optimization for high-throughput bilingual clinical intake."
        },
        {
          "title": "Universal AppSwitcher Navigation Integration",
          "directionality": "CONTROL_PLANE",
          "details": "Install standardized cross-suite navigation component (OPS-02)."
        }
      ]
    },
    {
      "product_id": "churchcore-orthos",
      "repo_name": "ChurchCore Orthos",
      "source_file": "docs/omni-council-plan.md",
      "current_milestone": "v0.18.2 (100% Phase 1 MVP Complete \u2022 Pilot Ready)",
      "directionality_summary": {
        "edge_originated_pct": 70,
        "control_plane_dispatched_pct": 30
      },
      "done": [
        {
          "title": "Departmental Ministry Governance Engine (v0.18.0)",
          "directionality": "EDGE_REPO",
          "details": "PR #25: Shipped ministry governance evaluation, maturity scoring, and audits."
        },
        {
          "title": "Compensating Safeguarding Controls for Small Churches",
          "directionality": "EDGE_REPO",
          "details": "PR #24: Automated board oversight and dual-signoff compensating controls."
        },
        {
          "title": "Audit PDF Preview CSP Header Whitelisting",
          "directionality": "EDGE_REPO",
          "details": "Configuring explicit CSP allowlists in vercel.json for audit PDF preview rendering."
        },
        {
          "title": "Fund Accounting Double-Entry Balance Validator",
          "directionality": "EDGE_REPO",
          "details": "Automated ledger balancing check for restricted endowment and missionary funds."
        },
        {
          "title": "Powered by ChurchCore Trust Mark & AppSwitcher",
          "directionality": "CONTROL_PLANE",
          "details": "Implement Endorsed Brand standards and universal navigation shell."
        }
      ],
      "waiting": [],
      "in_progress": [],
      "planned": [
        {
          "title": "Phase 2: Comprehensive Institutional Safeguarding & Multi-Campus Expansion",
          "directionality": "EDGE_REPO",
          "details": "Enterprise diocese-wide multi-campus aggregation, automated incident escalation, and sovereign credential bridges."
        }
      ]
    },
    {
      "product_id": "faithfull-scholars",
      "repo_name": "FaithFull Scholars",
      "source_file": "docs/FAITHFULL_SCHOLARS_FULL_PLAN.md",
      "current_milestone": "v0.1.0 (Honest Launch Surface Production)",
      "directionality_summary": {
        "edge_originated_pct": 75,
        "control_plane_dispatched_pct": 25
      },
      "done": [
        {
          "title": "Cloudflare Turnstile CSP Header Directive Resolution",
          "directionality": "EDGE_REPO",
          "details": "PR #85: Whitelisted challenges.cloudflare.com enabling reliable sign-up completion."
        },
        {
          "title": "Honest Launch Surface & Spanish Localization Merged Live",
          "directionality": "EDGE_REPO",
          "details": "PR #86 & #87: Bilingual theological scholarship network live on Vercel."
        },
        {
          "title": "Constitutional PostgreSQL Row-Level Security (RLS)",
          "directionality": "CONTROL_PLANE",
          "details": "Strict multi-tenant security isolating academic monographs and faculty reviews."
        }
      ],
      "waiting": [
        {
          "title": "Production Supabase RLS Policy Audit Run",
          "directionality": "EDGE_REPO",
          "details": "Awaiting final execution of npm run audit:rls against live database."
        }
      ],
      "in_progress": [
        {
          "title": "Theological Faculty Monograph Indexing Interface",
          "directionality": "EDGE_REPO",
          "details": "Author submission portal and peer-review editorial triage dashboard."
        }
      ],
      "planned": [
        {
          "title": "Academic Peer-Review Editorial Workflow",
          "directionality": "EDGE_REPO",
          "details": "Blind peer review assignment, commentary threads, and editorial decision queues."
        },
        {
          "title": "Universal AppSwitcher Navigation Integration",
          "directionality": "CONTROL_PLANE",
          "details": "Install standardized cross-suite navigation component (OPS-02)."
        }
      ]
    }
  ],
  "councils": [
    {
      "council_id": "council-grand",
      "product_id": "all-suites",
      "name": "High Sovereign Grand Council of ChurchCore",
      "short_name": "Grand High Council",
      "badge": "\ud83c\udfdb\ufe0f Grand Sovereign Assembly",
      "app_domain": "Cross-Ecosystem Constitutional Invariants, Sovereign Architecture & Strategic Alignment",
      "governing_state": {
        "quorum_status": "7/7 Active Quorum",
        "quorum_seats": 7,
        "occupied_seats": 7,
        "last_review_number": 4,
        "last_review_date": "2026-10-17",
        "last_ratification": "COUNCIL-2026-004: Fleet Telemetry & Central Control Plane Ingestion",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "Constitution Section III: Zero Customer Data Cross-Propagation",
          "Decentralized Sovereignty: 6 Separate PostgreSQL Databases",
          "Sunday Morning SLA: Zero Downtime during Holy Hours (06:00-13:00)",
          "Brand House: Powered by ChurchCore Endorsed Trust Lockup"
        ],
        "active_deliberations_count": 1,
        "ratification_rate_pct": 100
      },
      "members": [
        {
          "seat_id": "grand-chair",
          "title": "Sovereign Executive & Principal Architect",
          "persona_name": "Ricardo J. Julia & Antigravity (AGY)",
          "avatar": "\ud83d\udc51",
          "domain": "Executive Direction, Fleet Strategy & Architectural Cohesion",
          "invariant_focus": "Preserving the sacred trust of church sovereignty while scaling world-class software.",
          "deliberation_stance": "Executive Decision Maker & Sovereign Founder",
          "bio": "Guiding the ChurchCore vision to equip local churches, seminaries, academies, and ministries with uncompromised sovereign technology."
        },
        {
          "seat_id": "grand-data",
          "title": "Sovereign Data Guardian",
          "persona_name": "Archivist Gabriel (Data Sentinel)",
          "avatar": "\ud83d\udee1\ufe0f",
          "domain": "Database Isolation, PostgreSQL Schemas & Zero Cross-App Leakage",
          "invariant_focus": "Enforcing Constitution Section III across every git commit and migration.",
          "deliberation_stance": "Zero-Tolerance Isolationist",
          "bio": "Guarantees that no background daemon or event broker ever breaches the sovereign database boundary of any church."
        },
        {
          "seat_id": "grand-pastoral",
          "title": "Ecclesiastical & Pastoral Integrity Dean",
          "persona_name": "Rev. Dr. Thomas Chalmers",
          "avatar": "\ud83d\udd4a\ufe0f",
          "domain": "Theological Calibration, Pastoral Care Ethics & Ministry Purpose",
          "invariant_focus": "Ensuring all product features serve the flock and do not monetize sacred relationships.",
          "deliberation_stance": "Shepherd-First & Ministry Integrity",
          "bio": "Pastoral theologian ensuring technology enhances human spiritual fellowship and liturgical dignity."
        },
        {
          "seat_id": "grand-sla",
          "title": "Sunday Morning 99.99% SLA Steward",
          "persona_name": "Chief Reliability Engineer Kaelen",
          "avatar": "\u23f1\ufe0f",
          "domain": "Edge Latency, Vercel/Supabase High-Availability & Disaster Recovery",
          "invariant_focus": "Zero downtime between 06:00 and 13:00 on Sunday morning across all 6 applications.",
          "deliberation_stance": "Resilience & Circuit-Breaker Enforcer",
          "bio": "Monitors connection pooling, synthetic latency probes, and automated point-in-time database snapshots."
        },
        {
          "seat_id": "grand-academic",
          "title": "Educational & Pedagogical Provost",
          "persona_name": "Dr. Miriam Al-Haddad",
          "avatar": "\ud83c\udf93",
          "domain": "Theological Education, K-12 Accreditation & Scholarship Equity",
          "invariant_focus": "Academic rigor, rubrics consistency, and barrier-free scholarship disbursements.",
          "deliberation_stance": "Academic Standards & Pedagogy Specialist",
          "bio": "Oversees the educational alignment across LMS, Academy, and FaithFull Scholars."
        },
        {
          "seat_id": "grand-fintech",
          "title": "Stewardship & Financial Compliance Auditor",
          "persona_name": "CFO Nathan Vance",
          "avatar": "\ud83d\udcca",
          "domain": "Tithing Pipelines, Tuition ACH, Benevolence & OPEX Efficiency",
          "invariant_focus": "Preserving low $240/mo fleet hosting cost while delivering enterprise-grade tithing take-rates.",
          "deliberation_stance": "Fiduciary Responsibility & Transparency",
          "bio": "Audits Stripe webhook idempotency, PCI compliance, and non-profit tax reporting workflows."
        },
        {
          "seat_id": "grand-ux",
          "title": "Design System & Liturgical UI Steward",
          "persona_name": "Maestro Julian Vance",
          "avatar": "\ud83c\udfa8",
          "domain": "WCAG AAA Accessibility, Liturgical Calm & Design Harmony",
          "invariant_focus": "Serene, distraction-free interfaces that convey reverence and effortless clarity.",
          "deliberation_stance": "Human-Centric & Liturgical Dignity",
          "bio": "Guardian of the ChurchCore Design System across web and mobile surfaces."
        }
      ],
      "recent_reviews": [
        {
          "id": "COUNCIL-2026-004",
          "title": "Fleet Telemetry & Central Control Plane Ingestion",
          "date": "2026-10-17",
          "verdict": "RATIFIED (7/7 Unanimous)"
        },
        {
          "id": "COUNCIL-2026-003",
          "title": "Mandatory Agent Rules & Local Governance Ledger",
          "date": "2026-10-16",
          "verdict": "RATIFIED (7/7 Unanimous)"
        },
        {
          "id": "COUNCIL-2026-002",
          "title": "Brand House & Trust Badge Specifications",
          "date": "2026-10-16",
          "verdict": "RATIFIED (7/7 Unanimous)"
        },
        {
          "id": "COUNCIL-2026-001",
          "title": "Constitutional Row-Level Security & Zero Data Propagation",
          "date": "2026-10-16",
          "verdict": "RATIFIED (7/7 Unanimous)"
        }
      ]
    },
    {
      "council_id": "council-care",
      "product_id": "churchcore-care",
      "name": "ChurchCore Care Confidentiality & Pastoral Council",
      "short_name": "Care Council",
      "badge": "\ud83d\udee1\ufe0f Care & Confidentiality",
      "app_domain": "Pastoral Counseling, Clinical Triage, HIPAA Notes, Grief & Benevolence Dispatch",
      "governing_state": {
        "quorum_status": "5/5 Active Quorum",
        "quorum_seats": 5,
        "occupied_seats": 5,
        "last_review_number": 14,
        "last_review_date": "2026-10-16",
        "last_ratification": "Review 14: Encrypted Pastoral Session Notes & Role-Restricted Visibility",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "Absolute Clergy-Penitent Privilege & HIPAA Confidentiality",
          "Session Notes Encrypted with pgcrypto at rest; no plain-text logs",
          "Crisis Intervention & Suicide Prevention Hotline fast-action banner",
          "Benevolence fund disbursements require dual-clergy approval"
        ],
        "active_deliberations_count": 1,
        "ratification_rate_pct": 100
      },
      "members": [
        {
          "seat_id": "care-chaplain",
          "title": "Lead Pastoral Care Chaplain",
          "persona_name": "Rev. Dr. Samuel Kim, D.Min",
          "avatar": "\ud83d\udd4a\ufe0f",
          "domain": "Hospital Visitation, Bereavement & Spiritual Crisis Triage",
          "invariant_focus": "Protecting spiritual intimacy and emotional vulnerability during traumatic trials.",
          "deliberation_stance": "Compassion & Urgent Shepherd Response",
          "bio": "25 years of pastoral chaplaincy guiding ICU hospital visits, grief counseling, and prayer vigils."
        },
        {
          "seat_id": "care-hipaa",
          "title": "Clinical Confidentiality & Legal Compliance Officer",
          "persona_name": "Elena Rostova, LCSW, JD",
          "avatar": "\ud83d\udd12",
          "domain": "HIPAA Privacy, Mandatory Reporting & Counselor Notes Isolation",
          "invariant_focus": "Ensuring no counseling note is ever exposed to unauthenticated or unauthorized eyes.",
          "deliberation_stance": "Rigorous Privacy & Legal Safeguard",
          "bio": "Clinical therapist and healthcare attorney ensuring clinical standards align with pastoral privilege."
        },
        {
          "seat_id": "care-triage",
          "title": "Emergency Care Triage & Escalation Architect",
          "persona_name": "Marcus Sterling (Agent Triage)",
          "avatar": "\u26a1",
          "domain": "Automated Escalation Workflows, Crisis Notification & Hotlines",
          "invariant_focus": "Sub-5-minute alert dispatch to on-call pastors when crisis indicators are flagged.",
          "deliberation_stance": "Rapid Response & Fail-Safe Routing",
          "bio": "Engineers workflow pipelines for immediate pastoral mobilization without exposing personal identity."
        },
        {
          "seat_id": "care-volunteer",
          "title": "Deacon & Volunteer Care Circles Coordinator",
          "persona_name": "Deaconess Martha Perez",
          "avatar": "\ud83e\udd1d",
          "domain": "Meal Trains, Homebound Transportation & Congregational Visitation",
          "invariant_focus": "Dignified volunteer matching that respects recipient privacy and dignity.",
          "deliberation_stance": "Community Care & Practical Help",
          "bio": "Coordinates parish volunteers for meal trains, elderly homebound visits, and practical family relief."
        },
        {
          "seat_id": "care-benevolence",
          "title": "Benevolence & Emergency Fund Auditor",
          "persona_name": "Elder David Chen, CPA",
          "avatar": "\ud83d\udcca",
          "domain": "Emergency Financial Assistance, Rent Relief & Audit Trails",
          "invariant_focus": "Dual-signature disbursements, anti-fraud checks, and transparent elder oversight.",
          "deliberation_stance": "Fiduciary Accountability & Compassion",
          "bio": "Oversees emergency relief funds ensuring church charity reaches needy families with complete accountability."
        }
      ],
      "recent_reviews": [
        {
          "id": "CARE-REV-014",
          "title": "Encrypted Pastoral Notes & Multi-Role RLS Scopes",
          "date": "2026-10-16",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "CARE-REV-013",
          "title": "Emergency Crisis Dispatch & Pastor SMS Webhooks",
          "date": "2026-10-10",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "CARE-REV-012",
          "title": "Dual-Approval Benevolence Grant Workflow",
          "date": "2026-10-04",
          "verdict": "RATIFIED (5/5 Unanimous)"
        }
      ]
    },
    {
      "council_id": "council-lms",
      "product_id": "churchcore-lms",
      "name": "ChurchCore LMS Architecture & Pedagogy Council",
      "short_name": "LMS Council",
      "badge": "\ud83c\udf93 LMS Architecture",
      "app_domain": "Seminary Courses, Canvas-Grade SpeedGrader, Drip Engines, Discipleship & Certification",
      "governing_state": {
        "quorum_status": "6/6 Active Quorum",
        "quorum_seats": 6,
        "occupied_seats": 6,
        "last_review_number": 47,
        "last_review_date": "2026-10-14",
        "last_ratification": "COUNCIL-2026-047: Trinity Feature Expansion & Vertical Mode Gating",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "Zero Third-Party Variable Hosting Cost for Academic Features",
          "SpeedGrader: Split-Screen Document Preview with Multi-Criterion Rubrics",
          "Dynamic Drip Engine: 7-day, 21-day, 40-day release automation",
          "Faith & Vertical Mode Gating (Christian Seminary vs General Education)"
        ],
        "active_deliberations_count": 2,
        "ratification_rate_pct": 100
      },
      "members": [
        {
          "seat_id": "lms-dean",
          "title": "Academic Dean & Theological Provost",
          "persona_name": "Dr. Silas Thorne, Ph.D",
          "avatar": "\ud83c\udf93",
          "domain": "ATS & Regional Seminary Accreditation, Syllabus Rigor & Orthodoxy",
          "invariant_focus": "Ensuring degree-granting seminary standards without sacrificing pastoral warmth.",
          "deliberation_stance": "Academic Rigor & Doctrinal Soundness",
          "bio": "Former seminary dean championing accessible, high-standard theological education for global pastors."
        },
        {
          "seat_id": "lms-speedgrader",
          "title": "SpeedGrader & Assessment Workflow Steward",
          "persona_name": "Prof. Clara Higgins",
          "avatar": "\ud83d\udcdd",
          "domain": "Canvas-Grade Grading, Multi-Criterion Rubrics & Keyboard Navigation",
          "invariant_focus": "Instructor grading velocity: under 90 seconds per submission with rich rubric feedback.",
          "deliberation_stance": "Instructor Workflow & Pedagogical Utility",
          "bio": "Educational technology specialist optimizing instructor workflow and formative feedback loops."
        },
        {
          "seat_id": "lms-drip",
          "title": "Discipleship Journey & Content Drip Architect",
          "persona_name": "Pastor Jeremy Cole",
          "avatar": "\ud83d\udca7",
          "domain": "Automated Cohort Pacing, 40-Day Lent Journeys & Email Notifications",
          "invariant_focus": "Paced spiritual formation that prevents student burnout and nurtures daily habits.",
          "deliberation_stance": "Student Engagement & Spiritual Formation",
          "bio": "Pioneered cohort-based discipleship tracks that blend digital modules with local church mentors."
        },
        {
          "seat_id": "lms-registrar",
          "title": "Student Credentialing & Transcripts Registrar",
          "persona_name": "Eleanor Brooks, Ed.D",
          "avatar": "\ud83c\udfc6",
          "domain": "Tamper-Evident PDF Transcripts, Micro-Credentials & SIS Records",
          "invariant_focus": "Cryptographically verifiable transcripts that transfer seamlessly to accredited institutions.",
          "deliberation_stance": "Accreditation & Record Integrity",
          "bio": "Registrar overseeing student GPA computation, degree audits, and graduation credentialing."
        },
        {
          "seat_id": "lms-community",
          "title": "Spiritual Fellowship & Community Moderator",
          "persona_name": "Brother Lucas Mendez",
          "avatar": "\ud83d\udcac",
          "domain": "Community Spaces, Spiritual Reactions (\ud83d\ude4f Amen, \u271d\ufe0f Pray) & Forum Safety",
          "invariant_focus": "Cultivating edifying student dialogue free from divisive vitriol or toxic spam.",
          "deliberation_stance": "Spiritual Edification & Community Safety",
          "bio": "Leads theological community forums fostering mutual encouragement and student prayer circles."
        },
        {
          "seat_id": "lms-infra",
          "title": "Zero-Cost Serverless & Turbopack Architect",
          "persona_name": "Devin Vance (Agent LMS-Infra)",
          "avatar": "\u26a1",
          "domain": "Next.js 15 App Router, Server Actions, pg_net & Turbopack SSR Stability",
          "invariant_focus": "Maintaining $0 added infrastructure cost while supporting thousands of simultaneous exam submissions.",
          "deliberation_stance": "High Efficiency & Cost-Zero Optimization",
          "bio": "Solves serverless SSR caching, Turbopack use-server boundaries, and Supabase pg_net webhooks."
        }
      ],
      "recent_reviews": [
        {
          "id": "COUNCIL-2026-047",
          "title": "Trinity Feature Expansion & Vertical Mode Gating",
          "date": "2026-10-14",
          "verdict": "RATIFIED (6/6 Unanimous)"
        },
        {
          "id": "COUNCIL-2026-046",
          "title": "Academic Structure Quality Hardening & Section Capacity",
          "date": "2026-10-02",
          "verdict": "RATIFIED (6/6 Unanimous)"
        },
        {
          "id": "COUNCIL-2026-037",
          "title": "Assignment Rubrics & Multi-Criterion Assessment",
          "date": "2026-09-28",
          "verdict": "RATIFIED (6/6 Unanimous)"
        }
      ]
    },
    {
      "council_id": "council-chms",
      "product_id": "churchcore-chms",
      "name": "ChurchCore Parish Architecture & Governance Council",
      "short_name": "ChMS Council",
      "badge": "\u26ea ChMS Governance",
      "app_domain": "Parish Membership, Tithing & Giving, Sunday Child Check-in, Volunteer Schedules & Erasure",
      "governing_state": {
        "quorum_status": "5/5 Active Quorum",
        "quorum_seats": 5,
        "occupied_seats": 5,
        "last_review_number": 57,
        "last_review_date": "2026-10-17",
        "last_ratification": "Review 57: R1d Member Erasure & Data Rights Re-Review",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "Constitutional GDPR / CCPA Member Right to Erasure without ghost records",
          "Child Safety: Secure parent-child check-in tags with encrypted SMS checkout codes",
          "Sunday Morning SLA: Sub-50ms check-in kiosk response time during morning peak",
          "Giving Pipeline: Dual-reconciliation between Stripe transactions and Supabase tithing ledger"
        ],
        "active_deliberations_count": 1,
        "ratification_rate_pct": 99
      },
      "members": [
        {
          "seat_id": "chms-shepherd",
          "title": "Lead Pastor & Parish Life Steward",
          "persona_name": "Pastor Caleb Wright",
          "avatar": "\u26ea",
          "domain": "Member Discipleship Funnel, Multi-Campus Ministries & Visitor Assimilation",
          "invariant_focus": "Ensuring no visitor slips through the cracks while avoiding robotic impersonal outreach.",
          "deliberation_stance": "Pastoral Assimilation & Member Care",
          "bio": "Multi-campus church planter focusing on relational retention and discipleship pathways."
        },
        {
          "seat_id": "chms-agent1",
          "title": "Agent 1: Sovereign Data & API Architect",
          "persona_name": "Agent 1 (Data Sentinel)",
          "avatar": "\ud83d\udee1\ufe0f",
          "domain": "Supabase PostgreSQL Migrations, RLS Policies, Data Erasure RPCs & SQL Probes",
          "invariant_focus": "Zero residual PII in audit copies after GDPR member erasure requests.",
          "deliberation_stance": "Strict SQL Correctness & Transactional Isolation",
          "bio": "Verifies row-level security, denial-of-service resilience, and foreign-key cascade consistency."
        },
        {
          "seat_id": "chms-agent2",
          "title": "Agent 2: Route & High-Concurrency Architect",
          "persona_name": "Agent 2 (Route Specialist)",
          "avatar": "\u26a1",
          "domain": "Next.js App Router, Server Actions, Check-in Kiosks & Session Buffering",
          "invariant_focus": "Instant offline-first resilience for Sunday morning tablet check-ins.",
          "deliberation_stance": "High Availability & Concurrency Optimist",
          "bio": "Engineers Next.js server actions, parallel routing, and idempotent network retry handlers."
        },
        {
          "seat_id": "chms-agent3",
          "title": "Agent 3: UX Shell & Accessibility Guardian",
          "persona_name": "Agent 3 (Design Architect)",
          "avatar": "\ud83c\udfa8",
          "domain": "Church Staff Workspace, Volunteer Rosters & WCAG AAA Liturgical Theme",
          "invariant_focus": "Effortless usability for elderly volunteers and non-technical church secretaries.",
          "deliberation_stance": "Accessible, Calm & Intuitive UI",
          "bio": "Designs ergonomic dashboards that allow church staff to finish weekly admin in minutes."
        },
        {
          "seat_id": "chms-steward",
          "title": "Sunday SLA & Financial Giving Trustee",
          "persona_name": "Treasurer Arthur Pendelton",
          "avatar": "\ud83d\udcb0",
          "domain": "Tithing ACH/Card Batches, Donor Year-End Tax Receipts & Sunday Morning Uptime",
          "invariant_focus": "100% financial auditability and zero lost tithing transactions on Sunday peak.",
          "deliberation_stance": "Financial Integrity & Absolute Precision",
          "bio": "Nonprofit CPA ensuring impeccable donor gift tracking and automated IRS 501(c)(3) receipts."
        }
      ],
      "recent_reviews": [
        {
          "id": "CHMS-REV-057",
          "title": "R1d Member Erasure & Data Rights Re-Review",
          "date": "2026-10-17",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "CHMS-REV-056",
          "title": "R1d Synthesis: Erasure Denial & Suppression Queue",
          "date": "2026-10-16",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "CHMS-REV-055",
          "title": "Multi-Campus Volunteer Roster Scheduling & SMS Shift Alerts",
          "date": "2026-10-14",
          "verdict": "RATIFIED (5/5 Unanimous)"
        }
      ]
    },
    {
      "council_id": "council-academy",
      "product_id": "churchcore-academy",
      "name": "ChurchCore Academy K-12 Christian Pedagogy Council",
      "short_name": "Academy Council",
      "badge": "\ud83c\udfeb Academy Standards",
      "app_domain": "K-12 Christian Schooling, SIS Student Information System, Attendance, Family Billing & COPPA",
      "governing_state": {
        "quorum_status": "5/5 Active Quorum",
        "quorum_seats": 5,
        "occupied_seats": 5,
        "last_review_number": 18,
        "last_review_date": "2026-10-15",
        "last_ratification": "Review 18: Colegio Biblos Pilot Prep & Spanish Family Portal",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "COPPA & FERPA Student Data Protection; strict guardian access",
          "Bilingual English/Spanish Family Portal for Hispanic Christian Day Schools",
          "Emergency Campus Lockdown & Dismissal Notification System",
          "Zero Third-Party Vendor Tracking on student learning surfaces"
        ],
        "active_deliberations_count": 1,
        "ratification_rate_pct": 100
      },
      "members": [
        {
          "seat_id": "acad-headmaster",
          "title": "Headmaster & Christian Curriculum Director",
          "persona_name": "Dr. Jonathan Edwards, Ed.D",
          "avatar": "\ud83c\udfeb",
          "domain": "Classical Christian Pedagogy, Biblical Worldview Integration & Faculty Oversight",
          "invariant_focus": "Forming virtuous young minds rooted in scripture, classical literature, and STEM.",
          "deliberation_stance": "Biblical Classical Pedagogy Lead",
          "bio": "20 years of Christian school leadership pioneering classical curriculum frameworks."
        },
        {
          "seat_id": "acad-parent",
          "title": "Parental Trust & Child Safety Guardian",
          "persona_name": "Maria Teresa De La Cruz",
          "avatar": "\ud83d\udee1\ufe0f",
          "domain": "Family Portal Usability, Dismissal Security & Parent-Teacher Messaging",
          "invariant_focus": "Fostering absolute parental transparency and secure campus pickup authorization.",
          "deliberation_stance": "Parent-First & Family Protection",
          "bio": "Parent association president and former educator safeguarding family communication channels."
        },
        {
          "seat_id": "acad-bursar",
          "title": "Tuition Billing & SIS Registrar",
          "persona_name": "Patricia Sterling, MBA",
          "avatar": "\ud83d\udcb3",
          "domain": "Tuition Payment Plans, Family Multi-Child Discounts & State Voucher Tracking",
          "invariant_focus": "Predictable school cash-flow, timely bursary relief, and automated billing receipts.",
          "deliberation_stance": "Operational Efficiency & Family Flexibility",
          "bio": "Christian academy bursar managing school operating budgets and scholarship funds."
        },
        {
          "seat_id": "acad-tech",
          "title": "K-12 Student Information Systems Architect",
          "persona_name": "Carlos Gomez (Agent SIS)",
          "avatar": "\u26a1",
          "domain": "Attendance Rolls, Gradebook GPA Computation & Report Cards PDF",
          "invariant_focus": "Instant attendance verification and tamper-evident grade storage.",
          "deliberation_stance": "SIS Data Integrity & Automation",
          "bio": "Designs lightning-fast attendance rolls for classroom teachers and automated report card runs."
        },
        {
          "seat_id": "acad-spanish",
          "title": "Hispanic Christian Schooling Liaison",
          "persona_name": "Pastora Gabriela Fuentes",
          "avatar": "\ud83c\udf0e",
          "domain": "Bilingual Curriculum Alignment, Latin American Academy Partnerships (Colegio Biblos)",
          "invariant_focus": "Flawless Spanish orthography and culturally resonant family communication.",
          "deliberation_stance": "Cultural Bridge & Bilingual Excellence",
          "bio": "Coordinates Spanish Christian school networks across Puerto Rico, Florida, and Latin America."
        }
      ],
      "recent_reviews": [
        {
          "id": "ACAD-REV-018",
          "title": "Colegio Biblos Pilot Prep & Spanish Family Portal",
          "date": "2026-10-15",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "ACAD-REV-017",
          "title": "Dismissal Security: Automated Barcode & PIN Pickup Tags",
          "date": "2026-10-09",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "ACAD-REV-016",
          "title": "Tuition Split Billing & Scholarship Deductions Engine",
          "date": "2026-10-02",
          "verdict": "RATIFIED (5/5 Unanimous)"
        }
      ]
    },
    {
      "council_id": "council-orthos",
      "product_id": "churchcore-orthos",
      "name": "ChurchCore Orthos Theological & Liturgical Council",
      "short_name": "Orthos Council",
      "badge": "\ud83d\udcdc Orthos Theological",
      "app_domain": "Historic Confessions, Ecumenical Creeds, Exegetical Lexicon, Liturgical Calendar & Doctrinal Integrity",
      "governing_state": {
        "quorum_status": "5/5 Active Quorum",
        "quorum_seats": 5,
        "occupied_seats": 5,
        "last_review_number": 12,
        "last_review_date": "2026-10-12",
        "last_ratification": "Review 12: Westminster, Heidelberg & 1689 Creeds Cross-Link Engine",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "Doctrinal Orthodoxy: Guarding the apostolic faith once delivered to the saints",
          "Original Hebrew & Greek Scripture Lexicon Fidelity without modern paraphrasing bias",
          "Historic Liturgical Calendar: Proper readings, lectionaries, and holy day cycles",
          "Anti-Heresy Guardrails: Identifying and alerting on Christological or Trinitarian distortions"
        ],
        "active_deliberations_count": 1,
        "ratification_rate_pct": 100
      },
      "members": [
        {
          "seat_id": "orthos-theologian",
          "title": "Systematic Theologian & Creeds Guardian",
          "persona_name": "Rev. Dr. Alistair MacIntyre, Th.D",
          "avatar": "\ud83d\udcdc",
          "domain": "Historic Reformed, Lutheran, Anglican & Patristic Confessional Documents",
          "invariant_focus": "Faithful adherence to the Nicene, Athanasian, and Reformation confessions.",
          "deliberation_stance": "Confessional Orthodoxy & Historical Fidelity",
          "bio": "Distinguished professor of historical theology specializing in 16th and 17th century dogmatics."
        },
        {
          "seat_id": "orthos-linguist",
          "title": "Biblical Languages & Exegetical Integrity Lead",
          "persona_name": "Dr. Sarah Ben-Zvi, Ph.D",
          "avatar": "\ud83d\udcd6",
          "domain": "Biblical Hebrew, Aramaic, Koine Greek & Manuscript Apparatus",
          "invariant_focus": "Morphological accuracy, syntactic parsing, and faithful lexical definitions.",
          "deliberation_stance": "Linguistic Precision & Exegetical Truth",
          "bio": "Semantics and textual criticism scholar ensuring digital lexicons remain true to the original biblical text."
        },
        {
          "seat_id": "orthos-liturgy",
          "title": "Liturgical Calendar & Lectionary Architect",
          "persona_name": "Father Kenneth Ward",
          "avatar": "\ud83d\udd6f\ufe0f",
          "domain": "Christian Year Cycles (Advent, Epiphany, Lent, Easter, Pentecost), Daily Office Readings",
          "invariant_focus": "Rhythmic, prayerful lectionary flows that nurture daily contemplation and reverence.",
          "deliberation_stance": "Liturgical Dignity & Sacred Rhythm",
          "bio": "Anglican liturgist advising on historical church cycles and communal morning/evening prayer."
        },
        {
          "seat_id": "orthos-heresy",
          "title": "Doctrinal Drift & Anti-Heresy Watcher",
          "persona_name": "Elder Barnabas Vance (Agent Orthos-Watch)",
          "avatar": "\ud83d\udee1\ufe0f",
          "domain": "Automated Theological Guardrails, Cross-Referencing & Confessional Validation",
          "invariant_focus": "Flagging novel theological errors, modalism, Arianism, or prosperity gospel distortion.",
          "deliberation_stance": "Doctrinal Sentinel & Biblical Guardian",
          "bio": "Scans theological texts and curriculum drafts to ensure alignment with historic biblical orthodoxy."
        },
        {
          "seat_id": "orthos-engine",
          "title": "Semantic Scripture Graph & Vector Architect",
          "persona_name": "Zachary Taylor (Agent Scriptura)",
          "avatar": "\u26a1",
          "domain": "Supabase pgvector Scripture Embeddings, Cross-Reference Graph & Fast Search",
          "invariant_focus": "Sub-20ms cross-reference lookups across 31,102 verses of the Holy Bible.",
          "deliberation_stance": "Sub-Second Semantic Retrieval",
          "bio": "Builds high-performance graph databases linking biblical passages to historical church commentary."
        }
      ],
      "recent_reviews": [
        {
          "id": "ORTHOS-REV-012",
          "title": "Westminster, Heidelberg & 1689 Creeds Cross-Link Engine",
          "date": "2026-10-12",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "ORTHOS-REV-011",
          "title": "Koine Greek Morphological Parser & Strong's Concordance Bridge",
          "date": "2026-10-06",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "ORTHOS-REV-010",
          "title": "Ecumenical Creeds Liturgical Display Component",
          "date": "2026-09-30",
          "verdict": "RATIFIED (5/5 Unanimous)"
        }
      ]
    },
    {
      "council_id": "council-scholars",
      "product_id": "faithfull-scholars",
      "name": "FaithFull Scholars Endowment & Research Council",
      "short_name": "Scholars Council",
      "badge": "\ud83c\udf1f Scholars Endowment",
      "app_domain": "Seminary Scholarships, Academic Endowments, Monograph Publishing, Peer Review & Grant Disbursement",
      "governing_state": {
        "quorum_status": "5/5 Active Quorum",
        "quorum_seats": 5,
        "occupied_seats": 5,
        "last_review_number": 16,
        "last_review_date": "2026-10-16",
        "last_ratification": "Review 16: Endowment Grant Application Engine & Blind Peer Review",
        "governing_health": "OPTIMAL",
        "charter_invariants": [
          "Donor Intent Preservation: Strict adherence to donor gift covenants and restrictions",
          "Blind Peer Review: Scholarly research evaluated on merit without personal bias",
          "Needs-Based & Merit Allocation: Transparent rubrics for pastoral scholarship grants",
          "Monograph Open Access: Distributing theological scholarship freely to developing-world pastors"
        ],
        "active_deliberations_count": 1,
        "ratification_rate_pct": 100
      },
      "members": [
        {
          "seat_id": "scholars-trustee",
          "title": "Endowment Fund Trustee & Chair",
          "persona_name": "Hon. Elizabeth Warren-Harding",
          "avatar": "\ud83c\udfdb\ufe0f",
          "domain": "Foundation Grants, Endowment Corpus Preservation & Donor Intent Contracts",
          "invariant_focus": "Ensuring scholarship funds are never co-mingled or diverted from their sacred educational purpose.",
          "deliberation_stance": "Fiduciary Stewardship & Legal Integrity",
          "bio": "Endowment attorney and foundation trustee managing multi-million-dollar academic trust funds."
        },
        {
          "seat_id": "scholars-dean",
          "title": "Seminary Scholarship Allocations Dean",
          "persona_name": "Dr. Emmanuel Okonjo, D.D",
          "avatar": "\u2696\ufe0f",
          "domain": "Global Majority Pastoral Grants, Need-Based Scoring & Academic Merit",
          "invariant_focus": "Equipping under-resourced pastors in the Global South with debt-free theological education.",
          "deliberation_stance": "Global Equity & Pastoral Equipping",
          "bio": "Former African seminary rector advocating for debt-free pastoral training worldwide."
        },
        {
          "seat_id": "scholars-editor",
          "title": "Monograph Editor-in-Chief & Peer Review Director",
          "persona_name": "Prof. Beatrice Lancaster, Litt.D",
          "avatar": "\ud83d\udcda",
          "domain": "Theological Journal Publishing, Double-Blind Peer Review & Citation Graph",
          "invariant_focus": "High academic standard in theological publishing, Latin/German/French sources.",
          "deliberation_stance": "Scholarly Rigor & Publishing Excellence",
          "bio": "Editor of academic monographs and peer-reviewed journals in theology and church history."
        },
        {
          "seat_id": "scholars-mentorship",
          "title": "Doctoral Fellowship & Mentorship Lead",
          "persona_name": "Dr. Timothy Sterling, Ph.D",
          "avatar": "\ud83e\udded",
          "domain": "Postgraduate Mentorship Matching, Dissertation Defense & Faculty Placement",
          "invariant_focus": "Mentoring future Christian scholars into tenure-track and seminary faculty posts.",
          "deliberation_stance": "Mentorship & Academic Flourishing",
          "bio": "Mentors doctoral fellows through dissertation research and academic guild networking."
        },
        {
          "seat_id": "scholars-grants",
          "title": "Grant Application & Disbursement Architect",
          "persona_name": "Hannah Abbott (Agent Scholars-Grant)",
          "avatar": "\u26a1",
          "domain": "Automated Stripe Transfer & Wire Disbursement API, Grant Progress Milestones",
          "invariant_focus": "Instant verification of enrolled credit hours before scholarship tranche release.",
          "deliberation_stance": "Transparent Milestones & Fast Disbursement",
          "bio": "Engineers automated milestone verification for grant releases with complete cryptographic receipts."
        }
      ],
      "recent_reviews": [
        {
          "id": "SCHOLARS-REV-016",
          "title": "Endowment Grant Application Engine & Blind Peer Review",
          "date": "2026-10-16",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "SCHOLARS-REV-015",
          "title": "Monograph Open-Access Global Reader & PDF Annotation",
          "date": "2026-10-08",
          "verdict": "RATIFIED (5/5 Unanimous)"
        },
        {
          "id": "SCHOLARS-REV-014",
          "title": "Donor Gift Covenant Tracking & Restricted Fund Isolation",
          "date": "2026-09-29",
          "verdict": "RATIFIED (5/5 Unanimous)"
        }
      ]
    }
  ],
  "reconciliations": [
    {
      "date": "2026-10-17 16:13:51 UTC",
      "product": "ChurchCore LMS",
      "field": "latest_changes",
      "prior_value": "Merge pull request #90 from ricardojjulia/feat/sync-control-plane-and-telemetry (28eafe2)",
      "reconciled_value": "Merge pull request #91 from ricardojjulia/chore/sync-council-directives-enforcement (bd450a1)",
      "evidence": "`GIT_COMMIT_PROOF`: Verified git commit exists in repo: 'bd450a1 Merge pull request #91 from ricardojjulia/chore/sync-council-directives-enforcement'"
    },
    {
      "date": "2026-10-17 16:13:51 UTC",
      "product": "ChurchCore LMS",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "69",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 69 documented council review markdown records"
    },
    {
      "date": "2026-10-17 16:13:59 UTC",
      "product": "ChurchCore ChMS",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "188",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 188 documented council review markdown records"
    },
    {
      "date": "2026-10-17 16:14:00 UTC",
      "product": "ChurchCore Academy",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "57",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 57 documented council review markdown records"
    },
    {
      "date": "2026-10-17 16:14:00 UTC",
      "product": "ChurchCore Orthos",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "16",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 16 documented council review markdown records"
    },
    {
      "date": "2026-10-17 16:14:01 UTC",
      "product": "FaithFull Scholars",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "66",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 66 documented council review markdown records"
    },
    {
      "date": "2026-10-17 17:32:16 UTC",
      "product": "ChurchCore-Business",
      "field": "latest_changes",
      "prior_value": "fix: R1d Council Review 57 backend fixes (exact household-scoped erasure, R2-R8) (879fe2e)",
      "reconciled_value": "docs: overhaul root README and ARCHITECTURE with visual galleries, Mermaid diagrams, and live fleet matrix (6c62168)",
      "evidence": "`GIT_COMMIT_PROOF`: Verified git commit exists in repo: '6c62168 docs: overhaul root README and ARCHITECTURE with visual galleries, Mermaid diagrams, and live fleet matrix'"
    },
    {
      "date": "2026-10-17 17:32:16 UTC",
      "product": "ChurchCore-Business",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "4",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 4 documented council review markdown records"
    },
    {
      "date": "2026-10-18 03:55:00 UTC",
      "product": "ChurchCore ChMS",
      "field": "council_governing_state.documented_reviews_count",
      "prior_value": "unindexed",
      "reconciled_value": "190",
      "evidence": "`COUNCIL_REVIEW_PROOF`: Verified 190 documented council review markdown records"
    },
    {
      "date": "2026-10-18 03:55:00 UTC",
      "product": "ChurchCore ChMS",
      "field": "feature_completion",
      "prior_value": "Pending Implementation",
      "reconciled_value": "Feature 1: Finalize R1d Data-Rights Erasure Approval Queue Complete",
      "evidence": "`FEATURE_COMPLETION_PROOF`: Verified feature completion proofs: Commit: 2d76314 docs: close out R1d, CP1 and CP1b; plan, changelog and memory up to date (#208)"
    },
    {
      "date": "2026-10-18 03:55:00 UTC",
      "product": "ChurchCore ChMS",
      "field": "feature_completion",
      "prior_value": "Pending Implementation",
      "reconciled_value": "Feature 2: Vercel Edge Cron Automation (shepherd-ai & scheduled comms) Complete",
      "evidence": "`FEATURE_COMPLETION_PROOF`: Verified feature completion proofs: Commit: 95a8483 test+fix: T1a \u2014 giving/finance/comms untested exports at zero; finance writes surface database refusals; M3 met (#193)"
    },
    {
      "date": "2026-10-18 22:18:33 UTC",
      "product": "ChurchCore Care",
      "field": "feature_completion",
      "prior_value": "pending",
      "reconciled_value": "95",
      "evidence": "`FEATURE_COMPLETION_PROOF`: Verified feature completion proofs: Commit: ce8b53a feat: redesign scheduler worker daemons for Vercel Serverless Cron execution"
    },
    {
      "date": "2026-10-19 20:52:00 UTC",
      "product": "ChurchCore Academy",
      "field": "implementation_plan.waiting_cards",
      "prior_value": "Awaiting binding of Vercel production credentials to achieve 100% online status.",
      "reconciled_value": "Production Vercel Cloud Deployment & Domain Linking Complete (dpl_EgByH5cYyT2mEAvuXyXWWxLGU4CC)",
      "evidence": "`VERCEL_CLI_PROOF`: Verified deployment Ready, canonical domains linked (churchcoreacademy.io, www.churchcoreacademy.io, church-core-academy.vercel.app)"
    }
  ],
  "commercial": {
    "monthly_fleet_opex_usd": 240,
    "hosting_breakdown": {
      "vercel_pro_fleet": 120,
      "supabase_pro_compute": 100,
      "cloudflare_and_edge_crons": 20
    },
    "annual_run_rate_target_usd": 1250000,
    "active_pilots": [
      {
        "name": "Colegio Biblos K-12 Pilot",
        "product": "ChurchCore Academy",
        "seats": 350,
        "status": "Charter Approved",
        "est_arr": 18000
      },
      {
        "name": "AETH Hispanic Seminary Network",
        "product": "ChurchCore LMS",
        "seats": 1200,
        "status": "Accreditation Engine",
        "est_arr": 45000
      },
      {
        "name": "Regional Pastoral Network Pilot",
        "product": "ChurchCore ChMS",
        "churches": 24,
        "status": "Giving Pipeline",
        "est_arr": 32000
      },
      {
        "name": "FaithCounseling Christian Practices",
        "product": "ChurchCore Care",
        "clinicians": 15,
        "status": "Live Production",
        "est_arr": 22500
      }
    ],
    "fintech_take_rate": {
      "card_processing": "2.60% + $0.30",
      "ach_giving": "0.85% (capped at $7.50)",
      "annual_giving_volume_target": "$12,000,000"
    }
  },
  "sunday_sla": {
    "sla_target_pct": "99.99%",
    "holy_hours": "Sundays 06:00 - 13:00 Local",
    "probe_status": "HEALTHY",
    "db_connection_pool_headroom": "92%",
    "stripe_webhook_listener": "ACTIVE",
    "backup_snapshot_recency": "3 hours ago (Automated Daily Snapshot Verified)",
    "synthetic_endpoints_monitored": [
      {
        "name": "ChMS Member Check-in",
        "url": "https://www.churchcore.io/api/health",
        "latency_ms": 42,
        "status": "GREEN"
      },
      {
        "name": "LMS Student Auth",
        "url": "https://www.churchcorelms.io/api/health",
        "latency_ms": 38,
        "status": "GREEN"
      },
      {
        "name": "Care EHR Portal",
        "url": "https://www.churchcorecare.io/health",
        "latency_ms": 55,
        "status": "GREEN"
      },
      {
        "name": "Scholars Monograph API",
        "url": "https://faith-full-scholars.vercel.app/api/health",
        "latency_ms": 48,
        "status": "GREEN"
      }
    ]
  },
  "tech_stack_mesh": [
    {
      "product": "ChurchCore ChMS",
      "framework": "Next.js 15.2",
      "node": "v22.x",
      "ts": "v5.6",
      "rls": "100% Enforced",
      "pg_extensions": "pg_cron, uuid-ossp",
      "drift": "Synchronized"
    },
    {
      "product": "ChurchCore LMS",
      "framework": "Next.js 15.3",
      "node": "v22.x",
      "ts": "v5.6",
      "rls": "100% Enforced",
      "pg_extensions": "pg_net, pgcrypto",
      "drift": "Synchronized"
    },
    {
      "product": "ChurchCore Academy",
      "framework": "Next.js 15.1",
      "node": "v20.x",
      "ts": "v5.5",
      "rls": "100% Enforced",
      "pg_extensions": "uuid-ossp",
      "drift": "Upgrade to Node 22 planned"
    },
    {
      "product": "ChurchCore Care",
      "framework": "React 18 / Express",
      "node": "v20.x",
      "ts": "v5.4",
      "rls": "100% Enforced",
      "pg_extensions": "pgcrypto, uuid-ossp",
      "drift": "Next.js migration planned"
    },
    {
      "product": "ChurchCore Orthos",
      "framework": "Next.js 15.0",
      "node": "v22.x",
      "ts": "v5.6",
      "rls": "100% Enforced",
      "pg_extensions": "uuid-ossp",
      "drift": "Synchronized"
    },
    {
      "product": "FaithFull Scholars",
      "framework": "Next.js 15.2",
      "node": "v22.x",
      "ts": "v5.6",
      "rls": "100% Enforced",
      "pg_extensions": "pgvector, pgcrypto",
      "drift": "Synchronized"
    }
  ],
  "presos": [
    {
      "id": "platform",
      "name": "ChurchCore Sovereign Platform",
      "short_name": "Platform",
      "badge": "Ecosystem Master",
      "icon": "\ud83c\udf10",
      "tagline": "The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care",
      "buyer_personas": [
        "Denominational Bishop / General Superintendent",
        "Executive Pastor / COO of Multi-Site Church",
        "Christian Foundation / Institutional Investor",
        "Council of Churches Executive Board"
      ],
      "displacement_targets": "Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash",
      "live_domain": "https://www.churchcore.io",
      "scale_metrics": "517 Database Tables \u2022 423 Next.js Routes \u2022 6 Sovereign Pillars",
      "screenshot": "screenshots/fleet_tab_top_view.png",
      "constitutional_moat": "Constitution Section III: Zero Cross-Application Data Propagation \u2022 100% PostgreSQL RLS Silos",
      "pricing_headline": "$199\u2013$499/mo Local Church \u2022 $4.5k\u2013$25k/yr Academy \u2022 $50k+ Denomination",
      "version": "v1.0.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "ChurchCore Sovereign Platform: The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 517 Database Tables \u2022 423 Next.js Routes \u2022 6 Sovereign Pillars \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Denominational Bishop / General Superintendent, Executive Pastor / COO of Multi-Site Church",
            "Strategic Replacement: Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash",
            "Production Gate: \ud83d\udfe2 Active in Production"
          ],
          "visual_asset": "screenshots/fleet_tab_top_view.png",
          "speaker_notes": "Introduce ChurchCore Sovereign Platform. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: ChurchCore Sovereign Platform Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 517 Database Tables \u2022 423 Next.js Routes \u2022 6 Sovereign Pillars",
          "key_takeaways": [
            "Constitutional Protection: Constitution Section III: Zero Cross-Application Data Propagation \u2022 100% PostgreSQL RLS Silos.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://www.churchcore.io.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/fleet_tab_top_view.png",
          "speaker_notes": "Showcase the actual live application at https://www.churchcore.io. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (v1.0.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: Continuous architectural refinement",
            "Ecosystem Hardening: 100% Row-Level Security verification",
            "Reliability Proof: Automated CI/CD validation and zero-downtime database migrations."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy ChurchCore Sovereign Platform",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $199\u2013$499/mo Local Church \u2022 $4.5k\u2013$25k/yr Academy \u2022 $50k+ Denomination",
          "key_takeaways": [
            "Explore Live Production Environment: https://www.churchcore.io",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for ChurchCore Sovereign Platform.\n</system>\n\n<context>\nProduct: ChurchCore Sovereign Platform (Platform)\nDomain Category: Ecosystem Master\nTagline: The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care\nScale & Footprint: 517 Database Tables \u2022 423 Next.js Routes \u2022 6 Sovereign Pillars\nTarget Buyer Personas: Denominational Bishop / General Superintendent, Executive Pastor / COO of Multi-Site Church, Christian Foundation / Institutional Investor, Council of Churches Executive Board\nCompetitive Replacement Targets: Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash\nLive Production URL: https://www.churchcore.io\nConstitutional Invariant: Constitution Section III: Zero Cross-Application Data Propagation \u2022 100% PostgreSQL RLS Silos\nCommercial Pricing: $199\u2013$499/mo Local Church \u2022 $4.5k\u2013$25k/yr Academy \u2022 $50k+ Denomination\n\nRecent Engineering Delivery & Milestones:\n- Continuous verified production releases\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **ChurchCore Sovereign Platform**.\n\n**Key Context:**\n- Product: ChurchCore Sovereign Platform (The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care)\n- Scale: 517 Database Tables \u2022 423 Next.js Routes \u2022 6 Sovereign Pillars\n- Replaces: Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash\n- Core Value: Constitution Section III: Zero Cross-Application Data Propagation \u2022 100% PostgreSQL RLS Silos\n- Live Site: https://www.churchcore.io\n- Pricing: $199\u2013$499/mo Local Church \u2022 $4.5k\u2013$25k/yr Academy \u2022 $50k+ Denomination\n- Latest Features: Active Next.js Vercel Production Build\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Denominational Bishop / General Superintendent requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: ChurchCore Sovereign Platform \u2014 Executive Presentation\nSubtitle: The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- ChurchCore Sovereign Platform: The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care\n- Live URL: https://www.churchcore.io\n- Scale: 517 Database Tables \u2022 423 Next.js Routes \u2022 6 Sovereign Pillars\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (Constitution Section III: Zero Cross-Application Data Propagation \u2022 100% PostgreSQL RLS Silos)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- Production-ready release\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $199\u2013$499/mo Local Church \u2022 $4.5k\u2013$25k/yr Academy \u2022 $50k+ Denomination\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://www.churchcore.io",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    },
    {
      "id": "churchcore-chms",
      "name": "ChurchCore ChMS",
      "short_name": "ChMS",
      "badge": "Core ChMS & Finance",
      "icon": "\ud83c\udfdb\ufe0f",
      "tagline": "Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting",
      "buyer_personas": [
        "Senior Pastor / Lead Pastor",
        "Executive Pastor / Business Administrator",
        "Children's Ministry Director",
        "Church Treasurer / Stewardship Committee"
      ],
      "displacement_targets": "Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly",
      "live_domain": "https://www.churchcore.io",
      "scale_metrics": "133 Relational Tables \u2022 121 Application Routes \u2022 v3.5.0",
      "screenshot": "screenshots/fleet_grid_overview.png",
      "constitutional_moat": "Financial Double-Entry Ledger with Fund Accounting Invariants & Secure Child Pickup PINs",
      "pricing_headline": "$49\u2013$749/mo + 1% Transparent Giving Interchange",
      "version": "0.1.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "ChurchCore ChMS: Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 133 Relational Tables \u2022 121 Application Routes \u2022 v3.5.0 \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Senior Pastor / Lead Pastor, Executive Pastor / Business Administrator",
            "Strategic Replacement: Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly",
            "Production Gate: \ud83d\udfe1 Enterprise Staging Pilot"
          ],
          "visual_asset": "screenshots/fleet_grid_overview.png",
          "speaker_notes": "Introduce ChurchCore ChMS. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: ChurchCore ChMS Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 133 Relational Tables \u2022 121 Application Routes \u2022 v3.5.0",
          "key_takeaways": [
            "Constitutional Protection: Financial Double-Entry Ledger with Fund Accounting Invariants & Secure Child Pickup PINs.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://www.churchcore.io.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/fleet_grid_overview.png",
          "speaker_notes": "Showcase the actual live application at https://www.churchcore.io. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (0.1.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: feat(control-plane): sync Orthos v0.18.2 telemetry (100% Phase 1 MVP, pilot_ready) and dynamic local discovery (bdb2842)",
            "Ecosystem Hardening: feat(ci): implement autonomous Council challenge review and auto-merge workflow (8ede0bf)",
            "Reliability Proof: Automated CI/CD validation and zero-downtime database migrations."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy ChurchCore ChMS",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $49\u2013$749/mo + 1% Transparent Giving Interchange",
          "key_takeaways": [
            "Explore Live Production Environment: https://www.churchcore.io",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for ChurchCore ChMS.\n</system>\n\n<context>\nProduct: ChurchCore ChMS (ChMS)\nDomain Category: Core ChMS & Finance\nTagline: Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting\nScale & Footprint: 133 Relational Tables \u2022 121 Application Routes \u2022 v3.5.0\nTarget Buyer Personas: Senior Pastor / Lead Pastor, Executive Pastor / Business Administrator, Children's Ministry Director, Church Treasurer / Stewardship Committee\nCompetitive Replacement Targets: Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly\nLive Production URL: https://www.churchcore.io\nConstitutional Invariant: Financial Double-Entry Ledger with Fund Accounting Invariants & Secure Child Pickup PINs\nCommercial Pricing: $49\u2013$749/mo + 1% Transparent Giving Interchange\n\nRecent Engineering Delivery & Milestones:\n- feat(control-plane): sync Orthos v0.18.2 telemetry (100% Phase 1 MVP, pilot_ready) and dynamic local discovery (bdb2842)\n- feat(ci): implement autonomous Council challenge review and auto-merge workflow (8ede0bf)\n- feat(dashboard): integrate interactive Python Scripts Catalog into Mission Control UI (e2ddbde)\n- fix(dashboard): sort 100% complete products to end of priority queue as testing gate champions (4fa0d73)\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **ChurchCore ChMS**.\n\n**Key Context:**\n- Product: ChurchCore ChMS (Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting)\n- Scale: 133 Relational Tables \u2022 121 Application Routes \u2022 v3.5.0\n- Replaces: Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly\n- Core Value: Financial Double-Entry Ledger with Fund Accounting Invariants & Secure Child Pickup PINs\n- Live Site: https://www.churchcore.io\n- Pricing: $49\u2013$749/mo + 1% Transparent Giving Interchange\n- Latest Features: feat(control-plane): sync Orthos v0.18.2 telemetry (100% Phase 1 MVP, pilot_ready) and dynamic local discovery (bdb2842), feat(ci): implement autonomous Council challenge review and auto-merge workflow (8ede0bf), feat(dashboard): integrate interactive Python Scripts Catalog into Mission Control UI (e2ddbde)\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Senior Pastor / Lead Pastor requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: ChurchCore ChMS \u2014 Executive Presentation\nSubtitle: Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- ChurchCore ChMS: Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting\n- Live URL: https://www.churchcore.io\n- Scale: 133 Relational Tables \u2022 121 Application Routes \u2022 v3.5.0\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (Financial Double-Entry Ledger with Fund Accounting Invariants & Secure Child Pickup PINs)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- feat(control-plane): sync Orthos v0.18.2 telemetry (100% Phase 1 MVP, pilot_ready) and dynamic local discovery (bdb2842)\n- feat(ci): implement autonomous Council challenge review and auto-merge workflow (8ede0bf)\n- feat(dashboard): integrate interactive Python Scripts Catalog into Mission Control UI (e2ddbde)\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $49\u2013$749/mo + 1% Transparent Giving Interchange\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://www.churchcore.io",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    },
    {
      "id": "churchcore-lms",
      "name": "ChurchCore LMS",
      "short_name": "LMS",
      "badge": "Discipleship & PWA",
      "icon": "\ud83c\udf93",
      "tagline": "Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA",
      "buyer_personas": [
        "Discipleship Pastor / Christian Education Director",
        "Bible Institute Dean / Seminary Extension Director",
        "Small Groups Coordinator",
        "Youth & Leadership Training Director"
      ],
      "displacement_targets": "Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi",
      "live_domain": "https://www.churchcorelms.io",
      "scale_metrics": "72 Relational Tables \u2022 85 Application Routes \u2022 v0.47.0",
      "screenshot": "screenshots/council_chambers_deliberation.png",
      "constitutional_moat": "Offline IndexedDB PWA with Trinity SpeedGrader, Rubrics & Dual-Tier Council Curriculum Governance",
      "pricing_headline": "$79\u2013$999/mo (Unlimited Church Discipleship)",
      "version": "0.47.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "ChurchCore LMS: Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 72 Relational Tables \u2022 85 Application Routes \u2022 v0.47.0 \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Discipleship Pastor / Christian Education Director, Bible Institute Dean / Seminary Extension Director",
            "Strategic Replacement: Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi",
            "Production Gate: \ud83d\udfe2 Active in Production"
          ],
          "visual_asset": "screenshots/council_chambers_deliberation.png",
          "speaker_notes": "Introduce ChurchCore LMS. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: ChurchCore LMS Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 72 Relational Tables \u2022 85 Application Routes \u2022 v0.47.0",
          "key_takeaways": [
            "Constitutional Protection: Offline IndexedDB PWA with Trinity SpeedGrader, Rubrics & Dual-Tier Council Curriculum Governance.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://www.churchcorelms.io.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/council_chambers_deliberation.png",
          "speaker_notes": "Showcase the actual live application at https://www.churchcorelms.io. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (0.47.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: chore(telemetry): automated morning edge telemetry sync [skip ci] (0190e54)",
            "Ecosystem Hardening: chore(telemetry): automated morning edge telemetry sync [skip ci] (5b342e6)",
            "Reliability Proof: [2026-10-16] Converted server action exports to explicit async functions in compliance with Turbopack specifications (PR #89)."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy ChurchCore LMS",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $79\u2013$999/mo (Unlimited Church Discipleship)",
          "key_takeaways": [
            "Explore Live Production Environment: https://www.churchcorelms.io",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for ChurchCore LMS.\n</system>\n\n<context>\nProduct: ChurchCore LMS (LMS)\nDomain Category: Discipleship & PWA\nTagline: Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA\nScale & Footprint: 72 Relational Tables \u2022 85 Application Routes \u2022 v0.47.0\nTarget Buyer Personas: Discipleship Pastor / Christian Education Director, Bible Institute Dean / Seminary Extension Director, Small Groups Coordinator, Youth & Leadership Training Director\nCompetitive Replacement Targets: Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi\nLive Production URL: https://www.churchcorelms.io\nConstitutional Invariant: Offline IndexedDB PWA with Trinity SpeedGrader, Rubrics & Dual-Tier Council Curriculum Governance\nCommercial Pricing: $79\u2013$999/mo (Unlimited Church Discipleship)\n\nRecent Engineering Delivery & Milestones:\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (0190e54)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (5b342e6)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (60f024e)\n- feat(telemetry): mandate post-test telemetry sync (COUNCIL-2026-008) (4de0a15)\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **ChurchCore LMS**.\n\n**Key Context:**\n- Product: ChurchCore LMS (Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA)\n- Scale: 72 Relational Tables \u2022 85 Application Routes \u2022 v0.47.0\n- Replaces: Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi\n- Core Value: Offline IndexedDB PWA with Trinity SpeedGrader, Rubrics & Dual-Tier Council Curriculum Governance\n- Live Site: https://www.churchcorelms.io\n- Pricing: $79\u2013$999/mo (Unlimited Church Discipleship)\n- Latest Features: chore(telemetry): automated morning edge telemetry sync [skip ci] (0190e54), chore(telemetry): automated morning edge telemetry sync [skip ci] (5b342e6), chore(telemetry): automated morning edge telemetry sync [skip ci] (60f024e)\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Discipleship Pastor / Christian Education Director requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: ChurchCore LMS \u2014 Executive Presentation\nSubtitle: Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- ChurchCore LMS: Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA\n- Live URL: https://www.churchcorelms.io\n- Scale: 72 Relational Tables \u2022 85 Application Routes \u2022 v0.47.0\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (Offline IndexedDB PWA with Trinity SpeedGrader, Rubrics & Dual-Tier Council Curriculum Governance)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (0190e54)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (5b342e6)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (60f024e)\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $79\u2013$999/mo (Unlimited Church Discipleship)\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://www.churchcorelms.io",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    },
    {
      "id": "churchcore-academy",
      "name": "ChurchCore Academy",
      "short_name": "Academy",
      "badge": "K-12 & Higher-Ed SIS",
      "icon": "\ud83c\udfeb",
      "tagline": "OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies",
      "buyer_personas": [
        "Head of School / Academy Principal",
        "Academic Dean / Registrar",
        "Admissions Director",
        "School Board Chairman"
      ],
      "displacement_targets": "Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool",
      "live_domain": "https://www.churchcoreacademy.io",
      "scale_metrics": "152 Relational Tables \u2022 105 Application Routes \u2022 v0.10.0",
      "screenshot": "screenshots/implementation_plans_directionality.png",
      "constitutional_moat": "OneRoster 1.2 Compliant Gradebooks, Colegio Biblos Pilot Schema & Admissions RLS",
      "pricing_headline": "$2,400\u2013$25,000/yr (Based on Student Enrollment)",
      "version": "0.10.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "ChurchCore Academy: OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 152 Relational Tables \u2022 105 Application Routes \u2022 v0.10.0 \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Head of School / Academy Principal, Academic Dean / Registrar",
            "Strategic Replacement: Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool",
            "Production Gate: \ud83d\udfe1 Enterprise Staging Pilot"
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "Introduce ChurchCore Academy. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: ChurchCore Academy Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 152 Relational Tables \u2022 105 Application Routes \u2022 v0.10.0",
          "key_takeaways": [
            "Constitutional Protection: OneRoster 1.2 Compliant Gradebooks, Colegio Biblos Pilot Schema & Admissions RLS.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://www.churchcoreacademy.io.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "Showcase the actual live application at https://www.churchcoreacademy.io. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (0.10.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: Record Colegio Biblos local pilot preparation (#248) (bed47c2)",
            "Ecosystem Hardening: Approve Colegio Biblos local pilot charter (#247) (f44c6b7)",
            "Reliability Proof: Automated CI/CD validation and zero-downtime database migrations."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy ChurchCore Academy",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $2,400\u2013$25,000/yr (Based on Student Enrollment)",
          "key_takeaways": [
            "Explore Live Production Environment: https://www.churchcoreacademy.io",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for ChurchCore Academy.\n</system>\n\n<context>\nProduct: ChurchCore Academy (Academy)\nDomain Category: K-12 & Higher-Ed SIS\nTagline: OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies\nScale & Footprint: 152 Relational Tables \u2022 105 Application Routes \u2022 v0.10.0\nTarget Buyer Personas: Head of School / Academy Principal, Academic Dean / Registrar, Admissions Director, School Board Chairman\nCompetitive Replacement Targets: Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool\nLive Production URL: https://www.churchcoreacademy.io\nConstitutional Invariant: OneRoster 1.2 Compliant Gradebooks, Colegio Biblos Pilot Schema & Admissions RLS\nCommercial Pricing: $2,400\u2013$25,000/yr (Based on Student Enrollment)\n\nRecent Engineering Delivery & Milestones:\n- Record Colegio Biblos local pilot preparation (#248) (bed47c2)\n- Approve Colegio Biblos local pilot charter (#247) (f44c6b7)\n- Record technical baseline closeout (#246) (4bfe20b)\n- Merge pull request #245 from ricardojjulia/docs/pilot-to-production-completion-plan (dca2d25)\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **ChurchCore Academy**.\n\n**Key Context:**\n- Product: ChurchCore Academy (OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies)\n- Scale: 152 Relational Tables \u2022 105 Application Routes \u2022 v0.10.0\n- Replaces: Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool\n- Core Value: OneRoster 1.2 Compliant Gradebooks, Colegio Biblos Pilot Schema & Admissions RLS\n- Live Site: https://www.churchcoreacademy.io\n- Pricing: $2,400\u2013$25,000/yr (Based on Student Enrollment)\n- Latest Features: Record Colegio Biblos local pilot preparation (#248) (bed47c2), Approve Colegio Biblos local pilot charter (#247) (f44c6b7), Record technical baseline closeout (#246) (4bfe20b)\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Head of School / Academy Principal requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: ChurchCore Academy \u2014 Executive Presentation\nSubtitle: OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- ChurchCore Academy: OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies\n- Live URL: https://www.churchcoreacademy.io\n- Scale: 152 Relational Tables \u2022 105 Application Routes \u2022 v0.10.0\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (OneRoster 1.2 Compliant Gradebooks, Colegio Biblos Pilot Schema & Admissions RLS)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- Record Colegio Biblos local pilot preparation (#248) (bed47c2)\n- Approve Colegio Biblos local pilot charter (#247) (f44c6b7)\n- Record technical baseline closeout (#246) (4bfe20b)\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $2,400\u2013$25,000/yr (Based on Student Enrollment)\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://www.churchcoreacademy.io",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    },
    {
      "id": "churchcore-care",
      "name": "ChurchCore Care",
      "short_name": "Care",
      "badge": "Pastoral & Clinical EHR",
      "icon": "\ud83c\udf3f",
      "tagline": "Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth",
      "buyer_personas": [
        "Clinical Director / Licensed Marriage & Family Therapist",
        "Pastoral Care Pastor / Benevolence Director",
        "Christian Counseling Practice Owner",
        "Hospital Chaplaincy Coordinator"
      ],
      "displacement_targets": "Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory",
      "live_domain": "https://www.churchcorecare.io",
      "scale_metrics": "84 Relational Tables \u2022 Deny-All Row-Level Security \u2022 v7.0.0",
      "screenshot": "screenshots/sunday_sla_pulse.png",
      "constitutional_moat": "Absolute Cryptographic Isolation: Church membership notes NEVER mix with confidential clinical therapy charts",
      "pricing_headline": "$59\u2013$399/mo per practitioner",
      "version": "7.0.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "ChurchCore Care: Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 84 Relational Tables \u2022 Deny-All Row-Level Security \u2022 v7.0.0 \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Clinical Director / Licensed Marriage & Family Therapist, Pastoral Care Pastor / Benevolence Director",
            "Strategic Replacement: Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory",
            "Production Gate: \ud83d\udfe2 Active in Production"
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Introduce ChurchCore Care. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: ChurchCore Care Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 84 Relational Tables \u2022 Deny-All Row-Level Security \u2022 v7.0.0",
          "key_takeaways": [
            "Constitutional Protection: Absolute Cryptographic Isolation: Church membership notes NEVER mix with confidential clinical therapy charts.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://www.churchcorecare.io.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Showcase the actual live application at https://www.churchcorecare.io. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (7.0.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: feat(ai): wire AI functions to OpenRouter with dynamic model evaluation (4c03636)",
            "Ecosystem Hardening: chore(telemetry): update next_steps to serverless cron verification (5bc8769)",
            "Reliability Proof: [2026-10-14] Unified package-lock.json with explicit override resolutions in PR #139."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy ChurchCore Care",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $59\u2013$399/mo per practitioner",
          "key_takeaways": [
            "Explore Live Production Environment: https://www.churchcorecare.io",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for ChurchCore Care.\n</system>\n\n<context>\nProduct: ChurchCore Care (Care)\nDomain Category: Pastoral & Clinical EHR\nTagline: Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth\nScale & Footprint: 84 Relational Tables \u2022 Deny-All Row-Level Security \u2022 v7.0.0\nTarget Buyer Personas: Clinical Director / Licensed Marriage & Family Therapist, Pastoral Care Pastor / Benevolence Director, Christian Counseling Practice Owner, Hospital Chaplaincy Coordinator\nCompetitive Replacement Targets: Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory\nLive Production URL: https://www.churchcorecare.io\nConstitutional Invariant: Absolute Cryptographic Isolation: Church membership notes NEVER mix with confidential clinical therapy charts\nCommercial Pricing: $59\u2013$399/mo per practitioner\n\nRecent Engineering Delivery & Milestones:\n- feat(ai): wire AI functions to OpenRouter with dynamic model evaluation (4c03636)\n- chore(telemetry): update next_steps to serverless cron verification (5bc8769)\n- chore(governance): synchronize edge telemetry and council directives after Docker elimination (5f5b9eb)\n- feat(infra): permanently eliminate all Docker dependencies and definitions in favor of Vercel serverless architecture (cb260fb)\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **ChurchCore Care**.\n\n**Key Context:**\n- Product: ChurchCore Care (Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth)\n- Scale: 84 Relational Tables \u2022 Deny-All Row-Level Security \u2022 v7.0.0\n- Replaces: Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory\n- Core Value: Absolute Cryptographic Isolation: Church membership notes NEVER mix with confidential clinical therapy charts\n- Live Site: https://www.churchcorecare.io\n- Pricing: $59\u2013$399/mo per practitioner\n- Latest Features: feat(ai): wire AI functions to OpenRouter with dynamic model evaluation (4c03636), chore(telemetry): update next_steps to serverless cron verification (5bc8769), chore(governance): synchronize edge telemetry and council directives after Docker elimination (5f5b9eb)\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Clinical Director / Licensed Marriage & Family Therapist requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: ChurchCore Care \u2014 Executive Presentation\nSubtitle: Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- ChurchCore Care: Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth\n- Live URL: https://www.churchcorecare.io\n- Scale: 84 Relational Tables \u2022 Deny-All Row-Level Security \u2022 v7.0.0\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (Absolute Cryptographic Isolation: Church membership notes NEVER mix with confidential clinical therapy charts)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- feat(ai): wire AI functions to OpenRouter with dynamic model evaluation (4c03636)\n- chore(telemetry): update next_steps to serverless cron verification (5bc8769)\n- chore(governance): synchronize edge telemetry and council directives after Docker elimination (5f5b9eb)\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $59\u2013$399/mo per practitioner\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://www.churchcorecare.io",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    },
    {
      "id": "churchcore-orthos",
      "name": "ChurchCore Orthos",
      "short_name": "Orthos",
      "badge": "Governance & AI Audit",
      "icon": "\u2696\ufe0f",
      "tagline": "Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner",
      "buyer_personas": [
        "Elder Board Chairman / Church Council President",
        "Denominational Bishop / Regional Presbyter",
        "Denominational Legal Counsel / Risk Manager",
        "Church Insurance Underwriter"
      ],
      "displacement_targets": "Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits",
      "live_domain": "https://church-core-orthos.vercel.app",
      "scale_metrics": "28 Relational Tables \u2022 30 Application Routes \u2022 Gemini AI \u2022 v0.18.0",
      "screenshot": "screenshots/evidence_reconciliation_ledger.png",
      "constitutional_moat": "Omni-Council Compliance Engine: Real-time checks for background check currency, double-entry fund balance, and RLS integrity",
      "pricing_headline": "$1,200\u2013$50,000/yr (Parish to Diocesan Licensing)",
      "version": "0.18.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "ChurchCore Orthos: Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 28 Relational Tables \u2022 30 Application Routes \u2022 Gemini AI \u2022 v0.18.0 \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Elder Board Chairman / Church Council President, Denominational Bishop / Regional Presbyter",
            "Strategic Replacement: Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits",
            "Production Gate: \ud83d\udfe2 Active in Production"
          ],
          "visual_asset": "screenshots/evidence_reconciliation_ledger.png",
          "speaker_notes": "Introduce ChurchCore Orthos. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: ChurchCore Orthos Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 28 Relational Tables \u2022 30 Application Routes \u2022 Gemini AI \u2022 v0.18.0",
          "key_takeaways": [
            "Constitutional Protection: Omni-Council Compliance Engine: Real-time checks for background check currency, double-entry fund balance, and RLS integrity.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://church-core-orthos.vercel.app.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/evidence_reconciliation_ledger.png",
          "speaker_notes": "Showcase the actual live application at https://church-core-orthos.vercel.app. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (0.18.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: chore(telemetry): automated morning edge telemetry sync [skip ci] (23f8796)",
            "Ecosystem Hardening: chore(telemetry): automated morning edge telemetry sync [skip ci] (471c2e1)",
            "Reliability Proof: [2026-10-15] Configured explicit CSP allowlists in vercel.json for audit PDF preview rendering."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy ChurchCore Orthos",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $1,200\u2013$50,000/yr (Parish to Diocesan Licensing)",
          "key_takeaways": [
            "Explore Live Production Environment: https://church-core-orthos.vercel.app",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for ChurchCore Orthos.\n</system>\n\n<context>\nProduct: ChurchCore Orthos (Orthos)\nDomain Category: Governance & AI Audit\nTagline: Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner\nScale & Footprint: 28 Relational Tables \u2022 30 Application Routes \u2022 Gemini AI \u2022 v0.18.0\nTarget Buyer Personas: Elder Board Chairman / Church Council President, Denominational Bishop / Regional Presbyter, Denominational Legal Counsel / Risk Manager, Church Insurance Underwriter\nCompetitive Replacement Targets: Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits\nLive Production URL: https://church-core-orthos.vercel.app\nConstitutional Invariant: Omni-Council Compliance Engine: Real-time checks for background check currency, double-entry fund balance, and RLS integrity\nCommercial Pricing: $1,200\u2013$50,000/yr (Parish to Diocesan Licensing)\n\nRecent Engineering Delivery & Milestones:\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (23f8796)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (471c2e1)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (f7b2f1b)\n- Merge pull request #33 from ricardojjulia/chore/council-008-sync (940e8d9)\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **ChurchCore Orthos**.\n\n**Key Context:**\n- Product: ChurchCore Orthos (Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner)\n- Scale: 28 Relational Tables \u2022 30 Application Routes \u2022 Gemini AI \u2022 v0.18.0\n- Replaces: Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits\n- Core Value: Omni-Council Compliance Engine: Real-time checks for background check currency, double-entry fund balance, and RLS integrity\n- Live Site: https://church-core-orthos.vercel.app\n- Pricing: $1,200\u2013$50,000/yr (Parish to Diocesan Licensing)\n- Latest Features: chore(telemetry): automated morning edge telemetry sync [skip ci] (23f8796), chore(telemetry): automated morning edge telemetry sync [skip ci] (471c2e1), chore(telemetry): automated morning edge telemetry sync [skip ci] (f7b2f1b)\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Elder Board Chairman / Church Council President requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: ChurchCore Orthos \u2014 Executive Presentation\nSubtitle: Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- ChurchCore Orthos: Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner\n- Live URL: https://church-core-orthos.vercel.app\n- Scale: 28 Relational Tables \u2022 30 Application Routes \u2022 Gemini AI \u2022 v0.18.0\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (Omni-Council Compliance Engine: Real-time checks for background check currency, double-entry fund balance, and RLS integrity)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (23f8796)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (471c2e1)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (f7b2f1b)\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $1,200\u2013$50,000/yr (Parish to Diocesan Licensing)\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://church-core-orthos.vercel.app",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    },
    {
      "id": "faithfull-scholars",
      "name": "FaithFull Scholars",
      "short_name": "Scholars",
      "badge": "Theological Network",
      "icon": "\ud83d\udcd6",
      "tagline": "Theological Higher-Education Network, Confessional Search & Faculty Placement",
      "buyer_personas": [
        "Seminary President / Academic Provost",
        "Theological Faculty Search Committee Chair",
        "Theological Association Director (e.g. AETH, ATS)",
        "Doctoral Program Director"
      ],
      "displacement_targets": "Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering",
      "live_domain": "https://www.faithgrid.io",
      "scale_metrics": "48 Relational Tables \u2022 53 Application Routes \u2022 pgvector Semantic Search \u2022 v0.1.0",
      "screenshot": "screenshots/commercial_opex_margins.png",
      "constitutional_moat": "Confessional Credo Alignment & AI Semantic Vector Matching for Theological Specialties",
      "pricing_headline": "$2,500\u2013$15,000/yr per Institution",
      "version": "0.1.0",
      "last_synced": "2026-10-21 01:57:55 UTC",
      "slides": [
        {
          "slide_num": 1,
          "title": "FaithFull Scholars: Theological Higher-Education Network, Confessional Search & Faculty Placement",
          "type": "title_hero",
          "subtitle": "Live Production Architecture \u2022 48 Relational Tables \u2022 53 Application Routes \u2022 pgvector Semantic Search \u2022 v0.1.0 \u2022 October 21, 2026",
          "key_takeaways": [
            "Target Buyers: Seminary President / Academic Provost, Theological Faculty Search Committee Chair",
            "Strategic Replacement: Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering",
            "Production Gate: \ud83d\udfe2 Active in Production"
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Introduce FaithFull Scholars. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
          "slide_num": 2,
          "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
          "type": "problem_statement",
          "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
          "key_takeaways": [
            "Legacy incumbent bloat: Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering charge high per-seat or per-module surcharges.",
            "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
            "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
          ],
          "visual_asset": "screenshots/executive_dashboard_kpis.png",
          "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
          "slide_num": 3,
          "title": "The Solution: FaithFull Scholars Sovereign Architecture",
          "type": "architecture_solution",
          "subtitle": "Enterprise power built on 48 Relational Tables \u2022 53 Application Routes \u2022 pgvector Semantic Search \u2022 v0.1.0",
          "key_takeaways": [
            "Constitutional Protection: Confessional Credo Alignment & AI Semantic Vector Matching for Theological Specialties.",
            "Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at https://faith-full-scholars.vercel.app.",
            "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Showcase the actual live application at https://faith-full-scholars.vercel.app. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
          "slide_num": 4,
          "title": "Fresh Off the Press: Latest Engineering Milestones",
          "type": "live_telemetry_highlights",
          "subtitle": "Continuous High-Velocity Delivery (0.1.0 Live)",
          "key_takeaways": [
            "Latest Feature Delivered: chore(telemetry): automated morning edge telemetry sync [skip ci] (66c481c)",
            "Ecosystem Hardening: chore(telemetry): automated morning edge telemetry sync [skip ci] (2350532)",
            "Reliability Proof: [2026-10-16] Added challenges.cloudflare.com to vercel.json connect-src and script-src directives (PR #85)."
          ],
          "visual_asset": "screenshots/implementation_plans_directionality.png",
          "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
          "slide_num": 5,
          "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
          "type": "competitive_moat",
          "subtitle": "Why incumbents cannot copy FaithFull Scholars",
          "key_takeaways": [
            "Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
            "Constitution Section III: Sacred pastoral/clinical boundary that secular SaaS cannot ethically match.",
            "Bilingual & Global: Native Spanish/English i18n support built from the database up."
          ],
          "visual_asset": "screenshots/commercial_opex_margins.png",
          "speaker_notes": "Emphasize our commercial moat: superior unit economics, lower cost-to-serve, and the deep ecclesial advisory trust that legacy secular vendors lack."
        },
        {
          "slide_num": 6,
          "title": "Commercial Partnership & Immediate Next Steps",
          "type": "commercial_call_to_action",
          "subtitle": "Accessible Packaging: $2,500\u2013$15,000/yr per Institution",
          "key_takeaways": [
            "Explore Live Production Environment: https://faith-full-scholars.vercel.app",
            "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
            "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
          ],
          "visual_asset": "screenshots/sunday_sla_pulse.png",
          "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
      ],
      "prompts": {
        "claude": "<system>\nYou are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.\nGenerate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for FaithFull Scholars.\n</system>\n\n<context>\nProduct: FaithFull Scholars (Scholars)\nDomain Category: Theological Network\nTagline: Theological Higher-Education Network, Confessional Search & Faculty Placement\nScale & Footprint: 48 Relational Tables \u2022 53 Application Routes \u2022 pgvector Semantic Search \u2022 v0.1.0\nTarget Buyer Personas: Seminary President / Academic Provost, Theological Faculty Search Committee Chair, Theological Association Director (e.g. AETH, ATS), Doctoral Program Director\nCompetitive Replacement Targets: Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering\nLive Production URL: https://www.faithgrid.io\nConstitutional Invariant: Confessional Credo Alignment & AI Semantic Vector Matching for Theological Specialties\nCommercial Pricing: $2,500\u2013$15,000/yr per Institution\n\nRecent Engineering Delivery & Milestones:\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (66c481c)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (2350532)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (78189bc)\n- feat(telemetry): mandate post-test telemetry sync (COUNCIL-2026-008) (3d88457)\n</context>\n\n<instructions>\n1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).\n2. For each slide provide:\n   - Slide Title & Subtitle\n   - Key Strategic Bullet Points (maximum 3, crisp and punchy)\n   - Visual Layout Suggestion (diagram, KPI counter, UI screen)\n   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)\n3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.\n</instructions>",
        "chatgpt": "Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.\nCreate a high-converting, 6-slide executive pitch deck for **FaithFull Scholars**.\n\n**Key Context:**\n- Product: FaithFull Scholars (Theological Higher-Education Network, Confessional Search & Faculty Placement)\n- Scale: 48 Relational Tables \u2022 53 Application Routes \u2022 pgvector Semantic Search \u2022 v0.1.0\n- Replaces: Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering\n- Core Value: Confessional Credo Alignment & AI Semantic Vector Matching for Theological Specialties\n- Live Site: https://www.faithgrid.io\n- Pricing: $2,500\u2013$15,000/yr per Institution\n- Latest Features: chore(telemetry): automated morning edge telemetry sync [skip ci] (66c481c), chore(telemetry): automated morning edge telemetry sync [skip ci] (2350532), chore(telemetry): automated morning edge telemetry sync [skip ci] (78189bc)\n\n**Output Requirements:**\n1. Generate Slide 1 to Slide 6 with:\n   - Catchy Title\n   - 3 High-Impact Bullets\n   - Presenter Script\n2. Write a 1-page executive email summary pitch to send to a Seminary President / Academic Provost requesting a 20-minute live demonstration.",
        "prezi_gamma": "Title: FaithFull Scholars \u2014 Executive Presentation\nSubtitle: Theological Higher-Education Network, Confessional Search & Faculty Placement\nTheme: Sovereign Modern Tech \u2022 Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)\n\nSlide 1: Executive Overview\n- FaithFull Scholars: Theological Higher-Education Network, Confessional Search & Faculty Placement\n- Live URL: https://www.faithgrid.io\n- Scale: 48 Relational Tables \u2022 53 Application Routes \u2022 pgvector Semantic Search \u2022 v0.1.0\n\nSlide 2: The Ministry Crisis\n- The High Cost of Fragmented Software (Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering)\n- Data Leakage & Secular Exploitation Risks\n- Administrative Burnout: 15+ Hours Lost Weekly\n\nSlide 3: The Sovereign ChurchCore Solution\n- 100% Database Sovereignty (Confessional Credo Alignment & AI Semantic Vector Matching for Theological Specialties)\n- Built for Kingdom Longevity with Open Standards\n- Ultra-low Latency on Vercel Global Edge\n\nSlide 4: Verified Capabilities & Recent Milestones\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (66c481c)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (2350532)\n- chore(telemetry): automated morning edge telemetry sync [skip ci] (78189bc)\n- High-Performance Database Architecture\n\nSlide 5: Why We Win (The Moat)\n- 40-60% Savings Compared to Incumbents\n- Built-in Confessional & Safeguarding Standards\n- Native Bilingual Architecture (English & Spanish)\n\nSlide 6: Partnership & Onboarding\n- Transparent Pricing: $2,500\u2013$15,000/yr per Institution\n- Zero-Downtime White-Glove Data Migration\n- Request a Guided Walkthrough: https://www.faithgrid.io",
        "prompt_ai": "Prompt for Slide Backgrounds & Midjourney Visuals:\n1. Title Hero Slide:\n   \"An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9\"\n\n2. Architecture & Data Sovereignty Slide:\n   \"Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9\"\n\n3. Live Operations & Speed Slide:\n   \"Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9\"\n"
      }
    }
  ]
};
