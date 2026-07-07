// ── Constants ─────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'flamingo2026';
const STORAGE_KEY    = 'flamingo_alerts';

// ── Kenya Counties for dropdown ───────────────────────────────────────────
const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'];

const countySelect = document.getElementById('alert-county');
COUNTIES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = c;
  countySelect.appendChild(opt);
});

// ── Default seed alerts ───────────────────────────────────────────────────
const SEED_ALERTS = [
  { id:'s1', type:'flood', severity:'critical', county:'Kisii', location:'Suneka, near Kisii-Kisumu road', desc:'Flash floods reported along the Sondu River banks. Several homes submerged. Residents urged to move to higher ground immediately.', reporter:'Flamingo Rover Scouts', contact:'', time:'2026-07-01T06:30:00', status:'approved' },
  { id:'s2', type:'tension', severity:'medium', county:'Nairobi', location:'Eastleigh, Section 3', desc:'Minor community tension reported between youth groups. Situation developing. Peace monitors deployed. No injuries reported yet.', reporter:'KSA Peace Monitor', contact:'', time:'2026-07-01T08:15:00', status:'approved' },
  { id:'s3', type:'drought', severity:'high', county:'Turkana', location:'Lodwar and surrounding areas', desc:'Prolonged drought affecting livestock and water supply. Families in Lodwar North severely affected. Aid organizations alerted.', reporter:'Anonymous', contact:'', time:'2026-06-30T14:00:00', status:'approved' },
  { id:'s4', type:'landslide', severity:'high', county:'Elgeyo-Marakwet', location:'Iten — Tambach road', desc:'Landslide blocking major road after heavy rains. No casualties reported but road impassable. Alternative routes advised.', reporter:'Road User', contact:'', time:'2026-06-30T09:45:00', status:'approved' },
  { id:'s5', type:'fire', severity:'critical', county:'Nakuru', location:'Nakuru Town Market', desc:'Fire reported at Nakuru main market. Fire brigade on site. Traders urged to evacuate. Cause unknown.', reporter:'Bystander', contact:'', time:'2026-06-29T11:20:00', status:'approved' },
];

// ── Alert helpers ─────────────────────────────────────────────────────────
const TYPE_ICONS = { flood:'🌊', fire:'🔥', drought:'☀️', tension:'⚡', landslide:'⛰️', other:'📢' };
const TYPE_LABELS = { flood:'Flood', fire:'Fire', drought:'Drought', tension:'Community Tension', landslide:'Landslide', other:'Other Emergency' };
const SEV_LABELS  = { critical:'🔴 Critical', high:'🟠 High', medium:'🟡 Medium', low:'🟢 Low' };

function loadAlerts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const userAlerts = saved ? JSON.parse(saved) : [];
  // Merge seed alerts with user alerts, avoid duplicates
  const allIds = userAlerts.map(a => a.id);
  const seeds  = SEED_ALERTS.filter(s => !allIds.includes(s.id));
  return [...seeds, ...userAlerts];
}

function saveAlerts(alerts) {
  // Only save non-seed alerts
  const userAlerts = alerts.filter(a => !a.id.startsWith('s'));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userAlerts));
}

function getAlerts() { return loadAlerts(); }

function timeAgo(isoTime) {
  const diff = Math.floor((Date.now() - new Date(isoTime)) / 1000);
  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

// ── Render alerts board ───────────────────────────────────────────────────
let currentFilter = 'all';

function renderAlerts() {
  const all      = getAlerts();
  const approved = all.filter(a => a.status === 'approved');
  const filtered = currentFilter === 'all' ? approved : approved.filter(a => a.type === currentFilter);
  const list     = document.getElementById('alerts-list');
  const sub      = document.getElementById('board-sub');

  // Update sidebar stats
  document.getElementById('stat-total').textContent    = approved.length;
  document.getElementById('stat-critical').textContent = approved.filter(a => a.severity === 'critical').length;
  document.getElementById('stat-pending').textContent  = all.filter(a => a.status === 'pending').length;

  sub.textContent = `${filtered.length} alert${filtered.length !== 1 ? 's' : ''} shown`;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="no-alerts">🕊️ No alerts in this category right now.<br>The community is peaceful!</div>`;
    return;
  }

  // Sort newest first
  const sorted = [...filtered].sort((a,b) => new Date(b.time) - new Date(a.time));

  list.innerHTML = sorted.map(a => `
    <div class="alert-card ${a.severity}">
      <div class="alert-type-icon">${TYPE_ICONS[a.type] || '📢'}</div>
      <div class="alert-info">
        <div class="alert-top">
          <div class="alert-title-text">${TYPE_LABELS[a.type] || 'Alert'} — ${a.county}</div>
          <div class="alert-badges">
            <span class="severity-badge ${a.severity}">${SEV_LABELS[a.severity]}</span>
            <span class="type-badge">${TYPE_ICONS[a.type]} ${TYPE_LABELS[a.type]}</span>
          </div>
        </div>
        <div class="alert-meta">
          <span class="alert-meta-item">📍 ${a.location}</span>
          <span class="alert-meta-item">🕐 ${timeAgo(a.time)}</span>
        </div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-reporter">Reported by: ${a.reporter || 'Anonymous'}</div>
      </div>
    </div>
  `).join('');
}

// ── Filter buttons ────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderAlerts();
  });
});

// ── Report Alert Modal ────────────────────────────────────────────────────
const reportModal  = document.getElementById('report-modal');
document.getElementById('open-report-btn').addEventListener('click',  () => reportModal.classList.remove('hidden'));
document.getElementById('close-report-btn').addEventListener('click', () => reportModal.classList.add('hidden'));
document.getElementById('cancel-report-btn').addEventListener('click',() => reportModal.classList.add('hidden'));
reportModal.addEventListener('click', e => { if (e.target === reportModal) reportModal.classList.add('hidden'); });

document.getElementById('submit-alert-btn').addEventListener('click', () => {
  const type     = document.getElementById('alert-type').value;
  const severity = document.getElementById('alert-severity').value;
  const county   = document.getElementById('alert-county').value;
  const location = document.getElementById('alert-location').value.trim();
  const desc     = document.getElementById('alert-desc').value.trim();
  const reporter = document.getElementById('alert-name').value.trim() || 'Anonymous';
  const contact  = document.getElementById('alert-contact').value.trim();

  if (!county || !location || !desc) {
    showToast('⚠️ Please fill in County, Location and Description.', true);
    return;
  }

  const newAlert = {
    id: 'u' + Date.now(), type, severity, county, location, desc,
    reporter, contact, time: new Date().toISOString(), status: 'pending'
  };

  const all = getAlerts();
  all.push(newAlert);
  saveAlerts(all);

  // Clear form
  ['alert-location','alert-desc','alert-name','alert-contact'].forEach(id => document.getElementById(id).value = '');
  reportModal.classList.add('hidden');
  showToast('✅ Alert submitted! It will appear after admin approval.');
  renderAlerts();
  updateAdminList();
});

// ── Admin Modal ───────────────────────────────────────────────────────────
const adminModal = document.getElementById('admin-modal');
let adminLoggedIn = false;
let currentAdminTab = 'pending';

document.getElementById('open-admin-btn').addEventListener('click',  () => adminModal.classList.remove('hidden'));
document.getElementById('close-admin-btn').addEventListener('click', () => adminModal.classList.add('hidden'));
adminModal.addEventListener('click', e => { if (e.target === adminModal) adminModal.classList.add('hidden'); });

document.getElementById('admin-login-btn').addEventListener('click', () => {
  const pwd = document.getElementById('admin-password').value;
  if (pwd === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    document.getElementById('admin-login-panel').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    updateAdminList();
  } else {
    document.getElementById('admin-error').classList.remove('hidden');
  }
});

document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentAdminTab = tab.dataset.tab;
    updateAdminList();
  });
});

function updateAdminList() {
  if (!adminLoggedIn) return;
  const all      = getAlerts();
  const filtered = all.filter(a => a.status === currentAdminTab);
  const listEl   = document.getElementById('admin-alerts-list');

  // Update pending badge
  document.getElementById('pending-count').textContent = all.filter(a => a.status === 'pending').length;

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="color:var(--muted);font-size:0.85rem;padding:1rem 0;font-style:italic">No ${currentAdminTab} alerts.</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(a => `
    <div class="admin-alert-item">
      <div class="admin-alert-title">${TYPE_ICONS[a.type]} ${TYPE_LABELS[a.type]} — ${a.county} · ${SEV_LABELS[a.severity]}</div>
      <div class="admin-alert-meta">📍 ${a.location} &nbsp;·&nbsp; 🕐 ${timeAgo(a.time)} &nbsp;·&nbsp; 👤 ${a.reporter}</div>
      <div class="admin-alert-desc">${a.desc}</div>
      <div class="admin-actions">
        ${a.status === 'pending' ? `
          <button class="approve-btn" onclick="approveAlert('${a.id}')">✅ Approve</button>
          <button class="reject-btn"  onclick="rejectAlert('${a.id}')">❌ Reject</button>
        ` : ''}
        ${a.id.startsWith('u') ? `<button class="delete-btn" onclick="deleteAlert('${a.id}')">🗑️ Delete</button>` : ''}
      </div>
    </div>
  `).join('');
}

function approveAlert(id) {
  const all = getAlerts();
  const alert = all.find(a => a.id === id);
  if (alert) { alert.status = 'approved'; saveAlerts(all); }
  renderAlerts(); updateAdminList();
  showToast('✅ Alert approved and published!');
}

function rejectAlert(id) {
  const all = getAlerts();
  const alert = all.find(a => a.id === id);
  if (alert) { alert.status = 'rejected'; saveAlerts(all); }
  renderAlerts(); updateAdminList();
  showToast('❌ Alert rejected.');
}

function deleteAlert(id) {
  const saved = localStorage.getItem(STORAGE_KEY);
  let userAlerts = saved ? JSON.parse(saved) : [];
  userAlerts = userAlerts.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userAlerts));
  renderAlerts(); updateAdminList();
  showToast('🗑️ Alert deleted.');
}

// ── Toast notification ────────────────────────────────────────────────────
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.style.borderColor = isError ? 'rgba(224,92,122,0.4)' : 'rgba(90,163,104,0.4)';
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ── Initial render ────────────────────────────────────────────────────────
renderAlerts();