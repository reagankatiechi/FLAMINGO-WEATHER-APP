// ── Supabase Configuration ────────────────────────────────────────────────
const SUPABASE_URL = 'https://vdhqqlsdirelvzimgdgd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkaHFxbHNkaXJlbHZ6aW1nZGdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTczMzksImV4cCI6MjA5OTUzMzMzOX0.A-I8w8iWWDphwsFQ1Rh_Wbq9FCDbKsrC_ehQYVBiG60';
const HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
};

// ── Counties ──────────────────────────────────────────────────────────────
const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'];

const countySelect = document.getElementById('join-county');
COUNTIES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = c;
  countySelect.appendChild(opt);
});

// ── User state ────────────────────────────────────────────────────────────
let currentUser = null;
let realtimeChannel = null;
let messageIds = new Set();

// ── Helpers ───────────────────────────────────────────────────────────────
function getInitials(name) {
  return name.trim().split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
}

function isMyMessage(msg) {
  return msg.name === currentUser.name && msg.county === currentUser.county;
}

// ── Join chat ─────────────────────────────────────────────────────────────
document.getElementById('join-btn').addEventListener('click', () => {
  const name   = document.getElementById('join-name').value.trim();
  const county = document.getElementById('join-county').value;

  if (!name || !county) {
    alert('Please enter your name and select your county!');
    return;
  }

  currentUser = { name, county };
  localStorage.setItem('flamingo_chat_user', JSON.stringify(currentUser));

  document.getElementById('join-screen').classList.add('hidden');
  document.getElementById('chat-room').classList.remove('hidden');
  document.getElementById('user-display').textContent = `${name} · ${county}`;

  initChat();
});

// Check if user already joined before
const savedUser = localStorage.getItem('flamingo_chat_user');
if (savedUser) {
  try {
    const u = JSON.parse(savedUser);
    document.getElementById('join-name').value   = u.name;
    document.getElementById('join-county').value = u.county;
  } catch(e) {}
}

// Leave chat
document.getElementById('leave-btn').addEventListener('click', () => {
  localStorage.removeItem('flamingo_chat_user');
  if (realtimeChannel) realtimeChannel.unsubscribe();
  document.getElementById('chat-room').classList.add('hidden');
  document.getElementById('join-screen').classList.remove('hidden');
  document.getElementById('join-name').value   = '';
  document.getElementById('join-county').value = '';
  document.getElementById('messages-list').innerHTML = `
    <div class="chat-welcome">
      <div class="chat-welcome-icon">🕊️</div>
      <div class="chat-welcome-title">Welcome to the Flamingo Scout Chat Room!</div>
      <div class="chat-welcome-sub">A safe space for dialogue, coordination and community building.</div>
    </div>`;
  messageIds.clear();
  currentUser = null;
});

// ── Init chat ─────────────────────────────────────────────────────────────
async function initChat() {
  await loadMessages();
  subscribeToMessages();
  document.getElementById('msg-input').focus();
}

// ── Load last 50 messages ─────────────────────────────────────────────────
async function loadMessages() {
  try {
    const res  = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.asc&limit=50`, { headers: HEADERS });
    const msgs = await res.json();
    msgs.forEach(msg => appendMessage(msg, false));
    scrollToBottom();
  } catch (err) {
    console.error('Could not load messages:', err);
  }
}

// ── Append message to UI ──────────────────────────────────────────────────
function appendMessage(msg, animate = true) {
  if (messageIds.has(msg.id)) return;
  messageIds.add(msg.id);

  const list   = document.getElementById('messages-list');
  const welcome = list.querySelector('.chat-welcome');
  if (welcome) welcome.remove();

  const isMine = currentUser && isMyMessage(msg);
  const div    = document.createElement('div');
  div.className = `msg-bubble ${isMine ? 'mine' : 'others'}`;
  if (!animate) div.style.animation = 'none';

  div.innerHTML = `
    <div class="msg-avatar">${getInitials(msg.name)}</div>
    <div class="msg-content">
      <div class="msg-name-county">${isMine ? 'You' : msg.name} · ${msg.county}</div>
      <div class="msg-text">${escapeHTML(msg.message)}</div>
      <div class="msg-time">${formatTime(msg.created_at)}</div>
    </div>
  `;

  list.appendChild(div);
  if (animate) scrollToBottom();
}

// ── Escape HTML to prevent XSS ────────────────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Subscribe to realtime messages ────────────────────────────────────────
function subscribeToMessages() {
  // Use Supabase Realtime via WebSocket
  const wsUrl = `${SUPABASE_URL.replace('https','wss')}/realtime/v1/websocket?apikey=${SUPABASE_KEY}&vsn=1.0.0`;
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    // Join the realtime channel
    socket.send(JSON.stringify({
      topic: 'realtime:public:messages',
      event: 'phx_join',
      payload: { config: { broadcast: { self: true }, presence: { key: '' } } },
      ref: '1'
    }));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.event === 'INSERT' && data.payload?.record) {
        const msg = data.payload.record;
        appendMessage(msg, true);
      }
    } catch (e) {}
  };

  socket.onclose = () => {
    // Reconnect after 3 seconds if disconnected
    setTimeout(() => {
      if (currentUser) subscribeToMessages();
    }, 3000);
  };

  realtimeChannel = socket;

  // Heartbeat every 30 seconds to keep connection alive
  setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: '0' }));
    }
  }, 30000);
}

// ── Send message ──────────────────────────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById('msg-input');
  const text  = input.value.trim();

  if (!text || !currentUser) return;
  if (text.length > 500) return;

  input.value = '';
  document.getElementById('msg-char').textContent = '0/500';

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        name:    currentUser.name,
        county:  currentUser.county,
        message: text
      })
    });
  } catch (err) {
    console.error('Failed to send message:', err);
    // Re-add text to input if failed
    input.value = text;
  }
}

// Send on button click or Enter
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('msg-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Character counter
document.getElementById('msg-input').addEventListener('input', function() {
  document.getElementById('msg-char').textContent = `${this.value.length}/500`;
});

// ── Scroll to bottom ──────────────────────────────────────────────────────
function scrollToBottom() {
  const wrap = document.querySelector('.messages-wrap');
  wrap.scrollTop = wrap.scrollHeight;
}