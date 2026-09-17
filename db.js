// Inicialización de la base de datos IndexedDB con Dexie.js
const db = new Dexie('BiomedLabDB');

// Definición de esquema con migración de versión
db.version(1).stores({
  pacientes: '++id, &cedula, nombre, fechaRegistro',
  ordenes: '++id, pacienteId, fecha, estado',
  examenesConfig: 'key, nombre, categoria',
  usuarios: '++id, &username, rol'
});

db.version(2).stores({
  pacientes: '++id, &cedula, nombre, fechaRegistro',
  ordenes: '++id, pacienteId, fecha, estado',
  examenes: '++id, paciente_id, tipo_examen, fecha, codigo_servicio',
  resultados: '++id, examen_id, parametro',
  examenesConfig: 'key, nombre, categoria',
  config: 'clave',
  users: 'username'
});

async function solicitarAlmacenamientoPersistente() {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
      await navigator.storage.persist();
    }
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Helper para parsear rangos y verificar valores alterados (soporta "70-100", "<200", ">40" y por sexo "H:14-18 / M:12-16")
function esValorFueraDeRango(valorStr, rangoStr, sexoPaciente = '') {
  if (valorStr === null || valorStr === undefined || !rangoStr) return false;
  
  const valNum = parseFloat(String(valorStr).replace(',', '.'));
  if (isNaN(valNum)) return false;

  let rangoTarget = rangoStr.trim();

  // Si el rango viene dividido por sexo (ej: H:14.0-18.0 / M:12.0-16.0)
  if (rangoTarget.includes('/')) {
    const partes = rangoTarget.split('/');
    const sexoNormalizado = String(sexoPaciente).trim().toUpperCase();
    
    // Homologado con app.js: 'H' / 'MASCULINO' => 'H:' / 'M' / 'FEMENINO' => 'M:'
    const sexoPrefix = (sexoNormalizado === 'H' || sexoNormalizado === 'MASCULINO') ? 'H:' : 'M:';
    
    const coincidencia = partes.find(p => p.trim().startsWith(sexoPrefix));
    if (coincidencia) {
      rangoTarget = coincidencia.replace(sexoPrefix, '').trim();
    }
  }

  // Evaluar formato "< X"
  if (rangoTarget.startsWith('<')) {
    const max = parseFloat(rangoTarget.replace('<', '').trim());
    return !isNaN(max) && valNum >= max;
  }

  // Evaluar formato "> X"
  if (rangoTarget.startsWith('>')) {
    const min = parseFloat(rangoTarget.replace('>', '').trim());
    return !isNaN(min) && valNum <= min;
  }

  // Evaluar formato "MIN - MAX" (ej: 70 - 100)
  if (rangoTarget.includes('-')) {
    const [minStr, maxStr] = rangoTarget.split('-');
    const min = parseFloat(minStr.trim());
    const max = parseFloat(maxStr.trim());
    if (!isNaN(min) && !isNaN(max)) {
      return valNum < min || valNum > max;
    }
  }

  return false;
}