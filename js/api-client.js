/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — API Client v1.0
   Conexión con el backend FastAPI + SQLite
   ══════════════════════════════════════════════ */

const API_BASE = 'http://localhost:8000/api';

// ─── Helper ───
async function apiFetch(path, options = {}) {
  try {
    const url = API_BASE + path;
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('API error:', err);
      return { ok: false, error: err };
    }
    return await res.json();
  } catch (e) {
    console.error('API connection error:', e);
    return { ok: false, error: 'No se pudo conectar al servidor. ¿Está corriendo el backend?' };
  }
}

// ─── Health ───
async function apiHealth() {
  return apiFetch('/health');
}

// ─── Puppies ───
async function apiGetPuppies() {
  return apiFetch('/puppies');
}

// ─── Weights ───
async function apiGetWeights(puppyId) {
  const q = puppyId ? `?puppy_id=${puppyId}` : '';
  return apiFetch('/weights' + q);
}

async function apiAddWeight(puppyId, date, value) {
  return apiFetch('/weights', {
    method: 'POST',
    body: JSON.stringify({ puppy_id: puppyId, date, value }),
  });
}

async function apiDeleteWeight(weightId) {
  return apiFetch(`/weights/${weightId}`, { method: 'DELETE' });
}

// ─── Feedings ───
async function apiGetFeedings(date) {
  const q = date ? `?date=${date}` : '';
  return apiFetch('/feedings' + q);
}

async function apiMarkFeeding(date, timeKey, blockA, blockB) {
  return apiFetch('/feedings', {
    method: 'POST',
    body: JSON.stringify({ date, time_key: timeKey, block_a: blockA, block_b: blockB }),
  });
}

// ─── Medical ───
async function apiGetMedical() {
  return apiFetch('/medical');
}

async function apiToggleMedical(eventId) {
  return apiFetch('/medical/toggle', {
    method: 'POST',
    body: JSON.stringify({ event_id: eventId }),
  });
}

async function apiAddCustomEvent(title, date, type, description) {
  return apiFetch('/medical/custom', {
    method: 'POST',
    body: JSON.stringify({ title, date, type, description }),
  });
}

// ─── Blanquita Meals ───
async function apiGetBlanquitaMeals(date) {
  const q = date ? `?date=${date}` : '';
  return apiFetch('/blanquita/meals' + q);
}

async function apiMarkBlanquitaMeal(date, timeStr, portion, notes) {
  return apiFetch('/blanquita/meals', {
    method: 'POST',
    body: JSON.stringify({ date, time_str: timeStr, portion, notes }),
  });
}

// ─── Reminders ───
async function apiGetReminders() {
  return apiFetch('/blanquita/reminders');
}

async function apiUpdateReminders(enabled, minutesBefore) {
  return apiFetch('/blanquita/reminders', {
    method: 'POST',
    body: JSON.stringify({ enabled, minutes_before: minutesBefore }),
  });
}

// ─── Migration ───
async function apiMigrate(data) {
  return apiFetch('/migrate', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

// ─── Export ───
async function apiExportJSON() {
  window.open(API_BASE + '/export/json', '_blank');
}

async function apiExportExcel() {
  window.open(API_BASE + '/export/excel', '_blank');
}

async function apiExportWeightsCSV() {
  const res = await apiFetch('/export/csv/weights');
  if (res.ok && res.csv) {
    const blob = new Blob(['\uFEFF' + res.csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pesos-cachorros.csv';
    a.click();
  }
}

// ─── Stats ───
async function apiGetStats() {
  return apiFetch('/stats');
}

// ─── Connection check ───
let _apiConnected = false;
let _apiCheckPromise = null;

async function checkApiConnection() {
  if (_apiCheckPromise) return _apiCheckPromise;
  _apiCheckPromise = apiHealth().then(res => {
    _apiConnected = res.status === 'ok';
    return _apiConnected;
  }).catch(() => {
    _apiConnected = false;
    return false;
  });
  return _apiCheckPromise;
}

function isApiConnected() {
  return _apiConnected;
}
