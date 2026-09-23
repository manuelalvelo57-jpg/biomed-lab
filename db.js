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

// Función auxiliar para generar un salt aleatorio de 16 bytes
function generateSalt() {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Función para cifrar la contraseña combinándola con el salt (SHA-256)
async function hashPasswordWithSalt(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compatibilidad con código legado si requiere hash simple
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Inicialización del usuario admin con Salt
async function initDefaultUser() {
  const adminExists = await db.users.get('admin');
  if (!adminExists) {
    const salt = generateSalt();
    const hashedPassword = await hashPasswordWithSalt('admin123', salt);
    
    await db.users.put({
      username: 'admin',
      password: hashedPassword,
      salt: salt,
      role: 'admin'
    });
    console.log('Usuario admin creado con Salt exitosamente.');
  }
}

// Helper para parsear rangos y verificar valores alterados
function esValorFueraDeRango(valorStr, rangoStr, sexoPaciente = '') {
  if (valorStr === null || valorStr === undefined || !rangoStr) return false;
  
  const valNum = parseFloat(String(valorStr).replace(',', '.'));
  if (isNaN(valNum)) return false;

  let rangoTarget = rangoStr.trim();

  if (rangoTarget.includes('/')) {
    const partes = rangoTarget.split('/');
    const sexoNormalizado = String(sexoPaciente).trim().toUpperCase();
    const sexoPrefix = (sexoNormalizado === 'H' || sexoNormalizado === 'MASCULINO') ? 'H:' : 'M:';
    
    const coincidencia = partes.find(p => p.trim().startsWith(sexoPrefix));
    if (coincidencia) {
      rangoTarget = coincidencia.replace(sexoPrefix, '').trim();
    }
  }

  if (rangoTarget.startsWith('<')) {
    const max = parseFloat(rangoTarget.replace('<', '').trim());
    return !isNaN(max) && valNum >= max;
  }

  if (rangoTarget.startsWith('>')) {
    const min = parseFloat(rangoTarget.replace('>', '').trim());
    return !isNaN(min) && valNum <= min;
  }

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