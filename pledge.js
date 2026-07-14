// ── Supabase Configuration ────────────────────────────────────────────────
const SUPABASE_URL = 'https://vdhqqlsdirelvzimgdgd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaHFxbHNkaXJlbHZ6aW1nZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTczMzksImV4cCI6MjA5OTUzMzMzOX0.A-I8w8iWWDphwsFQ1Rh_Wbq9FCDbKsrC_ehQYVBiG60';
const HEADERS = { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` };

// ── Session ID for like tracking ──────────────────────────────────────────
let SESSION_ID = localStorage.getItem('flamingo_session');
if (!SESSION_ID) {
    SESSION_ID = 'sess_' + Math.random().toString(36).substr(2, 16) + Date.now();
    localStorage.setItem('flamingo_session', SESSION_ID);
}

// ── Counties ──────────────────────────────────────────────────────────────
const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'];

[document.getElementById('pledge-county'), document.getElementById('filter-county')].forEach(sel => {
    COUNTIES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        sel.appendChild(opt);
    });
});

// ── Track liked pledges locally ───────────────────────────────────────────
let likedPledges = JSON.parse(localStorage.getItem('flamingo_liked_pledges') || '[]');
function isLiked(id) { return likedPledges.includes(Number(id)); }
function saveLiked(id, liked) {
    if (liked)  likedPledges = [...new Set([...likedPledges, Number(id)])];
    else        likedPledges = likedPledges.filter(i => i !== Number(id));
    localStorage.setItem('flamingo_liked_pledges', JSON.stringify(likedPledges));
}

// ── Helpers ───────────────────────────────────────────────────────────────
function timeAgo(dateStr) {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
}
function getInitials(name) {
    return name.trim().split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}

// ── Supabase API helper ───────────────────────────────────────────────────
async function supabase(table, options = {}) {
    const { method = 'GET', filters = '', body = null, select = '*', order = 'created_at.desc' } = options;
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
    if (filters) url += `&${filters}`;
    if (order)   url += `&order=${order}`;

    const res = await fetch(url, {
        method,
        headers: {
            ...HEADERS,
            'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
        },
        body: body ? JSON.stringify(body) : null
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Supabase error');
    }
    return method === 'DELETE' || (method === 'PATCH' && !body) ? null : res.json();
}

// ── Render pledges ────────────────────────────────────────────────────────
async function renderPledges() {
    const search = document.getElementById('search-pledges').value.toLowerCase();
    const county = document.getElementById('filter-county').value;
    const sort   = document.getElementById('sort-pledges').value;
    const order  = sort === 'oldest' ? 'created_at.asc' : 'created_at.desc';
    const wall   = document.getElementById('pledge-wall');

    wall.innerHTML = `<div class="no-pledges">🕊️ Loading pledges…</div>`;

    try {
        let filters = '';
        if (county) filters += `&county=eq.${encodeURIComponent(county)}`;

        const pledges = await supabase('pledges', { filters: filters.replace(/^&/, ''), order });

        // Filter by search locally
        const filtered = search
            ? pledges.filter(p => p.name.toLowerCase().includes(search) || p.county.toLowerCase().includes(search) || p.message.toLowerCase().includes(search))
            : pledges;

        // Update stats
        const uniqueCounties = [...new Set(pledges.map(p => p.county))].length;
        document.getElementById('stat-total').textContent    = pledges.length;
        document.getElementById('stat-counties').textContent = uniqueCounties;
        document.getElementById('hero-count').textContent    = pledges.length;
        document.getElementById('hero-counties').textContent = uniqueCounties;

        if (filtered.length === 0) {
            wall.innerHTML = `<div class="no-pledges">🕊️ No pledges found.<br>Be the first to make your peace pledge!</div>`;
            return;
        }

        wall.innerHTML = filtered.map(p => `
            <div class="pledge-card" id="card-${p.id}">
                <div class="pledge-card-top">
                    <div class="pledge-avatar">${getInitials(p.name)}</div>
                    <div class="pledge-name-wrap">
                        <div class="pledge-name">${p.name}</div>
                        ${p.role ? `<div class="pledge-role">${p.role}</div>` : ''}
                    </div>
                    <span class="pledge-dove">🕊️</span>
                </div>
                <span class="pledge-county-badge">📍 ${p.county}</span>
                <div class="pledge-message">"${p.message}"</div>
                <div class="pledge-footer">
                    <span class="pledge-time">${timeAgo(p.created_at)}</span>
                    <button class="pledge-like-btn ${isLiked(p.id) ? 'liked' : ''}" onclick="toggleLike(${p.id}, ${p.likes})">
                        ${isLiked(p.id) ? '❤️' : '🤍'} ${p.likes}
                    </button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        wall.innerHTML = `<div class="no-pledges">❌ Could not load pledges.<br><small>${err.message}</small></div>`;
    }
}

// ── Like / Unlike ─────────────────────────────────────────────────────────
async function toggleLike(pledgeId, currentLikes) {
    try {
        if (isLiked(pledgeId)) {
            // Unlike — delete from pledge_likes
            await fetch(`${SUPABASE_URL}/rest/v1/pledge_likes?pledge_id=eq.${pledgeId}&session_id=eq.${SESSION_ID}`, {
                method: 'DELETE', headers: HEADERS
            });
            // Decrement likes
            await fetch(`${SUPABASE_URL}/rest/v1/pledges?id=eq.${pledgeId}`, {
                method: 'PATCH', headers: { ...HEADERS, 'Prefer': 'return=minimal' },
                body: JSON.stringify({ likes: Math.max(0, currentLikes - 1) })
            });
            saveLiked(pledgeId, false);
        } else {
            // Like — insert into pledge_likes
            await fetch(`${SUPABASE_URL}/rest/v1/pledge_likes`, {
                method: 'POST', headers: { ...HEADERS, 'Prefer': 'return=minimal' },
                body: JSON.stringify({ pledge_id: pledgeId, session_id: SESSION_ID })
            });
            // Increment likes
            await fetch(`${SUPABASE_URL}/rest/v1/pledges?id=eq.${pledgeId}`, {
                method: 'PATCH', headers: { ...HEADERS, 'Prefer': 'return=minimal' },
                body: JSON.stringify({ likes: currentLikes + 1 })
            });
            saveLiked(pledgeId, true);
        }
        renderPledges();
    } catch (err) {
        showToast('❌ Could not update like.', true);
    }
}

// ── Filters ───────────────────────────────────────────────────────────────
document.getElementById('search-pledges').addEventListener('input',  renderPledges);
document.getElementById('filter-county').addEventListener('change',  renderPledges);
document.getElementById('sort-pledges').addEventListener('change',   renderPledges);

// ── Modal ─────────────────────────────────────────────────────────────────
const modal = document.getElementById('pledge-modal');
document.getElementById('open-pledge-btn').addEventListener('click',  () => modal.classList.remove('hidden'));
document.getElementById('close-pledge-btn').addEventListener('click', () => modal.classList.add('hidden'));
document.getElementById('cancel-pledge-btn').addEventListener('click',() => modal.classList.add('hidden'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

const msgInput  = document.getElementById('pledge-message');
const charCount = document.getElementById('char-count');
msgInput.addEventListener('input', () => {
    const len = msgInput.value.length;
    charCount.textContent = len;
    charCount.parentElement.classList.toggle('over', len > 280);
});

// ── Submit pledge ─────────────────────────────────────────────────────────
document.getElementById('submit-pledge-btn').addEventListener('click', async () => {
    const name    = document.getElementById('pledge-name').value.trim();
    const county  = document.getElementById('pledge-county').value;
    const message = document.getElementById('pledge-message').value.trim();
    const role    = document.getElementById('pledge-role').value.trim();

    if (!name || !county || !message) {
        showToast('⚠️ Please fill in your Name, County and Pledge message.', true);
        return;
    }
    if (message.length > 280) {
        showToast('⚠️ Pledge must be 280 characters or less.', true);
        return;
    }

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/pledges`, {
            method: 'POST',
            headers: { ...HEADERS, 'Prefer': 'return=representation' },
            body: JSON.stringify({ name, county, message, role: role || null, likes: 0 })
        });

        if (!res.ok) throw new Error('Failed to submit pledge');

        ['pledge-name','pledge-message','pledge-role'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('pledge-county').value = '';
        charCount.textContent = '0';
        modal.classList.add('hidden');
        showToast('🕊️ Your peace pledge has been added to the wall!');
        renderPledges();

    } catch (err) {
        showToast('❌ Could not submit pledge. Try again.', true);
    }
});

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').textContent = msg;
    toast.style.borderColor = isError ? 'rgba(224,92,122,0.4)' : 'rgba(90,163,104,0.4)';
    toast.style.color       = isError ? '#F4A0A0' : '#7AE08A';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ── Initial load ──────────────────────────────────────────────────────────
renderPledges();