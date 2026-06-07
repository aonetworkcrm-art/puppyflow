/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — Data Management Panel v1.0
   Panel de gestión de datos con respaldo, migración y exportación
   ══════════════════════════════════════════════ */

function renderDataPanel() {
  var container = document.getElementById('datos-content');
  if (!container) return;

  var html = '<div class="page-header"><h1>Gestión de Datos</h1><p>Administra, respalda y migra todos los datos de la aplicación</p></div>';

  // Connection status
  html += '<div class="next-feeding-banner" style="background:linear-gradient(135deg,var(--bg3),rgba(77,171,247,0.05));border-color:rgba(77,171,247,0.2);margin-bottom:20px;">';
  html += '  <div>';
  html += '    <div class="nfb-label">Estado del Servidor</div>';
  html += '    <div class="nfb-time" id="server-status" style="font-size:18px;color:var(--muted2);">Verificando conexión...</div>';
  html += '  </div>';
  html += '  <div class="nfb-countdown" id="server-actions">';
  html += '    <button class="btn btn-xs btn-ghost" onclick="checkServerStatus()">Reintentar</button>';
  html += '  </div>';
  html += '</div>';

  // Stats cards
  html += '<div class="dashboard-grid" id="data-stats-grid">';
  html += '  <div class="stat-card" style="border-color:rgba(77,171,247,0.15);"><div class="stat-icon">🔌</div><div class="stat-label">API Status</div><div class="stat-value" id="stat-api-status" style="font-size:16px;color:var(--muted2);">—</div><div class="stat-sub">FastAPI + SQLite</div></div>';
  html += '  <div class="stat-card stat-card-green"><div class="stat-icon">💾</div><div class="stat-label">Base de Datos</div><div class="stat-value" id="stat-db-size" style="font-size:16px;color:var(--success);">—</div><div class="stat-sub">SQLite en backend/</div></div>';
  html += '  <div class="stat-card stat-card-pink"><div class="stat-icon">📦</div><div class="stat-label">localStorage</div><div class="stat-value" id="stat-ls-size" style="font-size:16px;color:var(--pink);">—</div><div class="stat-sub">Datos del navegador</div></div>';
  html += '</div>';

  // Action cards
  html += '<h3 style="font-size:14px;font-weight:500;color:var(--text);margin:24px 0 12px;">Acciones</h3>';
  html += '<div class="content-tools">';

  // 1. Migrate
  html += '<div class="content-card" onclick="openMigrateModal()" id="card-migrate">';
  html += '  <div class="cc-icon">🔄</div><h3>Migrar a SQLite</h3>';
  html += '  <p>Copia todos los datos de localStorage a la base de datos SQLite del servidor</p>';
  html += '</div>';

  // 2. Export Excel
  html += '<div class="content-card" onclick="apiExportExcel();showContentPreview(\'📊 Exportado\', \'Archivo Excel generado con todos los datos.\')">';
  html += '  <div class="cc-icon">📊</div><h3>Exportar a Excel</h3>';
  html += '  <p>Exporta perfiles, pesos, alimentaciones, eventos médicos y comidas a un workbook</p>';
  html += '</div>';

  // 3. Export JSON
  html += '<div class="content-card" onclick="apiExportJSON();showContentPreview(\'📦 Exportado\', \'Archivo JSON completo descargándose.\')">';
  html += '  <div class="cc-icon">📦</div><h3>Exportar a JSON</h3>';
  html += '  <p>Respaldo completo de la base de datos en formato JSON</p>';
  html += '</div>';

  // 4. Export CSV
  html += '<div class="content-card" onclick="apiExportWeightsCSV();showContentPreview(\'📄 Exportado\', \'CSV de pesos descargándose.\')">';
  html += '  <div class="cc-icon">📄</div><h3>Exportar Pesos (CSV)</h3>';
  html += '  <p>Datos de peso de todos los cachorros en formato CSV</p>';
  html += '</div>';

  // 5. View data
  html += '<div class="content-card" onclick="openDataViewerModal()" id="card-viewer">';
  html += '  <div class="cc-icon">🔍</div><h3>Explorar Datos</h3>';
  html += '  <p>Visualiza y edita todos los registros almacenados en la base de datos</p>';
  html += '</div>';

  // 6. Backup localStorage
  html += '<div class="content-card" onclick="exportAllDataJSON()">';
  html += '  <div class="cc-icon">💾</div><h3>Backup localStorage</h3>';
  html += '  <p>Respaldo local de los datos del navegador (sin servidor)</p>';
  html += '</div>';

  html += '</div>';

  // Log section
  html += '<h3 style="font-size:14px;font-weight:500;color:var(--text);margin:24px 0 12px;">Historial de Migración</h3>';
  html += '<div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Tipo de Datos</th><th>Registros</th></tr></thead><tbody id="migration-log-body">';
  html += '<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:20px;">Conéctate al servidor para ver el historial</td></tr>';
  html += '</tbody></table></div>';

  container.innerHTML = html;

  // Check server status
  checkServerStatus();
}

function checkServerStatus() {
  var statusEl = document.getElementById('server-status');
  var apiStatEl = document.getElementById('stat-api-status');
  var dbStatEl = document.getElementById('stat-db-size');
  var lsStatEl = document.getElementById('stat-ls-size');

  if (!statusEl) return;

  statusEl.textContent = 'Conectando...';
  statusEl.style.color = 'var(--warning)';

  // Check localStorage size
  if (lsStatEl) {
    try {
      var lsData = localStorage.getItem('nexus_puppy_flow') || '';
      lsStatEl.textContent = (lsData.length / 1024).toFixed(1) + ' KB';
    } catch (e) {
      lsStatEl.textContent = '—';
    }
  }

  // Try API connection
  apiHealth().then(function(res) {
    if (res.status === 'ok') {
      statusEl.textContent = '✅ Servidor conectado (v' + res.version + ')';
      statusEl.style.color = 'var(--success)';
      if (apiStatEl) {
        apiStatEl.textContent = '✅ Online';
        apiStatEl.style.color = 'var(--success)';
      }
      // Get stats
      return apiGetStats();
    } else {
      throw new Error('Invalid response');
    }
  }).then(function(statsRes) {
    if (statsRes.ok && statsRes.data) {
      if (dbStatEl) {
        dbStatEl.textContent = statsRes.data.db_size_kb + ' KB';
      }
      // Update migration log
      var logBody = document.getElementById('migration-log-body');
      if (logBody && statsRes.data.migration_log && statsRes.data.migration_log.length > 0) {
        logBody.innerHTML = '';
        for (var i = 0; i < statsRes.data.migration_log.length; i++) {
          var log = statsRes.data.migration_log[i];
          logBody.innerHTML += '<tr><td>' + log.migrated_at + '</td><td>' + log.data_type + '</td><td>' + log.records_count + '</td></tr>';
        }
      }
      // Enable migrate button
      var migBtn = document.getElementById('card-migrate');
      if (migBtn) migBtn.style.opacity = '1';
    }
  }).catch(function() {
    statusEl.textContent = '❌ Servidor no encontrado (localhost:8000)';
    statusEl.style.color = 'var(--danger)';
    if (apiStatEl) {
      apiStatEl.textContent = '❌ Offline';
      apiStatEl.style.color = 'var(--danger)';
    }
  });
}

// ─── Migrate Modal ───

function openMigrateModal() {
  // Get current localStorage data
  var state = getAppState ? getAppState() : {};
  var dataStr = JSON.stringify(state, null, 2);
  var recordsCount = 0;
  if (state.weights) for (var k in state.weights) recordsCount += state.weights[k].length;
  if (state.feedings) for (var d in state.feedings) for (var t in state.feedings[d]) recordsCount++;
  if (state.blanquitaMeals) for (var d in state.blanquitaMeals) for (var t in state.blanquitaMeals[d]) recordsCount++;

  var bodyHTML = '<div style="margin-bottom:16px;">';
  bodyHTML += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;background:var(--bg3);border-radius:var(--radius2);padding:16px;">';
  bodyHTML += '  <span style="font-size:32px;">🔄</span>';
  bodyHTML += '  <div><div style="font-size:16px;font-weight:600;color:var(--text);">Migrar datos a SQLite</div>';
  bodyHTML += '  <div style="font-size:12px;color:var(--muted);">Copia todos los datos de localStorage a la base de datos del servidor</div></div>';
  bodyHTML += '</div>';

  bodyHTML += '<div class="dashboard-grid" style="margin-bottom:16px;">';
  bodyHTML += '  <div class="feed-stat-card"><div class="fs-icon">💻</div><div class="fs-label">localStorage</div><div class="fs-value" style="font-size:14px;color:var(--pink);">~' + recordsCount + ' registros</div></div>';
  bodyHTML += '  <div class="feed-stat-card"><div class="fs-icon">🗄️</div><div class="fs-label">SQLite Server</div><div class="fs-value" style="font-size:14px;color:var(--success);" id="migrate-dest-status">Verificando...</div></div>';
  bodyHTML += '</div>';

  bodyHTML += '<div style="background:rgba(224,184,92,0.04);border:0.5px solid rgba(224,184,92,0.15);border-radius:var(--radius);padding:12px 14px;margin-bottom:16px;">';
  bodyHTML += '  <div style="font-size:11px;color:var(--warning);font-weight:500;margin-bottom:4px;">⚠️ Nota importante</div>';
  bodyHTML += '  <div style="font-size:11px;color:var(--text2);">Los datos migrados se suman a los existentes en SQLite. Si ya migraste antes, algunos registros podrían duplicarse. Los datos de localStorage no se eliminan.</div>';
  bodyHTML += '</div>';

  bodyHTML += '<div style="background:rgba(46,204,113,0.04);border:0.5px solid rgba(46,204,113,0.15);border-radius:var(--radius);padding:12px 14px;" id="migrate-result">';
  bodyHTML += '  <div style="font-size:11px;color:var(--muted);">Esperando confirmación...</div>';
  bodyHTML += '</div>';

  openModal('🔄 Migrar a SQLite', bodyHTML, '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-sm btn-success" id="btn-migrate-do" onclick="doMigration()">Migrar ahora</button>');

  // Check server
  apiHealth().then(function(res) {
    if (res.status === 'ok') {
      document.getElementById('migrate-dest-status').textContent = '✅ Conectado';
      document.getElementById('migrate-dest-status').style.color = 'var(--success)';
    } else {
      document.getElementById('migrate-dest-status').textContent = '❌ No conectado';
      document.getElementById('migrate-dest-status').style.color = 'var(--danger)';
      document.getElementById('btn-migrate-do').disabled = true;
    }
  });
}

function doMigration() {
  var state = getAppState ? getAppState() : {};
  var btn = document.getElementById('btn-migrate-do');
  var resultEl = document.getElementById('migrate-result');

  if (btn) { btn.disabled = true; btn.textContent = 'Migrando...'; }
  if (resultEl) resultEl.innerHTML = '<div style="font-size:11px;color:var(--warning);">⏳ Migrando datos...</div>';

  apiMigrate(state).then(function(res) {
    if (res.ok && res.counts) {
      var html = '<div style="font-size:12px;color:var(--success);font-weight:500;margin-bottom:6px;">✅ Migración completada</div>';
      html += '<div style="font-size:11px;color:var(--text2);">';
      for (var type in res.counts) {
        html += '• ' + type + ': ' + res.counts[type] + ' registros<br>';
      }
      html += '</div>';
      if (resultEl) resultEl.innerHTML = html;
      if (btn) btn.textContent = '✅ Completado';
      // Refresh data panel
      if (typeof renderDataPanel === 'function') {
        setTimeout(renderDataPanel, 1500);
      }
    } else {
      if (resultEl) resultEl.innerHTML = '<div style="font-size:12px;color:var(--danger);">❌ Error en la migración: ' + (res.error || 'desconocido') + '</div>';
      if (btn) { btn.disabled = false; btn.textContent = 'Intentar de nuevo'; }
    }
  }).catch(function(err) {
    if (resultEl) resultEl.innerHTML = '<div style="font-size:12px;color:var(--danger);">❌ Error: ' + err.message + '</div>';
    if (btn) { btn.disabled = false; btn.textContent = 'Intentar de nuevo'; }
  });
}

// ─── Data Viewer Modal ───

function openDataViewerModal() {
  var bodyHTML = '<p style="color:var(--muted);margin-bottom:16px;">Cargando datos del servidor...</p>';

  openModal('🔍 Explorar Datos', bodyHTML, '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>');

  // Fetch all data
  Promise.all([
    apiGetPuppies(),
    apiGetWeights(),
    apiGetFeedings(),
    apiGetMedical(),
    apiGetBlanquitaMeals(),
    apiGetStats()
  ]).then(function(results) {
    var pupsRes = results[0];
    var wRes = results[1];
    var fRes = results[2];
    var mRes = results[3];
    var bRes = results[4];
    var sRes = results[5];

    var html = '';

    // Tabs
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">';
    html += '  <button class="btn btn-xs" style="background:rgba(77,171,247,0.15);color:var(--info);" onclick="switchDataTab(\'puppies\')">🐾 Perfiles (' + (pupsRes.data ? pupsRes.data.length : 0) + ')</button>';
    html += '  <button class="btn btn-xs btn-ghost" onclick="switchDataTab(\'weights\')">⚖️ Pesos (' + (wRes.data ? wRes.data.length : 0) + ')</button>';
    html += '  <button class="btn btn-xs btn-ghost" onclick="switchDataTab(\'feedings\')">🍼 Alimentaciones (' + (fRes.data ? fRes.data.length : 0) + ')</button>';
    html += '  <button class="btn btn-xs btn-ghost" onclick="switchDataTab(\'medical\')">💉 Eventos Médicos (' + (mRes.data ? mRes.data.length : 0) + ')</button>';
    html += '  <button class="btn btn-xs btn-ghost" onclick="switchDataTab(\'blanquita\')">🍲 Comidas Blanquita (' + (bRes.data ? bRes.data.length : 0) + ')</button>';
    html += '  <button class="btn btn-xs btn-ghost" onclick="switchDataTab(\'stats\')">📊 Estadísticas</button>';
    html += '</div>';

    html += '<div id="data-viewer-content">';
    html += buildDataTable('puppies', pupsRes.data || []);
    html += '</div>';

    document.getElementById('modal-body').innerHTML = html;
    window._dataViewerData = {
      puppies: pupsRes.data || [],
      weights: wRes.data || [],
      feedings: fRes.data || [],
      medical: mRes.data || [],
      blanquita: bRes.data || [],
      stats: sRes.data || {}
    };
  }).catch(function() {
    document.getElementById('modal-body').innerHTML = '<div style="text-align:center;padding:30px;color:var(--danger);">❌ No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en localhost:8000.</div>';
  });
}

function switchDataTab(tab) {
  var data = window._dataViewerData;
  if (!data) return;
  var content = document.getElementById('data-viewer-content');
  if (!content) return;

  // Update button styles
  var btns = document.querySelectorAll('#modal-body .btn-xs');
  for (var i = 0; i < btns.length; i++) {
    btns[i].className = 'btn btn-xs btn-ghost';
  }
  var activeBtn = null;
  var tabNames = { puppies: 0, weights: 1, feedings: 2, medical: 3, blanquita: 4, stats: 5 };
  var idx = tabNames[tab] || 0;
  var allBtns = document.querySelectorAll('#modal-body .btn-xs');
  if (allBtns[idx]) {
    allBtns[idx].style.background = 'rgba(77,171,247,0.15)';
    allBtns[idx].style.color = 'var(--info)';
  }

  content.innerHTML = buildDataTable(tab, data[tab] || []);
}

function buildDataTable(tab, records) {
  if (!records || records.length === 0) {
    return '<div style="text-align:center;padding:30px;color:var(--muted);">No hay registros en esta categoría</div>';
  }

  var html = '<div class="table-wrap" style="max-height:300px;overflow-y:auto;">';
  html += '<table><thead><tr>';

  // Headers based on tab
  var keys = Object.keys(records[0] || {});
  for (var i = 0; i < keys.length; i++) {
    html += '<th>' + keys[i] + '</th>';
  }
  html += '</tr></thead><tbody>';

  for (var i = 0; i < records.length; i++) {
    html += '<tr>';
    for (var j = 0; j < keys.length; j++) {
      var val = records[i][keys[j]];
      if (val === null || val === undefined) val = '—';
      if (typeof val === 'boolean') val = val ? '✅' : '⬜';
      if (typeof val === 'object') val = JSON.stringify(val);
      html += '<td style="font-size:11px;font-family:var(--mono);">' + val + '</td>';
    }
    html += '</tr>';
  }

  html += '</tbody></table></div>';
  return html;
}
