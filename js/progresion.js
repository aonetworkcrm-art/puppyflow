/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — PROGRESIÓN v1.0
   Alimentación progresiva por semanas + Costos
   ══════════════════════════════════════════════ */

// ─── Recipe costs (DOP and USD) ───
// Estimated prices in Dominican Republic, June 2026
var RECIPE_COSTS = {
  caldo: {
    dop: 185,
    usd: 3.20,
    breakdown: { pollo: 'RD$80', auyama: 'RD$35', arroz: 'RD$30', agua: 'RD$0', menudencias: 'RD$40' }
  },
  pastel: {
    dop: 225,
    usd: 3.90,
    breakdown: { 'carne molida': 'RD$120', huevos: 'RD$40', avena: 'RD$35', 'aceite oliva': 'RD$30' }
  },
  sardinas: {
    dop: 155,
    usd: 2.70,
    breakdown: { sardinas: 'RD$80', papas: 'RD$35', zanahoria: 'RD$25', agua: 'RD$0' }
  },
  'caldo-ligero': {
    dop: 95,
    usd: 1.65,
    breakdown: { pollo: 'RD$60', agua: 'RD$0', 'carne desmenuzada': 'RD$35' }
  }
};

// ─── Daily total cost for Blanquita ───
function getBlanquitaDailyCost() {
  var menu = getTodaysBlanquitaMenu ? getTodaysBlanquitaMenu() : [];
  var totalDOP = 0;
  var seen = {};
  for (var i = 0; i < menu.length; i++) {
    var rid = menu[i].recipeId;
    if (!seen[rid] && RECIPE_COSTS[rid]) {
      totalDOP += RECIPE_COSTS[rid].dop;
      seen[rid] = true;
    }
  }
  var totalUSD = (totalDOP / 58).toFixed(2);
  return { dop: totalDOP, usd: parseFloat(totalUSD) };
}

// ─── Weekly cost for Blanquita ───
function getBlanquitaWeeklyCost() {
  var total = 0;
  var seen = {};
  for (var d = 0; d < 7; d++) {
    var dayRecipes = BLANQUITA_MENU ? BLANQUITA_MENU[d] : [];
    for (var i = 0; i < dayRecipes.length; i++) {
      var rid = dayRecipes[i];
      if (!seen[rid] && RECIPE_COSTS[rid]) {
        total += RECIPE_COSTS[rid].dop;
        seen[rid] = true;
      }
    }
  }
  // Each recipe is used multiple times per week, calculate actual weekly cost
  var actualWeekly = 0;
  for (var d = 0; d < 7; d++) {
    var dayRecipes = BLANQUITA_MENU ? BLANQUITA_MENU[d] : [];
    for (var i = 0; i < dayRecipes.length; i++) {
      var rid = dayRecipes[i];
      if (RECIPE_COSTS[rid]) actualWeekly += RECIPE_COSTS[rid].dop;
    }
  }
  return { dop: actualWeekly, usd: parseFloat((actualWeekly / 58).toFixed(2)) };
}

// ─── Puppy Feeding Progression by Week ───
var PUPPY_FEEDING_PROGRESSION = [
  { week: 1, label: 'Semana 1 (0-7 días)', diet: 'Solo leche materna', freq: 'Cada 2 horas (12-14 veces/día)', temp: '37°C', amount: '5-10ml por toma', notes: 'Calor corporal de Blanquita. No separar.', weight: '100-250g' },
  { week: 2, label: 'Semana 2 (8-14 días)', diet: 'Solo leche materna', freq: 'Cada 2-3 horas (10-12 veces/día)', temp: '37°C', amount: '10-20ml por toma', notes: 'Ojos empiezan a abrir. Ya comienzan a reptar.', weight: '250-450g' },
  { week: 3, label: 'Semana 3 (15-21 días)', diet: 'Leche materna + inicio papilla', freq: 'Cada 3-4 horas (8-10 veces/día)', temp: '35-37°C', amount: '20-40ml por toma', notes: '🐛 INICIO PAPILLA: Leche maternizada + agua tibia. Textura muy líquida. 1-2 veces/día.', weight: '450-800g' },
  { week: 4, label: 'Semana 4 (22-28 días)', diet: 'Leche + papilla 3-4 veces/día', freq: 'Cada 4 horas (6-8 veces/día)', temp: '35°C', amount: '40-60ml por toma', notes: 'Papilla más espesa: leche + arroz + pollo triturado. Aumentar 1-2 tomas de papilla.', weight: '800-1200g' },
  { week: 5, label: 'Semana 5 (29-35 días)', diet: 'Papilla + inicio alimento sólido', freq: 'Cada 4-5 horas (5-6 veces/día)', temp: 'Tibio ambiente', amount: '60-90g', notes: '🍗 INTRODUCIR: Pollo cocido desmenuzado + arroz + auyama. Empiezan a beber agua.', weight: '1.2-1.8kg' },
  { week: 6, label: 'Semana 6 (36-42 días)', diet: 'Papilla espesa + sólidos', freq: 'Cada 5 horas (4-5 veces/día)', temp: 'Ambiente', amount: '80-120g', notes: 'Aumentar sólidos: pollo, res, auyama, arroz. Disminuir leche gradualmente.', weight: '1.8-2.5kg' },
  { week: 7, label: 'Semana 7 (43-49 días)', diet: 'Sólidos + papilla 1-2 veces', freq: 'Cada 5-6 horas (4 veces/día)', temp: 'Ambiente', amount: '100-150g', notes: '🔴 VACUNA PUPPY día 45-49. Ya casi no necesitan leche. Comida completa.', weight: '2.5-3.2kg' },
  { week: 8, label: 'Semana 8 (50-56 días)', diet: 'Comida sólida completa', freq: 'Cada 6 horas (3-4 veces/día)', temp: 'Ambiente', amount: '150-200g', notes: '✅ DESTETE COMPLETO. Comida de cachorro 4 veces/día. Buscar nuevos hogares.', weight: '3.2-4kg' },
  { week: 9, label: 'Semana 9-12 (2-3 meses)', diet: 'Comida sólida', freq: '3-4 veces/día', temp: 'Ambiente', amount: '200-300g', notes: 'Alimento balanceado para cachorros + pollo/arroz. Desparasitación #2 y #3.', weight: '4-7kg' },
  { week: 12, label: '3 meses+', diet: 'Comida sólida adulta progresiva', freq: '3 veces/día', temp: 'Ambiente', amount: '300-400g', notes: 'Vacuna antirrábica a los 3 meses. Transición a comida de adulto.', weight: '7-12kg' }
];

// ─── Get current puppy week since birth ───
function getPuppyWeek() {
  var birthDate = new Date('2026-05-23T12:00:00');
  var now = new Date();
  var diffDays = Math.floor((now - birthDate) / (1000 * 60 * 60 * 24));
  var week = Math.floor(diffDays / 7) + 1;
  return { week: week, days: diffDays, clamped: Math.min(Math.max(week, 1), PUPPY_FEEDING_PROGRESSION.length) };
}

// ─── Render the progression section ───
function renderProgresion() {
  var container = document.getElementById('progresion-content');
  if (!container) return;
  
  var puppyInfo = getPuppyWeek();
  var currentWeek = Math.min(puppyInfo.week, PUPPY_FEEDING_PROGRESSION.length);
  var currentStage = PUPPY_FEEDING_PROGRESSION[currentWeek - 1] || PUPPY_FEEDING_PROGRESSION[0];
  
  var html = '';
  
  // Current stage banner
  html += '<div class="next-feeding-banner" style="background:linear-gradient(135deg,var(--bg3),rgba(201,169,110,0.06));border-color:rgba(201,169,110,0.2);">';
  html += '  <div>';
  html += '    <div class="nfb-label">🐛 Etapa Actual</div>';
  html += '    <div class="nfb-time" style="font-size:22px;color:var(--accent);">' + currentStage.label + '</div>';
  html += '    <div class="nfb-block">Día ' + puppyInfo.days + ' | Peso estimado: ' + currentStage.weight + '</div>';
  html += '  </div>';
  html += '  <div class="nfb-countdown">';
  html += '    <div class="nfb-cd-label">Dieta</div>';
  html += '    <div class="nfb-cd-value" style="font-size:15px;color:var(--success);">' + currentStage.diet + '</div>';
  html += '    <div class="nfb-block">' + currentStage.freq + '</div>';
  html += '  </div>';
  html += '</div>';
  
  // Stats cards
  html += '<div class="feed-overview-grid" style="margin-bottom:14px;">';
  html += '  <div class="feed-stat-card"><div class="fs-icon">🍼</div><div class="fs-label">Frecuencia</div><div class="fs-value" style="font-size:13px;color:var(--pink);">' + currentStage.freq + '</div><div class="fs-sub">' + currentStage.amount + '</div></div>';
  html += '  <div class="feed-stat-card"><div class="fs-icon">🌡️</div><div class="fs-label">Temperatura</div><div class="fs-value" style="font-size:16px;color:var(--warning);">' + currentStage.temp + '</div><div class="fs-sub">Ideal para servir</div></div>';
  html += '  <div class="feed-stat-card"><div class="fs-icon">⚖️</div><div class="fs-label">Peso esperado</div><div class="fs-value" style="font-size:16px;color:var(--info);">' + currentStage.weight + '</div><div class="fs-sub">Rango saludable</div></div>';
  html += '  <div class="feed-stat-card"><div class="fs-icon">📋</div><div class="fs-label">Nota clave</div><div class="fs-value" style="font-size:12px;color:var(--accent);">' + (currentStage.notes.substring(0, 40) + '...') + '</div><div class="fs-sub">Hito importante</div></div>';
  html += '</div>';
  
  // Timeline
  html += '<div style="margin-bottom:12px;"><div class="funnel-section-label" style="font-size:14px;">📈 Progresión Completa</div></div>';
  html += '<div class="medical-timeline">';
  
  for (var i = 0; i < PUPPY_FEEDING_PROGRESSION.length; i++) {
    var s = PUPPY_FEEDING_PROGRESSION[i];
    var isCurrent = i === currentWeek - 1;
    var isPast = i < currentWeek - 1;
    var icon = isCurrent ? '🐛' : isPast ? '✅' : '⏳';
    var cls = isCurrent ? 'event-urgent' : isPast ? 'event-done' : '';
    
    html += '<div class="timeline-event ' + cls + '" style="' + (isCurrent ? 'border-color:rgba(201,169,110,0.3);' : '') + '">';
    html += '  <div style="display:flex;justify-content:space-between;align-items:flex-start;">';
    html += '    <div style="flex:1;">';
    html += '      <div class="event-date">' + icon + ' ' + s.label + '</div>';
    html += '      <div class="event-title" style="font-size:13px;">' + s.diet + '</div>';
    html += '      <div class="event-desc">' + s.notes + '</div>';
    html += '      <div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;">';
    html += '        <span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(232,125,158,0.1);color:var(--pink);">' + s.freq + '</span>';
    html += '        <span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(74,122,204,0.1);color:var(--info);">' + s.amount + '</span>';
    html += '        <span style="font-size:9px;padding:1px 6px;border-radius:3px;background:rgba(46,204,113,0.1);color:var(--success);">' + s.weight + '</span>';
    html += '      </div>';
    html += '    </div>';
    html += '    <div style="font-size:16px;opacity:0.5;">' + icon + '</div>';
    html += '  </div>';
    html += '</div>';
  }
  
  html += '</div>';
  
  container.innerHTML = html;
}

// ─── Render the costos section ───
function renderCostos() {
  var container = document.getElementById('costos-content');
  if (!container) return;
  
  var daily = getBlanquitaDailyCost();
  var weekly = getBlanquitaWeeklyCost();
  var monthly = { dop: weekly.dop * 4, usd: parseFloat((weekly.usd * 4).toFixed(2)) };
  
  var html = '';
  
  // Summary banner
  html += '<div class="next-feeding-banner" style="background:linear-gradient(135deg,var(--bg3),rgba(46,204,113,0.05));border-color:rgba(46,204,113,0.2);">';
  html += '  <div>';
  html += '    <div class="nfb-label">💰 Costos de Alimentación — Blanquita</div>';
  html += '    <div class="nfb-time" style="font-size:18px;color:var(--success);">RD$' + daily.dop + '/día</div>';
  html += '    <div class="nfb-block">~USD $' + daily.usd + ' por día</div>';
  html += '  </div>';
  html += '  <div class="nfb-countdown">';
  html += '    <div class="nfb-cd-label">Promedio semanal</div>';
  html += '    <div class="nfb-cd-value" style="font-size:22px;color:var(--accent);">RD$' + weekly.dop + '</div>';
  html += '    <div class="nfb-block">~USD $' + weekly.usd + ' / mes: RD$' + monthly.dop + '</div>';
  html += '  </div>';
  html += '</div>';
  
  // Recipe cost cards
  html += '<div class="funnel-section-label" style="font-size:14px;margin-bottom:10px;">🍲 Costo por Receta</div>';
  html += '<div class="schedule-grid">';
  
  var recipeKeys = ['caldo', 'pastel', 'sardinas', 'caldo-ligero'];
  var recipeNames = {
    caldo: 'Súper Caldo Levantamuertos',
    pastel: 'Pastel de Carne y Huevo',
    sardinas: 'Banquete del Atlántico',
    'caldo-ligero': 'Refuerzo de Caldo Tibio'
  };
  var recipeIcons = { caldo: '🍲', pastel: '🥩', sardinas: '🐟', 'caldo-ligero': '☕' };
  
  for (var i = 0; i < recipeKeys.length; i++) {
    var key = recipeKeys[i];
    var cost = RECIPE_COSTS[key];
    var r = RECIPES ? RECIPES[key] : null;
    if (!cost || !r) continue;
    
    html += '<div class="feed-block" style="border-color:rgba(46,204,113,0.1);">';
    html += '  <div class="feed-block-header">';
    html += '    <span class="feed-time">' + (recipeIcons[key] || '🍽️') + ' ' + r.name.substring(0, 24) + '</span>';
    html += '  </div>';
    html += '  <div class="feed-block-body">';
    html += '    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html += '      <span style="font-size:16px;font-weight:700;font-family:var(--mono);color:var(--success);">RD$' + cost.dop + '</span>';
    html += '      <span style="font-size:12px;color:var(--muted2);">USD $' + cost.usd + '</span>';
    html += '    </div>';
    // Breakdown
    var keys = Object.keys(cost.breakdown);
    for (var j = 0; j < keys.length; j++) {
      html += '    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);padding:1px 0;">';
      html += '      <span>' + keys[j] + '</span>';
      html += '      <span>' + cost.breakdown[keys[j]] + '</span>';
      html += '    </div>';
    }
    html += '  </div>';
    html += '</div>';
  }
  
  html += '</div>';
  
  // Weekly projection table
  html += '<div class="funnel-section-label" style="font-size:14px;margin:14px 0 10px;">📅 Proyección Mensual</div>';
  html += '<div class="feed-overview-grid">';
  html += '  <div class="feed-stat-card"><div class="fs-icon">📅</div><div class="fs-label">Diario</div><div class="fs-value" style="font-size:16px;color:var(--success);">RD$' + daily.dop + '</div><div class="fs-sub">USD $' + daily.usd + '</div></div>';
  html += '  <div class="feed-stat-card"><div class="fs-icon">📅</div><div class="fs-label">Semanal</div><div class="fs-value" style="font-size:16px;color:var(--accent);">RD$' + weekly.dop + '</div><div class="fs-sub">USD $' + weekly.usd + '</div></div>';
  html += '  <div class="feed-stat-card"><div class="fs-icon">📅</div><div class="fs-label">Mensual</div><div class="fs-value" style="font-size:16px;color:var(--pink);">RD$' + monthly.dop + '</div><div class="fs-sub">USD $' + monthly.usd + '</div></div>';
  html += '  <div class="feed-stat-card"><div class="fs-icon">💰</div><div class="fs-label">Tasa cambio</div><div class="fs-value" style="font-size:14px;color:var(--info);">58 DOP/USD</div><div class="fs-sub">Estimada Junio 2026</div></div>';
  html += '</div>';
  
  container.innerHTML = html;
}
