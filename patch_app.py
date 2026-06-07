# -*- coding: utf-8 -*-
import os, re

path = r'C:\Users\somet\Desktop\puppy-track\js\app.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

GREEN = '\x1b[92m'
RESET = '\x1b[0m'

# === 1. INSERT CHAT UI FUNCTIONS BEFORE INIT SECTION ===
# Find the LAST occurrence of the init section comment
init_marker = '/* ══════════════════════════════════════════════'
idx = content.rfind(init_marker)
if idx < 0:
    print("FAILED: init marker not found")
    exit(1)

chat_functions = r"""
/* ══════════════════════════════════════════════
   CHAT UI — AGENTE IA FLOTANTE
   ══════════════════════════════════════════════ */

function toggleChat() {
  const panel = document.getElementById("chat-panel");
  const fab = document.getElementById("chat-fab");
  if (!panel) return;
  panel.classList.toggle("open");
  if (fab) fab.classList.toggle("open");
  if (panel.classList.contains("open")) {
    document.getElementById("chat-input")?.focus();
  }
}

function addChatMessage(text, sender, actions) {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const div = document.createElement("div");
  div.className = "chat-msg chat-msg-" + sender;
  const content = document.createElement("div");
  content.className = "chat-msg-content";
  content.textContent = text;
  div.appendChild(content);
  if (actions && actions.length > 0) {
    const actionDiv = document.createElement("div");
    actionDiv.className = "chat-msg-actions";
    actions.forEach(function(a) {
      const btn = document.createElement("button");
      btn.className = "chat-action-btn";
      btn.textContent = a.label;
      btn.onclick = function() { executeAgentAction(a.action, a.data); };
      actionDiv.appendChild(btn);
    });
    div.appendChild(actionDiv);
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  addChatMessage(text, "user");
  const response = typeof generateAgentResponse === "function"
    ? generateAgentResponse(text)
    : { message: "Procesando... \u{1F504}", actions: [] };
  setTimeout(function() { addChatMessage(response.message, "agent", response.actions); }, 300);
}

function quickAgentAction(query) {
  addChatMessage(query, "user");
  const response = typeof generateAgentResponse === "function"
    ? generateAgentResponse(query)
    : { message: "Procesando... \u{1F504}", actions: [] };
  setTimeout(function() { addChatMessage(response.message, "agent", response.actions); }, 300);
  const panel = document.getElementById("chat-panel");
  if (panel && !panel.classList.contains("open")) toggleChat();
}

function showChatHelp() {
  var msg = "\u{1F916} **Nexus \u2014 Tu Agente de Camada**\\n\\n";
  msg += "Puedes preguntarme cosas como:\\n\\n";
  msg += "\u{1F43E} \"\u00bfC\u00f3mo est\u00e1 Travieso?\"\\n";
  msg += "\u{1F37C} \"\u00bfCu\u00e1ndo toca la pr\u00f3xima comida?\"\\n";
  msg += "\u2696\uFE0F \"\u00bfCu\u00e1nto pesa Max?\"\\n";
  msg += "\u{1F4CA} \"Dame un resumen\"\\n";
  msg += "\u{1F489} \"\u00bfPr\u00f3ximo evento m\u00e9dico?\"\\n";
  msg += "\u{1F3C6} \"\u00bfQui\u00e9n es el m\u00e1s pesado?\"\\n";
  msg += "\u{1F4A1} \"Tips para cuidarlos\"\\n\\n";
  msg += "Tambi\u00e9n digo \"hola\" para saludarte \u{1F60A}";
  addChatMessage(msg, "agent", [
    { label: "\u{1F4CA} Resumen", action: "BRIEFING" },
    { label: "\u2B50 Travieso", action: "TRAVIESO_STATUS" },
    { label: "\u{1F37C} Pr\u00f3xima comida", action: "NEXT_FEEDING" }
  ]);
}

/* ══════════════════════════════════════════════
   SW & NOTIFICATIONS — REGISTRO Y ARRANQUE
   ══════════════════════════════════════════════ */

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js")
    .then(function(reg) { console.log("\u{1F43E} SW registrado:", reg.scope); })
    .catch(function(err) { console.warn("SW error:", err); });
}

"""

content = content[:idx] + chat_functions + content[idx:]
print(f"{GREEN}OK{RESET} Chat UI functions inserted")

# === 2. UPDATE INIT BODY ===
old_init_body = "  console.log('\U0001f436 Cuidando a Blanquita y sus 8 campeones');\n})();"

new_init_body = """  console.log('\U0001f436 Cuidando a Blanquita y sus 8 campeones');

  // Register service worker for offline + notifications
  registerServiceWorker();

  // Start notification engine (alerts every 60s)
  if (typeof startNotifEngine === \"function\") startNotifEngine();

  // Daily briefing at morning hours
  var hour = new Date().getHours();
  if (hour >= 6 && hour <= 8 && typeof generateDailyBriefing === \"function\") generateDailyBriefing();

  // Check urgent medical events on startup
  setTimeout(function() {
    var state = getAppState();
    var allEvents = [].concat(MEDICAL_EVENTS, (state.customEvents || []).filter(function(ce) { return !state.medicalStatus[ce.id] || state.medicalStatus[ce.id] !== \"removed\"; }));
    var urgent = allEvents.filter(function(e) {
      var d = daysUntil(e.date);
      return (d <= 0 && d >= -3) && state.medicalStatus[e.id] !== \"done\";
    });
    if (urgent.length > 0 && typeof sendNotif === \"function\") {
      sendNotif(
        \"\U0001f6a8 Eventos m\u00e9dicos urgentes\",
        urgent.map(function(e) { return e.title + \" \u2014 \" + formatDate(e.date); }).join(\"\\n\"),
        \"startup-urgent-\" + getToday()
      );
    }
  }, 2000);
})();"""

if old_init_body in content:
    content = content.replace(old_init_body, new_init_body)
    print(f"{GREEN}OK{RESET} Init body updated with notifications + SW registration")
else:
    print("FAILED: Could not find init body in file")
    # Check for similar patterns
    idx = content.find('Cuidando a Blanquita')
    if idx >= 0:
        print(f"Found at position {idx}: {repr(content[idx-5:idx+80])}")
    exit(1)

# === 3. WRITE FILE ===
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"{GREEN}OK{RESET} File written ({os.path.getsize(path)} bytes)")
print(f"{GREEN}DONE{RESET} All modifications applied")
