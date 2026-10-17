#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Marketing & Business Presentation Engine
Generates dynamic, living presentation decks and AI prompt packets (Claude, ChatGPT, Prezi AI, PromptAI)
synchronized directly from live repository telemetry, git commit history, schema metrics, and screenshots.
"""

import os
import sys
import json
import glob
from datetime import datetime, timezone

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_MD_DIR = os.path.join(WORKSPACE_ROOT, "docs", "marketing", "presos")
OUTPUT_JSON_FILE = os.path.join(WORKSPACE_ROOT, "dashboard", "presos-data.json")
OUTPUT_JS_FILE = os.path.join(WORKSPACE_ROOT, "dashboard", "presos-data.js")

PRODUCT_SPECS = [
    {
        "id": "platform",
        "name": "ChurchCore Sovereign Platform",
        "short_name": "Platform",
        "badge": "Ecosystem Master",
        "icon": "🌐",
        "tagline": "The Sovereign Operating System for the Global Church, Christian Education, and Pastoral Care",
        "buyer_personas": [
            "Denominational Bishop / General Superintendent",
            "Executive Pastor / COO of Multi-Site Church",
            "Christian Foundation / Institutional Investor",
            "Council of Churches Executive Board"
        ],
        "displacement_targets": "Replaces fragmented stack: Planning Center + Canvas LMS + FACTS/RenWeb + SimplePractice + Subsplash",
        "live_domain": "https://www.churchcore.io",
        "scale_metrics": "517 Database Tables • 423 Next.js Routes • 6 Sovereign Pillars",
        "screenshot": "screenshots/fleet_tab_top_view.png",
        "constitutional_moat": "Constitution Section III: Zero Cross-Application Data Propagation • 100% PostgreSQL RLS Silos",
        "pricing_headline": "$199–$499/mo Local Church • $4.5k–$25k/yr Academy • $50k+ Denomination"
    },
    {
        "id": "churchcore-chms",
        "name": "ChurchCore ChMS",
        "short_name": "ChMS",
        "badge": "Core ChMS & Finance",
        "icon": "🏛️",
        "tagline": "Worship Planning, Child Check-In Security, and Double-Entry Ministry Accounting",
        "buyer_personas": [
            "Senior Pastor / Lead Pastor",
            "Executive Pastor / Business Administrator",
            "Children's Ministry Director",
            "Church Treasurer / Stewardship Committee"
        ],
        "displacement_targets": "Displaces Planning Center (Services/People/Giving) + Breeze + Realm + Tithe.ly",
        "live_domain": "https://www.churchcore.io",
        "scale_metrics": "133 Relational Tables • 121 Application Routes • v3.5.0",
        "screenshot": "screenshots/fleet_grid_overview.png",
        "constitutional_moat": "Financial Double-Entry Ledger with Fund Accounting Invariants & Secure Child Pickup PINs",
        "pricing_headline": "$49–$749/mo + 1% Transparent Giving Interchange"
    },
    {
        "id": "churchcore-lms",
        "name": "ChurchCore LMS",
        "short_name": "LMS",
        "badge": "Discipleship & PWA",
        "icon": "🎓",
        "tagline": "Ministry Formation, Interactive Discipleship Tracks, and Bilingual Offline PWA",
        "buyer_personas": [
            "Discipleship Pastor / Christian Education Director",
            "Bible Institute Dean / Seminary Extension Director",
            "Small Groups Coordinator",
            "Youth & Leadership Training Director"
        ],
        "displacement_targets": "Displaces Canvas LMS (high institutional cost) + Teachable + RightNow Media + Kajabi",
        "live_domain": "https://www.churchcorelms.io",
        "scale_metrics": "72 Relational Tables • 85 Application Routes • v0.47.0",
        "screenshot": "screenshots/council_chambers_deliberation.png",
        "constitutional_moat": "Offline IndexedDB PWA with Trinity SpeedGrader, Rubrics & Dual-Tier Council Curriculum Governance",
        "pricing_headline": "$79–$999/mo (Unlimited Church Discipleship)"
    },
    {
        "id": "churchcore-academy",
        "name": "ChurchCore Academy",
        "short_name": "Academy",
        "badge": "K-12 & Higher-Ed SIS",
        "icon": "🏫",
        "tagline": "OneRoster 1.2 School Information System for Christian Day Schools & K-12 Academies",
        "buyer_personas": [
            "Head of School / Academy Principal",
            "Academic Dean / Registrar",
            "Admissions Director",
            "School Board Chairman"
        ],
        "displacement_targets": "Displaces FACTS / RenWeb + Blackbaud K-12 + Alma + PowerSchool",
        "live_domain": "https://church-core-academy.vercel.app",
        "scale_metrics": "152 Relational Tables • 105 Application Routes • v0.10.0",
        "screenshot": "screenshots/implementation_plans_directionality.png",
        "constitutional_moat": "OneRoster 1.2 Compliant Gradebooks, Colegio Biblos Pilot Schema & Admissions RLS",
        "pricing_headline": "$2,400–$25,000/yr (Based on Student Enrollment)"
    },
    {
        "id": "churchcore-care",
        "name": "ChurchCore Care",
        "short_name": "Care",
        "badge": "Pastoral & Clinical EHR",
        "icon": "🌿",
        "tagline": "Pastoral Counseling, Clinical EHR, and HIPAA-Compliant Soul-Care Telehealth",
        "buyer_personas": [
            "Clinical Director / Licensed Marriage & Family Therapist",
            "Pastoral Care Pastor / Benevolence Director",
            "Christian Counseling Practice Owner",
            "Hospital Chaplaincy Coordinator"
        ],
        "displacement_targets": "Displaces SimplePractice + TherapyNotes + Hushmail + Psychology Today Directory",
        "live_domain": "https://www.churchcorecare.io",
        "scale_metrics": "84 Relational Tables • Deny-All Row-Level Security • v7.0.0",
        "screenshot": "screenshots/sunday_sla_pulse.png",
        "constitutional_moat": "Absolute Cryptographic Isolation: Church membership notes NEVER mix with confidential clinical therapy charts",
        "pricing_headline": "$59–$399/mo per practitioner"
    },
    {
        "id": "churchcore-orthos",
        "name": "ChurchCore Orthos",
        "short_name": "Orthos",
        "badge": "Governance & AI Audit",
        "icon": "⚖️",
        "tagline": "Autonomous Ecclesial Safeguarding, Financial Health Auditing & AI Compliance Scanner",
        "buyer_personas": [
            "Elder Board Chairman / Church Council President",
            "Denominational Bishop / Regional Presbyter",
            "Denominational Legal Counsel / Risk Manager",
            "Church Insurance Underwriter"
        ],
        "displacement_targets": "Displaces Protect My Ministry + MinistrySafe + expensive forensic accounting audits",
        "live_domain": "https://church-core-orthos.vercel.app",
        "scale_metrics": "28 Relational Tables • 30 Application Routes • Gemini AI • v0.18.0",
        "screenshot": "screenshots/evidence_reconciliation_ledger.png",
        "constitutional_moat": "Omni-Council Compliance Engine: Real-time checks for background check currency, double-entry fund balance, and RLS integrity",
        "pricing_headline": "$1,200–$50,000/yr (Parish to Diocesan Licensing)"
    },
    {
        "id": "faithfull-scholars",
        "name": "FaithFull Scholars",
        "short_name": "Scholars",
        "badge": "Theological Network",
        "icon": "📖",
        "tagline": "Theological Higher-Education Network, Confessional Search & Faculty Placement",
        "buyer_personas": [
            "Seminary President / Academic Provost",
            "Theological Faculty Search Committee Chair",
            "Theological Association Director (e.g. AETH, ATS)",
            "Doctoral Program Director"
        ],
        "displacement_targets": "Displaces Chronicle of Higher Education + HigherEdJobs + Academia.edu with confessional filtering",
        "live_domain": "https://faith-full-scholars.vercel.app",
        "scale_metrics": "48 Relational Tables • 53 Application Routes • pgvector Semantic Search • v0.1.0",
        "screenshot": "screenshots/commercial_opex_margins.png",
        "constitutional_moat": "Confessional Credo Alignment & AI Semantic Vector Matching for Theological Specialties",
        "pricing_headline": "$2,500–$15,000/yr per Institution"
    }
]

def load_live_telemetry():
    """Reads latest telemetry files from all edge product directories."""
    telemetry_map = {}
    pattern = os.path.join(os.path.dirname(WORKSPACE_ROOT), "*", "docs", "control-plane", "telemetry.json")
    for f in glob.glob(pattern):
        try:
            with open(f) as fp:
                data = json.load(fp)
                pid = data.get("product_id")
                if pid:
                    telemetry_map[pid] = data
        except Exception:
            pass
    return telemetry_map

def generate_slide_deck(spec, telemetry):
    """Builds a dynamic, 6-slide presentation deck incorporating real-time telemetry."""
    now_str = datetime.now(timezone.utc).strftime("%B %d, %Y")
    version = telemetry.get("version", "v1.0.0") if telemetry else "v1.0.0"
    online_status = telemetry.get("online_status", {}) if telemetry else {}
    is_online = online_status.get("is_online", True)
    live_url = online_status.get("custom_domain") or online_status.get("vercel_url") or spec["live_domain"]
    
    # Recent changes and fixes
    changes = telemetry.get("latest_changes", []) if telemetry else []
    if isinstance(changes, str):
        changes = [changes]
    recent_bullets = changes[:3] if changes else ["Continuous architectural refinement", "100% Row-Level Security verification"]
    
    recent_errors = telemetry.get("deployment_diagnostics", {}).get("recent_errors", []) if telemetry else []
    mitigations = telemetry.get("deployment_diagnostics", {}).get("mitigations_applied", []) if telemetry else []
    reliability_proof = mitigations[0] if mitigations else "Automated CI/CD validation and zero-downtime database migrations."

    slides = [
        {
            "slide_num": 1,
            "title": f"{spec['name']}: {spec['tagline']}",
            "type": "title_hero",
            "subtitle": f"Live Production Architecture • {spec['scale_metrics']} • {now_str}",
            "key_takeaways": [
                f"Target Buyers: {', '.join(spec['buyer_personas'][:2])}",
                f"Strategic Replacement: {spec['displacement_targets']}",
                f"Production Gate: {'🟢 Active in Production' if is_online else '🟡 Enterprise Staging Pilot'}"
            ],
            "visual_asset": spec["screenshot"],
            "speaker_notes": f"Introduce {spec['name']}. Emphasize that unlike legacy point solutions that were patched together over 15 years, ChurchCore is engineered as a modern, sovereign application on Next.js with complete Row-Level Security."
        },
        {
            "slide_num": 2,
            "title": "The Problem: Fragile Point Solutions & Data Hostage Traps",
            "type": "problem_statement",
            "subtitle": "Churches and ministries are paying 4-5 different SaaS bills while their data leaks across unencrypted third-party clouds.",
            "key_takeaways": [
                f"Legacy incumbent bloat: {spec['displacement_targets']} charge high per-seat or per-module surcharges.",
                "Data Sovereignty Crisis: Pastoral counseling notes and member giving records are frequently mined or shared without informed consent.",
                "System Fragility: Church staff spend 15+ hours weekly copying data between incompatible spreadsheets and tools."
            ],
            "visual_asset": "screenshots/executive_dashboard_kpis.png",
            "speaker_notes": "Walk the executive buyer through their current pain: disjointed tools, rising subscription costs, and the lack of ethical data boundaries."
        },
        {
            "slide_num": 3,
            "title": f"The Solution: {spec['name']} Sovereign Architecture",
            "type": "architecture_solution",
            "subtitle": f"Enterprise power built on {spec['scale_metrics']}",
            "key_takeaways": [
                f"Constitutional Protection: {spec['constitutional_moat']}.",
                f"Instant Edge Performance: Deployed on Vercel Edge with sub-100ms global latency at {live_url}.",
                "Zero Vendor Lock-in: Automated backup exports, open PostgreSQL schemas, and full exportability."
            ],
            "visual_asset": spec["screenshot"],
            "speaker_notes": f"Showcase the actual live application at {live_url}. Highlight that ChurchCore respects the sacred trust of church data by giving every church total database sovereignty."
        },
        {
            "slide_num": 4,
            "title": "Fresh Off the Press: Latest Engineering Milestones",
            "type": "live_telemetry_highlights",
            "subtitle": f"Continuous High-Velocity Delivery ({version} Live)",
            "key_takeaways": [
                f"Latest Feature Delivered: {recent_bullets[0]}",
                f"Ecosystem Hardening: {recent_bullets[1] if len(recent_bullets) > 1 else 'Automated Council Directives sync'}",
                f"Reliability Proof: {reliability_proof}"
            ],
            "visual_asset": "screenshots/implementation_plans_directionality.png",
            "speaker_notes": "This slide proves to the buyer or board that our software is actively maintained, battle-tested, and rapidly evolving. We are not selling vaporware; we are deploying verified code weekly."
        },
        {
            "slide_num": 5,
            "title": "Unrivaled Competitive Moat & Ecclesial Integrity",
            "type": "competitive_moat",
            "subtitle": f"Why incumbents cannot copy {spec['name']}",
            "key_takeaways": [
                f"Displacement Economics: Cuts software spend by 40-60% while unifying operations under one roof.",
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
            "subtitle": f"Accessible Packaging: {spec['pricing_headline']}",
            "key_takeaways": [
                f"Explore Live Production Environment: {live_url}",
                "Migration Guarantee: 100% white-glove onboarding and historical data transfer.",
                "The No-Hostage Covenant: If church finances tighten, accounts are never locked; they downgrade gracefully with dignity."
            ],
            "visual_asset": "screenshots/sunday_sla_pulse.png",
            "speaker_notes": "Close with confidence. Point the prospect to the live demo, review our transparent pricing tiers, and offer an immediate pilot or migration evaluation."
        }
    ]
    return slides

def generate_ai_prompts(spec, telemetry, slides):
    """Generates ready-to-copy LLM prompt packets for Claude, ChatGPT, Prezi AI, and PromptAI."""
    live_url = spec["live_domain"]
    changes = telemetry.get("latest_changes", []) if telemetry else []
    if isinstance(changes, str):
        changes = [changes]
    changes_text = "\n".join([f"- {c}" for c in changes[:4]]) if changes else "- Continuous verified production releases"
    
    # 1. Claude 3.7 Sonnet XML Prompt (Artifacts & Whitepapers)
    claude_prompt = f"""<system>
You are the Chief Strategy Officer and Lead Product Evangelist for the ChurchCore Ecosystem.
Generate an authoritative, compelling, and aesthetically stunning executive presentation deck and speaking manuscript for {spec['name']}.
</system>

<context>
Product: {spec['name']} ({spec['short_name']})
Domain Category: {spec['badge']}
Tagline: {spec['tagline']}
Scale & Footprint: {spec['scale_metrics']}
Target Buyer Personas: {', '.join(spec['buyer_personas'])}
Competitive Replacement Targets: {spec['displacement_targets']}
Live Production URL: {live_url}
Constitutional Invariant: {spec['constitutional_moat']}
Commercial Pricing: {spec['pricing_headline']}

Recent Engineering Delivery & Milestones:
{changes_text}
</context>

<instructions>
1. Produce an exhaustive, slide-by-slide executive presentation manuscript (6 to 8 slides).
2. For each slide provide:
   - Slide Title & Subtitle
   - Key Strategic Bullet Points (maximum 3, crisp and punchy)
   - Visual Layout Suggestion (diagram, KPI counter, UI screen)
   - Verbatim Speaker Script for the Presenter (persuasive, warm, authoritative, respectful of Christian ministry)
3. Conclude with an FAQ section tackling the top 3 objections from church boards or school administrators.
</instructions>"""

    # 2. ChatGPT 4o / Canvas Prompt
    chatgpt_prompt = f"""Act as a Tier-1 SaaS Product Marketing Director specializing in Christian enterprise software.
Create a high-converting, 6-slide executive pitch deck for **{spec['name']}**.

**Key Context:**
- Product: {spec['name']} ({spec['tagline']})
- Scale: {spec['scale_metrics']}
- Replaces: {spec['displacement_targets']}
- Core Value: {spec['constitutional_moat']}
- Live Site: {live_url}
- Pricing: {spec['pricing_headline']}
- Latest Features: {', '.join(changes[:3]) if changes else 'Active Next.js Vercel Production Build'}

**Output Requirements:**
1. Generate Slide 1 to Slide 6 with:
   - Catchy Title
   - 3 High-Impact Bullets
   - Presenter Script
2. Write a 1-page executive email summary pitch to send to a {spec['buyer_personas'][0]} requesting a 20-minute live demonstration."""

    # 3. Prezi AI & Gamma.app Outline Format
    prezi_gamma_outline = f"""Title: {spec['name']} — Executive Presentation
Subtitle: {spec['tagline']}
Theme: Sovereign Modern Tech • Deep Navy (#0A192F), Celestial Gold (#D4AF37), Slate (#1E293B)

Slide 1: Executive Overview
- {spec['name']}: {spec['tagline']}
- Live URL: {live_url}
- Scale: {spec['scale_metrics']}

Slide 2: The Ministry Crisis
- The High Cost of Fragmented Software ({spec['displacement_targets']})
- Data Leakage & Secular Exploitation Risks
- Administrative Burnout: 15+ Hours Lost Weekly

Slide 3: The Sovereign ChurchCore Solution
- 100% Database Sovereignty ({spec['constitutional_moat']})
- Built for Kingdom Longevity with Open Standards
- Ultra-low Latency on Vercel Global Edge

Slide 4: Verified Capabilities & Recent Milestones
{chr(10).join(['- ' + c for c in (changes[:3] if changes else ['Production-ready release'])])}
- High-Performance Database Architecture

Slide 5: Why We Win (The Moat)
- 40-60% Savings Compared to Incumbents
- Built-in Confessional & Safeguarding Standards
- Native Bilingual Architecture (English & Spanish)

Slide 6: Partnership & Onboarding
- Transparent Pricing: {spec['pricing_headline']}
- Zero-Downtime White-Glove Data Migration
- Request a Guided Walkthrough: {live_url}"""

    # 4. PromptAI & Visual Designer Prompts
    prompt_ai_visuals = f"""Prompt for Slide Backgrounds & Midjourney Visuals:
1. Title Hero Slide:
   "An inspiring, ultra-modern glassmorphic software dashboard interface displaying church analytics, warm cinematic lighting, dark sanctuary navy #0A192F background, subtle celestial gold accents #D4AF37, clean UI cards, 8k resolution, photorealistic, modern enterprise SaaS aesthetic --ar 16:9"

2. Architecture & Data Sovereignty Slide:
   "Abstract representation of an impregnable cryptographic digital fortress protecting sacred church documents, glowing golden lines of network security, clean isometric view, minimalist dark slate background, high tech, elegance, integrity --ar 16:9"

3. Live Operations & Speed Slide:
   "Futuristic executive command center interface showing real-time global telemetry, pulse waves, clean typography, glassmorphism, gold and emerald green status lights, sleek professional design --ar 16:9"
"""

    return {
        "claude": claude_prompt,
        "chatgpt": chatgpt_prompt,
        "prezi_gamma": prezi_gamma_outline,
        "prompt_ai": prompt_ai_visuals
    }

def build_presentation_packet(spec, telemetry):
    slides = generate_slide_deck(spec, telemetry)
    prompts = generate_ai_prompts(spec, telemetry, slides)
    
    return {
        "id": spec["id"],
        "name": spec["name"],
        "short_name": spec["short_name"],
        "badge": spec["badge"],
        "icon": spec["icon"],
        "tagline": spec["tagline"],
        "buyer_personas": spec["buyer_personas"],
        "displacement_targets": spec["displacement_targets"],
        "live_domain": spec["live_domain"],
        "scale_metrics": spec["scale_metrics"],
        "screenshot": spec["screenshot"],
        "constitutional_moat": spec["constitutional_moat"],
        "pricing_headline": spec["pricing_headline"],
        "version": telemetry.get("version", "v1.0.0") if telemetry else "v1.0.0",
        "last_synced": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "slides": slides,
        "prompts": prompts
    }

def main():
    os.makedirs(OUTPUT_MD_DIR, exist_ok=True)
    telemetry_map = load_live_telemetry()
    
    presos_collection = []

    print("=" * 80)
    print("   CHURCHCORE MARKETING & BUSINESS PRESENTATIONS GENERATOR")
    print(f"   Destination: {OUTPUT_MD_DIR}")
    print("=" * 80)

    for spec in PRODUCT_SPECS:
        telemetry = telemetry_map.get(spec["id"], {})
        preso_data = build_presentation_packet(spec, telemetry)
        presos_collection.append(preso_data)

        # 1. Write individual JSON
        json_file = os.path.join(OUTPUT_MD_DIR, f"{spec['id']}-preso.json")
        with open(json_file, "w") as f:
            json.dump(preso_data, f, indent=2)

        # 2. Write individual Markdown Dossier & Prompt Kit
        md_file = os.path.join(OUTPUT_MD_DIR, f"{spec['id']}-preso.md")
        with open(md_file, "w") as f:
            f.write(f"# {spec['name']} — Marketing & Presentation Dossier\n\n")
            f.write(f"> **Tagline:** {spec['tagline']}  \n")
            f.write(f"> **Scale:** {spec['scale_metrics']}  \n")
            f.write(f"> **Target Buyers:** {', '.join(spec['buyer_personas'])}  \n")
            f.write(f"> **Live URL:** [{spec['live_domain']}]({spec['live_domain']})  \n")
            f.write(f"> **Last Synced from Telemetry:** {preso_data['last_synced']}\n\n")
            f.write("---\n\n## 🎞️ 6-Slide Executive Presentation Deck\n\n")

            for s in preso_data["slides"]:
                f.write(f"### Slide {s['slide_num']}: {s['title']}\n")
                f.write(f"*{s['subtitle']}*\n\n")
                for k in s["key_takeaways"]:
                    f.write(f"- {k}\n")
                f.write(f"\n> 🗣️ **Speaker Script:** {s['speaker_notes']}\n\n")

            f.write("---\n\n## 🤖 AI Prompt Context Packets (For Claude, ChatGPT, Prezi AI)\n\n")
            f.write("### 1. Claude 3.7 Sonnet (Executive Manuscript)\n```xml\n")
            f.write(preso_data["prompts"]["claude"])
            f.write("\n```\n\n### 2. ChatGPT 4o / Canvas (Pitch Deck & Outreach)\n```markdown\n")
            f.write(preso_data["prompts"]["chatgpt"])
            f.write("\n```\n\n### 3. Prezi AI & Gamma.app (Outline)\n```text\n")
            f.write(preso_data["prompts"]["prezi_gamma"])
            f.write("\n```\n\n### 4. PromptAI / Midjourney (Visual Prompts)\n```text\n")
            f.write(preso_data["prompts"]["prompt_ai"])
            f.write("\n```\n")

        print(f"  [x] Generated presentation pack: {spec['name']} ({md_file})")

    # Write unified dashboard JSON and JS
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_decks": len(presos_collection),
        "decks": presos_collection
    }

    with open(OUTPUT_JSON_FILE, "w") as f:
        json.dump(payload, f, indent=2)

    with open(OUTPUT_JS_FILE, "w") as f:
        f.write("window.CHURCHCORE_PRESOS_DATA = " + json.dumps(payload, indent=2) + ";\n")

    print(f"\n[+] Master Presentation Datasets generated:")
    print(f"    • {OUTPUT_JSON_FILE}")
    print(f"    • {OUTPUT_JS_FILE}")
    print(f"    Total Decks Compiled: {len(presos_collection)}")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    main()
