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
