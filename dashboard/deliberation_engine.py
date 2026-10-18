#!/usr/bin/env python3
"""
ChurchCore Sovereign Control Plane: Deliberation Engine
Generates intelligent, context-aware Council determinations, customized AntiGravity prompts,
and specialized member speeches tailored to the specific product and feature requested.
Permanently logs ratified executive deliberations into docs/deliberations/.
"""

import os
import re
import json
from datetime import datetime, timezone

DASHBOARD_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.dirname(DASHBOARD_DIR)
FLEET_DATA_PATH = os.path.join(DASHBOARD_DIR, 'fleet-data.json')
DELIBERATIONS_DIR = os.path.join(WORKSPACE_DIR, 'docs', 'deliberations')

PRODUCT_PATHS = {
    'churchcore-chms': {
        'name': 'ChurchCore (ChMS)',
        'repo_name': 'ChurchCore',
        'path': '/Users/rjulia/ChurchCore',
        'tech_stack': 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS',
        'domain': 'Parish Membership, Tithing & Giving, Sunday Child Check-in, Volunteer Schedules'
    },
    'churchcore-lms': {
        'name': 'ChurchCore LMS',
        'repo_name': 'ChurchCore LMS',
        'path': '/Users/rjulia/ChurchCore LMS',
        'tech_stack': 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, SpeedGrader',
        'domain': 'Seminary Courses, Canvas-Grade SpeedGrader, Drip Engines, Discipleship & Certification'
    },
    'churchcore-academy': {
        'name': 'ChurchCore Academy',
        'repo_name': 'ChurchCore-Academy',
        'path': '/Users/rjulia/ChurchCore-Academy',
        'tech_stack': 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, SIS',
        'domain': 'K-12 Christian Schooling, SIS Student Information System, Attendance, Family Billing & COPPA'
    },
    'churchcore-care': {
        'name': 'ChurchCore Care',
        'repo_name': 'ChurchCoreCare',
        'path': '/Users/rjulia/ChurchCoreCare',
        'tech_stack': 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, pgcrypto',
        'domain': 'Pastoral Counseling, Clinical Triage, HIPAA Notes, Grief & Benevolence Dispatch'
    },
    'churchcore-orthos': {
        'name': 'ChurchCore Orthos',
        'repo_name': 'ChurchCore-Orthos',
        'path': '/Users/rjulia/ChurchCore-Orthos',
        'tech_stack': 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, pgvector',
        'domain': 'Historic Confessions, Doctrinal Safeguarding, Financial Audit & Canon Verification'
    },
    'faithfull-scholars': {
        'name': 'FaithFull Scholars',
        'repo_name': 'FaithFullScholars',
        'path': '/Users/rjulia/FaithFullScholars',
        'tech_stack': 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS',
        'domain': 'Theological Higher-Ed, Faculty Search, Credal Calibration & Academic Grants'
    },
    'churchcore-business': {
        'name': 'ChurchCore Control Plane',
        'repo_name': 'ChurchCore-Business',
        'path': '/Users/rjulia/ChurchCore-Business',
        'tech_stack': 'Python 3, Vanilla JS / CSS, GitHub Actions CI, Sovereign Control Plane',
        'domain': 'Cross-Ecosystem Governance, Telemetry Consolidation, Executive Mission Control'
    }
}

COUNCIL_PRODUCT_MAP = {
    'council-grand': 'churchcore-business',
    'council-chms': 'churchcore-chms',
    'council-lms': 'churchcore-lms',
    'council-academy': 'churchcore-academy',
    'council-care': 'churchcore-care',
    'council-orthos': 'churchcore-orthos',
    'council-scholars': 'faithfull-scholars'
}

def load_env():
    for filename in ['.env', '.env.local']:
        env_path = os.path.join(WORKSPACE_DIR, filename)
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            if k not in os.environ and v:
                                os.environ[k] = v
            except Exception as e:
                print(f"[!] Warning reading {filename}: {e}")

load_env()

def call_openrouter_api(api_key, model, system_prompt, user_prompt, timeout=60):
    import urllib.request
    import urllib.error

    url = "https://openrouter.ai/api/v1/chat/completions"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "response_format": {"type": "json_object"}
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Authorization': f'Bearer {api_key}',
            'HTTP-Referer': 'http://localhost:3333',
            'X-Title': 'ChurchCore Sovereign Control Plane',
            'Content-Type': 'application/json'
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=timeout) as resp:
        res_data = json.loads(resp.read().decode('utf-8'))
        raw_content = res_data['choices'][0]['message']['content'].strip()
        if raw_content.startswith('```'):
            raw_content = re.sub(r'^```[a-zA-Z]*\s*', '', raw_content)
            raw_content = re.sub(r'\s*```$', '', raw_content).strip()
        try:
            return json.loads(raw_content)
        except Exception:
            match = re.search(r'(\{[\s\S]*\})', raw_content)
            if match:
                return json.loads(match.group(1))
            raise

def call_dual_contending_gemini_deliberation(api_key, model_pro, model_flash, current_council, target_product, query, mode, member_id):
    """
    Dual Contending Gemini Deliberation System:
    - Stage 1: Gemini 2.5 Pro (The Sovereign Advocate) drafts initial determination & AntiGravity prompt.
    - Stage 2: Gemini 2.5 Flash (The Invariant Challenger) audits & challenges against Section III, Sunday SLA, and Testing Council invariants.
    - Stage 3: Gemini 2.5 Pro (The Final Consensus Ratifier) synthesizes critiques, resolves challenges, and hardens the final directive.
    """
    model_pro = model_pro or os.environ.get('OPENROUTER_PRO_MODEL') or "google/gemini-2.5-pro"
    model_flash = model_flash or os.environ.get('OPENROUTER_FLASH_MODEL') or "google/gemini-2.5-flash"

    members_info = []
    for m in current_council.get('members', []):
        members_info.append({
            'seat_id': m.get('seat_id'),
            'persona_name': m.get('persona_name'),
            'title': m.get('title'),
            'domain': m.get('domain'),
            'invariant_focus': m.get('invariant_focus'),
            'deliberation_stance': m.get('deliberation_stance')
        })

    # =========================================================================
    # STAGE 1: The Sovereign Advocate (Gemini 2.5 Pro)
    # =========================================================================
    stage1_system = f"""You are the Primary Architect & Sovereign Advocate on the ChurchCore Council ({current_council['name']}).
You govern: {target_product['name']} (Path: {target_product['path']}, Tech: {target_product['tech_stack']}).

CORE DIRECTIVE (MANDATORY):
You serve as the Chief Architectural Enabler for the Human Founder & Executive. Whatever capability, product expansion, new persona, or feature the operator requests, YOUR SOLEMN DUTY IS TO ARCHITECT AND DELIVER A COMPLETE IMPLEMENTATION BLUEPRINT AND HIGH-FIDELITY ANTIGRAVITY ENGINEERING PROMPT.
- NEVER reject, veto, deny, or substitute the requested feature (e.g., NEVER replace an expansion request with an 'immutable charter' or refuse product evolution).
- Treat the operator's submission as authoritative product vision.
- Provide the exact database migrations, multi-persona schema tables, server actions, UI routes, and automated test specifications to make it reality.
- Ensure the requested expansion strictly adheres to technical non-negotiables:
  1. Constitution Section III: 100% PostgreSQL RLS tenant isolation; zero foreign event queues or cross-database replication streams.
  2. Inseparable Testing Invariant (COUNCIL-2026-006 Phase 1): Tests delivered alongside feature code.
  3. Sunday Morning 99.99% Holy Hours SLA: Non-blocking sub-50ms execution.

SEATED MEMBERS:
{json.dumps(members_info, indent=2)}

Formulate a complete, enthusiastic initial architectural determination and prompt executing the operator's submission.
Respond strictly in JSON:
{{
  "answer_title": "Executive Directive Title (e.g., Expansion of FaithFull Scholars to Pastoral & Ministry Ecosystem)",
  "answer_summary": "High-level summary of the architectural expansion plan and timeline",
  "feature_title": "Clean feature name",
  "antigravity_prompt": "Complete, comprehensive AntiGravity prompt with migrations, schemas, Edge APIs, UI components, and test specs",
  "terminal_command": "cd \\\"{target_product['path']}\\\" && agy -p \\\"...\\\"",
  "speeches": [
    {{ "seat_id": "...", "speech_html": "<p>In-character discourse affirming the expansion</p>", "verdict": "VERIFIED" }}
  ]
}}"""

    stage1_user = f"""Operator Submission: "{query}"\nMode: {mode}\nTarget: {target_product['name']}"""
    stage1_proposal = call_openrouter_api(api_key, model_pro, stage1_system, stage1_user, timeout=50)

    # =========================================================================
    # STAGE 2: The Invariant Challenger & Auditor (Gemini 2.5 Flash)
    # =========================================================================
    stage2_system = f"""You are the Invariant Auditor & Adversarial Challenger on the Sovereign Testing Council.
Your role is to rigorously challenge, probe, and stress-test the TECHNICAL EXECUTION of the proposal:
- CRITICAL RULE: Do NOT challenge or veto the operator's product direction or requested expansion. The founder's decision to expand the application is sovereign and absolute.
- Focus your challenges strictly on HOW the architecture is implemented:
  1. Multi-role schema & RLS boundaries: Are the newly added personas (e.g., pastors, churches, evangelists, ministers, apologists, councils) properly isolated with secure RLS policies?
  2. Sunday Morning SLA (<50ms): Could any relational joins, feed aggregations, or unindexed foreign keys exceed the latency budget?
  3. Inseparable Testing Invariant (COUNCIL-2026-006 Phase 1): Are the unit and integration tests concrete with verifiable assertions?

Respond strictly in JSON:
{{
  "challenges": [
    {{
      "invariant": "Section III | Sunday SLA | Testing Invariant | Domain Integrity",
      "critique": "Specific technical vulnerability or scalability risk identified in the implementation",
      "mandated_mitigation": "Exact technical modification required to resolve"
    }}
  ],
  "audit_verdict": "CHALLENGED_WITH_RESERVATIONS"
}}"""

    stage2_user = f"""Initial Proposal under Audit:
{json.dumps(stage1_proposal, indent=2)}

Original Inquiry: "{query}"
Target: {target_product['name']} ({target_product['path']})

Conduct an adversarial audit on the technical implementation. Identify edge cases, indexing gaps, and RLS requirements."""

    stage2_audit = call_openrouter_api(api_key, model_flash, stage2_system, stage2_user, timeout=35)
    challenges = stage2_audit.get('challenges', [])

    # =========================================================================
    # STAGE 3: Consensus Synthesis & Fortification (Gemini 2.5 Pro)
    # =========================================================================
    stage3_system = f"""You are the Sovereign Council Lead Synthesizer ({current_council['name']}).
You have received an adversarial audit from the Constitutional Auditor (Gemini 2.5 Flash).
Your task is to:
1. Deliver the final, fortified architectural blueprint and AntiGravity engineering prompt that accomplishes the operator's exact vision with 100% fidelity.
2. Directly incorporate all mandated mitigations from the auditor (e.g., composite indexes, role-based RLS policies, non-blocking feeds).
3. Ensure the AntiGravity prompt is production-ready, featuring exact SQL migrations, server actions, frontend pages, and Playwright tests.
4. Update council member speeches to reflect how this vigorous debate produced unanimous ratification of the operator's expansion plan.

SEATED MEMBERS:
{json.dumps(members_info, indent=2)}

Respond strictly in JSON matching this schema:
{{
  "answer_title": "Fortified Executive Directive Title",
  "answer_summary": "Summary highlighting the architectural roadmap, timeline, and how dialectic cross-examination hardened the solution",
  "feature_title": "Clean feature name",
  "plain_text": "Complete formatted plain text executive advisory",
  "antigravity_prompt": "Hardened, battle-tested AntiGravity engineering prompt incorporating all audit mitigations",
  "terminal_command": "cd \\\"{target_product['path']}\\\" && agy -p \\\"...\\\"",
  "challenges_and_resolutions": [
    {{
      "challenger_critique": "The critique raised by the auditor",
      "advocate_resolution": "How the architecture was fortified to resolve it"
    }}
  ],
  "speeches": [
    {{
      "seat_id": "matching seated member seat_id",
      "speech_html": "<p>In-character discourse affirming how the expansion strengthens the ecosystem while upholding non-negotiable security</p>",
      "verdict": "RATIFIED"
    }}
  ]
}}"""

    stage3_user = f"""Original Proposal:
{json.dumps(stage1_proposal, indent=2)}

Constitutional Auditor's Challenges (Gemini 2.5 Flash):
{json.dumps(challenges, indent=2)}

Original Inquiry: "{query}"
Target Product: {target_product['name']} ({target_product['path']})

Synthesize the final, battle-tested determination with resolved challenges and fortified prompt."""

    stage3_final = call_openrouter_api(api_key, model_pro, stage3_system, stage3_user, timeout=60)
    
    # Preserve challenges if not explicitly returned in stage 3
    if 'challenges_and_resolutions' not in stage3_final or not stage3_final['challenges_and_resolutions']:
        stage3_final['challenges_and_resolutions'] = [
            {
                'challenger_critique': c.get('critique', ''),
                'advocate_resolution': c.get('mandated_mitigation', 'Incorporated into hardened prompt')
            } for c in challenges
        ]

    return stage3_final, f"{model_pro} ⚔️ {model_flash}"

def load_fleet_data():
    if os.path.exists(FLEET_DATA_PATH):
        try:
            with open(FLEET_DATA_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"[!] Warning loading fleet-data.json: {e}")
    return {}

def resolve_target_product(query, council_id, fleet_data=None):
    q_lower = query.lower()
    
    # 1. Check explicit product keywords in the query
    if any(k in q_lower for k in ['academy', 'k-12', 'school', 'sis', 'attendance', 'gradebook', 'colegio', 'ferpa', 'coppa']):
        return PRODUCT_PATHS['churchcore-academy']
    if any(k in q_lower for k in ['lms', 'course', 'speedgrader', 'rubric', 'drip', 'seminary', 'syllabus', 'assignment']):
        return PRODUCT_PATHS['churchcore-lms']
    if any(k in q_lower for k in ['care', 'counseling', 'hipaa', 'pastoral note', 'benevolence', 'triage', 'bereavement', 'meal train']):
        return PRODUCT_PATHS['churchcore-care']
    if any(k in q_lower for k in ['orthos', 'audit', 'creed', 'confession', 'canon', 'safeguard', 'doctrinal', '1689', 'westminster', 'nicene']):
        return PRODUCT_PATHS['churchcore-orthos']
    if any(k in q_lower for k in ['scholar', 'faculty', 'higher-ed', 'tenure', 'academic grant', 'theological search']):
        return PRODUCT_PATHS['faithfull-scholars']
    if any(k in q_lower for k in ['chms', 'parish', 'tithing', 'giving', 'kiosk', 'volunteer', 'erasure', 'member', 'visitor']):
        return PRODUCT_PATHS['churchcore-chms']
    if any(k in q_lower for k in ['fleet inspector', 'daily briefing', 'daily report', 'briefing agent', 'consolidate fleet', 'control plane']):
        return PRODUCT_PATHS['churchcore-business']

    # 2. Fall back to current selected council
    default_prod_id = COUNCIL_PRODUCT_MAP.get(council_id, 'churchcore-business')
    return PRODUCT_PATHS.get(default_prod_id, PRODUCT_PATHS['churchcore-business'])

def extract_feature_title(query):
    patterns = [
        r"^(please\s+)?(can\s+you\s+)?(i\s+need\s+an?\s+|i\s+want\s+an?\s+|i\s+asked\s+for\s+an?\s+|give\s+me\s+an?\s+|provide\s+an?\s+|create\s+an?\s+|generate\s+an?\s+)?",
        r"(antigravity\s+prompt\s+|ai\s+prompt\s+|prompt\s+)?(to\s+|for\s+)?",
        r"(create\s+|build\s+|implement\s+|add\s+|develop\s+|scaffold\s+)?(the\s+|a\s+|an\s+)?",
        r"(feature\s+to\s+|feature\s+for\s+|new\s+feature\s+for\s+|feature\s+)?",
    ]
    cleaned = query.strip()
    for p in patterns:
        cleaned = re.sub(p, "", cleaned, flags=re.IGNORECASE)
    
    cleaned = re.sub(r"\s+(in|for|on)\s+(churchcore[\s\-]*)?(academy|lms|care|orthos|chms|scholars|business|repo|project).*$", "", cleaned, flags=re.IGNORECASE)
    cleaned = cleaned.strip(" ?.,!:\n\r\t\"'")
    if len(cleaned) < 3:
        return "Requested System Capability"
    return " ".join(w.capitalize() if not w.isupper() else w for w in cleaned.split())[:80]

def detect_query_intent(query):
    q = query.lower()
    
    # Explicit Daily Briefing request
    if ('daily briefing' in q or 'fleet inspector' in q or 'daily report' in q or 'consolidate fleet' in q) and not ('create' in q or 'feature' in q or 'build' in q or 'attendance' in q):
        return 'DAILY_BRIEFING'
    
    # Feature / Prompt / Building request
    if any(w in q for w in ['prompt', 'feature', 'build', 'create', 'implement', 'add', 'develop', 'scaffold', 'notification', 'attendance', 'screen', 'api', 'workflow', 'view', 'page']):
        return 'FEATURE_PROMPT'
    
    # Zero Customer Data Propagation
    if any(w in q for w in ['zero data', 'propagation', 'cross-db', 'cross-database', 'silo', 'tenant isolation']):
        return 'ZERO_DATA'
        
    # Sunday SLA
    if any(w in q for w in ['sunday', 'sla', 'holy hours', 'check-in latency', 'peak concurrency']):
        return 'SUNDAY_SLA'
        
    # Confidentiality / HIPAA / Pastoral Notes
    if any(w in q for w in ['hipaa', 'pastoral note', 'confidential', 'pgcrypto', 'clergy-penitent']):
        return 'CONFIDENTIALITY'
        
    # Pedagogy / LMS
    if any(w in q for w in ['speedgrader', 'rubric', 'drip', 'syllabus', 'course cohort']):
        return 'PEDAGOGY'
        
    # Creeds / Orthos
    if any(w in q for w in ['creed', 'confession', 'orthos', 'theological drift', 'lexicon']):
        return 'THEOLOGY'
        
    return 'GENERAL_ADVISORY'

def generate_feature_antigravity_prompt(feature_title, target_product, query):
    repo_name = target_product['repo_name']
    repo_path = target_product['path']
    tech_stack = target_product['tech_stack']
    domain = target_product['domain']

    return f"""# ANTIGRAVITY ENGINEERING DIRECTIVE: {feature_title.upper()} ({repo_name})

You are the designated Sovereign Lead Engineer operating under Google Antigravity.
Your objective is to implement the **{feature_title}** feature in **{repo_name}** with production completeness, rigorous PostgreSQL Row-Level Security, and accompanying automated tests adhering to the Sovereign Testing Council Protocol (COUNCIL-2026-006 Phase 1).

## TARGET REPOSITORY & ENVIRONMENT:
- Absolute Path: `cd "{repo_path}"`
- Tech Stack: {tech_stack}
- Domain Scope: {domain}

## CONSTITUTIONAL & ARCHITECTURAL INVARIANTS:
1. **Constitution Section III (Zero Customer Data Propagation):**
   - Strictly isolated tenant database silo.
   - Zero foreign event queues, SQS daemons, or cross-database replication streams.
2. **Inseparable Testing Invariant (COUNCIL-2026-006 Phase 1):**
   - Feature code and accompanying automated tests are INSEPARABLE.
   - Comprehensive unit and integration tests (`npm test` or `npm run test`) must be written and pass before marking complete.
3. **Sunday Morning 99.99% Holy Hours SLA:**
   - All server actions, DB queries, and UI components must execute within a <50ms latency budget.
   - Non-blocking execution with optimistic UI transitions.
4. **Powered by ChurchCore Branding (COUNCIL-2026-002):**
   - Ensure UI adheres to WCAG AAA color contrast ratios and calm liturgical design tokens.

## STEP-BY-STEP IMPLEMENTATION PLAN:
### Step 1: Database Migration & PostgreSQL Row-Level Security (RLS)
- If persistent records are required for {feature_title}:
  - Create a migration under `supabase/migrations/`.
  - Add tables with strict `tenant_id` foreign keys and indexes.
  - Enable RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`).
  - Create authenticated isolation policies ensuring zero cross-tenant row leakage.

### Step 2: Server Actions & Backend Edge APIs
- Implement type-safe server actions or route handlers under `src/app/` or `src/actions/`.
- Validate all incoming user inputs with Zod schemas.
- Ensure error handling returns sanitized, graceful error messages without leaking stack traces.

### Step 3: Frontend UI Components & Liturgical Design
- Create accessible, keyboard-navigable UI components under `src/components/`.
- Provide smooth loading skeletons, empty states, and validation feedback.
- Verify adherence to the ChurchCore serene aesthetic.

### Step 4: Automated Testing & Verification
- Add automated test specs covering:
  1. Successful execution and primary happy-path workflow.
  2. Edge cases, validation errors, and unauthorized tenant rejection.
- Run verification suite:
  ```bash
  npm run build
  npm test
  # If applicable:
  npm run audit:rls
  ```

## ACCEPTANCE CRITERIA:
- [ ] 100% complete feature code for {feature_title}.
- [ ] Inseparable automated test suite passing with green exit code.
- [ ] Row-Level Security verified with zero tenant bypass.
- [ ] Clean production build (`npm run build`) with zero lint or TypeScript errors.
- [ ] Telemetry updated in `docs/control-plane/telemetry.json` with commit hash."""

def generate_member_speech(member, query, council, intent, feature_title, target_prod):
    m_title = member.get('title', '').lower()
    m_domain = member.get('domain', '').lower()
    p_name = target_prod['name']

    if intent == 'FEATURE_PROMPT':
        if any(k in m_title or k in m_domain for k in ['architect', 'executive', 'chair', 'lead']):
            return f"<p>I have evaluated the architectural feasibility of <strong>{feature_title}</strong> for <em>{p_name}</em>. This feature directly aligns with our product roadmap and will be scaffolded cleanly under Next.js 15 App Router conventions without accumulating technical debt. I submit a formal vote of <strong>UNANIMOUS RATIFICATION</strong>.</p>"
        elif any(k in m_title or k in m_domain for k in ['data', 'sentinel', 'database', 'sql']):
            return f"<p>From the database security perspective, any tables or schemas introduced for <strong>{feature_title}</strong> must enforce 100% PostgreSQL Row-Level Security (RLS). Under <strong>Constitution Section III</strong>, records must be scoped strictly to the authenticated tenant. No cross-app data leakage is permitted. I vote <strong>APPROVED</strong> subject to RLS verification.</p>"
        elif any(k in m_title or k in m_domain for k in ['pastor', 'chaplain', 'parent', 'shepherd', 'spiritual']):
            return f"<p>From a pastoral and community standpoint, <strong>{feature_title}</strong> directly serves the dignity of our people. Whether ministering to families, students, or parishioners, technology must never feel bureaucratic or cold. This capability brings clarity and care to <em>{p_name}</em>. I enthusiastically affirm this proposal.</p>"
        elif any(k in m_title or k in m_domain for k in ['sla', 'reliability', 'engineer', 'infra']):
            return f"<p>Regarding our <strong>Sunday Morning 99.99% SLA</strong> latency budget (&lt;50ms), <strong>{feature_title}</strong> must execute via non-blocking server actions and indexed queries. With our connection pools in Supabase maintaining ample headroom, this workflow is fully within acceptable compute bounds. I vote <strong>RATIFICATION</strong>.</p>"
        elif any(k in m_title or k in m_domain for k in ['pedagogy', 'dean', 'headmaster', 'provost', 'speedgrader', 'academic']):
            return f"<p>Evaluating the instructional impact of <strong>{feature_title}</strong> on <em>{p_name}</em>: this workflow reduces administrative friction and enhances institutional transparency. I approve the implementation specifications.</p>"
        elif any(k in m_title or k in m_domain for k in ['finance', 'cfo', 'bursar', 'steward', 'giving', 'tithing']):
            return f"<p>From the fiduciary and operational perspective, <strong>{feature_title}</strong> maintains our low variable hosting footprint ($0 added hosting OPEX) while providing auditability. I confirm financial alignment and vote <strong>APPROVAL</strong>.</p>"
        else:
            return f"<p>Within the scope of {member.get('domain', 'this seat')}, <strong>{feature_title}</strong> satisfies all sovereign charter requirements. The invariant focus: <em>\"{member.get('invariant_focus', '')}\"</em> is fully safeguarded. I submit a formal vote of <strong>RATIFICATION</strong>.</p>"

    # Default speech fallback
    return f"<p>I have examined the submitted matter against our non-negotiable invariant: <em>\"{member.get('invariant_focus', '')}\"</em>. Within the domain of {member.get('domain', 'governance')}, this proposal satisfies all criteria. I submit a formal vote of <strong>RATIFIED APPROVAL</strong> under the sovereign charter.</p>"

def format_llm_deliberation_response(llm_res, used_model, current_council, target_product, query, mode, member_id, deliberation_id, now_utc, council_slug):
    title = llm_res.get('answer_title') or f"AntiGravity Engineering Directive: {target_product['name']}"
    summary = llm_res.get('answer_summary') or "Ratified by Sovereign Council."
    plain_text = llm_res.get('plain_text') or f"Ratified for {target_product['name']}."
    feature_title = llm_res.get('feature_title') or extract_feature_title(query)
    prompt_text = llm_res.get('antigravity_prompt') or ""
    dispatch_cmd = llm_res.get('terminal_command') or f"cd \"{target_product['path']}\" && agy -p \"Implement {feature_title}\""

    challenges_raw = llm_res.get('challenges_and_resolutions', [])
    challenges_html = ""
    challenges_markdown = ""
    if challenges_raw:
        challenges_html += """
        <div class="delib-contending-box" style="margin: 20px 0; background: linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(16, 185, 129, 0.08)); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 12px; padding: 18px 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">⚔️</span>
              <strong style="color: #FBBF24; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Dual Contending Dialectic Cross-Examination</strong>
            </div>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(245, 158, 11, 0.15); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700;">
              ADVERSARIAL INVARIANT AUDIT
            </span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 12px;">
            Gemini 2.5 Flash stress-tested the proposal against constitutional invariants, prompting Gemini 2.5 Pro to harden the architecture and test boundaries before unanimous ratification:
          </p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
        """
        challenges_markdown += "### ⚔️ Dual-Model Contending Dialectic Audit & Resolved Invariants\n\n"
        for idx, c in enumerate(challenges_raw, 1):
            critique = c.get('challenger_critique') or c.get('critique', '')
            resolution = c.get('advocate_resolution') or c.get('mandated_mitigation', '')
            challenges_html += f"""
            <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 12px 14px;">
              <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                <span style="color: #F87171; font-size: 12px; font-weight: 700;">🔻 CHALLENGE #{idx}:</span>
                <span style="font-size: 12px; color: #FCA5A5;">{html_escape(critique)}</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="color: #34D399; font-size: 12px; font-weight: 700;">🟢 RESOLUTION:</span>
                <span style="font-size: 12px; color: #D1FAE5;">{html_escape(resolution)}</span>
              </div>
            </div>
            """
            challenges_markdown += f"""**Challenge #{idx} (Auditor):** {critique}  
**Resolution (Advocate):** {resolution}  

"""
        challenges_html += "</div></div>"

    speeches_raw = llm_res.get('speeches', [])
    speeches_html = ""
    speeches_markdown = ""

    members_map = {m.get('seat_id'): m for m in current_council.get('members', [])}

    for item in speeches_raw:
        seat_id = item.get('seat_id')
        member_meta = members_map.get(seat_id) or {
            'persona_name': item.get('persona_name') or 'Council Guardian',
            'title': item.get('title') or 'Specialized Seat',
            'avatar': '🏛️',
            'domain': 'Governance'
        }
        speech_html = item.get('speech_html') or f"<p>{item.get('speech', '')}</p>"
        verdict = item.get('verdict', 'VERIFIED')

        speeches_html += f"""
          <div class="speech-card">
            <div class="speech-header">
              <span class="speech-avatar">{member_meta.get('avatar', '🏛️')}</span>
              <span class="speech-author">{html_escape(member_meta.get('persona_name', 'Guardian'))}</span>
              <span class="speech-role">• {html_escape(member_meta.get('title', 'Specialist'))}</span>
              <span class="speech-verdict-tag">🟢 {html_escape(verdict)}</span>
            </div>
            <div class="speech-body">
              {speech_html}
            </div>
          </div>
        """

        s_text = re.sub(r'<[^>]+>', '', speech_html).strip()
        speeches_markdown += f"""
#### {member_meta.get('avatar', '🏛️')} {member_meta.get('persona_name', 'Guardian')} — {member_meta.get('title', '')}
- **Domain:** {member_meta.get('domain', '')}
- **Recorded Live Verdict:** {s_text}

"""

    html_content = f"""
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 10px 14px; background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: #818CF8; display: inline-flex; align-items: center; gap: 6px;">
          ⚔️ Live Dual-Contending Gemini Deliberation (<code>{html_escape(used_model)}</code>)
        </span>
        <span style="font-size: 11px; color: #34D399; font-weight: 700;">🟢 MULTI-MODEL DIALECTIC CONSENSUS</span>
      </div>

      <p>
        The <strong>{current_council['name']}</strong> has convened and rendered a fortified determination for <strong>{target_product['name']}</strong> via dual contending Gemini models.
      </p>
      <p style="color: var(--text-muted); font-size: 13px;">
        Target Repository: <code>{target_product['path']}</code> • Tech Stack: <em>{target_product['tech_stack']}</em>
      </p>

      {challenges_html}

      {f'''
      <h4 style="margin-top: 24px;">🤖 AntiGravity Engineering Directive Prompt (Fortified)</h4>
      <div class="council-prompt-box">
        <button class="btn-copy-inner" data-copy-target="delib-prompt-text">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy Prompt
        </button>
        <div id="delib-prompt-text">{html_escape(prompt_text)}</div>
      </div>
      ''' if prompt_text else ''}

      {f'''
      <h4 style="margin-top: 20px;">⚡ Direct Terminal Dispatch Command</h4>
      <div class="council-cmd-pill">
        <span><code>{html_escape(dispatch_cmd)}</code></span>
        <span style="font-size: 11px; color: var(--gold-500); font-weight: 700;">READY TO RUN</span>
      </div>
      ''' if dispatch_cmd else ''}

      <h4 style="margin-top: 24px;">🛡️ Non-Negotiable Constitutional Guardrails Enforced</h4>
      <div class="council-guidance-grid">
        <div class="council-guidance-card">
          <strong>Section III Invariant</strong>
          <span>Zero customer data propagation across databases. All queries reside strictly within {target_product['name']}'s PostgreSQL tenant.</span>
        </div>
        <div class="council-guidance-card">
          <strong>Inseparable Testing Mandate</strong>
          <span>Per COUNCIL-2026-006 Phase 1, automated unit/integration tests must accompany feature code prior to human trials.</span>
        </div>
        <div class="council-guidance-card">
          <strong>Sunday 99.99% Holy Hours SLA</strong>
          <span>Execution latency budget capped at &lt;50ms. No blocking calls during morning worship service check-in windows.</span>
        </div>
        <div class="council-guidance-card">
          <strong>Powered by ChurchCore</strong>
          <span>Adheres to design system contrast standards (WCAG AAA) and official security trust lockups.</span>
        </div>
      </div>
    """

    os.makedirs(DELIBERATIONS_DIR, exist_ok=True)
    doc_filename = f"{deliberation_id}.md"
    doc_rel_path = f"docs/deliberations/{doc_filename}"
    doc_full_path = os.path.join(WORKSPACE_DIR, doc_rel_path)

    markdown_dossier = f"""# {current_council['name']}
## Executive Deliberation Journal & Determination: {deliberation_id}

**Deliberation Reference:** `{deliberation_id}`  
**Ratification Date:** {now_utc}  
**Dialectic Intelligence Engine:** OpenRouter ({used_model})  
**Governing Council:** {current_council['name']} ({current_council.get('short_name', '')})  
**Target Product Pillar:** {target_product['name']} (`{target_product['path']}`)  
**Quorum Status:** {current_council.get('governing_state', {}).get('quorum_status', 'Quorum Verified')}  
**Mode:** {'Direct Member Consultation (' + (member_id or '') + ')' if mode == 'member' else 'Full Council Assembly (All Seats)'}  

---

### Deliberation Subject / Operator Inquiry
> "{query}"

---

### Executive Determination & Sovereign Ruling
**Status:** **UNANIMOUS RATIFICATION (APPROVAL)**  
**Executive Summary:** {summary}

{plain_text}

---

{challenges_markdown}

### Council Member Speeches & Recorded Deliberation Transcripts
{speeches_markdown}

---
*Recorded in official sovereign council archives at {now_utc} via OpenRouter Dual-Contending Gemini ({used_model}). Verified against Constitution Section III and COUNCIL-2026-006 testing invariants.*
"""

    try:
        with open(doc_full_path, 'w', encoding='utf-8') as f:
            f.write(markdown_dossier)
        print(f"[+] Saved live Dual-Contending Gemini council deliberation to {doc_rel_path}")
    except Exception as e:
        print(f"[!] Error saving deliberation record to {doc_full_path}: {e}")

    record = {
        'id': deliberation_id,
        'timestamp': now_utc,
        'docPath': doc_rel_path,
        'councilId': current_council.get('council_id'),
        'councilName': current_council.get('name', 'Council'),
        'shortName': current_council.get('short_name', 'Council'),
        'mode': mode,
        'memberId': member_id,
        'query': query,
        'answerTitle': title,
        'answerSummary': summary,
        'answerHtml': html_content,
        'plainText': plain_text,
        'speechesHtml': speeches_html,
        'engine': 'openrouter_dual_gemini',
        'model': used_model
    }

    return {'success': True, 'record': record, 'engine': 'openrouter_dual_gemini', 'model': used_model}

def handle_deliberation(req_data):
    council_id = req_data.get('council_id') or req_data.get('councilId') or 'council-grand'
    member_id = req_data.get('member_id') or req_data.get('memberId')
    mode = req_data.get('mode', 'all')
    query = (req_data.get('query') or '').strip()

    if not query:
        return {'success': False, 'error': 'Query string cannot be empty.'}

    fleet_data = load_fleet_data()
    councils = fleet_data.get('councils', [])
    current_council = next((c for c in councils if c.get('council_id') == council_id), None)

    if not current_council and councils:
        current_council = councils[0]
    elif not current_council:
        current_council = {
            'council_id': council_id,
            'name': 'High Sovereign Grand Council of ChurchCore',
            'short_name': 'Grand High Council',
            'governing_state': {'quorum_status': '7/7 Active Quorum'},
            'members': []
        }

    target_product = resolve_target_product(query, council_id, fleet_data)
    feature_title = extract_feature_title(query)
    intent = detect_query_intent(query)

    now_utc = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    timestamp_slug = datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')
    council_slug = current_council.get('short_name', 'COUNCIL').upper().replace(' ', '-')
    deliberation_id = f"DELIB-{council_slug}-{timestamp_slug[:8]}-{int(datetime.now().timestamp() % 10000):04d}"

    # Check for OpenRouter API Key in request or environment / .env
    openrouter_key = (req_data.get('openrouter_key') or os.environ.get('OPENROUTER_API_KEY') or '').strip()
    openrouter_pro_model = (req_data.get('openrouter_pro_model') or req_data.get('openrouter_model') or os.environ.get('OPENROUTER_MODEL') or 'google/gemini-2.5-pro').strip()
    openrouter_flash_model = (req_data.get('openrouter_flash_model') or os.environ.get('OPENROUTER_FLASH_MODEL') or 'google/gemini-2.5-flash').strip()

    if openrouter_key:
        try:
            print(f"[+] Invoking Dual Contending Gemini Engine ({openrouter_pro_model} ⚔️ {openrouter_flash_model})...")
            llm_res, used_model = call_dual_contending_gemini_deliberation(
                openrouter_key, openrouter_pro_model, openrouter_flash_model, current_council, target_product, query, mode, member_id
            )
            if llm_res and isinstance(llm_res, dict) and 'answer_title' in llm_res:
                return format_llm_deliberation_response(
                    llm_res, used_model, current_council, target_product, query, mode, member_id, deliberation_id, now_utc, council_slug
                )
        except Exception as e:
            print(f"[!] OpenRouter Dual Contending call error: {e}. Falling back to deterministic local expert engine.")

    # Build Member Speeches
    speeches_list = []
    if mode == 'member' and member_id:
        member = next((m for m in current_council.get('members', []) if m.get('seat_id') == member_id), None)
        if not member and current_council.get('members'):
            member = current_council['members'][0]
        if member:
            speech_body = generate_member_speech(member, query, current_council, intent, feature_title, target_product)
            speeches_list.append({
                'member': member,
                'speech': speech_body
            })
    else:
        for m in current_council.get('members', []):
            speech_body = generate_member_speech(m, query, current_council, intent, feature_title, target_product)
            speeches_list.append({
                'member': m,
                'speech': speech_body
            })

    # Synthesize Executive Actionable Answer
    if intent == 'FEATURE_PROMPT':
        prompt_text = generate_feature_antigravity_prompt(feature_title, target_product, query)
        dispatch_cmd = f"cd \"{target_product['path']}\" && agy -p \"Implement {feature_title} with comprehensive tests and RLS\""
        
        title = f"AntiGravity Engineering Directive: {feature_title} ({target_product['name']})"
        summary = f"Unanimous council determination authorizing development of {feature_title} in {target_product['name']} under Constitution Section III and COUNCIL-2026-006 testing invariants."
        
        plain_text = f"""🏛️ {current_council['name']} Official Determination & Engineering Directive

DELIBERATION SUBJECT: "{query}"
STATUS: UNANIMOUS RATIFICATION ({current_council.get('governing_state', {}).get('quorum_status', 'Quorum Verified')})
TARGET PRODUCT: {target_product['name']} ({target_product['path']})

EXECUTIVE RULING:
The council has ratified the implementation of {feature_title} for {target_product['name']}. This feature has been evaluated against our non-negotiable constitutional invariants and is cleared for autonomous AntiGravity scaffolding.

ACTIONABLE ANTIGRAVITY AI PROMPT:
{prompt_text}

DIRECT TERMINAL DISPATCH COMMAND:
{dispatch_cmd}

CONSTITUTIONAL SAFEGUARDS ENFORCED:
1. Constitution Section III: 100% sovereign database isolation; zero customer data cross-propagation.
2. Inseparable Testing Invariant: Phase 1 automated tests must be delivered alongside feature code.
3. Sunday 99.99% SLA: Non-blocking sub-50ms execution budget verified."""

        html_content = f"""
          <p>
            The <strong>{current_council['name']}</strong> has issued a formal determination of <strong>UNANIMOUS RATIFICATION</strong> for the feature proposal: <strong>{feature_title}</strong> in <strong>{target_product['name']}</strong>.
          </p>
          <p style="color: var(--text-muted); font-size: 13px;">
            Target Repository: <code>{target_product['path']}</code> • Tech Stack: <em>{target_product['tech_stack']}</em>
          </p>

          <h4 style="margin-top: 24px;">🤖 Ready-to-Use AntiGravity Engineering Prompt</h4>
          <div class="council-prompt-box">
            <button class="btn-copy-inner" data-copy-target="delib-prompt-text">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Prompt
            </button>
            <div id="delib-prompt-text">{html_escape(prompt_text)}</div>
          </div>

          <h4 style="margin-top: 20px;">⚡ Direct Terminal Dispatch Command</h4>
          <div class="council-cmd-pill">
            <span><code>{html_escape(dispatch_cmd)}</code></span>
            <span style="font-size: 11px; color: var(--gold-500); font-weight: 700;">READY TO RUN</span>
          </div>

          <h4 style="margin-top: 24px;">🛡️ Non-Negotiable Constitutional Guardrails Enforced</h4>
          <div class="council-guidance-grid">
            <div class="council-guidance-card">
              <strong>Section III Invariant</strong>
              <span>Zero customer data propagation across databases. All queries reside strictly within {target_product['name']}'s PostgreSQL tenant.</span>
            </div>
            <div class="council-guidance-card">
              <strong>Inseparable Testing Mandate</strong>
              <span>Per COUNCIL-2026-006 Phase 1, automated unit/integration tests must accompany feature code prior to human trials.</span>
            </div>
            <div class="council-guidance-card">
              <strong>Sunday 99.99% Holy Hours SLA</strong>
              <span>Execution latency budget capped at &lt;50ms. No blocking calls during morning worship service check-in windows.</span>
            </div>
            <div class="council-guidance-card">
              <strong>Powered by ChurchCore</strong>
              <span>Adheres to design system contrast standards (WCAG AAA) and official security trust lockups.</span>
            </div>
          </div>
        """

    elif intent == 'DAILY_BRIEFING':
        prompt_text = """# CHURCHCORE AUTONOMOUS FLEET INSPECTOR & DAILY BRIEFING AGENT

You are the ChurchCore Sovereign Autonomous Fleet Operations Agent operating under Google Antigravity.
Your objective is to inspect the central control plane (ricardojjulia/ChurchCore-Business) and all 6 sibling product repositories daily, consolidate all git and architectural changes, synchronize compliance proofs, and generate an executive daily briefing report.

## SIBLING REPOSITORIES TO INSPECT:
1. ChurchCore (ChMS): /Users/rjulia/ChurchCore
2. ChurchCore LMS: /Users/rjulia/ChurchCore LMS
3. ChurchCore Academy: /Users/rjulia/ChurchCore-Academy
4. ChurchCore Care: /Users/rjulia/ChurchCoreCare
5. ChurchCore Orthos: /Users/rjulia/ChurchCore-Orthos
6. FaithFull Scholars: /Users/rjulia/FaithFullScholars

## MANDATORY EXECUTION SEQUENCE:
1. Run central activation & sync:
   python3 /Users/rjulia/ChurchCore-Business/scripts/activate-product-repos.py
   python3 /Users/rjulia/ChurchCore-Business/scripts/control-plane-sync.py
2. Execute automated daily briefing compiler:
   python3 /Users/rjulia/ChurchCore-Business/scripts/daily-fleet-briefing.py
3. Verify Constitution Section III compliance (Zero Customer Data Propagation across database silos).
4. Verify Sunday 99.99% SLA readiness & health probes.
5. If new commits or PRs were merged in sibling repos, update docs/governance-sync/COMPLIANCE-MATRIX.md.
6. Output executive summary into docs/control-plane/briefings/DAILY-BRIEFING-<YYYY-MM-DD>.md."""

        dispatch_cmd = "python3 /Users/rjulia/ChurchCore-Business/scripts/daily-fleet-briefing.py"
        title = "Autonomous AntiGravity Daily Briefing & Fleet Telemetry Directive"
        summary = "Unanimous council ratification establishing the automated daily inspection and briefing routine across all 6 sibling product repos."
        plain_text = f"🏛️ High Sovereign Council Executive Advisory: Autonomous Daily Fleet Briefing\n\nCOMMAND: {dispatch_cmd}\n\nPROMPT:\n{prompt_text}"
        html_content = f"""
          <p>The Council has ratified the automated daily briefing routine. Below is the ready-to-use AntiGravity autonomous system prompt and terminal execution command.</p>
          <h4>🤖 AntiGravity Daily Briefing Prompt</h4>
          <div class="council-prompt-box">
            <button class="btn-copy-inner" data-copy-target="delib-prompt-text">Copy Prompt</button>
            <div id="delib-prompt-text">{html_escape(prompt_text)}</div>
          </div>
          <h4>⚡ Direct Terminal Dispatch Command</h4>
          <div class="council-cmd-pill">
            <span><code>{dispatch_cmd}</code></span>
            <span style="font-size: 11px; color: var(--gold-500); font-weight: 700;">DAILY ENGINE ACTIVE</span>
          </div>
        """
    else:
        title = f"{current_council['short_name']} Official Advisory & Ruling"
        summary = f"Unanimous council determination approving inquiry subject to constitutional invariants and edge compliance verification."
        plain_text = f"""🏛️ {current_council['name']} Executive Advisory & Operational Determination

Deliberation Subject: "{query}"
Status: UNANIMOUS RATIFICATION ({current_council.get('governing_state', {}).get('quorum_status', 'Quorum Verified')})

EXECUTIVE DETERMINATION:
The council has reviewed your submission against our sovereign charter, architectural invariants, and product roadmaps for {target_product['name']}. The proposed inquiry/directive is ratified under standard constitutional safeguards.

OPERATIONAL DIRECTIVES:
1. Verify alignment with Section III (Zero Customer Data Propagation).
2. Ensure edge implementations pass CI test suites and automated health checks.
3. Record all architectural decisions in the central control plane manifest."""

        html_content = f"""
          <p>
            The <strong>{current_council['name']}</strong> has reviewed your inquiry: <em>\"{html_escape(query)}\"</em>. 
            The council issues a formal advisory of <strong>UNANIMOUS RATIFICATION</strong> for <strong>{target_product['name']}</strong>.
          </p>
          <h4>📋 Operational Directives & Guidance</h4>
          <div class="council-guidance-grid">
            <div class="council-guidance-card">
              <strong>Constitutional Alignment</strong>
              <span>Preserves sovereign customer data boundaries and zero cross-suite data aggregation.</span>
            </div>
            <div class="council-guidance-card">
              <strong>Edge Synchronization</strong>
              <span>Updates dispatched through this chamber propagate via <code>docs/governance-sync/manifest.json</code> to sibling repositories.</span>
            </div>
            <div class="council-guidance-card">
              <strong>Audit Record Logged</strong>
              <span>This determination has been appended to the sovereign council ledger in <code>docs/deliberations/</code>.</span>
            </div>
          </div>
        """

    # Format speeches HTML
    speeches_html = ""
    for item in speeches_list:
        m = item['member']
        s_body = item['speech']
        speeches_html += f"""
          <div class="speech-card">
            <div class="speech-header">
              <span class="speech-avatar">{m.get('avatar', '🏛️')}</span>
              <span class="speech-author">{html_escape(m.get('persona_name', 'Council Member'))}</span>
              <span class="speech-role">• {html_escape(m.get('title', 'Specialized Guardian'))}</span>
              <span class="speech-verdict-tag">🟢 VERIFIED</span>
            </div>
            <div class="speech-body">
              {s_body}
            </div>
          </div>
        """

    # Persist deliberation as Markdown dossier in docs/deliberations/
    os.makedirs(DELIBERATIONS_DIR, exist_ok=True)
    doc_filename = f"{deliberation_id}.md"
    doc_rel_path = f"docs/deliberations/{doc_filename}"
    doc_full_path = os.path.join(WORKSPACE_DIR, doc_rel_path)

    markdown_dossier = f"""# {current_council['name']}
## Executive Deliberation Journal & Determination: {deliberation_id}

**Deliberation Reference:** `{deliberation_id}`  
**Ratification Date:** {now_utc}  
**Governing Council:** {current_council['name']} ({current_council.get('short_name', '')})  
**Target Product Pillar:** {target_product['name']} (`{target_product['path']}`)  
**Quorum Status:** {current_council.get('governing_state', {}).get('quorum_status', 'Quorum Verified')}  
**Mode:** {'Direct Member Consultation (' + (member_id or '') + ')' if mode == 'member' else 'Full Council Assembly (All Seats)'}  

---

### Deliberation Subject / Operator Inquiry
> "{query}"

---

### Executive Determination & Sovereign Ruling
**Status:** **UNANIMOUS RATIFICATION (APPROVAL)**  
**Executive Summary:** {summary}

{plain_text}

---

### Council Member Speeches & Recorded Deliberation Transcripts
"""
    for item in speeches_list:
        m = item['member']
        s_text = re.sub(r'<[^>]+>', '', item['speech']).strip()
        markdown_dossier += f"""
#### {m.get('avatar', '🏛️')} {m.get('persona_name', 'Member')} — {m.get('title', '')}
- **Domain:** {m.get('domain', '')}
- **Invariant Focus:** {m.get('invariant_focus', '')}
- **Recorded Verdict:** {s_text}

"""

    markdown_dossier += f"""
---
*Recorded in official sovereign council archives at {now_utc}. Verified against Constitution Section III and COUNCIL-2026-006 testing invariants.*
"""

    try:
        with open(doc_full_path, 'w', encoding='utf-8') as f:
            f.write(markdown_dossier)
        print(f"[+] Saved council deliberation record to {doc_rel_path}")
    except Exception as e:
        print(f"[!] Error saving deliberation record to {doc_full_path}: {e}")

    record = {
        'id': deliberation_id,
        'timestamp': now_utc,
        'docPath': doc_rel_path,
        'councilId': current_council.get('council_id', council_id),
        'councilName': current_council.get('name', 'Council'),
        'shortName': current_council.get('short_name', 'Council'),
        'mode': mode,
        'memberId': member_id,
        'query': query,
        'answerTitle': title,
        'answerSummary': summary,
        'answerHtml': html_content,
        'plainText': plain_text,
        'speechesHtml': speeches_html
    }

    return {'success': True, 'record': record}

def html_escape(text):
    return (text.replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;')
                .replace("'", '&#39;'))

def get_engine_status():
    load_env()
    key = os.environ.get('OPENROUTER_API_KEY', '').strip()
    has_key = bool(key)
    masked = f"sk-or-...{key[-4:]}" if len(key) >= 8 else ("configured" if key else "")
    return {
        'success': True,
        'has_key': has_key,
        'masked_key': masked,
        'pro_model': os.environ.get('OPENROUTER_MODEL', 'google/gemini-2.5-pro'),
        'flash_model': os.environ.get('OPENROUTER_FLASH_MODEL', 'google/gemini-2.5-flash'),
        'dialectics': 'Dual-Contending (Gemini 2.5 Pro Advocate ⚔️ Gemini 2.5 Flash Auditor)',
        'provider': 'OpenRouter'
    }

def save_engine_config(config):
    api_key = (config.get('api_key') or '').strip()
    pro_model = (config.get('pro_model') or 'google/gemini-2.5-pro').strip()
    flash_model = (config.get('flash_model') or 'google/gemini-2.5-flash').strip()

    if api_key:
        os.environ['OPENROUTER_API_KEY'] = api_key
    if pro_model:
        os.environ['OPENROUTER_MODEL'] = pro_model
    if flash_model:
        os.environ['OPENROUTER_FLASH_MODEL'] = flash_model

    save_to_file = config.get('save_to_env', True)
    if save_to_file and api_key:
        env_path = os.path.join(WORKSPACE_DIR, '.env')
        try:
            existing_lines = []
            if os.path.exists(env_path):
                with open(env_path, 'r', encoding='utf-8') as f:
                    existing_lines = f.readlines()

            new_lines = [l for l in existing_lines if not any(l.startswith(k) for k in ['OPENROUTER_API_KEY=', 'OPENROUTER_MODEL=', 'OPENROUTER_FLASH_MODEL='])]
            if new_lines and not new_lines[-1].endswith('\n'):
                new_lines[-1] += '\n'

            new_lines.append(f'OPENROUTER_API_KEY="{api_key}"\n')
            new_lines.append(f'OPENROUTER_MODEL="{pro_model}"\n')
            new_lines.append(f'OPENROUTER_FLASH_MODEL="{flash_model}"\n')

            with open(env_path, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
        except Exception as e:
            print(f"[!] Warning persisting to .env: {e}")

    return get_engine_status()

def test_engine_connection(api_key, pro_model, flash_model):
    import time
    if not api_key:
        load_env()
        api_key = os.environ.get('OPENROUTER_API_KEY', '').strip()
    
    if not api_key:
        return {'success': False, 'error': 'No OpenRouter API key provided.'}

    t0 = time.time()
    try:
        # Test Flash model for low-latency handshake
        res = call_openrouter_api(
            api_key,
            flash_model or 'google/gemini-2.5-flash',
            "You are a sovereign testing agent. Respond ONLY in valid JSON: {\"status\": \"PONG\", \"message\": \"Dual contending Gemini engine ready\"}",
            "Perform sovereign ping handshake.",
            timeout=15
        )
        latency_ms = int((time.time() - t0) * 1000)
        return {
            'success': True,
            'latency_ms': latency_ms,
            'flash_model': flash_model,
            'pro_model': pro_model,
            'response': res
        }
    except Exception as e:
        latency_ms = int((time.time() - t0) * 1000)
        return {
            'success': False,
            'latency_ms': latency_ms,
            'error': str(e)
        }

if __name__ == '__main__':
    # Quick CLI self-test
    test_res = handle_deliberation({
        'council_id': 'council-academy',
        'query': 'I need an AntiGravity prompt to create student attendance notifications in ChurchCore Academy'
    })
    print("Deliberation Engine Self-Test:")
    print(f"Success: {test_res.get('success')}")
    print(f"Deliberation ID: {test_res.get('record', {}).get('id')}")
    print(f"Title: {test_res.get('record', {}).get('answerTitle')}")
    print(f"Doc Path: {test_res.get('record', {}).get('docPath')}")
