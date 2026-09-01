const db = new Dexie('BiomedLabDB');

db.version(2).stores({
  pacientes: '++id,cedula,nombre',
  examenes: '++id,paciente_id,tipo_examen,fecha,codigo_servicio',
  resultados: '++id,examen_id,parametro',
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