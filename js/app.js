/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — APP CORE v1.1
   Aplicación de monitoreo para Blanquita y sus 8 campeones
   ══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   DATA MODEL
   ══════════════════════════════════════════════ */

const PUPPY_DATA = [
  { id: 'blanquita', name: 'Blanquita', gender: 'F', role: 'mother', color: 'Blanco', avatar: '🐕', avatarBg: 'rgba(46,204,113,0.15)', avatarColor: '#2ecc71', notes: 'Madre de la camada. Semi-callejera del condominio.', birthDate: null },
  { id: 'max', name: 'Max', gender: 'M', role: 'puppy', color: 'Patrón Steel', avatar: '🐶', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'Líder del Bloque A. Tranquilo.', birthDate: '2026-05-23' },
  { id: 'steel', name: 'Steel', gender: 'M', role: 'puppy', color: 'Patrón Steel', avatar: '🐶', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'Parte del Bloque A. Tranquilo como Max.', birthDate: '2026-05-23' },
  { id: 'sydney', name: 'Sydney', gender: 'F', role: 'puppy', color: 'Marrón claro', avatar: '🐩', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'De quien se enamora Max. Bloque A. Hembra tranquila.', birthDate: '2026-05-23' },
  { id: 'arturo', name: 'Arturo', gender: 'M', role: 'puppy', color: 'Marrón oscuro', avatar: '🐶', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'Bloque B. Es de los más grandes y fuertes.', birthDate: '2026-05-23' },
  { id: 'travieso', name: 'Travieso', gender: 'M', role: 'puppy', color: 'Pequeño dominante', avatar: '🐕', avatarBg: 'rgba(224,184,92,0.15)', avatarColor: '#e0b85c', notes: 'EL MÁS PEQUEÑO. Prioridad máxima en alimentación. Bloque B — siempre en tetas traseras de Blanquita.', birthDate: '2026-05-23' },
  { id: 'chana', name: 'Chana', gender: 'F', role: 'puppy', color: 'Blanco con manchas', avatar: '🐩', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'Bloque B. Fuerte, come bien.', birthDate: '2026-05-23' },
  { id: 'alofoka', name: 'Alofoka', gender: 'F', role: 'puppy', color: 'Gris claro', avatar: '🐩', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'Bloque A. Tranquila.', birthDate: '2026-05-23' },
  { id: 'rodotesa', name: 'Rodotesa', gender: 'F', role: 'puppy', color: 'Marrón claro', avatar: '🐩', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'Le gusta rodar. Bloque B.', birthDate: '2026-05-23' }
];

const FEEDING_BLOCKS = {
  'A': { name: 'Bloque A — Los Líderes', members: ['max', 'steel', 'sydney', 'alofoka'], desc: 'Los más tranquilos' },
  'B': { name: 'Bloque B — Los Fuertes + Guerrero', members: ['arturo', 'chana', 'rodotesa', 'travieso'], desc: 'Travieso siempre en tetas traseras de Blanquita' }
};

const FEEDING_TIMES = [
  { time: '02:00', label: 'Madrugada' },
  { time: '06:00', label: 'Amanecer' },
  { time: '10:00', label: 'Media mañana' },
  { time: '14:00', label: 'Mediodía' },
  { time: '18:00', label: 'Tarde' },
  { time: '22:00', label: 'Noche' }
];

const MEDICAL_EVENTS = [
  { id: 'desp1', title: '1ra Desparasitación Interna', desc: 'Pamoato de Pirantel en jarabe. Pesar a cada cachorro para dosis exacta.', date: '2026-06-13', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'desp2', title: '2da Desparasitación Interna', desc: 'Repetir dosis de Pamoato de Pirantel.', date: '2026-06-28', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'vac1', title: '1ra Vacuna Puppy (Parvovirus + Moquillo)', desc: '¡LA MÁS IMPORTANTE! Vacuna puppy combinada.', date: '2026-07-07', type: 'vaccine', status: 'pending', forPuppies: true },
  { id: 'desp3', title: '3ra Desparasitación Interna', desc: 'Refuerzo de desparasitación oral.', date: '2026-07-13', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'desp4', title: '4ta Desparasitación Interna', desc: 'Última desparasitación oral programada.', date: '2026-07-28', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'vac2', title: '2da Vacuna Puppy (Refuerzo)', desc: 'Refuerzo de la vacuna puppy.', date: '2026-08-07', type: 'vaccine', status: 'pending', forPuppies: true },
  { id: 'rabia', title: 'Vacuna Antirrábica', desc: 'A partir de los 3 meses de edad.', date: '2026-08-23', type: 'vaccine', status: 'pending', forPuppies: true },
  { id: 'bath1', title: 'Primer Baño Oficial', desc: 'Los cachorros pueden bañarse con agua tibia a partir de los 2 meses. Usar champú suave.', date: '2026-07-23', type: 'bath', status: 'pending', forPuppies: true },
  { id: 'blanquita-check', title: 'Revisión Blanquita — Signos de Mastitis', desc: 'Revisar tetas: ¿calientes, duras o moradas? Signos de mastitis. Si presenta síntomas, llevar al veterinario URGENTE.', date: '2026-06-07', type: 'checkup', status: 'pending', forPuppies: false }
];

/* ===== BLANQUITA REAL FOOD ===== */

var BLANQUITA_WEIGHT_KG = 15.0;
var BLANQUITA_DAILY_FOOD_G = Math.round(BLANQUITA_WEIGHT_KG * 0.06 * 1000);

var RECIPES = {
  caldo: {
    id: 'caldo',
    name: 'S\u00faper Caldo Levantamuertos',
    icon: '\ud83c\udf72',
    color: '#e8a06e',
    desc: 'Caldo espeso de pollo, arroz y auyama para hidrataci\u00f3n y producci\u00f3n de leche.',
    ingredients: ['Pechuga o muslos de pollo (sin piel ni huesos)', 'Menudencias de pollo (h\u00edgado o molleja)', '1 taza de arroz blanco', 'Media calabaza (auyama) picada', 'Agua limpia'],
    steps: ['Coloca el pollo, la auyama en cubos y el arroz en una olla profunda.', 'Cubre con abundante agua limpia. PROHIBIDO: sal, ajo, cebolla o sazonadores.', 'Hierve a fuego medio hasta que el pollo est\u00e9 tierno y el arroz con la auyama se deshagan.', 'Desmenuza el pollo con dos tenedores, asegurando que no queden fragmentos duros.', 'Integra todo y sirve tibio.'],
    macros: { protein: '70% Pollo', carbs: '15% Arroz', fat: '15% Auyama' },
    benefit: 'Energ\u00eda inmediata e hidrataci\u00f3n para iniciar la producci\u00f3n de leche matutina.',
    warning: 'No uses sal, cebolla, ajo ni condimentos artificiales.'
  },
  pastel: {
    id: 'pastel',
    name: 'Pastel de Carne y Huevo',
    icon: '\ud83e\udd69',
    color: '#e05c5c',
    desc: 'Bomba de calcio y prote\u00edna densa con c\u00e1scara de huevo molida para prevenir eclampsia.',
    ingredients: ['Carne molida de res (o cerdo magro)', '2 huevos enteros', '1 taza de avena en hojuelas', 'Aceite de oliva (opcional)'],
    steps: ['Cocina la carne molida en una sart\u00e9n con apenas gotas de aceite de oliva.', 'Hierve los 2 huevos por separado.', 'Pela los huevos y TRITURA LAS C\u00c1SCARAS hasta hacerlas polvo blanco ultra fino (calcio puro).', 'Mezcla la carne cocida, el huevo duro picado, la avena hidratada y el polvo de c\u00e1scara.', 'Integra bien y sirve a temperatura ambiente.'],
    macros: { protein: '75% Res', carbs: '15% Avena', fat: '10% Huevo + C\u00e1scara' },
    benefit: 'Bomba de calcio y prote\u00edna densa para evitar la eclampsia postparto.',
    warning: 'La c\u00e1scara de huevo DEBE quedar como polvo fin\u00edsimo. Si quedan pedazos grandes pueden lastimar su garganta.'
  },
  sardinas: {
    id: 'sardinas',
    name: 'Banquete del Atl\u00e1ntico',
    icon: '\ud83d\udc1f',
    color: '#4dabf7',
    desc: 'Sardinas con pur\u00e9 de papa y zanahoria para Omega-3 y calcio.',
    ingredients: ['1 lata de sardinas en agua', 'Papas (patatas)', '1 zanahoria peque\u00f1a'],
    steps: ['Consigue sardinas enlatadas en agua. Si son en aceite, esc\u00farrelas y enju\u00e1galas.', 'Hierve papas y una zanahoria peque\u00f1a hasta que est\u00e9n completamente suaves.', 'Haz un pur\u00e9 r\u00fastico con la papa (sin leche ni mantequilla).', 'Ralla la zanahoria cocida.', 'Mezcla las sardinas enteras (con sus espinas blandas = calcio) con el pur\u00e9 y la zanahoria.'],
    macros: { protein: '70% Sardinas', carbs: '20% Papa', fat: '10% Zanahoria' },
    benefit: 'Omega-3 para desinflamar mamas y desarrollo cerebral de los cachorros.',
    warning: 'Si usas sardinas en aceite, esc\u00farrelas bien y p\u00e1sales agua para quitar el exceso de grasa.'
  },
  'caldo-ligero': {
    id: 'caldo-ligero',
    name: 'Refuerzo de Caldo Tibio',
    icon: '\u2615',
    color: '#c9a96e',
    desc: 'Caldo ligero de pollo para mantener la hidrataci\u00f3n durante la madrugada.',
    ingredients: ['Caldo de pollo (sin sal ni condimentos)', 'Carne de pollo desmenuzada (opcional)'],
    steps: ['Hierve el pollo en agua sin sal ni condimentos.', 'Cuela el caldo para obtener solo el l\u00edquido.', 'Desmenuza un poco de carne de pollo.', 'Sirve el caldo tibio con la carne desmenuzada.'],
    macros: { protein: '90% Caldo', carbs: '0%', fat: '10% Carne' },
    benefit: 'Mantener el flujo de l\u00edquidos durante la madrugada.',
    warning: 'Servir tibio, nunca caliente ni reci\u00e9n sacado de la nevera.'
  }
};

var BLANQUITA_MEAL_TIMES = [
  { time: '06:30', label: 'Desayuno', pct: 0.30, icon: '\u{1F305}' },
  { time: '12:30', label: 'Almuerzo', pct: 0.25, icon: '\u{1F344}' },
  { time: '18:30', label: 'Cena', pct: 0.30, icon: '\u{1F31F}' },
  { time: '22:30', label: 'Refuerzo Nocturno', pct: 0.15, icon: '\u{1F319}' }
];

var DAYS_ES = ['Domingo', 'Lunes', 'Martes', 'Mi\u00e9rcoles', 'Jueves', 'Viernes', 'S\u00e1bado'];

var BLANQUITA_MENU = {
  0: ['sardinas', 'caldo', 'pastel', 'caldo-ligero'],
  1: ['caldo', 'pastel', 'sardinas', 'caldo-ligero'],
  2: ['pastel', 'sardinas', 'caldo', 'caldo-ligero'],
  3: ['sardinas', 'pastel', 'caldo', 'caldo-ligero'],
  4: ['caldo', 'sardinas', 'pastel', 'caldo-ligero'],
  5: ['pastel', 'caldo', 'sardinas', 'caldo-ligero'],
  6: ['sardinas', 'pastel', 'caldo', 'caldo-ligero']
};

function getTodaysBlanquitaMenu() {
  var day = new Date().getDay();
  var menu = BLANQUITA_MENU[day];
  var result = [];
  for (var i = 0; i < BLANQUITA_MEAL_TIMES.length; i++) {
    var mt = BLANQUITA_MEAL_TIMES[i];
    var recipeId = menu[i];
    var recipe = RECIPES[recipeId];
    if (recipe) {
      result.push({
        time: mt.time,
        label: mt.label,
        icon: mt.icon,
        portion: Math.round(BLANQUITA_DAILY_FOOD_G * mt.pct),
        recipeId: recipeId,
        recipe: recipe
      });
    }
  }
  return result;
}

function getWeekMenu() {
  var week = [];
  var meals = BLANQUITA_MEAL_TIMES;
  for (var d = 0; d < 7; d++) {
    var dayRecipes = BLANQUITA_MENU[d];
    var dayMeals = [];
    for (var i = 0; i < meals.length; i++) {
      var mt = meals[i];
      var recipeId = dayRecipes[i];
      var recipe = RECIPES[recipeId];
      if (recipe) {
        dayMeals.push({
          time: mt.time,
          label: mt.label,
          icon: mt.icon,
          portion: Math.round(BLANQUITA_DAILY_FOOD_G * mt.pct),
          recipeId: recipeId,
          recipe: recipe
        });
      }
    }
    week.push({ day: d, dayName: DAYS_ES[d], meals: dayMeals });
  }
  return week;
}

function markBlanquitaMeal(timeStr, portion, notes) {
  var state = getAppState();
  var today = getToday();
  if (!state.blanquitaMeals) state.blanquitaMeals = {};
  if (!state.blanquitaMeals[today]) state.blanquitaMeals[today] = {};
  state.blanquitaMeals[today][timeStr] = {
    served: true,
    portion: portion || 0,
    notes: notes || '',
    timestamp: Date.now()
  };
  saveState();
}

function getBlanquitaMealStatus(timeStr) {
  var state = getAppState();
  var today = getToday();
  if (!state.blanquitaMeals || !state.blanquitaMeals[today]) return null;
  return state.blanquitaMeals[today][timeStr] || null;
}

function getBlanquitaMealsToday() {
  var state = getAppState();
  var today = getToday();
  if (!state.blanquitaMeals || !state.blanquitaMeals[today]) return {};
  return state.blanquitaMeals[today];
}

/* ===== APP STATE ===== */

const STORAGE_KEY = 'nexus_puppy_flow';

function getDefaultState() {
  return { weights: {}, feedings: {}, medicalStatus: {}, puppyNotes: {}, customEvents: [], customPuppies: [], customFeedingBlocks: {}, blanquitaMeals: {}, blanquitaReminders: { enabled: false, minutesBefore: 5 }, conversationHistory: [], lastUpdated: Date.now() };
}

let _appState = null;

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const def = getDefaultState();
      var state = { ...def, ...parsed };
      // Restore custom puppies into PUPPY_DATA
      if (state.customPuppies && state.customPuppies.length > 0) {
        restoreCustomPuppies(state);
      }
      return state;
    }
  } catch (e) {}
  return getDefaultState();
}

function restoreCustomPuppies(state) {
  // Check if custom puppies are already in PUPPY_DATA
  for (var ci = 0; ci < state.customPuppies.length; ci++) {
    var cid = state.customPuppies[ci];
    var exists = false;
    for (var pi = 0; pi < PUPPY_DATA.length; pi++) {
      if (PUPPY_DATA[pi].id === cid) { exists = true; break; }
    }
    if (!exists) {
      // Add a placeholder - user needs to edit via modal
      PUPPY_DATA.push({ id: cid, name: cid.charAt(0).toUpperCase() + cid.slice(1), gender: 'M', role: 'puppy', color: 'Desconocido', avatar: '\ud83d\udc36', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'Perro agregado por el usuario. Edita para completar datos.', birthDate: '2026-05-23' });
    }
  }
  // Restore custom feeding blocks
  if (state.customFeedingBlocks) {
    for (var blk in state.customFeedingBlocks) {
      if (FEEDING_BLOCKS[blk]) {
        for (var mi = 0; mi < state.customFeedingBlocks[blk].members.length; mi++) {
          var mem = state.customFeedingBlocks[blk].members[mi];
          if (FEEDING_BLOCKS[blk].members.indexOf(mem) < 0) {
            FEEDING_BLOCKS[blk].members.push(mem);
          }
        }
      }
    }
  }
}

function getAppState() {
  if (!_appState) _appState = loadState();
  return _appState;
}

function saveState() {
  try {
    const state = getAppState();
    state.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function resetAppState() {
  _appState = getDefaultState();
  saveState();
}

/* ===== THEME TOGGLE ===== */
const THEME_STORAGE_KEY = 'nexus_puppy_flow_theme';

function initTheme() {
  var saved = localStorage.getItem(THEME_STORAGE_KEY);
  var isDark = saved !== 'light';
  if (!isDark) document.body.classList.add('light-mode');
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isDark ? '\u2600\ufe0f' : '\ud83c\udf19';
}

function toggleTheme() {
  var isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isLight ? '\ud83c\udf19' : '\u2600\ufe0f';
}

/* ===== NAVIGATION ===== */

let currentSection = 'dashboard';
var _navHistory = [];

function navigateTo(section, skipHistory) {
  if (!skipHistory && currentSection !== section) {
    _navHistory.push(currentSection);
    if (_navHistory.length > 50) _navHistory.shift();
  }
  if (_dashTimer) { clearInterval(_dashTimer); _dashTimer = null; }
  if (_feedingTimer) { clearInterval(_feedingTimer); _feedingTimer = null; }
  currentSection = section;
  document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
  var target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var navItem = document.querySelector('.nav-item[data-section="' + section + '"]');
  if (navItem) navItem.classList.add('active');
  updateBackButton();
  var titles = { dashboard: ['Dashboard', 'Resumen general'], perfiles: ['Perfiles', 'Información individual'], pesos: ['Pesos', 'Registro de peso'], alimentacion: ['Alimentación', 'Horarios y bloques'], comidas: ['Comidas de Blanquita', 'Comida real y recetario'], 'bloque-a': ['Bloque A', 'Max, Steel, Sydney, Alofoka'], 'bloque-b': ['Bloque B', 'Arturo, Chana, Rodotesa, Travieso'], hembras: ['Hembras', 'Blanquita, Chana, Sydney, Alofoka, Rodotesa'], varones: ['Varones', 'Max, Steel, Arturo, Travieso'], medicina: ['Medicina', 'Calendario médico'], progresion: ['Progresión', 'Alimentación por semanas'], costos: ['Costos', 'Presupuesto de comidas'], contenido: ['Contenido', 'Exportar datos'] };
  var t = titles[section] || ['Nexus Puppy Flow', ''];
  var titleEl = document.getElementById('topbar-title');
  var breadEl = document.getElementById('topbar-breadcrumb');
  if (titleEl) titleEl.textContent = t[0];
  if (breadEl) breadEl.textContent = t[1];
  var sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('mobile-open');
  var overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.classList.remove('active');
  if (section === 'dashboard') renderDashboard();
  else if (section === 'perfiles') renderPerfiles();
  else if (section === 'pesos') renderPesos();
  else if (section === 'alimentacion') renderAlimentacion();
  else if (section === 'comidas') renderComidas();
  else if (section === 'bloque-a') renderBloqueA();
  else if (section === 'bloque-b') renderBloqueB();
  else if (section === 'hembras') renderHembras();
  else if (section === 'varones') renderVarones();
  else if (section === 'progresion') renderProgresion();
  else if (section === 'costos') renderCostos();
  else if (section === 'medicina') renderMedicina();
  else if (section === 'contenido') renderContenido();
}

function goBack() {
  if (_navHistory.length === 0) return;
  var prev = _navHistory.pop();
  if (prev) navigateTo(prev, true);
}

function updateBackButton() {
  var btn = document.getElementById('back-btn');
  if (!btn) return;
  btn.style.display = _navHistory.length > 0 ? 'flex' : 'none';
}

function toggleMobileMenu() {
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('mobile-open');
  var overlay = document.querySelector('.sidebar-overlay');
  if (sidebar.classList.contains('mobile-open')) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.onclick = toggleMobileMenu;
      document.body.appendChild(overlay);
    }
    setTimeout(function() { overlay.classList.add('active'); }, 10);
  } else {
    if (overlay) overlay.classList.remove('active');
  }
}

/* ===== MODAL ===== */

function openModal(title, bodyHTML, footerHTML) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML || '';
  document.getElementById('modal-footer').innerHTML = footerHTML || '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>';
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

document.addEventListener('click', function(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

/* ===== UTILITIES ===== */

/* ===== UNIVERSAL SEARCH ===== */

window._usActions = [];

function universalSearch(query) {
  var dropdown = document.getElementById('us-dropdown');
  var clearBtn = document.getElementById('us-clear');
  var q = query.trim().toLowerCase();
  if (clearBtn) clearBtn.style.display = q.length > 0 ? 'block' : 'none';
  if (!q || q.length < 2) { if (dropdown) dropdown.classList.remove('open'); return; }
  window._usActions = [];
  var MAX = 30;
  var results = [];
  for (var i = 0; i < PUPPY_DATA.length && results.length < MAX; i++) {
    var p = PUPPY_DATA[i];
    if (p.name.toLowerCase().includes(q) || p.color.toLowerCase().includes(q) || (p.notes||'').toLowerCase().includes(q)) {
      var idx = window._usActions.length;
      window._usActions.push(function(id) { return function() { closeUniversalSearch(); openPuppyDetail(id); }; }(p.id));
      results.push({ section: 'Perfiles', icon: p.avatar, iconBg: p.avatarBg, iconColor: p.avatarColor, title: p.name, subtitle: (p.role==='mother'?'Mam\u00e1':'Cachorro') + ' \u00b7 ' + p.color, actionIdx: idx, badge: 'Perfil' });
    }
  }
  for (var i = 0; i < FEEDING_TIMES.length && results.length < MAX; i++) {
    var ft = FEEDING_TIMES[i];
    if (ft.time.includes(q) || ft.label.toLowerCase().includes(q)) {
      var idx = window._usActions.length;
      window._usActions.push(function() { closeUniversalSearch(); navigateTo('alimentacion'); });
      results.push({ section: 'Alimentaci\u00f3n', icon: '\u23f0', iconBg: 'rgba(232,125,158,0.15)', iconColor: 'var(--pink)', title: ft.time + ' \u2014 ' + ft.label, subtitle: 'Bloques A y B', actionIdx: idx, badge: 'Horario' });
    }
  }
  if (!dropdown) return;
  if (results.length === 0) {
    dropdown.innerHTML = '<div class="us-dropdown-empty">No se encontraron resultados</div>';
    dropdown.classList.add('open'); return;
  }
  var html = '';
  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    html += '<div class="us-result-item" onclick="closeUniversalSearch();window._usActions[' + r.actionIdx + ']()"><div class="us-result-icon" style="background:' + r.iconBg + ';color:' + r.iconColor + ';">' + r.icon + '</div><div class="us-result-text"><div class="us-result-title">' + r.title + '</div><div class="us-result-sub">' + r.subtitle + '</div></div><span class="us-section-badge" style="background:var(--bg4);color:var(--muted2);">' + r.badge + '</span></div>';
  }
  dropdown.innerHTML = html;
  dropdown.classList.add('open');
}

function closeUniversalSearch() {
  var dropdown = document.getElementById('us-dropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function clearUniversalSearch() {
  var input = document.getElementById('us-input');
  var dropdown = document.getElementById('us-dropdown');
  var clearBtn = document.getElementById('us-clear');
  if (input) { input.value = ''; input.focus(); }
  if (dropdown) dropdown.classList.remove('open');
  if (clearBtn) clearBtn.style.display = 'none';
}

document.addEventListener('click', function(e) {
  var search = document.getElementById('us-container');
  var dropdown = document.getElementById('us-dropdown');
  if (search && dropdown && !search.contains(e.target)) dropdown.classList.remove('open');
});

function getToday() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function formatDate(dateStr) {
  var d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function daysUntil(dateStr) {
  var now = new Date(); now.setHours(0,0,0,0);
  var target = new Date(dateStr + 'T12:00:00');
  return Math.ceil((target - now) / (1000*60*60*24));
}

function puppyById(id) {
  return PUPPY_DATA.find(function(p) { return p.id === id; });
}

function getLatestWeight(puppyId) {
  var state = getAppState();
  var records = state.weights[puppyId] || [];
  if (records.length === 0) return null;
  var sorted = [].concat(records).sort(function(a,b) { return new Date(b.date) - new Date(a.date); });
  return sorted[0];
}

function getWeightHistory(puppyId) {
  var state = getAppState();
  var records = state.weights[puppyId] || [];
  return [].concat(records).sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
}

function getFeedingBlock(puppyId) {
  for (var block in FEEDING_BLOCKS) {
    if (FEEDING_BLOCKS[block].members.indexOf(puppyId) >= 0) return block;
  }
  return null;
}

function markFed(timeKey, blockName) {
  var state = getAppState();
  var today = getToday();
  if (!state.feedings[today]) state.feedings[today] = {};
  if (!state.feedings[today][timeKey]) state.feedings[today][timeKey] = {};
  state.feedings[today][timeKey][blockName] = true;
  state.feedings[today][timeKey].timestamp = Date.now();
  saveState();
}

function getNextFeedingTime() {
  var now = new Date();
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (var i = 0; i < FEEDING_TIMES.length; i++) {
    var ft = FEEDING_TIMES[i];
    var parts = ft.time.split(':');
    var ftMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    if (currentMinutes <= ftMinutes) return ft;
  }
  return FEEDING_TIMES[0];
}

function getTimeUntilNextFeeding() {
  var now = new Date();
  var next = getNextFeedingTime();
  var parts = next.time.split(':');
  var target = new Date(now);
  target.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  var diffMs = target - now;
  return { hours: Math.floor(diffMs/(1000*60*60)), minutes: Math.floor((diffMs%(1000*60*60))/(1000*60)), totalMs: diffMs };
}

function getCurrentFeedingTime() {
  var now = new Date();
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (var i = 0; i < FEEDING_TIMES.length; i++) {
    var ft = FEEDING_TIMES[i];
    var parts = ft.time.split(':');
    var ftMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    if (currentMinutes <= ftMinutes + 30) return ft;
  }
  return FEEDING_TIMES[0];
}

function isTimePast(timeStr) {
  var now = new Date();
  var parts = timeStr.split(':');
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  var ftMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  var diffMinutes = currentMinutes - ftMinutes;
  if (diffMinutes < -600) return true;
  return diffMinutes > 30;
}

function isCurrentTimeSlot(timeStr) {
  var now = new Date();
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  var parts = timeStr.split(':');
  var ftMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  return currentMinutes >= ftMinutes - 30 && currentMinutes <= ftMinutes + 30;
}

/* ===== GROWTH ANALYSIS (from WebTrendAnalyzer) ===== */

function calcMean(arr) {
  if (!arr || arr.length === 0) return 0;
  var sum = 0;
  for (var i = 0; i < arr.length; i++) sum += arr[i];
  return sum / arr.length;
}

function calcStdDev(arr) {
  if (arr.length < 2) return 0;
  var mean = calcMean(arr);
  var sq = 0;
  for (var i = 0; i < arr.length; i++) sq += (arr[i] - mean) * (arr[i] - mean);
  return Math.sqrt(sq / (arr.length - 1));
}

function movingAverage(data, windowSize) {
  if (windowSize === undefined) windowSize = 3;
  if (!data || data.length < windowSize) return [];
  var result = [];
  for (var i = 0; i <= data.length - windowSize; i++) {
    var sum = 0;
    for (var j = 0; j < windowSize; j++) sum += data[i + j];
    result.push(sum / windowSize);
  }
  return result;
}

function calcCAGR(data) {
  if (!data || data.length < 2) return 0;
  var initial = data[0];
  var final = data[data.length - 1];
  if (initial <= 0 || final <= 0) return 0;
  var periods = data.length - 1;
  var ratio = final / initial;
  if (ratio <= 0) return 0;
  return Math.pow(ratio, 1 / periods) - 1;
}

function forecastLinear(data, steps) {
  if (steps === undefined) steps = 5;
  if (!data || data.length < 2) return [];
  var n = data.length;
  var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (var i = 0; i < n; i++) {
    sumX += i; sumY += data[i]; sumXY += i * data[i]; sumX2 += i * i;
  }
  var denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return Array(steps).fill(data[data.length - 1]);
  var m = (n * sumXY - sumX * sumY) / denom;
  var b = (sumY - m * sumX) / n;
  var result = [];
  for (var i = 0; i < steps; i++) result.push(m * (n + i) + b);
  return result;
}

function analyzeWeightTrend(puppyId) {
  var history = getWeightHistory(puppyId);
  if (history.length < 2) return null;
  var values = history.map(function(r) { return r.value; });
  var mean = calcMean(values);
  var stdDev = calcStdDev(values);
  var cagr = calcCAGR(values);
  var ma3 = movingAverage(values, 3);
  var forecast = forecastLinear(values, 5);
  var min = Math.min.apply(null, values);
  var max = Math.max.apply(null, values);
  var latest = values[values.length - 1];
  var first = values[0];
  var totalGain = latest - first;
  var avgDailyGain = totalGain / (values.length - 1 || 1);
  var puppy = puppyById(puppyId);
  return {
    puppyId: puppyId,
    puppyName: puppy ? puppy.name : puppyId,
    dataPoints: values.length,
    latest: latest, first: first,
    mean: Math.round(mean), stdDev: Math.round(stdDev),
    cagr: (cagr * 100).toFixed(2) + '%', cagrRaw: cagr,
    min: min, max: max, totalGain: totalGain,
    avgDailyGain: avgDailyGain.toFixed(1),
    movingAverage: ma3.map(function(v) { return Math.round(v); }),
    forecast: forecast.map(function(v) { return Math.round(Math.max(0, v)); }),
    dates: history.map(function(r) { return r.date; })
  };
}

function analyzeAllPuppies() {
  var result = [];
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    if (p.id !== 'blanquita') {
      var analysis = analyzeWeightTrend(p.id);
      if (analysis) result.push(analysis);
    }
  }
  return result;
}

/* ===== DONUT CHART ===== */

var DONUT_COLORS = ['#4dabf7','#6ecfa5','#ff922b','#e05c5c','#b87de8','#f0c040','#5c8ce0','#e87d9e','#2ecc71','#ff6b8a','#7db8e8','#e8c96e','#5ce0dc','#e8a06e','#9e7de8','#4cad7c','#e05c8c','#c9a96e','#5c8ce0','#ff4444'];

function renderDonutChart(data, valueKey, labelKey, size, donutWidth) {
  if (size === undefined) size = 180;
  if (donutWidth === undefined) donutWidth = 32;
  if (!data || data.length === 0) return '<div style="font-size:11px;color:var(--muted2);text-align:center;padding:20px;">Sin datos</div>';
  var total = 0;
  for (var i = 0; i < data.length; i++) total += (data[i][valueKey] || 0);
  if (total === 0) return '<div style="font-size:11px;color:var(--muted2);text-align:center;padding:20px;">Sin datos</div>';
  var cx = size / 2, cy = size / 2;
  var radius = (size - donutWidth) / 2;
  var circumference = 2 * Math.PI * radius;
  var maxSlices = 8;
  var slices;
  if (data.length <= maxSlices) {
    slices = [].concat(data);
  } else {
    var top = data.slice(0, maxSlices - 1);
    var others = data.slice(maxSlices - 1);
    var othersSum = 0;
    for (var i = 0; i < others.length; i++) othersSum += (others[i][valueKey] || 0);
    var othersObj = {};
    othersObj[labelKey] = 'Otros';
    othersObj[valueKey] = othersSum;
    slices = top.concat([othersObj]);
  }
  var currentOffset = 0;
  var segments = [];
  for (var i = 0; i < slices.length; i++) {
    var d = slices[i];
    var val = d[valueKey] || 0;
    var pct = val / total;
    var length = pct * circumference;
    segments.push({ d: d, pct: pct, length: length, offset: currentOffset, color: DONUT_COLORS[i % DONUT_COLORS.length] });
    currentOffset += length;
  }
  var rotation = -90;
  var arcs = '';
  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];
    arcs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + radius + '" fill="none" stroke="' + seg.color + '" stroke-width="' + donutWidth + '" stroke-dasharray="' + seg.length + ' ' + (circumference - seg.length) + '" stroke-dashoffset="' + (-seg.offset) + '" transform="rotate(' + rotation + ' ' + cx + ' ' + cy + ')" opacity="0.92" />';
  }
  var totalShort = total >= 1000000 ? (total/1000000).toFixed(1)+'M' : total >= 1000 ? (total/1000).toFixed(1)+'K' : total.toFixed(0);
  var svg = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' + arcs + '<text x="' + cx + '" y="' + (cy-6) + '" text-anchor="middle" fill="var(--text)" font-size="' + (size*0.13) + '" font-weight="700" font-family="var(--mono)">' + totalShort + '</text><text x="' + cx + '" y="' + (cy+14) + '" text-anchor="middle" fill="var(--muted2)" font-size="' + (size*0.055) + '">total</text></svg>';
  var legend = '';
  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];
    var pctStr = (seg.pct * 100).toFixed(1) + '%';
    var label = seg.d[labelKey] || '';
    var shortLabel = label.length > 18 ? label.substring(0,16)+'\u2026' : label;
    var valStr = seg.d[valueKey] >= 1000000 ? (seg.d[valueKey]/1000000).toFixed(1)+'M' : seg.d[valueKey] >= 1000 ? (seg.d[valueKey]/1000).toFixed(0)+'K' : seg.d[valueKey].toFixed(0);
    legend += '<div style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:10px;color:var(--text2);"><span style="width:10px;height:10px;border-radius:3px;background:' + seg.color + ';flex-shrink:0;"></span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + shortLabel + '</span><span style="font-family:var(--mono);font-size:9px;color:var(--muted);">' + valStr + '</span><span style="font-family:var(--mono);font-size:9px;color:' + (seg.pct > 0.15 ? 'var(--success)' : 'var(--muted2)') + ';font-weight:600;">' + pctStr + '</span></div>';
  }
  return '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;"><div style="flex-shrink:0;">' + svg + '</div><div style="flex:1;min-width:140px;">' + legend + '</div></div>';
}

/* ===== CANVAS CHART ===== */

function renderWeightChart(canvasId, data, label, color) {
  var canvas = document.getElementById(canvasId);
  if (!canvas || !data || data.length < 2) return;
  var ctx = canvas.getContext('2d');
  var width = 600, height = 200;
  canvas.width = width;
  canvas.height = height;
  var padding = { top: 20, right: 20, bottom: 30, left: 55 };
  var chartW = width - padding.left - padding.right;
  var chartH = height - padding.top - padding.bottom;
  var values = data.map(function(d) { return d.value; });
  var minVal = Math.min.apply(null, values) * 0.95;
  var maxVal = Math.max.apply(null, values) * 1.05;
  var range = maxVal - minVal || 1;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  for (var i = 0; i <= 5; i++) {
    var y = padding.top + (chartH/5)*i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    var val = maxVal - (range/5)*i;
    ctx.fillStyle = '#5a5855';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(val) + 'g', padding.left - 8, y + 3);
  }
  ctx.strokeStyle = color || '#c9a96e';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (var i = 0; i < data.length; i++) {
    var x = padding.left + (i/(data.length-1))*chartW;
    var y = padding.top + chartH - ((data[i].value - minVal)/range)*chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = color ? color.replace(')', ',0.08)').replace('rgb','rgba') : 'rgba(201,169,110,0.08)';
  ctx.beginPath();
  for (var i = 0; i < data.length; i++) {
    var x = padding.left + (i/(data.length-1))*chartW;
    var y = padding.top + chartH - ((data[i].value - minVal)/range)*chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineTo(padding.left + chartW, height - padding.bottom);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.closePath();
  ctx.fill();
}

/* ===== RENDER: DASHBOARD (FUNNEL v2.0) ===== */

var _dashTimer = null;
var _feedingTimer = null;

function renderDashboard() {
  var state = getAppState();
  var today = getToday();
  var container = document.getElementById('dashboard-content');
  if (!container) return;

  // Data calculations
  var totalPuppies = PUPPY_DATA.length;
  var totalWeights = 0;
  for (var key in state.weights) totalWeights += state.weights[key].length;
  var todayFeedings = state.feedings[today] || {};
  var totalFeedsToday = 0;
  for (var key in todayFeedings) {
    var b = todayFeedings[key];
    if (b.blockA) totalFeedsToday++;
    if (b.blockB) totalFeedsToday++;
  }
  var allMedEvents = [].concat(MEDICAL_EVENTS);
  if (state.customEvents) {
    for (var i = 0; i < state.customEvents.length; i++) {
      var ce = state.customEvents[i];
      if (!state.medicalStatus[ce.id] || state.medicalStatus[ce.id] !== 'removed') allMedEvents.push(ce);
    }
  }
  var upcoming = allMedEvents.filter(function(e) {
    return daysUntil(e.date) >= -1 && state.medicalStatus[e.id] !== 'done';
  }).sort(function(a,b) { return daysUntil(a.date) - daysUntil(b.date); }).slice(0, 3);
  var weighted = [];
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    if (p.id !== 'blanquita') {
      var latest = getLatestWeight(p.id);
      if (latest) weighted.push({ p: p, latest: latest });
    }
  }
  var avgWeight = weighted.length > 0 ? Math.round(weighted.reduce(function(s,w) { return s + w.latest.value; }, 0) / weighted.length) : 0;
  var smallest = weighted.length > 0 ? weighted.reduce(function(min,w) { return w.latest.value < min.latest.value ? w : min; }, weighted[0]) : null;
  var largest = weighted.length > 0 ? weighted.reduce(function(max,w) { return w.latest.value > max.latest.value ? w : max; }, weighted[0]) : null;
  var nextFeed = getNextFeedingTime();
  var countdown = getTimeUntilNextFeeding();

  // Blanquita meals status
  var blanquitaMealsToday = state.blanquitaMeals?.[today] || {};
  var bmServed = 0, bmTotal = BLANQUITA_MEAL_TIMES.length;
  for (var bi = 0; bi < BLANQUITA_MEAL_TIMES.length; bi++) {
    if (blanquitaMealsToday[BLANQUITA_MEAL_TIMES[bi].time]?.served) bmServed++;
  }
  var hoursNow = new Date().getHours();
  var hoursSinceLastBlanquitaMeal = 0;
  for (var bi = BLANQUITA_MEAL_TIMES.length - 1; bi >= 0; bi--) {
    if (blanquitaMealsToday[BLANQUITA_MEAL_TIMES[bi].time]?.served) {
      var lastParts = BLANQUITA_MEAL_TIMES[bi].time.split(':');
      var lastMealDate = new Date();
      lastMealDate.setHours(parseInt(lastParts[0]), parseInt(lastParts[1]), 0, 0);
      hoursSinceLastBlanquitaMeal = Math.round((Date.now() - lastMealDate.getTime()) / (1000 * 60 * 60));
      break;
    }
  }

  var bmStatusColor, bmStatusIcon, bmStatusLabel, bmStatusSub;
  if (bmServed === 0 && hoursNow >= 7) {
    bmStatusColor = 'var(--danger)';
    bmStatusIcon = '\ud83d\udd34';
    bmStatusLabel = 'Sin comer';
    bmStatusSub = '\u00a1Urgente!';
  } else if (hoursSinceLastBlanquitaMeal > 6) {
    bmStatusColor = 'var(--danger)';
    bmStatusIcon = '\u26a0\ufe0f';
    bmStatusLabel = '>6h sin comer';
    bmStatusSub = '\u00daltima: hace ' + hoursSinceLastBlanquitaMeal + 'h';
  } else if (bmServed >= bmTotal) {
    bmStatusColor = 'var(--success)';
    bmStatusIcon = '\u2705';
    bmStatusLabel = 'Completo';
    bmStatusSub = bmServed + '/' + bmTotal;
  } else if (bmServed >= bmTotal / 2) {
    bmStatusColor = 'var(--warning)';
    bmStatusIcon = '\ud83d\udfe0';
    bmStatusLabel = 'Parcial';
    bmStatusSub = bmServed + '/' + bmTotal;
  } else {
    bmStatusColor = 'var(--danger)';
    bmStatusIcon = '\ud83d\udd34';
    bmStatusLabel = 'Pendiente';
    bmStatusSub = bmServed + '/' + bmTotal;
  }

  // ==================== BUILD FUNNEL HTML ====================

  var html = '';

  // 1. HERO ALERT (if urgent)
  if (bmServed === 0 && hoursNow >= 8) {
    var bm = getTodaysBlanquitaMenu();
    html += '<div class="funnel-alert">'
      + '<div class="funnel-alert-icon">\ud83d\udea8</div>'
      + '<div class="funnel-alert-body">'
      + '<div class="funnel-alert-title">\u00a1Blanquita no ha comido hoy!</div>'
      + '<div class="funnel-alert-sub">Prep\u00e1rale su primer plato: ' + (bm && bm[0] ? bm[0].recipe.name : 'Comida real') + '</div>'
      + '</div>'
      + '<button class="funnel-alert-btn" onclick="navigateTo(\'comidas\')">Ir a comidas \u2192</button>'
      + '</div>';
  }

  // 2. HERO SECTION
  html += '<div class="funnel-hero">'
    + '<div class="funnel-hero-eyebrow">CAMADA ACTIVA</div>'
    + '<div class="funnel-hero-value">' + totalPuppies + '</div>'
    + '<div class="funnel-hero-desc">' + (PUPPY_DATA.length-1) + ' cachorros \u00b7 1 madre</div>'
    + '<div class="funnel-hero-stats">'
    + '<span>' + totalWeights + ' registros</span>'
    + '<span class="dot">\u00b7</span>'
    + '<span>' + totalFeedsToday + ' alimentaciones hoy</span>'
    + '</div>'
    + '<div class="funnel-hero-metrics">'
    + '  <div class="funnel-hero-metric">'
    + '    <div class="funnel-metric-icon">\u2696\ufe0f</div>'
    + '    <div class="funnel-metric-value">' + (avgWeight > 0 ? avgWeight + 'g' : '\u2014') + '</div>'
    + '    <div class="funnel-metric-label">Peso Promedio</div>'
    + '  </div>'
    + '  <div class="funnel-hero-metric">'
    + '    <div class="funnel-metric-icon">\ud83c\udf7c</div>'
    + '    <div class="funnel-metric-value">' + totalFeedsToday + '/12</div>'
    + '    <div class="funnel-metric-label">Alimentaciones</div>'
    + '  </div>'
    + '  <div class="funnel-hero-metric" onclick="navigateTo(\'comidas\')" style="cursor:pointer;">'
    + '    <div class="funnel-metric-icon">\ud83c\udf72</div>'
    + '    <div class="funnel-metric-value" style="color:' + bmStatusColor + ';font-size:14px;">' + bmStatusIcon + ' ' + bmStatusLabel + '</div>'
    + '    <div class="funnel-metric-label">Blanquita</div>'
    + '  </div>'
    + '  <div class="funnel-hero-metric" onclick="navigateTo(\'medicina\')" style="cursor:pointer;">'
    + '    <div class="funnel-metric-icon">\ud83d\udc89</div>'
    + '    <div class="funnel-metric-value" style="font-size:13px;color:var(--info);">' + (upcoming.length > 0 ? upcoming[0].title.substring(0,22) + '\u2026' : 'Al d\u00eda') + '</div>'
    + '    <div class="funnel-metric-label">Pr\u00f3ximo M\u00e9dico</div>'
    + '  </div>'
    + '</div>'
    + '</div>';

  // 3. NEXT FEEDING SECTION
  html += '<div class="funnel-section">'
    + '<div class="funnel-section-header">'
    + '<div class="funnel-section-label">PR\u00d3XIMA ALIMENTACI\u00d3N</div>'
    + '<div class="funnel-section-cta" onclick="navigateTo(\'alimentacion\')">Ver horario completo \u2192</div>'
    + '</div>'
    + '<div class="funnel-feeding-card">'
    + '<div class="funnel-feeding-left">'
    + '<div class="funnel-feeding-icon">\ud83c\udf7c</div>'
    + '<div>'
    + '<div class="funnel-feeding-time">' + nextFeed.time + '</div>'
    + '<div class="funnel-feeding-label">' + nextFeed.label + '</div>'
    + '</div>'
    + '</div>'
    + '<div class="funnel-feeding-right">'
    + '<div class="funnel-feeding-countdown" id="dash-next-feed-countdown">en ' + countdown.hours + 'h ' + countdown.minutes + 'm</div>'
    + '<div class="funnel-feeding-sub">hasta pr\u00f3xima toma</div>'
    + '</div>'
    + '</div>'
    + '</div>';

  // 4. PUPPIES SECTION
  html += '<div class="funnel-section">'
    + '<div class="funnel-section-header">'
    + '<div class="funnel-section-label">RESUMEN DE LA CAMADA</div>'
    + '<div class="funnel-section-sub">' + weighted.length + '/' + (PUPPY_DATA.length-1) + ' con peso</div>'
    + '</div>'
    + '<div class="funnel-puppies-list">';

  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    var lw = getLatestWeight(p.id);
    var blk = getFeedingBlock(p.id);
    html += '<div class="funnel-puppy-row" onclick="navigateTo(\'perfiles\')">'
      + '<div class="funnel-puppy-avatar" style="background:' + p.avatarBg + ';color:' + p.avatarColor + ';">' + p.avatar + '</div>'
      + '<div class="funnel-puppy-info">'
      + '<div class="funnel-puppy-name">' + p.name + '</div>'
      + '<div class="funnel-puppy-role">' + (p.role === 'mother' ? 'Mam\u00e1' : 'Cachorro') + (p.role !== 'mother' ? ' \u00b7 ' + p.color : '') + '</div>'
      + '</div>'
      + (blk ? '<div class="funnel-puppy-block funnel-block-' + blk.toLowerCase() + '">Bloque ' + blk + '</div>' : '')
      + '<div class="funnel-puppy-weight">'
      + '<div class="funnel-puppy-weight-value">' + (lw ? lw.value + 'g' : '\u2014') + '</div>'
      + '<div class="funnel-puppy-weight-label">Peso</div>'
      + '</div>'
      + '<button class="funnel-puppy-btn" onclick="event.stopPropagation();navigateTo(\'perfiles\')">Ver \u2192</button>'
      + '</div>';
  }

  html += '</div></div>';

  // 5. STATS GRID
  html += '<div class="funnel-section">'
    + '<div class="funnel-section-header">'
    + '<div class="funnel-section-label">M\u00c9TRICAS CLAVE</div>'
    + '</div>'
    + '<div class="funnel-stats-grid">'
    + '<div class="funnel-stat-card">'
    + '<div class="funnel-stat-icon">\ud83c\udfc6</div>'
    + '<div class="funnel-stat-value" style="color:var(--success);">' + (largest ? largest.p.name : '\u2014') + '</div>'
    + '<div class="funnel-stat-label">M\u00e1s pesado</div>'
    + '<div class="funnel-stat-sub">' + (largest && largest.latest ? largest.latest.value + 'g' : '') + '</div>'
    + '</div>'
    + '<div class="funnel-stat-card">'
    + '<div class="funnel-stat-icon">\ud83d\udcaa</div>'
    + '<div class="funnel-stat-value" style="color:var(--warning);">' + (smallest ? smallest.p.name : '\u2014') + '</div>'
    + '<div class="funnel-stat-label">M\u00e1s peque\u00f1o</div>'
    + '<div class="funnel-stat-sub">' + (smallest && smallest.latest ? smallest.latest.value + 'g' : '') + '</div>'
    + '</div>'
    + '<div class="funnel-stat-card">'
    + '<div class="funnel-stat-icon">\ud83d\udcca</div>'
    + '<div class="funnel-stat-value" style="color:var(--accent);">' + totalWeights + '</div>'
    + '<div class="funnel-stat-label">Total Pesajes</div>'
    + '<div class="funnel-stat-sub">desde el inicio</div>'
    + '</div>'
    + '<div class="funnel-stat-card">'
    + '<div class="funnel-stat-icon">\ud83c\udfaf</div>'
    + '<div class="funnel-stat-value" style="color:var(--info);">' + (daysUntil('2026-05-23') * -1) + ' d\u00edas</div>'
    + '<div class="funnel-stat-label">Desde nacimiento</div>'
    + '<div class="funnel-stat-sub">~' + Math.round((daysUntil('2026-05-23')*-1)/7) + ' semanas</div>'
    + '</div>'
    + '</div>'
    + '</div>';

  // 6. MEDICAL ALERT
  if (upcoming.length > 0) {
    var d = daysUntil(upcoming[0].date);
    var cl = d <= 0 ? 'urgent' : 'warning';
    var icon = d <= 0 ? '\ud83d\udea8' : '\ud83d\udcc5';
    html += '<div class="funnel-section">'
      + '<div class="funnel-section-header">'
      + '<div class="funnel-section-label">PR\u00d3XIMO EVENTO M\u00c9DICO</div>'
      + '<div class="funnel-section-cta" onclick="navigateTo(\'medicina\')">Ver plan completo \u2192</div>'
      + '</div>'
      + '<div class="funnel-medical-card funnel-medical-' + cl + '">'
      + '<div class="funnel-medical-icon">' + icon + '</div>'
      + '<div class="funnel-medical-body">'
      + '<div class="funnel-medical-title">' + upcoming[0].title + '</div>'
      + '<div class="funnel-medical-date">' + formatDate(upcoming[0].date) + (d > 0 ? ' \u00b7 en ' + d + ' d\u00edas' : ' \u00b7 \u00a1HOY!') + '</div>'
      + '</div>'
      + '<button class="funnel-medical-btn" onclick="navigateTo(\'medicina\')">Ver \u2192</button>'
      + '</div>'
      + '</div>';
  }

  container.innerHTML = html;

  // Countdown timer
  if (_dashTimer) clearInterval(_dashTimer);
  _dashTimer = setInterval(function() {
    var cd = getTimeUntilNextFeeding();
    var el = document.getElementById('dash-next-feed-countdown');
    if (el) el.textContent = 'en ' + cd.hours + 'h ' + cd.minutes + 'm';
  }, 10000);
}

function generateGrowthAnalysisHTML() {
  var analyses = analyzeAllPuppies();
  if (analyses.length === 0) return 'Registra pesos para ver an\u00e1lisis';
  var sorted = [].concat(analyses).sort(function(a,b) { return b.cagrRaw - a.cagrRaw; });
  var fastest = sorted[0];
  var slowest = sorted[sorted.length - 1];
  var avgGain = 0;
  for (var i = 0; i < analyses.length; i++) avgGain += parseFloat(analyses[i].avgDailyGain);
  avgGain /= analyses.length;
  var tags = '';
  for (var i = 0; i < analyses.length; i++) {
    var a = analyses[i];
    tags += '<span style="font-size:10px;padding:3px 8px;border-radius:4px;background:var(--bg4);color:var(--text2);">' + a.puppyName + ': ' + a.latest + 'g (' + (a.totalGain > 0 ? '+' : '') + a.totalGain + 'g, ~' + a.avgDailyGain + 'g/d\u00eda)</span>';
  }
  return '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;"><div><strong>M\u00e1s r\u00e1pido:</strong> ' + fastest.puppyName + ' (~' + fastest.avgDailyGain + 'g/d\u00eda)</div><div><strong>M\u00e1s lento:</strong> ' + slowest.puppyName + ' (~' + slowest.avgDailyGain + 'g/d\u00eda)</div><div><strong>Promedio:</strong> ~' + avgGain.toFixed(1) + 'g/d\u00eda</div><div><strong>Proyecci\u00f3n:</strong> ' + (analyses.length > 0 ? Math.round(analyses[0].forecast.slice(0,3).reduce(function(s,v){return s+v;},0)/3)+'g' : '\u2014') + '</div></div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">' + tags + '</div>';
}

function generateWeightDonutHTML(weighted) {
  if (weighted.length < 2) return '';
  var donutData = [];
  for (var i = 0; i < weighted.length; i++) donutData.push({ name: weighted[i].p.name, weight: weighted[i].latest.value });
  return '<div class="stat-card" style="margin-bottom:20px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><span style="font-size:11px;color:var(--muted);text-transform:uppercase;">Distribuci\u00f3n de Pesos</span><span style="font-size:11px;color:var(--muted2);">' + weighted.length + ' cachorros</span></div>' + renderDonutChart(donutData, 'weight', 'name', 160, 28) + '</div>';
}

/* ===== RENDER: PERFILES ===== */

function renderPerfiles() {
  var container = document.getElementById('perfiles-content');
  if (!container) return;
  var html = '<div class="puppy-grid">';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    var lw = getLatestWeight(p.id);
    var state = getAppState();
    var notes = state.puppyNotes[p.id] || p.notes;
    html += '<div class="puppy-card" onclick="openPuppyDetail(\'' + p.id + '\')"><div class="puppy-card-header"><div class="puppy-avatar" style="background:' + p.avatarBg + ';color:' + p.avatarColor + ';">' + p.avatar + '</div><div class="puppy-info"><div class="puppy-name">' + p.name + '</div><div class="puppy-role">' + (p.role === 'mother' ? 'Mam\u00e1' : 'Cachorro') + ' \u00b7 ' + (p.gender === 'M' ? 'Macho' : 'Hembra') + '</div></div><span class="puppy-gender-badge ' + (p.role === 'mother' ? 'gender-mother' : p.gender === 'M' ? 'gender-male' : 'gender-female') + '">' + (p.role === 'mother' ? '\ud83d\udc51' : p.gender === 'M' ? '\u2642' : '\u2640') + '</span></div><div class="puppy-card-body"><div class="puppy-stat"><span class="puppy-stat-label">Color</span><span class="puppy-stat-value" style="color:var(--text2);font-family:var(--font);">' + p.color + '</span></div><div class="puppy-stat"><span class="puppy-stat-label">\u00daltimo peso</span><span class="puppy-stat-value">' + (lw ? lw.value + 'g' : '\u2014') + '</span></div><div class="puppy-stat"><span class="puppy-stat-label">Registros</span><span class="puppy-stat-value">' + getWeightHistory(p.id).length + '</span></div><div class="puppy-stat" style="border-bottom:none;padding-bottom:0;"><span class="puppy-stat-label">Notas</span><span class="puppy-stat-value" style="font-family:var(--font);font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + notes + '</span></div></div><div class="puppy-card-footer"><span class="puppy-tag" style="background:' + p.avatarBg + ';color:' + p.avatarColor + ';">Editar</span></div></div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function openPuppyDetail(puppyId) {
  var p = puppyById(puppyId);
  if (!p) return;
  var state = getAppState();
  var latest = getLatestWeight(puppyId);
  var history = getWeightHistory(puppyId);
  var notes = state.puppyNotes[puppyId] || p.notes;
  var block = getFeedingBlock(puppyId);
  var blockName = block ? FEEDING_BLOCKS[block].name : '\u2014';
  var tableRows = '';
  if (history.length > 0) {
    for (var i = history.length - 1; i >= 0; i--) {
      var r = history[i];
      var prev = i > 0 ? history[i-1] : null;
      var change = prev ? r.value - prev.value : 0;
      var changeStr = change > 0 ? '+' + change + 'g' : change < 0 ? change + 'g' : '\u2014';
      var changeColor = change > 0 ? 'var(--success)' : change < 0 ? 'var(--danger)' : 'var(--muted)';
      tableRows += '<tr><td>' + formatDate(r.date) + '</td><td class="r">' + r.value + 'g</td><td class="r" style="color:' + changeColor + ';">' + changeStr + '</td></tr>';
    }
  }
  var bodyHTML = '<div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;background:var(--bg3);border-radius:var(--radius2);padding:16px;"><div class="puppy-avatar" style="width:64px;height:64px;border-radius:16px;background:' + p.avatarBg + ';color:' + p.avatarColor + ';font-size:32px;display:flex;align-items:center;justify-content:center;">' + p.avatar + '</div><div style="flex:1;"><div style="font-size:20px;font-weight:600;color:var(--text);">' + p.name + '</div><div style="font-size:12px;color:var(--muted);margin-top:2px;">' + (p.role === 'mother' ? 'Mam\u00e1' : p.gender === 'M' ? 'Macho' : 'Hembra') + ' \u00b7 ' + p.color + '</div></div><span class="puppy-gender-badge" style="font-size:13px;padding:4px 12px;' + (p.role === 'mother' ? 'background:rgba(46,204,113,0.15);color:var(--success-bright);' : p.gender === 'M' ? 'background:rgba(77,171,247,0.15);color:var(--info-bright);' : 'background:rgba(232,125,158,0.15);color:var(--pink);') + '">' + (p.role === 'mother' ? 'Mam\u00e1' : p.gender === 'M' ? 'Macho' : 'Hembra') + '</span></div><div class="profile-detail-grid"><div class="detail-field"><div class="df-label">Rol</div><div class="df-value">' + (p.role === 'mother' ? 'Madre' : 'Cachorro') + '</div></div><div class="detail-field"><div class="df-label">Color</div><div class="df-value">' + p.color + '</div></div>' + (p.role === 'puppy' ? '<div class="detail-field"><div class="df-label">Nacimiento</div><div class="df-value">' + (p.birthDate ? formatDate(p.birthDate) : '\u2014') + '</div></div><div class="detail-field"><div class="df-label">Edad</div><div class="df-value">' + (p.birthDate ? (daysUntil(p.birthDate) * -1) + ' d\u00edas' : '\u2014') + '</div></div>' : '') + (block ? '<div class="detail-field"><div class="df-label">Bloque</div><div class="df-value" style="color:var(--info);">' + block + '</div></div><div class="detail-field"><div class="df-label">Grupo</div><div class="df-value" style="font-size:12px;color:var(--text2);">' + blockName + '</div></div>' : '') + '<div class="detail-field" style="grid-column:1/-1;"><div class="df-label">\u00daltimo peso</div><div class="df-value">' + (latest ? latest.value + 'g (el ' + formatDate(latest.date) + ')' : 'Sin registro') + '</div></div></div><div class="form-group"><label>Notas</label><textarea id="puppy-notes-' + puppyId + '" rows="3" style="font-family:var(--font);font-size:13px;">' + notes + '</textarea></div>' + (history.length > 1 ? '<div class="chart-container"><div class="chart-title">Evoluci\u00f3n de peso</div><div class="chart-canvas-wrap"><canvas id="modal-chart-' + puppyId + '" height="200"></canvas></div></div>' : '') + (history.length > 0 ? '<div class="table-wrap"><table><thead><tr><th>Fecha</th><th class="r">Peso (g)</th><th class="r">Cambio</th></tr></thead><tbody>' + tableRows + '</tbody></table></div>' : '<p style="color:var(--muted);font-size:13px;">No hay registros de peso todav\u00eda.</p>');
  openModal(p.name, bodyHTML, '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button><button class="btn btn-sm btn-primary" onclick="savePuppyNotes(\'' + puppyId + '\')">Guardar notas</button>');
  if (history.length > 1) {
    setTimeout(function() { renderWeightChart('modal-chart-' + puppyId, history, p.name, p.avatarColor); }, 100);
  }
}

function savePuppyNotes(puppyId) {
  var el = document.getElementById('puppy-notes-' + puppyId);
  if (!el) return;
  var state = getAppState();
  state.puppyNotes[puppyId] = el.value;
  saveState();
  closeModal();
}

/* ===== RENDER: PESOS ===== */

function renderPesos() {
  var container = document.getElementById('pesos-content');
  if (!container) return;
  var state = getAppState();
  var charts = '';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    var history = getWeightHistory(p.id);
    var latest = history.length > 0 ? history[history.length - 1] : null;
    var canvasId = 'weight-chart-' + p.id;
    if (history.length < 2) {
      charts += '<div class="stat-card" style="text-align:center;padding:20px;"><div class="puppy-avatar" style="width:40px;height:40px;border-radius:10px;background:' + p.avatarBg + ';color:' + p.avatarColor + ';font-size:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;">' + p.avatar + '</div><div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:4px;">' + p.name + '</div><div style="font-size:11px;color:var(--muted);">' + (latest ? '\u00daltimo: ' + latest.value + 'g' : 'Sin datos') + '</div><div style="font-size:10px;color:var(--muted2);margin-top:6px;">Registra al menos 2 pesajes</div></div>';
    } else {
      setTimeout(function(id, hist, nm, clr) { return function() { renderWeightChart(id, hist, nm, clr); }; }(canvasId, history, p.name, p.avatarColor), 100);
      charts += '<div class="chart-container"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><div class="chart-title" style="margin-bottom:0;">' + p.avatar + ' ' + p.name + '</div><span style="font-size:12px;font-family:var(--mono);color:' + p.avatarColor + ';">' + latest.value + 'g</span></div><div class="chart-canvas-wrap"><canvas id="' + canvasId + '" height="180"></canvas></div><div style="font-size:10px;color:var(--muted2);margin-top:6px;text-align:right;">' + history.length + ' registros \u00b7 \u00faltimo: ' + formatDate(latest.date) + '</div></div>';
    }
  }
  var allDates = {};
  var puppies = [];
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    if (PUPPY_DATA[i].id !== 'blanquita') puppies.push(PUPPY_DATA[i]);
  }
  for (var i = 0; i < puppies.length; i++) {
    var h = state.weights[puppies[i].id] || [];
    for (var j = 0; j < h.length; j++) allDates[h[j].date] = true;
  }
  var sortedDates = Object.keys(allDates).sort(function(a,b) { return new Date(b) - new Date(a); });
  var tableRows = '';
  if (sortedDates.length === 0) {
    tableRows = '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:20px;">No hay registros de peso todav\u00eda</td></tr>';
  } else {
    for (var i = 0; i < sortedDates.length; i++) {
      var date = sortedDates[i];
      tableRows += '<tr><td style="font-family:var(--mono);font-size:12px;color:var(--accent);">' + formatDate(date) + '</td>';
      for (var j = 0; j < puppies.length; j++) {
        var h = state.weights[puppies[j].id] || [];
        var record = null;
        for (var k = 0; k < h.length; k++) { if (h[k].date === date) { record = h[k]; break; } }
        tableRows += '<td class="r">' + (record ? record.value + 'g' : '\u2014') + '</td>';
      }
      tableRows += '</tr>';
    }
  }
  container.innerHTML = '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;"><button class="btn btn-primary" onclick="openAddWeightModal()">Registrar Peso</button><button class="btn btn-ghost" onclick="exportWeightData()">Exportar datos</button></div><h3 style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:12px;">Evoluci\u00f3n por Cachorro</h3><div class="puppy-grid" style="grid-template-columns:repeat(auto-fill,minmax(350px,1fr));">' + charts + '</div><h3 style="font-size:14px;font-weight:500;color:var(--text);margin:24px 0 12px;">Historial Completo</h3><div class="table-wrap"><table><thead><tr><th>Fecha</th>' + (function() { var h=''; for(var i=0;i<puppies.length;i++) h+='<th class="r">'+puppies[i].name+'</th>'; return h; })() + '</tr></thead><tbody>' + tableRows + '</tbody></table></div>';
}

function openAddWeightModal() {
  var today = getToday();
  var opts = '';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    if (p.id !== 'blanquita') opts += '<option value="' + p.id + '">' + p.avatar + ' ' + p.name + '</option>';
  }
  openModal('Registrar Peso', '<div class="form-group"><label>Cachorro</label><select id="weight-puppy">' + opts + '</select></div><div class="form-group"><label>Fecha</label><input type="date" id="weight-date" value="' + today + '" max="' + today + '" /></div><div class="form-group"><label>Peso (gramos)</label><input type="number" id="weight-value" placeholder="Ej: 350" min="50" max="5000" step="1" /></div><div style="font-size:11px;color:var(--muted);background:var(--bg3);border-radius:var(--radius);padding:10px 14px;">Usa una balanza digital de cocina para precisi\u00f3n de 1g-5g. Pesa siempre a la misma hora.</div>', '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-sm btn-success" onclick="saveWeight()">Guardar</button>');
}

function saveWeight() {
  var puppyId = document.getElementById('weight-puppy')?.value;
  var date = document.getElementById('weight-date')?.value;
  var value = parseInt(document.getElementById('weight-value')?.value);
  if (!puppyId || !date || !value || value < 10) { alert('Completa todos los campos'); return; }
  var state = getAppState();
  if (!state.weights[puppyId]) state.weights[puppyId] = [];
  var existing = -1;
  for (var i = 0; i < state.weights[puppyId].length; i++) {
    if (state.weights[puppyId][i].date === date) { existing = i; break; }
  }
  if (existing >= 0) state.weights[puppyId][existing].value = value;
  else state.weights[puppyId].push({ date: date, value: value });
  saveState();
  closeModal();
  renderPesos();
}

function exportWeightData() {
  var state = getAppState();
  var puppies = [];
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    if (PUPPY_DATA[i].id !== 'blanquita') puppies.push(PUPPY_DATA[i]);
  }
  var allDates = {};
  for (var i = 0; i < puppies.length; i++) {
    var h = state.weights[puppies[i].id] || [];
    for (var j = 0; j < h.length; j++) allDates[h[j].date] = true;
  }
  var sorted = Object.keys(allDates).sort(function(a,b) { return new Date(a) - new Date(b); });
  var csv = 'Fecha';
  for (var i = 0; i < puppies.length; i++) csv += ',' + puppies[i].name + '(g)';
  csv += '\n';
  for (var i = 0; i < sorted.length; i++) {
    csv += sorted[i];
    for (var j = 0; j < puppies.length; j++) {
      var h = state.weights[puppies[j].id] || [];
      var record = null;
      for (var k = 0; k < h.length; k++) { if (h[k].date === sorted[i]) { record = h[k]; break; } }
      csv += ',' + (record ? record.value : '');
    }
    csv += '\n';
  }
  var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pesos-cachorros-' + getToday() + '.csv';
  a.click();
}

/* ===== RENDER: ALIMENTACION ===== */

function renderAlimentacion() {
  var container = document.getElementById('alimentacion-content');
  if (!container) return;
  var state = getAppState();
  var today = getToday();
  var todayFeedings = state.feedings[today] || {};
  var nextFeed = getNextFeedingTime();
  var countdown = getTimeUntilNextFeeding();
  var totalFeeds = 0, blockAFeeds = 0, blockBFeeds = 0;
  for (var key in todayFeedings) {
    var b = todayFeedings[key];
    if (b.blockA) { totalFeeds++; blockAFeeds++; }
    if (b.blockB) { totalFeeds++; blockBFeeds++; }
  }
  var scheduleHTML = '';
  for (var i = 0; i < FEEDING_TIMES.length; i++) {
    var ft = FEEDING_TIMES[i];
    var block = todayFeedings[ft.time] || {};
    var fedA = !!block.blockA;
    var fedB = !!block.blockB;
    var isPast = isTimePast(ft.time);
    var isCurrent = isCurrentTimeSlot(ft.time);
    scheduleHTML += '<div class="feed-block"' + (isCurrent ? ' style="border-color:rgba(232,125,158,0.3);"' : '') + '><div class="feed-block-header"><span class="feed-time">' + ft.time + '</span><span class="feed-label" style="color:var(--muted);font-size:12px;">' + ft.label + '</span><span class="feed-status" style="color:' + (fedA && fedB ? 'var(--success)' : isPast ? 'var(--danger)' : 'var(--muted2)') + ';">' + (fedA && fedB ? 'Completo' : isPast ? 'Pendiente' : 'Pr\u00f3ximo') + '</span></div><div class="feed-block-body"><div><div style="font-size:11px;color:var(--info);margin-bottom:3px;">Bloque A</div><div class="feed-puppy-list">' + (function(){ var h=''; for(var j=0;j<FEEDING_BLOCKS.A.members.length;j++){ var pp=puppyById(FEEDING_BLOCKS.A.members[j]); if(pp) h+='<span class="feed-puppy-tag'+(fedA?' fed':'')+'">'+pp.avatar+' '+pp.name+'</span>'; } return h; })() + '</div></div><div><div style="font-size:11px;color:var(--pink);margin-bottom:3px;">Bloque B</div><div class="feed-puppy-list">' + (function(){ var h=''; for(var j=0;j<FEEDING_BLOCKS.B.members.length;j++){ var pp=puppyById(FEEDING_BLOCKS.B.members[j]); if(pp) h+='<span class="feed-puppy-tag'+(fedB?' fed':'')+'"'+ (pp.id==='travieso'&&!fedB?' style="border-color:rgba(224,184,92,0.3);color:var(--warning);"':'') +'>'+pp.avatar+' '+pp.name+(pp.id==='travieso'?' \u2b50':'')+'</span>'; } return h; })() + '</div></div><div class="feed-actions">' + (!fedA ? '<button class="btn btn-xs" style="background:rgba(77,171,247,0.12);color:var(--info);border:0.5px solid rgba(77,171,247,0.2);" onclick="markFed(\'' + ft.time + '\',\'blockA\');renderAlimentacion()">Bloque A</button>' : '') + (!fedB ? '<button class="btn btn-xs" style="background:rgba(232,125,158,0.12);color:var(--pink);border:0.5px solid rgba(232,125,158,0.2);" onclick="markFed(\'' + ft.time + '\',\'blockB\');renderAlimentacion()">Bloque B</button>' : '') + (fedA && fedB ? '<span style="font-size:11px;color:var(--success);">Ambos completados</span>' : '') + '</div></div></div>';
  }
  container.innerHTML = '<div class="next-feeding-banner"><div><div class="nfb-label">Pr\u00f3xima alimentaci\u00f3n</div><div class="nfb-time" id="feed-next-time">' + nextFeed.time + '</div><div class="nfb-block">' + nextFeed.label + '</div></div><div class="nfb-countdown"><div class="nfb-cd-label">Tiempo restante</div><div class="nfb-cd-value" id="feed-countdown">' + countdown.hours + 'h ' + countdown.minutes + 'm</div></div></div><div class="feed-overview-grid"><div class="feed-stat-card"><div class="fs-icon">\ud83c\udf7c</div><div class="fs-label">Alimentaciones Hoy</div><div class="fs-value" style="color:var(--pink);">' + totalFeeds + '/12</div><div class="fs-sub">6 horarios \u00d7 2 bloques</div></div><div class="feed-stat-card"><div class="fs-icon">\ud83d\udd35</div><div class="fs-label">Bloque A</div><div class="fs-value" style="color:var(--info);">' + blockAFeeds + '/6</div><div class="fs-sub">Max, Steel, Sydney, Alofoka</div></div><div class="feed-stat-card"><div class="fs-icon">\ud83d\udfe3</div><div class="fs-label">Bloque B</div><div class="fs-value" style="color:var(--purple);">' + blockBFeeds + '/6</div><div class="fs-sub">Arturo, Chana, Rodotesa, Travieso</div></div><div class="feed-stat-card"><div class="fs-icon">\ud83d\udc51</div><div class="fs-label">Blanquita</div><div class="fs-value" style="color:var(--success);">' + (blockAFeeds+blockBFeeds) + ' tomas</div><div class="fs-sub">Alimentaci\u00f3n libre + suplemento</div></div></div>' + scheduleHTML + '<div style="background:rgba(224,184,92,0.04);border:0.5px solid rgba(224,184,92,0.15);border-radius:var(--radius2);padding:16px;"><div style="font-size:13px;font-weight:500;color:var(--warning);margin-bottom:8px;">Protocolo</div><div style="font-size:12px;color:var(--text2);line-height:1.7;"><strong>Orden:</strong> Bloque A primero (15-20 min) \u2192 Bloque B (Travieso en tetas traseras)<br><strong>Travieso:</strong> Prioridad absoluta. Siempre tetas traseras<br><strong>A los 21-25 d\u00edas:</strong> Iniciar papilla de transici\u00f3n<br><strong>A los 45 d\u00edas:</strong> 1ra Vacuna Puppy</div></div>';
  if (_feedingTimer) clearInterval(_feedingTimer);
  _feedingTimer = setInterval(function() {
    var cd = getTimeUntilNextFeeding();
    var el = document.getElementById('feed-countdown');
    if (el) el.textContent = cd.hours + 'h ' + cd.minutes + 'm';
    var timeEl = document.getElementById('feed-next-time');
    if (timeEl) { var nf = getNextFeedingTime(); timeEl.textContent = nf.time; }
  }, 5000);
}

/* ===== RENDER: COMIDAS DE BLANQUITA ===== */

function renderComidas() {
  var container = document.getElementById('comidas-content');
  if (!container) return;
  var state = getAppState();
  var today = getToday();
  var menu = getTodaysBlanquitaMenu();
  var mealsToday = state.blanquitaMeals?.[today] || {};
  var dayName = DAYS_ES[new Date().getDay()];
  
  // Stats
  var servedCount = 0, totalCount = BLANQUITA_MEAL_TIMES.length;
  var totalPortion = 0, servedPortion = 0;
  for (var i = 0; i < BLANQUITA_MEAL_TIMES.length; i++) {
    var mt = BLANQUITA_MEAL_TIMES[i];
    var status = mealsToday[mt.time];
    if (status && status.served) { servedCount++; servedPortion += (status.portion || 0); }
    totalPortion += Math.round(BLANQUITA_DAILY_FOOD_G * mt.pct);
  }
  var pctComplete = Math.round(servedCount / totalCount * 100);
  
  // Alert status
  var hoursSinceLastMeal = 0;
  var lastMealTime = null;
  for (var i = BLANQUITA_MEAL_TIMES.length - 1; i >= 0; i--) {
    var mt = BLANQUITA_MEAL_TIMES[i];
    if (mealsToday[mt.time]?.served) { lastMealTime = mt; break; }
  }
  if (lastMealTime) {
    var parts = lastMealTime.time.split(':');
    var lastMealDate = new Date();
    lastMealDate.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
    hoursSinceLastMeal = Math.round((Date.now() - lastMealDate.getTime()) / (1000*60*60));
  }
  
  var alertHTML = '';
  if (hoursSinceLastMeal > 6) {
    alertHTML = '<div class="alerta-banner alerta-urgent"><span style="font-size:20px;">\ud83d\udea8</span><div><strong>\u00a1M\u00e1s de 6 horas sin alimentar a Blanquita!</strong><br>Han pasado ' + hoursSinceLastMeal + ' horas desde la \u00faltima comida. \u00a1Prep\u00e1rale su plato ahora!</div></div>';
  } else if (servedCount < totalCount && hoursSinceLastMeal > 4) {
    alertHTML = '<div class="alerta-banner alerta-warning"><span style="font-size:20px;">\u26a0\ufe0f</span><div><strong>Pr\u00f3xima comida pendiente</strong><br>' + (totalCount - servedCount) + ' comida(s) pendiente(s) hoy.</div></div>';
  }
  
  // Status color for each slot
  function getTimeSlotStatus(timeStr) {
    var parts = timeStr.split(':');
    var now = new Date();
    var currentMinutes = now.getHours()*60 + now.getMinutes();
    var mealMinutes = parseInt(parts[0])*60 + parseInt(parts[1]);
    if (currentMinutes > mealMinutes + 60) return 'past';
    if (currentMinutes >= mealMinutes - 30 && currentMinutes <= mealMinutes + 60) return 'current';
    return 'future';
  }
  
  var mealsHTML = '';
  for (var i = 0; i < menu.length; i++) {
    var m = menu[i];
    var status = mealsToday[m.time];
    var served = status && status.served;
    var slotStatus = getTimeSlotStatus(m.time);
    var isLate = !served && slotStatus === 'past';
    
    mealsHTML += '<div class="comida-card" style="border-color:' + (isLate ? 'rgba(224,92,92,0.3)' : served ? 'rgba(46,204,113,0.3)' : 'var(--border)') + ';">';
    mealsHTML += '  <div class="comida-header">';
    mealsHTML += '    <span class="comida-time">' + m.icon + ' ' + m.time + '</span>';
    mealsHTML += '    <span class="comida-label">' + m.label + '</span>';
    mealsHTML += '    <span class="comida-status" style="color:' + (served ? 'var(--success)' : isLate ? 'var(--danger)' : 'var(--muted2)') + ';">' + (served ? '\u2705 Servido' : isLate ? '\u26a0\ufe0f Pendiente' : '\u23f3 Pr\u00f3ximo') + '</span>';
    mealsHTML += '  </div>';
    mealsHTML += '  <div class="comida-body">';
    mealsHTML += '    <div class="comida-recipe-name" style="color:' + m.recipe.color + ';">' + m.recipe.icon + ' ' + m.recipe.name + '</div>';
    mealsHTML += '    <div class="comida-recipe-desc">' + m.recipe.desc + '</div>';
    mealsHTML += '    <div class="comida-macros">';
    mealsHTML += '      <span class="macro-tag" style="background:rgba(46,204,113,0.1);color:var(--success);">' + m.recipe.macros.protein + '</span>';
    mealsHTML += '      <span class="macro-tag" style="background:rgba(224,184,92,0.1);color:var(--warning);">' + m.recipe.macros.carbs + '</span>';
    mealsHTML += '      <span class="macro-tag" style="background:rgba(232,125,158,0.1);color:var(--pink);">' + m.recipe.macros.fat + '</span>';
    mealsHTML += '    </div>';
    mealsHTML += '    <div class="comida-portion">Porci\u00f3n: <strong>' + m.portion + 'g</strong> (~' + Math.round(m.portion/BLANQUITA_DAILY_FOOD_G*100) + '% del d\u00eda)</div>';
    mealsHTML += '    <div class="comida-actions">';
    if (!served) {
      mealsHTML += '      <button class="btn btn-xs" style="background:rgba(46,204,113,0.12);color:var(--success);border:0.5px solid rgba(46,204,113,0.2);" onclick="markBlanquitaMeal(\'' + m.time + '\',' + m.portion + ',\'\');renderComidas()">\u2705 Marcar servido</button>';
    } else {
      mealsHTML += '      <span style="font-size:11px;color:var(--success);">\u2705 Servido (' + (status.portion || m.portion) + 'g) ' + (status.notes ? '\u2014 ' + status.notes : '') + '</span>';
    }
    mealsHTML += '      <button class="btn btn-xs btn-ghost" onclick="openRecipeModal(\'' + m.recipeId + '\')">\ud83d\udcd6 Ver receta</button>';
    mealsHTML += '    </div>';
    mealsHTML += '  </div>';
    mealsHTML += '</div>';
  }
  
  container.innerHTML = alertHTML + `
    <div class="next-feeding-banner" style="background:linear-gradient(135deg,var(--bg3),rgba(46,204,113,0.05));border-color:rgba(46,204,113,0.2);">
      <div>
        <div class="nfb-label">\ud83d\udc51 Plan de Comidas de Blanquita</div>
        <div class="nfb-time" style="font-size:20px;color:var(--success);">${dayName}</div>
        <div class="nfb-block">${servedCount}/${totalCount} comidas servidas \u00b7 ~${servedPortion}/${totalPortion}g</div>
      </div>
      <div class="nfb-countdown">
        <div class="nfb-cd-label">Progreso del d\u00eda</div>
        <div class="nfb-cd-value" style="font-size:28px;color:var(--accent);">${pctComplete}%</div>
        <div class="nfb-block">Comida total: ~${totalPortion}g/d\u00eda</div>
      </div>
    </div>
    <div class="feed-overview-grid">
      <div class="feed-stat-card">
        <div class="fs-icon">\ud83c\udf72</div>
        <div class="fs-label">Receta de la Ma\u00f1ana</div>
        <div class="fs-value" style="font-size:14px;color:var(--orange);">${(menu[0] ? menu[0].recipe.name : '\u2014')}</div>
        <div class="fs-sub">${(menu[0] ? menu[0].portion + 'g' : '')}</div>
      </div>
      <div class="feed-stat-card">
        <div class="fs-icon">\ud83e\udd69</div>
        <div class="fs-label">Almuerzo</div>
        <div class="fs-value" style="font-size:14px;color:var(--danger);">${(menu[1] ? menu[1].recipe.name : '\u2014')}</div>
        <div class="fs-sub">${(menu[1] ? menu[1].portion + 'g' : '')}</div>
      </div>
      <div class="feed-stat-card">
        <div class="fs-icon">\ud83d\udc1f</div>
        <div class="fs-label">Cena</div>
        <div class="fs-value" style="font-size:14px;color:var(--info);">${(menu[2] ? menu[2].recipe.name : '\u2014')}</div>
        <div class="fs-sub">${(menu[2] ? menu[2].portion + 'g' : '')}</div>
      </div>
      <div class="feed-stat-card">
        <div class="fs-icon">\u2615</div>
        <div class="fs-label">Refuerzo Nocturno</div>
        <div class="fs-value" style="font-size:14px;color:var(--accent);">${(menu[3] ? menu[3].recipe.name : '\u2014')}</div>
        <div class="fs-sub">${(menu[3] ? menu[3].portion + 'g' : '')}</div>
      </div>
    </div>
    <div style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:18px;">\ud83d\udcc5</span>
        <h4 style="font-size:14px;font-weight:500;color:var(--text);margin:0;">Calendario Semanal de Comidas</h4>
        <span style="font-size:11px;color:var(--muted2);margin-left:auto;">Click en un d\u00eda para ver detalles</span>
      </div>
      <div class="week-calendar" style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;">
        ${(function() {
          var week = getWeekMenu();
          var today = new Date().getDay();
          var h = '';
          for (var wi = 0; wi < week.length; wi++) {
            var wd = week[wi];
            var isToday = wi === today;
            h += '<div class="week-day-card" style="background:' + (isToday ? 'rgba(46,204,113,0.08)' : 'var(--bg3)') + ';border:0.5px solid ' + (isToday ? 'rgba(46,204,113,0.3)' : 'var(--border)') + ';border-radius:var(--radius);padding:8px 6px;cursor:pointer;text-align:center;transition:all 0.2s;" onclick="navigateTo(\'comidas\')" onmouseover="this.style.background=\'rgba(77,171,247,0.08)\'" onmouseout="this.style.background=\'' + (isToday ? 'rgba(46,204,113,0.08)' : 'var(--bg3)') + '\'">';
            h += '<div style="font-size:10px;font-weight:' + (isToday ? '700' : '500') + ';color:' + (isToday ? 'var(--success)' : 'var(--muted)') + ';margin-bottom:6px;">' + wd.dayName.substring(0,3) + '</div>';
            for (var mi = 0; mi < wd.meals.length; mi++) {
              var wm = wd.meals[mi];
              h += '<div style="font-size:11px;padding:2px 0;border-bottom:0.5px solid var(--border);display:flex;align-items:center;gap:3px;justify-content:center;">';
              h += '<span>' + wm.recipe.icon + '</span>';
              h += '<span style="font-size:8px;color:var(--muted2);">' + wm.time.substring(0,5) + '</span>';
              h += '</div>';
            }
            h += '<div style="font-size:8px;color:var(--muted2);margin-top:4px;">~' + Math.round(BLANQUITA_DAILY_FOOD_G) + 'g</div>';
            h += '</div>';
          }
          return h;
        })()}
      </div>
    </div>
    <div class="schedule-grid">${mealsHTML}</div>
    
    <div style="background:rgba(232,125,158,0.04);border:0.5px solid rgba(232,125,158,0.15);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:18px;">\ud83c\udf73</span>
        <h4 style="font-size:14px;font-weight:500;color:var(--text);margin:0;">Preparaci\u00f3n del D\u00eda</h4>
        <span style="font-size:10px;color:var(--muted2);margin-left:auto;">${dayName} \u2014 ${servedCount}/${totalCount} comidas</span>
      </div>
      ${(function() {
        var h = '';
        var seenRecipes = {};
        for (var pi = 0; pi < menu.length; pi++) {
          var pm = menu[pi];
          var rid = pm.recipeId;
          if (seenRecipes[rid]) continue;
          seenRecipes[rid] = true;
          var r = pm.recipe;
          h += '<div style="background:var(--bg3);border-radius:var(--radius);padding:12px 14px;margin-bottom:8px;">';
          h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">';
          h += '<span style="font-size:20px;">' + r.icon + '</span>';
          h += '<div><div style="font-size:13px;font-weight:500;color:' + r.color + ';">' + r.name + '</div>';
          h += '<div style="font-size:10px;color:var(--muted2);">' + r.desc.substring(0, 60) + '...</div></div>';
          h += '<button class="btn btn-xs btn-ghost" style="margin-left:auto;flex-shrink:0;" onclick="openRecipeModal(\'' + rid + '\')">\ud83d\udcd6 Ver receta</button>';
          h += '</div>';
          // Ingredientes compactos
          h += '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">';
          for (var ii = 0; ii < r.ingredients.length; ii++) {
            var ig = r.ingredients[ii];
            var shortName = ig.length > 28 ? ig.substring(0,26) + '...' : ig;
            h += '<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:var(--bg4);color:var(--text2);">' + shortName + '</span>';
          }
          h += '</div>';
          // Steps compactos
          h += '<div style="margin-top:6px;">';
          for (var si = 0; si < Math.min(r.steps.length, 3); si++) {
            h += '<div style="font-size:10px;color:var(--muted);padding:1px 0;">' + (si+1) + '. ' + r.steps[si].substring(0, 60) + (r.steps[si].length > 60 ? '...' : '') + '</div>';
          }
          if (r.steps.length > 3) {
            h += '<div style="font-size:10px;color:var(--info);cursor:pointer;" onclick="openRecipeModal(\'' + rid + '\')">Ver todos los pasos \u2192</div>';
          }
          h += '</div></div>';
        }
        // Shopping list for the day
        h += '<div style="background:rgba(46,204,113,0.04);border:0.5px solid rgba(46,204,113,0.15);border-radius:var(--radius);padding:10px 14px;margin-top:8px;">';
        h += '<div style="font-size:11px;font-weight:500;color:var(--success);margin-bottom:4px;">\ud83d\uded2 Lista de Compra del D\u00eda</div>';
        h += '<div style="font-size:10px;color:var(--text2);display:flex;gap:4px;flex-wrap:wrap;">';
        var allIngs = {};
        for (var pi = 0; pi < menu.length; pi++) {
          var r2 = menu[pi].recipe;
          for (var ii = 0; ii < r2.ingredients.length; ii++) {
            var name = r2.ingredients[ii].replace(/\([^)]*\)/g, '').replace(/\d+\s*(taza|unidad|lata|chorrito|apenas)/gi, '').trim();
            if (name && name.length > 2) allIngs[name] = true;
          }
        }
        var ings = Object.keys(allIngs);
        for (var ii = 0; ii < Math.min(ings.length, 12); ii++) {
          h += '<span style="font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(46,204,113,0.1);color:var(--success-bright);">\u2713 ' + ings[ii].substring(0, 24) + '</span>';
        }
        if (ings.length > 12) h += '<span style="font-size:10px;color:var(--muted2);">+' + (ings.length-12) + ' m\u00e1s...</span>';
        h += '</div></div>';
        return h;
      })()}
    </div>
    <div style="background:rgba(77,171,247,0.04);border:0.5px solid rgba(77,171,247,0.15);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px;">\U0001f514</span>
          <h4 style="font-size:14px;font-weight:500;color:var(--text);margin:0;">Recordatorios de Comidas</h4>
        </div>
        <label style="position:relative;display:inline-block;width:44px;height:24px;cursor:pointer;">
          <input type="checkbox" ' + (state.blanquitaReminders?.enabled ? 'checked' : '') + ' onchange="toggleBlanquitaReminders()" style="opacity:0;width:0;height:0;position:absolute;">
          <span class="switch-slider" style="position:absolute;top:0;left:0;right:0;bottom:0;background:' + (state.blanquitaReminders?.enabled ? 'var(--success)' : 'var(--bg4)') + ';border-radius:24px;transition:0.3s;"></span>
          <span style="position:absolute;height:18px;width:18px;left:3px;bottom:3px;background:var(--bg2);border-radius:50%;transition:0.3s;' + (state.blanquitaReminders?.enabled ? 'transform:translateX(20px);' : '') + '"></span>
        </label>
      </div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6;">
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px;">
          <span style="font-size:11px;color:var(--muted);">Recordar</span>
          ' + (function() {
            var opts = [5, 10, 15, 30];
            var h = '';
            var sel = state.blanquitaReminders?.minutesBefore || 5;
            for (var oi = 0; oi < opts.length; oi++) {
              var isSel = opts[oi] === sel;
              h += '<button class="btn btn-xs" style="background:' + (isSel ? 'rgba(77,171,247,0.2)' : 'var(--bg4)') + ';color:' + (isSel ? 'var(--info)' : 'var(--muted2)') + ';border:0.5px solid ' + (isSel ? 'rgba(77,171,247,0.3)' : 'transparent') + ';" onclick="setBlanquitaReminderMinutes(' + opts[oi] + ')">' + opts[oi] + '</button>';
            }
            return h;
          })()}
          <span style="font-size:11px;color:var(--muted);">min antes</span>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.5;">
          ' + (state.blanquitaReminders?.enabled
            ? '\u2705 Recibiras notificaciones ' + (state.blanquitaReminders?.minutesBefore || 5)} min antes de cada comida.'
            : '\u26a0\ufe0f Activa los recordatorios para recibir notificaciones push antes de cada comida.')
          + '<br>\U0001f6a8 Tambien alertara si Blanquita pasa mas de 4 horas sin comer.'
        </div>
      </div>
    </div>
<div style="background:rgba(232,125,158,0.04);border:0.5px solid rgba(232,125,158,0.15);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <span style="font-size:18px;">\ud83d\udcdd</span>
        <h4 style="font-size:14px;font-weight:500;color:var(--text);">Notas para hoy</h4>
      </div>
      <div style="font-size:12px;color:var(--text2);line-height:1.7;">
        <strong>\u2705 Verde:</strong> Comida servida a tiempo y porci\u00f3n exacta.<br>
        <strong>\u26a0\ufe0f Amarillo:</strong> Blanquita no termin\u00f3 su plato (posible cansancio o mastitis).<br>
        <strong>\ud83d\udea8 Rojo:</strong> M\u00e1s de 6 horas sin hidrataci\u00f3n o alimento.<br><br>
        <strong>\ud83d\udca1 Tip:</strong> Sirve la comida tibia, nunca caliente ni reci\u00e9n sacada de la nevera. La comida tibia es m\u00e1s atractiva por el olfato y ayuda a su digesti\u00f3n.
      </div>
    </div>'`
}

function openRecipeModal(recipeId) {
  var recipe = RECIPES[recipeId];
  if (!recipe) return;
  
  var stepsHTML = '<ol style="padding-left:20px;margin:0;">';
  for (var i = 0; i < recipe.steps.length; i++) {
    stepsHTML += '<li style="margin-bottom:8px;font-size:13px;color:var(--text2);line-height:1.6;">' + recipe.steps[i] + '</li>';
  }
  stepsHTML += '</ol>';
  
  var ingredientsHTML = '<ul style="padding-left:20px;margin:0;">';
  for (var i = 0; i < recipe.ingredients.length; i++) {
    ingredientsHTML += '<li style="margin-bottom:6px;font-size:13px;color:var(--text2);">' + recipe.ingredients[i] + '</li>';
  }
  ingredientsHTML += '</ul>';
  
  var bodyHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;background:var(--bg3);border-radius:var(--radius2);padding:16px;">';
  bodyHTML += '  <span style="font-size:40px;">' + recipe.icon + '</span>';
  bodyHTML += '  <div><div style="font-size:18px;font-weight:600;color:' + recipe.color + ';">' + recipe.name + '</div>';
  bodyHTML += '  <div style="font-size:12px;color:var(--muted);">' + recipe.desc + '</div></div>';
  bodyHTML += '</div>';
  
  bodyHTML += '<div style="margin-bottom:16px;"><div style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:8px;">Macronutrientes</div><div style="display:flex;gap:8px;flex-wrap:wrap;">';
  bodyHTML += '<span class="macro-tag" style="background:rgba(46,204,113,0.1);color:var(--success);">' + recipe.macros.protein + '</span>';
  bodyHTML += '<span class="macro-tag" style="background:rgba(224,184,92,0.1);color:var(--warning);">' + recipe.macros.carbs + '</span>';
  bodyHTML += '<span class="macro-tag" style="background:rgba(232,125,158,0.1);color:var(--pink);">' + recipe.macros.fat + '</span>';
  bodyHTML += '</div></div>';
  
  bodyHTML += '<div style="background:rgba(46,204,113,0.04);border:0.5px solid rgba(46,204,113,0.15);border-radius:var(--radius);padding:10px 14px;margin-bottom:16px;">';
  bodyHTML += '<div style="font-size:11px;color:var(--success);font-weight:500;margin-bottom:4px;">\u2705 Beneficio</div>';
  bodyHTML += '<div style="font-size:12px;color:var(--text2);">' + recipe.benefit + '</div></div>';
  
  if (recipe.warning) {
    bodyHTML += '<div style="background:rgba(224,92,92,0.04);border:0.5px solid rgba(224,92,92,0.15);border-radius:var(--radius);padding:10px 14px;margin-bottom:16px;">';
    bodyHTML += '<div style="font-size:11px;color:var(--danger);font-weight:500;margin-bottom:4px;">\u26a0\ufe0f Advertencia</div>';
    bodyHTML += '<div style="font-size:12px;color:var(--text2);">' + recipe.warning + '</div></div>';
  }
  
  bodyHTML += '<h4 style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:8px;">\ud83d\udccb Ingredientes</h4>';
  bodyHTML += '<div style="background:var(--bg3);border-radius:var(--radius);padding:14px;margin-bottom:16px;">' + ingredientsHTML + '</div>';
  
  bodyHTML += '<h4 style="font-size:13px;font-weight:500;color:var(--text);margin-bottom:8px;">\ud83d\udc68\u200d\ud83c\udf73 Preparaci\u00f3n (Paso a Paso)</h4>';
  bodyHTML += '<div style="background:var(--bg3);border-radius:var(--radius);padding:14px;">' + stepsHTML + '</div>';
  
  openModal(recipe.icon + ' ' + recipe.name, bodyHTML, '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>');
}

/* ===== RENDER: MEDICINA ===== */


function showToast(message, type) {
  var existing = document.getElementById('toast-notification');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--bg3);border:0.5px solid ' + (type === 'success' ? 'var(--success)' : 'var(--info)') + ';color:var(--text);padding:12px 20px;border-radius:var(--radius);font-size:13px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.3);max-width:400px;text-align:center;animation:fadeInUp 0.3s ease;';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}
function toggleBlanquitaReminders() {
  var state = getAppState();
  if (!state.blanquitaReminders) state.blanquitaReminders = { enabled: false, minutesBefore: 5 };
  state.blanquitaReminders.enabled = !state.blanquitaReminders.enabled;
  saveState();
  renderComidas();
  if (state.blanquitaReminders.enabled) {
    if (typeof requestNotifPermission === 'function') requestNotifPermission();
    if (typeof checkBlanquitaMealNotifications === 'function') checkBlanquitaMealNotifications();
    showToast('\U0001f514 Recordatorios activados — ' + state.blanquitaReminders.minutesBefore + ' min antes de cada comida', 'success');
  } else {
    showToast('\U0001f515 Recordatorios desactivados', '');
  }
}

function setBlanquitaReminderMinutes(minutes) {
  var state = getAppState();
  if (!state.blanquitaReminders) state.blanquitaReminders = { enabled: true, minutesBefore: 5 };
  state.blanquitaReminders.minutesBefore = minutes;
  state.blanquitaReminders.enabled = true;
  saveState();
  renderComidas();
  showToast('\u23f0 Recordatorio: ' + minutes + ' min antes de cada comida', 'success');
}

function renderMedicina() {
  var container = document.getElementById('medicina-content');
  if (!container) return;
  var state = getAppState();
  var allEvents = [].concat(MEDICAL_EVENTS);
  if (state.customEvents) {
    for (var i = 0; i < state.customEvents.length; i++) {
      var ce = state.customEvents[i];
      if (!state.medicalStatus[ce.id] || state.medicalStatus[ce.id] !== 'removed') allEvents.push(ce);
    }
  }
  var doneEvents = 0;
  for (var i = 0; i < allEvents.length; i++) { if (state.medicalStatus[allEvents[i].id] === 'done') doneEvents++; }
  var urgentEvents = [];
  for (var i = 0; i < allEvents.length; i++) {
    if (state.medicalStatus[allEvents[i].id] !== 'done' && daysUntil(allEvents[i].date) <= 0) urgentEvents.push(allEvents[i]);
  }
  var dewormingCount = 0, dewormingDone = 0;
  var vaccineCount = 0, vaccineDone = 0;
  for (var i = 0; i < allEvents.length; i++) {
    var e = allEvents[i];
    if (e.type === 'deworming') { dewormingCount++; if (state.medicalStatus[e.id] === 'done') dewormingDone++; }
    if (e.type === 'vaccine') { vaccineCount++; if (state.medicalStatus[e.id] === 'done') vaccineDone++; }
  }
  var timelineHTML = '';
  allEvents.sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
  var typeIcons = { deworming: '\ud83d\udc8a', vaccine: '\ud83d\udc89', bath: '\ud83d\udec1', checkup: '\ud83d\udd0d' };
  for (var i = 0; i < allEvents.length; i++) {
    var e = allEvents[i];
    var isDone = state.medicalStatus[e.id] === 'done';
    var days = daysUntil(e.date);
    var statusClass = isDone ? 'event-done' : days <= 0 ? 'event-urgent' : days <= 7 ? 'event-pending' : '';
    var statusLabel = isDone ? 'Completado' : days < 0 ? 'ATRASADO ' + Math.abs(days) + ' d\u00edas' : days === 0 ? '\u00a1HOY!' : days <= 7 ? 'en ' + days + ' d\u00edas' : 'en ' + days + ' d\u00edas';
    timelineHTML += '<div class="timeline-event ' + statusClass + '" onclick="toggleMedicalEvent(\'' + e.id + '\')" style="cursor:pointer;"><div style="display:flex;justify-content:space-between;align-items:flex-start;"><div><div class="event-date">' + formatDate(e.date) + ' \u00b7 ' + (typeIcons[e.type] || '\ud83d\udccb') + ' ' + e.type + '</div><div class="event-title">' + e.title + '</div><div class="event-desc">' + e.desc + '</div><div style="margin-top:6px;"><span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;font-weight:500;' + (isDone ? 'background:rgba(46,204,113,0.15);color:var(--success);' : days <= 0 ? 'background:rgba(224,92,92,0.15);color:var(--danger);' : 'background:rgba(224,184,92,0.1);color:var(--warning);') + '">' + statusLabel + '</span>' + (e.forPuppies ? '<span style="display:inline-block;font-size:9px;padding:1px 6px;border-radius:4px;background:var(--bg4);color:var(--muted2);margin-left:4px;">Todos los cachorros</span>' : '') + '</div></div><div style="font-size:16px;opacity:0.5;">' + (isDone ? '\u2705' : days <= 0 ? '\ud83d\udd34' : '\u2b55') + '</div></div></div>';
  }
  var urgentHTML = '';
  if (urgentEvents.length > 0) {
    var urgentList = '';
    for (var i = 0; i < urgentEvents.length; i++) {
      urgentList += urgentEvents[i].title + ' \u2014 ' + formatDate(urgentEvents[i].date) + '<br>';
    }
    urgentHTML = '<div class="alerta-banner alerta-urgent"><span style="font-size:24px;">\ud83d\udea8</span><div><strong>' + urgentEvents.length + ' evento(s) URGENTE(S)</strong><br>' + urgentList + '</div></div>';
  }
  container.innerHTML = urgentHTML + '<div class="medical-grid"><div class="medical-card"><div class="med-icon">\ud83d\udc8a</div><div class="med-label">Desparasitaciones</div><div class="med-value">' + dewormingDone + '/' + dewormingCount + '</div><div class="med-sub">Completadas</div></div><div class="medical-card"><div class="med-icon">\ud83d\udc89</div><div class="med-label">Vacunas</div><div class="med-value">' + vaccineDone + '/' + vaccineCount + '</div><div class="med-sub">Aplicadas</div></div><div class="medical-card"><div class="med-icon">\ud83d\udcc5</div><div class="med-label">Pendientes</div><div class="med-value" style="color:' + (allEvents.length-doneEvents > 0 ? 'var(--warning)' : 'var(--success)') + ';">' + (allEvents.length-doneEvents) + '</div><div class="med-sub">Eventos por realizar</div></div><div class="medical-card"><div class="med-icon">\u2705</div><div class="med-label">Completados</div><div class="med-value" style="color:var(--success);">' + doneEvents + '/' + allEvents.length + '</div><div class="med-sub">' + Math.round(doneEvents/allEvents.length*100) + '% del plan</div></div></div><div style="display:flex;gap:10px;margin-bottom:20px;"><button class="btn btn-primary" onclick="openAddMedicalEventModal()">Agregar evento</button><button class="btn btn-ghost" onclick="exportMedicalReport()">Exportar</button></div><div class="medical-timeline">' + timelineHTML + '</div>';
}

function toggleMedicalEvent(eventId) {
  var state = getAppState();
  state.medicalStatus[eventId] = state.medicalStatus[eventId] === 'done' ? 'pending' : 'done';
  saveState();
  renderMedicina();
}

function openAddMedicalEventModal() {
  var today = getToday();
  openModal('Nuevo Evento', '<div class="form-group"><label>T\u00edtulo</label><input type="text" id="med-event-title" placeholder="Control veterinario" /></div><div class="form-group"><label>Fecha</label><input type="date" id="med-event-date" value="' + today + '" /></div><div class="form-group"><label>Tipo</label><select id="med-event-type"><option value="checkup">Control</option><option value="deworming">Desparasitaci\u00f3n</option><option value="vaccine">Vacuna</option><option value="bath">Ba\u00f1o</option><option value="other">Otro</option></select></div><div class="form-group"><label>Descripci\u00f3n</label><textarea id="med-event-desc" rows="2"></textarea></div>', '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-sm btn-success" onclick="saveMedicalEvent()">Guardar</button>');
}

function saveMedicalEvent() {
  var title = document.getElementById('med-event-title')?.value.trim();
  var date = document.getElementById('med-event-date')?.value;
  var type = document.getElementById('med-event-type')?.value;
  var desc = document.getElementById('med-event-desc')?.value.trim();
  if (!title || !date) { alert('Completa t\u00edtulo y fecha'); return; }
  var state = getAppState();
  if (!state.customEvents) state.customEvents = [];
  state.customEvents.push({ id: 'custom_' + Date.now(), title: title, desc: desc || '', date: date, type: type, status: 'pending', forPuppies: false });
  saveState();
  closeModal();
  renderMedicina();
}

function exportMedicalReport() {
  var state = getAppState();
  var allEvents = [].concat(MEDICAL_EVENTS);
  if (state.customEvents) { for (var i = 0; i < state.customEvents.length; i++) allEvents.push(state.customEvents[i]); }
  allEvents.sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
  var text = 'PLAN MEDICO\nGenerado: ' + new Date().toLocaleString('es-DO') + '\n\n';
  for (var i = 0; i < allEvents.length; i++) {
    var e = allEvents[i];
    var isDone = state.medicalStatus[e.id] === 'done';
    text += (isDone ? '[OK]' : '[  ]') + ' ' + formatDate(e.date) + ' \u2014 ' + e.title + '\n';
    text += '     ' + e.desc + '\n\n';
  }
  var blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'plan-medico-cachorros.txt'; a.click();
}

// Init theme on load
initTheme();


// Keyboard shortcut for back navigation
document.addEventListener('keydown', function(e) {
  if (e.altKey && e.key === 'ArrowLeft') {
    e.preventDefault();
    goBack();
  }
});

/* ===== RENDER: CONTENIDO ===== */


/* ===== RENDER: GRUPOS (Bloque A, Bloque B, Hembras, Varones) ===== */

function getFilteredPuppies(filterType, filterValue) {
  var result = [];
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    if (filterType === 'block') {
      var blk = getFeedingBlock(p.id);
      if (blk === filterValue) result.push(p);
    } else if (filterType === 'gender') {
      if (p.gender === filterValue && p.id !== 'blanquita') result.push(p);
    } else if (filterType === 'mother') {
      if (p.role === 'mother') result.push(p);
    }
  }
  return result;
}

function renderGroupSection(containerId, title, subtitle, puppies, accentColor) {
  var container = document.getElementById(containerId);
  if (!container) return;
  
  var html = '<div class="next-feeding-banner" style="background:linear-gradient(135deg,var(--bg3),' + accentColor + '05);border-color:' + accentColor + '22;">';
  html += '  <div>';
  html += '    <div class="nfb-label">' + subtitle + '</div>';
  html += '    <div class="nfb-time" style="font-size:24px;color:' + accentColor + ';">' + title + '</div>';
  html += '    <div class="nfb-block">' + puppies.length + ' miembros</div>';
  html += '  </div>';
  html += '</div>';
  
  html += '<div class="funnel-puppies-list">';
  for (var i = 0; i < puppies.length; i++) {
    var p = puppies[i];
    var lw = getLatestWeight(p.id);
    var blk = getFeedingBlock(p.id);
    var genderIcon = p.gender === 'M' ? '♂' : '♀';
    
    html += '<div class="funnel-puppy-row" onclick="navigateTo('perfiles')">';
    html += '  <div class="funnel-puppy-avatar" style="background:' + p.avatarBg + ';color:' + p.avatarColor + ';">' + p.avatar + '</div>';
    html += '  <div class="funnel-puppy-info">';
    html += '    <div class="funnel-puppy-name">' + p.name + '</div>';
    html += '    <div class="funnel-puppy-role">' + (p.role === 'mother' ? 'Mamá' : 'Cachorro') + ' ' + genderIcon + ' ' + p.color + '</div>';
    html += '  </div>';
    if (blk) html += '  <div class="funnel-puppy-block funnel-block-' + blk.toLowerCase() + '">Bloque ' + blk + '</div>';
    html += '  <div class="funnel-puppy-weight">';
    html += '    <div class="funnel-puppy-weight-value">' + (lw ? lw.value + 'g' : '—') + '</div>';
    html += '    <div class="funnel-puppy-weight-label">Peso</div>';
    html += '  </div>';
    html += '  <button class="funnel-puppy-btn" onclick="event.stopPropagation();openPuppyDetail('' + p.id + '')">Ver →</button>';
    html += '</div>';
  }
  html += '</div>';
  
  container.innerHTML = html;
}

function renderBloqueA() {
  renderGroupSection('bloque-a-content', 'Bloque A — Los Lideres', 'Max, Steel, Sydney, Alofoka', getFilteredPuppies('block', 'A'), 'var(--info-bright)');
}

function renderBloqueB() {
  var pups = getFilteredPuppies('block', 'B');
  renderGroupSection('bloque-b-content', 'Bloque B — Los Fuertes + Guerrero', 'Arturo, Chana, Rodotesa, Travieso', pups, 'var(--pink)');
}

function renderHembras() {
  // Include Blanquita at top for hembras
  var blanquita = puppyById('blanquita');
  var hembras = getFilteredPuppies('gender', 'F');
  var all = [];
  if (blanquita) all.push(blanquita);
  for (var i = 0; i < hembras.length; i++) all.push(hembras[i]);
  renderGroupSection('hembras-content', 'Hembras — Las Chicas', 'Blanquita, Chana, Sydney, Alofoka, Rodotesa', all, 'var(--pink)');
}

function renderVarones() {
  renderGroupSection('varones-content', 'Varones — Los Machos', 'Max, Steel, Arturo, Travieso', getFilteredPuppies('gender', 'M'), 'var(--info-bright)');
}


function renderContenido() {
  var container = document.getElementById('contenido-content');
  if (!container) return;
  container.innerHTML = '<div class="page-header"><h1>Contenido para Redes</h1><p>Exporta datos, genera reportes y contenido para redes sociales</p></div><div class="content-tools"><div class="content-card" onclick="exportLoRAData()"><div class="cc-icon">\ud83e\udd16</div><h3>Exportar Datos para LoRA</h3><p>CSV con datos de comportamiento para entrenar modelos de IA</p></div><div class="content-card" onclick="exportPuppyPDF()"><div class="cc-icon">\ud83d\udcc4</div><h3>Reporte de la Camada (TXT)</h3><p>Reporte completo con perfiles, pesos y plan m\u00e9dico</p></div><div class="content-card" onclick="generatePuppyPDF(' + "'" + 'report' + "'" + ')"><div class="cc-icon">\ud83d\udcd5</div><h3>Reporte PDF Profesional</h3><p>PDF con perfiles, plan m\u00e9dico y an\u00e1lisis de crecimiento</p></div><div class="content-card" onclick="generatePuppyPDF(' + "'" + 'pedigree' + "'" + ')"><div class="cc-icon">\ud83d\udcdc</div><h3>Pedigree Viralata (PDF)</h3><p>Certificado de Linaje de Rescate Org\u00e1nico</p></div><div class="content-card" onclick="generatePuppyPDF(' + "'" + 'medical' + "'" + ')"><div class="cc-icon">\ud83d\udc89</div><h3>Plan M\u00e9dico PDF</h3><p>Exporta el calendario m\u00e9dico completo a PDF</p></div><div class="content-card" onclick="openGrowthAnalysisModal()"><div class="cc-icon">\ud83d\udcca</div><h3>An\u00e1lisis de Crecimiento</h3><p>CAGR, medias m\u00f3viles y proyecciones de peso</p></div><div class="content-card" onclick="generateSocialPost()"><div class="cc-icon">\ud83d\udcf1</div><h3>Idea de Post para Redes</h3><p>Contenido listo para publicar con datos actualizados</p></div><div class="content-card" onclick="exportAllDataJSON()"><div class="cc-icon">\ud83d\udce6</div><h3>Exportar Todos los Datos (JSON)</h3><p>Respaldo completo de la aplicaci\u00f3n</p></div><div class="content-card" onclick="importAllData()"><div class="cc-icon">\ud83d\udce5</div><h3>Importar Datos (JSON)</h3><p>Restaurar desde un respaldo anterior</p></div><div class="content-card" onclick="resetAllData()" style="border-color:rgba(224,92,92,0.2);"><div class="cc-icon">\u26a0\ufe0f</div><h3 style="color:var(--danger);">Reiniciar Datos</h3><p style="color:var(--muted);">Borra todos los datos locales</p></div></div><div id="content-preview-area"></div>';
}

function exportLoRAData() {
  var state = getAppState();
  var csv = 'Nombre,G\u00e9nero,Rol,Color,Notas,\u00daltimo_Peso_g,Total_Pesajes,Edad_D\u00edas\n';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    var notes = (state.puppyNotes[p.id] || p.notes).replace(/,/g, ';');
    var latest = getLatestWeight(p.id);
    var history = getWeightHistory(p.id);
    var edad = p.birthDate ? daysUntil(p.birthDate) * -1 : 0;
    csv += p.name + ',' + p.gender + ',' + p.role + ',' + p.color + ',"' + notes + '",' + (latest ? latest.value : '') + ',' + history.length + ',' + edad + '\n';
  }
  var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'datos-lora-cachorros.csv'; a.click();
  showContentPreview('Datos LoRA exportados', 'CSV con ' + PUPPY_DATA.length + ' perfiles listo para entrenamiento.');
}

function generateSocialPost() {
  var state = getAppState();
  var today = getToday();
  var todayFeedings = state.feedings[today] || {};
  var totalFeedsToday = 0;
  for (var key in todayFeedings) {
    var b = todayFeedings[key];
    if (b.blockA) totalFeedsToday++;
    if (b.blockB) totalFeedsToday++;
  }
  var totalWeights = 0;
  for (var key in state.weights) totalWeights += state.weights[key].length;
  var weighted = [];
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    if (PUPPY_DATA[i].id !== 'blanquita') {
      var lw = getLatestWeight(PUPPY_DATA[i].id);
      if (lw) weighted.push({ p: PUPPY_DATA[i], latest: lw });
    }
  }
  var biggest = weighted.length > 0 ? weighted.reduce(function(a,b) { return a.latest.value > b.latest.value ? a : b; }) : null;
  var smallest = weighted.length > 0 ? weighted.reduce(function(a,b) { return a.latest.value < b.latest.value ? a : b; }) : null;
  var daysOld = daysUntil('2026-05-23') * -1;
  var post = 'ACTUALIZACION DE LA CAMADA\n\n';
  post += 'D\u00eda ' + daysOld + ' con Blanquita y sus 8 campeones.\n\n';
  post += 'DATOS DEL DIA:\n';
  post += '\u2022 Peso promedio: ~' + (weighted.length > 0 ? Math.round(weighted.reduce(function(s,w){return s+w.latest.value;},0)/weighted.length) : '\u2014') + 'g\n';
  post += '\u2022 M\u00e1s grandecito: ' + (biggest ? biggest.p.name + ' (' + biggest.latest.value + 'g)' : '\u2014') + '\n';
  post += '\u2022 El guerrero: ' + (smallest ? smallest.p.name + ' (' + smallest.latest.value + 'g)' : '\u2014') + '\n';
  post += '\u2022 Alimentaciones hoy: ' + totalFeedsToday + '/12\n';
  post += '\u2022 Registros totales: ' + totalWeights + '\n\n';
  post += 'PERSONALIDADES:\n';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    var notes = state.puppyNotes[p.id] || p.notes;
    post += p.avatar + ' ' + p.name + ': ' + notes.substring(0, 50) + '\n';
  }
  post += '\n#CachorrosRescatados #Viralatas #Blanquita #CamadaFeliz #RescateAnimal';
  showContentPreview('Post para Redes Sociales', post);
}

function showContentPreview(title, content) {
  var area = document.getElementById('content-preview-area');
  if (!area) return;
  area.innerHTML = '<div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow:hidden;"><div style="padding:12px 16px;border-bottom:0.5px solid var(--border);display:flex;justify-content:space-between;align-items:center;"><span style="font-size:13px;font-weight:500;color:var(--text);">' + title + '</span><button class="btn btn-xs btn-ghost" onclick="copyContentPreview()">Copiar</button></div><div class="export-preview" id="content-preview-text">' + content + '</div></div>';
}

function copyContentPreview() {
  var el = document.getElementById('content-preview-text');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(function() {
    var btn = document.querySelector('#content-preview-area .btn');
    if (btn) { btn.textContent = 'Copiado'; setTimeout(function() { btn.innerHTML = 'Copiar'; }, 2000); }
  });
}

function exportAllDataJSON() {
  var state = getAppState();
  var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'nexus-puppy-flow-backup-' + getToday() + '.json'; a.click();
  showContentPreview('Datos exportados', 'Archivo JSON con todos los datos.');
}

function importAllData() {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      try {
        var data = JSON.parse(ev.target.result);
        if (data.weights || data.feedings) {
          _appState = data;
          saveState();
          showContentPreview('Datos importados', 'Datos restaurados. Recarga para ver cambios.');
          navigateTo(currentSection);
        } else {
          showContentPreview('Error', 'Archivo no v\u00e1lido.');
        }
      } catch(err) {
        showContentPreview('Error', 'No se pudo leer: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ===== PDF EXPORTS ===== */

function generatePuppyPDF(reportType) {
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
    showContentPreview('PDF no disponible', 'La librer\u00eda jsPDF a\u00fan no ha cargado. Intenta de nuevo.');
    return;
  }
  var doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
  var W = 210, margin = 18;
  var date = new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFillColor(20, 20, 22);
  doc.rect(0, 0, W, 42, 'F');
  doc.setFillColor(232, 125, 158);
  doc.roundedRect(margin, 10, 20, 20, 3, 3, 'F');
  doc.setTextColor(20, 20, 22);
  doc.setFontSize(12); doc.setFont('helvetica', 'bold');
  doc.text('\ud83d\udc3e', margin + 5, 23);
  doc.setTextColor(240, 237, 232);
  doc.setFontSize(16); doc.setFont('helvetica', 'bold');
  doc.text('Nexus Puppy Flow', margin + 26, 19);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 145, 140);
  doc.text('Blanquita & Los 8 Campeones', margin + 26, 26);
  doc.text('Fecha: ' + date, margin + 26, 32);
  var labels = { report: 'REPORTE GENERAL', pedigree: 'PEDIGREE VIRALATA', medical: 'PLAN M\u00e9DICO' };
  var labelText = labels[reportType] || 'REPORTE';
  doc.setFontSize(8); doc.setFont('helvetica', 'bold');
  var lw = doc.getTextWidth(labelText) + 8;
  doc.setFillColor(232, 125, 158);
  doc.roundedRect(W - margin - lw, 14, lw, 7, 1.5, 1.5, 'F');
  doc.setTextColor(20, 20, 22);
  doc.text(labelText, W - margin - lw / 2, 19, { align: 'center' });
  var y = 50;
  if (reportType === 'report' || reportType === 'pedigree') {
    doc.setTextColor(232, 125, 158);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('MIEMBROS', margin, y); y += 8;
    var state = getAppState();
    for (var i = 0; i < PUPPY_DATA.length; i++) {
      var p = PUPPY_DATA[i];
      if (y > 260) { doc.addPage(); y = 18; }
      doc.setFillColor(22, 22, 24);
      doc.rect(margin, y, W - margin * 2, 12, 'F');
      doc.setTextColor(240, 237, 232);
      doc.setFontSize(10); doc.setFont('helvetica', 'bold');
      var gIcon = p.role === 'mother' ? '\ud83d\udc51' : p.gender === 'M' ? '\u2642' : '\u2640';
      doc.text(gIcon + ' ' + p.name, margin + 3, y + 5);
      doc.setFontSize(8); doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 145, 140);
      doc.text((p.role==='mother'?'Madre':'Cachorro') + ' \u00b7 ' + p.color, margin + 3, y + 9);
      var lw = getLatestWeight(p.id);
      doc.setTextColor(201, 169, 110);
      doc.text('Peso: ' + (lw ? lw.value + 'g' : '\u2014'), W - margin - 30, y + 5);
      y += 14;
    }
    y += 6;
  }
  if (reportType === 'report' || reportType === 'medical') {
    if (y > 250) { doc.addPage(); y = 18; }
    doc.setTextColor(232, 125, 158);
    doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('PLAN M\u00e9DICO', margin, y); y += 8;
    var state = getAppState();
    var allEvents = [].concat(MEDICAL_EVENTS);
    if (state.customEvents) { for (var i = 0; i < state.customEvents.length; i++) allEvents.push(state.customEvents[i]); }
    allEvents.sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
    for (var i = 0; i < allEvents.length; i++) {
      var e = allEvents[i];
      if (y > 265) { doc.addPage(); y = 18; }
      var isDone = state.medicalStatus[e.id] === 'done';
      doc.setFillColor(isDone ? 20 : 22, isDone ? 30 : 22, isDone ? 20 : 24);
      doc.rect(margin, y, W - margin * 2, 10, 'F');
      doc.setTextColor(isDone ? 76 : 180, isDone ? 173 : 175, isDone ? 124 : 170);
      doc.setFontSize(9); doc.setFont('helvetica', 'bold');
      doc.text((isDone ? '\u2713' : '\u25CB') + ' ' + e.title, margin + 4, y + 4);
      doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 145, 140);
      var ds = new Date(e.date+'T12:00:00').toLocaleDateString('es-DO',{month:'short',day:'numeric'});
      doc.text(ds + ' \u00b7 ' + e.desc.substring(0,70), margin + 4, y + 8);
      y += 11;
    }
  }
  var pageCount = doc.internal.getNumberOfPages();
  for (var i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7); doc.setTextColor(100);
    doc.text('Nexus Puppy Flow', margin, 292);
    doc.text('P\u00e1g. ' + i + ' de ' + pageCount, W - margin, 292, { align: 'right' });
  }
  doc.save('nexus-puppy-flow-' + reportType + '-' + getToday() + '.pdf');
  showContentPreview('PDF generado', 'Documento PDF generado exitosamente (' + reportType + ')');
}

function exportPuppyPDF() {
  var state = getAppState();
  var now = new Date();
  var text = 'NEXUS PUPPY FLOW - Reporte Completo\n';
  text += 'Fecha: ' + now.toLocaleString('es-DO') + '\n\n';
  text += 'MIEMBROS DE LA CAMADA\n';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    var latest = getLatestWeight(p.id);
    var notes = state.puppyNotes[p.id] || p.notes;
    text += '\n' + p.avatar + ' ' + p.name + ' (' + (p.gender==='M'?'Macho':'Hembra') + ')\n';
    text += '   Rol: ' + (p.role==='mother'?'Madre':'Cachorro') + '\n';
    text += '   Color: ' + p.color + '\n';
    text += '   Peso: ' + (latest ? latest.value + 'g' : 'Sin registro') + '\n';
    text += '   Notas: ' + notes + '\n';
  }
  text += '\nREGISTROS DE PESO\n';
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    var p = PUPPY_DATA[i];
    if (p.id === 'blanquita') continue;
    var history = getWeightHistory(p.id);
    text += '\n' + p.name + ': ' + history.length + ' registros';
    if (history.length > 0) text += ' (' + history[0].value + 'g \u2192 ' + history[history.length-1].value + 'g)';
  }
  text += '\n\nPLAN MEDICO\n';
  var allEvents = [].concat(MEDICAL_EVENTS);
  if (state.customEvents) { for (var i = 0; i < state.customEvents.length; i++) allEvents.push(state.customEvents[i]); }
  allEvents.sort(function(a,b) { return new Date(a.date) - new Date(b.date); });
  for (var i = 0; i < allEvents.length; i++) {
    var e = allEvents[i];
    var isDone = state.medicalStatus[e.id] === 'done';
    text += '\n' + (isDone ? '[OK]' : '[  ]') + ' ' + formatDate(e.date) + ' \u2014 ' + e.title + '\n';
    text += '   ' + e.desc + '\n';
  }
  text += '\nFin del reporte';
  var blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reporte-camada-' + getToday() + '.txt'; a.click();
  showContentPreview('Reporte generado', 'Archivo TXT con perfiles, pesos y plan m\u00e9dico.');
}

function openGrowthAnalysisModal() {
  var analyses = analyzeAllPuppies();
  if (analyses.length === 0) {
    showContentPreview('Sin datos', 'Registra al menos 2 pesajes por cachorro.');
    return;
  }
  var avgGain = 0;
  for (var i = 0; i < analyses.length; i++) avgGain += parseFloat(analyses[i].avgDailyGain);
  avgGain /= analyses.length;
  var avgCagr = 0;
  for (var i = 0; i < analyses.length; i++) avgCagr += analyses[i].cagrRaw;
  avgCagr /= analyses.length;
  var maxLatest = 1;
  for (var i = 0; i < analyses.length; i++) { if (analyses[i].latest > maxLatest) maxLatest = analyses[i].latest; }
  var bodyHTML = '<div style="margin-bottom:16px;"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;"><div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Ganancia Diaria</div><div style="font-size:22px;font-weight:700;color:var(--success);font-family:var(--mono);">' + avgGain.toFixed(1) + 'g</div><div style="font-size:9px;color:var(--muted2);">por cachorro</div></div><div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;">Analizados</div><div style="font-size:22px;font-weight:700;color:var(--info);font-family:var(--mono);">' + analyses.length + '</div><div style="font-size:9px;color:var(--muted2);">con datos</div></div><div style="background:var(--bg3);border-radius:var(--radius);padding:12px;text-align:center;"><div style="font-size:10px;color:var(--muted);text-transform:uppercase;">CAGR Promedio</div><div style="font-size:22px;font-weight:700;color:var(--accent);font-family:var(--mono);">' + (avgCagr*100).toFixed(2) + '%</div><div style="font-size:9px;color:var(--muted2);">tasa de crecimiento</div></div></div></div><div style="display:flex;flex-direction:column;gap:10px;">';
  for (var i = 0; i < analyses.length; i++) {
    var a = analyses[i];
    var barPct = (a.latest / maxLatest) * 100;
    var barColor = a.cagrRaw > avgCagr ? 'var(--success-bright)' : 'var(--accent)';
    bodyHTML += '<div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:12px 14px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;"><span style="font-size:13px;font-weight:500;color:var(--text);">' + a.puppyName + '</span><span style="font-size:11px;font-family:var(--mono);color:' + (a.cagrRaw > 0 ? 'var(--success)' : 'var(--danger)') + ';">' + a.cagr + ' CAGR</span></div><div style="margin-bottom:6px;"><div style="height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;"><div style="height:100%;width:' + barPct + '%;background:' + barColor + ';border-radius:3px;"></div></div></div><div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted2);"><span>' + a.first + 'g \u2192 ' + a.latest + 'g</span><span>~' + a.avgDailyGain + 'g/d\u00eda</span></div></div>';
  }
  bodyHTML += '</div>';
  openModal('An\u00e1lisis de Crecimiento', bodyHTML, '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>');
}

function resetAllData() {
  if (!confirm('Borrar TODOS los datos? Esta acci\u00f3n no se puede deshacer.')) return;
  if (!confirm('\u00daltima confirmaci\u00f3n: \u00bfborrar todos los datos?')) return;
  resetAppState();
  showContentPreview('Datos reiniciados', 'Todos los datos han sido borrados.');
  navigateTo('dashboard');
}

/* ===== CHAT UI ===== */

function toggleChat() {
  var panel = document.getElementById('chat-panel');
  var fab = document.getElementById('chat-fab');
  if (!panel) return;
  panel.classList.toggle('open');
  if (fab) fab.classList.toggle('open');
  if (panel.classList.contains('open')) {
    var input = document.getElementById('chat-input');
    if (input) input.focus();
  }
}

function addChatMessage(text, sender, actions) {
  var container = document.getElementById('chat-messages');
  if (!container) return;
  // Save to conversation history
  try {
    var state = getAppState();
    if (!state.conversationHistory) state.conversationHistory = [];
    state.conversationHistory.push({ sender: sender, text: text, timestamp: Date.now() });
    if (state.conversationHistory.length > 100) {
      state.conversationHistory = state.conversationHistory.slice(-100);
    }
    saveState();
  } catch(e) {}
  var div = document.createElement('div');
  div.className = 'chat-msg chat-msg-' + sender;
  var content = document.createElement('div');
  content.className = 'chat-msg-content';
  content.textContent = text;
  div.appendChild(content);
  if (actions && actions.length > 0) {
    var actionDiv = document.createElement('div');
    actionDiv.className = 'chat-msg-actions';
    for (var i = 0; i < actions.length; i++) {
      (function(a) {
        var btn = document.createElement('button');
        btn.className = 'chat-action-btn';
        btn.textContent = a.label;
        btn.onclick = function() {
          if (typeof executeAgentAction === 'function') executeAgentAction(a.action, a.data);
        };
        actionDiv.appendChild(btn);
      })(actions[i]);
    }
    div.appendChild(actionDiv);
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  var input = document.getElementById('chat-input');
  if (!input) return;
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  addChatMessage(text, 'user');
  var contextLines = '';
  try {
    var state = getAppState();
    var hist = state.conversationHistory || [];
    // Exclude the last message if it's from the user (just sent)
    var recent = hist.slice(-11, -1);
    if (recent.length === 0 && hist.length > 0) recent = hist.slice(-1);
    for (var ci = 0; ci < recent.length; ci++) {
      var prefix = recent[ci].sender === 'user' ? 'Usuario' : 'Nexus';
      contextLines += prefix + ': ' + recent[ci].text.substring(0, 200) + '\n';
    }
  } catch(e) {}
  var response = typeof generateAgentResponse === 'function'
    ? generateAgentResponse(text, contextLines)
    : { message: 'Procesando...', actions: [] };
  setTimeout(function() { addChatMessage(response.message, 'agent', response.actions); }, 300);
}

function quickAgentAction(query) {
  addChatMessage(query, 'user');
  var response = typeof generateAgentResponse === 'function'
    ? generateAgentResponse(query)
    : { message: 'Procesando...', actions: [] };
  setTimeout(function() { addChatMessage(response.message, 'agent', response.actions); }, 300);
  var panel = document.getElementById('chat-panel');
  if (panel && !panel.classList.contains('open')) toggleChat();
}

function showChatHelp() {
  var msg = 'Nexus \u2014 Tu Agente de Camada\n\n';
  msg += 'Puedes preguntarme:\n\n';
  msg += '\"C\u00f3mo est\u00e1 Travieso?\"\n';
  msg += '\"Cu\u00e1ndo toca la pr\u00f3xima comida?\"\n';
  msg += '\"Cu\u00e1nto pesa Max?\"\n';
  msg += '\"Dame un resumen\"\n';
  msg += '\"Pr\u00f3ximo evento m\u00e9dico?\"\n';
  msg += '\"Qui\u00e9n es el m\u00e1s pesado?\"\n';
  msg += '\"Tips para cuidarlos\"\n\n';
  msg += 'O dime \"hola\" para saludarte';
  addChatMessage(msg, 'agent', [
    { label: 'Resumen', action: 'BRIEFING' },
    { label: 'Travieso', action: 'TRAVIESO_STATUS' },
    { label: 'Pr\u00f3xima comida', action: 'NEXT_FEEDING' }
  ]);
}

/* ===== SW & NOTIFICATIONS ===== */

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js')
    .then(function(reg) { console.log('SW registrado:', reg.scope); })
    .catch(function(err) { console.warn('SW error:', err); });
}

function clearConversationHistory() {
  try {
    var state = getAppState();
    state.conversationHistory = [];
    saveState();
    var container = document.getElementById('chat-messages');
    if (container) {
      container.innerHTML = '<div class="chat-welcome"><div class="chat-welcome-icon">\ud83d\udcac</div><div class="chat-welcome-text">Conversaci\u00f3n reiniciada. \u00bfEn qu\u00e9 puedo ayudarte?</div></div>';
    }
    showToast('\ud83e\uddf9 Conversaci\u00f3n reiniciada', 'success');
  } catch(e) {}
}

/* ===== INIT ===== */

(function init() {
  navigateTo('dashboard');
  console.log('Nexus Puppy Flow v1.1 iniciado');
  console.log('Cuidando a Blanquita y sus 8 campeones');
  registerServiceWorker();
  if (typeof startNotifEngine === 'function') startNotifEngine();
  if (typeof startBlanquitaChatMonitor === 'function') startBlanquitaChatMonitor();
  var hour = new Date().getHours();
  if (hour >= 6 && hour <= 8 && typeof generateDailyBriefing === 'function') generateDailyBriefing();
  setTimeout(function() {
    var state = getAppState();
    var allEvents = [].concat(MEDICAL_EVENTS);
    if (state.customEvents) {
      for (var i = 0; i < state.customEvents.length; i++) {
        var ce = state.customEvents[i];
        if (!state.medicalStatus[ce.id] || state.medicalStatus[ce.id] !== 'removed') allEvents.push(ce);
      }
    }
    var urgent = [];
    for (var i = 0; i < allEvents.length; i++) {
      var e = allEvents[i];
      var d = daysUntil(e.date);
      if (d <= 0 && d >= -3 && state.medicalStatus[e.id] !== 'done') urgent.push(e);
    }
    if (urgent.length > 0 && typeof sendNotif === 'function') {
      var msg = '';
      for (var i = 0; i < urgent.length; i++) {
        msg += urgent[i].title + ' \u2014 ' + formatDate(urgent[i].date) + '\n';
      }
      sendNotif('Eventos m\u00e9dicos urgentes', msg, 'startup-urgent-' + getToday());
    }
  }, 2000);
})();