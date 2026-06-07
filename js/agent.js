/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — AGENTE IA CHAT v1.0
   Motor conversacional con detección de intenciones
   ══════════════════════════════════════════════ */

const AGENT_PERSONALITY = {
  name: 'Nexus',
  role: 'Asistente de Camada',
  style: 'Profesional, cálido, directo. Habla como un cuidador experto de perros.',
  emoji: '🐾'
};

// Conversation context (set by sendChatMessage)
let _lastContext = '';

// ─── Intent detection ───
function detectIntent(input) {
  const q = input.toLowerCase().trim();

  // Estado / cómo está
  if (/c(o|ó)mo está|qu(é|e) tal|c(o|ó)mo sigue|estado de/i.test(q)) {
    return { type: 'STATUS', target: extractPuppyName(q) };
  }

  // Peso
  if (/pes(o|ó)|cu(á|a)nto pesa|gramos|balanza/i.test(q)) {
    return { type: 'WEIGHT', target: extractPuppyName(q) };
  }

  // Próxima alimentación
  if (/pr(o|ó)xim(a|o) alimentaci(o|ó)n|cu(á|a)ndo toca comer|hora de comer|hambre/i.test(q)) {
    return { type: 'NEXT_FEEDING' };
  }

  // Alimentación hoy
  if (/alimentaci(o|ó)n (de )?hoy|qu(é|e) toca hoy|comidas hoy|horario (de )?hoy/i.test(q)) {
    return { type: 'FEEDING_TODAY' };
  }

  // Próximo evento médico
  if (/pr(o|ó)xim(a|o) (evento|vacuna|desparasitaci(o|ó)n|cita|medic(o|a))|cu(á|a)ndo toca (vacuna|desparasit|medicina)/i.test(q)) {
    return { type: 'NEXT_MEDICAL' };
  }

  // Resumen / briefing
  if (/resumen|briefing|qu(é|e) hay de nuevo|c(o|ó)mo vamos|dame un resumen|panorama/i.test(q)) {
    return { type: 'BRIEFING' };
  }

  // Blanquita — qué come hoy
  if (/(blanquita\s+)?(qu(é|e) come|qu(é|e) receta|men(ú|u) de|comidas? de|qu(é|e) toca cocinar|plato de|alimentaci(o|ó)n de)/i.test(q) && /blanquita/i.test(q)) {
    return { type: 'BLANQUITA_MEALS_TODAY' };
  }

  // Blanquita — próxima comida
  if (/pr(o|ó)xim(a|o) comida (de )?blanquita|cu(á|a)ndo (toca|come|va a comer) blanquita|blanquita (va a )?comer|pr(o|ó)ximo plato|hora de comer (de )?blanquita/i.test(q)) {
    return { type: 'BLANQUITA_NEXT_MEAL' };
  }

  // Blanquita — estado / ya comió
  if (/(ya comi(o|ó)|ha comido|c(o|ó)mo van las comidas|comi(o|ó) hoy|le diste de comer|est(á|a) alimentada|blanquita (ya )?comi(o|ó)|va( n)?(dieta)?)/i.test(q) && /blanquita/i.test(q) && !/qu(é|e) (come|receta|plato)/i.test(q)) {
    return { type: 'BLANQUITA_MEAL_STATUS' };
  }

  // Receta de Blanquita
  if (/(c(o|ó)mo (preparo|hago|se hace)|dame la receta|receta de|preparaci(o|ó)n de|pasos para|ingredientes (del|de la))/i.test(q) && /(caldo|levantamuertos|pastel de carne|banquete|sardinas|atl(á|a)ntico|refuerzo|caldo ligero|blanquita)/i.test(q)) {
    return { type: 'BLANQUITA_RECIPE' };
  }

  // Travieso específicamente
  if (/travieso/i.test(q) && /c(o|ó)mo est(á|a)|progreso|va bien|ganando|peso|creciendo|guerrero/i.test(q)) {
    return { type: 'TRAVIESO_STATUS' };
  }

  // Quién es el más...
  if (/m(á|a)s (grande|pesado|fuerte|gordo)|el (que|m(á|a)s) pesa|l(í|i)der/i.test(q)) {
    return { type: 'BIGGEST' };
  }

  if (/m(á|a)s (pequeñ|chiquito|liviano|d(é|e)bil)|el que menos pesa|el m(á|a)s chiquito/i.test(q)) {
    return { type: 'SMALLEST' };
  }

  // Navegación a grupos
  if (/bloque a|bloque A|grupo a|grupo A|los l(i|í)deres/i.test(q)) {
    return { type: 'GO_TO_SECTION', target: 'bloque-a' };
  }
  if (/bloque b|bloque B|grupo b|grupo B|los fuertes/i.test(q)) {
    return { type: 'GO_TO_SECTION', target: 'bloque-b' };
  }
  if (/hembras|las chicas|las hembras|perras|mujeres/i.test(q) && !/blanquita.*comida|comidas.*blanquita/i.test(q)) {
    return { type: 'GO_TO_SECTION', target: 'hembras' };
  }
  if (/varones|los machos|los varones|perros|hombres/i.test(q) && !/alimentaci/i.test(q)) {
    return { type: 'GO_TO_SECTION', target: 'varones' };
  }
  // Progresión / semanas
  if (/progresi(o|ó)n|semanas|etapas|crecimiento|cachorro.*semana|alimentaci(o|ó)n.*semana|destete|papilla/i.test(q)) {
    return { type: 'GO_TO_SECTION', target: 'progresion' };
  }
  // Costos / presupuesto
  if (/costos|costo|presupuesto|cu(á|a)nto cuesta|precio|pesos dominicanos|d(op|ó)lares|RD\$/i.test(q)) {
    return { type: 'GO_TO_SECTION', target: 'costos' };
  }
  // Consejos / tips
  if (/consejo|tip|recomienda|qu(é|e) (deb|pued)o hacer|c(o|o)mo cuidar|qu(é|e) hacer|ayuda/i.test(q)) {
    return { type: 'TIPS' };
  }

  // Blanquita comidas genérico (fallback si no matcheó arriba)
  if (/blanquita.*comida|comida.*blanquita|comidas? (de )?hoy.*blanquita|men(ú|u) del d(í|i)a/i.test(q) && /blanquita/i.test(q)) {
    return { type: 'BLANQUITA_MEALS_TODAY' };
  }

  // Saludo
  if (/hola|buenos d(í|i)as|buenas|hey|saludos/i.test(q)) {
    return { type: 'GREETING' };
  }

  // Agradecimiento
  if (/gracias|thanks|thank you|te agradezco/i.test(q)) {
    return { type: 'THANKS' };
  }

  return { type: 'UNKNOWN' };
}

// ─── Extract puppy name from query ───
function extractPuppyName(q) {
  const names = ['blanquita', 'max', 'steel', 'sydney', 'arturo', 'travieso', 'chana', 'alofoka', 'rodotesa'];
  for (const name of names) {
    if (q.includes(name)) return name;
  }
  return null;
}

// ─── Generate response ───
function generateAgentResponse(input, context) {
  _lastContext = context || '';
  // Para preguntas cortas de seguimiento, usar contexto del historial
  var effectiveInput = input;
  if (input.length < 20 && _lastContext) {
    var lines = _lastContext.split('\n').filter(Boolean);
    if (lines.length >= 2) {
      var lastAgent = lines[lines.length - 1];
      if (lastAgent.startsWith('Nexus: ')) {
        effectiveInput = lastAgent.replace('Nexus: ', '') + ' ' + input;
      }
    }
  }
  const intent = detectIntent(effectiveInput);
  const state = getAppState ? getAppState() : {};
  const today = getToday ? getToday() : '';

  switch (intent.type) {
    case 'GREETING': {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? '¡Buenos días' : hour < 18 ? '¡Buenas tardes' : '¡Buenas noches';
      return {
        message: `${greeting}, hermano! 🐾 Soy Nexus, tu asistente para la camada. Aquí estoy 24/7. ¿En qué te ayudo?\n\nPuedes preguntarme:\n• Cómo está Travieso\n• Cuándo toca la próxima alimentación\n• Quién es el más pesado\n• Próximos eventos médicos\n• Dame un resumen de la camada`,
        actions: [
          { label: '📊 Resumen', action: 'BRIEFING' },
          { label: '🍼 Próxima comida', action: 'NEXT_FEEDING' },
          { label: '⭐ Travieso', action: 'TRAVIESO_STATUS' },
          { label: '🍲 Comidas Blanquita', action: 'BLANQUITA_MEAL_STATUS' }
        ]
      };
    }

    case 'STATUS': {
      const target = intent.target || 'travieso';
      const p = puppyById ? puppyById(target) : null;
      if (!p) return { message: `No encontré a "${target}" en la camada. Los miembros son: ${PUPPY_DATA.map(p => p.name).join(', ')}` };

      const latest = getLatestWeight ? getLatestWeight(target) : null;
      const history = getWeightHistory ? getWeightHistory(target) : [];
      const notes = state.puppyNotes?.[target] || p.notes;
      const block = getFeedingBlock ? getFeedingBlock(target) : null;
      const daysOld = p.birthDate && daysUntil ? daysUntil(p.birthDate) * -1 : 0;

      let response = `🐾 **${p.name}** (${p.role === 'mother' ? '👑 Mamá' : p.gender === 'M' ? '♂ Macho' : '♀ Hembra'})\n`;
      response += `🎨 ${p.color}\n`;
      if (p.role === 'puppy') response += `🎂 ${daysOld} días de nacido\n`;
      if (block) response += `🍼 Bloque ${block}\n`;
      response += `📝 ${notes}\n`;
      if (latest) response += `⚖️ Último peso: ${latest.value}g (${formatDate ? formatDate(latest.date) : latest.date})\n`;
      if (history.length > 1) {
        const gain = history[history.length - 1].value - history[0].value;
        response += `📈 Progreso: ${history[0].value}g → ${history[history.length - 1].value}g (${gain > 0 ? '+' : ''}${gain}g)`;
      }

      const actions = [];
      if (p.role === 'puppy') {
        actions.push({ label: '⚖️ Registrar peso', action: 'ADD_WEIGHT', data: { puppyId: target } });
      }
      actions.push({ label: '🐾 Ver perfil', action: 'OPEN_PROFILE', data: { puppyId: target } });

      return { message: response, actions };
    }

    case 'WEIGHT': {
      const target = intent.target;
      if (target) {
        const history = getWeightHistory ? getWeightHistory(target) : [];
        if (history.length === 0) return { message: `⚠️ ${puppyById(target)?.name || target} no tiene registros de peso aún. ¿Quieres agregar uno?`, actions: [{ label: '⚖️ Registrar peso', action: 'ADD_WEIGHT', data: { puppyId: target } }] };
        const latest = history[history.length - 1];
        let msg = `⚖️ **${puppyById(target)?.name || target}**:\nÚltimo peso: **${latest.value}g** (${formatDate ? formatDate(latest.date) : latest.date})\n`;
        if (history.length >= 2) {
          const first = history[0].value;
          const gain = latest.value - first;
          msg += `Progreso total: ${first}g → ${latest.value}g (${gain > 0 ? '+' : ''}${gain}g)\n`;
          const avgDaily = gain / (history.length - 1);
          msg += `Ganancia diaria promedio: ~${avgDaily.toFixed(1)}g/día`;
        }
        return { message: msg, actions: [{ label: '📊 Ver gráfica', action: 'OPEN_PROFILE', data: { puppyId: target } }] };
      }
      // All puppies
      const puppies = PUPPY_DATA.filter(p => p.id !== 'blanquita');
      const weighted = puppies.map(p => ({ ...p, latest: getLatestWeight ? getLatestWeight(p.id) : null })).filter(p => p.latest);
      if (weighted.length === 0) return { message: '⚠️ No hay registros de peso todavía. ¡Empieza a pesarlos!' };
      let msg = '⚖️ **Pesos actuales:**\n\n';
      weighted.forEach(p => {
        msg += `${p.avatar} **${p.name}**: ${p.latest.value}g\n`;
      });
      const avg = Math.round(weighted.reduce((s, p) => s + p.latest.value, 0) / weighted.length);
      msg += `\n📊 Promedio: **${avg}g**`;
      return { message: msg, actions: [{ label: '⚖️ Registrar peso', action: 'ADD_WEIGHT' }] };
    }

    case 'NEXT_FEEDING': {
      const next = getNextFeedingTime ? getNextFeedingTime() : null;
      if (!next) return { message: 'No pude determinar el próximo horario de alimentación.' };
      const countdown = getTimeUntilNextFeeding ? getTimeUntilNextFeeding() : null;
      let msg = `🍼 **Próxima alimentación:** ${next.time} — ${next.label}\n\n`;
      if (countdown) msg += `⏱️ En **${countdown.hours}h ${countdown.minutes}m**\n\n`;
      msg += `**Orden recomendado:**\n`;
      msg += `1️⃣ Bloque A primero (15-20 min): Max, Steel, Sydney, Alofoka\n`;
      msg += `2️⃣ Bloque B: Arturo, Chana, Rodotesa, **Travieso ⭐**\n\n`;
      msg += `⭐ Travieso debe agarrar las **tetas traseras** de Blanquita (dan más leche)`;
      return { message: msg, actions: [{ label: '🍼 Ir a alimentación', action: 'GO_TO_SECTION', data: { section: 'alimentacion' } }] };
    }

    case 'FEEDING_TODAY': {
      const state = getAppState ? getAppState() : {};
      const today = getToday ? getToday() : '';
      const todayFeedings = state.feedings?.[today] || {};
      let msg = '🍼 **Alimentación de hoy:**\n\n';
      FEEDING_TIMES.forEach(ft => {
        const f = todayFeedings[ft.time] || {};
        const a = f.blockA ? '✅' : '⏳';
        const b = f.blockB ? '✅' : '⏳';
        msg += `${ft.time} — ${ft.label}\n  Bloque A ${a} | Bloque B ${b}\n`;
      });
      const total = Object.values(todayFeedings).reduce((s, b) => s + (b.blockA ? 1 : 0) + (b.blockB ? 1 : 0), 0);
      msg += `\n📊 **${total}/12** alimentaciones completadas hoy`;
      return { message: msg };
    }

    case 'NEXT_MEDICAL': {
      const allEvents = [
        ...MEDICAL_EVENTS,
        ...(state.customEvents || []).filter(ce => !state.medicalStatus?.[ce.id] || state.medicalStatus[ce.id] !== 'removed')
      ];
      const pending = allEvents.filter(e => state.medicalStatus?.[e.id] !== 'done')
        .sort((a, b) => daysUntil ? daysUntil(a.date) - daysUntil(b.date) : 0);

      if (pending.length === 0) return { message: '✅ No hay eventos médicos pendientes. ¡Todo al día!' };

      const next3 = pending.slice(0, 3);
      let msg = '💉 **Próximos eventos médicos:**\n\n';
      next3.forEach(e => {
        const days = daysUntil ? daysUntil(e.date) : 0;
        const label = days < 0 ? '🔴 ATRASADO' : days === 0 ? '🚨 HOY' : `📅 en ${days} días`;
        msg += `${label}: **${e.title}**\n${formatDate ? formatDate(e.date) : e.date}\n${e.desc}\n\n`;
      });
      msg += `Total pendientes: **${pending.length}** eventos`;
      return { message: msg, actions: [{ label: '💉 Ir a medicina', action: 'GO_TO_SECTION', data: { section: 'medicina' } }] };
    }

    case 'TRAVIESO_STATUS': {
      const travieso = puppyById ? puppyById('travieso') : null;
      if (!travieso) return { message: 'No encontré a Travieso en los datos.' };
      const history = getWeightHistory ? getWeightHistory('travieso') : [];
      const latest = history.length > 0 ? history[history.length - 1] : null;
      const daysOld = daysUntil ? daysUntil('2026-05-23') * -1 : 0;

      let msg = `⭐ **TRAVIESO — El Guerrero** ⭐\n\n`;
      msg += `🎂 Día ${daysOld}\n`;
      msg += `🎨 ${travieso.color}\n`;
      msg += `📝 ${state.puppyNotes?.travieso || travieso.notes}\n\n`;

      if (history.length >= 2) {
        const first = history[0].value;
        const last = history[history.length - 1].value;
        const gain = last - first;
        const avg = gain / (history.length - 1);
        const cagr = calcCAGR ? calcCAGR(history.map(r => r.value)) : 0;
        msg += `📈 **Progreso:** ${first}g → ${last}g (${gain > 0 ? '+' : ''}${gain}g)\n`;
        msg += `📊 Ganancia diaria: ~${avg.toFixed(1)}g/día\n`;

        if (history.length >= 3) {
          const recentGain = last - history[history.length - 2].value;
          msg += `🔄 Último cambio: ${recentGain > 0 ? '+' : ''}${recentGain}g\n`;
        }

        if (cagr > 0) msg += `📈 CAGR: ${(cagr * 100).toFixed(2)}%\n`;

        // Compare to siblings
        const siblings = PUPPY_DATA.filter(p => p.id !== 'blanquita' && p.id !== 'travieso');
        const sibAvg = siblings.reduce((sum, s) => {
          const w = getLatestWeight ? getLatestWeight(s.id) : null;
          return sum + (w ? w.value : 0);
        }, 0) / siblings.length || 1;
        const pctOfAvg = ((latest?.value || 0) / sibAvg * 100).toFixed(0);
        msg += `\n📊 **${pctOfAvg}%** del peso promedio de sus hermanos (${Math.round(sibAvg)}g)`;
        msg += `\n${parseInt(pctOfAvg) < 80 ? '⚠️ Está por debajo del promedio. Asegúrate de que siempre agarre las tetas traseras de Blanquita.' : parseInt(pctOfAvg) < 95 ? '👀 Se está acercando al promedio. Sigue vigilándolo.' : '💪 ¡Casi alcanza a sus hermanos! Sigue así.'}`;
      } else if (latest) {
        msg += `⚖️ Último peso: ${latest.value}g\n`;
        msg += '💡 Registra al menos 2 pesajes para ver su progreso.';
      } else {
        msg += '⚠️ No hay registros de peso todavía.\n⚖️ ¡Es hora de pesarlo!';
      }

      return {
        message: msg,
        actions: [
          { label: '⚖️ Pesar a Travieso', action: 'ADD_WEIGHT', data: { puppyId: 'travieso' } },
          { label: '🐾 Ver perfil', action: 'OPEN_PROFILE', data: { puppyId: 'travieso' } }
        ]
      };
    }

    case 'BLANQUITA_MEALS_TODAY': {
      if (typeof getTodaysBlanquitaMenu !== 'function') return { message: 'El m\u00f3dulo de comidas de Blanquita no est\u00e1 disponible.' };
      var menu = getTodaysBlanquitaMenu();
      if (!menu || menu.length === 0) return { message: 'No pude obtener el men\u00fa de hoy para Blanquita.' };
      var dayName = DAYS_ES ? DAYS_ES[new Date().getDay()] : '';
      var mealsToday = state.blanquitaMeals?.[today] || {};
      var totalPortion = 0;
      for (var mi = 0; mi < BLANQUITA_MEAL_TIMES.length; mi++) { totalPortion += Math.round(BLANQUITA_DAILY_FOOD_G * BLANQUITA_MEAL_TIMES[mi].pct); }
      var msg = '\ud83c\udf72 **Men\u00fa de Blanquita — ' + dayName + '**\n\n';
      msg += 'Porci\u00f3n total: ~' + totalPortion + 'g (basado en ' + BLANQUITA_WEIGHT_KG + 'kg)\n\n';
      for (var mi = 0; mi < menu.length; mi++) {
        var m = menu[mi];
        var status = mealsToday[m.time];
        var served = status && status.served;
        var icon = served ? '\u2705' : '\u23f3';
        msg += icon + ' **' + m.time + '** — ' + m.label + '\n';
        msg += '   \ud83c\udf7d\ufe0f ' + m.recipe.icon + ' ' + m.recipe.name + '\n';
        msg += '   \ud83d\udccf ' + m.portion + 'g (' + Math.round(m.portion/totalPortion*100) + '% del d\u00eda)\n';
        if (served) msg += '   \u2705 Servido (' + (status.portion || m.portion) + 'g)' + (status.notes ? ' \u2014 ' + status.notes : '') + '\n';
        msg += '\n';
      }
      return {
        message: msg,
        actions: [
          { label: '\ud83d\udcd6 Ver receta', action: 'SHOW_RECIPE', data: { recipeId: menu[0]?.recipeId } },
          { label: '\ud83c\udf7d\ufe0f Ir a comidas', action: 'GO_TO_SECTION', data: { section: 'comidas' } }
        ]
      };
    }

    case 'BLANQUITA_NEXT_MEAL': {
      if (typeof getTodaysBlanquitaMenu !== 'function') return { message: 'El m\u00f3dulo de comidas de Blanquita no est\u00e1 disponible.' };
      var menu = getTodaysBlanquitaMenu();
      if (!menu || menu.length === 0) return { message: 'No pude obtener el men\u00fa.' };
      var now = new Date();
      var currentMinutes = now.getHours()*60 + now.getMinutes();
      var nextMeal = null;
      for (var mi = 0; mi < menu.length; mi++) {
        var parts = menu[mi].time.split(':');
        var mealMinutes = parseInt(parts[0])*60 + parseInt(parts[1]);
        if (currentMinutes < mealMinutes + 30) { nextMeal = menu[mi]; break; }
      }
      if (!nextMeal) {
        // All meals passed, return tomorrow's first meal
        var mealsToday = state.blanquitaMeals?.[today] || {};
        var servedCount = 0;
        for (var mi = 0; mi < menu.length; mi++) { if (mealsToday[menu[mi].time]?.served) servedCount++; }
        return {
          message: '\u2705 Todas las comidas de hoy ya pasaron.\n\n' + servedCount + '/' + menu.length + ' servidas.\n\nLa primera comida de ma\u00f1ana es a las **06:30** con ' + menu[0].recipe.icon + ' ' + menu[0].recipe.name + ' (' + menu[0].portion + 'g).\n\n\ud83d\udca1 Recuerda que Blanquita necesita su refuerzo nocturno a las 22:30 para mantener la hidrataci\u00f3n.' + (!mealsToday['22:30']?.served && currentMinutes < 22*60+30 ? ' \u00a1A\u00fan est\u00e1s a tiempo!' : ''),
          actions: [{ label: '\ud83c\udf7d\ufe0f Ir a comidas', action: 'GO_TO_SECTION', data: { section: 'comidas' } }]
        };
      }
      var diffMinutes = (parseInt(nextMeal.time.split(':')[0])*60 + parseInt(nextMeal.time.split(':')[1])) - currentMinutes;
      var hoursLeft = Math.floor(diffMinutes/60);
      var minsLeft = diffMinutes % 60;
      var msg = '\ud83c\udf72 **Pr\u00f3xima comida de Blanquita**\n\n';
      msg += '\u23f0 **' + nextMeal.time + '** \u2014 ' + nextMeal.label + '\n';
      if (diffMinutes > 0 && diffMinutes < 600) msg += '(en **' + hoursLeft + 'h ' + minsLeft + 'm**)\n\n';
      msg += '\ud83c\udf7d\ufe0f ' + nextMeal.recipe.icon + ' **' + nextMeal.recipe.name + '**\n';
      msg += '\ud83d\udccf Porci\u00f3n: **' + nextMeal.portion + 'g**\n\n';
      msg += '\ud83d\udca1 ' + nextMeal.recipe.benefit;
      return {
        message: msg,
        actions: [
          { label: '\ud83d\udcd6 Ver receta', action: 'SHOW_RECIPE', data: { recipeId: nextMeal.recipeId } },
          { label: '\ud83c\udf7d\ufe0f Ir a comidas', action: 'GO_TO_SECTION', data: { section: 'comidas' } }
        ]
      };
    }

    case 'BLANQUITA_MEAL_STATUS': {
      if (typeof getTodaysBlanquitaMenu !== 'function') return { message: 'El m\u00f3dulo de comidas de Blanquita no est\u00e1 disponible.' };
      var menu = getTodaysBlanquitaMenu();
      if (!menu || menu.length === 0) return { message: 'No pude obtener el estado de comidas.' };
      var mealsToday = state.blanquitaMeals?.[today] || {};
      var servedCount = 0, totalCount = menu.length;
      var lastMealTime = null, lastMealHours = 0;
      for (var mi = menu.length - 1; mi >= 0; mi--) {
        if (mealsToday[menu[mi].time]?.served) {
          var parts = menu[mi].time.split(':');
          servedCount++;
          if (!lastMealTime) {
            lastMealTime = menu[mi];
            var lastDate = new Date();
            lastDate.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
            lastMealHours = Math.round((Date.now() - lastDate.getTime()) / (1000*60*60));
          }
        }
      }
      var isComplete = servedCount >= totalCount;
      var isUrgent = servedCount === 0 && new Date().getHours() >= 7;
      var isLate = lastMealHours > 6;
      var statusEmoji = isComplete ? '\ud83d\udfe2' : isUrgent ? '\ud83d\udd34' : isLate ? '\ud83d\udd34' : servedCount > 0 ? '\ud83d\udfe0' : '\u26a0\ufe0f';
      var statusLabel = isComplete ? '\u00a1Completo!' : isUrgent ? '\u00a1No ha comido hoy!' : isLate ? '\u00a1Alerta! >6h sin comer' : servedCount > 0 ? servedCount + '/' + totalCount + ' servidas' : 'Pendiente';
      var msg = '\ud83c\udf72 **Estado de comidas de Blanquita**\n\n';
      msg += statusEmoji + ' **' + statusLabel + '**\n\n';
      msg += '\ud83d\udcc5 ' + DAYS_ES[new Date().getDay()] + '\n\n';
      // Cada comida
      for (var mi = 0; mi < menu.length; mi++) {
        var m = menu[mi];
        var status = mealsToday[m.time];
        var served = status && status.served;
        var parts = m.time.split(':');
        var mealMinutes = parseInt(parts[0])*60 + parseInt(parts[1]);
        var nowMinutes = new Date().getHours()*60 + new Date().getMinutes();
        var isPast = nowMinutes > mealMinutes + 60;
        msg += (served ? '\u2705' : isPast ? '\u274c' : '\u23f3') + ' **' + m.time + '** ' + m.label + '\n';
        msg += '   ' + m.recipe.icon + ' ' + m.recipe.name + ' (' + m.portion + 'g)';
        if (served) msg += ' \u2014 Servido' + (status.notes ? ' (' + status.notes + ')' : '');
        else if (isPast) msg += ' \u2014 Pendiente! \u26a0\ufe0f';
        msg += '\n\n';
      }
      msg += '\ud83d\udcca **' + servedCount + '/' + totalCount + '** comidas servidas';
      if (isLate) msg += '\n\ud83d\udea8 \u00daltima comida fue hace **' + lastMealHours + ' horas**. \u00a1Prep\u00e1rale algo ya!';
      return {
        message: msg,
        actions: [
          { label: '\ud83c\udf7d\ufe0f Ir a comidas', action: 'GO_TO_SECTION', data: { section: 'comidas' } },
          { label: '\ud83d\udcd6 Men\u00fa de hoy', action: 'SHOW_TODAY_MENU' }
        ]
      };
    }

    case 'BLANQUITA_RECIPE': {
      if (typeof RECIPES === 'undefined') return { message: 'El recetario de Blanquita no est\u00e1 disponible.' };
      var q = input.toLowerCase();
      var recipeId = null;
      // Intentar identificar la receta
      if (/caldo.*levantamuertos|caldo.*pollo|levantamuertos/i.test(q)) recipeId = 'caldo';
      else if (/pastel.*carne|pastel.*huevo|carne.*huevo|bomba.*calcio/i.test(q)) recipeId = 'pastel';
      else if (/banquete.*atl|sardinas|atl(á|a)ntico|omega/i.test(q)) recipeId = 'sardinas';
      else if (/caldo.*ligero|refuerzo.*nocturno|refuerzo.*caldo/i.test(q)) recipeId = 'caldo-ligero';
      else if (/blanquita|receta|todas/i.test(q)) {
        // Show all recipes
        var msg = '\ud83d\udcda **Recetario de Blanquita**\n\n';
        msg += 'Elige una receta para ver los pasos:\n\n';
        var recipeIds = ['caldo', 'pastel', 'sardinas', 'caldo-ligero'];
        for (var mi = 0; mi < recipeIds.length; mi++) {
          var r = RECIPES[recipeIds[mi]];
          if (r) msg += r.icon + ' **' + r.name + '**\n   ' + r.desc + '\n\n';
        }
        return {
          message: msg,
          actions: [
            { label: '\ud83c\udf72 Caldo Levantamuertos', action: 'SHOW_RECIPE', data: { recipeId: 'caldo' } },
            { label: '\ud83e\udd69 Pastel de Carne', action: 'SHOW_RECIPE', data: { recipeId: 'pastel' } },
            { label: '\ud83d\udc1f Banquete del Atl\u00e1ntico', action: 'SHOW_RECIPE', data: { recipeId: 'sardinas' } },
            { label: '\u2615 Refuerzo Nocturno', action: 'SHOW_RECIPE', data: { recipeId: 'caldo-ligero' } }
          ]
        };
      }
      if (!recipeId || !RECIPES[recipeId]) {
        return { message: 'No reconoc\u00ed esa receta. Las recetas disponibles son: ' + Object.values(RECIPES).map(function(r){return r.icon+' '+r.name;}).join(', ') + '.' };
      }
      var recipe = RECIPES[recipeId];
      var msg = recipe.icon + ' **' + recipe.name + '**\n' + recipe.desc + '\n\n';
      msg += '\ud83d\udccb **Ingredientes:**\n';
      for (var mi = 0; mi < recipe.ingredients.length; mi++) {
        msg += '\u2022 ' + recipe.ingredients[mi] + '\n';
      }
      msg += '\n\ud83d\udc68\u200d\ud83c\udf73 **Preparaci\u00f3n:**\n';
      for (var mi = 0; mi < recipe.steps.length; mi++) {
        msg += (mi+1) + '. ' + recipe.steps[mi] + '\n';
      }
      msg += '\n\ud83d\udcca **Macros:** ' + recipe.macros.protein + ' | ' + recipe.macros.carbs + ' | ' + recipe.macros.fat + '\n';
      msg += '\u2705 ' + recipe.benefit + '\n';
      if (recipe.warning) msg += '\n\u26a0\ufe0f **Advertencia:** ' + recipe.warning;
      return {
        message: msg,
        actions: [
          { label: '\ud83c\udf72 Todas las recetas', action: 'SHOW_TODAY_MENU' },
          { label: '\ud83c\udf7d\ufe0f Ir a comidas', action: 'GO_TO_SECTION', data: { section: 'comidas' } }
        ]
      };
    }

    case 'BIGGEST': {
      const puppies = PUPPY_DATA.filter(p => p.id !== 'blanquita');
      const weighted = puppies.map(p => ({ ...p, latest: getLatestWeight ? getLatestWeight(p.id) : null })).filter(p => p.latest);
      if (weighted.length === 0) return { message: '⚠️ No hay registros de peso todavía.' };
      const biggest = weighted.reduce((a, b) => a.latest.value > b.latest.value ? a : b);
      return {
        message: `🏆 **El más pesado es ${biggest.name}**\n⚖️ Peso: **${biggest.latest.value}g**\n🎨 ${biggest.color}\n📝 ${state.puppyNotes?.[biggest.id] || biggest.notes}`,
        actions: [{ label: '🐾 Ver perfil', action: 'OPEN_PROFILE', data: { puppyId: biggest.id } }]
      };
    }

    case 'SMALLEST': {
      const puppies = PUPPY_DATA.filter(p => p.id !== 'blanquita');
      const weighted = puppies.map(p => ({ ...p, latest: getLatestWeight ? getLatestWeight(p.id) : null })).filter(p => p.latest);
      if (weighted.length === 0) return { message: '⚠️ No hay registros de peso todavía.' };
      const smallest = weighted.reduce((a, b) => a.latest.value < b.latest.value ? a : b);
      return {
        message: `💪 **El más pequeño es ${smallest.name}**\n⚖️ Peso: **${smallest.latest.value}g**\n🎨 ${smallest.color}\n📝 ${state.puppyNotes?.[smallest.id] || smallest.notes}\n\n¡Pero no te preocupes! Con los cuidados adecuados, se pondrá al día.`,
        actions: [{ label: '🐾 Ver perfil', action: 'OPEN_PROFILE', data: { puppyId: smallest.id } }]
      };
    }

    case 'BRIEFING': {
      // Generate briefing on demand if not already generated today
      if (!window._lastBriefing || getToday() !== new Date().toISOString().split('T')[0]) {
        const notif = window.generateDailyBriefing || generateDailyBriefing;
        if (typeof notif === 'function') notif();
      }
      const briefing = window._lastBriefing;
      if (!briefing) return { message: 'Generando briefing... vuelve a preguntar en un momento.' };
      let msg = `🌅 **${briefing.title}**\n\n`;
      briefing.sections.forEach(s => {
        msg += `**${s.icon} ${s.title}**\n`;
        s.lines.filter(l => l).forEach(l => { msg += `${l}\n`; });
        msg += '\n';
      });
      msg += `💡 **Tips del día:**\n`;
      briefing.tips.forEach(t => { msg += `${t}\n`; });
      return { message: msg };
    }

    case 'TIPS': {
      const hour = new Date().getHours();
      const isNight = hour < 6 || hour >= 22;
      return {
        message: `💡 **Tips para el cuidado de los cachorros:**\n\n${isNight ? '🌙 Es de noche —' : '☀️ Buenos días —'} aquí algunos recordatorios:\n\n` +
          `🐾 **Travieso**: Prioridad absoluta. Siempre en tetas traseras de Blanquita.\n` +
          `🍼 **Rotación**: Bloque A primero (15-20 min), luego Bloque B.\n` +
          `⚖️ **Pesaje**: A la misma hora cada día para consistencia.\n` +
          `🩺 **Blanquita**: Revisa tetas diario (calientes/duras = mastitis).\n` +
          `🧹 **Higiene**: Toallitas húmedas sin alcohol hasta los 2 meses.\n` +
          `🌡️ **Temperatura**: Ambiente seco, sin corrientes.\n` +
          `📅 **Próximo hito**: A los 21-25 días iniciar papilla de transición.\n` +
          `🎬 **Contenido**: Graba el desorden cuando comen papilla — ¡oro viral!`,
        actions: [
          { label: '🍼 Ir a alimentación', action: 'GO_TO_SECTION', data: { section: 'alimentacion' } },
          { label: '💉 Ir a medicina', action: 'GO_TO_SECTION', data: { section: 'medicina' } }
        ]
      };
    }

    case 'GO_TO_SECTION': {
      if (navigateTo && intent.target) {
        navigateTo(intent.target);
        var labels = { 'bloque-a': '🔵 Bloque A', 'bloque-b': '🩷 Bloque B', 'hembras': '♀️ Hembras', 'varones': '♂️ Varones', 'progresion': '🐛 Progresión', 'costos': '💰 Costos' };
        var label = labels[intent.target] || intent.target;
        return { message: 'Navegando a ' + label + '...' };
      }
      return { message: 'No pude navegar a esa sección.' };
    }
    case 'UNKNOWN':
    default: {      return {
      message: `🤔 No entendí bien tu pregunta. Aquí algunas cosas que puedes preguntarme:\n\n` +
        `• "¿Cómo está Travieso?"\n` +
        `• "¿Cuándo toca la próxima comida?"\n` +
        `• "¿Qué come Blanquita hoy?"\n` +
        `• "¿Ya comió Blanquita?"\n` +
        `• "Dame la receta del caldo levantamuertos"\n` +
        `• "¿Cuánto pesa Max?"\n` +
        `• "¿Quién es el más pesado?"\n` +
        `• "¿Qué eventos médicos hay?"\n` +
        `• "Dame un resumen de la camada"\n` +
        `• "Enséñame el Bloque A"\n` +
        `• "Ver las hembras"\n` +
        `• "Progresión de alimentos"\n` +
        `• "Costos de las comidas"\n` +
        `• "Tips para cuidarlos"\n\n` +
        `O dime "hola" para saludarme 😊`,
        actions: [
          { label: '📊 Resumen', action: 'BRIEFING' },
          { label: '⭐ Travieso', action: 'TRAVIESO_STATUS' },
          { label: '🍼 Próxima comida', action: 'NEXT_FEEDING' },
          { label: '🍲 Comidas Blanquita', action: 'BLANQUITA_MEAL_STATUS' },
          { label: '🔵 Bloque A', action: 'GO_TO_SECTION', data: { section: 'bloque-a' } },
          { label: '♀️ Hembras', action: 'GO_TO_SECTION', data: { section: 'hembras' } }
        ]
      };
    }
  }
}

// ─── Proactive Blanquita meal alert (>5h) ───
let _blanquitaNoBreakfastAlertFired = false;
let _blanquitaHunger5hAlertFired = false;
let _blanquitaChatMonitorInterval = null;
let _blanquitaLastServedCount = -1;

function checkBlanquitaChatAlert() {
  if (typeof getTodaysBlanquitaMenu !== 'function' || typeof getAppState !== 'function') return;
  var state = getAppState();
  var today = getToday ? getToday() : '';
  var menu = getTodaysBlanquitaMenu();
  if (!menu || menu.length === 0) return;
  
  var mealsToday = state.blanquitaMeals?.[today] || {};
  var now = new Date();
  var currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Find last served meal time
  var lastServedMinutes = null;
  for (var mi = menu.length - 1; mi >= 0; mi--) {
    if (mealsToday[menu[mi].time]?.served) {
      var parts = menu[mi].time.split(':');
      lastServedMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      break;
    }
  }
  
  var hoursSinceLastMeal = lastServedMinutes !== null ? (currentMinutes - lastServedMinutes) / 60 : null;
  
  // If no meals served today and after 7:30 AM
  if (lastServedMinutes === null) {
    if (currentMinutes >= 450 && !_blanquitaNoBreakfastAlertFired) {
      _blanquitaNoBreakfastAlertFired = true;
      var hourStr = String(Math.floor(currentMinutes/60)).padStart(2,'0');
      var minStr = String(currentMinutes%60).padStart(2,'0');
      var msg = '\ud83d\udea8 **\u00a1Blanquita no ha comido hoy!**\n\n';
      msg += 'Son las ' + hourStr + ':' + minStr + ' y a\u00fan no le has dado su primera comida.\n\n';
      msg += 'Su primer plato de hoy: ' + (menu[0] ? menu[0].recipe.icon + ' **' + menu[0].recipe.name + '** (' + menu[0].portion + 'g)' : 'Comida real');
      if (typeof addChatMessage === 'function') {
        addChatMessage(msg, 'agent', [
          { label: '\ud83d\udcd6 Ver receta', action: 'SHOW_RECIPE', data: { recipeId: menu[0]?.recipeId } },
          { label: '\ud83c\udf7d\ufe0f Ir a comidas', action: 'GO_TO_SECTION', data: { section: 'comidas' } }
        ]);
      }
    }
    return;
  }
  
  // Check if >5h since last meal
  if (hoursSinceLastMeal >= 5 && !_blanquitaHunger5hAlertFired) {
    _blanquitaHunger5hAlertFired = true;
    var hoursRounded = Math.round(hoursSinceLastMeal);
    
    // Count served meals to detect changes later
    var servedNow = 0;
    for (var si = 0; si < menu.length; si++) { if (mealsToday[menu[si].time]?.served) servedNow++; }
    _blanquitaLastServedCount = servedNow;
    
    // Find next upcoming meal
    var nextMeal = null;
    for (var mi = 0; mi < menu.length; mi++) {
      var pts = menu[mi].time.split(':');
      if (parseInt(pts[0])*60 + parseInt(pts[1]) > currentMinutes) {
        nextMeal = menu[mi];
        break;
      }
    }
    
    var msg = '\u26a0\ufe0f **Blanquita lleva ' + hoursRounded + 'h sin comer**\n\n';
    msg += 'Hace ' + hoursRounded + ' horas desde su \u00faltima comida. Una perra lactando con 8 cachorros necesita comer cada 4-6 horas para mantener su producci\u00f3n de leche y evitar la eclampsia.\n\n';
    if (nextMeal) {
      msg += 'Pr\u00f3ximo plato: ' + nextMeal.recipe.icon + ' **' + nextMeal.recipe.name + '** a las ' + nextMeal.time + ' (' + nextMeal.portion + 'g)\n\n';
      msg += '\ud83d\udca1 ' + nextMeal.recipe.benefit;
    } else {
      msg += '\ud83d\udca1 Ya pasaron todas las comidas de hoy. Aseg\u00farate de que tenga agua y prepara su primer plato de ma\u00f1ana a las 06:30.';
    }
    
    if (typeof addChatMessage === 'function') {
      addChatMessage(msg, 'agent', [
        { label: '\ud83d\udcd6 Ver receta', action: 'SHOW_RECIPE', data: { recipeId: nextMeal?.recipeId || menu[0]?.recipeId } },
        { label: '\u2705 Marcar servido', action: 'GO_TO_SECTION', data: { section: 'comidas' } }
      ]);
    }
  }
  
  // Auto-reset hunger flag when a new meal is served
  if (_blanquitaHunger5hAlertFired) {
    var servedNow = 0;
    for (var si = 0; si < menu.length; si++) { if (mealsToday[menu[si].time]?.served) servedNow++; }
    if (servedNow > _blanquitaLastServedCount) {
      _blanquitaHunger5hAlertFired = false;
    }
  }
}

function startBlanquitaChatMonitor() {
  if (_blanquitaChatMonitorInterval) return;
  // Start checking every 60 seconds
  _blanquitaChatMonitorInterval = setInterval(checkBlanquitaChatAlert, 60000);
  // Run once immediately (with slight delay to ensure app.js is loaded)
  setTimeout(checkBlanquitaChatAlert, 2000);
}

// ─── Execute action from chat ───
function executeAgentAction(action, data) {
  switch (action) {
    case 'GO_TO_SECTION':
      if (navigateTo && data?.section) navigateTo(data.section);
      break;
    case 'OPEN_PROFILE':
      if (openPuppyDetail && data?.puppyId) openPuppyDetail(data.puppyId);
      break;
    case 'ADD_WEIGHT':
      if (openAddWeightModal) openAddWeightModal(data?.puppyId);
      break;
    case 'BRIEFING':
      // Re-trigger
      const msg = generateAgentResponse('dame un resumen');
      addChatMessage(msg.message, 'agent', msg.actions);
      break;
    case 'TRAVIESO_STATUS':
      const tMsg = generateAgentResponse('cómo está travieso');
      addChatMessage(tMsg.message, 'agent', tMsg.actions);
      break;
    case 'NEXT_FEEDING':
      const fMsg = generateAgentResponse('cuándo toca la próxima alimentación');
      addChatMessage(fMsg.message, 'agent', fMsg.actions);
      break;
    case 'SHOW_RECIPE':
      if (data?.recipeId && typeof openRecipeModal === 'function') {
        openRecipeModal(data.recipeId);
      }
      break;
    case 'SHOW_TODAY_MENU':
      const mMsg = generateAgentResponse('qué come blanquita hoy');
      addChatMessage(mMsg.message, 'agent', mMsg.actions);
      break;
    case 'BLANQUITA_MEAL_STATUS':
      const bmMsg = generateAgentResponse('ya comió blanquita');
      addChatMessage(bmMsg.message, 'agent', bmMsg.actions);
      break;
  }
}
