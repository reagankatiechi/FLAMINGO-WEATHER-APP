// ── Counties ──────────────────────────────────────────────────────────────
const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'];

// Populate county dropdowns
[document.getElementById('pledge-county'), document.getElementById('filter-county')].forEach((sel, i) => {
  COUNTIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    sel.appendChild(opt);
  });
});

// ── Seed pledges ──────────────────────────────────────────────────────────
const SEED_PLEDGES = [
  { id:'sp1', name:'Reagan Katiechi', county:'Kisii', role:'Rover Scout', message:'I pledge to be a voice of peace in my community. I will listen before I speak, understand before I judge, and always seek dialogue over conflict.', time:'2026-07-01T08:00:00', likes:12, liked:false },
  { id:'sp2', name:'Amina Hassan', county:'Nairobi', role:'Patrol Leader', message:'I pledge to empower every young person I meet to see peace not as a destination but as a daily practice. Together we are stronger.', time:'2026-07-01T09:15:00', likes:9, liked:false },
  { id:'sp3', name:'James Kipchoge', county:'Uasin Gishu', role:'Scout Master', message:'I pledge to use the skills of scouting to build bridges between communities. Where there is tension, I will bring understanding.', time:'2026-07-01T10:30:00', likes:15, liked:false },
  { id:'sp4', name:'Faith Akinyi', county:'Kisumu', role:'Rover Scout', message:'I pledge to promote peace in my school, my home, and my community. I will stand against hatred and champion the dignity of every person.', time:'2026-06-30T14:00:00', likes:7, liked:false },
  { id:'sp5', name:'Brian Mutua', county:'Machakos', role:'Scout', message:'I pledge to leave every place I visit more peaceful than I found it. Through service and dialogue, I will make my county proud.', time:'2026-06-30T11:00:00', likes:5, liked:false },
  { id:'sp6', name:'Grace Wanjiru', county:'Nyeri', role:'Rover Scout', message:'I pledge to listen to the stories of others, especially those different from me. In understanding their journey, I find the path to peace.', time:'2026-06-29T16:00:00', likes:11, liked:false },
];

// ── State ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'flamingo_pledges';

function loadPledges() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const userPledges = saved ? JSON.parse(saved) : [];
  const existingIds = userPledges.map(p => p.id);
  const seeds = SEED_PLEDGES.filter(s => !existingIds.includes(s.id));
  return [...seeds, ...userPledges];
}

function savePledges(pledges) {
  const userPledges = pledges.filter(p => !p.id.startsWith('sp'));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userPledges));
}

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function getInitials(name) {
  return name.trim().split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}

// ── Render ────────────────────────────────────────────────────────────────
function renderPledges() {
  const all         = loadPledges();
  const searchVal   = document.getElementById('search-pledges').value.toLowerCase();
  const countyFilter= document.getElementById('filter-county').value;
  const sortVal     = document.getElementById('sort-pledges').value;

  let filtered = all.filter(p => {
    const matchSearch  = p.name.toLowerCase().includes(searchVal) || p.county.toLowerCase().includes(searchVal) || p.message.toLowerCase().includes(searchVal);
    const matchCounty  = !countyFilter || p.county === countyFilter;
    return matchSearch && matchCounty;
  });

  filtered = filtered.sort((a,b) =>
    sortVal === 'newest'
      ? new Date(b.time) - new Date(a.time)
      : new Date(a.time) - new Date(b.time)
  );

  // Update stats
  const uniqueCounties = [...new Set(all.map(p => p.county))].length;
  document.getElementById('stat-total').textContent    = all.length;
  document.getElementById('stat-counties').textContent = uniqueCounties;
  document.getElementById('hero-count').textContent    = all.length;
  document.getElementById('hero-counties').textContent = uniqueCounties;

  const wall = document.getElementById('pledge-wall');

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
        <span class="pledge-time">${timeAgo(p.time)}</span>
        <button class="pledge-like-btn ${p.liked ? 'liked' : ''}" onclick="toggleLike('${p.id}')">
          ${p.liked ? '❤️' : '🤍'} ${p.likes}
        </button>
      </div>
    </div>
  `).join('');
}

// ── Like toggle ───────────────────────────────────────────────────────────
function toggleLike(id) {
  const all   = loadPledges();
  const pledge = all.find(p => p.id === id);
  if (!pledge) return;
  pledge.liked = !pledge.liked;
  pledge.likes += pledge.liked ? 1 : -1;
  savePledges(all);

  // Update seed likes in session
  const seed = SEED_PLEDGES.find(s => s.id === id);
  if (seed) { seed.liked = pledge.liked; seed.likes = pledge.likes; }

  renderPledges();
}

// ── Filters & search ──────────────────────────────────────────────────────
document.getElementById('search-pledges').addEventListener('input', renderPledges);
document.getElementById('filter-county').addEventListener('change', renderPledges);
document.getElementById('sort-pledges').addEventListener('change', renderPledges);

// ── Modal ─────────────────────────────────────────────────────────────────
const modal = document.getElementById('pledge-modal');
document.getElementById('open-pledge-btn').addEventListener('click',  () => modal.classList.remove('hidden'));
document.getElementById('close-pledge-btn').addEventListener('click', () => modal.classList.add('hidden'));
document.getElementById('cancel-pledge-btn').addEventListener('click',() => modal.classList.add('hidden'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });

// Character count
const msgInput = document.getElementById('pledge-message');
const charCount = document.getElementById('char-count');
msgInput.addEventListener('input', () => {
  const len = msgInput.value.length;
  charCount.textContent = len;
  charCount.parentElement.classList.toggle('over', len > 280);
});

// Submit pledge
document.getElementById('submit-pledge-btn').addEventListener('click', () => {
  const name    = document.getElementById('pledge-name').value.trim();
  const county  = document.getElementById('pledge-county').value;
  const message = document.getElementById('pledge-message').value.trim();
  const role    = document.getElementById('pledge-role').value.trim();

  if (!name || !county || !message) {
    showToast('⚠️ Please fill in your Name, County and Pledge message.', true);
    return;
  }
  if (message.length > 280) {
    showToast('⚠️ Pledge message must be 280 characters or less.', true);
    return;
  }

  const newPledge = {
    id: 'up' + Date.now(), name, county, role, message,
    time: new Date().toISOString(), likes: 0, liked: false
  };

  const all = loadPledges();
  all.unshift(newPledge);
  savePledges(all);

  // Clear form
  ['pledge-name','pledge-message','pledge-role'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pledge-county').value = '';
  charCount.textContent = '0';

  modal.classList.add('hidden');
  showToast('🕊️ Your peace pledge has been added to the wall!');
  renderPledges();
});

// ── Toast ─────────────────────────────────────────────────────────────────
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.style.borderColor = isError ? 'rgba(224,92,122,0.4)' : 'rgba(90,163,104,0.4)';
  toast.style.color = isError ? '#F4A0A0' : '#7AE08A';
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

// ── Initial render ────────────────────────────────────────────────────────
renderPledges();