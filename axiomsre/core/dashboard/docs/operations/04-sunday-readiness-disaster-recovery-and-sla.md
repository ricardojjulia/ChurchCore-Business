# Sunday Readiness, Disaster Recovery & SLA Covenant

**Classification:** Infrastructure Resilience & High-Availability Operations  
**Governing Council Reference:** [COUNCIL-2026-001](file:///Users/rjulia/ChurchCore-Business/docs/council/COUNCIL-2026-001.md)  
**Status:** ACTIVE OPERATIONAL RUNBOOK  
**Last Updated:** 2026-10-16  

---

## 1. The Sunday Morning Reality: The "Golden 3 Hours"

In enterprise B2B SaaS, traffic is spread evenly across Monday through Friday. 
In church software, **over 70% of database write operations, check-in print requests, and financial transactions occur between 9:00 AM and 12:00 PM local time on Sunday morning.**

If a system outage strikes on Tuesday at 2:00 PM, an administrator is mildly inconvenienced. **If an outage strikes on Sunday at 9:45 AM during child check-in, church foyers back up with hundreds of frustrated parents, creating child safety hazards and destroying pastoral credibility.**

ChurchCore operates under an unwavering **Sunday Readiness Covenant**: our architecture is specifically hardened for the Sunday peak.

---

## 2. Recovery Objectives & Service Level Agreement (SLA)

| Metric | Target Standard | How It Is Guaranteed |
|---|:---:|---|
| **Recovery Point Objective (RPO)** | **< 60 Seconds** | Continuous PostgreSQL Write-Ahead Log (WAL) archiving to encrypted multi-region cloud storage. |
| **Recovery Time Objective (RTO)** | **< 15 Minutes** | Automated multi-region standby database failover with health-check triggers. |
| **Sunday Uptime Target (9 AM – 1 PM)** | **99.99%** | Pre-scheduled compute vertical scaling on Saturday nights; freeze on all production deployments from Friday 5 PM to Monday 9 AM. |

---

## 3. The 3-Tier Disaster Recovery Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SUNDAY ZERO-DOWNTIME FAIL-SAFE                       │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ TIER 1: CLOUD EDGE │ TIER 2: LOCAL PWA  │ TIER 3: MULTI-REGION         │
│ HIGH-CONCURRENCY   │ OFFLINE CACHING    │ HOT-STANDBY DB               │
│ • Next.js Edge     │ • IndexedDB Kiosk  │ • Continuous WAL Archival    │
│ • PgBouncer Pool   │ • Local Print Sync │ • 1-Click DNS Failover       │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

### Tier 1: Cloud Edge Concurrency Buffering
* **Connection Pooling:** PgBouncer connection pooling buffers bursts of thousands of simultaneous check-in lookups without exhausting PostgreSQL socket connections.
* **Saturday Night Auto-Scale:** Compute instances automatically upgrade compute resources on Saturday night at 11:00 PM EST and scale down on Sunday at 4:00 PM EST.

### Tier 2: The Offline Kiosk Fallback (No-Internet Resilience)
* **The Problem:** Church Wi-Fi in older brick or stone sanctuaries frequently drops when 500 congregants enter the building with smartphones.
* **The Solution:** The `ChurchCore` check-in kiosk runs as an installable **Progressive Web App (PWA)** with local IndexedDB storage.
* **The Fail-Safe:** If internet connectivity drops, the kiosk continues scanning parent barcodes and printing thermal badges locally. Check-in events are buffered in the tablet's encrypted local storage and silently sync to the cloud once Wi-Fi reconnects. **Zero parents are turned away.**

### Tier 3: Emergency Failover Runbook
1. If primary database cluster latency exceeds 2,500ms or fails health checks for 3 consecutive minutes:
2. Cloudflare automated load balancer routes traffic to the warm standby replica.
3. Automated incident pager alerts the on-call Site Reliability Engineer (SRE).
4. Status page (`status.churchcore.com`) automatically updates with live telemetry.

---

## 4. Production Deployment Freeze Covenant

To eliminate human error during critical ministry hours:
* **Strict Freeze Window:** **No production migrations, schema alterations, or code deployments are permitted between Friday at 5:00 PM EST and Monday at 9:00 AM EST.**
* All code releases must ship Tuesday through Thursday and pass 100% surface verification tests before entering production.
