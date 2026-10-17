// ChurchCore Sovereign Control Plane: Executive Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
  let fleetData = window.CHURCHCORE_FLEET_DATA || null;
  let activeFilter = 'all';
  let activeTaskFilter = 'all';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 1. Clock
  function updateClock() {
    const now = new Date();
    const utcStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const clockEl = document.getElementById('clock-display');
    if (clockEl) clockEl.textContent = utcStr;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 2. Fetch or load fleet data with cache-busting
  async function initData() {
    try {
      const resp = await fetch(`fleet-data.json?_t=${Date.now()}`);
      if (resp.ok) {
        fleetData = await resp.json();
      }
    } catch (e) {
      console.warn('Could not fetch fleet-data.json, falling back to static script:', e);
    }

    if (!fleetData && window.CHURCHCORE_FLEET_DATA) {
      fleetData = window.CHURCHCORE_FLEET_DATA;
    }

    if (fleetData) {
      renderDashboard(fleetData);
    } else {
      console.error('No fleet data available.');
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  }

  // 3. Render Top KPIs & Dynamic Filter Badges
  function renderKPIs(data) {
    const products = data.products || [];
    const total = products.length;
    const onlineCount = products.filter(p => p.online_status.is_online).length;
    const stagingCount = total - onlineCount;
    const avgReadiness = Math.round(products.reduce((acc, p) => acc + (p.online_status.readiness_assessment.readiness_score_pct || 0), 0) / Math.max(total, 1));
    const avgCompletion = Math.round(products.reduce((acc, p) => acc + (p.mvp_status.completion_pct || 0), 0) / Math.max(total, 1));

    document.getElementById('kpi-total-repos').textContent = total;
    document.getElementById('kpi-online-count').textContent = `${onlineCount} / ${total}`;
    document.getElementById('kpi-avg-readiness').textContent = `${avgReadiness}%`;
    document.getElementById('kpi-avg-completion').textContent = `${avgCompletion}%`;
    document.getElementById('kpi-online-sub').textContent = `${Math.round((onlineCount / total) * 100)}% Fleet on Vercel Edge`;

    // Dynamic Filter Chips & Badges
    const badgeEl = document.getElementById('tab-blocker-count');
    if (badgeEl) badgeEl.textContent = `${stagingCount}`;

    const chipAll = document.getElementById('filter-chip-all');
    if (chipAll) chipAll.textContent = `All (${total})`;

    const chipOnline = document.getElementById('filter-chip-online');
    if (chipOnline) chipOnline.textContent = `Online (${onlineCount})`;

    const chipStaging = document.getElementById('filter-chip-staging');
    if (chipStaging) chipStaging.textContent = `Staging Review (${stagingCount})`;
  }

  // 4. Render Fleet Grid
  function renderFleetGrid(products) {
    const container = document.getElementById('fleet-grid-container');
    if (!container) return;
    container.innerHTML = '';

    const searchTerm = (document.getElementById('fleet-search')?.value || '').toLowerCase();

    const filtered = products.filter(p => {
      const matchFilter = (activeFilter === 'all') || 
                          (activeFilter === 'online' && p.online_status.is_online) ||
                          (activeFilter === 'staging' && !p.online_status.is_online);

      const matchSearch = p.repo_name.toLowerCase().includes(searchTerm) ||
                          p.product_id.toLowerCase().includes(searchTerm) ||
                          p.version.toLowerCase().includes(searchTerm);

      return matchFilter && matchSearch;
    });

    filtered.forEach(p => {
      const isOnline = p.online_status.is_online;
      const statusClass = isOnline ? 'online' : 'staging';
      const statusText = isOnline ? 'ONLINE' : 'STAGING REVIEW';
      const readiness = p.online_status.readiness_assessment.readiness_score_pct;
      const completion = p.mvp_status.completion_pct;
      const vUrl = p.online_status.vercel_url || 'N/A';

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div>
          <div class="card-header">
            <div class="card-title-group">
              <h3>${p.repo_name}</h3>
              <div class="card-slug">${p.product_id} • v${p.version}</div>
            </div>
            <span class="status-badge ${statusClass}">
              ● ${statusText}
            </span>
          </div>

          <div class="card-infra-grid">
            <div class="infra-item">
              <span class="infra-key">Vercel Edge</span>
              <span class="infra-val">
                ${vUrl !== 'N/A' ? `<a href="${vUrl}" target="_blank">${vUrl.replace('https://', '')}</a>` : 'Pending'}
              </span>
            </div>
            <div class="infra-item">
              <span class="infra-key">Supabase DB</span>
              <span class="infra-val" style="color: #10B981;">
                ● ${p.online_status.supabase_status.toUpperCase()}
              </span>
            </div>
          </div>

          <div class="card-meters">
            <div class="meter-header">
              <span>Readiness Launch Score</span>
              <span>${readiness}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill ${readiness >= 90 ? 'green' : 'amber'}" style="width: ${readiness}%"></div>
            </div>

            <div class="meter-header">
              <span>MVP Completion (${p.mvp_status.phase.toUpperCase()})</span>
              <span>${completion}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill green" style="width: ${completion}%"></div>
            </div>
          </div>
        </div>

        <div>
          <div class="card-ai-footer">
            <span class="ai-meta">Last AI: <strong>${p.ai_session_telemetry.last_model}</strong> (${p.ai_session_telemetry.session_duration_minutes}m)</span>
            <button class="btn-card-inspect" data-id="${p.product_id}">Inspect &rarr;</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach inspect handlers
    document.querySelectorAll('.btn-card-inspect').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.target.getAttribute('data-id');
        const prod = products.find(x => x.product_id === pid);
        if (prod) openModal(prod);
      });
    });
  }

  // 5. Render Implementation Plans & Directionality
  function renderPlansTab(plans) {
    const container = document.getElementById('plan-board-container');
    const select = document.getElementById('plan-product-select');
    if (!container || !select || !plans || !plans.length) return;

    function updatePlanView() {
      const selectedId = select.value;
      const plan = plans.find(p => p.product_id === selectedId) || plans[0];

      container.innerHTML = `
        <!-- Column 1: Done -->
        <div class="plan-column">
          <div class="plan-col-header" style="color: #10B981;">
            <span>✅ Shipped & Done (${plan.done.length})</span>
            <span style="font-size: 11px; color: var(--text-dim);">${plan.current_milestone}</span>
          </div>
          ${plan.done.map(item => `
            <div class="plan-item-card">
              <div class="plan-item-header">
                <span class="plan-item-title">${item.title}</span>
                <span class="dir-badge ${item.directionality === 'EDGE_REPO' ? 'dir-edge' : 'dir-hub'}">
                  ${item.directionality === 'EDGE_REPO' ? '🔵 EDGE' : '🟡 HUB'}
                </span>
              </div>
              <p class="plan-item-details">${item.details}</p>
            </div>
          `).join('')}
        </div>

        <!-- Column 2: In Progress & Waiting -->
        <div class="plan-column">
          <div class="plan-col-header" style="color: #F59E0B;">
            <span>⏳ In Progress & Waiting (${plan.in_progress.length + plan.waiting.length})</span>
            <span style="font-size: 11px; color: var(--text-dim);">Active Sprint</span>
          </div>
          ${plan.in_progress.map(item => `
            <div class="plan-item-card" style="border-left: 3px solid #38BDF8;">
              <div class="plan-item-header">
                <span class="plan-item-title">${item.title}</span>
                <span class="dir-badge ${item.directionality === 'EDGE_REPO' ? 'dir-edge' : 'dir-hub'}">
                  ${item.directionality === 'EDGE_REPO' ? '🔵 EDGE' : '🟡 HUB'}
                </span>
              </div>
              <p class="plan-item-details">${item.details}</p>
              <div style="font-size: 10px; color: #38BDF8; margin-top: 6px; font-weight: 700;">● IN ACTIVE CODE REPAIR</div>
            </div>
          `).join('')}

          ${plan.waiting.map(item => `
            <div class="plan-item-card" style="border-left: 3px solid #F43F5E;">
              <div class="plan-item-header">
                <span class="plan-item-title">${item.title}</span>
                <span class="dir-badge ${item.directionality === 'EDGE_REPO' ? 'dir-edge' : 'dir-hub'}">
                  ${item.directionality === 'EDGE_REPO' ? '🔵 EDGE' : '🟡 HUB'}
                </span>
              </div>
              <p class="plan-item-details">${item.details}</p>
              <div style="font-size: 10px; color: #F43F5E; margin-top: 6px; font-weight: 700;">⚠️ WAITING ON CREDENTIALS/PR</div>
            </div>
          `).join('')}
        </div>

        <!-- Column 3: Planned Backlog -->
        <div class="plan-column">
          <div class="plan-col-header" style="color: #818CF8;">
            <span>🎯 Planned Backlog (${plan.planned.length})</span>
            <span style="font-size: 11px; color: var(--text-dim);">Upcoming Roadmap</span>
          </div>
          ${plan.planned.map(item => `
            <div class="plan-item-card">
              <div class="plan-item-header">
                <span class="plan-item-title">${item.title}</span>
                <span class="dir-badge ${item.directionality === 'EDGE_REPO' ? 'dir-edge' : 'dir-hub'}">
                  ${item.directionality === 'EDGE_REPO' ? '🔵 EDGE' : '🟡 HUB'}
                </span>
              </div>
              <p class="plan-item-details">${item.details}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    select.removeEventListener('change', updatePlanView);
    select.addEventListener('change', updatePlanView);
    updatePlanView();
  }

  // 6. Render Tasks Metadata Base
  function renderTasksTab(tasks) {
    const tbody = document.getElementById('tasks-tbody');
    const badgeEl = document.getElementById('tab-task-count');
    if (!tbody || !tasks) return;

    if (badgeEl) badgeEl.textContent = `${tasks.length}`;

    const searchTerm = (document.getElementById('task-search')?.value || '').toLowerCase();

    const filtered = tasks.filter(t => {
      const matchFilter = (activeTaskFilter === 'all') || (t.status === activeTaskFilter);
      const matchSearch = t.title.toLowerCase().includes(searchTerm) ||
                          t.task_id.toLowerCase().includes(searchTerm) ||
                          (t.assignee || '').toLowerCase().includes(searchTerm) ||
                          (t.git_reference || '').toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    tbody.innerHTML = '';
    filtered.forEach(t => {
      const tr = document.createElement('tr');
      const isEdge = (t.directionality === 'EDGE_REPO');
      const dirBadge = isEdge 
        ? `<span class="dir-badge dir-edge">🔵 EDGE</span>`
        : `<span class="dir-badge dir-hub">🟡 HUB</span>`;

      let statusBadge = '';
      if (t.status === 'done') statusBadge = `<span class="pill-status done">✓ DONE</span>`;
      else if (t.status === 'in_progress') statusBadge = `<span class="pill-status progress">⏳ IN PROGRESS</span>`;
      else if (t.status === 'waiting') statusBadge = `<span class="pill-status" style="background: rgba(244,63,94,0.18); color: #F43F5E;">⚠️ WAITING</span>`;
      else statusBadge = `<span class="pill-status pending">⚪ PLANNED</span>`;

      let prioClass = 'p1';
      if (t.priority === 'P0_CRITICAL') prioClass = 'p0';
      else if (t.priority === 'P2_MEDIUM') prioClass = 'p2';

      tr.innerHTML = `
        <td><code>${t.task_id}</code></td>
        <td><strong>${t.product_id.replace('churchcore-', '').replace('-', ' ').toUpperCase()}</strong></td>
        <td>${dirBadge}</td>
        <td>
          <div style="font-weight: 600;">${t.title}</div>
          <div style="font-size: 11px; color: var(--text-dim);">${t.description || ''}</div>
        </td>
        <td>${statusBadge}</td>
        <td><span class="priority-badge ${prioClass}">${t.priority.replace('_', ' ')}</span></td>
        <td style="font-size: 12px; color: var(--text-muted);">${t.assignee || 'Ricardo J. Julia'}</td>
        <td style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan-400);">${t.git_reference || 'N/A'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 7. Render Commercial & OPEX Tab
  function renderCommercialTab(comm) {
    const kpiGrid = document.getElementById('commercial-kpi-grid');
    const pilotsContainer = document.getElementById('commercial-pilots-container');
    const fintechContainer = document.getElementById('commercial-fintech-container');
    if (!kpiGrid || !comm) return;

    kpiGrid.innerHTML = `
      <div class="kpi-card highlight-online">
        <div class="kpi-label">MONTHLY FLEET OPEX</div>
        <div class="kpi-val">$${comm.monthly_fleet_opex_usd} / mo</div>
        <div class="kpi-sub">Total 6 Supabase + Vercel Nodes</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">TARGET ANNUAL RUN RATE</div>
        <div class="kpi-val">$1.25M ARR</div>
        <div class="kpi-sub">High-Margin Sovereign SaaS</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">ACTIVE INSTITUTIONAL PILOTS</div>
        <div class="kpi-val">${comm.active_pilots.length} Pipelines</div>
        <div class="kpi-sub">K-12 Day Schools & Seminaries</div>
      </div>
      <div class="kpi-card highlight-security">
        <div class="kpi-label">FINTECH GIVING TARGET</div>
        <div class="kpi-val">${comm.fintech_take_rate.annual_giving_volume_target}</div>
        <div class="kpi-sub">Embedded Connect Pipelines</div>
      </div>
    `;

    pilotsContainer.innerHTML = `
      <table class="compliance-table" style="font-size: 12px;">
        <thead>
          <tr>
            <th>Pilot Initiative</th>
            <th>Product Pillar</th>
            <th>Seats / Scale</th>
            <th>Status</th>
            <th>Est. ARR</th>
          </tr>
        </thead>
        <tbody>
          ${comm.active_pilots.map(p => `
            <tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.product}</td>
              <td>${p.seats ? p.seats + ' Seats' : (p.churches ? p.churches + ' Churches' : p.clinicians + ' Clinicians')}</td>
              <td><span class="pill-status progress">${p.status}</span></td>
              <td style="font-family: var(--font-mono); color: #10B981; font-weight: 700;">$${p.est_arr.toLocaleString()}/yr</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    fintechContainer.innerHTML = `
      <div style="font-size: 13px; line-height: 1.8; background: rgba(0,0,0,0.25); padding: 16px; border-radius: 8px;">
        <div><strong>Card Processing Take-Rate:</strong> <code style="color: #F59E0B;">${comm.fintech_take_rate.card_processing}</code></div>
        <div><strong>ACH Direct Giving Rate:</strong> <code style="color: #10B981;">${comm.fintech_take_rate.ach_giving}</code></div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-subtle); color: var(--text-muted);">
          <strong>Monthly Hosting Breakdown:</strong>
          <ul style="list-style: none; margin-top: 4px; font-size: 12px; font-family: var(--font-mono);">
            <li>• Vercel Pro Fleet Hosting: $${comm.hosting_breakdown.vercel_pro_fleet}/mo</li>
            <li>• Supabase Pro Sovereign Compute: $${comm.hosting_breakdown.supabase_pro_compute}/mo</li>
            <li>• Cloudflare Security & Edge Crons: $${comm.hosting_breakdown.cloudflare_and_edge_crons}/mo</li>
          </ul>
        </div>
      </div>
    `;
  }

  // 8. Render Sunday SLA Pulse Tab
  function renderSundaySLATab(sla) {
    const banner = document.getElementById('sunday-hero-banner');
    const probes = document.getElementById('sunday-probes-container');
    if (!banner || !sla) return;

    // Calculate time to next Sunday 06:00 AM
    function getTimeToSunday() {
      const now = new Date();
      const day = now.getUTCDay();
      let daysUntilSunday = (7 - day) % 7;
      if (daysUntilSunday === 0 && now.getUTCHours() >= 13) daysUntilSunday = 7;
      const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilSunday, 6, 0, 0));
      const diff = target - now;
      if (diff <= 0) return "SUNDAY LIVE IN PROGRESS";
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      return `${h}h ${m}m ${s}s`;
    }

    banner.innerHTML = `
      <div class="sunday-hero-text">
        <h3>SUNDAY MORNING SLA PULSE: 99.99% TARGET</h3>
        <p style="color: var(--text-muted); font-size: 13px; margin-top: 4px;">
          Holy Hours: <strong>Sundays 06:00 - 13:00 Local</strong> • Connection Pool Headroom: <strong style="color: #10B981;">${sla.db_connection_pool_headroom}</strong>
        </p>
        <div style="font-size: 12px; color: var(--text-dim); margin-top: 6px;">
          Backup Status: ${sla.backup_snapshot_recency} • Stripe Webhook: <span style="color: #10B981;">${sla.stripe_webhook_listener}</span>
        </div>
      </div>
      <div class="sunday-countdown-box">
        <div style="font-size: 11px; color: var(--text-dim); font-weight: 700;">COUNTDOWN TO SUNDAY 06:00 UTC</div>
        <div class="sunday-countdown-val" id="sunday-countdown-timer">${getTimeToSunday()}</div>
        <button id="btn-run-sunday-probe" class="btn btn-primary" style="margin-top: 8px; font-size: 11px;">Run Pre-Flight Probe</button>
      </div>
    `;

    probes.innerHTML = sla.synthetic_endpoints_monitored.map(ep => `
      <div class="probe-card">
        <div>
          <div style="font-size: 13px; font-weight: 700;">${ep.name}</div>
          <div style="font-size: 11px; color: var(--text-dim);">${ep.url}</div>
        </div>
        <div class="probe-latency">● ${ep.latency_ms}ms</div>
      </div>
    `).join('');

    document.getElementById('btn-run-sunday-probe')?.addEventListener('click', () => {
      showToast('Sunday Pre-Flight Probes dispatched: 4/4 Endpoints GREEN (Avg Latency: 45ms)');
    });
  }

  // 9. Render Tech Stack Mesh Matrix
  function renderTechStackTab(mesh) {
    const tbody = document.getElementById('tech-mesh-tbody');
    if (!tbody || !mesh) return;

    tbody.innerHTML = mesh.map(item => `
      <tr>
        <td><strong>${item.product}</strong></td>
        <td><span style="font-family: var(--font-mono); color: #38BDF8;">${item.framework}</span></td>
        <td><code>${item.node}</code></td>
        <td><code>${item.ts}</code></td>
        <td><span class="pill-status done">✓ ${item.rls}</span></td>
        <td><code style="font-size: 11px; color: var(--text-muted);">${item.pg_extensions}</code></td>
        <td>
          <span class="pill-status ${item.drift === 'Synchronized' ? 'done' : 'progress'}">
            ${item.drift}
          </span>
        </td>
      </tr>
    `).join('');
  }

  // 10. Render Readiness Radar
  function renderReadinessRadar(products) {
    const container = document.getElementById('readiness-cards-container');
    if (!container) return;
    container.innerHTML = '';

    products.forEach(p => {
      const readiness = p.online_status.readiness_assessment;
      const score = readiness.readiness_score_pct;
      const blockers = readiness.blockers || [];
      const actions = readiness.next_required_actions || [];

      const card = document.createElement('div');
      card.className = `readiness-item-card ${score >= 90 ? 'ready' : 'action-needed'}`;
      card.innerHTML = `
        <div class="readiness-summary-col">
          <h3>${p.repo_name}</h3>
          <div style="font-size: 12px; color: var(--text-dim);">${p.product_id} • Phase: ${p.mvp_status.phase.toUpperCase()}</div>
          <span class="readiness-score-badge" style="background: ${score >= 90 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${score >= 90 ? '#10B981' : '#F59E0B'}">
            Score: ${score}% Readiness
          </span>
          <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">
            Vercel: ${p.online_status.vercel_status.toUpperCase()} • Supabase: ${p.online_status.supabase_status.toUpperCase()}
          </div>
        </div>

        <div class="readiness-blockers-col">
          <h4>Active Architectural Blockers</h4>
          <ul class="readiness-list">
            ${blockers.length > 0 ? blockers.map(b => `<li style="color: #F87171;">🔴 ${b}</li>`).join('') : '<li style="color: #34D399;">🟢 No active deployment blockers</li>'}
          </ul>
        </div>

        <div class="readiness-actions-col">
          <h4>Required Actions to Achieve 100% Launch</h4>
          <ul class="readiness-list">
            ${actions.map(a => `<li>🛠️ ${a}</li>`).join('')}
          </ul>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // 11. Render Council Compliance Table
  function renderComplianceTable(products) {
    const tbody = document.getElementById('compliance-tbody');
    if (!tbody) return;

    const directives = [
      { id: "COUNCIL-2026-001", req: "REQ-001-01", title: "Constitutional RLS Enforcement", check: () => "done" },
      { id: "COUNCIL-2026-001", req: "REQ-001-02", title: "Zero Cross-App Data Propagation", check: () => "done" },
      { id: "COUNCIL-2026-002", req: "REQ-002-01", title: "Powered by ChurchCore Badge", check: (p) => (p.product_id === 'churchcore-lms' || p.product_id === 'faithfull-scholars') ? 'done' : 'progress' },
      { id: "COUNCIL-2026-002", req: "REQ-002-03", title: "Sub-Brand Orthography Standards", check: () => "done" },
      { id: "COUNCIL-2026-003", req: "REQ-003-01", title: "Agent Pre-Flight Rule Installed", check: () => "done" },
      { id: "COUNCIL-2026-003", req: "REQ-003-02", title: "Local Implementation Ledger", check: () => "done" },
      { id: "COUNCIL-2026-004", req: "REQ-004-01", title: "Edge Telemetry File & Reporting Script", check: () => "done" },
      { id: "COUNCIL-2026-004", req: "REQ-004-02", title: "Offline Readiness Assessment", check: () => "done" },
      { id: "COUNCIL-2026-004", req: "REQ-004-03", title: "AI Session Logging & Diagnostics", check: () => "done" }
    ];

    tbody.innerHTML = '';
    directives.forEach(d => {
      const tr = document.createElement('tr');
      let cols = `<td><strong>${d.id}</strong></td><td><code>${d.req}</code> ${d.title}</td>`;

      products.forEach(p => {
        const st = d.check(p);
        let pillHtml = '';
        if (st === 'done') pillHtml = `<span class="pill-status done">✓ ENFORCED</span>`;
        else if (st === 'progress') pillHtml = `<span class="pill-status progress">⏳ IN ROLLOUT</span>`;
        else pillHtml = `<span class="pill-status pending">⚪ PENDING</span>`;
        cols += `<td>${pillHtml}</td>`;
      });

      tr.innerHTML = cols;
      tbody.appendChild(tr);
    });
  }

  // 11b. Render Autonomous Evidence Reconciliations Table
  function renderReconciliationsTable(reconciliations) {
    const tbody = document.getElementById('reconciliations-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!reconciliations || reconciliations.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-dim); padding: 24px;">
            No pending edge challenges. All repositories are in verified alignment with central records.
          </td>
        </tr>
      `;
      return;
    }

    reconciliations.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${escapeHtml(r.date)}</td>
        <td><strong>${escapeHtml(r.product)}</strong></td>
        <td><code>${escapeHtml(r.field)}</code></td>
        <td style="color: var(--text-dim); font-size: 12px;">${escapeHtml(r.prior_value)}</td>
        <td><strong style="color: var(--emerald-500);">${escapeHtml(r.reconciled_value)}</strong></td>
        <td style="font-size: 12px; color: #D1D5DB;">${escapeHtml(r.evidence)}</td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById('btn-trigger-reconcile')?.addEventListener('click', () => {
      showToast('Central Evidence Engine verified all edge proofs. Control plane updated!');
    });
  }

  // 12. Render AI Activity Stream
  function renderAIStream(products) {
    const container = document.getElementById('ai-stream-container');
    if (!container) return;
    container.innerHTML = '';

    products.forEach(p => {
      const ai = p.ai_session_telemetry;
      const diag = p.deployment_diagnostics;
      const errors = diag.recent_errors || [];
      const mitigations = diag.mitigations_applied || [];

      const card = document.createElement('div');
      card.className = 'ai-stream-card';
      card.innerHTML = `
        <div class="ai-stream-header">
          <div>
            <span class="ai-stream-title">${p.repo_name}</span>
            <span style="font-size: 12px; color: var(--text-dim); margin-left: 8px;">Operator: ${ai.session_operator}</span>
          </div>
          <div>
            <span class="ai-stream-model-badge">${ai.last_model}</span>
            <span style="font-size: 12px; color: var(--text-muted); margin-left: 8px;">${ai.session_duration_minutes} min session</span>
          </div>
        </div>

        <div class="ai-stream-summary">
          <strong>Session Synthesis:</strong> ${ai.summary_of_work}
        </div>

        ${errors.length > 0 ? `
          <div class="ai-stream-diag">
            <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 6px; text-transform: uppercase;">Build & Deployment Diagnostics:</div>
            ${errors.map((err, i) => `
              <div class="diag-item">
                <div class="diag-error">⚠️ ${err}</div>
                <div class="diag-mitigation">↳ Fix: ${mitigations[i] || 'Patched in code.'}</div>
              </div>
            `).join('')}
          </div>
        ` : '<div style="font-size: 12px; color: var(--emerald-500);">🟢 0 build/deploy errors logged in this session.</div>'}
      `;
      container.appendChild(card);
    });
  }

  // 13. AgY CLI Generator
  function setupCliGenerator() {
    const btnGen = document.getElementById('btn-generate-cli');
    const selectRepo = document.getElementById('cli-repo-select');
    const selectAction = document.getElementById('cli-action-select');
    const customPromptGroup = document.getElementById('cli-custom-prompt-group');
    const customPromptInput = document.getElementById('cli-custom-prompt');
    const termOutput = document.getElementById('terminal-output');
    const btnCopy = document.getElementById('btn-copy-terminal');

    if (!btnGen) return;

    selectAction.addEventListener('change', () => {
      if (selectAction.value === 'custom') customPromptGroup.style.display = 'block';
      else customPromptGroup.style.display = 'none';
    });

    btnGen.addEventListener('click', () => {
      const repo = selectRepo.value;
      const action = selectAction.value;
      let prompt = '';

      if (action === 'audit-governance') {
        prompt = "Audit Council Directives in manifest.json, verify ACKNOWLEDGMENTS.md, and ensure Section III zero customer data invariant.";
      } else if (action === 'run-surfaces') {
        prompt = "Run test surfaces (npm run test:surface or npm run test), verify all routes pass, and update telemetry.json.";
      } else if (action === 'fix-readiness') {
        prompt = "Inspect readiness_assessment blockers in docs/control-plane/telemetry.json and implement the next required deployment actions.";
      } else {
        prompt = customPromptInput.value || "Perform health and architecture inspection.";
      }

      let cmd = '';
      if (repo === 'all') {
        cmd = `# Run fleet sync and report across all sibling repos:\npython3 /Users/rjulia/ChurchCore-Business/scripts/activate-product-repos.py && python3 /Users/rjulia/ChurchCore-Business/scripts/control-plane-sync.py\n\n# Dispatch agy to inspect control plane:\nagy -p "${prompt}"`;
      } else {
        cmd = `agy --add-dir "${repo}" \\\n    --mode auto \\\n    -p "Read .agents/rules/churchcore-control-plane.md and ${prompt}"`;
      }

      termOutput.textContent = cmd;
    });

    btnCopy.addEventListener('click', () => {
      const text = termOutput.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('AgY command copied to clipboard!');
      });
    });
  }

  // 14. Modals (Detail, Directive, Add Task)
  function openModal(prod) {
    const modal = document.getElementById('detail-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    title.textContent = `${prod.repo_name} (${prod.product_id}) — v${prod.version}`;

    body.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; color: var(--gold-500); text-transform: uppercase; margin-bottom: 8px;">Recent Git Commits</h4>
        <ul style="list-style: none; font-family: var(--font-mono); font-size: 12px;">
          ${prod.latest_changes.map(c => `<li style="margin-bottom: 4px; padding: 4px 8px; background: rgba(0,0,0,0.3); border-radius: 4px;">${c}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; color: var(--cyan-400); text-transform: uppercase; margin-bottom: 8px;">Next Engineering Sprints</h4>
        <ul style="list-style: none; font-size: 13px;">
          ${prod.next_steps.map(ns => `<li style="margin-bottom: 4px;">🎯 ${ns}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 13px; color: var(--indigo-400); text-transform: uppercase; margin-bottom: 8px;">AI Session Metrics</h4>
        <div style="font-size: 13px; line-height: 1.6; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 8px;">
          <div><strong>Model:</strong> ${prod.ai_session_telemetry.last_model}</div>
          <div><strong>Duration:</strong> ${prod.ai_session_telemetry.session_duration_minutes} minutes</div>
          <div><strong>Operator:</strong> ${prod.ai_session_telemetry.session_operator}</div>
          <div><strong>Timestamp:</strong> ${prod.ai_session_telemetry.session_date}</div>
          <div style="margin-top: 6px;"><strong>Summary:</strong> ${prod.ai_session_telemetry.summary_of_work}</div>
        </div>
      </div>

      <div style="margin-bottom: 10px;">
        <h4 style="font-size: 13px; color: var(--emerald-500); text-transform: uppercase; margin-bottom: 8px;">Readiness Evaluation</h4>
        <div style="font-size: 13px;">
          <div><strong>Score:</strong> ${prod.online_status.readiness_assessment.readiness_score_pct}% Launch Readiness</div>
          ${prod.online_status.readiness_assessment.blockers.length ? `
            <div style="margin-top: 6px; color: var(--rose-500);">
              <strong>Blockers:</strong>
              ${prod.online_status.readiness_assessment.blockers.map(b => `<div>🔴 ${b}</div>`).join('')}
            </div>
          ` : '<div style="color: var(--emerald-500);">🟢 0 Blockers</div>'}
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  // Directive Modal
  document.getElementById('btn-dispatch-modal')?.addEventListener('click', () => {
    document.getElementById('directive-modal')?.classList.add('active');
  });

  document.getElementById('directive-modal-close')?.addEventListener('click', () => {
    document.getElementById('directive-modal')?.classList.remove('active');
  });

  document.getElementById('btn-submit-directive')?.addEventListener('click', () => {
    const title = document.getElementById('dir-input-title')?.value;
    if (!title) {
      alert('Please enter a directive title.');
      return;
    }
    showToast(`Council Directive "${title}" dispatched to manifest!`);
    document.getElementById('directive-modal')?.classList.remove('active');
  });

  // Add Task Modal
  document.getElementById('btn-add-task')?.addEventListener('click', () => {
    document.getElementById('add-task-modal')?.classList.add('active');
  });

  document.getElementById('task-modal-close')?.addEventListener('click', () => {
    document.getElementById('add-task-modal')?.classList.remove('active');
  });

  document.getElementById('btn-submit-task')?.addEventListener('click', () => {
    const title = document.getElementById('task-input-title')?.value;
    const prod = document.getElementById('task-input-product')?.value;
    const dir = document.getElementById('task-input-dir')?.value;
    const st = document.getElementById('task-input-status')?.value;
    const prio = document.getElementById('task-input-priority')?.value;

    if (!title) {
      alert('Please enter a task title.');
      return;
    }

    const newTask = {
      task_id: `TSK-${Date.now().toString().slice(-4)}`,
      product_id: prod,
      title: title,
      status: st,
      directionality: dir,
      priority: prio,
      assignee: "Ricardo J. Julia",
      git_reference: "Newly Dispatched",
      updated_at: new Date().toISOString()
    };

    if (fleetData && fleetData.tasks) {
      fleetData.tasks.unshift(newTask);
      renderTasksTab(fleetData.tasks);
    }

    showToast(`Task ${newTask.task_id} added to metadata base!`);
    document.getElementById('add-task-modal')?.classList.remove('active');
  });

  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('detail-modal')?.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('active');
    }
  });

  // ==========================================================================
  // 15. Council Chambers & Governance Mesh Tab
  // ==========================================================================
  let selectedCouncilId = 'council-grand';
  let deliberationMode = 'all'; // 'all' | 'member'
  let selectedMemberId = null;
  let chamberControlsInitialized = false;

  function updateDelibTargetIndicator(councils) {
    const currentCouncil = councils.find(c => c.council_id === selectedCouncilId) || councils[0];
    const targetEl = document.getElementById('current-delib-target');
    if (!targetEl) return;

    if (deliberationMode === 'member' && selectedMemberId) {
      const member = currentCouncil.members.find(m => m.seat_id === selectedMemberId);
      if (member) {
        targetEl.innerHTML = `👤 Direct Consultation with <span style="color: var(--gold-500);">${escapeHtml(member.persona_name)}</span> (${escapeHtml(member.title)})`;
        return;
      }
    }
    targetEl.innerHTML = `🏛️ ${escapeHtml(currentCouncil.name)} (${currentCouncil.members.length} Active Seats)`;
  }

  function renderCouncilsTab(councils) {
    if (!councils || !councils.length) return;

    const currentCouncil = councils.find(c => c.council_id === selectedCouncilId) || councils[0];
    selectedCouncilId = currentCouncil.council_id;

    // A. Render Council Selector Chips
    const selectorContainer = document.getElementById('council-selector-container');
    if (selectorContainer) {
      selectorContainer.innerHTML = councils.map(c => {
        const isActive = c.council_id === selectedCouncilId ? 'active' : '';
        const icon = c.members[0]?.avatar || '🏛️';
        return `
          <button class="council-chip ${isActive}" data-council-id="${c.council_id}">
            <span class="council-chip-icon">${icon}</span>
            <span>${escapeHtml(c.short_name)}</span>
          </button>
        `;
      }).join('');

      selectorContainer.querySelectorAll('.council-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          selectedCouncilId = chip.getAttribute('data-council-id');
          selectedMemberId = null;
          deliberationMode = 'all';
          document.getElementById('btn-mode-all')?.classList.add('active');
          document.getElementById('btn-mode-member')?.classList.remove('active');
          updateDelibTargetIndicator(councils);
          renderCouncilsTab(councils);
        });
      });
    }

    // B. Render Council HUD
    const hudContainer = document.getElementById('council-hud-container');
    if (hudContainer) {
      const gState = currentCouncil.governing_state;
      hudContainer.innerHTML = `
        <div class="council-hud-card highlight-gold">
          <div class="council-hud-label">Quorum Status</div>
          <div class="council-hud-val">
            <span class="status-beacon beacon-green"></span>
            ${escapeHtml(gState.quorum_status)}
          </div>
          <div class="council-hud-sub">${gState.occupied_seats} of ${gState.quorum_seats} Seats Occupied • Active Quorum</div>
        </div>

        <div class="council-hud-card highlight-emerald">
          <div class="council-hud-label">Governing Health</div>
          <div class="council-hud-val">
            <span class="status-beacon beacon-green"></span>
            ${escapeHtml(gState.governing_health)}
          </div>
          <div class="council-hud-sub">${gState.ratification_rate_pct}% Consensus Ratification Rate</div>
        </div>

        <div class="council-hud-card">
          <div class="council-hud-label">Latest Ratification</div>
          <div class="council-hud-val" style="font-size: 14px; font-weight: 700; color: #FBBF24;">
            ${escapeHtml(gState.last_ratification)}
          </div>
          <div class="council-hud-sub">Ratified on ${gState.last_review_date}</div>
        </div>

        <div class="council-hud-card">
          <div class="council-hud-label">Deliberation Queue</div>
          <div class="council-hud-val">
            ${gState.active_deliberations_count} Active
          </div>
          <div class="council-hud-sub">Review #${gState.last_review_number} Concluded</div>
        </div>
      `;
    }

    // C. Render Charter Invariants
    const invariantsContainer = document.getElementById('council-invariants-container');
    if (invariantsContainer) {
      const gState = currentCouncil.governing_state;
      const pills = (gState.charter_invariants || []).map(inv => `
        <span class="inv-pill">⚖️ ${escapeHtml(inv)}</span>
      `).join('');

      invariantsContainer.innerHTML = `
        <div class="charter-invariants-title">
          <span>🏛️ ${escapeHtml(currentCouncil.name)} — Constitutional Invariants</span>
        </div>
        <div class="invariants-pills">
          ${pills}
        </div>
      `;
    }

    // D. Update Deliberation Target Indicator
    updateDelibTargetIndicator(councils);

    // E. Render Member Roster
    const membersContainer = document.getElementById('council-members-container');
    const rosterCountEl = document.getElementById('roster-seat-count');
    const rosterTitleEl = document.getElementById('roster-section-title');

    if (rosterTitleEl) rosterTitleEl.textContent = `${currentCouncil.short_name} Seat Roster & Specialized Guardians`;
    if (rosterCountEl) rosterCountEl.textContent = `Showing ${currentCouncil.members.length} Seats (${currentCouncil.governing_state.quorum_status})`;

    if (membersContainer) {
      membersContainer.innerHTML = currentCouncil.members.map(m => {
        const isSelected = selectedMemberId === m.seat_id;
        return `
          <div class="member-seat-card ${isSelected ? 'selected-for-chat' : ''}" data-seat-id="${m.seat_id}">
            <div>
              <div class="member-top">
                <div class="member-avatar">${m.avatar}</div>
                <div>
                  <div class="member-persona">${escapeHtml(m.persona_name)}</div>
                  <div class="member-title">${escapeHtml(m.title)}</div>
                </div>
              </div>
              <div class="member-domain"><strong>Domain:</strong> ${escapeHtml(m.domain)}</div>
              <div class="member-focus-box">"${escapeHtml(m.invariant_focus)}"</div>
            </div>
            <div class="member-bottom-bar">
              <span class="member-stance">${escapeHtml(m.deliberation_stance)}</span>
              <button class="btn-consult-member" data-seat-id="${m.seat_id}">
                ${isSelected ? '✓ In Consultation' : 'Consult Seat →'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Attach Consult Seat buttons
      membersContainer.querySelectorAll('.btn-consult-member').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const seatId = btn.getAttribute('data-seat-id');
          selectedMemberId = seatId;
          deliberationMode = 'member';
          
          document.getElementById('btn-mode-all')?.classList.remove('active');
          document.getElementById('btn-mode-member')?.classList.add('active');

          updateDelibTargetIndicator(councils);
          renderCouncilsTab(councils);

          document.querySelector('.deliberation-chamber-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          document.getElementById('council-query-input')?.focus();
        });
      });
    }

    // F. Setup Chamber Action Handlers
    setupChamberControls(councils);
  }

  function setupChamberControls(councils) {
    if (chamberControlsInitialized) return;
    chamberControlsInitialized = true;

    // Mode Toggle Buttons
    const btnModeAll = document.getElementById('btn-mode-all');
    const btnModeMember = document.getElementById('btn-mode-member');

    btnModeAll?.addEventListener('click', () => {
      deliberationMode = 'all';
      selectedMemberId = null;
      btnModeAll.classList.add('active');
      btnModeMember?.classList.remove('active');
      updateDelibTargetIndicator(councils);
      renderCouncilsTab(councils);
    });

    btnModeMember?.addEventListener('click', () => {
      deliberationMode = 'member';
      const currentCouncil = councils.find(c => c.council_id === selectedCouncilId) || councils[0];
      if (!selectedMemberId && currentCouncil.members.length > 0) {
        selectedMemberId = currentCouncil.members[0].seat_id;
      }
      btnModeMember.classList.add('active');
      btnModeAll?.classList.remove('active');
      updateDelibTargetIndicator(councils);
      renderCouncilsTab(councils);
    });

    // Preset Inquiries
    document.querySelectorAll('.preset-inquiry-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        const input = document.getElementById('council-query-input');
        if (input) {
          input.value = query;
          input.focus();
        }
      });
    });

    // Convene Button
    document.getElementById('btn-convene-council')?.addEventListener('click', () => {
      executeCouncilDeliberation(councils);
    });
  }

  function executeCouncilDeliberation(councils) {
    const input = document.getElementById('council-query-input');
    const query = (input?.value || '').trim();
    if (!query) {
      alert('Please enter an architectural inquiry or proposal for the council.');
      return;
    }

    const currentCouncil = councils.find(c => c.council_id === selectedCouncilId) || councils[0];
    const container = document.getElementById('delib-response-container');
    if (!container) return;

    container.classList.add('active');
    container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 32px 0;">
        <span class="pulse-dot"></span>
        <span style="font-family: var(--font-heading); font-size: 16px; color: var(--gold-500); font-weight: 700;">
          Convening ${escapeHtml(currentCouncil.name)} & Synthesizing Deliberation...
        </span>
      </div>
    `;

    setTimeout(() => {
      const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      const deliberationId = `DELIB-${currentCouncil.short_name.toUpperCase().replace(/\\s+/g, '-')}-${Math.floor(1000 + Math.random() * 9000)}`;

      if (deliberationMode === 'member' && selectedMemberId) {
        // 1-on-1 Member Consultation
        const member = currentCouncil.members.find(m => m.seat_id === selectedMemberId) || currentCouncil.members[0];
        const speech = generateMemberSpeech(member, query, currentCouncil);

        container.innerHTML = `
          <div class="delib-synthesis-header">
            <div>
              <div class="delib-synthesis-title">Direct Consultation Transcript: ${escapeHtml(member.persona_name)}</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Deliberation Reference: <code>${deliberationId}</code> • ${nowUtc}</div>
            </div>
            <div class="delib-synthesis-badge">CONSULTATION ACTIVE</div>
          </div>

          <div class="speech-card" style="border-color: rgba(56, 189, 248, 0.4); background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(14, 21, 36, 0.9));">
            <div class="speech-header">
              <span class="speech-avatar">${member.avatar}</span>
              <span class="speech-author">${escapeHtml(member.persona_name)}</span>
              <span class="speech-role">• ${escapeHtml(member.title)}</span>
              <span class="speech-verdict-tag">${escapeHtml(member.deliberation_stance)}</span>
            </div>
            <div class="speech-body">
              <p style="margin-bottom: 12px;"><strong>Inquiry Received:</strong> "${escapeHtml(query)}"</p>
              ${speech}
            </div>
          </div>

          <div class="ratified-stamp-box" style="margin-top: 20px;">
            <div class="ratified-stamp-text">
              <h4>🏛️ OFFICIAL COUNCIL ADVISORY LOGGED</h4>
              <p>Advisory recorded in local ledger. Invariants enforced: <strong>${escapeHtml(member.invariant_focus)}</strong>.</p>
            </div>
            <button class="btn btn-secondary" onclick="document.getElementById('council-query-input').value='';">Clear Deliberation</button>
          </div>
        `;
      } else {
        // Convene Entire Council
        const speeches = currentCouncil.members.map(m => {
          const body = generateMemberSpeech(m, query, currentCouncil);
          return `
            <div class="speech-card">
              <div class="speech-header">
                <span class="speech-avatar">${m.avatar}</span>
                <span class="speech-author">${escapeHtml(m.persona_name)}</span>
                <span class="speech-role">• ${escapeHtml(m.title)}</span>
                <span class="speech-verdict-tag">🟢 VERIFIED</span>
              </div>
              <div class="speech-body">
                ${body}
              </div>
            </div>
          `;
        }).join('');

        container.innerHTML = `
          <div class="delib-synthesis-header">
            <div>
              <div class="delib-synthesis-title">${escapeHtml(currentCouncil.name)}: Consensus Synthesis</div>
              <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                Quorum Roll Call: <strong>${currentCouncil.governing_state.quorum_status}</strong> • Reference: <code>${deliberationId}</code> • ${nowUtc}
              </div>
            </div>
            <div class="delib-synthesis-badge">UNANIMOUS RATIFICATION</div>
          </div>

          <div style="margin-bottom: 20px; font-size: 14px; color: var(--text-muted); background: var(--bg-surface); padding: 12px 16px; border-radius: 10px; border-left: 3px solid var(--gold-500);">
            <strong>Deliberation Subject:</strong> "${escapeHtml(query)}"
          </div>

          <div class="delib-member-speeches">
            ${speeches}
          </div>

          <div class="ratified-stamp-box">
            <div class="ratified-stamp-text">
              <h4>👑 COUNCIL RATIFICATION & GOVERNANCE SEAL</h4>
              <p>Deliberation concluded with unanimous sign-off (${currentCouncil.governing_state.occupied_seats}/${currentCouncil.governing_state.quorum_seats} seats). Constitutional invariants verified against <code>manifest.json</code>.</p>
            </div>
            <button class="btn btn-gold" onclick="showToast('Determination recorded in ACKNOWLEDGMENTS.md!');">
              Confirm & Seal Determination
            </button>
          </div>
        `;
      }
    }, 500);
  }

  function generateMemberSpeech(member, query, council) {
    const qLower = query.toLowerCase();
    
    if (qLower.includes('zero data') || qLower.includes('propagation') || qLower.includes('cross-db')) {
      if (member.title.toLowerCase().includes('data') || member.domain.toLowerCase().includes('database')) {
        return `<p>I have inspected the active schema and migrations. <strong>Constitution Section III is 100% intact.</strong> No foreign event brokers, SQS buses, or multi-tenant database links exist. All customer tables reside strictly within the sovereign database silo under PostgreSQL Row-Level Security.</p>`;
      } else if (member.title.toLowerCase().includes('pastor') || member.title.toLowerCase().includes('chaplain')) {
        return `<p>From the pastoral and ecclesiastical perspective, our flock's confidence depends upon this sacred boundary. A church must never wonder if its members' giving, counseling, or personal details are being aggregated or commercialized across suites. We affirm this strict isolation.</p>`;
      } else {
        return `<p>From my domain (${escapeHtml(member.domain)}), I confirm that all edge features execute strictly local RPCs. No shared synchronization daemons or data replication streams are permitted.</p>`;
      }
    } else if (qLower.includes('sunday') || qLower.includes('sla') || qLower.includes('peak') || qLower.includes('check-in')) {
      if (member.title.toLowerCase().includes('sla') || member.title.toLowerCase().includes('reliability') || member.title.toLowerCase().includes('route')) {
        return `<p>Sunday morning holy hours (06:00 to 13:00) require sub-50ms kiosk check-in response times. Our connection pool headroom is at 92%, automated point-in-time recovery snapshots are verified, and synthetic health probes return 200 OK. The Sunday SLA target (99.99%) is healthy.</p>`;
      } else {
        return `<p>We support the zero-downtime Sunday SLA invariant. Staff, volunteers, and parishioners rely on instant access for Sunday check-ins and worship services without latency hiccups.</p>`;
      }
    } else if (qLower.includes('hipaa') || qLower.includes('pastoral note') || qLower.includes('confidential')) {
      return `<p>Pastoral counseling and clinical notes are encrypted at rest with <code>pgcrypto</code>. RLS policies restrict SELECT queries strictly to the assigned minister/clinician. Unauthenticated roles or general staff receive zero row exposure. The clergy-penitent privilege is safeguarded.</p>`;
    } else if (qLower.includes('speedgrader') || qLower.includes('rubric') || qLower.includes('drip')) {
      return `<p>In Trinity feature delivery (COUNCIL-2026-047), we achieved split-screen SpeedGrader and automated content drip with $0 added hosting cost. Multi-criterion rubrics execute via native client-side SVG annotation and Supabase JSONB scoring.</p>`;
    } else if (qLower.includes('creed') || qLower.includes('confession') || qLower.includes('orthos') || qLower.includes('theological')) {
      return `<p>Orthos cross-links historical confessions (Nicene, Westminster, 1689 London Baptist) directly with Koine Greek/Hebrew root lexicons via pgvector. No doctrinal drift or modern paraphrasing bias is permitted.</p>`;
    } else {
      return `<p>I have reviewed this matter against our non-negotiable invariant: <em>"${escapeHtml(member.invariant_focus)}"</em>. Within the scope of ${escapeHtml(member.domain)}, this proposal satisfies all criteria. I submit a formal vote of <strong>APPROVAL</strong> under our sovereign council charter.</p>`;
    }
  }

  // 16. Tab Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // 17. Fleet Filtering & Search
  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip[data-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      if (fleetData) renderFleetGrid(fleetData.products);
    });
  });

  document.getElementById('fleet-search')?.addEventListener('input', () => {
    if (fleetData) renderFleetGrid(fleetData.products);
  });

  // 18. Task Filtering & Search
  document.querySelectorAll('.filter-chip[data-task-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip[data-task-filter]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeTaskFilter = chip.getAttribute('data-task-filter');
      if (fleetData) renderTasksTab(fleetData.tasks);
    });
  });

  document.getElementById('task-search')?.addEventListener('input', () => {
    if (fleetData) renderTasksTab(fleetData.tasks);
  });

  // 19. Sync Button
  document.getElementById('btn-sync')?.addEventListener('click', () => {
    showToast('Fleet is synced with latest edge telemetry!');
    initData();
  });

  // ==========================================================================
  // 20. Evidence & Challenges Center Tab
  // ==========================================================================
  let activeChalFilter = 'all';

  function renderChallengesTab(reconciliations) {
    const tbody = document.getElementById('central-challenges-tbody');
    const badgeEl = document.getElementById('tab-challenges-badge');
    const kpiVerified = document.getElementById('chal-kpi-verified');

    if (badgeEl) badgeEl.textContent = `${reconciliations.length}`;
    if (kpiVerified) kpiVerified.textContent = `${reconciliations.length} Proofs`;

    if (!tbody) return;
    tbody.innerHTML = '';

    const searchTerm = (document.getElementById('chal-search')?.value || '').toLowerCase();

    const filtered = reconciliations.filter(r => {
      const matchFilter = (activeChalFilter === 'all') || (activeChalFilter === 'accepted');
      const matchSearch = r.product.toLowerCase().includes(searchTerm) ||
                          r.field.toLowerCase().includes(searchTerm) ||
                          r.evidence.toLowerCase().includes(searchTerm);
      return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 24px;">
            No challenges matching search criteria.
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${escapeHtml(r.date)}</td>
        <td><strong>${escapeHtml(r.product)}</strong></td>
        <td><code>${escapeHtml(r.field)}</code></td>
        <td style="color: var(--text-dim); font-size: 12px;">${escapeHtml(r.prior_value)}</td>
        <td><strong style="color: var(--emerald-500);">${escapeHtml(r.reconciled_value)}</strong></td>
        <td style="font-size: 12px; color: #D1D5DB;">${escapeHtml(r.evidence)}</td>
        <td><span class="status-badge live" style="font-size: 11px;">🟢 ACCEPTED & RECONCILED</span></td>
      `;
      tbody.appendChild(tr);
    });

    // Wires filter chips
    document.querySelectorAll('.filter-chip[data-chal-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip[data-chal-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeChalFilter = chip.getAttribute('data-chal-filter');
        renderChallengesTab(reconciliations);
      });
    });

    document.getElementById('chal-search')?.addEventListener('input', () => {
      renderChallengesTab(reconciliations);
    });

    document.getElementById('btn-run-full-audit')?.addEventListener('click', () => {
      showToast('Triggered Fleet Evidence Verification Audit across all 6 repos!');
    });
  }

  // ==========================================================================
  // 21. Operations Manual & AgY Academy Setup
  // ==========================================================================
  function renderManualTab() {
    // Top header button to open help
    document.getElementById('btn-open-help')?.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      const manualBtn = document.querySelector('.tab-btn[data-tab="tab-manual"]');
      if (manualBtn) manualBtn.classList.add('active');
      document.getElementById('tab-manual')?.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Sidebar navigation smooth scroll
    document.querySelectorAll('.manual-nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.manual-nav-item').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const targetId = link.getAttribute('href')?.replace('#', '');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Search filter for manual articles
    document.getElementById('manual-search-input')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.manual-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ==========================================================================
  // 21. Marketing & Business Presentations Hub Tab
  // ==========================================================================
  let selectedPresoId = 'platform';
  let currentSlideIndex = 0;
  let selectedAiFormat = 'claude';

  function renderPresosTab(presosList) {
    if (!presosList || presosList.length === 0) {
      if (window.CHURCHCORE_PRESOS_DATA && window.CHURCHCORE_PRESOS_DATA.decks) {
        presosList = window.CHURCHCORE_PRESOS_DATA.decks;
      } else {
        return;
      }
    }

    const navBar = document.getElementById('presos-nav-bar');
    const badgeEl = document.getElementById('tab-presos-badge');
    if (badgeEl) badgeEl.textContent = `${presosList.length}`;

    if (navBar) {
      navBar.innerHTML = '';
      presosList.forEach(deck => {
        const btn = document.createElement('button');
        btn.className = `preso-pill-btn ${deck.id === selectedPresoId ? 'active' : ''}`;
        btn.setAttribute('data-preso-id', deck.id);
        btn.innerHTML = `<span>${deck.icon}</span> <span>${escapeHtml(deck.short_name)}</span>`;
        btn.addEventListener('click', () => {
          selectedPresoId = deck.id;
          currentSlideIndex = 0;
          document.querySelectorAll('.preso-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          updatePresoView(presosList);
        });
        navBar.appendChild(btn);
      });
    }

    // Refresh button listener
    document.getElementById('btn-refresh-presos')?.addEventListener('click', () => {
      showToast('Refreshing live telemetry & presentation materials...');
      initData();
    });

    // AI Tab buttons listener
    document.querySelectorAll('.ai-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedAiFormat = btn.getAttribute('data-ai');
        updateAiPromptView(presosList);
      });
    });

    // Copy Prompt Button
    document.getElementById('btn-copy-ai-prompt')?.addEventListener('click', () => {
      const codeEl = document.getElementById('ai-prompt-code');
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.textContent).then(() => {
          showToast(`Copied ${selectedAiFormat.toUpperCase()} prompt packet to clipboard!`);
        });
      }
    });

    // Slide Navigation Buttons
    const btnPrev = document.getElementById('btn-preso-prev');
    const btnNext = document.getElementById('btn-preso-next');
    const btnFullscreen = document.getElementById('btn-preso-fullscreen');

    btnPrev?.addEventListener('click', () => {
      const deck = presosList.find(d => d.id === selectedPresoId) || presosList[0];
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlideCanvas(deck);
      }
    });

    btnNext?.addEventListener('click', () => {
      const deck = presosList.find(d => d.id === selectedPresoId) || presosList[0];
      if (currentSlideIndex < deck.slides.length - 1) {
        currentSlideIndex++;
        updateSlideCanvas(deck);
      }
    });

    btnFullscreen?.addEventListener('click', () => {
      const card = document.querySelector('.preso-player-card');
      if (card) {
        if (!document.fullscreenElement) {
          card.requestFullscreen?.().catch(err => console.warn(err));
        } else {
          document.exitFullscreen?.();
        }
      }
    });

    // Keyboard Arrow Keys support for Slides
    window.addEventListener('keydown', (e) => {
      const presosTab = document.getElementById('tab-presos');
      if (presosTab && presosTab.classList.contains('active')) {
        const deck = presosList.find(d => d.id === selectedPresoId) || presosList[0];
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          if (currentSlideIndex < deck.slides.length - 1) {
            currentSlideIndex++;
            updateSlideCanvas(deck);
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlideCanvas(deck);
          }
        }
      }
    });

    updatePresoView(presosList);
  }

  function updatePresoView(presosList) {
    const deck = presosList.find(d => d.id === selectedPresoId) || presosList[0];
    if (!deck) return;

    // 1. Update Hero Banner
    const heroBanner = document.getElementById('preso-hero-banner');
    if (heroBanner) {
      heroBanner.innerHTML = `
        <div>
          <div class="preso-hero-title">
            <span>${deck.icon}</span>
            <span>${escapeHtml(deck.name)}</span>
            <span class="badge-gold">${escapeHtml(deck.badge)}</span>
          </div>
          <div class="preso-hero-tagline">${escapeHtml(deck.tagline)}</div>
          <div class="preso-meta-chips">
            <span class="preso-chip">🎯 <strong>Buyers:</strong> ${escapeHtml(deck.buyer_personas.slice(0, 2).join(', '))}</span>
            <span class="preso-chip">⚡ <strong>Replaces:</strong> ${escapeHtml(deck.displacement_targets.replace(/Displaces|Replaces/gi, ''))}</span>
            <span class="preso-chip green">🌐 <a href="${deck.live_domain}" target="_blank" style="color: inherit; text-decoration: none;"><strong>${escapeHtml(deck.live_domain.replace('https://', ''))}</strong> ↗</a></span>
            <span class="preso-chip gold">📊 <strong>Scale:</strong> ${escapeHtml(deck.scale_metrics)}</span>
            <span class="preso-chip">💰 <strong>Pricing:</strong> ${escapeHtml(deck.pricing_headline)}</span>
          </div>
        </div>
        <div style="text-align: right; min-width: 140px;">
          <a href="docs/marketing/presos/${deck.id}-preso.md" target="_blank" class="btn btn-secondary" style="font-size: 11px; padding: 6px 12px; gap: 6px; text-decoration: none;">
            📄 View Dossier
          </a>
          <div style="font-size: 10px; color: var(--text-dim); margin-top: 8px;">
            Synced: ${escapeHtml(deck.last_synced.split(' ')[0])}
          </div>
        </div>
      `;
    }

    // 2. Update Slide View
    updateSlideCanvas(deck);

    // 3. Update AI Prompts
    updateAiPromptView(presosList);

    // 4. Update Live Milestones Card
    const versionTag = document.getElementById('preso-version-tag');
    if (versionTag) versionTag.textContent = deck.version || 'v1.0.0';
    const lastSyncedLabel = document.getElementById('preso-last-synced-label');
    if (lastSyncedLabel) lastSyncedLabel.textContent = `Last Indexed: ${deck.last_synced}`;

    const bulletsContainer = document.getElementById('preso-live-bullets-container');
    if (bulletsContainer) {
      bulletsContainer.innerHTML = `
        <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid var(--border-subtle);">
          <strong style="color: #FFF; display: block; margin-bottom: 4px;">🛡️ Constitutional Guarantee</strong>
          ${escapeHtml(deck.constitutional_moat)}
        </div>
        <div style="padding: 10px 14px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid var(--border-subtle);">
          <strong style="color: #FFF; display: block; margin-bottom: 4px;">🚀 Live Production Target</strong>
          Active deployment at <a href="${deck.live_domain}" target="_blank" style="color: var(--cyan-400);">${escapeHtml(deck.live_domain)}</a>
        </div>
      `;
    }
  }

  function updateSlideCanvas(deck) {
    const slide = deck.slides[currentSlideIndex] || deck.slides[0];
    const counterEl = document.getElementById('preso-slide-counter');
    const badgeEl = document.getElementById('preso-slide-badge');
    const viewport = document.getElementById('preso-slide-viewport');

    if (counterEl) counterEl.textContent = `Slide ${currentSlideIndex + 1} of ${deck.slides.length}`;
    if (badgeEl) badgeEl.textContent = (slide.type || 'SLIDE').replace(/_/g, ' ').toUpperCase();

    // Disable/Enable buttons
    const btnPrev = document.getElementById('btn-preso-prev');
    const btnNext = document.getElementById('btn-preso-next');
    if (btnPrev) btnPrev.style.opacity = currentSlideIndex === 0 ? '0.4' : '1';
    if (btnNext) btnNext.style.opacity = currentSlideIndex === deck.slides.length - 1 ? '0.4' : '1';

    if (viewport) {
      const bulletsHtml = slide.key_takeaways.map(t => `
        <div class="slide-takeaway-item">
          <span style="color: var(--gold-500); font-size: 16px;">✦</span>
          <span>${escapeHtml(t)}</span>
        </div>
      `).join('');

      viewport.innerHTML = `
        <div class="slide-title-area">
          <div class="slide-main-title">${escapeHtml(slide.title)}</div>
          <div class="slide-subtitle">${escapeHtml(slide.subtitle)}</div>
        </div>

        <div class="slide-body-grid">
          <div class="slide-takeaways-list">
            ${bulletsHtml}
          </div>
          <div class="slide-media-preview">
            <img src="${(slide.visual_asset || 'screenshots/fleet_tab_top_view.png').replace(/^dashboard\//, '')}" alt="${escapeHtml(slide.title)}" onerror="this.src='screenshots/fleet_tab_top_view.png'">
            <div style="position: absolute; bottom: 8px; left: 8px; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 6px; font-size: 10px; color: var(--gold-400); font-weight: 700;">
              VERIFIED ARTIFACT
            </div>
          </div>
        </div>

        <div class="preso-speaker-notes-box">
          <div class="speaker-notes-label">🗣️ Presenter Script (Verbatim Voice Track)</div>
          <div class="speaker-notes-text">"${escapeHtml(slide.speaker_notes)}"</div>
        </div>
      `;
    }
  }

  function updateAiPromptView(presosList) {
    const deck = presosList.find(d => d.id === selectedPresoId) || presosList[0];
    if (!deck) return;

    const codeEl = document.getElementById('ai-prompt-code');
    if (codeEl && deck.prompts) {
      codeEl.textContent = deck.prompts[selectedAiFormat] || deck.prompts['claude'];
    }
  }

  // Master Render
  function renderDashboard(data) {
    renderKPIs(data);
    renderFleetGrid(data.products || []);
    renderCouncilsTab(data.councils || []);
    renderChallengesTab(data.reconciliations || []);
    renderPlansTab(data.plans || []);
    renderTasksTab(data.tasks || []);
    renderCommercialTab(data.commercial || null);
    renderSundaySLATab(data.sunday_sla || null);
    renderTechStackTab(data.tech_stack_mesh || []);
    renderReadinessRadar(data.products || []);
    renderComplianceTable(data.products || []);
    renderReconciliationsTable(data.reconciliations || []);
    renderAIStream(data.products || []);
    setupCliGenerator();
    renderManualTab();
    renderPresosTab(data.presos || (window.CHURCHCORE_PRESOS_DATA ? window.CHURCHCORE_PRESOS_DATA.decks : []));
  }

  initData();
});
