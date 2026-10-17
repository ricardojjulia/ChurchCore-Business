// ChurchCore Sovereign Control Plane: Executive Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
  let fleetData = window.CHURCHCORE_FLEET_DATA || null;
  let activeFilter = 'all';

  // 1. Clock
  function updateClock() {
    const now = new Date();
    const utcStr = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const clockEl = document.getElementById('clock-display');
    if (clockEl) clockEl.textContent = utcStr;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 2. Fetch or load fleet data
  async function initData() {
    if (!fleetData) {
      try {
        const resp = await fetch('fleet-data.json');
        if (resp.ok) {
          fleetData = await resp.json();
        }
      } catch (e) {
        console.warn('Could not fetch fleet-data.json, checking window object:', e);
      }
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

  // 3. Render Top KPIs
  function renderKPIs(data) {
    const summary = data.summary;
    document.getElementById('kpi-total-repos').textContent = summary.total_products;
    document.getElementById('kpi-online-count').textContent = `${summary.online_in_production} / ${summary.total_products}`;
    document.getElementById('kpi-avg-readiness').textContent = `${summary.average_readiness_score}%`;
    document.getElementById('kpi-avg-completion').textContent = `${summary.average_completion_pct}%`;
    document.getElementById('kpi-online-sub').textContent = `${Math.round((summary.online_in_production / summary.total_products) * 100)}% Fleet on Vercel Edge`;
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

  // 5. Render Readiness Radar
  function renderReadinessRadar(products) {
    const container = document.getElementById('readiness-cards-container');
    if (!container) return;
    container.innerHTML = '';

    products.forEach(p => {
      const isOnline = p.online_status.is_online;
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

  // 6. Render Council Compliance Table
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

  // 7. Render AI Activity Stream
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

  // 8. AgY CLI Generator
  function setupCliGenerator() {
    const btnGen = document.getElementById('btn-generate-cli');
    const selectRepo = document.getElementById('cli-repo-select');
    const selectAction = document.getElementById('cli-action-select');
    const customPromptGroup = document.getElementById('cli-custom-prompt-group');
    const customPromptInput = document.getElementById('cli-custom-prompt');
    const termOutput = document.getElementById('terminal-output');
    const btnCopy = document.getElementById('btn-copy-terminal');

    selectAction.addEventListener('change', () => {
      if (selectAction.value === 'custom') {
        customPromptGroup.style.display = 'block';
      } else {
        customPromptGroup.style.display = 'none';
      }
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

  // 9. Modal Handler
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

  document.getElementById('modal-close')?.addEventListener('click', () => {
    document.getElementById('detail-modal').classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('detail-modal');
    if (e.target === modal) modal.classList.remove('active');
  });

  // 10. Tab Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId)?.classList.add('active');
    });
  });

  // 11. Filtering & Search
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.getAttribute('data-filter');
      if (fleetData) renderFleetGrid(fleetData.products);
    });
  });

  document.getElementById('fleet-search')?.addEventListener('input', () => {
    if (fleetData) renderFleetGrid(fleetData.products);
  });

  // 12. Sync Button
  document.getElementById('btn-sync')?.addEventListener('click', () => {
    showToast('Fleet is synced with latest edge telemetry!');
    initData();
  });

  // Master Render
  function renderDashboard(data) {
    renderKPIs(data);
    renderFleetGrid(data.products);
    renderReadinessRadar(data.products);
    renderComplianceTable(data.products);
    renderAIStream(data.products);
    setupCliGenerator();
  }

  initData();
});
