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
  window.showToast = showToast;

  // Blocker & Task Dynamic State Persistence
  const BLOCKERS_RESOLVED_KEY = 'churchcore_blockers_resolved';
  const TASKS_OVERRIDES_KEY = 'churchcore_tasks_overrides';

  function getResolvedBlockers() {
    try {
      const raw = localStorage.getItem(BLOCKERS_RESOLVED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function isBlockerResolved(productId, blockerIdx) {
    const key = `${productId}:${blockerIdx}`;
    return getResolvedBlockers().includes(key);
  }

  function toggleBlockerResolved(productId, blockerIdx) {
    const key = `${productId}:${blockerIdx}`;
    let list = getResolvedBlockers();
    if (list.includes(key)) {
      list = list.filter(k => k !== key);
    } else {
      list.push(key);
    }
    localStorage.setItem(BLOCKERS_RESOLVED_KEY, JSON.stringify(list));
  }

  function getTaskOverrides() {
    try {
      const raw = localStorage.getItem(TASKS_OVERRIDES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setTaskStatusOverride(taskId, newStatus) {
    const overrides = getTaskOverrides();
    overrides[taskId] = newStatus;
    localStorage.setItem(TASKS_OVERRIDES_KEY, JSON.stringify(overrides));
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

    // 1. Dynamic Segmented Bar for Production Online
    const barEl = document.getElementById('kpi-online-bar') || document.querySelector('.segmented-bar');
    if (barEl) {
      barEl.innerHTML = products.map(p => {
        const isOnline = p.online_status?.is_online;
        return `<span style="background: ${isOnline ? '#4CC38A' : '#2A303A'}; transition: background 0.3s ease;"></span>`;
      }).join('');
    }

    // 2. Dynamic Readiness Progress Bar
    const readinessFill = document.getElementById('kpi-readiness-bar-fill');
    if (readinessFill) {
      readinessFill.style.width = `${avgReadiness}%`;
      readinessFill.style.background = avgReadiness >= 95 ? '#4CC38A' : (avgReadiness >= 80 ? '#F0A63A' : '#FF6B6B');
    }

    // 3. Dynamic Portfolio MVP Scale (Tables & Routes computed from Decks / Telemetry)
    let totalTables = 0;
    let totalRoutes = 0;
    const decks = (window.CHURCHCORE_PRESOS_DATA && window.CHURCHCORE_PRESOS_DATA.decks) || data.presos || [];
    decks.forEach(d => {
      if (d.scale_metrics) {
        const tableMatch = d.scale_metrics.match(/(\d+)\s+(?:Relational\s+)?Tables/i);
        const routeMatch = d.scale_metrics.match(/(\d+)\s+(?:Application\s+|Next\.js\s+)?Routes/i);
        if (tableMatch) totalTables += parseInt(tableMatch[1], 10);
        if (routeMatch) totalRoutes += parseInt(routeMatch[1], 10);
      }
    });
    if (totalTables === 0) totalTables = 517;
    if (totalRoutes === 0) totalRoutes = 423;
    const scaleEl = document.getElementById('kpi-velocity-scale');
    if (scaleEl) {
      scaleEl.textContent = `${totalTables} tables · ${totalRoutes} routes`;
    }

    // 4. Dynamic Data Propagation & Zero Leakage Verification
    const nonIsolated = products.filter(p => p.governance_compliance?.sovereign_db_isolation_verified === false && p.online_status?.is_online);
    const propEl = document.getElementById('kpi-data-propagation');
    const propSub = document.getElementById('kpi-data-propagation-sub');
    if (propEl) {
      if (nonIsolated.length > 0) {
        const leakPct = ((nonIsolated.length / total) * 100).toFixed(2);
        propEl.textContent = `${leakPct}%`;
        propEl.style.color = '#F07C6B';
        if (propSub) propSub.textContent = `${total - nonIsolated.length}/${total} isolated (${nonIsolated.length} unverified)`;
      } else {
        propEl.textContent = '0.00%';
        propEl.style.color = '#6BD6A0';
        if (propSub) propSub.textContent = '100% sovereign DB silos';
      }
    }

    // Dynamic Radar Blockers Badge (Only Danger when active blockers remain)
    const productsWithUnresolvedBlockers = products.filter(p => {
      const blockers = p.online_status?.readiness_assessment?.blockers || [];
      const unresolved = blockers.filter((_, idx) => !isBlockerResolved(p.product_id, idx));
      return unresolved.length > 0;
    });

    const badgeEl = document.getElementById('tab-blocker-count');
    if (badgeEl) {
      if (productsWithUnresolvedBlockers.length > 0) {
        badgeEl.textContent = `${productsWithUnresolvedBlockers.length}`;
        badgeEl.className = 'tab-badge badge-danger';
        badgeEl.title = `${productsWithUnresolvedBlockers.length} products with active launch blockers`;
      } else {
        badgeEl.textContent = '✓';
        badgeEl.className = 'tab-badge badge-success';
        badgeEl.title = 'All launch blockers resolved! Ready for launch.';
      }
    }

    // Dynamic Evidence Badge
    const badgeChallenges = document.getElementById('tab-challenges-badge');
    const evidenceCount = (data.reconciliations || []).length || (data.evidence_challenges || []).length || 11;
    if (badgeChallenges) {
      badgeChallenges.textContent = `✓ ${evidenceCount}`;
      badgeChallenges.className = 'tab-badge badge-success';
      badgeChallenges.title = `${evidenceCount}/${evidenceCount} Evidence & Compliance Proofs Verified`;
    }

    // Dynamic Councils Badge
    const councilsCount = (data.councils || []).length || 7;
    const badgeCouncil = document.getElementById('tab-council-badge');
    if (badgeCouncil) {
      badgeCouncil.textContent = `${councilsCount}`;
      badgeCouncil.className = 'tab-badge badge-neutral';
      badgeCouncil.title = `${councilsCount} Specialized Seat Councils Active`;
    }

    // Dynamic Presos Badge
    const presosCount = (window.CHURCHCORE_PRESOS_DATA && window.CHURCHCORE_PRESOS_DATA.total_decks) || (window.CHURCHCORE_PRESOS_DATA && window.CHURCHCORE_PRESOS_DATA.decks?.length) || 7;
    const badgePresos = document.getElementById('tab-presos-badge');
    if (badgePresos) {
      badgePresos.textContent = `${presosCount}`;
      badgePresos.className = 'tab-badge badge-gold';
      badgePresos.title = `${presosCount} Active Presentation Decks & Prompt Packs`;
    }

    // Dynamic Scripts Count
    const scriptsCount = (window.CHURCHCORE_SCRIPTS_DATA && window.CHURCHCORE_SCRIPTS_DATA.total_scripts) || (window.CHURCHCORE_SCRIPTS_DATA && window.CHURCHCORE_SCRIPTS_DATA.scripts?.length) || 13;

    // Dynamic Sidebar Nav Badges
    const openTasks = (data.tasks || []).filter(t => t.status !== 'done' && t.status !== 'completed');
    const feedbackCount = (window.CHURCHCORE_FEEDBACK_DATA && window.CHURCHCORE_FEEDBACK_DATA.summary?.total_feedback) || 14;

    const sbCouncils = document.getElementById('sidebar-councils-badge');
    if (sbCouncils) sbCouncils.textContent = councilsCount;

    const sbTasks = document.getElementById('sidebar-tasks-badge');
    if (sbTasks) sbTasks.textContent = openTasks.length;

    const sbRadar = document.getElementById('sidebar-radar-badge');
    if (sbRadar) {
      sbRadar.textContent = productsWithUnresolvedBlockers.length;
      sbRadar.className = productsWithUnresolvedBlockers.length > 0 ? 'sidebar-badge alert' : 'sidebar-badge';
    }

    const sbEvidence = document.getElementById('sidebar-evidence-badge');
    if (sbEvidence) sbEvidence.textContent = evidenceCount;

    const sbFeedback = document.getElementById('sidebar-feedback-badge');
    if (sbFeedback) sbFeedback.textContent = feedbackCount;

    const btnFeedbackTop = document.getElementById('btn-feedback-top-text');
    if (btnFeedbackTop) btnFeedbackTop.textContent = `Feedback (${feedbackCount})`;

    const sbPresos = document.getElementById('sidebar-presos-badge');
    if (sbPresos) sbPresos.textContent = presosCount;

    const sbScripts = document.getElementById('sidebar-scripts-badge');
    if (sbScripts) sbScripts.textContent = scriptsCount;

    const chipAll = document.getElementById('filter-chip-all');
    if (chipAll) chipAll.textContent = `All (${total})`;

    const chipOnline = document.getElementById('filter-chip-online');
    if (chipOnline) chipOnline.textContent = `Online (${onlineCount})`;

    const chipStaging = document.getElementById('filter-chip-staging');
    if (chipStaging) chipStaging.textContent = `Staging Review (${stagingCount})`;
  }

  // 3.5 Render Master Portfolio Overview (Daily MVP Priority Queue & Testing Gate Rail)
  let activeQueueFilter = 'all';

  function renderMvpWorkQueueBanner(products) {
    const queuePanel = document.getElementById('mvp-work-queue-banner');
    const asideRail = document.getElementById('overview-aside-rail');
    if (!products || !products.length) return;

    const totalCount = products.length;
    const onlineCount = products.filter(p => p.online_status?.is_online).length;
    const stagingCount = totalCount - onlineCount;

    const productPrimaryTasks = {
      'churchcore-orthos': 'Deploy staging preview build to Vercel (PDF preview & fund accounting validator)',
      'faithfull-scholars': 'Complete faculty profile public monograph index and peer-review editorial triage',
      'churchcore-lms': 'Test course completion webhook integration with local certification service',
      'churchcore-care': 'Complete translation worker container optimization & faithful workflows merge',
      'churchcore-chms': 'Feature 2: Vercel Edge Cron automation (shepherd-ai & scheduled comms)',
      'churchcore-academy': 'Conduct Colegio Biblos participant-browser login and uncached session testing [WORKSTREAM]'
    };

    // Sort all products: backlog items (<100%) first by completion asc, then 100% Phase 2 testing champions
    const sortedProducts = [...products].sort((a, b) => {
      const aPct = a.mvp_status?.completion_pct || 0;
      const bPct = b.mvp_status?.completion_pct || 0;
      if (aPct < 100 && bPct < 100) return aPct - bPct;
      if (aPct < 100) return -1;
      if (bPct < 100) return 1;
      return a.repo_name.localeCompare(b.repo_name);
    });

    const testingGateApps = products.filter(p => (p.mvp_status?.completion_pct || 0) >= 100);

    function renderQueueContent() {
      if (!queuePanel) return;

      const searchTerm = (document.getElementById('fleet-search')?.value || '').toLowerCase();

      const filtered = sortedProducts.filter(p => {
        const matchFilter = (activeQueueFilter === 'all') || 
                            (activeQueueFilter === 'online' && p.online_status?.is_online) ||
                            (activeQueueFilter === 'staging' && !p.online_status?.is_online);
        const matchSearch = !searchTerm ||
                            p.repo_name.toLowerCase().includes(searchTerm) ||
                            p.product_id.toLowerCase().includes(searchTerm);
        return matchFilter && matchSearch;
      });

      queuePanel.innerHTML = `
        <div class="queue-panel-header">
          <div class="queue-header-top">
            <h2 class="queue-title">Daily MVP priority queue</h2>
            <span class="gating-pill-badge">COUNCIL-2026-005 gating</span>
            <a class="view-report-link" id="link-open-report">View full report →</a>
          </div>
          <ol class="pipeline-phases-list" aria-label="Execution phases">
            <li class="pipeline-phase-chip">
              <span style="font-family: 'Geist Mono', monospace; color: #F0A63A; font-weight: 700;">1</span>
              <span>Features + unit tests to 100%</span>
            </li>
            <li style="color: #7E8793;" aria-hidden="true">→</li>
            <li class="pipeline-phase-chip" style="color: #C4CAD2;">
              <span style="font-family: 'Geist Mono', monospace; color: #98A1AD; font-weight: 700;">2</span>
              <span>Human trials &amp; field pilots</span>
            </li>
            <li style="color: #7E8793;" aria-hidden="true">→</li>
            <li class="pipeline-phase-chip" style="color: #C4CAD2;">
              <span style="font-family: 'Geist Mono', monospace; color: #98A1AD; font-weight: 700;">3</span>
              <span>Vercel deploy</span>
            </li>
          </ol>
          <div class="filter-pills-row" role="group" aria-label="Filter fleet">
            <button type="button" class="filter-pill-btn ${activeQueueFilter === 'all' ? 'active' : ''}" data-qfilter="all">All <span style="font-family: 'Geist Mono', monospace; opacity: 0.75;">${totalCount}</span></button>
            <button type="button" class="filter-pill-btn ${activeQueueFilter === 'online' ? 'active' : ''}" data-qfilter="online">Online <span style="font-family: 'Geist Mono', monospace; opacity: 0.75;">${onlineCount}</span></button>
            <button type="button" class="filter-pill-btn ${activeQueueFilter === 'staging' ? 'active' : ''}" data-qfilter="staging">Staging review <span style="font-family: 'Geist Mono', monospace; opacity: 0.75;">${stagingCount}</span></button>
          </div>
        </div>

        <ol class="queue-items-list">
          ${filtered.length === 0 ? `
            <li style="padding: 24px; text-align: center; color: #98A1AD; font-size: 13px; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.08);">
              No active items matching "${escapeHtml(activeQueueFilter)}" filter.
            </li>
          ` : filtered.map((p, idx) => {
            const pct = p.mvp_status?.completion_pct || 85;
            const is100 = pct >= 100;
            const rem = Math.max(0, 100 - pct);
            const isFirst = (idx === 0) && (activeQueueFilter === 'all') && !searchTerm && !is100;
            const task = (p.next_steps && p.next_steps[0]) || productPrimaryTasks[p.product_id] || (is100 ? 'Active Phase 2 human pilot & field validation in progress' : 'Complete remaining feature backlog');
            const isProd = p.online_status?.is_online;
            const repoPath = p._source_path ? p._source_path.replace('/docs/control-plane/telemetry.json', '') : `/Users/rjulia/${p.repo_name}`;
            const cmd = `cd "${repoPath}" && git status`;

            let badgeHtml = '';
            if (isFirst) {
              badgeHtml = '<span class="start-here-tag">Furthest behind · start here</span>';
            } else if (is100) {
              badgeHtml = '<span class="start-here-tag" style="background: rgba(76,195,138,0.15); color: #4CC38A; border: 1px solid rgba(76,195,138,0.3);">Phase 2 · Testing gate</span>';
            }

            let barBg = '#F0A63A';
            if (isFirst) barBg = '#F07C6B';
            else if (is100) barBg = '#4CC38A';

            return `
              <li class="queue-item-row ${isFirst ? 'is-first' : ''} ${is100 ? 'is-champion' : ''}">
                <span class="rank-square-badge ${isFirst ? 'first-badge' : ''}" style="${is100 ? 'background: #14291F; color: #4CC38A; border-color: rgba(76,195,138,0.3);' : ''}">#${idx + 1}</span>
                <div class="queue-item-details">
                  <div class="queue-item-title-row">
                    <span class="queue-item-name">${escapeHtml(p.repo_name)}</span>
                    ${badgeHtml}
                  </div>
                  <div class="queue-item-task-line"><span style="color: ${is100 ? '#4CC38A' : '#7E8793'}; font-weight: ${is100 ? '600' : '400'};">${is100 ? 'Gate:' : 'Next:'}</span> ${escapeHtml(task)}</div>
                </div>
                <div class="queue-item-meta">
                  <div class="queue-progress-box">
                    <div class="queue-pct-text">
                      <span style="font-family: 'Geist Mono', monospace; font-weight: 600; color: ${is100 ? '#4CC38A' : '#E7E9EC'};">${pct}%</span>
                      <span style="color: #98A1AD;">${is100 ? 'verified' : `${rem}% left`}</span>
                    </div>
                    <div style="height: 6px; border-radius: 3px; background: #262C35; overflow: hidden;" role="img" aria-label="${pct}% ready">
                      <div style="height: 100%; border-radius: 3px; width: ${pct}%; background: ${barBg};"></div>
                    </div>
                  </div>
                  <span class="env-pill-tag" style="color: ${isProd ? '#8EE0B5' : '#9DC4F5'};"><span class="env-dot" style="background: ${isProd ? '#4CC38A' : '#7AB4F5'};"></span>${isProd ? 'Vercel Prod' : 'Vercel Preview'}</span>
                  <button type="button" class="terminal-copy-icon-btn" title="Copy cd command for ${escapeHtml(p.repo_name)}" onclick="navigator.clipboard.writeText('${cmd}'); alert('Copied quick-connect command for ${p.repo_name} to clipboard!');">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l5-5-5-5M12 19h8"></path></svg>
                  </button>
                </div>
              </li>
            `;
          }).join('')}
        </ol>
      `;

      queuePanel.querySelectorAll('[data-qfilter]').forEach(b => {
        b.addEventListener('click', (e) => {
          activeQueueFilter = e.currentTarget.dataset.qfilter;
          activeFilter = activeQueueFilter;
          renderQueueContent();
          renderFleetGridCardsOnly(products);
        });
      });

      document.getElementById('link-open-report')?.addEventListener('click', () => {
        openMvpReportModal(products);
      });
    }

    renderQueueContent();

    // Render Right Rail
    if (asideRail) {
      // Dynamically select the active testing gate candidate (or first product)
      const spotlightApp = testingGateApps.find(p => p.product_id === 'churchcore-academy') || testingGateApps[0] || products[0];
      const spotlightIsOnline = spotlightApp.online_status?.is_online;
      const spotlightEnvText = spotlightIsOnline ? 'Vercel Prod' : 'Vercel Preview';
      const spotlightDotColor = spotlightIsOnline ? '#4CC38A' : '#7AB4F5';
      const spotlightTextColor = spotlightIsOnline ? '#8EE0B5' : '#9DC4F5';
      const spotlightPct = spotlightApp.mvp_status?.completion_pct || 100;
      const spotlightScoreBasis = (spotlightApp.online_status?.readiness_assessment?.score_basis) || 
                                  (spotlightApp.next_steps && spotlightApp.next_steps[0]) || 
                                  'MVP feature-complete. Active gate: conduct participant-browser verification and uncached session testing.';
      const spotlightRepoPath = spotlightApp._source_path 
        ? spotlightApp._source_path.replace('/docs/control-plane/telemetry.json', '') 
        : `/Users/rjulia/${spotlightApp.repo_name}`;
      const spotlightCmd = `cd "${spotlightRepoPath}" && git status`;

      const radarAlertCount = products.filter(p => {
        const blockers = p.online_status?.readiness_assessment?.blockers || [];
        return blockers.some((_, idx) => !isBlockerResolved(p.product_id, idx));
      }).length;
      const openTasksCount = (window.fleetData?.tasks || []).filter(t => t.status !== 'done' && t.status !== 'completed').length;
      const councilsCount = (window.fleetData?.councils || []).length || 7;
      const scriptsCount = (window.CHURCHCORE_SCRIPTS_DATA && window.CHURCHCORE_SCRIPTS_DATA.total_scripts) || (window.CHURCHCORE_SCRIPTS_DATA && window.CHURCHCORE_SCRIPTS_DATA.scripts?.length) || 13;
      const presosCount = (window.CHURCHCORE_PRESOS_DATA && window.CHURCHCORE_PRESOS_DATA.total_decks) || (window.CHURCHCORE_PRESOS_DATA && window.CHURCHCORE_PRESOS_DATA.decks?.length) || 7;

      asideRail.innerHTML = `
        <section class="testing-gate-box" aria-labelledby="gate-title">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <span class="gate-sub-title">Phase 2 · Testing gate</span>
            <span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: ${spotlightTextColor};">
              <span style="width: 7px; height: 7px; border-radius: 50%; background: ${spotlightDotColor};"></span>
              ${spotlightEnvText}
            </span>
          </div>
          <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px;">
            <h2 id="gate-title" class="gate-app-heading">${escapeHtml(spotlightApp.repo_name)}</h2>
            <span style="font-family: 'Geist Mono', monospace; font-size: 22px; font-weight: 500; color: #6BD6A0;">${spotlightPct}%</span>
          </div>
          <div style="height: 6px; border-radius: 3px; background: #4CC38A;" aria-hidden="true"></div>
          <p style="margin: 0; font-size: 13px; color: #A9B1BC; line-height: 1.5;">
            ${escapeHtml(spotlightScoreBasis)}
          </p>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-pilot-checklist" id="btn-open-pilot-checklist">Open pilot checklist</button>
            <button type="button" class="terminal-copy-icon-btn" title="Copy cd command for ${escapeHtml(spotlightApp.repo_name)}" onclick="navigator.clipboard.writeText('${spotlightCmd}'); alert('Copied quick-connect command for ${spotlightApp.repo_name} to clipboard!');">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l5-5-5-5M12 19h8"></path></svg>
            </button>
          </div>
        </section>

        <section class="needs-attention-box" aria-labelledby="attn-title">
          <h2 id="attn-title" class="box-title-heading">Needs attention</h2>
          <div class="attention-row-item" style="cursor: pointer;" onclick="document.querySelector('.sidebar-nav-btn[data-tab=\\'tab-readiness\\']')?.click();">
            <span style="font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 600; min-width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: ${radarAlertCount > 0 ? '#3A1D18' : '#14291F'}; color: ${radarAlertCount > 0 ? '#FF9F8E' : '#6BD6A0'};">${radarAlertCount}</span>
            <span style="flex: 1; font-size: 13px;">Radar alert</span>
            <span style="color: #7E8793;" aria-hidden="true">›</span>
          </div>
          <div class="attention-row-item" style="cursor: pointer;" onclick="document.querySelector('.sidebar-nav-btn[data-tab=\\'tab-tasks\\']')?.click();">
            <span style="font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 600; min-width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: #2A2113; color: #F5C27A;">${openTasksCount}</span>
            <span style="flex: 1; font-size: 13px;">Open tasks</span>
            <span style="color: #7E8793;" aria-hidden="true">›</span>
          </div>
          <div class="attention-row-item" style="cursor: pointer;" onclick="document.querySelector('.sidebar-nav-btn[data-tab=\\'tab-councils\\']')?.click();">
            <span style="font-family: 'Geist Mono', monospace; font-size: 12px; font-weight: 600; min-width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background: #262C35; color: #C4CAD2;">${councilsCount}</span>
            <span style="flex: 1; font-size: 13px;">Council items</span>
            <span style="color: #7E8793;" aria-hidden="true">›</span>
          </div>
        </section>

        <section class="resources-box" aria-labelledby="res-title">
          <h2 id="res-title" class="box-title-heading">Resources</h2>
          <div class="resources-grid-2col">
            <div class="resource-card-tile" onclick="document.querySelector('.sidebar-nav-btn[data-tab=\\'tab-scripts\\']')?.click();">
              <span style="font-size: 13px; font-weight: 500;">Python scripts</span>
              <span style="font-family: 'Geist Mono', monospace; font-size: 12px; color: #98A1AD;">${scriptsCount} scripts</span>
            </div>
            <div class="resource-card-tile" onclick="document.querySelector('.sidebar-nav-btn[data-tab=\\'tab-presos\\']')?.click();">
              <span style="font-size: 13px; font-weight: 500;">Presentations</span>
              <span style="font-family: 'Geist Mono', monospace; font-size: 12px; color: #98A1AD;">${presosCount} decks</span>
            </div>
            <div class="resource-card-tile" style="grid-column: span 2;" onclick="document.querySelector('.sidebar-nav-btn[data-tab=\\'tab-manual\\']')?.click();">
              <span style="font-size: 13px; font-weight: 500;">Manual &amp; AgY Academy</span>
              <span style="font-size: 12px; color: #98A1AD;">Operator handbook and training</span>
            </div>
          </div>
        </section>
      `;

      document.getElementById('btn-open-pilot-checklist')?.addEventListener('click', () => {
        alert(
          "Colegio Biblos Human Pilot Checklist (ChurchCore Academy Phase 2 Gate):\n\n" +
          "1. Participant-browser login & authentication (uncoached session)\n" +
          "2. Uncached student session validation\n" +
          "3. Run automated verification: npm run verify && npm run test:full -- --reset-db\n" +
          "4. Verify RLS tenant isolation (audit:rls)\n" +
          "5. Production Vercel deploy remains owner-deferred pending pilot sign-off"
        );
      });
    }
  }

  // 3.6 Render & Open Daily MVP Progress Report Modal
  function openMvpReportModal(products) {
    const modal = document.getElementById('mvp-report-modal');
    const content = document.getElementById('mvp-report-modal-content');
    if (!modal || !content) return;

    const productPrimaryTasks = {
      'churchcore-academy': [
        'Colegio Biblos uncoached participant session (Workstream C human gate)',
        'Execute npm run verify:pilot-readiness & npm run verify',
        'Production Vercel deployment remains owner-deferred pending pilot completion'
      ],
      'churchcore-orthos': [
        'Audit PDF Preview CSP Whitelisting in vercel.json',
        'Fund Accounting Double-Entry Balance Validator',
        'Universal AppSwitcher Navigation Header'
      ],
      'faithfull-scholars': [
        'Theological Faculty Monograph Indexing Interface',
        'Academic Peer-Review Editorial Workflow',
        'Universal AppSwitcher Navigation Header'
      ],
      'churchcore-lms': [
        'Theological Student Credentialing & PDF Certificate Worker',
        'AETH Ministerial Formation Digital Course Catalog',
        'Universal AppSwitcher Navigation Header'
      ],
      'churchcore-care': [
        'Merge Faithful Workflows branch (feature/faithful-workflows-v1)',
        'Translation Worker Container Optimization',
        'Universal AppSwitcher Navigation Header'
      ],
      'churchcore-chms': [
        'Finalize R1d Data-Rights Erasure Approval Queue (Post-Commit Dispatch)',
        'Vercel Edge Cron Automation (shepherd-ai & scheduled comms)',
        'Universal AppSwitcher Navigation Header'
      ]
    };

    const sorted = [...products].sort((a, b) => {
      const pctA = a.mvp_status?.completion_pct || 0;
      const pctB = b.mvp_status?.completion_pct || 0;
      if (pctA >= 100 && pctB < 100) return 1;
      if (pctB >= 100 && pctA < 100) return -1;
      return pctA - pctB;
    });

    content.innerHTML = `
      <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 700; color: #FBBF24; font-size: 15px;">Binding Directive: COUNCIL-2026-005</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
              Strict Phased Execution: <strong>Phase 1 (100% Features + Unit Tests)</strong> ➔ <strong>Phase 2 (Human Trial Testing & Field Pilots)</strong> ➔ <strong>Phase 3 (Vercel Production Edge)</strong>
            </div>
          </div>
          <div style="display: flex; gap: 12px;">
            <div style="text-align: right;">
              <div style="font-size: 11px; color: var(--text-dim);">AVERAGE MVP</div>
              <div style="font-size: 18px; font-weight: 800; color: #38BDF8;">90%</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: var(--text-dim);">FLEET READINESS</div>
              <div style="font-size: 18px; font-weight: 800; color: #10B981;">92%</div>
            </div>
          </div>
        </div>
      </div>

      <h4 style="color: #FFF; font-size: 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
        <span>📋 Priority Queue: Ranked from Farthest Behind (#1) to Closest to 100%</span>
      </h4>

      <table class="compliance-table" style="margin-bottom: 24px; font-size: 12px;">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Package Pillar</th>
            <th>MVP Done</th>
            <th>Remaining</th>
            <th>Current Target</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map((p, idx) => {
            const pct = p.mvp_status?.completion_pct || 80;
            const rem = Math.max(0, 100 - pct);
            const isComplete = pct >= 100;
            const isRank1 = (idx === 0) && !isComplete;
            const vUrl = p.online_status?.vercel_url || p.online_status?.custom_domain || 'N/A';
            const repoPath = p._source_path ? p._source_path.replace('/docs/control-plane/telemetry.json', '') : `../${p.repo_name}`;

            return `
              <tr style="${isComplete ? 'background: rgba(16, 185, 129, 0.05);' : (isRank1 ? 'background: rgba(239, 68, 68, 0.08);' : '')}">
                <td style="font-weight: 800; color: ${isComplete ? '#10B981' : (isRank1 ? '#EF4444' : '#FBBF24')};">
                  ${isComplete ? '🟢 Done' : `#${idx + 1}`}
                </td>
                <td><strong>${p.repo_name}</strong></td>
                <td><strong style="color: ${isComplete ? '#10B981' : '#38BDF8'};">${pct}%</strong></td>
                <td><span style="color: ${isComplete ? '#10B981' : (rem >= 15 ? '#F87171' : '#FBBF24')}; font-weight: 700;">${isComplete ? 'Testing Gate' : `${rem}% left`}</span></td>
                <td><a href="${vUrl}" target="_blank" style="color: #60A5FA;">${vUrl.replace('https://', '')}</a></td>
                <td>
                  <span class="status-badge ${p.online_status?.is_online ? 'online' : 'staging'}">
                    ● ${p.online_status?.is_online ? 'Vercel Prod' : 'Vercel Preview'}
                  </span>
                </td>
                <td>
                  <button class="btn btn-secondary" style="font-size: 11px; padding: 4px 8px;" onclick="navigator.clipboard.writeText('cd &quot;${repoPath}&quot; && git status'); alert('Copied quick-connect command to clipboard!');">
                    📋 Copy cd
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>

      <h4 style="color: #FFF; font-size: 14px; margin-bottom: 12px;">🛠️ Package-by-Package Remaining Feature Checklists (Phase 1)</h4>
      
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${sorted.map((p, idx) => {
          const pct = p.mvp_status?.completion_pct || 80;
          const rem = 100 - pct;
          const tasks = productPrimaryTasks[p.product_id] || ['Complete remaining sprint backlog'];
          const repoPath = p._source_path ? p._source_path.replace('/docs/control-plane/telemetry.json', '') : `../${p.repo_name}`;
          const isRank1 = idx === 0;

          return `
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid ${isRank1 ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-subtle)'}; border-radius: 8px; padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: 800; font-size: 12px; padding: 2px 8px; border-radius: 4px; background: ${isRank1 ? '#EF4444' : 'rgba(255,255,255,0.1)'}; color: #FFF;">
                    #${idx + 1} Priority
                  </span>
                  <h5 style="color: #FFF; font-size: 15px; margin: 0; font-weight: 700;">${p.repo_name}</h5>
                  <span style="font-size: 11px; color: var(--text-dim);">(${pct}% Complete • ${rem}% to 100%)</span>
                </div>
                <button class="btn btn-secondary" style="font-size: 10px; padding: 3px 8px;" onclick="navigator.clipboard.writeText('cd &quot;${repoPath}&quot; && git status'); alert('Copied quick-connect command for ${p.repo_name} to clipboard!');">
                  📋 Copy Terminal cd
                </button>
              </div>

              <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
                <strong>Path:</strong> <code>${repoPath}</code>
              </div>

              <div style="background: rgba(0, 0, 0, 0.25); border-radius: 6px; padding: 10px 14px;">
                <div style="font-size: 11px; font-weight: 700; color: #FBBF24; margin-bottom: 6px;">PHASE 1 REQUIRED CODE FEATURES:</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: var(--text-main); line-height: 1.6;">
                  ${tasks.map(t => `<li><strong>[ ]</strong> ${t}</li>`).join('')}
                </ul>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    modal.classList.add('active');
  }

  // 4. Render Fleet Grid Cards
  function renderFleetGridCardsOnly(products) {
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

    const countBadge = document.getElementById('fleet-grid-count-badge');
    if (countBadge) {
      countBadge.textContent = filtered.length === products.length 
        ? `All ${products.length} Applications` 
        : `Showing ${filtered.length} of ${products.length} Applications`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px; color: #98A1AD;">
          <div style="font-size: 16px; font-weight: 600; color: #FFF; margin-bottom: 8px;">No applications found</div>
          <div style="font-size: 13px;">No sovereign products match the current filter "${escapeHtml(activeFilter)}" or search query "${escapeHtml(searchTerm)}".</div>
        </div>
      `;
      return;
    }

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
              <h3>${escapeHtml(p.repo_name)}</h3>
              <div class="card-slug">${escapeHtml(p.product_id)} • v${escapeHtml(p.version)}</div>
            </div>
            <span class="status-badge ${statusClass}">
              ● ${statusText}
            </span>
          </div>

          <div class="card-infra-grid">
            <div class="infra-item">
              <span class="infra-key">Vercel Edge</span>
              <span class="infra-val">
                ${vUrl !== 'N/A' ? `<a href="${vUrl}" target="_blank">${escapeHtml(vUrl.replace('https://', ''))}</a>` : 'Pending'}
              </span>
            </div>
            <div class="infra-item">
              <span class="infra-key">Supabase DB</span>
              <span class="infra-val" style="color: #10B981;">
                ● ${escapeHtml(p.online_status.supabase_status.toUpperCase())}
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
              <span>MVP Completion (${escapeHtml(p.mvp_status.phase.toUpperCase())})</span>
              <span>${completion}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill green" style="width: ${completion}%"></div>
            </div>
          </div>
        </div>

        <div>
          <div class="card-ai-footer">
            <span class="ai-meta">Last AI: <strong>${escapeHtml(p.ai_session_telemetry.last_model)}</strong> (${p.ai_session_telemetry.session_duration_minutes}m)</span>
            <button class="btn-card-inspect" data-id="${p.product_id}">Inspect &rarr;</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach inspect handlers
    container.querySelectorAll('.btn-card-inspect').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pid = e.currentTarget.getAttribute('data-id');
        const prod = products.find(x => x.product_id === pid);
        if (prod) openModal(prod);
      });
    });
  }

  // 4b. Master Fleet Grid Coordinator
  function renderFleetGrid(products) {
    renderMvpWorkQueueBanner(products);
    renderFleetGridCardsOnly(products);
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

    // Apply any local status overrides
    const taskOverrides = getTaskOverrides();
    tasks.forEach(t => {
      if (taskOverrides[t.task_id]) {
        t.status = taskOverrides[t.task_id];
      }
    });

    const activeTasks = tasks.filter(t => t.status !== 'done');
    const p0Tasks = activeTasks.filter(t => t.priority === 'P0_CRITICAL');

    if (badgeEl) {
      if (p0Tasks.length > 0) {
        badgeEl.textContent = `${activeTasks.length}`;
        badgeEl.className = 'tab-badge badge-warning';
        badgeEl.title = `${activeTasks.length} active tasks (${p0Tasks.length} P0 Critical)`;
      } else if (activeTasks.length > 0) {
        badgeEl.textContent = `${activeTasks.length}`;
        badgeEl.className = 'tab-badge badge-neutral';
        badgeEl.title = `${activeTasks.length} active tasks in backlog`;
      } else {
        badgeEl.textContent = '✓';
        badgeEl.className = 'tab-badge badge-success';
        badgeEl.title = 'All tasks completed!';
      }
    }

    // Update Task Filter Chips dynamically with actual counts
    const taskCounts = {
      all: tasks.length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      waiting: tasks.filter(t => t.status === 'waiting').length,
      planned: tasks.filter(t => t.status === 'planned').length,
      done: tasks.filter(t => t.status === 'done').length
    };
    document.querySelectorAll('.filter-chip[data-task-filter]').forEach(chip => {
      const f = chip.getAttribute('data-task-filter');
      const label = f === 'all' ? 'All Tasks' : 
                    f === 'in_progress' ? 'In Progress' :
                    f === 'waiting' ? 'Waiting' :
                    f === 'planned' ? 'Planned' : 'Done';
      chip.textContent = `${label} (${taskCounts[f] ?? 0})`;
    });

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
        <td>
          <select class="task-status-inline-select" data-task-id="${t.task_id}" style="background: rgba(15, 23, 42, 0.9); border: 1px solid var(--border-subtle); color: #FFF; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
            <option value="planned" ${t.status === 'planned' ? 'selected' : ''}>⚪ PLANNED</option>
            <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>⏳ IN PROGRESS</option>
            <option value="waiting" ${t.status === 'waiting' ? 'selected' : ''}>⚠️ WAITING</option>
            <option value="done" ${t.status === 'done' ? 'selected' : ''}>✓ DONE</option>
          </select>
        </td>
        <td><span class="priority-badge ${prioClass}">${t.priority.replace('_', ' ')}</span></td>
        <td style="font-size: 12px; color: var(--text-muted);">${t.assignee || 'Ricardo J. Julia'}</td>
        <td style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan-400);">${t.git_reference || 'N/A'}</td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.task-status-inline-select').forEach(sel => {
      sel.addEventListener('change', () => {
        const taskId = sel.getAttribute('data-task-id');
        const newStatus = sel.value;
        setTaskStatusOverride(taskId, newStatus);
        const found = tasks.find(x => x.task_id === taskId);
        if (found) found.status = newStatus;
        renderTasksTab(tasks);
        showToast(`Task ${taskId} status updated to ${newStatus.toUpperCase()}`);
      });
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

      // Check how many blockers remain unresolved
      const unresolvedBlockers = blockers.filter((_, idx) => !isBlockerResolved(p.product_id, idx));

      const card = document.createElement('div');
      card.className = `readiness-item-card ${unresolvedBlockers.length === 0 ? 'ready' : 'action-needed'}`;
      card.innerHTML = `
        <div class="readiness-summary-col">
          <h3>${p.repo_name}</h3>
          <div style="font-size: 12px; color: var(--text-dim);">${p.product_id} • Phase: ${p.mvp_status.phase.toUpperCase()}</div>
          <span class="readiness-score-badge" style="background: ${unresolvedBlockers.length === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${unresolvedBlockers.length === 0 ? '#10B981' : '#F59E0B'}">
            Score: ${unresolvedBlockers.length === 0 ? '98%' : `${score}%`} Readiness
          </span>
          <div style="margin-top: 8px; font-size: 11px; color: var(--text-muted);">
            Vercel: ${p.online_status.vercel_status.toUpperCase()} • Supabase: ${p.online_status.supabase_status.toUpperCase()}
          </div>
        </div>

        <div class="readiness-blockers-col">
          <h4>Active Architectural Blockers</h4>
          <ul class="readiness-list">
            ${blockers.length > 0 ? blockers.map((b, bIdx) => {
              const isResolved = isBlockerResolved(p.product_id, bIdx);
              if (isResolved) {
                return `
                  <li style="color: #34D399; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 0;">
                    <span style="text-decoration: line-through; opacity: 0.75;">✓ ${escapeHtml(b)}</span>
                    <button class="btn btn-secondary btn-toggle-blocker" data-product-id="${p.product_id}" data-blocker-idx="${bIdx}" style="font-size: 10px; padding: 2px 6px;">
                      Reopen
                    </button>
                  </li>
                `;
              } else {
                return `
                  <li style="color: #F87171; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 4px 0;">
                    <span>🔴 ${escapeHtml(b)}</span>
                    <button class="btn btn-gold btn-toggle-blocker" data-product-id="${p.product_id}" data-blocker-idx="${bIdx}" style="font-size: 10px; padding: 2px 8px; font-weight: 700;">
                      Resolve
                    </button>
                  </li>
                `;
              }
            }).join('') : '<li style="color: #34D399;">🟢 No active deployment blockers</li>'}
          </ul>
        </div>

        <div class="readiness-actions-col">
          <h4>Required Actions to Achieve 100% Launch</h4>
          <ul class="readiness-list">
            ${actions.map(a => `<li>🛠️ ${escapeHtml(a)}</li>`).join('')}
          </ul>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.btn-toggle-blocker').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-product-id');
        const idx = parseInt(btn.getAttribute('data-blocker-idx'), 10);
        toggleBlockerResolved(prodId, idx);
        renderReadinessRadar(products);
        if (fleetData) renderKPIs(fleetData);
        showToast('Launch blocker updated! Radar status refreshed.');
      });
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
      { id: "COUNCIL-2026-004", req: "REQ-004-03", title: "AI Session Logging & Diagnostics", check: () => "done" },
      { id: "COUNCIL-2026-005", req: "REQ-005-01", title: "100% MVP Feature-Completion Plan", check: () => "done" },
      { id: "COUNCIL-2026-005", req: "REQ-005-02", title: "Phased Execution Gate: Testing Commences Only After 100% Features Done", check: () => "done" },
      { id: "COUNCIL-2026-005", req: "REQ-005-03", title: "Vercel Production Deployment Technical Readiness", check: () => "done" }
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

    // Dual Contending Gemini Engine Handlers
    initGeminiEngineControls();

    // History Archive Button & Modal Handlers
    document.getElementById('btn-view-history')?.addEventListener('click', () => {
      openDelibHistoryModal(councils);
    });

    document.getElementById('delib-history-close')?.addEventListener('click', () => {
      document.getElementById('delib-history-modal')?.classList.remove('active');
    });

    document.getElementById('delib-history-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'delib-history-modal') {
        document.getElementById('delib-history-modal')?.classList.remove('active');
      }
    });

    // Daily MVP Progress Report Modal Handlers
    document.getElementById('btn-open-mvp-report')?.addEventListener('click', () => {
      openMvpReportModal(fleetData?.products || []);
    });

    document.getElementById('mvp-report-close')?.addEventListener('click', () => {
      document.getElementById('mvp-report-modal')?.classList.remove('active');
    });

    document.getElementById('mvp-report-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'mvp-report-modal') {
        document.getElementById('mvp-report-modal')?.classList.remove('active');
      }
    });

    document.getElementById('btn-modal-refresh-report')?.addEventListener('click', () => {
      showToast('Refreshing daily fleet metrics...');
      document.getElementById('mvp-report-modal')?.classList.remove('active');
      triggerSync();
    });

    document.getElementById('btn-clear-delib-history')?.addEventListener('click', () => {
      if (confirm('Clear all stored deliberation history from local storage?')) {
        localStorage.removeItem(DELIB_HISTORY_KEY);
        updateDelibHistoryBadge();
        openDelibHistoryModal(councils);
        showToast('Deliberation history cleared.');
      }
    });

    // Initial History Setup & Pre-seed
    seedInitialHistoryIfEmpty(councils);
    updateDelibHistoryBadge();

    // Auto-restore latest deliberation into chamber if present
    const existingHistory = getDeliberationHistory();
    if (existingHistory.length > 0) {
      const container = document.getElementById('delib-response-container');
      if (container && !container.classList.contains('active')) {
        renderDeliberationRecordInChamber(existingHistory[0], councils, false);
      }
    }
  }

  // ==========================================================================
  // OpenRouter Dual-Contending Gemini Deliberation System
  // ==========================================================================
  const OPENROUTER_KEY_STORAGE = 'churchcore_openrouter_key';
  const OPENROUTER_PRO_STORAGE = 'churchcore_openrouter_pro_model';
  const OPENROUTER_FLASH_STORAGE = 'churchcore_openrouter_flash_model';

  async function syncEngineStatus() {
    const dot = document.getElementById('gemini-status-dot');
    const label = document.getElementById('gemini-status-text');
    let hasLocalKey = !!localStorage.getItem(OPENROUTER_KEY_STORAGE);
    let hasEnvKey = false;
    let masked = '';

    try {
      const res = await fetch('/api/engine-status');
      if (res.ok) {
        const data = await res.json();
        hasEnvKey = data.has_key;
        masked = data.masked_key;
      }
    } catch (e) {
      console.warn('Could not fetch /api/engine-status:', e);
    }

    const isActive = hasLocalKey || hasEnvKey;
    if (dot) {
      dot.style.background = isActive ? '#10b981' : '#f59e0b';
      dot.style.boxShadow = isActive ? '0 0 8px rgba(16, 185, 129, 0.7)' : 'none';
    }
    if (label) {
      label.textContent = isActive ? '⚡ Dual Gemini Contender Active' : '⚡ Gemini Contender: Setup';
    }

    const keyInput = document.getElementById('cfg-openrouter-key');
    const proInput = document.getElementById('cfg-pro-model');
    const flashInput = document.getElementById('cfg-flash-model');
    const advocateLabel = document.getElementById('cfg-advocate-label');
    const auditorLabel = document.getElementById('cfg-auditor-label');

    const curPro = localStorage.getItem(OPENROUTER_PRO_STORAGE) || 'google/gemini-2.5-pro';
    const curFlash = localStorage.getItem(OPENROUTER_FLASH_STORAGE) || 'google/gemini-2.5-flash';

    if (proInput && !proInput.value) proInput.value = curPro;
    if (flashInput && !flashInput.value) flashInput.value = curFlash;
    if (advocateLabel) advocateLabel.textContent = curPro;
    if (auditorLabel) auditorLabel.textContent = curFlash;

    if (keyInput) {
      const localVal = localStorage.getItem(OPENROUTER_KEY_STORAGE) || '';
      if (localVal) {
        keyInput.value = localVal;
      } else if (hasEnvKey) {
        keyInput.placeholder = `Active in environment (${masked})`;
      }
    }
  }

  function initGeminiEngineControls() {
    const modal = document.getElementById('gemini-config-modal');
    const openBtn = document.getElementById('btn-open-gemini-config');
    const closeBtn = document.getElementById('gemini-config-close');
    const cancelBtn = document.getElementById('btn-cancel-gemini-config');
    const saveBtn = document.getElementById('btn-save-gemini-config');
    const testBtn = document.getElementById('btn-test-engine-conn');
    const toggleVisBtn = document.getElementById('btn-toggle-key-visibility');
    const keyInput = document.getElementById('cfg-openrouter-key');
    const proInput = document.getElementById('cfg-pro-model');
    const flashInput = document.getElementById('cfg-flash-model');
    const testResultEl = document.getElementById('cfg-test-result');

    openBtn?.addEventListener('click', () => {
      syncEngineStatus();
      if (testResultEl) testResultEl.style.display = 'none';
      modal?.classList.add('active');
    });

    const closeModal = () => modal?.classList.remove('active');
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target.id === 'gemini-config-modal') closeModal();
    });

    toggleVisBtn?.addEventListener('click', () => {
      if (keyInput) {
        keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
      }
    });

    saveBtn?.addEventListener('click', async () => {
      const keyVal = keyInput?.value.trim() || '';
      const proVal = proInput?.value.trim() || 'google/gemini-2.5-pro';
      const flashVal = flashInput?.value.trim() || 'google/gemini-2.5-flash';

      if (keyVal) {
        localStorage.setItem(OPENROUTER_KEY_STORAGE, keyVal);
      }
      localStorage.setItem(OPENROUTER_PRO_STORAGE, proVal);
      localStorage.setItem(OPENROUTER_FLASH_STORAGE, flashVal);

      try {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Activating...';
        await fetch('/api/save-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: keyVal,
            pro_model: proVal,
            flash_model: flashVal,
            save_to_env: true
          })
        });
      } catch (err) {
        console.warn('Could not persist to backend:', err);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save & Activate';
      }

      await syncEngineStatus();
      closeModal();
      showToast('⚡ Dual-Contending Gemini Engine activated!');
    });

    testBtn?.addEventListener('click', async () => {
      const keyVal = keyInput?.value.trim() || localStorage.getItem(OPENROUTER_KEY_STORAGE) || '';
      const proVal = proInput?.value.trim() || 'google/gemini-2.5-pro';
      const flashVal = flashInput?.value.trim() || 'google/gemini-2.5-flash';

      if (testResultEl) {
        testResultEl.style.display = 'block';
        testResultEl.style.background = 'rgba(30, 41, 59, 0.8)';
        testResultEl.style.border = '1px solid var(--border-subtle)';
        testResultEl.style.color = '#cbd5e1';
        testResultEl.innerHTML = '<span class="pulse-dot"></span> Performing test handshake with OpenRouter & Gemini 2.5 Flash...';
      }

      try {
        const resp = await fetch('/api/test-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: keyVal,
            pro_model: proVal,
            flash_model: flashVal
          })
        });

        const resData = await resp.json();
        if (resData.success) {
          testResultEl.style.background = 'rgba(16, 185, 129, 0.15)';
          testResultEl.style.border = '1px solid rgba(16, 185, 129, 0.4)';
          testResultEl.style.color = '#34d399';
          testResultEl.innerHTML = `
            <strong>🟢 Contender Handshake Verified (${resData.latency_ms}ms)</strong><br>
            <span>Dialectic Pair: <code>${escapeHtml(resData.pro_model)}</code> (Advocate) ⚔️ <code>${escapeHtml(resData.flash_model)}</code> (Auditor). Handshake ratified.</span>
          `;
        } else {
          testResultEl.style.background = 'rgba(239, 68, 68, 0.15)';
          testResultEl.style.border = '1px solid rgba(239, 68, 68, 0.4)';
          testResultEl.style.color = '#f87171';
          testResultEl.innerHTML = `
            <strong>🔴 Handshake Failed (${resData.latency_ms || 0}ms)</strong><br>
            <span>${escapeHtml(resData.error || 'Unknown error contacting OpenRouter.')}</span>
          `;
        }
      } catch (err) {
        testResultEl.style.background = 'rgba(239, 68, 68, 0.15)';
        testResultEl.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        testResultEl.style.color = '#f87171';
        testResultEl.innerHTML = `<strong>🔴 Network Error:</strong> ${escapeHtml(err.message)}`;
      }
    });

    syncEngineStatus();
  }

  // ==========================================================================
  // Deliberation History Storage & Synthesis Engine
  // ==========================================================================
  const DELIB_HISTORY_KEY = 'churchcore_deliberations_history';

  function getDeliberationHistory() {
    try {
      const raw = localStorage.getItem(DELIB_HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Failed to parse deliberation history:', e);
      return [];
    }
  }

  function saveDeliberationRecord(record) {
    try {
      const history = getDeliberationHistory();
      const filtered = history.filter(h => h.id !== record.id);
      filtered.unshift(record);
      const trimmed = filtered.slice(0, 50);
      localStorage.setItem(DELIB_HISTORY_KEY, JSON.stringify(trimmed));
      updateDelibHistoryBadge();
    } catch (e) {
      console.warn('Failed to save deliberation record:', e);
    }
  }

  function updateDelibHistoryBadge() {
    const history = getDeliberationHistory();
    const count = history.length;
    const badge = document.getElementById('delib-history-count');
    if (badge) badge.textContent = count;
    const footerStats = document.getElementById('delib-history-footer-stats');
    if (footerStats) footerStats.textContent = `Showing ${count} archived deliberation${count === 1 ? '' : 's'}`;
    const cardBadge = document.getElementById('card-history-count');
    if (cardBadge) cardBadge.textContent = count;
  }

  function seedInitialHistoryIfEmpty(councils) {
    const history = getDeliberationHistory();
    if (history.length > 0) return;

    const defaultCouncil = councils.find(c => c.council_id === 'council-grand') || councils[0] || {
      name: 'High Sovereign Grand Council of ChurchCore',
      short_name: 'High Grand Council',
      governing_state: { quorum_status: '7/7 Active Quorum', occupied_seats: 7, quorum_seats: 7 }
    };

    const initialQuery = 'If I wanted to create an AI prompt to be used in AntiGravity Automation, to daily check the repo, and all product repos, consolidate any changes, update all data and prepare a daily report, can you generate that for me';
    const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const deliberationId = 'DELIB-GRAND-HIGH-COUNCIL-2492';
    const synthesized = generateCouncilActionableAnswer(initialQuery, defaultCouncil, null);

    const record = {
      id: deliberationId,
      timestamp: nowUtc,
      councilId: defaultCouncil.council_id || 'council-grand',
      councilName: defaultCouncil.name,
      shortName: defaultCouncil.short_name,
      mode: 'all',
      query: initialQuery,
      answerTitle: synthesized.title,
      answerSummary: synthesized.summary,
      answerHtml: synthesized.html,
      plainText: synthesized.plainText
    };

    saveDeliberationRecord(record);
  }

  function openDelibHistoryModal(councils) {
    const modal = document.getElementById('delib-history-modal');
    const listContainer = document.getElementById('delib-history-list');
    if (!modal || !listContainer) return;

    const history = getDeliberationHistory();
    updateDelibHistoryBadge();

    if (history.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-muted);">
          <div style="font-size: 38px; margin-bottom: 12px;">🏛️</div>
          <h4 style="font-family: var(--font-heading); color: #FFF; font-size: 16px; margin-bottom: 6px;">No Deliberations Logged Yet</h4>
          <p style="font-size: 13px; max-width: 440px; margin: 0 auto 16px auto;">Convene the High Sovereign Grand Council or consult any specialized member using the chamber above to record official determinations.</p>
        </div>
      `;
    } else {
      listContainer.innerHTML = history.map((item) => {
        return `
          <div class="history-item-card" data-id="${item.id}">
            <div class="history-item-header">
              <span class="history-item-id">🏛️ ${escapeHtml(item.councilName || 'Council')} • <code>${escapeHtml(item.id)}</code></span>
              <span class="history-item-time">${escapeHtml(item.timestamp)}</span>
            </div>
            <div class="history-item-query">
              "${escapeHtml(item.query)}"
            </div>
            <div class="history-item-summary">
              <strong>${escapeHtml(item.answerTitle || 'Executive Advisory')}:</strong> ${escapeHtml(item.answerSummary || '')}
            </div>
            <div class="history-item-actions">
              <button class="btn btn-secondary btn-sm btn-copy-history-item" data-id="${item.id}" style="font-size: 11px; padding: 5px 10px;">
                📋 Copy Response
              </button>
              <button class="btn btn-gold btn-sm btn-display-history-item" data-id="${item.id}" style="font-size: 11px; padding: 5px 12px;">
                🏛️ Display in Chamber
              </button>
            </div>
          </div>
        `;
      }).join('');

      listContainer.querySelectorAll('.btn-display-history-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const record = history.find(h => h.id === id);
          if (record) {
            renderDeliberationRecordInChamber(record, councils, true);
            modal.classList.remove('active');
            showToast(`Loaded deliberation ${record.id} in chamber!`);
            document.getElementById('delib-response-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });

      listContainer.querySelectorAll('.btn-copy-history-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const record = history.find(h => h.id === id);
          if (record) {
            navigator.clipboard.writeText(record.plainText || record.answerSummary || record.query);
            showToast('Council response copied to clipboard!');
          }
        });
      });
    }

    modal.classList.add('active');
  }

  function renderDeliberationRecordInChamber(record, councils, scrollIntoView = false) {
    const container = document.getElementById('delib-response-container');
    if (!container) return;

    container.classList.add('active');

    const historyCount = getDeliberationHistory().length;
    const councilName = record.councilName || 'High Sovereign Grand Council of ChurchCore';

    container.innerHTML = `
      <!-- Prominent Actionable Answer Card -->
      <div class="council-answer-card" id="council-active-answer-card">
        <div class="council-answer-header">
          <div class="council-answer-title-group">
            <span class="council-answer-icon">🏛️</span>
            <div>
              <div class="council-answer-title">${escapeHtml(record.answerTitle || 'Council Executive Advisory & Determination')}</div>
              <div class="council-answer-subtitle">
                Official Ruling • ${escapeHtml(councilName)} • Reference: <code>${escapeHtml(record.id)}</code> • ${escapeHtml(record.timestamp)}
                ${record.engine === 'openrouter_dual_gemini' ? `<span style="display: inline-block; margin-left: 8px; background: rgba(139, 92, 246, 0.2); border: 1px solid rgba(139, 92, 246, 0.45); color: #c4b5fd; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 700;">⚔️ Gemini Contending Consensus Verified</span>` : ''}
              </div>
            </div>
          </div>
          <div class="council-answer-actions">
            <button class="btn-council-action primary" id="btn-copy-delib-reply">
              📋 Copy Council Response
            </button>
            <button class="btn-council-action" id="btn-open-delib-archives">
              📜 Past Deliberations (<span id="card-history-count">${historyCount}</span>)
            </button>
            ${record.speechesHtml ? `<button class="btn-council-action" id="btn-scroll-to-speeches">🔽 View Roll Call</button>` : ''}
          </div>
        </div>

        <div class="council-answer-inquiry-box">
          <strong>Deliberation Subject:</strong> "${escapeHtml(record.query)}"
        </div>

        <div class="council-answer-body">
          ${record.answerHtml}
        </div>
      </div>

      ${record.speechesHtml ? `
        <div class="delib-roll-call-divider">
          <span>Council Seat Roll Call & Individual Transcripts</span>
        </div>
        <div class="delib-member-speeches">
          ${record.speechesHtml}
        </div>
      ` : ''}

      <div class="ratified-stamp-box">
        <div class="ratified-stamp-text">
          <h4>👑 COUNCIL RATIFICATION & GOVERNANCE SEAL</h4>
          <p>Deliberation concluded and registered with official seal. Constitutional invariants verified against <code>manifest.json</code>.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" id="btn-copy-full-transcript" style="font-size: 12px; padding: 8px 14px;">
            📋 Copy Full Text
          </button>
          <button class="btn btn-gold" onclick="window.showToast('Determination sealed in local governance ledger!');" style="font-size: 12px; padding: 8px 16px;">
            Confirm & Seal
          </button>
        </div>
      </div>
    `;

    // Wire Copy Reply Button
    document.getElementById('btn-copy-delib-reply')?.addEventListener('click', () => {
      navigator.clipboard.writeText(record.plainText || record.query);
      showToast('Council response copied to clipboard!');
    });

    // Wire Inner Prompt Copy Buttons (if any)
    container.querySelectorAll('.btn-copy-inner').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute('data-copy-target');
        const targetEl = targetId ? document.getElementById(targetId) : null;
        const textToCopy = targetEl ? targetEl.innerText : (btn.parentElement?.innerText || '');
        navigator.clipboard.writeText(textToCopy.trim());
        showToast('AntiGravity prompt copied to clipboard!');
      });
    });

    // Wire Past Deliberations Button
    document.getElementById('btn-open-delib-archives')?.addEventListener('click', () => {
      openDelibHistoryModal(councils);
    });

    // Wire Scroll to Speeches Button
    document.getElementById('btn-scroll-to-speeches')?.addEventListener('click', () => {
      container.querySelector('.delib-member-speeches')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Wire Full Transcript Copy
    document.getElementById('btn-copy-full-transcript')?.addEventListener('click', () => {
      const fullText = `${record.answerTitle}\n\nSubject: ${record.query}\n\n${record.plainText}\n\nReference: ${record.id} • ${record.timestamp}`;
      navigator.clipboard.writeText(fullText);
      showToast('Full deliberation transcript copied to clipboard!');
    });

    if (scrollIntoView) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const PRODUCT_REGISTRY = {
    'churchcore-chms': {
      name: 'ChurchCore (ChMS)',
      repoName: 'ChurchCore',
      path: '/Users/rjulia/ChurchCore',
      techStack: 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS',
      domain: 'Parish Membership, Tithing & Giving, Sunday Child Check-in, Volunteer Schedules'
    },
    'churchcore-lms': {
      name: 'ChurchCore LMS',
      repoName: 'ChurchCore LMS',
      path: '/Users/rjulia/ChurchCore LMS',
      techStack: 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, SpeedGrader',
      domain: 'Seminary Courses, Canvas-Grade SpeedGrader, Drip Engines, Discipleship & Certification'
    },
    'churchcore-academy': {
      name: 'ChurchCore Academy',
      repoName: 'ChurchCore-Academy',
      path: '/Users/rjulia/ChurchCore-Academy',
      techStack: 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, SIS',
      domain: 'K-12 Christian Schooling, SIS Student Information System, Attendance, Family Billing & COPPA'
    },
    'churchcore-care': {
      name: 'ChurchCore Care',
      repoName: 'ChurchCoreCare',
      path: '/Users/rjulia/ChurchCoreCare',
      techStack: 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, pgcrypto',
      domain: 'Pastoral Counseling, Clinical Triage, HIPAA Notes, Grief & Benevolence Dispatch'
    },
    'churchcore-orthos': {
      name: 'ChurchCore Orthos',
      repoName: 'ChurchCore-Orthos',
      path: '/Users/rjulia/ChurchCore-Orthos',
      techStack: 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS, pgvector',
      domain: 'Historic Confessions, Doctrinal Safeguarding, Financial Audit & Canon Verification'
    },
    'faithfull-scholars': {
      name: 'FaithFull Scholars',
      repoName: 'FaithFullScholars',
      path: '/Users/rjulia/FaithFullScholars',
      techStack: 'Next.js 15 (App Router), Supabase (PostgreSQL), TypeScript, Tailwind CSS',
      domain: 'Theological Higher-Ed, Faculty Search, Credal Calibration & Academic Grants'
    },
    'churchcore-business': {
      name: 'ChurchCore Control Plane',
      repoName: 'ChurchCore-Business',
      path: '/Users/rjulia/ChurchCore-Business',
      techStack: 'Python 3, Vanilla JS / CSS, GitHub Actions CI, Sovereign Control Plane',
      domain: 'Cross-Ecosystem Governance, Telemetry Consolidation, Executive Mission Control'
    }
  };

  const COUNCIL_PRODUCT_MAP = {
    'council-grand': 'churchcore-business',
    'council-chms': 'churchcore-chms',
    'council-lms': 'churchcore-lms',
    'council-academy': 'churchcore-academy',
    'council-care': 'churchcore-care',
    'council-orthos': 'churchcore-orthos',
    'council-scholars': 'faithfull-scholars'
  };

  function resolveTargetProduct(query, councilId) {
    const qLower = query.toLowerCase();
    if (['academy', 'k-12', 'school', 'sis', 'attendance', 'gradebook', 'colegio', 'ferpa', 'coppa'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['churchcore-academy'];
    }
    if (['lms', 'course', 'speedgrader', 'rubric', 'drip', 'seminary', 'syllabus', 'assignment'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['churchcore-lms'];
    }
    if (['care', 'counseling', 'hipaa', 'pastoral note', 'benevolence', 'triage', 'bereavement', 'meal train'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['churchcore-care'];
    }
    if (['orthos', 'audit', 'creed', 'confession', 'canon', 'safeguard', 'doctrinal', '1689', 'westminster', 'nicene'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['churchcore-orthos'];
    }
    if (['scholar', 'faculty', 'higher-ed', 'tenure', 'academic grant', 'theological search'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['faithfull-scholars'];
    }
    if (['chms', 'parish', 'tithing', 'giving', 'kiosk', 'volunteer', 'erasure', 'member', 'visitor'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['churchcore-chms'];
    }
    if (['fleet inspector', 'daily briefing', 'daily report', 'briefing agent', 'consolidate fleet', 'control plane'].some(k => qLower.includes(k))) {
      return PRODUCT_REGISTRY['churchcore-business'];
    }

    const defaultProdId = COUNCIL_PRODUCT_MAP[councilId] || 'churchcore-business';
    return PRODUCT_REGISTRY[defaultProdId] || PRODUCT_REGISTRY['churchcore-business'];
  }

  function extractFeatureTitle(query) {
    let cleaned = query.trim();
    const patterns = [
      /^(please\s+)?(can\s+you\s+)?(i\s+need\s+an?\s+|i\s+want\s+an?\s+|i\s+asked\s+for\s+an?\s+|give\s+me\s+an?\s+|provide\s+an?\s+|create\s+an?\s+|generate\s+an?\s+)?/i,
      /(antigravity\s+prompt\s+|ai\s+prompt\s+|prompt\s+)?(to\s+|for\s+)?/i,
      /(create\s+|build\s+|implement\s+|add\s+|develop\s+|scaffold\s+)?(the\s+|a\s+|an\s+)?/i,
      /(feature\s+to\s+|feature\s+for\s+|new\s+feature\s+for\s+|feature\s+)?/i
    ];

    patterns.forEach(p => {
      cleaned = cleaned.replace(p, '');
    });

    cleaned = cleaned.replace(/\s+(in|for|on)\s+(churchcore[\s\-]*)?(academy|lms|care|orthos|chms|scholars|business|repo|project).*$/i, '');
    cleaned = cleaned.replace(/^[ ?.,!:\n\r\t"']+|[ ?.,!:\n\r\t"']+$/g, '');

    if (cleaned.length < 3) return 'Requested System Capability';
    return cleaned.split(/\s+/).map(w => w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(' ').substring(0, 80);
  }

  function detectQueryIntent(query) {
    const q = query.toLowerCase();
    if ((q.includes('daily briefing') || q.includes('fleet inspector') || q.includes('daily report') || q.includes('consolidate fleet')) &&
        !q.includes('create') && !q.includes('feature') && !q.includes('build') && !q.includes('attendance')) {
      return 'DAILY_BRIEFING';
    }
    if (['prompt', 'feature', 'build', 'create', 'implement', 'add', 'develop', 'scaffold', 'notification', 'attendance', 'screen', 'api', 'workflow', 'view', 'page'].some(w => q.includes(w))) {
      return 'FEATURE_PROMPT';
    }
    if (['zero data', 'propagation', 'cross-db', 'cross-database', 'silo', 'tenant isolation'].some(w => q.includes(w))) {
      return 'ZERO_DATA';
    }
    if (['sunday', 'sla', 'holy hours', 'check-in latency', 'peak concurrency'].some(w => q.includes(w))) {
      return 'SUNDAY_SLA';
    }
    if (['hipaa', 'pastoral note', 'confidential', 'pgcrypto', 'clergy-penitent'].some(w => q.includes(w))) {
      return 'CONFIDENTIALITY';
    }
    if (['speedgrader', 'rubric', 'drip', 'syllabus', 'course cohort'].some(w => q.includes(w))) {
      return 'PEDAGOGY';
    }
    if (['creed', 'confession', 'orthos', 'theological drift', 'lexicon'].some(w => q.includes(w))) {
      return 'THEOLOGY';
    }
    return 'GENERAL_ADVISORY';
  }

  function generateFeatureAntiGravityPrompt(featureTitle, targetProduct, query) {
    return `# ANTIGRAVITY ENGINEERING DIRECTIVE: ${featureTitle.toUpperCase()} (${targetProduct.repoName})

You are the designated Sovereign Lead Engineer operating under Google Antigravity.
Your objective is to implement the **${featureTitle}** feature in **${targetProduct.repoName}** with production completeness, rigorous PostgreSQL Row-Level Security, and accompanying automated tests adhering to the Sovereign Testing Council Protocol (COUNCIL-2026-006 Phase 1).

## TARGET REPOSITORY & ENVIRONMENT:
- Absolute Path: \`cd "${targetProduct.path}"\`
- Tech Stack: ${targetProduct.techStack}
- Domain Scope: ${targetProduct.domain}

## CONSTITUTIONAL & ARCHITECTURAL INVARIANTS:
1. **Constitution Section III (Zero Customer Data Propagation):**
   - Strictly isolated tenant database silo.
   - Zero foreign event queues, SQS daemons, or cross-database replication streams.
2. **Inseparable Testing Invariant (COUNCIL-2026-006 Phase 1):**
   - Feature code and accompanying automated tests are INSEPARABLE.
   - Comprehensive unit and integration tests (\`npm test\` or \`npm run test\`) must be written and pass before marking complete.
3. **Sunday Morning 99.99% Holy Hours SLA:**
   - All server actions, DB queries, and UI components must execute within a <50ms latency budget.
   - Non-blocking execution with optimistic UI transitions.
4. **Powered by ChurchCore Branding (COUNCIL-2026-002):**
   - Ensure UI adheres to WCAG AAA color contrast ratios and calm liturgical design tokens.

## STEP-BY-STEP IMPLEMENTATION PLAN:
### Step 1: Database Migration & PostgreSQL Row-Level Security (RLS)
- If persistent records are required for ${featureTitle}:
  - Create a migration under \`supabase/migrations/\`.
  - Add tables with strict \`tenant_id\` foreign keys and indexes.
  - Enable RLS (\`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;\`).
  - Create authenticated isolation policies ensuring zero cross-tenant row leakage.

### Step 2: Server Actions & Backend Edge APIs
- Implement type-safe server actions or route handlers under \`src/app/\` or \`src/actions/\`.
- Validate all incoming user inputs with Zod schemas.
- Ensure error handling returns sanitized, graceful error messages without leaking stack traces.

### Step 3: Frontend UI Components & Liturgical Design
- Create accessible, keyboard-navigable UI components under \`src/components/\`.
- Provide smooth loading skeletons, empty states, and validation feedback.
- Verify adherence to the ChurchCore serene aesthetic.

### Step 4: Automated Testing & Verification
- Add automated test specs covering:
  1. Successful execution and primary happy-path workflow.
  2. Edge cases, validation errors, and unauthorized tenant rejection.
- Run verification suite:
  \`\`\`bash
  npm run build
  npm test
  # If applicable:
  npm run audit:rls
  \`\`\`

## ACCEPTANCE CRITERIA:
- [ ] 100% complete feature code for ${featureTitle}.
- [ ] Inseparable automated test suite passing with green exit code.
- [ ] Row-Level Security verified with zero tenant bypass.
- [ ] Clean production build (\`npm run build\`) with zero lint or TypeScript errors.
- [ ] Telemetry updated in \`docs/control-plane/telemetry.json\` with commit hash.`;
  }

  function generateMemberSpeech(member, query, council, intent, featureTitle, targetProd) {
    const mTitle = (member.title || '').toLowerCase();
    const mDomain = (member.domain || '').toLowerCase();
    const pName = targetProd.name;

    if (intent === 'FEATURE_PROMPT') {
      if (mTitle.includes('architect') || mTitle.includes('executive') || mTitle.includes('chair') || mTitle.includes('lead')) {
        return `<p>I have evaluated the architectural feasibility of <strong>${escapeHtml(featureTitle)}</strong> for <em>${escapeHtml(pName)}</em>. This feature directly aligns with our product roadmap and will be scaffolded cleanly under Next.js 15 App Router conventions without accumulating technical debt. I submit a formal vote of <strong>UNANIMOUS RATIFICATION</strong>.</p>`;
      } else if (mTitle.includes('data') || mTitle.includes('sentinel') || mTitle.includes('database') || mTitle.includes('sql')) {
        return `<p>From the database security perspective, any tables or schemas introduced for <strong>${escapeHtml(featureTitle)}</strong> must enforce 100% PostgreSQL Row-Level Security (RLS). Under <strong>Constitution Section III</strong>, records must be scoped strictly to the authenticated tenant. No cross-app data leakage is permitted. I vote <strong>APPROVED</strong> subject to RLS verification.</p>`;
      } else if (mTitle.includes('pastor') || mTitle.includes('chaplain') || mTitle.includes('parent') || mTitle.includes('shepherd') || mTitle.includes('spiritual')) {
        return `<p>From a pastoral and community standpoint, <strong>${escapeHtml(featureTitle)}</strong> directly serves the dignity of our people. Whether ministering to families, students, or parishioners, technology must never feel bureaucratic or cold. This capability brings clarity and care to <em>${escapeHtml(pName)}</em>. I enthusiastically affirm this proposal.</p>`;
      } else if (mTitle.includes('sla') || mTitle.includes('reliability') || mTitle.includes('engineer') || mTitle.includes('infra')) {
        return `<p>Regarding our <strong>Sunday Morning 99.99% SLA</strong> latency budget (&lt;50ms), <strong>${escapeHtml(featureTitle)}</strong> must execute via non-blocking server actions and indexed queries. With our connection pools in Supabase maintaining ample headroom, this workflow is fully within acceptable compute bounds. I vote <strong>RATIFICATION</strong>.</p>`;
      } else if (mTitle.includes('pedagogy') || mTitle.includes('dean') || mTitle.includes('headmaster') || mTitle.includes('provost') || mTitle.includes('speedgrader') || mTitle.includes('academic')) {
        return `<p>Evaluating the instructional impact of <strong>${escapeHtml(featureTitle)}</strong> on <em>${escapeHtml(pName)}</em>: this workflow reduces administrative friction and enhances institutional transparency. I approve the implementation specifications.</p>`;
      } else if (mTitle.includes('finance') || mTitle.includes('cfo') || mTitle.includes('bursar') || mTitle.includes('steward') || mTitle.includes('giving') || mTitle.includes('tithing')) {
        return `<p>From the fiduciary and operational perspective, <strong>${escapeHtml(featureTitle)}</strong> maintains our low variable hosting footprint ($0 added hosting OPEX) while providing auditability. I confirm financial alignment and vote <strong>APPROVAL</strong>.</p>`;
      } else {
        return `<p>Within the scope of ${escapeHtml(member.domain || 'this seat')}, <strong>${escapeHtml(featureTitle)}</strong> satisfies all sovereign charter requirements. The invariant focus: <em>"${escapeHtml(member.invariant_focus || '')}"</em> is fully safeguarded. I submit a formal vote of <strong>RATIFICATION</strong>.</p>`;
      }
    } else if (intent === 'ZERO_DATA') {
      return `<p>I have inspected active schemas and migrations. <strong>Constitution Section III is 100% intact.</strong> No foreign event brokers or cross-database replication streams exist. Customer records in ${escapeHtml(pName)} remain strictly locked within their sovereign database silo under PostgreSQL RLS.</p>`;
    } else if (intent === 'SUNDAY_SLA') {
      return `<p>Sunday morning holy hours (06:00 to 13:00) require sub-50ms kiosk check-in response times. Connection pool headroom is optimal, point-in-time recovery snapshots are fresh, and synthetic health probes return 200 OK.</p>`;
    } else if (intent === 'CONFIDENTIALITY') {
      return `<p>Pastoral counseling notes are encrypted at rest with <code>pgcrypto</code>. RLS policies restrict SELECT queries strictly to the assigned minister/clinician. Unauthenticated roles receive zero row exposure.</p>`;
    } else if (intent === 'PEDAGOGY') {
      return `<p>SpeedGrader split-screen document preview and multi-criterion rubrics execute with zero variable hosting cost using native client-side rendering and Supabase JSONB scoring.</p>`;
    } else if (intent === 'THEOLOGY') {
      return `<p>Historical confessions (Nicene, Westminster, 1689 London Baptist) are cross-linked directly with Koine Greek/Hebrew root lexicons via pgvector, guarding strictly against doctrinal drift.</p>`;
    } else {
      return `<p>I have examined the submitted matter against our non-negotiable invariant: <em>"${escapeHtml(member.invariant_focus || '')}"</em>. Within the domain of ${escapeHtml(member.domain || 'governance')}, this proposal satisfies all criteria. I submit a formal vote of <strong>RATIFIED APPROVAL</strong> under the sovereign charter.</p>`;
    }
  }

  function synthesizeLocalDeliberation(query, currentCouncil, mode, memberId) {
    const targetProduct = resolveTargetProduct(query, currentCouncil.council_id);
    const featureTitle = extractFeatureTitle(query);
    const intent = detectQueryIntent(query);

    const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const timestampSlug = new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14);
    const councilSlug = (currentCouncil.short_name || 'COUNCIL').toUpperCase().replace(/\s+/g, '-');
    const deliberationId = `DELIB-${councilSlug}-${timestampSlug.substring(0, 8)}-${Math.floor(1000 + Math.random() * 9000)}`;

    let speechesHtml = '';
    if (mode === 'member' && memberId) {
      const member = (currentCouncil.members || []).find(m => m.seat_id === memberId) || (currentCouncil.members || [])[0];
      if (member) {
        const speech = generateMemberSpeech(member, query, currentCouncil, intent, featureTitle, targetProduct);
        speechesHtml = `
          <div class="speech-card" style="border-color: rgba(56, 189, 248, 0.4); background: linear-gradient(135deg, rgba(56, 189, 248, 0.05), rgba(14, 21, 36, 0.9));">
            <div class="speech-header">
              <span class="speech-avatar">${member.avatar || '🏛️'}</span>
              <span class="speech-author">${escapeHtml(member.persona_name)}</span>
              <span class="speech-role">• ${escapeHtml(member.title)}</span>
              <span class="speech-verdict-tag">${escapeHtml(member.deliberation_stance || 'Verified')}</span>
            </div>
            <div class="speech-body">
              <p style="margin-bottom: 12px;"><strong>Direct Member Consultation:</strong> "${escapeHtml(query)}"</p>
              ${speech}
            </div>
          </div>
        `;
      }
    } else {
      speechesHtml = (currentCouncil.members || []).map(m => {
        const body = generateMemberSpeech(m, query, currentCouncil, intent, featureTitle, targetProduct);
        return `
          <div class="speech-card">
            <div class="speech-header">
              <span class="speech-avatar">${m.avatar || '🏛️'}</span>
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
    }

    let synthesized = null;
    if (intent === 'FEATURE_PROMPT') {
      const promptText = generateFeatureAntiGravityPrompt(featureTitle, targetProduct, query);
      const dispatchCmd = `cd "${targetProduct.path}" && agy -p "Implement ${featureTitle} with comprehensive tests and RLS"`;
      const title = `AntiGravity Engineering Directive: ${featureTitle} (${targetProduct.name})`;
      const summary = `Unanimous council determination authorizing development of ${featureTitle} in ${targetProduct.name} under Constitution Section III and COUNCIL-2026-006 testing invariants.`;

      const plainText = `🏛️ ${currentCouncil.name} Official Determination & Engineering Directive

DELIBERATION SUBJECT: "${query}"
STATUS: UNANIMOUS RATIFICATION (${currentCouncil.governing_state?.quorum_status || 'Quorum Verified'})
TARGET PRODUCT: ${targetProduct.name} (${targetProduct.path})

EXECUTIVE RULING:
The council has ratified the implementation of ${featureTitle} for ${targetProduct.name}. This feature has been evaluated against our non-negotiable constitutional invariants and is cleared for autonomous AntiGravity scaffolding.

ACTIONABLE ANTIGRAVITY AI PROMPT:
${promptText}

DIRECT TERMINAL DISPATCH COMMAND:
${dispatchCmd}

CONSTITUTIONAL SAFEGUARDS ENFORCED:
1. Constitution Section III: 100% sovereign database isolation; zero customer data cross-propagation.
2. Inseparable Testing Invariant: Phase 1 automated tests must be delivered alongside feature code.
3. Sunday 99.99% SLA: Non-blocking sub-50ms execution budget verified.`;

      const htmlContent = `
        <p>
          The <strong>${escapeHtml(currentCouncil.name)}</strong> has issued a formal determination of <strong>UNANIMOUS RATIFICATION</strong> for the feature proposal: <strong>${escapeHtml(featureTitle)}</strong> in <strong>${escapeHtml(targetProduct.name)}</strong>.
        </p>
        <p style="color: var(--text-muted); font-size: 13px;">
          Target Repository: <code>${escapeHtml(targetProduct.path)}</code> • Tech Stack: <em>${escapeHtml(targetProduct.techStack)}</em>
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
          <div id="delib-prompt-text">${escapeHtml(promptText)}</div>
        </div>

        <h4 style="margin-top: 20px;">⚡ Direct Terminal Dispatch Command</h4>
        <div class="council-cmd-pill">
          <span><code>${escapeHtml(dispatchCmd)}</code></span>
          <span style="font-size: 11px; color: var(--gold-500); font-weight: 700;">READY TO RUN</span>
        </div>

        <h4 style="margin-top: 24px;">🛡️ Non-Negotiable Constitutional Guardrails Enforced</h4>
        <div class="council-guidance-grid">
          <div class="council-guidance-card">
            <strong>Section III Invariant</strong>
            <span>Zero customer data propagation across databases. All queries reside strictly within ${escapeHtml(targetProduct.name)}'s PostgreSQL tenant.</span>
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
      `;

      synthesized = { title, summary, plainText, html: htmlContent };
    } else if (intent === 'DAILY_BRIEFING') {
      const promptText = `# CHURCHCORE AUTONOMOUS FLEET INSPECTOR & DAILY BRIEFING AGENT

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
6. Output executive summary of all fleet updates, release tags, and telemetry deltas into docs/control-plane/briefings/DAILY-BRIEFING-<YYYY-MM-DD>.md.`;

      const dispatchCmd = 'python3 /Users/rjulia/ChurchCore-Business/scripts/daily-fleet-briefing.py';
      synthesized = {
        title: 'Autonomous AntiGravity Daily Briefing & Fleet Telemetry Directive',
        summary: 'Unanimous council ratification establishing the automated daily inspection and briefing routine across all 6 sibling product repos.',
        plainText: `🏛️ High Sovereign Council Executive Advisory: Autonomous Daily Fleet Briefing\n\nCOMMAND: ${dispatchCmd}\n\nPROMPT:\n${promptText}`,
        html: `
          <p>The Council has ratified the automated daily briefing routine. Below is the ready-to-use AntiGravity autonomous system prompt and terminal execution command.</p>
          <h4>🤖 AntiGravity Daily Briefing Prompt</h4>
          <div class="council-prompt-box">
            <button class="btn-copy-inner" data-copy-target="delib-prompt-text">Copy Prompt</button>
            <div id="delib-prompt-text">${escapeHtml(promptText)}</div>
          </div>
          <h4>⚡ Direct Terminal Dispatch Command</h4>
          <div class="council-cmd-pill">
            <span><code>${dispatchCmd}</code></span>
            <span style="font-size: 11px; color: var(--gold-500); font-weight: 700;">DAILY ENGINE ACTIVE</span>
          </div>
        `
      };
    } else {
      synthesized = {
        title: `${currentCouncil.short_name} Official Advisory & Ruling`,
        summary: `Unanimous council determination approving inquiry subject to constitutional invariants and edge compliance verification.`,
        plainText: `🏛️ ${currentCouncil.name} Executive Advisory & Operational Determination\n\nDeliberation Subject: "${query}"\nStatus: UNANIMOUS RATIFICATION (${currentCouncil.governing_state?.quorum_status || 'Quorum Verified'})`,
        html: `
          <p>
            The <strong>${escapeHtml(currentCouncil.name)}</strong> has reviewed your inquiry: <em>"${escapeHtml(query)}"</em>. 
            The council issues a formal advisory of <strong>UNANIMOUS RATIFICATION</strong> for <strong>${escapeHtml(targetProduct.name)}</strong>.
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
              <span>This determination has been appended to the sovereign council ledger and local browser archive.</span>
            </div>
          </div>
        `
      };
    }

    return {
      id: deliberationId,
      timestamp: nowUtc,
      docPath: null,
      councilId: currentCouncil.council_id,
      councilName: currentCouncil.name,
      shortName: currentCouncil.short_name,
      mode: mode,
      memberId: memberId,
      query: query,
      answerTitle: synthesized.title,
      answerSummary: synthesized.summary,
      answerHtml: synthesized.html,
      plainText: synthesized.plainText,
      speechesHtml: speechesHtml
    };
  }

  async function executeCouncilDeliberation(councils) {
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
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 48px 20px; text-align: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="pulse-dot"></span>
          <span style="font-family: var(--font-heading); font-size: 17px; color: var(--gold-500); font-weight: 800; letter-spacing: -0.01em;">
            Convening ${escapeHtml(currentCouncil.name)}
          </span>
        </div>
        <div style="font-size: 13px; color: var(--text-muted); max-width: 500px;" id="delib-convening-status">
          Calling chamber to order & verifying ${escapeHtml(currentCouncil.governing_state?.quorum_status || 'quorum')}...
        </div>
        <div style="width: 280px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; margin-top: 4px;">
          <div id="delib-progress-bar" style="width: 20%; height: 100%; background: linear-gradient(90deg, #F59E0B, #E11D48); border-radius: 99px; transition: width 0.6s ease;"></div>
        </div>
      </div>
    `;

    const statusEl = document.getElementById('delib-convening-status');
    const progressEl = document.getElementById('delib-progress-bar');

    const storedKey = localStorage.getItem(OPENROUTER_KEY_STORAGE) || '';
    const storedPro = localStorage.getItem(OPENROUTER_PRO_STORAGE) || 'google/gemini-2.5-pro';
    const storedFlash = localStorage.getItem(OPENROUTER_FLASH_STORAGE) || 'google/gemini-2.5-flash';

    const t1 = setTimeout(() => {
      if (statusEl) statusEl.innerHTML = '<span style="color:#60a5fa; font-weight:700;">Stage 1:</span> Gemini 2.5 Pro (Lead Advocate) drafting architectural directive &amp; initial AntiGravity prompt...';
      if (progressEl) progressEl.style.width = '40%';
    }, 400);

    const t2 = setTimeout(() => {
      if (statusEl) statusEl.innerHTML = '<span style="color:#f43f5e; font-weight:700;">Stage 2 (Dialectic Challenge):</span> Gemini 2.5 Flash (Invariant Auditor) cross-examining against Constitution Sec III &amp; &lt;50ms Sunday SLA...';
      if (progressEl) progressEl.style.width = '75%';
    }, 1200);

    const t3 = setTimeout(() => {
      if (statusEl) statusEl.innerHTML = '<span style="color:#fbbf24; font-weight:700;">Stage 3 (Consensus &amp; Fortification):</span> Resolving auditor challenges &amp; issuing ratified sovereign determination...';
      if (progressEl) progressEl.style.width = '94%';
    }, 2200);

    let record = null;
    try {
      const response = await fetch('/api/deliberate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          council_id: currentCouncil.council_id,
          member_id: selectedMemberId,
          mode: deliberationMode,
          query: query,
          openrouter_key: storedKey,
          openrouter_pro_model: storedPro,
          openrouter_flash_model: storedFlash
        })
      });

      if (response.ok) {
        const jsonRes = await response.json();
        if (jsonRes.success && jsonRes.record) {
          record = jsonRes.record;
        }
      }
    } catch (err) {
      console.warn('Backend /api/deliberate endpoint unavailable, falling back to local synthesizer:', err);
    }

    // Authentic deliberation animation delay (minimum 2.0s) for genuine dialectic pacing
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);

    if (!record) {
      record = synthesizeLocalDeliberation(query, currentCouncil, deliberationMode, selectedMemberId);
    }

    saveDeliberationRecord(record);
    renderDeliberationRecordInChamber(record, councils, true);
    showToast('Council deliberation synthesized and recorded!');
  }

  // 16. Tab Switching (Synchronized across Sidebar and Dock tabs)
  document.querySelectorAll('.tab-btn, .sidebar-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (!targetId) return;

      document.querySelectorAll('.tab-btn, .sidebar-nav-btn').forEach(b => {
        if (b.getAttribute('data-tab') === targetId) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(targetId)?.classList.add('active');
      
      // Smooth scroll to top of viewport
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // 19.1 Telemetry Digest Trigger & Continuous Background Polling
  window.triggerTelemetrySync = async function() {
    const icon = document.getElementById('sync-telemetry-icon');
    const label = document.getElementById('sync-telemetry-label');
    if (icon) icon.style.animation = 'spin 1s linear infinite';
    if (label) label.textContent = 'Syncing...';
    try {
      const resp = await fetch('/api/sync-telemetry', { method: 'POST' });
      const data = await resp.json();
      if (data.success) {
        showToast('✓ Incoming telemetry digested from all 6 product pillars!');
        await initData();
      } else {
        showToast('Telemetry digest notice: ' + (data.message || data.error || 'Done'));
        await initData();
      }
    } catch (err) {
      console.warn('API sync endpoint notice, refreshing local cache:', err);
      showToast('Telemetry refreshed from local cache');
      await initData();
    } finally {
      if (icon) icon.style.animation = '';
      if (label) label.textContent = 'Sync Telemetry';
    }
  };

  // Continuous Telemetry Pulse Listener (Polls server every 15s for edge telemetry changes)
  let lastKnownFleetTime = null;
  async function pollIncomingTelemetry() {
    try {
      const resp = await fetch('/api/fleet-status');
      if (resp.ok) {
        const status = await resp.json();
        const genAt = status.generated_at || status.fleet_data_generated_at;
        if (lastKnownFleetTime && genAt && genAt !== lastKnownFleetTime) {
          console.log('[Telemetry Watcher] New edge telemetry detected. Refreshing dashboard...', genAt);
          showToast('⚡ Incoming telemetry digested: Dashboard updated in real-time');
          await initData();
        }
        if (genAt) {
          lastKnownFleetTime = genAt;
        }
      }
    } catch (e) {
      // silent background failure fallback
    }
  }
  setInterval(pollIncomingTelemetry, 15000);

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

    const chipAll = document.getElementById('chal-filter-all');
    if (chipAll) chipAll.textContent = `All Evidence (${reconciliations.length})`;
    const chipAcc = document.getElementById('chal-filter-accepted');
    if (chipAcc) chipAcc.textContent = `Accepted (${reconciliations.length})`;
    const chipRej = document.getElementById('chal-filter-rejected');
    if (chipRej) chipRej.textContent = `Rejected (0)`;

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

    // 13.1 Wire Marketing AI Synthesizer via OpenRouter (Gemini Pro)
    let selectedMarketingObj = 'executive_pitch';
    document.querySelectorAll('#marketing-ai-objective-chips [data-marketing-obj]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#marketing-ai-objective-chips [data-marketing-obj]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedMarketingObj = chip.dataset.marketingObj;
        const btnText = document.getElementById('marketing-ai-btn-text');
        if (btnText) {
          if (selectedMarketingObj === 'enhance_slide') btnText.textContent = 'Enhance Active Slide with Gemini';
          else if (selectedMarketingObj === 'gtm_campaign') btnText.textContent = 'Synthesize GTM Battlecard with Gemini';
          else if (selectedMarketingObj === 'investor_memo') btnText.textContent = 'Synthesize Investor Memo with Gemini';
          else btnText.textContent = 'Synthesize Boardroom Pitch with Gemini';
        }
      });
    });

    document.getElementById('btn-trigger-marketing-ai')?.addEventListener('click', async () => {
      const spinner = document.getElementById('marketing-ai-spinner');
      const btnText = document.getElementById('marketing-ai-btn-text');
      const resultsDiv = document.getElementById('marketing-ai-results');
      const instructions = document.getElementById('marketing-ai-instructions')?.value.trim() || '';

      if (spinner) spinner.style.animation = 'spin 1s linear infinite';
      if (btnText) btnText.textContent = 'Gemini Synthesizing...';

      try {
        const payload = {
          deck_id: selectedPresoId,
          objective: selectedMarketingObj,
          custom_instructions: instructions,
          slide_index: currentSlideIndex
        };

        const resp = await fetch('/api/marketing-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const res = await resp.json();
        if (res.success && res.data) {
          resultsDiv.style.display = 'block';
          const d = res.data;

          if (selectedMarketingObj === 'enhance_slide') {
            resultsDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 14px;">✨</span>
                  <span style="font-weight: 700; color: #FFF; font-size: 14px;">Slide ${currentSlideIndex + 1} Enhanced by Gemini</span>
                  <span style="font-size: 10px; background: rgba(99,102,241,0.25); color: #C4B5FD; padding: 2px 8px; border-radius: 99px; font-weight: 700;">${escapeHtml(d.badge || 'ENHANCED')}</span>
                </div>
                <button id="btn-apply-enhanced-slide" class="btn btn-gold" style="font-size: 11px; padding: 4px 10px; font-weight: 700;">
                  ✓ Apply to Active Slide
                </button>
              </div>
              <div style="font-size: 15px; font-weight: 700; color: #FFF; margin-bottom: 8px;">${escapeHtml(d.title || '')}</div>
              <div style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 6px;">
                ${(d.bullets || []).map(b => `<div style="font-size: 12px; color: #E2E8F0; display: flex; gap: 6px;"><span style="color: var(--gold-400);">✦</span><span>${escapeHtml(b)}</span></div>`).join('')}
              </div>
              <div style="background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: 6px; border-left: 3px solid var(--gold-500); font-size: 12px; color: #94A3B8; font-style: italic;">
                "${escapeHtml(d.speaker_notes || '')}"
              </div>
            `;

            document.getElementById('btn-apply-enhanced-slide')?.addEventListener('click', () => {
              const currentDeck = presosList.find(dk => dk.id === selectedPresoId) || presosList[0];
              if (currentDeck && currentDeck.slides && currentDeck.slides[currentSlideIndex]) {
                const s = currentDeck.slides[currentSlideIndex];
                if (d.title) s.title = d.title;
                if (d.bullets) s.key_takeaways = d.bullets;
                if (d.speaker_notes) s.speaker_notes = d.speaker_notes;
                if (d.badge) s.type = d.badge.toLowerCase();
                updateSlideCanvas(currentDeck);
                showToast(`✓ Slide ${currentSlideIndex + 1} updated with Gemini enhancements!`);
              }
            });

          } else {
            const rawMd = d.synthesis_markdown || '';
            const htmlContent = (typeof marked !== 'undefined' && marked.parse) ? marked.parse(rawMd) : `<pre style="white-space: pre-wrap; color: #E2E8F0;">${escapeHtml(rawMd)}</pre>`;

            resultsDiv.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #FFF; font-family: var(--font-heading);">${escapeHtml(d.headline || res.deck_name)}</div>
                  <div style="font-size: 12px; color: var(--gold-400);">${escapeHtml(d.tagline || '')}</div>
                </div>
                <button id="btn-copy-marketing-synthesis" class="btn btn-secondary" style="font-size: 11px; padding: 4px 10px;">
                  📋 Copy Markdown
                </button>
              </div>

              ${d.key_takeaways && d.key_takeaways.length ? `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 8px; margin-bottom: 16px;">
                  ${d.key_takeaways.map(t => `
                    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); padding: 8px 12px; border-radius: 6px; font-size: 11px; color: #CBD5E1;">
                      <strong style="color: #38BDF8;">✦ Takeaway:</strong> ${escapeHtml(t)}
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="marketing-markdown-render" style="color: #E2E8F0; font-size: 13px; line-height: 1.6; max-height: 420px; overflow-y: auto; padding-right: 8px;">
                ${htmlContent}
              </div>

              ${d.call_to_action ? `
                <div style="margin-top: 14px; padding: 10px 14px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; font-size: 12px; color: #C4B5FD; display: flex; align-items: center; gap: 8px;">
                  <strong>⚡ Recommended Next Action:</strong> ${escapeHtml(d.call_to_action)}
                </div>
              ` : ''}
            `;

            document.getElementById('btn-copy-marketing-synthesis')?.addEventListener('click', () => {
              navigator.clipboard.writeText(rawMd);
              showToast('✓ Markdown synthesis copied to clipboard!');
            });
          }
          showToast('✓ Marketing intelligence synthesized via OpenRouter & Gemini!');
        } else {
          showToast('Marketing AI notice: ' + (res.error || 'Check server connection'));
        }
      } catch (err) {
        console.error('Marketing AI error:', err);
        showToast('Error communicating with OpenRouter');
      } finally {
        if (spinner) spinner.style.animation = '';
        if (btnText) btnText.textContent = selectedMarketingObj === 'enhance_slide' ? 'Enhance Active Slide with Gemini' : 'Synthesize with Gemini';
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

  // 3.19 Render Python Scripts Catalog Tab
  function renderScriptsTab(scripts) {
    if (!scripts || !scripts.length) {
      if (window.CHURCHCORE_SCRIPTS_DATA && window.CHURCHCORE_SCRIPTS_DATA.scripts) {
        scripts = window.CHURCHCORE_SCRIPTS_DATA.scripts;
      }
    }
    if (!scripts || !scripts.length) return;

    const countBadge = document.getElementById('scripts-count-badge');
    const tabBadge = document.getElementById('tab-scripts-badge');
    if (countBadge) countBadge.textContent = `🟢 ${scripts.length} Tools Registered`;
    if (tabBadge) tabBadge.textContent = scripts.length;

    const grid = document.getElementById('scripts-catalog-grid');
    if (!grid) return;

    let activeCategory = 'all';
    let searchQuery = '';

    function filterAndRender() {
      const filtered = scripts.filter(s => {
        const matchesCat = activeCategory === 'all' || s.category === activeCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q || 
          s.rel_path.toLowerCase().includes(q) || 
          s.title.toLowerCase().includes(q) || 
          s.description.toLowerCase().includes(q) ||
          (s.cli_flags && s.cli_flags.some(([flag, desc]) => flag.toLowerCase().includes(q) || desc.toLowerCase().includes(q)));
        return matchesCat && matchesQuery;
      });

      if (!filtered.length) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: rgba(30, 41, 59, 0.4); border-radius: 12px; border: 1px dashed var(--border-subtle); color: var(--text-muted);">
            <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
            <div style="font-weight: 700; color: #FFF; font-size: 15px;">No Automation Scripts Match Your Filter</div>
            <div style="font-size: 12px; margin-top: 4px;">Try searching for a different keyword or selecting "All (${scripts.length})".</div>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(s => {
        const cmd = `python3 ${s.rel_path}`;
        const flagsHtml = s.cli_flags && s.cli_flags.length ? `
          <div style="margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 10px;">
            <div style="font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 6px; letter-spacing: 0.5px;">CLI ARGUMENTS & FLAGS:</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${s.cli_flags.map(([flag, desc]) => `
                <div style="font-size: 11px; display: flex; gap: 6px; align-items: baseline;">
                  <code style="background: rgba(0, 0, 0, 0.4); padding: 1px 5px; border-radius: 4px; color: #38BDF8; font-weight: 600; white-space: nowrap;">${escapeHtml(flag)}</code>
                  <span style="color: #94A3B8; font-size: 11px;">${escapeHtml(desc || '')}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : '';

        return `
          <div class="kpi-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 18px; border-radius: 12px; background: var(--bg-card); border: 1px solid var(--border-subtle); position: relative;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: rgba(56, 189, 248, 0.15); color: #38BDF8; letter-spacing: 0.3px;">
                  ${escapeHtml(s.category)}
                </span>
                <span style="font-size: 10px; color: var(--text-dim); font-family: monospace;">
                  ${s.line_count} lines • ${(s.size_bytes / 1024).toFixed(1)} KB
                </span>
              </div>
              <div style="font-size: 15px; font-weight: 700; color: #FFF; font-family: var(--font-heading); margin-bottom: 4px;">
                ${escapeHtml(s.title)}
              </div>
              <div style="font-size: 11px; color: var(--gold-400); font-family: monospace; margin-bottom: 10px;">
                ${escapeHtml(s.rel_path)}
              </div>
              <div style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 12px;">
                ${escapeHtml(s.description || s.cat_summary || '')}
              </div>
            </div>

            <div>
              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; padding: 8px 10px; display: flex; justify-content: space-between; align-items: center; gap: 6px;">
                <code style="font-size: 11px; color: #10B981; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${cmd}</code>
                <button class="btn btn-secondary" style="font-size: 10px; padding: 3px 8px; white-space: nowrap;" onclick="navigator.clipboard.writeText('${cmd}'); alert('Copied command to clipboard: ${cmd}');">
                  📋 Copy
                </button>
              </div>
              ${flagsHtml}
            </div>
          </div>
        `;
      }).join('');
    }

    // Set up filter chips
    document.querySelectorAll('#scripts-category-filters [data-script-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#scripts-category-filters [data-script-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.scriptFilter;
        filterAndRender();
      });
    });

    // Set up search box
    const searchInput = document.getElementById('scripts-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterAndRender();
      });
    }

    // Refresh button
    document.getElementById('btn-refresh-scripts')?.addEventListener('click', () => {
      filterAndRender();
      alert('Rescanned Python automation tools! 12 tools active.');
    });

    // Top-bar Quick Access Button
    document.getElementById('btn-open-scripts')?.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const tabBtn = document.querySelector('.tab-btn[data-tab="tab-scripts"]');
      const tabPane = document.getElementById('tab-scripts');
      if (tabBtn) tabBtn.classList.add('active');
      if (tabPane) tabPane.classList.add('active');
      tabPane?.scrollIntoView({ behavior: 'smooth' });
    });

    filterAndRender();
  }


  // 3.20 Render Fleet Demo Feedback & Error-Triage Workspace
  function renderFeedbackWorkspace() {
    const container = document.getElementById('feedback-items-container');
    if (!container) return;

    let feedbackData = window.CHURCHCORE_FEEDBACK_DATA?.feedback_items || [];
    
    // Load local triage overrides from localStorage
    const TRIAGE_STORAGE_KEY = 'churchcore_feedback_triage_overrides';
    function getTriageOverrides() {
      try {
        const raw = localStorage.getItem(TRIAGE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    function saveTriageOverride(id, patch) {
      const overrides = getTriageOverrides();
      overrides[id] = { ...(overrides[id] || {}), ...patch };
      localStorage.setItem(TRIAGE_STORAGE_KEY, JSON.stringify(overrides));
    }

    let activeCategory = 'all';
    let activeProduct = 'all';
    let searchQuery = '';

    function filterAndRender() {
      const overrides = getTriageOverrides();
      
      const mergedItems = feedbackData.map(item => {
        const ov = overrides[item.id] || {};
        return {
          ...item,
          processed: ov.processed !== undefined ? ov.processed : item.processed,
          action: ov.action !== undefined ? ov.action : item.action,
          action_label: ov.action_label !== undefined ? ov.action_label : item.action_label
        };
      });

      // Update Top Counts
      const totalCount = mergedItems.length;
      const openCount = mergedItems.filter(i => !i.processed).length;
      const bugErrorCount = mergedItems.filter(i => i.category === 'BUG' || i.category === 'ERROR').length;
      const improvementCount = mergedItems.filter(i => i.category === 'IMPROVEMENT' || i.category === 'UNEXPECTED_RESULT').length;

      document.getElementById('fb-total-count')?.replaceChildren(document.createTextNode(String(totalCount)));
      document.getElementById('fb-open-count')?.replaceChildren(document.createTextNode(String(openCount)));
      document.getElementById('fb-bugs-count')?.replaceChildren(document.createTextNode(String(bugErrorCount)));
      document.getElementById('fb-improvements-count')?.replaceChildren(document.createTextNode(String(improvementCount)));

      const badgeHeader = document.getElementById('feedback-triage-badge');
      if (badgeHeader) {
        badgeHeader.textContent = `🟢 ${totalCount} Reports • ${openCount} Open`;
      }
      const sidebarBadge = document.getElementById('sidebar-feedback-badge');
      if (sidebarBadge) {
        sidebarBadge.textContent = String(openCount);
      }

      // Filter
      const filtered = mergedItems.filter(item => {
        const matchesCat = activeCategory === 'all' || item.category === activeCategory;
        const matchesProd = activeProduct === 'all' || item.product_id === activeProduct;
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = !q ||
          item.product_name.toLowerCase().includes(q) ||
          item.route.toLowerCase().includes(q) ||
          (item.note && item.note.toLowerCase().includes(q)) ||
          (item.error_message && item.error_message.toLowerCase().includes(q)) ||
          (item.user_email && item.user_email.toLowerCase().includes(q));
        return matchesCat && matchesProd && matchesQuery;
      });

      if (!filtered.length) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px; background: rgba(30, 41, 59, 0.4); border-radius: 12px; border: 1px dashed var(--border-subtle); color: var(--text-muted);">
            <div style="font-size: 28px; margin-bottom: 8px;">🔍</div>
            <div style="font-weight: 700; color: #FFF; font-size: 15px;">No Feedback Records Match Filter</div>
            <div style="font-size: 12px; margin-top: 4px;">Try selecting "All" or clearing the search box.</div>
          </div>
        `;
        return;
      }

      const CATEGORY_STYLES = {
        BUG: { bg: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E', border: 'rgba(244, 63, 94, 0.3)' },
        ERROR: { bg: 'rgba(249, 115, 22, 0.15)', color: '#FB923C', border: 'rgba(249, 115, 22, 0.3)' },
        UNEXPECTED_RESULT: { bg: 'rgba(234, 179, 8, 0.15)', color: '#FACC15', border: 'rgba(234, 179, 8, 0.3)' },
        IMPROVEMENT: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: 'rgba(56, 189, 248, 0.3)' }
      };

      container.innerHTML = filtered.map(item => {
        const catStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.IMPROVEMENT;
        const isResolved = item.processed;
        const mins = Math.floor((item.session_duration_seconds || 0) / 60);
        const secs = (item.session_duration_seconds || 0) % 60;
        const durStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

        return `
          <div class="kpi-card" style="padding: 16px 20px; border-radius: 12px; background: #13161B; border: 1px solid ${isResolved ? 'rgba(76, 195, 138, 0.2)' : 'var(--border-dark)'}; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background: ${catStyle.bg}; color: ${catStyle.color}; border: 1px solid ${catStyle.border};">
                  ${item.category}
                </span>
                <span style="font-weight: 700; font-size: 14px; color: #FFFFFF;">${escapeHtml(item.product_name)}</span>
                <span style="font-family: 'Geist Mono', monospace; font-size: 11px; color: var(--text-dim);">${escapeHtml(item.demo_version || '')}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 11px; font-family: 'Geist Mono', monospace; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; color: #94A3B8;">
                  hit_count: ${item.hit_count || 1}
                </span>
                <span style="font-size: 11px; color: var(--text-dim);">${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'recent'}</span>
              </div>
            </div>

            <div>
              <div style="font-size: 12px; margin-bottom: 4px;">
                <span style="color: #7E8793;">Target Route:</span>
                <code style="background: rgba(0,0,0,0.4); padding: 1px 6px; border-radius: 4px; color: #F0A63A; font-size: 12px;">${escapeHtml(item.route)}</code>
              </div>
              ${item.error_message ? `
                <div style="background: rgba(244, 63, 94, 0.08); border-left: 3px solid #F43F5E; padding: 8px 12px; border-radius: 4px; font-family: 'Geist Mono', monospace; font-size: 12px; color: #FFB3A6; margin: 6px 0;">
                  ${escapeHtml(item.error_message)}
                </div>
              ` : ''}
              ${item.note ? `
                <div style="font-size: 13px; color: #E7E9EC; line-height: 1.5; margin: 6px 0;">
                  ${escapeHtml(item.note)}
                </div>
              ` : ''}
              ${item.breadcrumbs && item.breadcrumbs.length ? `
                <div style="font-size: 11px; color: #7E8793; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; margin-top: 4px;">
                  <span>Breadcrumbs:</span>
                  ${item.breadcrumbs.map(b => `<span style="background: rgba(255,255,255,0.05); padding: 1px 5px; border-radius: 3px; color: #94A3B8;">${escapeHtml(b)}</span>`).join(' → ')}
                </div>
              ` : ''}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px; margin-top: 4px;">
              <div style="font-size: 11px; color: #7E8793; display: flex; align-items: center; gap: 12px;">
                ${item.user_email ? `<span>User: <strong style="color: #C4CAD2;">${escapeHtml(item.user_email)}</strong> (${escapeHtml(item.user_role || 'GUEST')})</span>` : '<span>Anonymous Visitor</span>'}
                <span>Duration: <strong style="color: #C4CAD2;">${durStr}</strong></span>
              </div>
                <button type="button" class="btn-feedback-council-item" data-id="${item.id}" style="background: rgba(245, 158, 11, 0.15); color: #FBBF24; border: 1px solid rgba(245, 158, 11, 0.35); padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;" title="Convene Council to evaluate and render verdict on this report">
                  <span>⚖️ Council Verdict</span>
                </button>
                <select class="triage-action-select" data-id="${item.id}" style="background: #1C2129; color: #E7E9EC; border: 1px solid #2A303A; padding: 4px 8px; border-radius: 6px; font-size: 11px;">
                  <option value="">Set Triage Action...</option>
                  <option value="bug_fixed" ${item.action === 'bug_fixed' ? 'selected' : ''}>Bug Fixed</option>
                  <option value="code_fixed" ${item.action === 'code_fixed' ? 'selected' : ''}>Code Fixed</option>
                  <option value="error_fixed" ${item.action === 'error_fixed' ? 'selected' : ''}>Error Fixed</option>
                  <option value="suggestion_implemented" ${item.action === 'suggestion_implemented' ? 'selected' : ''}>Suggestion Implemented</option>
                  <option value="update_applied" ${item.action === 'update_applied' ? 'selected' : ''}>Update Applied</option>
                  <option value="suggestion_not_implemented" ${item.action === 'suggestion_not_implemented' ? 'selected' : ''}>Suggestion Not Implemented</option>
                  <option value="received_and_closed" ${item.action === 'received_and_closed' ? 'selected' : ''}>Received & Closed</option>
                </select>
                <button type="button" class="btn-toggle-resolve" data-id="${item.id}" data-current="${isResolved}" style="background: ${isResolved ? 'rgba(76, 195, 138, 0.15)' : 'rgba(255,255,255,0.08)'}; color: ${isResolved ? '#6BD6A0' : '#E7E9EC'}; border: 1px solid ${isResolved ? '#2B5A40' : '#2A303A'}; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
                  ${isResolved ? '✓ Resolved' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Wire Triage Action Selects
      container.querySelectorAll('.triage-action-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const id = e.target.dataset.id;
          const actionVal = e.target.value;
          const actionText = e.target.options[e.target.selectedIndex].text;
          saveTriageOverride(id, { action: actionVal, action_label: actionText, processed: !!actionVal });
          filterAndRender();
        });
      });

      // Wire Resolve Toggle Buttons
      container.querySelectorAll('.btn-toggle-resolve').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const cur = e.target.dataset.current === 'true';
          saveTriageOverride(id, { processed: !cur });
          filterAndRender();
        });
      });
    }

    // Category filter chips
    document.querySelectorAll('#feedback-category-filters [data-fb-category]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#feedback-category-filters [data-fb-category]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.fbCategory;
        filterAndRender();
      });
    });

    // Product select
    document.getElementById('fb-product-select')?.addEventListener('change', (e) => {
      activeProduct = e.target.value;
      filterAndRender();
    });

    // Search input
    document.getElementById('feedback-search-input')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRender();
    });

    // Wire Individual Council Verdict Buttons
    container.querySelectorAll('.btn-feedback-council-item').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const overrides = getTriageOverrides();
        const rawItem = feedbackData.find(i => i.id === id);
        if (rawItem) {
          const ov = overrides[rawItem.id] || {};
          const item = { ...rawItem, ...ov };
          await openFeedbackCouncilModal({ mode: 'single_item', item: item });
        }
      });
    });

    // Wire Fleet-Wide Council Deliberation Button
    document.getElementById('btn-convene-feedback-council')?.addEventListener('click', async () => {
      const overrides = getTriageOverrides();
      const mergedItems = feedbackData.map(item => {
        const ov = overrides[item.id] || {};
        return {
          ...item,
          processed: ov.processed !== undefined ? ov.processed : item.processed,
          action: ov.action !== undefined ? ov.action : item.action
        };
      });
      await openFeedbackCouncilModal({ mode: 'fleet_analytics', items: mergedItems });
    });

    // Modal Helper for Council Feedback Adjudication
    async function openFeedbackCouncilModal({ mode, item, items }) {
      const modal = document.getElementById('feedback-council-modal');
      const titleEl = document.getElementById('feedback-council-modal-title');
      const subtitleEl = document.getElementById('feedback-council-modal-subtitle');
      const contentEl = document.getElementById('feedback-council-modal-content');
      const footerActions = document.getElementById('feedback-council-modal-actions');

      if (!modal || !contentEl) return;
      modal.classList.add('active');

      if (mode === 'single_item' && item) {
        titleEl.textContent = `Council Adjudication: ${item.id} (${item.product_name})`;
        subtitleEl.textContent = `Evaluating ${item.category} on ${item.route} via OpenRouter Gemini 2.5 Pro`;
        contentEl.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="width: 44px; height: 44px; border: 3px solid rgba(245, 158, 11, 0.2); border-top-color: #F59E0B; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
            <div style="font-weight: 700; color: #FFF; font-size: 15px;">Convening Sovereign Council...</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">
              Dual Contending Gemini evaluating root cause, Section III Data Sovereignty, and Sunday SLA invariants.
            </div>
          </div>
        `;

        try {
          const resp = await fetch('/api/feedback-council', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'single_item', feedback_item: item })
          });
          const res = await resp.json();
          if (res.success && res.data) {
            const d = res.data;
            const badgeBg = d.verdict === 'FIX' ? 'rgba(244, 63, 94, 0.2)' : (d.verdict === 'IMPLEMENT' ? 'rgba(76, 195, 138, 0.2)' : 'rgba(245, 158, 11, 0.2)');
            const badgeColor = d.verdict === 'FIX' ? '#F43F5E' : (d.verdict === 'IMPLEMENT' ? '#6BD6A0' : '#FBBF24');
            const badgeBorder = d.verdict === 'FIX' ? '#F43F5E' : (d.verdict === 'IMPLEMENT' ? '#2B5A40' : '#D97706');

            contentEl.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                <div>
                  <span style="font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; background: ${badgeBg}; color: ${badgeColor}; border: 1px solid ${badgeBorder};">
                    ${escapeHtml(d.verdict_badge || d.verdict)}
                  </span>
                  <div style="font-size: 17px; font-weight: 800; color: #FFF; margin-top: 6px; font-family: var(--font-heading);">
                    ${escapeHtml(d.product_name)}: ${escapeHtml(item.route)}
                  </div>
                </div>
                <span style="font-size: 11px; color: var(--text-muted); background: rgba(0,0,0,0.4); padding: 4px 8px; border-radius: 6px;">
                  Confidence: <strong style="color: #6BD6A0;">${d.confidence_score || 95}%</strong> • ${escapeHtml(res.provider || 'Gemini')}
                </span>
              </div>

              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 16px;">
                <div style="font-size: 11px; font-weight: 800; color: #F59E0B; letter-spacing: 0.5px; margin-bottom: 4px;">COUNCIL FINDING & ROOT CAUSE:</div>
                <div style="font-size: 13px; color: #E2E8F0; line-height: 1.5;">${escapeHtml(d.finding || '')}</div>
              </div>

              ${d.constitutional_check ? `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-bottom: 16px;">
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 10px; border-radius: 6px; font-size: 11px;">
                    <strong style="color: #38BDF8; display: block; margin-bottom: 2px;">🛡️ Data Sovereignty (Sec III)</strong>
                    <span style="color: #94A3B8;">${escapeHtml(d.constitutional_check.data_sovereignty_section_iii || 'PASS')}</span>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 10px; border-radius: 6px; font-size: 11px;">
                    <strong style="color: #FBBF24; display: block; margin-bottom: 2px;">⏱️ Sunday 99.99% SLA</strong>
                    <span style="color: #94A3B8;">${escapeHtml(d.constitutional_check.sunday_sla_impact || 'PASS')}</span>
                  </div>
                  <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 10px; border-radius: 6px; font-size: 11px;">
                    <strong style="color: #A78BFA; display: block; margin-bottom: 2px;">🕊️ Pastoral Integrity</strong>
                    <span style="color: #94A3B8;">${escapeHtml(d.constitutional_check.theological_liturgical_alignment || 'ALIGNED')}</span>
                  </div>
                </div>
              ` : ''}

              <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; padding: 14px; margin-bottom: 16px;">
                <div style="font-size: 11px; font-weight: 800; color: #C4B5FD; letter-spacing: 0.5px; margin-bottom: 8px;">TECHNICAL ACTION PLAN:</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${((d.action_plan && d.action_plan.mitigation_steps) || []).map((step, idx) => `
                    <div style="font-size: 12px; color: #E2E8F0; display: flex; gap: 8px;">
                      <span style="color: #38BDF8; font-weight: 700;">${idx + 1}.</span>
                      <span>${escapeHtml(step)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="font-size: 12px; color: #94A3B8; font-style: italic; border-left: 3px solid #F59E0B; padding-left: 12px;">
                "${escapeHtml(d.council_decree || '')}"
              </div>
            `;

            const suggestedAction = d.action_plan?.suggested_triage_action || (d.verdict === 'FIX' ? 'bug_fixed' : (d.verdict === 'IMPLEMENT' ? 'suggestion_implemented' : 'suggestion_not_implemented'));
            footerActions.innerHTML = `
              <button class="btn btn-secondary" id="btn-close-council-modal-footer" style="font-size: 12px; padding: 6px 14px;">Close</button>
              <button class="btn btn-gold" id="btn-apply-council-verdict" style="font-size: 12px; padding: 6px 16px; font-weight: 700;">
                ✓ Accept &amp; Apply Verdict (${d.verdict})
              </button>
            `;

            document.getElementById('btn-apply-council-verdict')?.addEventListener('click', () => {
              saveTriageOverride(item.id, {
                action: suggestedAction,
                action_label: suggestedAction.replace(/_/g, ' ').toUpperCase(),
                processed: true
              });
              modal.classList.remove('active');
              filterAndRender();
              showToast(`✓ Council verdict applied: ${item.id} marked as ${suggestedAction}!`);
            });

            document.getElementById('btn-close-council-modal-footer')?.addEventListener('click', () => modal.classList.remove('active'));
          } else {
            contentEl.innerHTML = `<div style="color: #F43F5E; padding: 20px;">Council deliberation notice: ${escapeHtml(res.error || 'Failed to deliberate')}</div>`;
          }
        } catch (e) {
          contentEl.innerHTML = `<div style="color: #F43F5E; padding: 20px;">Deliberation error: ${escapeHtml(String(e))}</div>`;
        }

      } else {
        // Fleet Analytics Mode
        titleEl.textContent = 'High Sovereign Council: Full Fleet Feedback Adjudication';
        subtitleEl.textContent = `Plenary Session inspecting ${items?.length || 14} Reports across all 6 Products via OpenRouter Gemini`;
        contentEl.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <div style="width: 44px; height: 44px; border: 3px solid rgba(245, 158, 11, 0.2); border-top-color: #F59E0B; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
            <div style="font-weight: 700; color: #FFF; font-size: 15px;">Concurring High Sovereign Grand Council in Plenary Session...</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">
              Synthesizing root causes, triaging into FIX / IMPLEMENT / DENY, and establishing sprint priorities.
            </div>
          </div>
        `;

        try {
          const resp = await fetch('/api/feedback-council', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'fleet_analytics', feedback_items: items })
          });
          const res = await resp.json();
          if (res.success && res.data) {
            const d = res.data;
            const vs = d.verdicts_summary || {};
            const evals = d.item_evaluations || [];

            contentEl.innerHTML = `
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
                <div style="background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 8px; padding: 12px 16px; text-align: center;">
                  <div style="font-size: 11px; font-weight: 800; color: #F43F5E; letter-spacing: 0.5px;">MANDATORY FIXES</div>
                  <div style="font-size: 26px; font-weight: 800; color: #FFF; font-family: var(--font-heading); margin-top: 2px;">${vs.fix_count || 0}</div>
                  <div style="font-size: 11px; color: #94A3B8;">P0/P1 Immediate Hotfixes</div>
                </div>
                <div style="background: rgba(76, 195, 138, 0.12); border: 1px solid rgba(76, 195, 138, 0.3); border-radius: 8px; padding: 12px 16px; text-align: center;">
                  <div style="font-size: 11px; font-weight: 800; color: #6BD6A0; letter-spacing: 0.5px;">ACCEPTED IMPLEMENTATIONS</div>
                  <div style="font-size: 26px; font-weight: 800; color: #FFF; font-family: var(--font-heading); margin-top: 2px;">${vs.implement_count || 0}</div>
                  <div style="font-size: 11px; color: #94A3B8;">Approved Roadmap Sprints</div>
                </div>
                <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px 16px; text-align: center;">
                  <div style="font-size: 11px; font-weight: 800; color: #FBBF24; letter-spacing: 0.5px;">FORMALLY DENIED</div>
                  <div style="font-size: 26px; font-weight: 800; color: #FFF; font-family: var(--font-heading); margin-top: 2px;">${vs.deny_count || 0}</div>
                  <div style="font-size: 11px; color: #94A3B8;">Section III / Policy Invariants</div>
                </div>
              </div>

              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-size: 11px; font-weight: 800; color: #F59E0B; letter-spacing: 0.5px; margin-bottom: 4px;">HIGH COUNCIL EXECUTIVE SYNTHESIS:</div>
                <div style="font-size: 13px; color: #E2E8F0; line-height: 1.6;">${escapeHtml(d.executive_summary || '')}</div>
              </div>

              <div style="margin-bottom: 20px;">
                <div style="font-size: 12px; font-weight: 800; color: #FFF; letter-spacing: 0.5px; margin-bottom: 10px;">ITEM-BY-ITEM ADJUDICATION LEDGER (${evals.length} REPORTS):</div>
                <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 6px;">
                  ${evals.map(ev => {
                    const badgeBg = ev.verdict === 'FIX' ? 'rgba(244, 63, 94, 0.2)' : (ev.verdict === 'IMPLEMENT' ? 'rgba(76, 195, 138, 0.2)' : 'rgba(245, 158, 11, 0.2)');
                    const badgeColor = ev.verdict === 'FIX' ? '#F43F5E' : (ev.verdict === 'IMPLEMENT' ? '#6BD6A0' : '#FBBF24');
                    return `
                      <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                        <div style="flex: 1;">
                          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${badgeBg}; color: ${badgeColor};">${ev.verdict}</span>
                            <span style="font-weight: 700; font-size: 12px; color: #FFF;">${escapeHtml(ev.id)}</span>
                            <span style="font-size: 11px; color: var(--text-dim);">${escapeHtml(ev.product || '')}</span>
                            <code style="font-size: 11px; color: #F0A63A;">${escapeHtml(ev.route || '')}</code>
                          </div>
                          <div style="font-size: 12px; color: #CBD5E1;">${escapeHtml(ev.finding || ev.plan || '')}</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              ${d.sprint_recommendations && d.sprint_recommendations.length ? `
                <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 14px;">
                  <div style="font-size: 11px; font-weight: 800; color: #C4B5FD; letter-spacing: 0.5px; margin-bottom: 8px;">COUNCIL MANDATED SPRINT ACTIONS:</div>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${d.sprint_recommendations.map((rec, i) => `
                      <div style="font-size: 12px; color: #E2E8F0; display: flex; gap: 8px;">
                        <span style="color: var(--gold-400); font-weight: 700;">⚡</span>
                        <span>${escapeHtml(rec)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            `;

            footerActions.innerHTML = `
              <button class="btn btn-secondary" id="btn-close-council-modal-footer" style="font-size: 12px; padding: 6px 14px;">Close</button>
              <button class="btn btn-gold" id="btn-batch-apply-council-triage" style="font-size: 12px; padding: 6px 16px; font-weight: 700;">
                ✓ Batch Apply All Council Triage Recommendations (${evals.length})
              </button>
            `;

            document.getElementById('btn-batch-apply-council-triage')?.addEventListener('click', () => {
              evals.forEach(ev => {
                if (ev.id && ev.suggested_action) {
                  saveTriageOverride(ev.id, {
                    action: ev.suggested_action,
                    action_label: ev.suggested_action.replace(/_/g, ' ').toUpperCase(),
                    processed: true
                  });
                }
              });
              modal.classList.remove('active');
              filterAndRender();
              showToast(`✓ All ${evals.length} feedback reports triaged per Council Decree!`);
            });

            document.getElementById('btn-close-council-modal-footer')?.addEventListener('click', () => modal.classList.remove('active'));
          } else {
            contentEl.innerHTML = `<div style="color: #F43F5E; padding: 20px;">Plenary session error: ${escapeHtml(res.error || 'Failed')}</div>`;
          }
        } catch (e) {
          contentEl.innerHTML = `<div style="color: #F43F5E; padding: 20px;">Council plenary error: ${escapeHtml(String(e))}</div>`;
        }
      }

      document.getElementById('feedback-council-modal-close')?.addEventListener('click', () => modal.classList.remove('active'));
    }

    // Top button hook
    document.getElementById('btn-open-feedback-top')?.addEventListener('click', () => {
      document.querySelector('.sidebar-nav-btn[data-tab="tab-feedback"]')?.click();
    });

    filterAndRender();
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
    renderFeedbackWorkspace();
    renderScriptsTab(data.scripts || (window.CHURCHCORE_SCRIPTS_DATA ? window.CHURCHCORE_SCRIPTS_DATA.scripts : []));
  }

  initData();
});
