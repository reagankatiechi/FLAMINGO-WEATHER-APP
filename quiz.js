// ── Counties ──────────────────────────────────────────────────────────────
const COUNTIES = ['Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera','Marsabit','Meru','Migori','Mombasa',"Murang'a",'Nairobi','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'];

const countySelect = document.getElementById('player-county');
COUNTIES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = c;
  countySelect.appendChild(opt);
});

// ── Question Bank (45 questions, 15 picked randomly each round) ───────────
const ALL_QUESTIONS = [
  // KSA 2026
  { category:'🕊️ KSA 2026', q:'What is the Kenya Scouts Association theme for 2026?', options:['Building Scout Skills for the Future','Empowering young people to promote dialogue and peaceful communities','Scouting for Environmental Conservation','Unity in Diversity for National Development'], correct:1, explanation:'The KSA 2026 theme focuses on empowering youth to promote dialogue and build peaceful communities across Kenya.' },
  { category:'🕊️ KSA 2026', q:'What does "dialogue" mean in the context of the KSA 2026 theme?', options:['Debating to win an argument','Open and respectful conversation to understand different views','Keeping silent to avoid conflict','Writing letters to leaders'], correct:1, explanation:'Dialogue in peacebuilding means having open, respectful conversations where all parties listen and seek to understand each other.' },
  { category:'🕊️ KSA 2026', q:'Which UN Sustainable Development Goal is most aligned with the KSA 2026 peace theme?', options:['SDG 4 — Quality Education','SDG 13 — Climate Action','SDG 16 — Peace, Justice and Strong Institutions','SDG 8 — Decent Work'], correct:2, explanation:'SDG 16 promotes peaceful and inclusive societies, access to justice and strong institutions — directly aligned with KSA 2026.' },
  { category:'🕊️ KSA 2026', q:'What is the primary role of young scouts in promoting peaceful communities?', options:['Reporting conflicts to police only','Serving as role models and active peacebuilders in their communities','Avoiding all areas of conflict','Focusing only on academic excellence'], correct:1, explanation:'Scouts are uniquely positioned to be role models who actively promote peace, dialogue and community harmony.' },
  { category:'🕊️ KSA 2026', q:'Which skill is MOST important for promoting dialogue according to KSA 2026 values?', options:['Public speaking','Active listening','Fast reading','Computer skills'], correct:1, explanation:'Active listening — truly hearing and understanding others — is the foundation of effective dialogue and peacebuilding.' },
  { category:'🕊️ KSA 2026', q:'What does "empowering young people" mean in the KSA 2026 context?', options:['Giving youth political power','Providing youth with skills, confidence and platforms to make positive change','Training youth to become soldiers','Encouraging youth to leave Kenya'], correct:1, explanation:'Empowerment means equipping young people with the knowledge, skills and opportunities to drive positive change in their communities.' },
  { category:'🕊️ KSA 2026', q:'A scout patrol wants to promote the KSA 2026 theme. Which activity is BEST?', options:['Organising a running race','Hosting an inter-school peace dialogue forum','Planting trees only','Going on a camping trip'], correct:1, explanation:'An inter-school peace dialogue forum directly promotes the KSA 2026 theme by bringing youth together for dialogue and understanding.' },
  { category:'🕊️ KSA 2026', q:'What is conflict resolution?', options:['Winning a fight','Finding peaceful ways to end disagreements','Avoiding all contact with others','Reporting everyone to authorities'], correct:1, explanation:'Conflict resolution involves finding peaceful, mutually acceptable solutions to disagreements through dialogue and negotiation.' },

  // Scouting
  { category:'🏕️ Scouting', q:'What is the Scout Motto?', options:['Do Your Best','Always Ready','Be Prepared','Service First'], correct:2, explanation:'"Be Prepared" — coined by Lord Baden-Powell — means scouts should always be ready in mind and body for any duty.' },
  { category:'🏕️ Scouting', q:'Who founded the Scout Movement?', options:['Mahatma Gandhi','Robert Baden-Powell','Nelson Mandela','Jomo Kenyatta'], correct:1, explanation:'Lord Robert Baden-Powell founded the Scout Movement in 1907 in the United Kingdom, beginning with a camp on Brownsea Island.' },
  { category:'🏕️ Scouting', q:'What does the Scout Law say about honesty?', options:['A Scout is sometimes honest','A Scout is trustworthy','A Scout keeps secrets','A Scout only tells the truth to leaders'], correct:1, explanation:'The Scout Law states "A Scout is Trustworthy" — meaning a scout\'s word can always be relied upon.' },
  { category:'🏕️ Scouting', q:'What is the highest rank in the Kenya Scouts Association?', options:['Rover Scout','Eagle Scout','Presidential Scout Award','Chief Scout Award'], correct:2, explanation:'The Presidential Scout Award is the highest honour in the Kenya Scouts Association, awarded by the President of Kenya.' },
  { category:'🏕️ Scouting', q:'What does "Leave No Trace" mean in scouting?', options:['Never go outdoors','Minimise your environmental impact when in nature','Don\'t write your name anywhere','Hide all evidence of camp'],  correct:1, explanation:'"Leave No Trace" is a principle where scouts respect nature by leaving natural spaces exactly as they found them.' },
  { category:'🏕️ Scouting', q:'What is a Rover Scout?', options:['A scout aged 8-11','A scout aged 12-14','A young adult scout aged 18-25','A scout leader over 30'], correct:2, explanation:'Rover Scouts are young adults aged 18-25 who focus on community service and leadership development.' },
  { category:'🏕️ Scouting', q:'What is the Scout slogan?', options:['Be Prepared','Do a Good Turn Daily','Service Above Self','Always Ready'], correct:1, explanation:'"Do a Good Turn Daily" encourages scouts to perform at least one act of kindness or service to others every single day.' },
  { category:'🏕️ Scouting', q:'What does the fleur-de-lis symbol on the Scout badge represent?', options:['A flower of peace','A compass pointing north — truth, honour and service','The three promises of scouting','The three fingers of the scout sign'], correct:1, explanation:'The fleur-de-lis, used as a compass pointing north, represents the scouts always pointing toward truth, honour and service.' },
  { category:'🏕️ Scouting', q:'In scouting, what is a "patrol"?', options:['A police operation','A small group of 6-8 scouts who work together','A scout camp','A badge-earning activity'], correct:1, explanation:'A patrol is the basic unit of scouting — a small group of 6-8 scouts who work, learn and serve their community together.' },
  { category:'🏕️ Scouting', q:'What is the primary purpose of community service in scouting?', options:['To earn badges only','To give back to society and develop character through helping others','To get media attention','To fulfil school requirements'], correct:1, explanation:'Community service is central to scouting\'s mission of developing character while making a positive difference in society.' },
  { category:'🏕️ Scouting', q:'What year was the Kenya Scouts Association founded?', options:['1910','1920','1948','1963'], correct:0, explanation:'The Kenya Scouts Association was founded in 1910, making it one of the oldest scout organisations in East Africa.' },

  // Kenya History
  { category:'🇰🇪 Kenya History', q:'When did Kenya gain independence from Britain?', options:['12th December 1963','1st June 1960','12th December 1964','26th October 1964'], correct:0, explanation:'Kenya gained independence on 12th December 1963, a date celebrated as Jamhuri Day (Republic Day).' },
  { category:'🇰🇪 Kenya History', q:'Who was Kenya\'s first President?', options:['Daniel arap Moi','Oginga Odinga','Jomo Kenyatta','Tom Mboya'], correct:2, explanation:'Jomo Kenyatta became Kenya\'s first Prime Minister in 1963 and first President in 1964, serving until his death in 1978.' },
  { category:'🇰🇪 Kenya History', q:'What does "Harambee" mean in Swahili?', options:['Independence','Let\'s pull together','Peace and unity','Work hard'], correct:1, explanation:'"Harambee" means "let\'s pull together" — Kenya\'s national motto emphasising unity, community self-help and cooperation.' },
  { category:'🇰🇪 Kenya History', q:'How many counties does Kenya have?', options:['42','45','47','50'], correct:2, explanation:'Kenya has 47 counties, established under the 2010 Constitution to devolve power and resources to local communities.' },
  { category:'🇰🇪 Kenya History', q:'What is the capital city of Kenya?', options:['Mombasa','Nakuru','Kisumu','Nairobi'], correct:3, explanation:'Nairobi is Kenya\'s capital and largest city, also known as the "Green City in the Sun".' },
  { category:'🇰🇪 Kenya History', q:'What is the national language of Kenya?', options:['English only','Swahili only','Both English and Swahili','Kikuyu'], correct:2, explanation:'Kenya has two official national languages — Swahili (Kiswahili) and English, both used in government and education.' },
  { category:'🇰🇪 Kenya History', q:'What is the significance of Madaraka Day in Kenya?', options:['Kenya\'s independence from Britain','The day Kenya became a republic','The day Kenya gained internal self-governance','The day the constitution was signed'], correct:2, explanation:'Madaraka Day (1st June 1963) marks the day Kenya gained internal self-governance, a step before full independence.' },
  { category:'🇰🇪 Kenya History', q:'Who was the first woman in Africa to win the Nobel Peace Prize?', options:['Grace Ogot','Wangari Maathai','Charity Ngilu','Phoebe Asiyo'], correct:1, explanation:'Prof. Wangari Maathai won the Nobel Peace Prize in 2004 for her contribution to sustainable development, democracy and peace.' },
  { category:'🇰🇪 Kenya History', q:'What is the name of Kenya\'s constitution introduced in 2010?', options:['The Bomas Constitution','The Lancaster Constitution','The Constitution of Kenya 2010','The Nairobi Constitutional Agreement'], correct:2, explanation:'The Constitution of Kenya 2010 replaced the 1969 constitution and introduced devolution, a Bill of Rights and other reforms.' },
  { category:'🇰🇪 Kenya History', q:'What is the name of the Kenya national anthem\'s first line?', options:['Oh Kenya we love you','Ee Mungu nguvu yetu','Kenya ni nchi yetu','Nakupenda Kenya'], correct:1, explanation:'The Kenya national anthem begins with "Ee Mungu nguvu yetu" meaning "O God of all creation" in Swahili.' },

  // Peace & Dialogue
  { category:'🌍 Peace & Dialogue', q:'What is the United Nations peacekeeping mission called?', options:['UN Peace Force','UN Blue Helmets','UN Defence Army','UN Global Soldiers'], correct:1, explanation:'UN Peacekeepers are called "Blue Helmets" due to their distinctive blue helmets and berets worn during missions.' },
  { category:'🌍 Peace & Dialogue', q:'What does "mediation" mean in conflict resolution?', options:['Fighting until one side wins','A third party helping two sides reach agreement','Ignoring the conflict','Reporting to police'], correct:1, explanation:'Mediation involves a neutral third party (mediator) helping conflicting parties communicate and reach a mutually acceptable solution.' },
  { category:'🌍 Peace & Dialogue', q:'What is the International Day of Peace observed on?', options:['1st January','21st September','16th November','10th December'], correct:1, explanation:'The International Day of Peace is observed on 21st September each year as a global day of non-violence and ceasefire.' },
  { category:'🌍 Peace & Dialogue', q:'What does "tolerance" mean in peacebuilding?', options:['Accepting everything without question','Respecting and accepting differences between people','Being passive in conflicts','Never disagreeing with anyone'], correct:1, explanation:'Tolerance means respecting and accepting people\'s differences — in culture, religion, opinion — as essential to peaceful coexistence.' },
  { category:'🌍 Peace & Dialogue', q:'Which of these is a NON-VIOLENT way to resolve a community conflict?', options:['Organising a protest march','Starting a dialogue forum with community leaders','Spreading rumours online','Ignoring the problem'], correct:1, explanation:'Community dialogue forums bring stakeholders together to discuss issues openly and find peaceful, collective solutions.' },
  { category:'🌍 Peace & Dialogue', q:'What is "social cohesion"?', options:['A type of building material','The bond that holds communities together through shared values and trust','Political unity only','Economic equality'], correct:1, explanation:'Social cohesion refers to the strength of relationships and the sense of solidarity among members of a community.' },
  { category:'🌍 Peace & Dialogue', q:'Who said "Peace is not the absence of conflict but the presence of creative alternatives for responding to conflict"?', options:['Nelson Mandela','Kofi Annan','Dorothy Thompson','Martin Luther King Jr.'], correct:2, explanation:'Dorothy Thompson articulated this important distinction — true peace requires active, creative engagement with conflict, not just its absence.' },
  { category:'🌍 Peace & Dialogue', q:'What is "restorative justice"?', options:['Punishing offenders harshly','Focusing on repairing harm through cooperative processes involving all stakeholders','Sending all criminals to prison','Ignoring past wrongs'], correct:1, explanation:'Restorative justice focuses on repairing harm caused by crime/conflict, involving victims, offenders and communities in the healing process.' },
  { category:'🌍 Peace & Dialogue', q:'Martin Luther King Jr. is famous for which method of promoting peace?', options:['Armed resistance','Non-violent civil disobedience','Political campaigning','Economic boycotts only'], correct:1, explanation:'Dr. King championed non-violent civil disobedience — peaceful protest, marches and civil resistance — to fight injustice and promote equality.' },
  { category:'🌍 Peace & Dialogue', q:'What role do youth play in peacebuilding according to UN Resolution 2250?', options:['Youth should be seen not heard','Youth are vital partners in peace and security efforts','Youth should only focus on education','Youth should leave politics to adults'], correct:1, explanation:'UN Security Council Resolution 2250 (2015) recognised youth as vital partners — not just victims or perpetrators — in building peace and security.' },
  { category:'🌍 Peace & Dialogue', q:'What is a "peace ambassador"?', options:['A government official only','A person who actively promotes peace and dialogue in their community','A military general','A UN employee'], correct:1, explanation:'A peace ambassador is anyone — youth, community member, scout — who actively works to promote peace, dialogue and understanding around them.' },
];

// ── Rover Crews by County ─────────────────────────────────────────────────
const ROVER_CREWS = {
  'Kisii':           [{ name:'Flamingo Rover Crew', detail:'Kisii University' }, { name:'Suneka Rover Crew', detail:'Suneka Town' }, { name:'Nyanchwa Rover Crew', detail:'Nyanchwa' }],
  'Nairobi':         [{ name:'Nairobi Central Rover Crew', detail:'Nairobi CBD' }, { name:'Westlands Rover Crew', detail:'Westlands' }, { name:'Karen Rover Crew', detail:'Karen' }, { name:'Kasarani Rover Crew', detail:'Kasarani' }],
  'Mombasa':         [{ name:'Coastal Rover Crew', detail:'Mombasa CBD' }, { name:'Nyali Rover Crew', detail:'Nyali' }, { name:'Bamburi Rover Crew', detail:'Bamburi' }],
  'Kisumu':          [{ name:'Lake Victoria Rover Crew', detail:'Kisumu CBD' }, { name:'Kondele Rover Crew', detail:'Kondele' }, { name:'Maseno Rover Crew', detail:'Maseno University' }],
  'Nakuru':          [{ name:'Nakuru Rover Crew', detail:'Nakuru Town' }, { name:'Naivasha Rover Crew', detail:'Naivasha' }, { name:'Gilgil Rover Crew', detail:'Gilgil' }],
  'Eldoret':         [{ name:'Rift Valley Rover Crew', detail:'Eldoret Town' }, { name:'Langas Rover Crew', detail:'Langas' }, { name:'Kapseret Rover Crew', detail:'Kapseret' }],
  'Kakamega':        [{ name:'Kakamega Forest Rover Crew', detail:'Kakamega Town' }, { name:'Mumias Rover Crew', detail:'Mumias' }],
  'Nyeri':           [{ name:'Mount Kenya Rover Crew', detail:'Nyeri Town' }, { name:'Karatina Rover Crew', detail:'Karatina' }],
  'Machakos':        [{ name:'Machakos Rover Crew', detail:'Machakos Town' }, { name:'Athi River Rover Crew', detail:'Athi River' }],
  'Meru':            [{ name:'Meru Rover Crew', detail:'Meru Town' }, { name:'Nkubu Rover Crew', detail:'Nkubu' }],
  'Migori':          [{ name:'Migori Rover Crew', detail:'Migori Town' }, { name:'Rongo Rover Crew', detail:'Rongo' }],
  'Homa Bay':        [{ name:'Homa Bay Rover Crew', detail:'Homa Bay Town' }, { name:'Mbita Rover Crew', detail:'Mbita' }],
  'Kericho':         [{ name:'Tea Country Rover Crew', detail:'Kericho Town' }, { name:'Litein Rover Crew', detail:'Litein' }],
  'Kiambu':          [{ name:'Kiambu Rover Crew', detail:'Kiambu Town' }, { name:'Thika Rover Crew', detail:'Thika' }],
  'Nyamira':         [{ name:'Nyamira Rover Crew', detail:'Nyamira Town' }, { name:'Keroka Rover Crew', detail:'Keroka' }],
  'Bomet':           [{ name:'Bomet Rover Crew', detail:'Bomet Town' }, { name:'Sotik Rover Crew', detail:'Sotik' }],
  'Bungoma':         [{ name:'Bungoma Rover Crew', detail:'Bungoma Town' }, { name:'Webuye Rover Crew', detail:'Webuye' }],
  'Busia':           [{ name:'Busia Rover Crew', detail:'Busia Town' }],
  'Embu':            [{ name:'Embu Rover Crew', detail:'Embu Town' }],
  'Garissa':         [{ name:'Garissa Rover Crew', detail:'Garissa Town' }],
  'Isiolo':          [{ name:'Isiolo Rover Crew', detail:'Isiolo Town' }],
  'Kajiado':         [{ name:'Kajiado Rover Crew', detail:'Kajiado Town' }, { name:'Ngong Rover Crew', detail:'Ngong' }],
  'Kilifi':          [{ name:'Kilifi Rover Crew', detail:'Kilifi Town' }, { name:'Malindi Rover Crew', detail:'Malindi' }],
  'Kirinyaga':       [{ name:'Kirinyaga Rover Crew', detail:'Kerugoya' }],
  'Kitui':           [{ name:'Kitui Rover Crew', detail:'Kitui Town' }],
  'Kwale':           [{ name:'Kwale Rover Crew', detail:'Kwale Town' }],
  'Laikipia':        [{ name:'Laikipia Rover Crew', detail:'Nanyuki' }],
  'Lamu':            [{ name:'Lamu Rover Crew', detail:'Lamu Town' }],
  'Makueni':         [{ name:'Makueni Rover Crew', detail:'Wote' }],
  'Mandera':         [{ name:'Mandera Rover Crew', detail:'Mandera Town' }],
  'Marsabit':        [{ name:'Marsabit Rover Crew', detail:'Marsabit Town' }],
  "Murang'a":        [{ name:"Murang'a Rover Crew", detail:"Murang'a Town" }],
  'Nandi':           [{ name:'Nandi Rover Crew', detail:'Kapsabet' }],
  'Narok':           [{ name:'Narok Rover Crew', detail:'Narok Town' }, { name:'Masai Mara Rover Crew', detail:'Kilgoris' }],
  'Nyandarua':       [{ name:'Nyandarua Rover Crew', detail:'Ol Kalou' }],
  'Samburu':         [{ name:'Samburu Rover Crew', detail:'Maralal' }],
  'Siaya':           [{ name:'Siaya Rover Crew', detail:'Siaya Town' }],
  'Taita-Taveta':    [{ name:'Taita Rover Crew', detail:'Voi' }],
  'Tana River':      [{ name:'Tana Rover Crew', detail:'Hola' }],
  'Tharaka-Nithi':   [{ name:'Tharaka Rover Crew', detail:'Chuka' }],
  'Trans Nzoia':     [{ name:'Trans Nzoia Rover Crew', detail:'Kitale' }],
  'Turkana':         [{ name:'Turkana Rover Crew', detail:'Lodwar' }],
  'Uasin Gishu':     [{ name:'Uasin Gishu Rover Crew', detail:'Eldoret' }, { name:'Turbo Rover Crew', detail:'Turbo' }],
  'Vihiga':          [{ name:'Vihiga Rover Crew', detail:'Vihiga Town' }],
  'Wajir':           [{ name:'Wajir Rover Crew', detail:'Wajir Town' }],
  'West Pokot':      [{ name:'West Pokot Rover Crew', detail:'Kapenguria' }],
  'Baringo':         [{ name:'Baringo Rover Crew', detail:'Kabarnet' }],
  'Elgeyo-Marakwet': [{ name:'Elgeyo Rover Crew', detail:'Iten' }],
};


const BADGES = [
  { min:0,   max:44,  icon:'🎗️', title:'Peace Recruit',     sub:'Keep learning and trying!' },
  { min:45,  max:74,  icon:'🥉', title:'Peace Cadet',       sub:'Good effort, Scout!' },
  { min:75,  max:99,  icon:'🥈', title:'Peace Scout',       sub:'Well done, keep it up!' },
  { min:100, max:119, icon:'🥇', title:'Peace Champion',    sub:'Excellent performance!' },
  { min:120, max:150, icon:'🏆', title:'Peace Ambassador',  sub:'Outstanding! You are a true peace ambassador!' },
];

// ── State ─────────────────────────────────────────────────────────────────
let questions       = [];
let currentQ        = 0;
let score           = 0;
let correctCount    = 0;
let wrongAnswers    = [];
let timerInterval   = null;
let timeLeft        = 20;
let answered        = false;
let playerName      = '';
let playerCounty    = '';
let playerCrew      = '';

// ── Populate crew dropdown when county changes ────────────────────────────
document.getElementById('player-county').addEventListener('change', function() {
  const county   = this.value;
  const crewSel  = document.getElementById('player-crew');
  const crewCard = document.getElementById('crew-info-card');
  crewSel.innerHTML = '<option value="">— Select Rover Crew —</option>';
  crewCard.classList.add('hidden');
  crewSel.disabled = true;

  if (!county) return;

  const crews = ROVER_CREWS[county] || [{ name:`${county} Rover Crew`, detail:`${county} · Est. 2010`, icon:'🏕️' }];
  crews.forEach(c => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify(c);
    opt.textContent = `${c.icon} ${c.name}`;
    crewSel.appendChild(opt);
  });
  crewSel.disabled = false;

  // Auto select first crew
  if (crews.length === 1) {
    crewSel.selectedIndex = 1;
    showCrewInfo(crews[0]);
  }
});

document.getElementById('player-crew').addEventListener('change', function() {
  if (!this.value) { document.getElementById('crew-info-card').classList.add('hidden'); return; }
  const crew = JSON.parse(this.value);
  showCrewInfo(crew);
});

function showCrewInfo(crew) {
  document.getElementById('crew-info-icon').textContent   = crew.icon;
  document.getElementById('crew-info-name').textContent   = crew.name;
  document.getElementById('crew-info-detail').textContent = crew.detail;
  document.getElementById('crew-info-card').classList.remove('hidden');
}


function loadStats() {
  const highScore  = localStorage.getItem('quiz_high_score') || 0;
  const gamesPlayed= localStorage.getItem('quiz_games')     || 0;
  document.getElementById('sb-high-score').textContent = highScore;
  document.getElementById('sb-games').textContent      = gamesPlayed;

  // Load earned badges in topbar
  const earned = JSON.parse(localStorage.getItem('quiz_badges') || '[]');
  const wrap   = document.getElementById('topbar-badges');
  wrap.innerHTML = earned.map(b => `<span class="badge-pill">${b.icon} ${b.title}</span>`).join('');
}

// ── Start quiz ────────────────────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', () => {
  playerName   = document.getElementById('player-name').value.trim();
  playerCounty = document.getElementById('player-county').value;
  const crewVal= document.getElementById('player-crew').value;

  if (!playerName || !playerCounty) { alert('Please enter your name and select your county!'); return; }
  if (!crewVal) { alert('Please select your Rover Crew!'); return; }

  const crewObj = JSON.parse(crewVal);
  playerCrew = crewObj.name;

  // Pick 15 random questions
  questions    = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 15);
  currentQ     = 0;
  score        = 0;
  correctCount = 0;
  wrongAnswers = [];

  showScreen('screen-quiz');
  renderQuestion();
});

// ── Render question ───────────────────────────────────────────────────────
function renderQuestion() {
  const q = questions[currentQ];
  answered = false;

  // Progress
  document.getElementById('q-current').textContent = currentQ + 1;
  document.getElementById('q-progress-fill').style.width = `${((currentQ) / 15) * 100}%`;
  document.getElementById('q-score').textContent = score;
  document.getElementById('q-category').textContent = q.category;
  document.getElementById('q-question').textContent = q.q;

  // Options
  const letters = ['A','B','C','D'];
  document.getElementById('q-options').innerHTML = q.options.map((opt, i) => `
    <button class="quiz-option" onclick="selectAnswer(${i})" data-index="${i}">
      <span class="option-letter">${letters[i]}</span>
      ${opt}
    </button>
  `).join('');

  // Hide feedback and next
  document.getElementById('q-feedback').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');

  // Start timer
  startTimer();
}

// ── Timer ─────────────────────────────────────────────────────────────────
function startTimer() {
  timeLeft = 20;
  clearInterval(timerInterval);
  updateTimerUI();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) timeUp();
    }
  }, 1000);
}

function updateTimerUI() {
  const timerEl = document.getElementById('q-timer');
  const fillEl  = document.getElementById('q-timer-fill');
  timerEl.textContent = timeLeft;
  fillEl.style.width  = `${(timeLeft / 20) * 100}%`;
  timerEl.className   = 'quiz-timer' + (timeLeft <= 5 ? ' danger' : timeLeft <= 10 ? ' warning' : '');
  fillEl.style.background = timeLeft <= 5 ? '#E05C7A' : timeLeft <= 10 ? '#E6C840' : '#5BA368';
}

function timeUp() {
  answered = true;
  const q = questions[currentQ];
  showFeedback(false, null, q);
  wrongAnswers.push({ q: q.q, correct: q.options[q.correct] });

  // Highlight correct
  document.querySelectorAll('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('missed');
  });

  document.getElementById('next-btn').classList.remove('hidden');
}

// ── Select answer ─────────────────────────────────────────────────────────
function selectAnswer(index) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const q        = questions[currentQ];
  const isCorrect= index === q.correct;
  const timeBonus= Math.floor(timeLeft / 4); // bonus for speed

  // Disable all options
  document.querySelectorAll('.quiz-option').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    else if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  if (isCorrect) {
    const points = 10 + timeBonus;
    score += points;
    correctCount++;
    document.getElementById('q-score').textContent = score;
  } else {
    wrongAnswers.push({ q: q.q, correct: q.options[q.correct] });
  }

  showFeedback(isCorrect, index, q);
  document.getElementById('next-btn').classList.remove('hidden');
}

// ── Show feedback ─────────────────────────────────────────────────────────
function showFeedback(isCorrect, selectedIndex, q) {
  const feedback = document.getElementById('q-feedback');
  feedback.classList.remove('hidden');
  document.getElementById('feedback-icon').textContent        = isCorrect ? '✅' : selectedIndex === null ? '⏱️' : '❌';
  document.getElementById('feedback-text').textContent        = isCorrect ? 'Correct! Well done, Scout! 🎉' : selectedIndex === null ? 'Time\'s up! The correct answer was:' : `Not quite! The correct answer is: "${q.options[q.correct]}"`;
  document.getElementById('feedback-explanation').textContent = q.explanation;
  feedback.style.borderColor = isCorrect ? 'rgba(58,125,68,0.4)' : 'rgba(224,92,122,0.3)';
}

// ── Next question ─────────────────────────────────────────────────────────
document.getElementById('next-btn').addEventListener('click', () => {
  currentQ++;
  if (currentQ >= 15) {
    showResults();
  } else {
    renderQuestion();
  }
});

// ── Show results ──────────────────────────────────────────────────────────
function showResults() {
  showScreen('screen-results');

  const accuracy = Math.round((correctCount / 15) * 100);
  document.getElementById('results-score').textContent   = score;
  document.getElementById('res-correct').textContent     = correctCount;
  document.getElementById('res-wrong').textContent       = 15 - correctCount;
  document.getElementById('res-accuracy').textContent    = accuracy + '%';
  document.getElementById('results-player').textContent  = `${playerName} · ${playerCrew} · ${playerCounty}`;

  // Result icon & title
  const icons  = ['😔','😐','🙂','😊','🏆'];
  const titles = ['Keep Practising!','Good Effort!','Well Done!','Excellent!','Outstanding Peace Ambassador!'];
  const tier   = score < 45 ? 0 : score < 75 ? 1 : score < 100 ? 2 : score < 120 ? 3 : 4;
  document.getElementById('results-icon').textContent  = icons[tier];
  document.getElementById('results-title').textContent = titles[tier];

  // Badge
  const badge = BADGES.find(b => score >= b.min && score <= b.max);
  if (badge) {
    document.getElementById('badge-earned').classList.remove('hidden');
    document.getElementById('badge-icon').textContent  = badge.icon;
    document.getElementById('badge-title').textContent = badge.title;
    document.getElementById('badge-sub').textContent   = badge.sub;

    // Save badge
    const earned = JSON.parse(localStorage.getItem('quiz_badges') || '[]');
    if (!earned.find(b => b.title === badge.title)) {
      earned.push(badge);
      localStorage.setItem('quiz_badges', JSON.stringify(earned));
    }
  }

  // Wrong answers review
  const reviewEl = document.getElementById('review-section');
  if (wrongAnswers.length > 0) {
    reviewEl.innerHTML = `
      <div class="review-title">📝 Review — Questions You Missed</div>
      ${wrongAnswers.map(w => `
        <div class="review-item">
          <div class="review-q">❓ ${w.q}</div>
          <div class="review-correct">✅ Correct answer: ${w.correct}</div>
        </div>
      `).join('')}
    `;
  }

  // Save to leaderboard
  saveToLeaderboard(playerName, playerCounty, playerCrew, score, badge);

  // Update stats
  const prevHigh  = parseInt(localStorage.getItem('quiz_high_score') || 0);
  const games     = parseInt(localStorage.getItem('quiz_games') || 0) + 1;
  localStorage.setItem('quiz_high_score', Math.max(prevHigh, score));
  localStorage.setItem('quiz_games', games);
  loadStats();

  // Pre-generate certificate
  generateCertificate();
}

// ── Leaderboard ───────────────────────────────────────────────────────────
function saveToLeaderboard(name, county, crew, score, badge) {
  const board = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
  board.push({ name, county, crew, score, badge: badge?.icon || '🎗️', date: new Date().toLocaleDateString() });
  board.sort((a,b) => b.score - a.score);
  localStorage.setItem('quiz_leaderboard', JSON.stringify(board.slice(0, 20)));
}

function renderLeaderboard() {
  const board  = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
  const listEl = document.getElementById('lb-list');
  if (board.length === 0) {
    listEl.innerHTML = '<div class="lb-empty">🕊️ No scores yet. Be the first to play!</div>';
    return;
  }
  const rankClass = ['gold','silver','bronze'];
  listEl.innerHTML = board.map((entry, i) => `
    <div class="lb-item">
      <div class="lb-rank ${rankClass[i] || ''}">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</div>
      <div class="lb-info">
        <div class="lb-name">${entry.name}</div>
        <div class="lb-county">🏕️ ${entry.crew || 'Rover Crew'} · 📍 ${entry.county} · ${entry.date}</div>
      </div>
      <div class="lb-badge">${entry.badge}</div>
      <div class="lb-score">${entry.score}</div>
    </div>
  `).join('');
}

// ── Certificate generation ────────────────────────────────────────────────
function generateCertificate() {
  const badge    = BADGES.find(b => score >= b.min && score <= b.max);
  const accuracy = Math.round((correctCount / 15) * 100);
  const date     = new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });

  document.getElementById('cert-name').textContent        = playerName;
  document.getElementById('cert-crew-county').textContent = `${playerCrew} · ${playerCounty} County`;
  document.getElementById('cert-score').textContent       = score;
  document.getElementById('cert-accuracy').textContent    = accuracy + '%';
  document.getElementById('cert-correct').textContent     = correctCount;
  document.getElementById('cert-badge-icon').textContent  = badge?.icon || '🎗️';
  document.getElementById('cert-badge-name').textContent  = badge?.title || 'Peace Recruit';
  document.getElementById('cert-date').textContent        = `Issued on ${date}`;
  document.getElementById('certificate-wrap').classList.remove('hidden');
}

// Print certificate
document.getElementById('print-cert-btn').addEventListener('click', () => {
  generateCertificate();
  setTimeout(() => window.print(), 300);
});

// Download certificate as PDF using browser print to PDF
document.getElementById('download-cert-btn').addEventListener('click', () => {
  generateCertificate();

  // Use html2canvas + jsPDF approach via window.print with save dialog
  const cert     = document.getElementById('certificate');
  const original = document.body.innerHTML;

  // Open certificate in new window for download
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Peace Quiz Certificate - ${playerName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; padding: 0; background: white; }
        #certificate { width: 794px; min-height: 560px; background: white; font-family: 'DM Sans', sans-serif; color: #1a1a1a; margin: 0 auto; }
        .cert-border { margin: 20px; border: 6px double #3A7D44; padding: 30px; min-height: 520px; display: flex; flex-direction: column; gap: 12px; position: relative; }
        .cert-border::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(58,125,68,0.3); pointer-events: none; }
        .cert-header { text-align: center; border-bottom: 2px solid #3A7D44; padding-bottom: 14px; }
        .cert-logo { width: 70px; height: 70px; object-fit: contain; margin-bottom: 6px; }
        .cert-org { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: #3A7D44; }
        .cert-ksa { font-size: 0.78rem; color: #666; letter-spacing: 0.5px; margin-top: 3px; }
        .cert-body { text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px 0; }
        .cert-presents { font-size: 0.85rem; color: #555; font-weight: 300; }
        .cert-name { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 700; color: #1a1a1a; border-bottom: 2px solid #E6C840; padding-bottom: 4px; margin: 4px 0; }
        .cert-crew-county { font-size: 0.85rem; color: #3A7D44; font-weight: 500; }
        .cert-quiz-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #3A7D44; margin: 4px 0; }
        .cert-theme { font-size: 0.75rem; color: #666; font-style: italic; max-width: 420px; line-height: 1.5; }
        .cert-score-wrap { display: flex; gap: 20px; margin: 10px 0; }
        .cert-score-box { text-align: center; background: #f0faf2; border: 1px solid #c8e6c9; border-radius: 12px; padding: 10px 20px; min-width: 90px; }
        .cert-score-val { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: #3A7D44; line-height: 1; }
        .cert-score-label { font-size: 0.65rem; color: #666; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.4px; }
        .cert-badge-wrap { display: flex; align-items: center; gap: 8px; background: #fffde7; border: 1px solid #f9e79f; border-radius: 20px; padding: 8px 20px; margin: 4px 0; }
        .cert-badge-icon { font-size: 1.8rem; }
        .cert-badge-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: #b7950b; }
        .cert-footer { display: flex; justify-content: space-around; border-top: 1px solid #ddd; padding-top: 14px; margin-top: 8px; }
        .cert-sig-wrap { text-align: center; }
        .cert-sig-line { width: 160px; height: 1px; background: #333; margin: 0 auto 6px; }
        .cert-sig-name { font-size: 0.78rem; font-weight: 600; color: #1a1a1a; }
        .cert-sig-title { font-size: 0.68rem; color: #666; }
        .cert-date { text-align: center; font-size: 0.72rem; color: #888; }
        .cert-motto { text-align: center; font-size: 0.72rem; color: #3A7D44; font-style: italic; }
        .print-hint { text-align:center; padding: 10px; font-family: sans-serif; font-size: 0.85rem; color: #555; background: #f0faf2; }
      </style>
    </head>
    <body>
      <div class="print-hint">💡 To save as PDF: Press <strong>Ctrl+P</strong> → Change destination to <strong>"Save as PDF"</strong> → Click Save</div>
      ${cert.outerHTML}
      <script>
        window.onload = function() {
          document.querySelector('.print-hint').style.display = 'none';
          window.print();
        }
      </script>
    </body>
    </html>
  `);
  win.document.close();
});


function showScreen(id) {
  document.querySelectorAll('.quiz-screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// ── Button bindings ───────────────────────────────────────────────────────
document.getElementById('view-leaderboard-btn').addEventListener('click', () => { renderLeaderboard(); showScreen('screen-leaderboard'); });
document.getElementById('results-leaderboard-btn').addEventListener('click', () => { renderLeaderboard(); showScreen('screen-leaderboard'); });
document.getElementById('back-from-lb').addEventListener('click', () => showScreen('screen-welcome'));
document.getElementById('restart-btn').addEventListener('click', () => showScreen('screen-welcome'));

// ── Init ──────────────────────────────────────────────────────────────────
loadStats();