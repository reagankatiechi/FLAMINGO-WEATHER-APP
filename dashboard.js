const API_KEY = 'e991d096bfcd9a9b49e5efa6c9332058';
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

// ── Peace theme data ──────────────────────────────────────────────────────
const peaceChallenges = [
  'Introduce yourself to someone from a different community and learn one thing about their culture.',
  'Organize a 10-minute open dialogue session within your patrol about what peace means to each member.',
  'Plant a tree or clean a public space as a symbol of your commitment to a peaceful environment.',
  'Write a short message of unity and share it with a fellow scout or community member.',
  'Practice active listening — let someone share their story without interrupting. Reflect on what you heard.',
  'Create a small piece of art — a drawing, poem, or slogan — that promotes peace in your community.',
  'Read or share one story of a young peacemaker who made a difference in their community.',
];

function getCommunityPeaceIndex(weatherMain, temp, humidity) {
  const w = weatherMain.toLowerCase();
  if (w.includes('thunderstorm') || w.includes('tornado')) {
    return { score: '⛔ Not Ideal', suggestion: 'Severe weather — move all dialogue events and community meetings indoors. Safety first!' };
  }
  if (w.includes('rain') || temp >= 35 || temp <= 8) {
    return { score: '🟡 Fair', suggestion: 'Challenging conditions — consider indoor venues for peace forums and community dialogue sessions today.' };
  }
  if (w.includes('clear') && temp >= 18 && temp <= 30 && humidity < 75) {
    return { score: '🟢 Excellent', suggestion: 'Perfect weather for outdoor community dialogue, peace walks, tree planting drives, or open-air youth forums!' };
  }
  return { score: '🔵 Good', suggestion: 'Good conditions for community peace activities. A great day to host a dialogue session or inter-school peace forum.' };
}

function getPeaceActivity(weatherMain, temp) {
  const w = weatherMain.toLowerCase();
  if (w.includes('clear') && temp >= 20) return 'Outdoor peace walk, community tree planting, or an open-air inter-school dialogue forum.';
  if (w.includes('clear') && temp < 20)  return 'Flag ceremony with a peace pledge or outdoor patrol unity exercise.';
  if (w.includes('cloud'))  return 'Community service patrol, neighbourhood clean-up, or a peace mural painting project.';
  if (w.includes('rain'))   return 'Indoor peace dialogue workshop, conflict resolution training, or storytelling of peace heroes.';
  if (w.includes('drizzle'))return 'Short peace walk with rain gear, or an indoor youth empowerment session.';
  if (w.includes('thunder')) return 'Scout peace badge study, writing peace letters, or virtual dialogue sessions.';
  return 'Plan a community peace activity suited for today\'s weather conditions.';
}


const dateEl = document.getElementById('topbar-date');
dateEl.textContent = new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

// Init Leaflet map centered on Kenya (Kisii area)
const map = L.map('weather-map', { zoomControl: true }).setView([-0.6699, 34.7677], 6);

// Base tile layer (dark style)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  maxZoom: 18
}).addTo(map);

// Weather overlay layer
let weatherLayer = null;
let currentLayerName = 'temp_new';

function addWeatherLayer(layerName) {
  if (weatherLayer) map.removeLayer(weatherLayer);
  weatherLayer = L.tileLayer(
    `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${API_KEY}`,
    { opacity: 0.65, maxZoom: 18 }
  );
  weatherLayer.addTo(map);
  currentLayerName = layerName;
}
addWeatherLayer('temp_new');

// Map tab switching
document.querySelectorAll('.map-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.map-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    addWeatherLayer(btn.dataset.layer);
  });
});

// Search
document.getElementById('dash-search-btn').addEventListener('click', handleSearch);
document.getElementById('dash-city-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});

function handleSearch() {
  const city = document.getElementById('dash-city-input').value.trim();
  if (!city) return;
  fetchAndDisplay(city);
}

async function fetchAndDisplay(city) {
  try {
    // Current weather
    const res = await fetch(`${OWM_BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();

    // Pan map to city
    map.flyTo([data.coord.lat, data.coord.lon], 10, { duration: 1.5 });

    // Marker
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const marker = L.marker([data.coord.lat, data.coord.lon], {
      icon: L.divIcon({
        className: '',
        html: `<div style="background:rgba(26,43,28,0.92);border:2px solid #5BA368;border-radius:12px;padding:6px 10px;color:#EEF5EE;font-family:DM Sans,sans-serif;font-size:13px;font-weight:500;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,0.4)">
          <img src="${iconUrl}" width="28" style="vertical-align:middle;margin-right:4px">${Math.round(data.main.temp)}°C ${data.name}
        </div>`,
        iconAnchor: [60, 20]
      })
    }).addTo(map);

    // Dashboard city name
    document.getElementById('dash-city-name').textContent = `${data.name}, ${data.sys.country}`;

    // Sidebar details
    updateSidebar(data);

    // Peace panel
    const peaceIndex   = getCommunityPeaceIndex(data.weather[0].main, data.main.temp, data.main.humidity);
    const peaceAct     = getPeaceActivity(data.weather[0].main, data.main.temp);
    const todayChallenge = peaceChallenges[new Date().getDay() % peaceChallenges.length];
    document.getElementById('peace-index-score').textContent   = peaceIndex.score + ' — ' + peaceIndex.suggestion;
    document.getElementById('peace-activity-text').textContent = '🌍 ' + peaceAct;
    document.getElementById('dash-peace-challenge').textContent = '🤝 ' + todayChallenge;
    document.getElementById('peace-panel').style.display = 'block';

    // Hourly forecast
    fetchForecast(city);

  } catch (err) {
    document.getElementById('dash-city-name').textContent = 'City not found';
  }
}

function updateSidebar(d) {
  const sunrise = new Date(d.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  const sunset  = new Date(d.sys.sunset  * 1000).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
  const windKph = Math.round(d.wind.speed * 3.6);
  const iconUrl = `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`;

  document.getElementById('sidebar-details').innerHTML = `
    <div class="detail-city-name">${d.name}, ${d.sys.country}</div>
    <div class="detail-big-temp">
      <img src="${iconUrl}" width="48" style="margin-bottom:4px">
      <div class="temp-val">${Math.round(d.main.temp)}°C</div>
      <div class="temp-desc">${d.weather[0].description}</div>
    </div>
    ${row('🌡️ Feels Like', `${Math.round(d.main.feels_like)}°C`)}
    ${row('💧 Humidity', `${d.main.humidity}%`)}
    ${row('🌬️ Wind', `${windKph} km/h`)}
    ${row('📈 Pressure', `${d.main.pressure} hPa`)}
    ${row('☁️ Clouds', `${d.clouds.all}%`)}
    ${row('🌅 Sunrise', sunrise)}
    ${row('🌇 Sunset', sunset)}
    ${row('👁️ Visibility', d.visibility ? (d.visibility/1000).toFixed(1)+' km' : 'N/A')}
  `;

  // Render alerts
  renderAlerts(d);
}

function generateAlerts(d) {
  const alerts = [];
  const temp    = d.main.temp;
  const humidity= d.main.humidity;
  const windKph = d.wind.speed * 3.6;
  const weather = d.weather[0].main.toLowerCase();

  if (weather.includes('thunderstorm')) {
    alerts.push({ level:'red', icon:'⛈️', title:'Thunderstorm Warning', desc:'Dangerous lightning risk. Cancel all outdoor patrol activities immediately.' });
  }
  if (weather.includes('tornado')) {
    alerts.push({ level:'red', icon:'🌪️', title:'Tornado Warning', desc:'Seek strong shelter immediately. Do not attempt any outdoor movement.' });
  }
  if (temp >= 38) {
    alerts.push({ level:'red', icon:'🔥', title:'Extreme Heat Alert', desc:`${Math.round(temp)}°C detected. Extreme risk of heat stroke. Cancel outdoor activities.` });
  } else if (temp >= 33) {
    alerts.push({ level:'yellow', icon:'☀️', title:'High Heat Caution', desc:`${Math.round(temp)}°C — Ensure all scouts carry 2L+ water and rest frequently in shade.` });
  }
  if (temp <= 5) {
    alerts.push({ level:'red', icon:'❄️', title:'Cold Weather Alert', desc:`${Math.round(temp)}°C — Risk of hypothermia. Ensure proper layering and emergency shelter.` });
  } else if (temp <= 12) {
    alerts.push({ level:'yellow', icon:'🧥', title:'Cold Conditions', desc:`${Math.round(temp)}°C — Scouts should wear warm layers and windproof gear.` });
  }
  if (weather.includes('rain') || weather.includes('drizzle')) {
    alerts.push({ level:'yellow', icon:'🌧️', title:'Rain Alert', desc:'Wet conditions expected. Pack waterproof gear and secure campsite equipment.' });
  }
  if (windKph >= 50) {
    alerts.push({ level:'red', icon:'💨', title:'Strong Wind Warning', desc:`${Math.round(windKph)} km/h winds. Do not pitch tents in exposed areas. Seek sheltered ground.` });
  } else if (windKph >= 30) {
    alerts.push({ level:'yellow', icon:'🌬️', title:'Windy Conditions', desc:`${Math.round(windKph)} km/h winds. Secure loose equipment and avoid ridgelines.` });
  }
  if (humidity >= 85) {
    alerts.push({ level:'yellow', icon:'💧', title:'High Humidity Alert', desc:`${humidity}% humidity. Watch for heat exhaustion. Keep scouts hydrated and resting.` });
  }
  if (d.visibility && d.visibility <= 1000) {
    alerts.push({ level:'yellow', icon:'🌫️', title:'Low Visibility', desc:'Visibility below 1km. Use compass navigation and keep patrol groups together.' });
  }

  // All clear if no alerts
  if (alerts.length === 0) {
    alerts.push({ level:'green', icon:'✅', title:'All Clear — Ready to Scout!', desc:'Conditions are safe for outdoor patrol activities. Have a great expedition!' });
  }

  return alerts;
}

function renderAlerts(d) {
  const alerts = generateAlerts(d);
  document.getElementById('alerts-list').innerHTML = alerts.map(a => `
    <div class="alert-item ${a.level}">
      <span class="alert-icon">${a.icon}</span>
      <div>
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
      </div>
    </div>
  `).join('');
}


function row(label, value) {
  return `<div class="detail-row">
    <span class="detail-row-label">${label}</span>
    <span class="detail-row-value">${value}</span>
  </div>`;
}

async function fetchForecast(city) {
  try {
    const res = await fetch(`${OWM_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=8`);
    if (!res.ok) return;
    const data = await res.json();
    const strip = document.getElementById('forecast-strip');
    strip.innerHTML = data.list.map(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
      const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
      return `<div class="forecast-item">
        <span class="forecast-time">${time}</span>
        <img class="forecast-icon" src="${icon}" alt="${item.weather[0].description}">
        <span class="forecast-temp">${Math.round(item.main.temp)}°C</span>
        <span class="forecast-desc">${item.weather[0].description}</span>
      </div>`;
    }).join('');
  } catch(e) {}
}

// Places at Risk — key Kenyan & East African locations
const RISK_CITIES = [
  'Kisii', 'Nairobi', 'Mombasa', 'Nakuru', 'Eldoret',
  'Kisumu', 'Nyeri', 'Garissa', 'Lodwar', 'Malindi'
];

async function fetchPlacesAtRisk() {
  const grid = document.getElementById('risk-grid');
  grid.innerHTML = '<div class="risk-placeholder">Loading risk data…</div>';

  const results = await Promise.allSettled(
    RISK_CITIES.map(city =>
      fetch(`${OWM_BASE}/weather?q=${encodeURIComponent(city)},KE&appid=${API_KEY}&units=metric`)
        .then(r => r.json())
    )
  );

  const cards = results
    .filter(r => r.status === 'fulfilled' && r.value.cod === 200)
    .map(r => r.value);

  if (cards.length === 0) {
    grid.innerHTML = '<div class="risk-placeholder">Could not load risk data. Check your API key.</div>';
    return;
  }

  grid.innerHTML = cards.map(d => {
    const temp     = d.main.temp;
    const windKph  = d.wind.speed * 3.6;
    const humidity = d.main.humidity;
    const weather  = d.weather[0].main.toLowerCase();

    // Determine risk level and reason
    let level = 'green', badge = '✅ Safe', reason = 'Conditions are suitable for outdoor scouting activities.';

    if (weather.includes('thunderstorm') || weather.includes('tornado') || temp >= 38 || windKph >= 50 || temp <= 5) {
      level = 'red'; badge = '🔴 High Risk';
      if (weather.includes('thunderstorm')) reason = 'Active thunderstorm — dangerous lightning risk.';
      else if (weather.includes('tornado'))  reason = 'Tornado conditions — seek shelter immediately.';
      else if (temp >= 38)   reason = `Extreme heat at ${Math.round(temp)}°C — heat stroke risk.`;
      else if (windKph >= 50) reason = `Dangerous winds at ${Math.round(windKph)} km/h.`;
      else if (temp <= 5)    reason = `Near-freezing at ${Math.round(temp)}°C — hypothermia risk.`;
    } else if (weather.includes('rain') || weather.includes('drizzle') || temp >= 33 || windKph >= 30 || humidity >= 85 || temp <= 12) {
      level = 'yellow'; badge = '🟡 Caution';
      if (weather.includes('rain'))  reason = 'Rainfall — waterproof gear required for patrols.';
      else if (temp >= 33)   reason = `High heat at ${Math.round(temp)}°C — hydration critical.`;
      else if (windKph >= 30) reason = `Strong winds at ${Math.round(windKph)} km/h — secure equipment.`;
      else if (humidity >= 85) reason = `High humidity ${humidity}% — watch for heat exhaustion.`;
      else if (temp <= 12)   reason = `Cold at ${Math.round(temp)}°C — warm layering required.`;
    }

    return `
      <div class="risk-card risk-${level}">
        <div class="risk-card-top">
          <div>
            <div class="risk-city">${d.name}</div>
            <div class="risk-country">${d.sys.country}</div>
          </div>
          <span class="risk-badge ${level}">${badge}</span>
        </div>
        <div class="risk-temp">${Math.round(temp)}°C</div>
        <div class="risk-desc">${d.weather[0].description}</div>
        <div class="risk-details">
          <div class="risk-detail">💧 <span>${humidity}%</span></div>
          <div class="risk-detail">🌬️ <span>${Math.round(windKph)} km/h</span></div>
          <div class="risk-detail">☁️ <span>${d.clouds.all}%</span></div>
        </div>
        <div class="risk-reason ${level}">${reason}</div>
      </div>
    `;
  }).join('');
}

// Load Kisii on start + places at risk
fetchAndDisplay('Kisii');
fetchPlacesAtRisk();

// ── Auto-refresh every 15 minutes ──────────────────────────────────────────
const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
let lastSearchedCity = 'Kisii';
let countdownSeconds = REFRESH_INTERVAL_MS / 1000;

// Track the last searched city so auto-refresh updates the right one
const originalFetchAndDisplay = fetchAndDisplay;
window.fetchAndDisplay = async function(city) {
  lastSearchedCity = city;
  await originalFetchAndDisplay(city);
};

// Countdown display in topbar
function updateCountdown() {
  const min = String(Math.floor(countdownSeconds / 60)).padStart(2, '0');
  const sec = String(countdownSeconds % 60).padStart(2, '0');
  const el = document.getElementById('refresh-countdown');
  if (el) el.textContent = `Auto-refresh in ${min}:${sec}`;
  if (countdownSeconds > 0) {
    countdownSeconds--;
  } else {
    // Refresh data silently
    countdownSeconds = REFRESH_INTERVAL_MS / 1000;
    fetchAndDisplay(lastSearchedCity);
    fetchPlacesAtRisk();
  }
}

// Start countdown ticker every second
setInterval(updateCountdown, 1000);