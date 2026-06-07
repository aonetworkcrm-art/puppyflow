"""
Patch to add Blanquita meal push reminders (fixed version).
"""
import os

NOTIF_PATH = r'C:\Users\somet\Desktop\puppy-track\js\notifications.js'
APP_PATH = r'C:\Users\somet\Desktop\puppy-track\js\app.js'
CSS_PATH = r'C:\Users\somet\Desktop\puppy-track\css\style.css'

# ============================
# 1. Add checkBlanquitaMealNotifications to notifications.js
# ============================
with open(NOTIF_PATH, 'r', encoding='utf-8') as f:
    notif_content = f.read()

blanquita_notif_func = r'''
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

'''

# Insert before "function startNotifEngine()"
insert_point = notif_content.find('function startNotifEngine()')
if insert_point >= 0:
    notif_content = notif_content[:insert_point] + blanquita_notif_func + notif_content[insert_point:]
    print("Added checkBlanquitaMealNotifications")
else:
    print("ERROR: Could not find startNotifEngine")

# Update the interval to call the new function
old_interval = """    _notifInterval = setInterval(() => {
      checkFeedingNotifications();
      checkMedicalNotifications();
      checkDailyBriefing();
    }, 60000);"""
new_interval = """    _notifInterval = setInterval(() => {
      checkFeedingNotifications();
      checkMedicalNotifications();
      checkBlanquitaMealNotifications();
      checkDailyBriefing();
    }, 60000);"""
if old_interval in notif_content:
    notif_content = notif_content.replace(old_interval, new_interval)
    print("Added to interval loop")
else:
    print("WARNING: interval pattern not found")

# Update the immediate run
old_immediate = """    checkFeedingNotifications();
    checkMedicalNotifications();
    checkDailyBriefing();"""
new_immediate = """    checkFeedingNotifications();
    checkMedicalNotifications();
    checkBlanquitaMealNotifications();
    checkDailyBriefing();"""
count = notif_content.count(old_immediate)
if count >= 2:
    notif_content = notif_content.replace(old_immediate, new_immediate, count)
    print(f"Added to immediate run ({count} replacements)")

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

# ============================
# 3. Add toggle functions
# ============================
toggle_func = r'''
function toggleBlanquitaReminders() {
  var state = getAppState();
  if (!state.blanquitaReminders) state.blanquitaReminders = { enabled: false, minutesBefore: 5 };
  state.blanquitaReminders.enabled = !state.blanquitaReminders.enabled;
  saveState();
  renderComidas();
  if (state.blanquitaReminders.enabled) {
    if (typeof requestNotifPermission === 'function') requestNotifPermission();
    if (typeof checkBlanquitaMealNotifications === 'function') checkBlanquitaMealNotifications();
    showContentPreview('\U0001f514 Recordatorios activados', 'Recibiras notificaciones ' + state.blanquitaReminders.minutesBefore + ' min antes de cada comida. Tambien alertas si pasa mas de 4h sin comer.');
  } else {
    showContentPreview('\U0001f515 Recordatorios desactivados', 'Ya no recibiras notificaciones de las comidas de Blanquita.');
  }
}

function setBlanquitaReminderMinutes(minutes) {
  var state = getAppState();
  if (!state.blanquitaReminders) state.blanquitaReminders = { enabled: true, minutesBefore: 5 };
  state.blanquitaReminders.minutesBefore = minutes;
  state.blanquitaReminders.enabled = true;
  saveState();
  renderComidas();
  showContentPreview('\u23f0 Recordatorio actualizado', 'Recibiras notificaciones ' + minutes + ' minutos antes de cada comida.');
}

'''

insert_point = app_content.find('function renderMedicina()')
if insert_point >= 0:
    app_content = app_content[:insert_point] + toggle_func + app_content[insert_point:]
    print("Added toggle functions to app.js")

# ============================
# 4. Add reminder UI to renderComidas
# ============================
notes_marker = '<div style=\"background:rgba(232,125,158,0.04);border:0.5px solid rgba(232,125,158,0.15);border-radius:var(--radius2);padding:16px;margin-bottom:20px;\">'
reminder_ui = r'''
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
          })() + '
          <span style="font-size:11px;color:var(--muted);">min antes</span>
        </div>
        <div style="margin-top:8px;font-size:11px;color:var(--muted);line-height:1.5;">
          ' + (state.blanquitaReminders?.enabled
            ? '\u2705 Recibiras notificaciones ' + (state.blanquitaReminders?.minutesBefore || 5) + ' min antes de cada comida.'
            : '\u26a0\ufe0f Activa los recordatorios para recibir notificaciones push antes de cada comida.')
          + '<br>\U0001f6a8 Tambien alertara si Blanquita pasa mas de 4 horas sin comer.'
        </div>
      </div>
    </div>
'''

idx = app_content.find(notes_marker)
if idx >= 0:
    app_content = app_content[:idx] + reminder_ui + app_content[idx:]
    print("Added reminder UI to renderComidas")

with open(APP_PATH, 'w', encoding='utf-8') as f:
    f.write(app_content)

# ============================
# 5. Add CSS
# ============================
switch_css = '\n/* Switch toggle animations */\n.switch-slider:before {\n  position: absolute;\n  content: "";\n  height: 18px;\n  width: 18px;\n  left: 3px;\n  bottom: 3px;\n  background: var(--bg2);\n  border-radius: 50%;\n  transition: 0.3s;\n}\n'

if os.path.exists(CSS_PATH):
    with open(CSS_PATH, 'r', encoding='utf-8') as f:
        css_content = f.read()
    if 'switch-slider:before' not in css_content:
        css_content += switch_css
        with open(CSS_PATH, 'w', encoding='utf-8') as f:
            f.write(css_content)
        print("Added switch CSS")

print("\n=== PATCH COMPLETE ===")
