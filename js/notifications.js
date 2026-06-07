/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — NOTIFICATION ENGINE v1.0
   Sistema de notificaciones push en el navegador
   ══════════════════════════════════════════════ */

const NOTIF_ICON = '🐾';

// ═══ Permission ═══
async function requestNotifPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// ═══ Send notification ═══
function sendNotif(title, body, tag, data = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    // Use service worker if available for better behavior
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'NOTIFICATION',
        payload: { title, body, tag, data: { ...data, url: './index.html' } }
      });
    }
    // Also fire directly
    new Notification('🐾 ' + title, {
      body,
      icon: NOTIF_ICON,
      badge: NOTIF_ICON,
      tag: tag || 'puppy-general',
      requireInteraction: true,
      vibrate: [200, 100, 200],
      silent: false,
      data: { url: './index.html', ...data }
    });
  } catch (e) {
    console.warn('Notif error:', e);
  }
}

// ═══ Check & notify feeding times ═══
let _lastFeedingNotif = {}; // { "2026-06-07_02:00_blockA": true }

function checkFeedingNotifications() {
  const state = getAppState();
  const today = getToday();
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  FEEDING_TIMES.forEach(ft => {
    const [h, m] = ft.time.split(':').map(Number);
    const ftMinutes = h * 60 + m;
    const diff = currentMinutes - ftMinutes;

    // Notify 5 min before
    if (diff >= -5 && diff <= 0) {
      ['A', 'B'].forEach(block => {
        const key = `${today}_${ft.time}_block${block}`;
        if (_lastFeedingNotif[key]) return;

        const blockData = FEEDING_BLOCKS[block];
        const members = blockData.members.map(id => puppyById(id)?.name || id).join(', ');
        const isTraviesoBlock = block === 'B';

        sendNotif(
          `🍼 Alimentación — ${ft.time} (${ft.label})`,
          `🔵 Bloque ${block}: ${members}\n${isTraviesoBlock ? '⭐ Travieso primero en tetas traseras de Blanquita' : 'Grupo A — los más tranquilos'}\n\nOrden: Bloque A primero (15-20 min) → luego Bloque B`,
          `feeding-${today}-${ft.time}-${block}`,
          { section: 'alimentacion', time: ft.time, block }
        );

        _lastFeedingNotif[key] = true;
      });
    }
  });

  // Clean old entries (keep last 3 days)
  const keys = Object.keys(_lastFeedingNotif);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 3);
  keys.forEach(k => {
    const datePart = k.split('_')[0];
    if (datePart < getToday()) delete _lastFeedingNotif[k];
  });
}

// ═══ Check medical event alerts ═══
let _lastMedNotif = {};

function checkMedicalNotifications() {
  const state = getAppState();
  const today = getToday();

  const allEvents = [
    ...MEDICAL_EVENTS,
    ...(state.customEvents || []).filter(ce => !state.medicalStatus[ce.id] || state.medicalStatus[ce.id] !== 'removed')
  ];

  allEvents.forEach(e => {
    if (state.medicalStatus[e.id] === 'done') return;
    const days = daysUntil(e.date);
    const key = `med_${e.id}_${today}`;
    if (_lastMedNotif[key]) return;

    // Notify when -1 (yesterday/overdue), 0 (today), 1 (tomorrow), 3 (3 days before), 7 (a week before)
    const notifyDays = [-1, 0, 1, 3, 7];
    if (notifyDays.includes(days)) {
      const urgencyLabel = days < 0 ? '🔴 ATRASADO' : days === 0 ? '🚨 HOY' : `📅 en ${days} días`;
      const typeIcons = { deworming: '💊', vaccine: '💉', bath: '🛁', checkup: '🔍', other: '📋' };

      sendNotif(
        `${typeIcons[e.type] || '📋'} ${e.title}`,
        `${urgencyLabel} — ${formatDate(e.date)}\n${e.desc.substring(0, 100)}`,
        `medical-${e.id}`,
        { section: 'medicina', eventId: e.id }
      );

      _lastMedNotif[key] = true;
    }
  });

  // Clean old
  const medKeys = Object.keys(_lastMedNotif);
  medKeys.forEach(k => {
    const parts = k.split('_');
    const dateStr = parts[parts.length - 1];
    if (dateStr < today) delete _lastMedNotif[k];
  });
}

// ═══ Daily briefing check ═══
let _lastBriefingDate = '';

function checkDailyBriefing() {
  const today = getToday();
  if (_lastBriefingDate === today) return;

  const now = new Date();
  const hour = now.getHours();
  // Send briefing between 6:00 and 7:59 AM
  if (hour < 6 || hour > 7) return;

  _lastBriefingDate = today;
  generateDailyBriefing();
}

// ═══ Generate daily briefing content ═══
function generateDailyBriefing() {
  const state = getAppState();
  const today = getToday();
  const todayFeedings = state.feedings[today] || {};

  let totalFeedsYesterday = 0;
  Object.values(todayFeedings).forEach(b => {
    if (b.blockA) totalFeedsYesterday++;
    if (b.blockB) totalFeedsYesterday++;
  });

  // Yesterday date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('es-DO', { weekday: 'long', month: 'long', day: 'numeric' });

  // Puppy weight status
  const puppies = PUPPY_DATA.filter(p => p.id !== 'blanquita');
  const weighted = puppies.map(p => ({ ...p, latest: getLatestWeight(p.id) })).filter(p => p.latest);
  const avgWeight = weighted.length > 0
    ? Math.round(weighted.reduce((s, p) => s + p.latest.value, 0) / weighted.length)
    : 0;
  const smallest = weighted.length > 0
    ? weighted.reduce((min, p) => p.latest.value < min.latest.value ? p : min, weighted[0])
    : null;
  const daysOld = daysUntil('2026-05-23') * -1;

  // Upcoming medical
  const allEvents = [
    ...MEDICAL_EVENTS,
    ...(state.customEvents || []).filter(ce => !state.medicalStatus[ce.id] || state.medicalStatus[ce.id] !== 'removed')
  ];
  const nextMed = allEvents.filter(e => state.medicalStatus[e.id] !== 'done')
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date))
    .slice(0, 2);

  // Today's feeding schedule
  const todayFeedSchedule = FEEDING_TIMES.map(ft => {
    const f = todayFeedings[ft.time] || {};
    const status = f.blockA && f.blockB ? '✅' : '⏳';
    return `${status} ${ft.time} — ${ft.label}`;
  }).join('\n');

  // Travieso status
  const traviesoWeight = getLatestWeight('travieso');
  const traviesoHistory = getWeightHistory('travieso');
  let traviesoStatus = '⚠️ Sin datos de peso aún';
  if (traviesoHistory.length >= 2) {
    const first = traviesoHistory[0].value;
    const last = traviesoHistory[traviesoHistory.length - 1].value;
    const gain = last - first;
    traviesoStatus = `📈 ${first}g → ${last}g (${gain > 0 ? '+' : ''}${gain}g)`;
  } else if (traviesoWeight) {
    traviesoStatus = `⚖️ Último peso: ${traviesoWeight.value}g`;
  }

  const briefing = {
    title: `🌅 Buenos días, ${yesterdayStr}`,
    sections: [
      {
        icon: '🐾',
        title: 'Resumen de la Camada',
        lines: [
          `Día ${daysOld} con Blanquita y los 8 campeones`,
          `Peso promedio: ${avgWeight > 0 ? avgWeight + 'g' : '—'} (${weighted.length} cachorros)`,
          `El más pequeñito: ${smallest ? smallest.name + ' (' + smallest.latest.value + 'g)' : '—'}`,
          `Alimentaciones ayer: ${totalFeedsYesterday}/12`
        ]
      },
      {
        icon: '⭐',
        title: 'Travieso — El Guerrero',
        lines: [traviesoStatus]
      },
      {
        icon: '🍼',
        title: 'Alimentación Hoy',
        lines: [
          todayFeedSchedule,
          '',
          '📌 Orden: Bloque A primero → Bloque B (Travieso en tetas traseras)'
        ]
      },
      ...(nextMed.length > 0 ? [{
        icon: '💉',
        title: 'Próximos Eventos Médicos',
        lines: nextMed.map(e => {
          const days = daysUntil(e.date);
          const statusLabel = days < 0 ? '🔴 ATRASADO' : days === 0 ? '🚨 HOY' : `📅 en ${days} días`;
          return `${statusLabel}: ${e.title} — ${formatDate(e.date)}`;
        })
      }] : [])
    ],
    tips: [
      '✅ Revisa las tetas de Blanquita: si están calientes o duras → veterinario URGENTE',
      '🐶 Pesa a los cachorros hoy y registra en la app',
      '🧹 Mantén el área seca y sin corrientes de aire'
    ]
  };

  // Send as notification
  const bodyText = briefing.sections.map(s =>
    `${s.icon} ${s.title}\n${s.lines.filter(l => l).join('\n')}`
  ).join('\n\n');

  sendNotif(
    briefing.title,
    bodyText.substring(0, 200) + '…',
    `briefing-${today}`,
    { section: 'dashboard', briefing: true }
  );

  // Also store for the UI
  window._lastBriefing = briefing;
}

// ═══ Notification loop (runs every 60 seconds) ═══
let _notifInterval = null;


// ═══ Check Blanquita meal reminders ═══
let _lastBlanquitaMealNotif = {};

function checkBlanquitaMealNotifications() {
  if (typeof getTodaysBlanquitaMenu !== 'function' || typeof BLANQUITA_MEAL_TIMES === 'undefined') return;
  var state = getAppState();
  var today = getToday();
  var now = new Date();
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  var menu = getTodaysBlanquitaMenu();
  if (!menu || menu.length === 0) return;

  // Check if reminders are enabled
  var reminders = state.blanquitaReminders;
  var reminderMinutes = 5;
  if (reminders && reminders.enabled) {
    reminderMinutes = reminders.minutesBefore || 5;
  } else {
    checkBlanquitaOverdueAlert(state, today, menu, currentMinutes);
    return;
  }

  // Check each meal time
  var mealsToday = state.blanquitaMeals?.[today] || {};
  for (var mi = 0; mi < menu.length; mi++) {
    var m = menu[mi];
    var parts = m.time.split(':');
    var mealMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);

    if (mealsToday[m.time]?.served) continue;

    // Notify at reminderMinutes before meal time
    var diff = currentMinutes - (mealMinutes - reminderMinutes);
    var key = today + '_' + m.time;
    if (diff >= 0 && diff <= 2) {
      if (_lastBlanquitaMealNotif[key]) continue;
      _lastBlanquitaMealNotif[key] = true;

      var countdown = '';
      if (currentMinutes < mealMinutes) {
        var minsLeft = mealMinutes - currentMinutes;
        countdown = ' en ' + minsLeft + ' min';
      }

      sendNotif(
        '\U0001f372 ' + m.label + ' de Blanquita' + countdown,
        m.recipe.icon + ' ' + m.recipe.name + '\nPorci\u00f3n: ' + m.portion + 'g\n\n' + m.recipe.benefit,
        'blanquita-meal-' + today + '-' + m.time,
        { section: 'comidas', mealTime: m.time }
      );
    }

    // Alert if meal is >30 min past due and not served
    var pastDue = currentMinutes - (mealMinutes + 30);
    if (pastDue > 0 && pastDue <= 2 && !mealsToday[m.time]?.served) {
      var lateKey = today + '_' + m.time + '_late';
      if (_lastBlanquitaMealNotif[lateKey]) continue;
      _lastBlanquitaMealNotif[lateKey] = true;

      sendNotif(
        '\u26a0\ufe0f Comida de Blanquita pendiente — ' + m.time,
        m.recipe.icon + ' ' + m.recipe.name + ' debi\u00f3 servirse a las ' + m.time + '\n\n\u00a1Prep\u00e1rale su plato ahora!',
        'blanquita-meal-late-' + today + '-' + m.time,
        { section: 'comidas', mealTime: m.time }
      );
    }
  }

  // Check for overdue alert (no meal in >4 hours)
  checkBlanquitaOverdueAlert(state, today, menu, currentMinutes);
}

function checkBlanquitaOverdueAlert(state, today, menu, currentMinutes) {
  var mealsToday = state.blanquitaMeals?.[today] || {};
  var lastServedTime = null;
  for (var mi = menu.length - 1; mi >= 0; mi--) {
    if (mealsToday[menu[mi].time]?.served) {
      lastServedTime = menu[mi].time;
      break;
    }
  }
  if (!lastServedTime) {
    // No meals served yet today - alert after 7:30 AM
    if (currentMinutes >= 450) {
      var overdueKey = today + '_overdue';
      if (_lastBlanquitaMealNotif[overdueKey]) return;
      _lastBlanquitaMealNotif[overdueKey] = true;
      var hourStr = String(Math.floor(currentMinutes/60)).padStart(2,'0');
      var minStr = String(currentMinutes%60).padStart(2,'0');
      sendNotif(
        '\U0001f6a8 \u00a1Blanquita no ha comido hoy!',
        'Ya son las ' + hourStr + ':' + minStr + ' y Blanquita no ha recibido su primera comida.\n\nSu primer plato: ' + (menu[0] ? menu[0].recipe.icon + ' ' + menu[0].recipe.name : 'Comida real'),
        'blanquita-overdue-' + today,
        { section: 'comidas' }
      );
    }
    return;
  }
  // Check hours since last meal
  var parts = lastServedTime.split(':');
  var lastMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  var hoursSinceLastMeal = (currentMinutes - lastMinutes) / 60;
  if (hoursSinceLastMeal >= 4 && hoursSinceLastMeal < 4.5) {
    var warnKey = today + '_' + lastServedTime + '_4h';
    if (_lastBlanquitaMealNotif[warnKey]) return;
    _lastBlanquitaMealNotif[warnKey] = true;
    // Find next meal
    var nextMeal = null;
    for (var mi = 0; mi < menu.length; mi++) {
      var pts = menu[mi].time.split(':');
      if (parseInt(pts[0])*60 + parseInt(pts[1]) > currentMinutes) {
        nextMeal = menu[mi];
        break;
      }
    }
    var msg = 'Ultima comida fue hace ' + Math.round(hoursSinceLastMeal) + ' horas.';
    if (nextMeal) msg += '\n\nProximo plato: ' + nextMeal.recipe.icon + ' ' + nextMeal.recipe.name + ' a las ' + nextMeal.time;
    sendNotif(
      '\u26a0\ufe0f Blanquita lleva ' + Math.round(hoursSinceLastMeal) + 'h sin comer',
      msg,
      'blanquita-4h-' + today,
      { section: 'comidas' }
    );
  }
}

function startNotifEngine() {
  if (_notifInterval) return;
  requestNotifPermission().then(granted => {
    if (!granted) {
      console.log('Notificaciones no permitidas. Las alertas serán solo en pantalla.');
    }
    _notifInterval = setInterval(() => {
      checkFeedingNotifications();
      checkMedicalNotifications();
      checkBlanquitaMealNotifications();
      checkDailyBriefing();
    }, 60000); // every 60s
    // Run once immediately
    checkFeedingNotifications();
    checkMedicalNotifications();
    checkDailyBriefing();
  });
}

function stopNotifEngine() {
  if (_notifInterval) {
    clearInterval(_notifInterval);
    _notifInterval = null;
  }
}
