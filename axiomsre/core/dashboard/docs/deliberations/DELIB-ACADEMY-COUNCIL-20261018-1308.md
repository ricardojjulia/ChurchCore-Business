# ChurchCore Academy K-12 Christian Pedagogy Council
## Executive Deliberation Journal & Determination: DELIB-ACADEMY-COUNCIL-20261018-1308

**Deliberation Reference:** `DELIB-ACADEMY-COUNCIL-20261018-1308`  
**Ratification Date:** 2026-10-18 16:35:08 UTC  
**Dialectic Intelligence Engine:** OpenRouter (google/gemini-2.5-pro ⚔️ google/gemini-2.5-flash)  
**Governing Council:** ChurchCore Academy K-12 Christian Pedagogy Council (Academy Council)  
**Target Product Pillar:** ChurchCore Academy (`/Users/rjulia/ChurchCore-Academy`)  
**Quorum Status:** 5/5 Active Quorum  
**Mode:** Full Council Assembly (All Seats)  

---

### Deliberation Subject / Operator Inquiry
> "I need an AntiGravity prompt to build parent attendance push notifications in ChurchCore Academy"

---

### Executive Determination & Sovereign Ruling
**Status:** **UNANIMOUS RATIFICATION (APPROVAL)**  
**Executive Summary:** Following a rigorous adversarial audit by the Constitutional Auditor, the Sovereign Council unanimously ratifies a fortified architecture for Parent Attendance Push Notifications. The revised plan resolves all identified challenges regarding cross-tenant data security, system scalability under load, and test validation integrity. Mitigations include a decoupled queuing mechanism, tenant-scoped JWTs for Edge Functions, explicit RLS policies for service roles, and hardened E2E tests that verify notification payload integrity at the database level.

### ChurchCore Academy - Executive Directive

**REFERENCE:** SOV-COUNCIL-2026-007
**SUBJECT:** Fortified Parent Attendance Push Notifications
**STATUS:** Unanimously Ratified

**1. MANDATE**

Following a dialectic cross-examination initiated by the Constitutional Auditor, the Sovereign Council mandates the implementation of a fortified Parent Attendance Push Notification system. The initial proposal has been strengthened to address and resolve critical challenges related to multi-tenancy security, performance at scale, and end-to-end testing veracity. The final architecture ensures absolute data isolation between tenants, operational resilience during peak usage, and verifiable correctness of all generated notifications.

**2. ARCHITECTURAL FORTIFICATIONS**

The approved architecture incorporates the following non-negotiable mitigations:

*   **Tenant-Scoped Execution Context:** The core notification logic, executed within a Supabase Edge Function, is now required to operate using a tenant-specific JWT. This ensures all database operations are intrinsically confined to the data of the originating school, preventing any possibility of cross-tenant data access even with elevated execution privileges.
*   **Decoupled Queuing System:** To prevent a 'thundering herd' scenario and ensure immediate responsiveness for teachers, a queuing system is introduced. The initial database trigger will now publish a minimal payload to a queue. A separate, rate-limited Edge Function will process notifications from this queue, guaranteeing system stability and graceful handling of external service latencies.
*   **Hardened RLS Policies:** Row-Level Security policies have been extended. New policies will be implemented specifically for the `service_role` to enforce tenant isolation at the database layer, providing a critical secondary defense against unauthorized data access.
*   **Explicit Data Relationship Definition:** The `student_guardians` table, the critical link between students and parents, is now formally defined with its own stringent, tenant-aware RLS policies to uphold FERPA/COPPA compliance invariants.
*   **Verifiable End-to-End Testing:** The E2E testing protocol has been upgraded. Instead of merely checking for a UI change, tests must now perform a database-level assertion on the `notifications` table. This guarantees the content, language, and recipient of every generated notification payload are exactly correct.

**3. COUNCIL VERDICT**

The Council commends the Auditor for their vigorous critique and the technical team for their swift and robust resolutions. This process has transformed a sound proposal into a bulletproof system that fully embodies our commitment to parental partnership, data integrity, and operational excellence. The motion is carried, and the directive is ratified for immediate implementation.

---

### ⚔️ Dual-Model Contending Dialectic Audit & Resolved Invariants

**Challenge #1 (Auditor):** The Edge Function `attendance-push-trigger` will run with elevated privileges... there is no explicit mention of how the Edge Function's access to these tables is scoped to prevent cross-tenant data access... A compromised Edge Function with broad `service_role` access could potentially read all push subscriptions across all tenants.  
**Resolution (Advocate):** The architecture is fortified in two ways. First, the Edge Function is now mandated to instantiate a Supabase client with a JWT that explicitly asserts the `tenant_id` of the record being processed, scoping all subsequent queries. Second, we will implement new database RLS policies specifically for the `service_role` that prevent any operation from crossing tenant boundaries, providing defense-in-depth at the data layer itself.  

**Challenge #2 (Auditor):** A large number of simultaneous attendance updates (e.g., at the start of the school day) could lead to a thundering herd problem on the Edge Function, causing it to slow down, potentially leading to delayed notifications or resource exhaustion. External `web-push` calls add uncontrolled latency.  
**Resolution (Advocate):** The system is now decoupled. The database trigger no longer calls the Edge Function directly. Instead, it uses `pg_notify` to publish a job to a dedicated PostgreSQL channel. A separate `attendance-notification-processor` Edge Function listens to this channel, processing notifications from a queue. This isolates the teacher's action, smooths out processing load, and makes the system resilient. A circuit breaker pattern for external `web-push` calls is also mandated.  

**Challenge #3 (Auditor):** The E2E test... verifies UI update, it does not concretely verify the actual push notification *delivery*... the E2E test defers concrete verification of the end-to-end user experience of receiving the actual push message.  
**Resolution (Advocate):** The E2E test specification has been hardened. Direct OS-level push notification assertion is brittle. Therefore, we mandate a more robust verification: the test must use a task to query the database directly and assert that the `notifications` record for the recipient contains the exact, correct, and bilingual payload (`title_en`, `body_es`, etc.). This verifies the entire data generation and storage pipeline, which is the most critical component under our control.  

**Challenge #4 (Auditor):** The proposal... does not explicitly define the RLS policies on the `student_guardians` table, which is crucial for COPPA/FERPA compliance. A compromised Edge Function... could inadvertently fetch guardians for students outside the current tenant.  
**Resolution (Advocate):** The `student_guardians` table schema, complete with a non-nullable `tenant_id` and strict RLS policies, is now explicitly defined in the engineering prompt. All queries against this table, especially from the Edge Function, are required to be filtered by `tenant_id`, closing this data privacy loophole and ensuring student-guardian relationships are never exposed across tenant boundaries.  



### Council Member Speeches & Recorded Deliberation Transcripts

#### 🏫 Dr. Jonathan Edwards, Ed.D — Headmaster & Christian Curriculum Director
- **Domain:** Classical Christian Pedagogy, Biblical Worldview Integration & Faculty Oversight
- **Recorded Live Verdict:** Our initial directive was sound, but through rigorous examination, it has been made impenetrable. This dialectic process has proven its worth. The fortified system not only fulfills our duty of care through swift communication but does so with a resilience that protects the privacy of every family. This strengthens our covenant partnership by demonstrating our commitment to both transparency and security. I vote to ratify.


#### 🛡️ Maria Teresa De La Cruz — Parental Trust & Child Safety Guardian
- **Domain:** Family Portal Usability, Dismissal Security & Parent-Teacher Messaging
- **Recorded Live Verdict:** I am pleased to see my core requirement for instant notification was not only heard but stress-tested. The auditor's challenges identified potential privacy risks that I, as a parent, find unacceptable. The council's resolutions, particularly the safeguards preventing any possibility of data leaking between schools, give me the confidence I need. My trust is earned through this level of diligence. This is how we protect our children. I ratify.


#### 💳 Patricia Sterling, MBA — Tuition Billing & SIS Registrar
- **Domain:** Tuition Payment Plans, Family Multi-Child Discounts & State Voucher Tracking
- **Recorded Live Verdict:** The operational integrity of our attendance data is paramount for compliance. The initial design was good, but the addition of a queuing system makes it robust. Knowing that the system will remain stable and reliable even during the 'thundering herd' of morning check-ins ensures that the data pipeline for state reporting will not be compromised. This is operational excellence in practice. I ratify.


#### ⚡ Carlos Gomez (Agent SIS) — K-12 Student Information Systems Architect
- **Domain:** Attendance Rolls, Gradebook GPA Computation & Report Cards PDF
- **Recorded Live Verdict:** The architecture is now bulletproof. The auditor's critiques were valid, and the mitigations are correct. By decoupling the trigger with a queue, we've eliminated the 'thundering herd' risk. By mandating tenant-scoped JWTs and service-role RLS policies, we have created a double-layered defense against cross-tenant data exfiltration. The E2E test's focus on database payload verification is the right engineering choice for CI/CD reliability. The system is secure, scalable, and testable. I ratify.


#### 🌎 Pastora Gabriela Fuentes — Hispanic Christian Schooling Liaison
- **Domain:** Bilingual Curriculum Alignment, Latin American Academy Partnerships (Colegio Biblos)
- **Recorded Live Verdict:** Me complace ver el rigor con el que se ha examinado este plan. It is not enough to simply translate a message; we must ensure that the message of care is delivered reliably to every family, without fail. The technical improvements guarantee that our promise of clear communication, in the heart language of each family, is a promise we can keep. This demonstrates true respect. I wholeheartedly ratify this fortified directive.



---
*Recorded in official sovereign council archives at 2026-10-18 16:35:08 UTC via OpenRouter Dual-Contending Gemini (google/gemini-2.5-pro ⚔️ google/gemini-2.5-flash). Verified against Constitution Section III and COUNCIL-2026-006 testing invariants.*
