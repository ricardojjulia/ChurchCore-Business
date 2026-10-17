window.CHURCHCORE_FLEET_DATA = {
  "generated_at": "2026-10-17T16:07:54.255446+00:00",
  "summary": {
    "total_products": 6,
    "online_in_production": 4,
    "average_readiness_score": 82,
    "average_completion_pct": 90,
    "sovereign_data_isolation": true,
    "total_tasks": 18,
    "done_tasks": 9
  },
  "products": [
    {
      "product_id": "churchcore-chms",
      "repo_name": "ChurchCore",
      "version": "3.5.0",
      "report_timestamp": "2026-10-17T15:59:18.227522+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://churchcore.vercel.app",
        "supabase_status": "connected",
        "supabase_project_ref": "prod-chms-db",
        "readiness_assessment": {
          "readiness_score_pct": 94,
          "blockers": [],
          "next_required_actions": [
            "Complete R1d data-rights erasure approval queue e2e verification",
            "Finalize crons for shepherd-ai and communications scheduled"
          ]
        }
      },
      "mvp_status": {
        "phase": "production",
        "completion_pct": 92,
        "latest_milestones": [
          "Council Review 56 (R1d) synthesis and agent reports approved",
          "R1d erasure approval screens (queue, member data-rights, e2e) merged",
          "Multi-campus volunteer scheduling and donor giving pipelines live"
        ]
      },
      "latest_changes": [
        "docs: Council Review 57 (R1d re-review) synthesis and agent reports (95433a3)",
        "fix: R1d frontend for Council Review 56 (finish/resend, i18n errors, recurring gifts, localized member page) (d7ad572)",
        "fix: R1d Council Review 56 backend fixes (R1-R9, widened erasure) (480559b)",
        "docs: Council Review 56 (R1d) synthesis and agent reports (56c054e)",
        "feat: R1d erasure approval screens (queue, member data-rights, e2e) (a22c36e)"
      ],
      "next_steps": [
        "Verify send erasure notice only after erasure succeeds in production",
        "Add Powered by ChurchCore trust badge to main footer"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 180,
        "session_date": "2026-10-17T15:59:18.227522+00:00",
        "session_operator": "Ricardo J. Julia",
        "summary_of_work": "Executed Council Review 56 synthesis; implemented R1d erasure approval screens and member data-rights lifecycle."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-17] Erasure notice was triggering before DB transaction confirmed in preview environment."
        ],
        "mitigations_applied": [
          "[2026-10-17] Refactored event emission to fire exclusively in post-commit callback (commit b38636f)."
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
      "_source_path": "/Users/rjulia/ChurchCore/docs/control-plane/telemetry.json",
      "_source_type": "local"
    },
    {
      "product_id": "churchcore-lms",
      "repo_name": "ChurchCore LMS",
      "version": "0.47.0",
      "report_timestamp": "2026-10-17T15:59:26.690567+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://church-core-lms.vercel.app",
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
        "completion_pct": 88,
        "latest_milestones": [
          "PR #89 merged: Turbopack use-server SSR build error resolved & auth layout polished",
          "PR #88 merged: Neutral pre-auth and dynamic branding with Powered by ChurchCore badge live",
          "Supabase pg_net extension enabled and release build 0.36.1 deployed"
        ]
      },
      "latest_changes": [
        "Merge pull request #90 from ricardojjulia/feat/sync-control-plane-and-telemetry (28eafe2)",
        "chore(control-plane): sync telemetry reporter and agent governance rules (c987b9c)",
        "Merge pull request #89 from ricardojjulia/feat/fix-turbopack-build-and-auth-layout (83933a2)",
        "fix(build): resolve Turbopack use-server sync export error and unmount sidebar on auth pages (29a9ca9)",
        "Merge pull request #88 from ricardojjulia/feat/neutral-preauth-and-dynamic-branding (fe412f0)"
      ],
      "next_steps": [
        "Test course completion webhook integration with local certification service",
        "Run full synthetic production test suite (npm run test:prod-synthetic)"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 30,
        "session_date": "2026-10-17T15:59:26.690567+00:00",
        "session_operator": "Ricardo Julia",
        "summary_of_work": "Automated Council Directives Enforcement"
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
          "COUNCIL-2026-004"
        ],
        "brand_house_compliant": true,
        "sovereign_db_isolation_verified": true
      },
      "_source_path": "/Users/rjulia/ChurchCore LMS/docs/control-plane/telemetry.json",
      "_source_type": "local"
    },
    {
      "product_id": "churchcore-academy",
      "repo_name": "ChurchCore-Academy",
      "version": "0.10.0",
      "report_timestamp": "2026-10-17T16:05:27.430761+00:00",
      "online_status": {
        "is_online": false,
        "vercel_status": "none",
        "vercel_url": "",
        "supabase_status": "local_only",
        "supabase_project_ref": "",
        "readiness_assessment": {
          "readiness_score_pct": 33,
          "score_basis": "One of three approved local Workstream C gates is complete: preparation passed; participant-browser login and the uncoached session remain.",
          "blockers": [
            "Participant login has not been verified from the actual Colegio Biblos browser or VM.",
            "The real uncoached Colegio Biblos pilot session has not occurred.",
            "Hosted deployment remains owner-deferred and is not authorized by this telemetry."
          ],
          "next_required_actions": [
            "Verify participant login from the approved local/private browser or VM.",
            "Run the chartered uncoached session and record sanitized evidence.",
            "Use observed pilot needs to select or exclude later integration-validation lanes."
          ]
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
        "mitigations_applied": []
      },
      "governance_compliance": {
        "council_decisions_acknowledged": [
          "COUNCIL-2026-001",
          "COUNCIL-2026-002",
          "COUNCIL-2026-003",
          "COUNCIL-2026-004"
        ],
        "brand_house_compliant": false,
        "sovereign_db_isolation_verified": false,
        "verification_note": "Acknowledgment is not implementation. Requirement-level status and evidence are recorded in docs/council/ACKNOWLEDGMENTS.md."
      },
      "_source_path": "/Users/rjulia/ChurchCore Academy/docs/control-plane/telemetry.json",
      "_source_type": "local"
    },
    {
      "product_id": "churchcore-care",
      "repo_name": "ChurchCore Care",
      "version": "7.0.0",
      "report_timestamp": "2026-10-17T15:59:22.677690+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://churchcore-care.vercel.app",
        "custom_domain": "https://www.churchcorecare.io",
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
        "fatal: your current branch 'feat/faithful-workflows-enhancements' does not have any commits yet"
      ],
      "next_steps": [
        "Complete translation worker container optimization",
        "Execute test:load:auth and test:load:intake under simulated 500 concurrent sessions"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 30,
        "session_date": "2026-10-17T15:59:22.677690+00:00",
        "session_operator": "Ricardo Julia",
        "summary_of_work": "Automated Council Directives Enforcement"
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
      "_source_path": "/Users/rjulia/ChurchCore Care/docs/control-plane/telemetry.json",
      "_source_type": "local"
    },
    {
      "product_id": "churchcore-orthos",
      "repo_name": "ChurchCore-Orthos",
      "version": "0.18.0",
      "report_timestamp": "2026-10-17T15:59:18.227522+00:00",
      "online_status": {
        "is_online": false,
        "vercel_status": "preview",
        "vercel_url": "https://churchcore-orthos.vercel.app",
        "supabase_status": "local_only",
        "supabase_project_ref": "pending-staging-link",
        "readiness_assessment": {
          "readiness_score_pct": 85,
          "blockers": [
            "Production Supabase project connection pending manual key provisioning",
            "Awaiting final verification of Omni-Council test suite"
          ],
          "next_required_actions": [
            "Run npm run test:omni-council across full compliance checklist",
            "Bind production Vercel environment variables to Supabase cloud instance",
            "Verify fund-accounting double-entry balance constraints"
          ]
        }
      },
      "mvp_status": {
        "phase": "beta",
        "completion_pct": 85,
        "latest_milestones": [
          "PR #25 merged: Departmental Ministry Governance & Maturity Engine (v0.18.0)",
          "PR #24 merged: Compensating controls module for small churches",
          "Audit trail immutability and financial safeguarding rules verified"
        ]
      },
      "latest_changes": [
        "Merge pull request #25 from ricardojjulia/feature/ministry-governance-maturity-engine (3296855)",
        "feat(ministries): Departmental Ministry Governance & Maturity Engine (v0.18.0) (aa4412c)",
        "Merge pull request #24 from ricardojjulia/feature/compensating-controls-small-churches (a196eba)",
        "ci: upgrade workflow node version to 22 for native WebSocket support (9e8f120)",
        "feat(controls): implement compensating controls engine and standalone community church governance (02c10c6)"
      ],
      "next_steps": [
        "Deploy staging preview build to Vercel",
        "Execute test:security and audit:rls verification"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 75,
        "session_date": "2026-10-17T15:59:18.227522+00:00",
        "session_operator": "Ricardo J. Julia",
        "summary_of_work": "Shipped Departmental Ministry Governance & Maturity Engine (v0.18.0); verified financial safeguarding compensating controls."
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
          "COUNCIL-2026-004"
        ],
        "brand_house_compliant": true,
        "sovereign_db_isolation_verified": true
      },
      "_source_path": "/Users/rjulia/ChurchCore Orthos/docs/control-plane/telemetry.json",
      "_source_type": "local"
    },
    {
      "product_id": "faithfull-scholars",
      "repo_name": "FaithFullScholars",
      "version": "0.1.0",
      "report_timestamp": "2026-10-17T15:59:18.227522+00:00",
      "online_status": {
        "is_online": true,
        "vercel_status": "deployed",
        "vercel_url": "https://faithfull-scholars.vercel.app",
        "supabase_status": "connected",
        "supabase_project_ref": "prod-scholars-db",
        "readiness_assessment": {
          "readiness_score_pct": 90,
          "blockers": [],
          "next_required_actions": [
            "Run npm run verify:deploy against live Vercel endpoint",
            "Complete peer-review monograph submission interface"
          ]
        }
      },
      "mvp_status": {
        "phase": "beta",
        "completion_pct": 85,
        "latest_milestones": [
          "PR #87 merged: Honest launch surface merged and live on Vercel",
          "PR #86 merged: Bilingual Spanish server translations and translated sign-up errors",
          "PR #85 merged: Cloudflare Turnstile CSP fix enabling reliable pre-auth verification"
        ]
      },
      "latest_changes": [
        "docs(adr): 0031 legal documents and acceptance records (47eface)",
        "docs(spec): A3a technical brief (awaiting gate 5) (e5b82f5)",
        "docs(spec): A3 story (owner-approved, split A3a/A3b) and owner decisions (6789d71)",
        "docs: A1 honest launch surface merged and live (#87) (5edc51b)",
        "fix: A1 follow-ups \u2014 server language, translated sign-up errors, honest plan name (#86) (06f4b65)"
      ],
      "next_steps": [
        "Complete faculty profile public monograph index",
        "Execute npm run audit:rls against production schema"
      ],
      "ai_session_telemetry": {
        "last_model": "gemini-2.5-pro",
        "session_duration_minutes": 105,
        "session_date": "2026-10-17T15:59:18.227522+00:00",
        "session_operator": "Ricardo J. Julia",
        "summary_of_work": "Fixed Cloudflare Turnstile CSP header blocking sign-up completion; deployed honest launch surface to Vercel."
      },
      "deployment_diagnostics": {
        "recent_errors": [
          "[2026-10-16] Cloudflare Turnstile CAPTCHA was blocked by strict CSP header on sign-up page.",
          "[2026-10-16] Untranslated Spanish sign-up error toasts in production."
        ],
        "mitigations_applied": [
          "[2026-10-16] Added challenges.cloudflare.com to vercel.json connect-src and script-src directives (PR #85).",
          "[2026-10-16] Localized all auth error dictionary keys in Spanish i18n bundle (PR #86)."
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
      "_source_path": "/Users/rjulia/FaithFullScholars/docs/control-plane/telemetry.json",
      "_source_type": "local"
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
      "status": "waiting",
      "directionality": "CONTROL_PLANE",
      "priority": "P0_CRITICAL",
      "category": "deployment",
      "assignee": "Ricardo J. Julia",
      "git_reference": "COUNCIL-2026-004 (REQ-004-02)",
      "target_milestone": "v0.18.1",
      "description": "Execute npm run test:omni-council, bind production Supabase credentials, and promote from preview to full production.",
      "verification": "Full green run on npm run test:omni-council",
      "updated_at": "2026-10-17T11:35:00Z"
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
        }
      ],
      "waiting": [
        {
          "title": "Production Vercel Cloud Binding & Domain Linking",
          "directionality": "CONTROL_PLANE",
          "details": "Awaiting binding of Vercel production credentials to achieve 100% online status."
        }
      ],
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
      "current_milestone": "v0.18.0 (Ministry Governance & Maturity Engine)",
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
        }
      ],
      "waiting": [
        {
          "title": "Omni-Council Compliance Rehearsal & Cloud Supabase Binding",
          "directionality": "CONTROL_PLANE",
          "details": "Awaiting green test:omni-council run to promote from preview to production."
        }
      ],
      "in_progress": [
        {
          "title": "Audit PDF Preview CSP Header Whitelisting",
          "directionality": "EDGE_REPO",
          "details": "Configuring explicit CSP allowlists in vercel.json for audit PDF preview rendering."
        }
      ],
      "planned": [
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
        "url": "https://churchcore.vercel.app/api/health",
        "latency_ms": 42,
        "status": "GREEN"
      },
      {
        "name": "LMS Student Auth",
        "url": "https://church-core-lms.vercel.app/api/health",
        "latency_ms": 38,
        "status": "GREEN"
      },
      {
        "name": "Care EHR Portal",
        "url": "https://churchcore-care.vercel.app/health",
        "latency_ms": 55,
        "status": "GREEN"
      },
      {
        "name": "Scholars Monograph API",
        "url": "https://faithfull-scholars.vercel.app/api/health",
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
  ]
};
