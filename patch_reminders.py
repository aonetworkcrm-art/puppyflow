"""
Patch to add Blanquita meal push reminders to notifications.js, app.js state, and renderComidas.
"""
import re

NOTIF_PATH = r'C:\Users\somet\Desktop\puppy-track\js\notifications.js'
APP_PATH = r'C:\Users\somet\Desktop\puppy-track\js\app.js'

# ============================
# 1. Add checkBlanquitaMealNotifications to notifications.js
# ============================
with open(NOTIF_PATH, 'r', encoding='utf-8') as f:
    notif_content = f.read()

# Add the Blanquita meal notification function before startNotifEngine
blanquita_notif_func = '''
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
  var reminderMinutes = 5; // default 5 min before
  if (reminders && reminders.enabled) {
    reminderMinutes = reminders.minutesBefore || 5;
  } else {
    // Only check for overdue alert if reminders are disabled
    checkBlanquitaOverdueAlert(state, today, menu, currentMinutes);
    return;
  }

  // Check each meal time
  var mealsToday = state.blanquitaMeals?.[today] || {};
  for (var mi = 0; mi < menu.length; mi++) {
    var m = menu[mi];
    var parts = m.time.split(':');
    var mealMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);

    // Skip if already served
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
        '\\ud83c\\udf72 ' + m.label + ' de Blanquita' + countdown,
        m.recipe.icon + ' ' + m.recipe.name + '\\nPorci\\u00f3n: ' + m.portion + 'g\\n\\n' + m.recipe.benefit,
        'blanquita-meal-' + today + '-' + m.time,
        { section: 'comidas', mealTime: m.time }
      );
    }

    // Also alert if meal is >30 min past due and not served
    var pastDue = currentMinutes - (mealMinutes + 30);
    if (pastDue > 0 && pastDue <= 2 && !mealsToday[m.time]?.served) {
      var lateKey = today + '_' + m.time + '_late';
      if (_lastBlanquitaMealNotif[lateKey]) continue;
      _lastBlanquitaMealNotif[lateKey] = true;

      sendNotif(
        '\\u26a0\\ufe0f Comida de Blanquita pendiente — ' + m.time,
        m.recipe.icon + ' ' + m.recipe.name + ' debi\\u00f3 servirse a las ' + m.time + '\\n\\n\\u00a1Prep\\u00e1rale su plato ahora!',
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
    // No meals served yet today
    if (currentMinutes >= 7*60 + 30) { // After 7:30 AM
      var overdueKey = today + '_overdue';
      if (_lastBlanquitaMealNotif[overdueKey]) return;
      _lastBlanquitaMealNotif[overdueKey] = true;
      sendNotif(
        '\\ud83d\\udea8 \\u00a1Blanquita no ha comido hoy!',
        'Ya son las ' + String(Math.floor(currentMinutes/60)).padStart(2,'0') + ':' + String(currentMinutes%60).padStart(2,'0') + ' y Blanquita no ha recibido su primera comida.\\n\\nSu primer plato: ' + (menu[0] ? menu[0].recipe.icon + ' ' + menu[0].recipe.name : 'Comida real'),
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
  if (hoursSinceLastMeal >= 4 && hoursSinceLastMeal <= 4.1) {
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
    var msg = '\\u00daltima comida fue hace ' + Math.round(hoursSinceLastMeal) + ' horas.';
    if (nextMeal) msg += '\\n\\nPr\\u00f3ximo plato: ' + nextMeal.recipe.icon + ' ' + nextMeal.recipe.name + ' a las ' + nextMeal.time;
    sendNotif(
      '\\u26a0\\ufe0f Blanquita lleva ' + Math.round(hoursSinceLastMeal) + 'h sin comer',
      msg,
      'blanquita-4h-' + today,
      { section: 'comidas' }
    );
  }
}

'''

# Insert before "function startNotifEngine"
insert_point = notif_content.find('function startNotifEngine()')
if insert_point >= 0:
    notif_content = notif_content[:insert_point] + blanquita_notif_func + notif_content[insert_point:]
    print("Added checkBlanquitaMealNotifications to notifications.js")
else:
    print("ERROR: Could not find startNotifEngine in notifications.js")

# Also add the call inside startNotifEngine
old = """    _notifInterval = setInterval(() => {
      checkFeedingNotifications();
      checkMedicalNotifications();
      checkDailyBriefing();
    }, 60000); // every 60s
    // Run once immediately
    checkFeedingNotifications();
    checkMedicalNotifications();
    checkDailyBriefing();"""

new = """    _notifInterval = setInterval(() => {
      checkFeedingNotifications();
      checkMedicalNotifications();
      checkBlanquitaMealNotifications();
      checkDailyBriefing();
    }, 60000); // every 60s
    // Run once immediately
    checkFeedingNotifications();
    checkMedicalNotifications();
    checkBlanquitaMealNotifications();
    checkDailyBriefing();"""

if old in notif_content:
    notif_content = notif_content.replace(old, new)
    print("Integrated checkBlanquitaMealNotifications into startNotifEngine")
else:
    print("ERROR: Could not find the interval pattern in startNotifEngine")
    # Try alternative
    alt_old = """      checkFeedingNotifications();
      checkMedicalNotifications();
      checkDailyBriefing();"""
    alt_new = """      checkFeedingNotifications();
      checkMedicalNotifications();
      checkBlanquitaMealNotifications();
      checkDailyBriefing();"""
    count_alt = notif_content.count(alt_old)
    if count_alt >= 2:
        notif_content = notif_content.replace(alt_old, alt_new, count_alt)
        print(f"Integrated checkBlanquitaMealNotifications using alternative pattern ({count_alt} replacements)")

with open(NOTIF_PATH, 'w', encoding='utf-8') as f:
    f.write(notif_content)

# ============================
# 2. Add blanquitaReminders to getDefaultState in app.js
# ============================
with open(APP_PATH, 'r', encoding='utf-8') as f:
    app_content = f.read()

old_state = "return { weights: {}, feedings: {}, medicalStatus: {}, puppyNotes: {}, customEvents: [], blanquitaMeals: {}, lastUpdated: Date.now() };"
new_state = "return { weights: {}, feedings: {}, medicalStatus: {}, puppyNotes: {}, customEvents: [], blanquitaMeals: {}, blanquitaReminders: { enabled: false, minutesBefore: 5 }, lastUpdated: Date.now() };"

if old_state in app_content:
    app_content = app_content.replace(old_state, new_state)
    print("Added blanquitaReminders to getDefaultState")
else:
    print("ERROR: Could not find getDefaultState return in app.js")

# ============================
# 3. Add toggle functions and UI in renderComidas
# ============================

# Add toggleBlanquitaReminders function - insert after openRecipeModal function
# Find the end of openRecipeModal and insert before renderMedicina
toggle_func = '''
function toggleBlanquitaReminders() {
  var state = getAppState();
  if (!state.blanquitaReminders) state.blanquitaReminders = { enabled: false, minutesBefore: 5 };
  state.blanquitaReminders.enabled = !state.blanquitaReminders.enabled;
  saveState();
  renderComidas();
  if (state.blanquitaReminders.enabled) {
    // Request notification permission and run check immediately
    if (typeof requestNotifPermission === 'function') {
      requestNotifPermission();
    }
    if (typeof checkBlanquitaMealNotifications === 'function') {
      checkBlanquitaMealNotifications();
    }
    showContentPreview('\\uD83D\\uDD14 Recordatorios activados', 'Recibir\\u00e1s notificaciones ' + state.blanquitaReminders.minutesBefore + ' min antes de cada comida de Blanquita. Tambi\\u00e9n alertas si pasa m\\u00e1s de 4h sin comer.');
  } else {
    showContentPreview('\\uD83D\\uDD15 Recordatorios desactivados', 'Ya no recibir\\u00e1s notificaciones de las comidas de Blanquita.');
  }
}

function setBlanquitaReminderMinutes(minutes) {
  var state = getAppState();
  if (!state.blanquitaReminders) state.blanquitaReminders = { enabled: true, minutesBefore: 5 };
  state.blanquitaReminders.minutesBefore = minutes;
  state.blanquitaReminders.enabled = true;
  saveState();
  renderComidas();
  showContentPreview('\\u23f0 Recordatorio actualizado', 'Recibir\\u00e1s notificaciones ' + minutes + ' minutos antes de cada comida.');
}

'''

# Insert before "function renderMedicina()"
insert_point = app_content.find('function renderMedicina()')
if insert_point >= 0:
    app_content = app_content[:insert_point] + toggle_func + app_content[insert_point:]
    print("Added toggleBlanquitaReminders and setBlanquitaReminderMinutes to app.js")
else:
    print("ERROR: Could not find renderMedicina in app.js")

# Add reminder toggle UI to renderComidas - insert before the notes section at the bottom
# Find the notes section HTML start
notes_marker = '<div style=\"background:rgba(232,125,158,0.04);border:0.5px solid rgba(232,125,158,0.15);border-radius:var(--radius2);padding:16px;margin-bottom:20px;\">'
reminder_ui = '''
    <div id="bm-reminder-section" style="background:rgba(77,171,247,0.04);border:0.5px solid rgba(77,171,247,0.15);border-radius:var(--radius2);padding:16px;margin-bottom:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px;">\\ud83d\\udd14</span>
          <h4 style="font-size:14px;font-weight:500;color:var(--text);margin:0;">Recordatorios de Comidas</h4>
        </div>
        <label class="switch" style="position:relative;display:inline-block;width:44px;height:24px;">
          <input type="checkbox" ' + (state.blanquitaReminders?.enabled ? 'checked' : '') + ' onchange="toggleBlanquitaReminders()" style="opacity:0;width:0;height:0;">
          <span class="switch-slider" style="position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background:' + (state.blanquitaReminders?.enabled ? 'var(--success)' : 'var(--bg4)') + ';border-radius:24px;transition:0.3s;"></span>
          <span class="switch-knob" style="position:absolute;content:'';height:18px;width:18px;left:3px;bottom:3px;background:var(--bg2);border-radius:50%;transition:0.3s;' + (state.blanquitaReminders?.enabled ? 'transform:translateX(20px);' : '') + '"></span>
        </label>
      </div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <span style="font-size:11px;color:var(--muted);margin-right:4px;">Recordar</span>
          ' + [5, 10, 15, 30].map(function(m) {
            var selected = (state.blanquitaReminders?.minutesBefore || 5) === m;
            return '<button class="btn btn-xs" style="background:' + (selected ? 'rgba(77,171,247,0.2)' : 'var(--bg4)') + ';color:' + (selected ? 'var(--info)' : 'var(--muted2)') + ';border:0.5px solid ' + (selected ? 'rgba(77,171,247,0.3)' : 'transparent') + ';" onclick="setBlanquitaReminderMinutes(' + m + ')">' + m + ' min</button>';
          }).join('') + '
          <span style="font-size:11px;color:var(--muted);margin-left:4px;">antes</span>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.5;">
          ' + (state.blanquitaReminders?.enabled
            ? '\\u2705 Recibir\\u00e1s notificaciones ' + (state.blanquitaReminders?.minutesBefore || 5) + ' min antes de cada comida.'
            : '\\u26a0\\ufe0f Activa los recordatorios para recibir notificaciones push antes de cada comida.')
          + '<br>\\ud83d\\udea8 Tambi\\u00e9n alertar\\u00e1 si Blanquita pasa m\\u00e1s de 4 horas sin comer.'
        </div>
      </div>
    </div>
'''

# Find where to insert the reminder UI (before the notes section)
idx = app_content.find(notes_marker)
if idx >= 0:
    app_content = app_content[:idx] + reminder_ui + app_content[idx:]
    print("Added reminder toggle UI to renderComidas")
else:
    print("ERROR: Could not find notes marker in renderComidas")

# Add CSS for the toggle switch
css_search = "margin-bottom:20px;\\n    <div id=\\"bm-reminder-section\\""
if css_search in app_content:
    print("Reminder UI added successfully")
else:
    print("WARNING: Could not verify reminder UI was added")

# ============================
# 4. Add switch-slider CSS to style.css
# ============================
CSS_PATH = r'C:\Users\somet\Desktop\puppy-track\css\style.css'
with open(CSS_PATH, 'r', encoding='utf-8') as f:
    css_content = f.read()

switch_css = '''
/* Switch toggle for reminders */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background: var(--bg4);
  border-radius: 24px;
  transition: 0.3s;
}
.switch-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: var(--bg2);
  border-radius: 50%;
  transition: 0.3s;
}
.switch input:checked + .switch-slider { background: var(--success); }
.switch input:checked + .switch-slider:before { transform: translateX(20px); }
'''

if switch_css not in css_content:
    css_content += switch_css
    with open(CSS_PATH, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print("Added switch CSS to style.css")
else:
    print("Switch CSS already present")

print("\n=== PATCH COMPLETE ===")
