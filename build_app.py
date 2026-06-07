#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reconstructs puppy-track/js/app.js from component parts.
The original file was truncated to 0 bytes during a failed encoding write.
This script restores ALL content plus adds the chat UI and notification integration.
"""
import os, sys

SRC = os.path.join(os.path.dirname(__file__), 'js')
OUT = os.path.join(SRC, 'app.js')

# =============================================================================
# PART 0: The original app.js content (captured from read_files output)
# The original file had 2456 lines and ~104,832 bytes.
# We reconstruct it from the known content in the conversation.
# =============================================================================

lines = []

# ── HEADER ──
lines.append('/* ══════════════════════════════════════════════')
lines.append('   NEXUS PUPPY FLOW — APP CORE v1.0')
lines.append('   Aplicación de monitoreo para Blanquita y sus 8 campeones')
lines.append('   ══════════════════════════════════════════════ */')
lines.append('')

# ── DATA MODEL ──
lines.append('/* ══════════════════════════════════════════════')
lines.append('   DATA MODEL')
lines.append('   ══════════════════════════════════════════════ */')
lines.append('')
lines.append("""const PUPPY_DATA = [
  { id: 'blanquita', name: 'Blanquita', gender: 'F', role: 'mother', color: 'Blanco', avatar: '\\U0001f415', avatarBg: 'rgba(46,204,113,0.15)', avatarColor: '#2ecc71', notes: 'Madre de la camada. Semi-callejera del condominio.', birthDate: null },
  { id: 'max', name: 'Max', gender: 'M', role: 'puppy', color: 'Patr\\u00f3n Steel', avatar: '\\U0001f436', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'L\\u00edder del Bloque A. Tranquilo.', birthDate: '2026-05-23' },
  { id: 'steel', name: 'Steel', gender: 'M', role: 'puppy', color: 'Patr\\u00f3n Steel', avatar: '\\U0001f436', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'Parte del Bloque A. Tranquilo como Max.', birthDate: '2026-05-23' },
  { id: 'sydney', name: 'Sydney', gender: 'M', role: 'puppy', color: 'Marr\\u00f3n claro', avatar: '\\U0001f436', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'De quien se enamora Max. Bloque A.', birthDate: '2026-05-23' },
  { id: 'arturo', name: 'Arturo', gender: 'M', role: 'puppy', color: 'Marr\\u00f3n oscuro', avatar: '\\U0001f436', avatarBg: 'rgba(77,171,247,0.15)', avatarColor: '#4dabf7', notes: 'Bloque B. Es de los m\\u00e1s grandes y fuertes.', birthDate: '2026-05-23' },
  { id: 'travieso', name: 'Travieso', gender: 'M', role: 'puppy', color: 'Peque\\u00f1o dominante', avatar: '\\U0001f415', avatarBg: 'rgba(224,184,92,0.15)', avatarColor: '#e0b85c', notes: 'EL M\\u00c1S PEQUE\\u00d1O. Prioridad m\\u00e1xima en alimentaci\\u00f3n. Bloque B \\u2014 siempre en tetas traseras de Blanquita.', birthDate: '2026-05-23' },
  { id: 'chana', name: 'Chana', gender: 'F', role: 'puppy', color: 'Blanco con manchas', avatar: '\\U0001f429', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'Bloque B. Fuerte, come bien.', birthDate: '2026-05-23' },
  { id: 'alofoka', name: 'Alofoka', gender: 'F', role: 'puppy', color: 'Gris claro', avatar: '\\U0001f429', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'Bloque A. Tranquila.', birthDate: '2026-05-23' },
  { id: 'rodotesa', name: 'Rodotesa', gender: 'F', role: 'puppy', color: 'Marr\\u00f3n claro', avatar: '\\U0001f429', avatarBg: 'rgba(232,125,158,0.15)', avatarColor: '#e87d9e', notes: 'Le gusta rodar. Bloque B.', birthDate: '2026-05-23' }
];""")

lines.append('')
lines.append("""const FEEDING_BLOCKS = {
  'A': { name: 'Bloque A \\u2014 Los L\\u00edderes', members: ['max', 'steel', 'sydney', 'alofoka'], desc: 'Los m\\u00e1s tranquilos' },
  'B': { name: 'Bloque B \\u2014 Los Fuertes + Guerrero', members: ['arturo', 'chana', 'rodotesa', 'travieso'], desc: 'Travieso siempre en tetas traseras de Blanquita' }
};""")

lines.append('')
lines.append("""const FEEDING_TIMES = [
  { time: '02:00', label: 'Madrugada' },
  { time: '06:00', label: 'Amanecer' },
  { time: '10:00', label: 'Media ma\\u00f1ana' },
  { time: '14:00', label: 'Mediod\\u00eda' },
  { time: '18:00', label: 'Tarde' },
  { time: '22:00', label: 'Noche' }
];""")

lines.append('')
lines.append("""const MEDICAL_EVENTS = [
  { id: 'desp1', title: '1ra Desparasitaci\\u00f3n Interna', desc: 'Pamoato de Pirantel en jarabe. Pesar a cada cachorro para dosis exacta.', date: '2026-06-13', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'desp2', title: '2da Desparasitaci\\u00f3n Interna', desc: 'Repetir dosis de Pamoato de Pirantel.', date: '2026-06-28', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'vac1', title: '1ra Vacuna Puppy (Parvovirus + Moquillo)', desc: '\\u00a1LA M\\u00c1S IMPORTANTE! Vacuna puppy combinada.', date: '2026-07-07', type: 'vaccine', status: 'pending', forPuppies: true },
  { id: 'desp3', title: '3ra Desparasitaci\\u00f3n Interna', desc: 'Refuerzo de desparasitaci\\u00f3n oral.', date: '2026-07-13', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'desp4', title: '4ta Desparasitaci\\u00f3n Interna', desc: '\\u00daltima desparasitaci\\u00f3n oral programada.', date: '2026-07-28', type: 'deworming', status: 'pending', forPuppies: true },
  { id: 'vac2', title: '2da Vacuna Puppy (Refuerzo)', desc: 'Refuerzo de la vacuna puppy.', date: '2026-08-07', type: 'vaccine', status: 'pending', forPuppies: true },
  { id: 'rabia', title: 'Vacuna Antirr\\u00e1bica', desc: 'A partir de los 3 meses de edad.', date: '2026-08-23', type: 'vaccine', status: 'pending', forPuppies: true },
  { id: 'bath1', title: 'Primer Ba\\u00f1o Oficial', desc: 'Los cachorros pueden ba\\u00f1arse con agua tibia a partir de los 2 meses. Usar champ\\u00fa suave.', date: '2026-07-23', type: 'bath', status: 'pending', forPuppies: true },
  { id: 'blanquita-check', title: 'Revisi\\u00f3n Blanquita \\u2014 Signos de Mastitis', desc: 'Revisar tetas: \\u00bfcalientes, duras o moradas? Signos de mastitis. Si presenta s\\u00edntomas, llevar al veterinario URGENTE.', date: '2026-06-07', type: 'checkup', status: 'pending', forPuppies: false }
];""")

# ── Major sections from the original file ──

# We'll write the big sections using a function that reads from embedded files
# For practicality, let me use a different approach - write the full JS from a template

# Actually, the original file had ~104K chars which is too large to reconstruct
# perfectly from conversation context. Let me take a smarter approach:
# 1. Extract the original content from the surviving agent.js and notifications.js
# 2. Write the app.js one section at a time

print("This is a placeholder - reconstructing the full 104K JS file from")
print("conversation context is impractical as a Python script.")
print()
print("Strategy: Write app.js sections directly in the terminal")
print("using the write_file tool for each major section.")

# Check what files exist
for f in os.listdir(SRC):
    sz = os.path.getsize(os.path.join(SRC, f))
    print(f"  {f}: {sz} bytes")
