# Operational Playbook: Vercel Firewall as an Emergency Mitigation

**Classification:** Operational Playbook (Incident Response)
**Status:** ACTIVE
**Applies To:** Every ecosystem product deployed on Vercel (`ChurchCore`, `ChurchCore-LMS`, `ChurchCore-Academy`, `ChurchCoreCare`, `ChurchCore-Orthos`, `FaithFullScholars`)
**Origin:** ChurchCore Testing Council run `tc6-2026-10-18-r1` (OMNI-a1b-security-01) and Council Review 60, 2026-10-18
**Last Updated:** 2026-10-18

---

## 1. Purpose

Use the Vercel Firewall (WAF custom rules) to **stop an exploitable request pattern at the edge within minutes**, while the code fix goes through the normal factory (Council, tests, PR, CI).

A firewall rule is a **stopgap. It never replaces the code fix.** It buys time and limits the blast radius.

**When to use it:**
- A security defect is confirmed and is live in production.
- The malicious request has a pattern that real users never send: a specific cookie, header, path, query parameter, method plus path, or user agent.
- The code fix will take longer than the time you're willing to stay exposed.

**When not to use it:**
- **The pattern overlaps real traffic.** Use `challenge`, `rate_limit` or a narrower condition instead, or accept the exposure until the fix ships.
- **The defect is inside a normal, authenticated request** (for example an RLS gap). The firewall can't tell those apart; fix the code.

## 2. Worked example (ChurchCore, 2026-10-18)

- **Defect.** A forged `churchcore_ops_session=sarah-platform` cookie made anyone a platform super-admin. A demo "preview session" fallback in `getSession()` had no environment guard.
- **Why a firewall rule fit.** Only the demo-persona sign-in ever set that cookie. Real users authenticate through Supabase's `sb-…` cookies, so denying any request that carries `churchcore_ops_session` blocks the attack and affects no real user.
- **What went wrong.** The rule was believed to be live, but `vercel firewall rules list` showed **"No custom rules configured."** It had never been saved and published.
  - The production probe with the forged cookie still reached the app, which answered 307 (the code fix had shipped by then).
  - A working firewall rule would have answered **403** at the edge.
- **Lesson.** **A firewall rule isn't live until you've seen it block from outside.** Always run step 4.3.

## 3. Choosing the condition

Before writing any rule, pick the narrowest condition that matches the attack and nothing legitimate.

| Attack shape | Condition (`type`, `op`) | Notes |
| :--- | :--- | :--- |
| A cookie real users never carry | `cookie` + `key` + `ex` (exists) | The 2026-10-18 case. Confirm in code that only the vulnerable path sets the cookie. |
| A cookie with one specific forged value | `cookie` + `key` + `eq` / `re` | Narrower. Use it when real users do carry the cookie. |
| A header | `header` + `key` + `ex` / `eq` / `sub` | For example, a spoofed internal header. |
| A route that should be unreachable publicly | `path` + `pre` / `eq`, optionally AND `method` | For example, block `POST /api/debug`. |
| One Next.js server action | `server_action` + `eq` | Blocks a single action, not the whole page. |
| Abuse volume (enumeration, brute force) | `rate_limit` keyed by `ip` | Pair it with `--duration` to keep the client blocked. |
| Requests from one environment | `environment` + `eq production` | Keep preview deployments usable for testing the fix. |

Operators: `eq`, `sub` (contains), `pre` (starts with), `suf`, `re` (regex), `ex` / `nex` (exists / not exists), `inc` (any of). Use `neg: true` to negate.

**Actions:**
- `deny` returns **403**.
- `challenge` shows a verification page; bots fail it.
- `log` matches without blocking.
- `bypass`, `rate_limit` and `redirect` also exist.

## 4. Procedure

### 4.1 Confirm the pattern is safe to block
1. Read the code. Find every place that **sets** the cookie, header or parameter you plan to block. Confirm no real user flow sends it.
2. If you aren't sure, ship the rule as **`log`** first and watch traffic for 10 minutes. Vercel recommends this; see §5.
3. Record the decision and its evidence in the incident's factory-run doc.

### 4.2 Create and publish the rule

**CLI (preferred, because it's reviewable and repeatable).** Vercel CLI 63+, linked to the project.

```bash
# 1. Stage the rule (drafts don't affect traffic)
vercel firewall rules add "Block forged preview session cookie" \
  --condition '{"type":"cookie","op":"ex","key":"churchcore_ops_session"}' \
  --action deny \
  --description "Interim mitigation for <defect id>; remove after the code fix is verified in prod" \
  --yes --scope <team>

# 2. Review what will change
vercel firewall diff --scope <team>

# 3. PUBLISH: without this, nothing happens
vercel firewall publish --yes --scope <team>

# 4. Confirm it's live (it must appear under "Custom", without a draft marker)
vercel firewall rules list --expand --scope <team>
```

**Dashboard.**
1. Go to Project → **Firewall** → **⋯ → Configure** → **Add New… → Rule**.
2. Set the conditions under **If**, and the action under **Then** (for example **Deny**).
3. Click **Save Rule**.
4. Click **Review Changes**, then **Publish**. **Save alone doesn't apply the rule.**

**`vercel.json` (deny or challenge only, deployed with the code).**
```json
{
  "routes": [
    { "src": "/(.*)", "has": [{ "type": "cookie", "key": "churchcore_ops_session" }], "mitigate": { "action": "deny" } }
  ]
}
```
Use this only when you want the rule versioned with the code. It needs a deploy, so it's slower than the CLI or dashboard in an emergency.

### 4.3 Verify from outside (mandatory)

Send the malicious request yourself. It should be read-only, and it must target the production host.

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H 'Cookie: churchcore_ops_session=sarah-platform' \
  https://www.churchcore.io/api/control/db-health
# Expected with the rule live: 403 (denied at the edge)
```

- **A 200, or the app's own redirect or JSON,** means the rule isn't live. Re-check `rules list` and `diff`.
- **Real-user check.** Load the app signed in, and confirm normal pages still return 200.
- **Record** the probe and its result in the factory-run doc.

### 4.4 Watch, then retire
- **Watch.** `vercel firewall traffic list --since 1h --action deny` shows what the rule is blocking. `vercel firewall traffic inspect rule <rule-id>` breaks it down by IP or path.
- **Ship the code fix.** Once it's deployed, re-run the probe with the rule **disabled** (`vercel firewall rules disable "<name>" --yes`, then `publish`). The app itself must now refuse the request. For the 2026-10-18 case that's a 307 to sign-in, with no data.
- **Decide.** Either remove the rule, or keep it for a defined period as defence in depth. Record the decision.
  - Remove: `vercel firewall rules remove "<name>" --yes`, then `vercel firewall publish --yes`.

## 5. Guardrails

- **Never block a pattern you haven't traced in code.** A broad deny rule on a shared cookie or header can lock out every user.
- **Prefer `log` first** when real-user overlap is possible. Vercel's own guidance: test with `log`, watch 10 minutes of live traffic, then switch to `deny` or `challenge`.
- **`deny` returns 403.** Persistent actions (`--duration`, Pro and Enterprise) also block the client's IP for a period. Avoid this for cookie or header rules, because shared IPs (church Wi-Fi, campus networks) can lock out innocent users.
- **Who can change rules.** Project admins, team members or Security role holders can configure rules. Developers and viewers can only view them.
- **Firewall rules are production configuration.** Changing them is an outward-facing action that needs the owner's approval. The incident record names who approved it.
- **Don't rely on it for forensics.** Firewall traffic logs keep 24 hours on every plan, and 30 days with Observability Plus. Export what you need early.

## 6. Checklist

- [ ] Defect confirmed and live in production; code fix started.
- [ ] Pattern traced in code; no real user sends it, or a `log` rule proved it.
- [ ] Rule staged, then `diff` reviewed, then **published**.
- [ ] `rules list` shows the rule live, with no draft.
- [ ] **External probe returns 403**; normal signed-in pages still return 200.
- [ ] Probe and result recorded in the incident's factory-run doc.
- [ ] Code fix deployed; probe re-run with the rule disabled, and the app refuses on its own.
- [ ] Rule removed, or kept with an expiry date; decision recorded.

## 7. References

- Vercel WAF custom rules: https://vercel.com/docs/vercel-firewall/vercel-waf/custom-rules
- `vercel firewall` CLI: https://vercel.com/docs/cli/firewall
- `vercel.json` routes with `has` and `mitigate`: https://vercel.com/docs/project-configuration/vercel-json#routes
- ChurchCore incident records:
  - `ChurchCore/docs/factory-runs/2026-10-18-hotfix-preview-session-gate.md`
  - `ChurchCore/docs/reviews/2026-10-18-council-review-60-synthesis.md`
