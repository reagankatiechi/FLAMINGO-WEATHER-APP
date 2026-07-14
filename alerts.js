// ── Supabase Configuration ────────────────────────────────────────────────
const SUPABASE_URL = 'https://vdhqqlsdirelvzimgdgd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaHFxbHNkaXJlbHZ6aW1nZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTczMzksImV4cCI6MjA5OTUzMzMzOX0.A-I8w8iWWDphwsFQ1Rh_Wbq9FCDbKsrC_ehQYVBiG60';
const HEADERS = { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` };

// ── Kenya Counties ────────────────────────────────────────────────────────
const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'];

const countySelect = document.getElementById('alert-county');
COUNTIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    countySelect.appendChild(opt);
});

// ── Constants ─────────────────────────────────────────────────────────────
const TYPE_ICONS  = { flood:'🌊', fire:'🔥', drought:'☀️', tension:'⚡', landslide:'⛰️', other:'📢' };
const TYPE_LABELS = { flood:'Flood', fire:'Fire', drought:'Drought', tension:'Community Tension', landslide:'Landslide', other:'Other Emergency' };
const SEV_LABELS  = { critical:'🔴 Critical', high:'🟠 High', medium:'🟡 Medium', low:'🟢 Low' };

let currentFilter   = 'all';
let adminLoggedIn   = false;
let currentAdminTab = 'pending';

// ── Time ago ──────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
}

// ── Render alerts ─────────────────────────────────────────────────────────
async function renderAlerts() {
    const list = document.getElementById('alerts-list');
    const sub  = document.getElementById('board-sub');
    list.innerHTML = `<div class="no-alerts" style="color:var(--muted);text-align:center;padding:2rem">Loading alerts…</div>`;

    try {
        let url = `${SUPABASE_URL}/rest/v1/alerts?select=*&status=eq.approved&order=created_at.desc`;
        if (currentFilter !== 'all') url += `&type=eq.${currentFilter}`;

        const res    = await fetch(url, { headers: HEADERS });
        const alerts = await res.json();

        // Stats
        const statsRes = await fetch(`${SUPABASE_URL}/rest/v1/alerts?select=severity,status`, { headers: HEADERS });
        const all      = await statsRes.json();
        const total    = all.filter(a => a.status !== 'rejected').length;
        const critical = all.filter(a => a.severity === 'critical' && a.status === 'approved').length;
        const pending  = all.filter(a => a.status === 'pending').length;

        document.getElementById('stat-total').textContent    = total;
        document.getElementById('stat-critical').textContent = critical;
        document.getElementById('stat-pending').textContent  = pending;
        sub.textContent = `${alerts.length} alert${alerts.length !== 1 ? 's' : ''} shown`;

        if (alerts.length === 0) {
            list.innerHTML = `<div class="no-alerts">🕊️ No alerts in this category right now. The community is peaceful!</div>`;
            return;
        }

        list.innerHTML = alerts.map(a => `
            <div class="alert-card ${a.severity}">
                <div class="alert-type-icon">${TYPE_ICONS[a.type] || '📢'}</div>
                <div class="alert-info">
                    <div class="alert-top">
                        <div class="alert-title-text">${TYPE_LABELS[a.type]} — ${a.county}</div>
                        <div class="alert-badges">
                            <span class="severity-badge ${a.severity}">${SEV_LABELS[a.severity]}</span>
                            <span class="type-badge">${TYPE_ICONS[a.type]} ${TYPE_LABELS[a.type]}</span>
                        </div>
                    </div>
                    <div class="alert-meta">
                        <span class="alert-meta-item">📍 ${a.location}</span>
                        <span class="alert-meta-item">🕐 ${timeAgo(a.created_at)}</span>
                    </div>
                    <div class="alert-desc">${a.description}</div>
                    <div class="alert-reporter">Reported by: ${a.reporter || 'Anonymous'}</div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        list.innerHTML = `<div class="no-alerts">❌ Could not load alerts.<br><small>${err.message}</small></div>`;
    }
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

// ── Report Modal ──────────────────────────────────────────────────────────
const reportModal = document.getElementById('report-modal');
document.getElementById('open-report-btn').addEventListener('click',  () => reportModal.classList.remove('hidden'));
document.getElementById('close-report-btn').addEventListener('click', () => reportModal.classList.add('hidden'));
document.getElementById('cancel-report-btn').addEventListener('click',() => reportModal.classList.add('hidden'));
reportModal.addEventListener('click', e => { if (e.target === reportModal) reportModal.classList.add('hidden'); });

// ── Submit alert ──────────────────────────────────────────────────────────
document.getElementById('submit-alert-btn').addEventListener('click', async () => {
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

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/alerts`, {
            method: 'POST',
            headers: { ...HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ type, severity, county, location, description: desc, reporter, contact: contact || null, status: 'pending' })
        });

        if (!res.ok) throw new Error('Failed to submit alert');

        ['alert-location','alert-desc','alert-name','alert-contact'].forEach(id => document.getElementById(id).value = '');
        reportModal.classList.add('hidden');
        showToast('✅ Alert submitted! It will appear after admin approval.');
        renderAlerts();
        if (adminLoggedIn) updateAdminList();

    } catch (err) {
        showToast('❌ Could not submit alert. Try again.', true);
    }
});

// ── Admin Modal ───────────────────────────────────────────────────────────
const adminModal = document.getElementById('admin-modal');
document.getElementById('open-admin-btn').addEventListener('click',  () => adminModal.classList.remove('hidden'));
document.getElementById('close-admin-btn').addEventListener('click', () => adminModal.classList.add('hidden'));
adminModal.addEventListener('click', e => { if (e.target === adminModal) adminModal.classList.add('hidden'); });

document.getElementById('admin-login-btn').addEventListener('click', () => {
    const pwd = document.getElementById('admin-password').value;
    if (pwd === 'flamingo2026') {
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

async function updateAdminList() {
    if (!adminLoggedIn) return;
    const listEl = document.getElementById('admin-alerts-list');
    listEl.innerHTML = '<div style="color:var(--muted);font-size:0.85rem;padding:1rem 0">Loading…</div>';

    try {
        const res    = await fetch(`${SUPABASE_URL}/rest/v1/alerts?select=*&status=eq.${currentAdminTab}&order=created_at.desc`, { headers: HEADERS });
        const alerts = await res.json();

        // Update pending badge
        const pendRes = await fetch(`${SUPABASE_URL}/rest/v1/alerts?select=id&status=eq.pending`, { headers: HEADERS });
        const pending = await pendRes.json();
        document.getElementById('pending-count').textContent = pending.length;

        if (!alerts.length) {
            listEl.innerHTML = `<div style="color:var(--muted);font-size:0.85rem;padding:1rem 0;font-style:italic">No ${currentAdminTab} alerts.</div>`;
            return;
        }

        listEl.innerHTML = alerts.map(a => `
            <div class="admin-alert-item">
                <div class="admin-alert-title">${TYPE_ICONS[a.type]} ${TYPE_LABELS[a.type]} — ${a.county} · ${SEV_LABELS[a.severity]}</div>
                <div class="admin-alert-meta">📍 ${a.location} &nbsp;·&nbsp; 🕐 ${timeAgo(a.created_at)} &nbsp;·&nbsp; 👤 ${a.reporter}</div>
                <div class="admin-alert-desc">${a.description}</div>
                <div class="admin-actions">
                    ${currentAdminTab === 'pending' ? `
                        <button class="approve-btn" onclick="moderateAlert(${a.id},'approved')">✅ Approve</button>
                        <button class="reject-btn"  onclick="moderateAlert(${a.id},'rejected')">❌ Reject</button>
                    ` : ''}
                    <button class="delete-btn" onclick="deleteAlert(${a.id})">🗑️ Delete</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        listEl.innerHTML = `<div style="color:var(--muted)">❌ Could not load admin data.</div>`;
    }
}

async function moderateAlert(id, status) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/alerts?id=eq.${id}`, {
            method: 'PATCH',
            headers: { ...HEADERS, 'Prefer': 'return=minimal' },
            body: JSON.stringify({ status })
        });
        renderAlerts();
        updateAdminList();
        showToast(status === 'approved' ? '✅ Alert approved and published!' : '❌ Alert rejected.');
    } catch (err) { showToast('❌ Action failed.', true); }
}

async function deleteAlert(id) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/alerts?id=eq.${id}`, {
            method: 'DELETE', headers: HEADERS
        });
        renderAlerts();
        updateAdminList();
        showToast('🗑️ Alert deleted.');
    } catch (err) { showToast('❌ Delete failed.', true); }
}

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.style.borderColor = isError ? 'rgba(224,92,122,0.4)' : 'rgba(90,163,104,0.4)';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ── Initial load ──────────────────────────────────────────────────────────
renderAlerts();