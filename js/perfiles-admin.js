/* ══════════════════════════════════════════════
   NEXUS PUPPY FLOW — PERFILES ADMIN v1.0
   Editor de perfiles + Agregar nuevos perros
   ══════════════════════════════════════════════ */

// ─── Add a new puppy to PUPPY_DATA ───
function addNewPuppy(id, name, gender, color, notes, block) {
  var genderMap = { M: { avatar: '🐶', bg: 'rgba(77,171,247,0.15)', color: '#4dabf7' }, F: { avatar: '🐩', bg: 'rgba(232,125,158,0.15)', color: '#e87d9e' } };
  var g = genderMap[gender] || genderMap.M;
  var newPuppy = {
    id: id,
    name: name,
    gender: gender,
    role: 'puppy',
    color: color,
    avatar: g.avatar,
    avatarBg: g.bg,
    avatarColor: g.color,
    notes: notes || '',
    birthDate: '2026-05-23'
  };
  PUPPY_DATA.push(newPuppy);
  // Store custom IDs in localStorage
  var state = getAppState();
  if (!state.customPuppies) state.customPuppies = [];
  state.customPuppies.push(id);
  saveState();
  return newPuppy;
}

// ─── Edit an existing puppy in PUPPY_DATA ───
function editPuppy(id, updates) {
  var idx = -1;
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    if (PUPPY_DATA[i].id === id) { idx = i; break; }
  }
  if (idx < 0) return false;
  for (var key in updates) {
    if (key === 'gender') {
      PUPPY_DATA[idx].gender = updates.gender;
      var genderMap = { M: { avatar: '🐶', bg: 'rgba(77,171,247,0.15)', color: '#4dabf7' }, F: { avatar: '🐩', bg: 'rgba(232,125,158,0.15)', color: '#e87d9e' } };
      var g = genderMap[updates.gender] || genderMap.M;
      PUPPY_DATA[idx].avatar = g.avatar;
      PUPPY_DATA[idx].avatarBg = g.bg;
      PUPPY_DATA[idx].avatarColor = g.color;
    } else {
      PUPPY_DATA[idx][key] = updates[key];
    }
  }
  saveState();
  return true;
}

// ─── Delete a custom puppy ───
function deleteCustomPuppy(id) {
  var state = getAppState();
  if (!state.customPuppies || state.customPuppies.indexOf(id) < 0) return false;
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    if (PUPPY_DATA[i].id === id) {
      PUPPY_DATA.splice(i, 1);
      break;
    }
  }
  state.customPuppies = state.customPuppies.filter(function(cid) { return cid !== id; });
  saveState();
  return true;
}

// ─── Open Add Puppy Modal ───
function openAddPuppyModal() {
  var bodyHTML = '<div class="form-group"><label>Nombre</label><input type="text" id="new-puppy-name" placeholder="Ej: Rocky" /></div>';
  bodyHTML += '<div class="form-group"><label>ID único (sin espacios)</label><input type="text" id="new-puppy-id" placeholder="Ej: rocky" /></div>';
  bodyHTML += '<div class="form-group"><label>Género</label><select id="new-puppy-gender"><option value="M">Macho 🐶</option><option value="F">Hembra 🐩</option></select></div>';
  bodyHTML += '<div class="form-group"><label>Color/Pelaje</label><input type="text" id="new-puppy-color" placeholder="Ej: Marrón claro" /></div>';
  bodyHTML += '<div class="form-group"><label>Bloque (opcional)</label><select id="new-puppy-block"><option value="">Ninguno</option><option value="A">Bloque A</option><option value="B">Bloque B</option></select></div>';
  bodyHTML += '<div class="form-group"><label>Notas</label><textarea id="new-puppy-notes" rows="2" placeholder="Descripción..."></textarea></div>';
  openModal('🐾 Agregar Nuevo Perro', bodyHTML, '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button><button class="btn btn-sm btn-success" onclick="saveNewPuppy()">Guardar</button>');
}

function saveNewPuppy() {
  var name = document.getElementById('new-puppy-name')?.value.trim();
  var id = document.getElementById('new-puppy-id')?.value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  var gender = document.getElementById('new-puppy-gender')?.value;
  var color = document.getElementById('new-puppy-color')?.value.trim();
  var block = document.getElementById('new-puppy-block')?.value;
  var notes = document.getElementById('new-puppy-notes')?.value.trim();

  if (!name || !id) { showToast('Completa nombre e ID', ''); return; }
  // Check duplicate
  for (var i = 0; i < PUPPY_DATA.length; i++) {
    if (PUPPY_DATA[i].id === id) { showToast('Ya existe un perro con ese ID', ''); return; }
  }
  addNewPuppy(id, name, gender, color || 'Desconocido', notes, block);
  // Add to feeding block if specified
  if (block && FEEDING_BLOCKS[block]) {
    FEEDING_BLOCKS[block].members.push(id);
    // Save feeding blocks to state
    var state = getAppState();
    if (!state.customFeedingBlocks) state.customFeedingBlocks = JSON.parse(JSON.stringify(FEEDING_BLOCKS));
    state.customFeedingBlocks[block].members.push(id);
    saveState();
  }
  closeModal();
  showToast('✅ ' + name + ' agregado a la camada', 'success');
  if (typeof renderPerfiles === 'function') renderPerfiles();
}

// ─── Open Edit Puppy Modal ───
function openEditPuppyModal(puppyId) {
  var p = puppyById(puppyId);
  if (!p) return;
  var isCustom = false;
  var state = getAppState();
  if (state.customPuppies && state.customPuppies.indexOf(puppyId) >= 0) isCustom = true;
  
  var bodyHTML = '<div class="form-group"><label>Nombre</label><input type="text" id="edit-puppy-name" value="' + p.name + '" /></div>';
  bodyHTML += '<div class="form-group"><label>Género</label><select id="edit-puppy-gender"><option value="M"' + (p.gender === 'M' ? ' selected' : '') + '>Macho 🐶</option><option value="F"' + (p.gender === 'F' ? ' selected' : '') + '>Hembra 🐩</option></select></div>';
  bodyHTML += '<div class="form-group"><label>Color/Pelaje</label><input type="text" id="edit-puppy-color" value="' + p.color + '" /></div>';
  bodyHTML += '<div class="form-group"><label>Notas</label><textarea id="edit-puppy-notes" rows="3">' + (state.puppyNotes[puppyId] || p.notes || '') + '</textarea></div>';
  
  var footerHTML = '<button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>';
  footerHTML += '<button class="btn btn-sm btn-success" onclick="saveEditPuppy(\'' + puppyId + '\')">Guardar cambios</button>';
  if (isCustom) {
    footerHTML += '<button class="btn btn-sm btn-danger" onclick="confirmDeletePuppy(\'' + puppyId + '\')">Eliminar</button>';
  }
  openModal('✏️ Editar ' + p.name, bodyHTML, footerHTML);
}

function saveEditPuppy(puppyId) {
  var name = document.getElementById('edit-puppy-name')?.value.trim();
  var gender = document.getElementById('edit-puppy-gender')?.value;
  var color = document.getElementById('edit-puppy-color')?.value.trim();
  var notes = document.getElementById('edit-puppy-notes')?.value.trim();
  if (!name) { showToast('El nombre es obligatorio', ''); return; }
  editPuppy(puppyId, { name: name, gender: gender, color: color || 'Desconocido' });
  // Save notes to state
  var state = getAppState();
  state.puppyNotes[puppyId] = notes || '';
  saveState();
  closeModal();
  showToast('✅ ' + name + ' actualizado', 'success');
  if (typeof renderPerfiles === 'function') renderPerfiles();
}

function confirmDeletePuppy(puppyId) {
  var p = puppyById(puppyId);
  if (!p) return;
  if (confirm('¿Eliminar a ' + p.name + ' permanentemente?')) {
    deleteCustomPuppy(puppyId);
    closeModal();
    showToast('🗑️ ' + p.name + ' eliminado', '');
    if (typeof renderPerfiles === 'function') renderPerfiles();
  }
}
