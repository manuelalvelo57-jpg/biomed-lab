let currentUser = null;
let pacienteActualId = null;
let examenActualId = null;
let examenesConfig = {};
let labConfig = {};
let firmaBase64 = '';
let pacienteEditandoId = null;

const parametrosHematologiaBase = [
  {param:'Hemoglobina',unidad:'g/dL',ref:'H:14.0-18.0 / M:12.0-16.0'},
  {param:'Hematocrito',unidad:'%',ref:'H:42-52 / M:36-46'},
  {param:'Eritrocitos',unidad:'x10⁶/µL',ref:'4.0-5.5'},
  {param:'Leucocitos',unidad:'x10³/µL',ref:'4.5-11.0'},
  {param:'Plaquetas',unidad:'x10³/µL',ref:'150-450'},
  {param:'Neutrófilos',unidad:'%',ref:'40-70'},
  {param:'Linfocitos',unidad:'%',ref:'20-40'},
  {param:'Monocitos',unidad:'%',ref:'2-8'},
  {param:'Eosinófilos',unidad:'%',ref:'1-4'},
  {param:'Basófilos',unidad:'%',ref:'0-1'},
  {param:'VCM',unidad:'fL',ref:'80-100'},
  {param:'HCM',unidad:'pg',ref:'27-33'},
  {param:'CHCM',unidad:'g/dL',ref:'32-36'}
];

const examenesDefault = {
  hematologia:{
    nombre:'Hematología Completa',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'Recuento Reticulocitos',unidad:'%',ref:'0.5-2.5'}
    ]
  },
  pt_ptt:{
    nombre:'PT y PTT',
    parametros:[
      {param:'TP (Tiempo Protrombina)',unidad:'seg',ref:'11-14'},
      {param:'INR',unidad:'-',ref:'0.8-1.2'},
      {param:'TTPa',unidad:'seg',ref:'25-35'},
      {param:'Tiempo Sangría',unidad:'min',ref:'2-9'},
      {param:'Tiempo Coagulación',unidad:'min',ref:'5-10'}
    ]
  },
  quimica_sanguinea:{
    nombre:'Química Sanguínea General',
    parametros:[
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Ácido Úrico',unidad:'mg/dL',ref:'H:2.4-7.0 / M:2.0-6.0'},
      {param:'Colesterol Total',unidad:'mg/dL',ref:'<200'},
      {param:'Triglicéridos',unidad:'mg/dL',ref:'<150'},
      {param:'HDL-Colesterol',unidad:'mg/dL',ref:'H:>40 / M:>50'},
      {param:'LDL-Colesterol',unidad:'mg/dL',ref:'<130'},
      {param:'VLDL-Colesterol',unidad:'mg/dL',ref:'<30'},
      {param:'Proteínas Totales',unidad:'g/dL',ref:'6.0-8.3'},
      {param:'Albúmina',unidad:'g/dL',ref:'3.5-5.0'},
      {param:'Bilirrubina Total',unidad:'mg/dL',ref:'0.2-1.2'},
      {param:'Bilirrubina Directa',unidad:'mg/dL',ref:'0.0-0.3'},
      {param:'TGO/AST',unidad:'U/L',ref:'0-40'},
      {param:'TGP/ALT',unidad:'U/L',ref:'0-41'},
      {param:'Fosfatasa Alcalina',unidad:'U/L',ref:'44-147'},
      {param:'Gamma-GT',unidad:'U/L',ref:'H:9-64 / M:8-38'}
    ]
  },
  perfil_20:{
    nombre:'Perfil 20',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'TP (Tiempo Protrombina)',unidad:'seg',ref:'11-14'},
      {param:'TTPa',unidad:'seg',ref:'25-35'},
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Colesterol Total',unidad:'mg/dL',ref:'<200'},
      {param:'HDL Colesterol',unidad:'mg/dL',ref:'>40'},
      {param:'LDL Colesterol',unidad:'mg/dL',ref:'<100'},
      {param:'VLDL Colesterol',unidad:'mg/dL',ref:'<30'},
      {param:'Triglicéridos',unidad:'mg/dL',ref:'<150'},
      {param:'Ácido Úrico',unidad:'mg/dL',ref:'H:2.4-7.0 / M:2.0-6.0'},
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Proteínas Totales',unidad:'g/dL',ref:'6.0-8.3'},
      {param:'Albúmina',unidad:'g/dL',ref:'3.5-5.5'},
      {param:'Globulina',unidad:'g/dL',ref:'2.0-3.5'},
      {param:'Calcio',unidad:'mg/dL',ref:'8.5-10.5'},
      {param:'Hierro Sérico',unidad:'µg/dL',ref:'60-170'},
      {param:'TGO (AST)',unidad:'U/L',ref:'0-35'},
      {param:'TGP (ALT)',unidad:'U/L',ref:'0-45'},
      {param:'Fosfatasa Alcalina (ALP)',unidad:'U/L',ref:'44-147'},
      {param:'Bilirrubina Total',unidad:'mg/dL',ref:'0.2-1.2'},
      {param:'Bilirrubina Directa',unidad:'mg/dL',ref:'0.0-0.3'},
      {param:'Bilirrubina Indirecta',unidad:'mg/dL',ref:'0.2-0.8'},
      {param:'Orina',unidad:'-',ref:'Ver examen orina'},
      {param:'Heces Fecales',unidad:'-',ref:'Ver coproanálisis'}
    ]
  },
  combo_1:{
    nombre:'Combo 1 (Básico)',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Examen General de Orina',unidad:'Cualitativo',ref:'Normal'}
    ]
  },
  combo_2:{
    nombre:'Combo 2 (Metabólico)',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Colesterol Total',unidad:'mg/dL',ref:'<200'},
      {param:'Triglicéridos',unidad:'mg/dL',ref:'<150'},
      {param:'Ácido Úrico',unidad:'mg/dL',ref:'H:2.4-7.0 / M:2.0-6.0'}
    ]
  },
  combo_3:{
    nombre:'Combo 3 (Quirúrgico)',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'TP (Tiempo Protrombina)',unidad:'seg',ref:'11-14'},
      {param:'TTPa',unidad:'seg',ref:'25-35'},
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'VIH 1 y 2',unidad:'Cualitativo',ref:'No Reactivo'},
      {param:'VDRL',unidad:'Cualitativo',ref:'No Reactivo'}
    ]
  },
  combo_4:{
    nombre:'Combo 4 (Control General)',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Colesterol Total',unidad:'mg/dL',ref:'<200'},
      {param:'Triglicéridos',unidad:'mg/dL',ref:'<150'},
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Examen General de Orina',unidad:'Cualitativo',ref:'Normal'},
      {param:'Examen Coproanalítico',unidad:'Cualitativo',ref:'Normal'}
    ]
  },
  perfil_lipidico:{
    nombre:'Perfil Lipídico',
    parametros:[
      {param:'Colesterol Total',unidad:'mg/dL',ref:'<200'},
      {param:'Triglicéridos',unidad:'mg/dL',ref:'<150'},
      {param:'HDL Colesterol',unidad:'mg/dL',ref:'>40'},
      {param:'LDL Colesterol',unidad:'mg/dL',ref:'<100'},
      {param:'VLDL Colesterol',unidad:'mg/dL',ref:'<30'},
      {param:'Lípidos Totales',unidad:'mg/dL',ref:'450-800'}
    ]
  },
  perfil_hepatico:{
    nombre:'Perfil Hepático',
    parametros:[
      {param:'Bilirrubina Total',unidad:'mg/dL',ref:'0.2-1.2'},
      {param:'Bilirrubina Directa',unidad:'mg/dL',ref:'0.0-0.3'},
      {param:'Bilirrubina Indirecta',unidad:'mg/dL',ref:'0.2-0.8'},
      {param:'TGO (AST)',unidad:'U/L',ref:'0-35'},
      {param:'TGP (ALT)',unidad:'U/L',ref:'0-45'},
      {param:'Fosfatasa Alcalina',unidad:'U/L',ref:'44-147'},
      {param:'GGT (Gamma GT)',unidad:'U/L',ref:'10-48'},
      {param:'Proteínas Totales',unidad:'g/dL',ref:'6.0-8.3'},
      {param:'Albúmina',unidad:'g/dL',ref:'3.5-5.5'}
    ]
  },
  perfil_renal:{
    nombre:'Perfil Renal',
    parametros:[
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Ácido Úrico',unidad:'mg/dL',ref:'H:2.4-7.0 / M:2.0-6.0'},
      {param:'Sodio (Na)',unidad:'mEq/L',ref:'135-145'},
      {param:'Potasio (K)',unidad:'mEq/L',ref:'3.5-5.1'},
      {param:'Cloro (Cl)',unidad:'mEq/L',ref:'98-107'},
      {param:'Depuración de Creatinina',unidad:'mL/min',ref:'88-128'}
    ]
  },
  perfil_tiroideo:{
    nombre:'Perfil Tiroideo',
    parametros:[
      {param:'TSH Ultra sensible',unidad:'µIU/mL',ref:'0.4-4.2'},
      {param:'T3 Total',unidad:'ng/dL',ref:'80-200'},
      {param:'T4 Total',unidad:'µg/dL',ref:'5.1-14.1'},
      {param:'T3 Libre',unidad:'pg/mL',ref:'2.0-4.4'},
      {param:'T4 Libre',unidad:'ng/dL',ref:'0.93-1.7'}
    ]
  },
  orina_general:{
    nombre:'Examen General de Orina',
    parametros:[
      {param:'Color',unidad:'Físico',ref:'Amarillo'},
      {param:'Aspecto',unidad:'Físico',ref:'Límpido'},
      {param:'Densidad',unidad:'Físico',ref:'1.015-1.025'},
      {param:'pH',unidad:'Químico',ref:'5.0-7.0'},
      {param:'Proteínas',unidad:'Químico',ref:'Negativo'},
      {param:'Glucosa',unidad:'Químico',ref:'Negativo'},
      {param:'Cuerpos Cetónicos',unidad:'Químico',ref:'Negativo'},
      {param:'Hemoglobina',unidad:'Químico',ref:'Negativo'},
      {param:'Bilirrubina',unidad:'Químico',ref:'Negativo'},
      {param:'Urobilinógeno',unidad:'Químico',ref:'Normal'},
      {param:'Nitritos',unidad:'Químico',ref:'Negativo'},
      {param:'Leucocitos',unidad:'Microscópico',ref:'0-5 /campo'},
      {param:'Hematíes',unidad:'Microscópico',ref:'0-2 /campo'},
      {param:'Células Epiteliales',unidad:'Microscópico',ref:'Escasas'},
      {param:'Bacterias',unidad:'Microscópico',ref:'Escasas'}
    ]
  },
  tipeaje:{
    nombre:'Tipeaje',
    parametros:[
      {param:'Grupo ABO',unidad:'-',ref:'A / B / AB / O'},
      {param:'Factor Rh',unidad:'-',ref:'Positivo / Negativo'},
      {param:'Prueba Cruzada',unidad:'-',ref:'Compatible'}
    ]
  },
  vsg:{
    nombre:'VSG',
    parametros:[
      {param:'VSG 1ra Hora',unidad:'mm/h',ref:'H:0-20 / M:0-30'},
      {param:'VSG 2da Hora',unidad:'mm/h',ref:'H:0-40 / M:0-50'}
    ]
  },
  coproanalisis:{
    nombre:'Coproanálisis',
    parametros:[
      {param:'Color',unidad:'Físico',ref:'Marrón'},
      {param:'Consistencia',unidad:'Físico',ref:'Blanda'},
      {param:'Moco',unidad:'Físico',ref:'Negativo'},
      {param:'Sangre Oculta',unidad:'Químico',ref:'Negativo'},
      {param:'pH',unidad:'Químico',ref:'6.8-7.5'},
      {param:'Examen Directo (Parasitológico)',unidad:'Microscópico',ref:'No se observan quistes ni parásitos'},
      {param:'Leucocitos',unidad:'Microscópico',ref:'Negativo'},
      {param:'Hematíes',unidad:'Microscópico',ref:'Negativo'},
      {param:'Restos Alimenticios',unidad:'-',ref:'Escasos'},
      {param:'Grasas',unidad:'-',ref:'Escasas'},
      {param:'Almidón',unidad:'-',ref:'Escasas'}
    ]
  },
  orina_todo:{
    nombre:'Orina Todo',
    parametros:[
      {param:'Color',unidad:'-',ref:'Amarillo'},
      {param:'Aspecto',unidad:'-',ref:'Límpido'},
      {param:'pH',unidad:'-',ref:'5.0-7.0'},
      {param:'Densidad',unidad:'-',ref:'1.003-1.030'},
      {param:'Glucosa',unidad:'-',ref:'Negativo'},
      {param:'Proteínas',unidad:'-',ref:'Negativo'},
      {param:'Cetonas',unidad:'-',ref:'Negativo'},
      {param:'Bilirrubina',unidad:'-',ref:'Negativo'},
      {param:'Urobilinógeno',unidad:'-',ref:'0.2-1.0 mg/dL'},
      {param:'Sangre',unidad:'-',ref:'Negativo'},
      {param:'Nitritos',unidad:'-',ref:'Negativo'},
      {param:'Leucocitos (tira)',unidad:'-',ref:'Negativo'},
      {param:'Leucocitos (campo)',unidad:'x campo',ref:'0-5'},
      {param:'Eritrocitos (campo)',unidad:'x campo',ref:'0-3'},
      {param:'Células Epiteliales',unidad:'x campo',ref:'0-5'},
      {param:'Cilindros',unidad:'x campo',ref:'0'},
      {param:'Cristales',unidad:'-',ref:'Negativo'},
      {param:'Bacterias',unidad:'-',ref:'Escasas'}
    ]
  },
  depuracion_orina:{
    nombre:'Depuración de Orina',
    parametros:[
      {param:'Volumen Orina 24h',unidad:'mL',ref:'800-2000'},
      {param:'Creatinina Orina',unidad:'mg/dL',ref:'20-320'},
      {param:'Creatinina Sangre',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Depuración Creatinina',unidad:'mL/min',ref:'90-140'},
      {param:'Superficie Corporal',unidad:'m²',ref:'1.5-2.2'}
    ]
  },
  electrolitos:{
    nombre:'Electrolitos Todo',
    parametros:[
      {param:'Sodio (Na)',unidad:'mEq/L',ref:'135-145'},
      {param:'Potasio (K)',unidad:'mEq/L',ref:'3.5-5.0'},
      {param:'Cloro (Cl)',unidad:'mEq/L',ref:'98-106'},
      {param:'Calcio Total',unidad:'mg/dL',ref:'8.5-10.5'},
      {param:'Calcio Iónico',unidad:'mmol/L',ref:'1.15-1.33'},
      {param:'Magnesio',unidad:'mg/dL',ref:'1.7-2.2'},
      {param:'Fósforo (P)',unidad:'mg/dL',ref:'2.5-4.5'}
    ]
  },
  hepatitis_a:{
    nombre:'Hepatitis A - Prueba Rápida',
    parametros:[
      {param:'Anti-HAV IgM',unidad:'-',ref:'Negativo'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  hepatitis_b:{
    nombre:'Hepatitis B - Prueba Rápida',
    parametros:[
      {param:'HBsAg',unidad:'-',ref:'Negativo'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  hepatitis_c:{
    nombre:'Hepatitis C - Prueba Rápida',
    parametros:[
      {param:'Anti-HCV',unidad:'-',ref:'Negativo'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  hiv:{
    nombre:'HIV - Prueba Rápida',
    parametros:[
      {param:'VIH 1/2',unidad:'-',ref:'No Reactivo'},
      {param:'Método',unidad:'-',ref:'Inmunocromatografía'},
      {param:'Resultado',unidad:'-',ref:'No Reactivo / Reactivo'}
    ]
  },
  vdrl:{
    nombre:'VDRL',
    parametros:[
      {param:'VDRL Cualitativo',unidad:'-',ref:'No Reactivo'},
      {param:'VDRL Cuantitativo',unidad:'Diluciones',ref:'Negativo'}
    ]
  },
  pcr:{
    nombre:'Proteínas C Reactivas',
    parametros:[
      {param:'PCR Cualitativa',unidad:'-',ref:'Negativo'},
      {param:'PCR Cuantitativa',unidad:'mg/L',ref:'<5.0'}
    ]
  },
  psa:{
    nombre:'PSA - Prueba Rápida',
    parametros:[
      {param:'PSA Total',unidad:'ng/mL',ref:'<4.0'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  toxoplasma:{
    nombre:'Toxoplasma - Prueba Rápida',
    parametros:[
      {param:'IgG Anti-Toxoplasma',unidad:'UI/mL',ref:'<4 Neg / 4-8 Dud / >8 Pos'},
      {param:'IgM Anti-Toxoplasma',unidad:'UI/mL',ref:'<0.9 Neg / 0.9-1.1 Dud / >1.1 Pos'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  dengue:{
    nombre:'Dengue - Prueba Rápida',
    parametros:[
      {param:'NS1',unidad:'-',ref:'Negativo'},
      {param:'IgG',unidad:'-',ref:'Negativo'},
      {param:'IgM',unidad:'-',ref:'Negativo'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  ra_test:{
    nombre:'RA Test',
    parametros:[
      {param:'Factor Reumatoide',unidad:'UI/mL',ref:'<14'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  asto:{
    nombre:'ASTO',
    parametros:[
      {param:'Antiestreptolisina O',unidad:'UI/mL',ref:'<200'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  fibrinogeno:{
    nombre:'Fibrinógeno',
    parametros:[
      {param:'Fibrinógeno',unidad:'mg/dL',ref:'200-400'}
    ]
  },
  hcg:{
    nombre:'HCG - Prueba Rápida',
    parametros:[
      {param:'Beta-HCG',unidad:'mUI/mL',ref:'<5 (No embarazo)'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  helicobacter:{
    nombre:'Helicobacter - Prueba Rápida',
    parametros:[
      {param:'Anti-Helicobacter pylori',unidad:'-',ref:'Negativo'},
      {param:'Resultado',unidad:'-',ref:'Negativo / Positivo'}
    ]
  },
  perfil_prenatal:{
    nombre:'Perfil Prenatal',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'TP (Tiempo Protrombina)',unidad:'seg',ref:'11-14'},
      {param:'TTPa',unidad:'seg',ref:'25-35'},
      {param:'Glucosa',unidad:'mg/dL',ref:'70-92'},
      {param:'Urea',unidad:'mg/dL',ref:'10-40'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.4-0.8'},
      {param:'VIH 1/2',unidad:'-',ref:'No Reactivo'},
      {param:'VDRL',unidad:'-',ref:'No Reactivo'},
      {param:'Toxoplasma IgG/IgM',unidad:'-',ref:'Negativo'},
      {param:'Hepatitis A (Anti-HAV)',unidad:'-',ref:'Negativo'},
      {param:'Hepatitis B (HBsAg)',unidad:'-',ref:'Negativo'},
      {param:'Hepatitis C (Anti-HCV)',unidad:'-',ref:'Negativo'},
      {param:'Grupo ABO',unidad:'-',ref:'A / B / AB / O'},
      {param:'Factor Rh',unidad:'-',ref:'Positivo / Negativo'},
      {param:'Orina: Aspecto',unidad:'-',ref:'Límpido'},
      {param:'Orina: Color',unidad:'-',ref:'Amarillo'},
      {param:'Orina: pH',unidad:'-',ref:'5.0-7.0'},
      {param:'Orina: Densidad',unidad:'-',ref:'1.003-1.030'},
      {param:'Orina: Proteínas',unidad:'-',ref:'Negativo'},
      {param:'Orina: Glucosa',unidad:'-',ref:'Negativo'},
      {param:'Orina: Nitritos',unidad:'-',ref:'Negativo'},
      {param:'Orina: Leucocitos (campo)',unidad:'x campo',ref:'0-5'},
      {param:'Orina: Eritrocitos (campo)',unidad:'x campo',ref:'0-3'},
      {param:'Orina: Células Epiteliales',unidad:'x campo',ref:'0-5'},
      {param:'Orina: Bacterias',unidad:'-',ref:'Escasas'}
    ]
  },
  perfil_preoperatorio:{
    nombre:'Perfil Preoperatorio',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'TP (Tiempo Protrombina)',unidad:'seg',ref:'11-14'},
      {param:'TTPa',unidad:'seg',ref:'25-35'},
      {param:'Glucosa',unidad:'mg/dL',ref:'70-100'},
      {param:'Urea',unidad:'mg/dL',ref:'15-45'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.6-1.2'},
      {param:'Proteínas Totales',unidad:'g/dL',ref:'6.0-8.3'},
      {param:'Albúmina',unidad:'g/dL',ref:'3.5-5.0'},
      {param:'Globulinas',unidad:'g/dL',ref:'2.3-3.5'},
      {param:'VIH 1/2',unidad:'-',ref:'No Reactivo'},
      {param:'VDRL',unidad:'-',ref:'No Reactivo'},
      {param:'Grupo ABO',unidad:'-',ref:'A / B / AB / O'},
      {param:'Factor Rh',unidad:'-',ref:'Positivo / Negativo'}
    ]
  },
  perfil_preeclamptico:{
    nombre:'Perfil Preeclámptico',
    parametros:[
      ...parametrosHematologiaBase,
      {param:'TP (Tiempo Protrombina)',unidad:'seg',ref:'11-14'},
      {param:'TTPa',unidad:'seg',ref:'25-35'},
      {param:'Glucosa',unidad:'mg/dL',ref:'70-92'},
      {param:'Urea',unidad:'mg/dL',ref:'10-40'},
      {param:'Creatinina',unidad:'mg/dL',ref:'0.4-0.8'},
      {param:'Ácido Úrico',unidad:'mg/dL',ref:'2.0-5.5'},
      {param:'TGO/AST',unidad:'U/L',ref:'0-40'},
      {param:'TGP/ALT',unidad:'U/L',ref:'0-41'},
      {param:'LDH',unidad:'U/L',ref:'140-280'},
      {param:'Proteínas Totales',unidad:'g/dL',ref:'6.0-8.3'},
      {param:'Albúmina',unidad:'g/dL',ref:'3.5-5.0'},
      {param:'Globulinas',unidad:'g/dL',ref:'2.3-3.5'},
      {param:'Fibrinógeno',unidad:'mg/dL',ref:'200-400'},
      {param:'Orina',unidad:'-',ref:'Ver examen orina'}
    ]
  }
};

if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(r => console.log('SW ok:', r.scope))
      .catch(e => console.log('SW error:', e));
  });
}

async function solicitarAlmacenamientoPersistente() {
  if (navigator.storage && navigator.storage.persist) {
    await navigator.storage.persist();
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function init(){
  await solicitarAlmacenamientoPersistente();

  const adminUser = await db.users.get('admin');
  if(!adminUser) {
    const defaultPass = await hashPassword('admin123');
    await db.users.add({ username: 'admin', password: defaultPass, role: 'admin' });
  }

  const saved = await db.config.get('examenes');
  if(saved){ 
    examenesConfig = saved.valor; 
  } else {
    examenesConfig = JSON.parse(JSON.stringify(examenesDefault));
    await db.config.put({clave:'examenes', valor:examenesConfig});
  }
  
  const savedLab = await db.config.get('laboratorio');
  if(savedLab){
    labConfig = savedLab.valor;
    if(document.getElementById('labNombre')) document.getElementById('labNombre').value = labConfig.nombre || '';
    if(document.getElementById('labBioanalista')) document.getElementById('labBioanalista').value = labConfig.bioanalista || '';
    if(document.getElementById('labDireccion')) document.getElementById('labDireccion').value = labConfig.direccion || '';
    if(document.getElementById('labTelefono')) document.getElementById('labTelefono').value = labConfig.telefono || '';
    if(document.getElementById('labRif')) document.getElementById('labRif').value = labConfig.rif || '';
    firmaBase64 = labConfig.firma || '';
    if(firmaBase64 && document.getElementById('firmaPreview')){
      document.getElementById('firmaPreview').innerHTML = `<img src="${firmaBase64}" style="max-height:60px;border:1px solid #ccc;padding:2px;">`;
    }
  }

  checkSession();
  cargarSelectExamenes();
  cargarHistorial();
  renderizarConfigExamenes();
}

document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userVal = document.getElementById('login-user').value.trim();
  const passVal = document.getElementById('login-pass').value;
  const hash = await hashPassword(passVal);

  const userObj = await db.users.get(userVal);
  if(userObj && userObj.password === hash) {
    currentUser = { username: userObj.username, role: userObj.role };
    sessionStorage.setItem('biomed_session', JSON.stringify(currentUser));
    document.getElementById('login-error').style.display = 'none';
    applyPermissions();
  } else {
    const err = document.getElementById('login-error');
    err.textContent = 'Credenciales inválidas';
    err.style.display = 'block';
  }
});

function checkSession() {
  const session = sessionStorage.getItem('biomed_session');
  if(session) {
    currentUser = JSON.parse(session);
    applyPermissions();
  } else {
    document.getElementById('login-overlay').style.display = 'flex';
  }
}

function applyPermissions() {
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('user-name-text').textContent = `${currentUser.username} (${currentUser.role.toUpperCase()})`;
  document.getElementById('my-username').value = currentUser.username;

  if(currentUser.role === 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    loadUsersTable();
  } else {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }
}

function logout() {
  sessionStorage.removeItem('biomed_session');
  currentUser = null;
  location.reload();
}

document.getElementById('change-pass-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newUsername = document.getElementById('my-username').value.trim();
  const newPass = document.getElementById('my-new-pass').value;

  if(!newUsername || !newPass) {
    alert('Ingresa el usuario y la nueva contraseña');
    return;
  }

  const oldUsername = currentUser.username;
  const hashed = await hashPassword(newPass);

  if(newUsername !== oldUsername) {
    const exists = await db.users.get(newUsername);
    if(exists) {
      alert('El nombre de usuario ingresado ya está en uso');
      return;
    }
    await db.users.delete(oldUsername);
  }

  await db.users.put({
    username: newUsername,
    password: hashed,
    role: currentUser.role
  });

  currentUser.username = newUsername;
  sessionStorage.setItem('biomed_session', JSON.stringify(currentUser));
  document.getElementById('my-new-pass').value = '';
  applyPermissions();

  alert('✔ Tus credenciales se han actualizado correctamente.');
});

async function loadUsersTable() {
  const users = await db.users.toArray();
  const tbody = document.getElementById('lista-usuarios-body');
  if(!tbody) return;
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.username}</td>
      <td><span class="badge ${u.role==='admin'?'badge-blue':'badge-green'}">${u.role}</span></td>
      <td>${u.username !== 'admin' ? `<button class="btn-danger btn-sm" onclick="deleteUser('${u.username}')">Eliminar</button>` : '<em>Principal</em>'}</td>
    </tr>
  `).join('');
}

document.getElementById('create-user-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('new-user-name').value.trim();
  const pass = document.getElementById('new-user-pass').value;
  const role = document.getElementById('new-user-role').value;

  const exists = await db.users.get(name);
  if(exists) { alert('El usuario ya existe'); return; }

  const hash = await hashPassword(pass);
  await db.users.add({ username: name, password: hash, role: role });
  document.getElementById('create-user-form').reset();
  loadUsersTable();
});

async function deleteUser(username) {
  if(confirm(`¿Eliminar al usuario ${username}?`)) {
    await db.users.delete(username);
    loadUsersTable();
  }
}

function calcularIndices() {
  const eritrocitosEl = document.querySelector('input[data-param="Eritrocitos"]') || document.querySelector('input[data-param="Glóbulos Rojos"]');
  const hbEl = document.querySelector('input[data-param="Hemoglobina"]');
  const htEl = document.querySelector('input[data-param="Hematocrito"]');

  if (hbEl && htEl) {
    const hb = parseFloat(hbEl.value);
    const ht = parseFloat(htEl.value);
    const eritrocitos = eritrocitosEl ? parseFloat(eritrocitosEl.value) : NaN;

    const vcmEl = document.querySelector('input[data-param="VCM"]');
    const hcmEl = document.querySelector('input[data-param="HCM"]');
    const chcmEl = document.querySelector('input[data-param="CHCM"]');

    if (vcmEl && !isNaN(ht) && !isNaN(eritrocitos) && eritrocitos > 0) {
      vcmEl.value = ((ht * 10) / eritrocitos).toFixed(1);
    }
    if (hcmEl && !isNaN(hb) && !isNaN(eritrocitos) && eritrocitos > 0) {
      hcmEl.value = ((hb * 10) / eritrocitos).toFixed(1);
    }
    if (chcmEl && !isNaN(hb) && !isNaN(ht) && ht > 0) {
      chcmEl.value = ((hb * 100) / ht).toFixed(1);
    }
  }

  const colEl = document.querySelector('input[data-param="Colesterol Total"]');
  const hdlEl = document.querySelector('input[data-param="HDL Colesterol"]') || document.querySelector('input[data-param="HDL-Colesterol"]');
  const tgEl = document.querySelector('input[data-param="Triglicéridos"]');

  if (colEl && hdlEl) {
    const colTotal = parseFloat(colEl.value);
    const hdl = parseFloat(hdlEl.value);
    const trigliceridos = tgEl ? parseFloat(tgEl.value) : NaN;

    const ldlEl = document.querySelector('input[data-param="LDL Colesterol"]') || document.querySelector('input[data-param="LDL-Colesterol"]');
    const vldlEl = document.querySelector('input[data-param="VLDL Colesterol"]') || document.querySelector('input[data-param="VLDL-Colesterol"]');

    if (vldlEl && !isNaN(trigliceridos)) {
      vldlEl.value = (trigliceridos / 5).toFixed(1);
    }

    if (ldlEl && !isNaN(colTotal) && !isNaN(hdl) && !isNaN(trigliceridos)) {
      if (trigliceridos < 400) {
        ldlEl.value = (colTotal - hdl - (trigliceridos / 5)).toFixed(1);
      } else {
        ldlEl.value = 'N/A';
      }
    }
  }
}

function cargarSelectExamenes(){
  const sel=document.getElementById('tipoExamen');
  if(!sel) return;
  sel.innerHTML='<option value="">Selecciona tipo de examen</option>';
  const filtro=document.getElementById('filtroExamen');
  if(filtro) filtro.innerHTML='<option value="">Todos los exámenes</option>';
  
  for(const[key,val] of Object.entries(examenesConfig)){
    const opt=document.createElement('option');opt.value=key;opt.textContent=val.nombre;sel.appendChild(opt);
    if(filtro){
      const opt2=document.createElement('option');opt2.value=key;opt2.textContent=val.nombre;filtro.appendChild(opt2);
    }
  }
}

function showTab(evt, id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  if(evt && evt.target) evt.target.classList.add('active');
  document.getElementById('tab-'+id).classList.add('active');
}

async function buscarPaciente(){
  const q=document.getElementById('buscarCedula').value.trim().toLowerCase();
  const div=document.getElementById('resultadosBusqueda');
  if(q.length<2){div.innerHTML='';return;}
  const pacientes=await db.pacientes.filter(p=>(p.cedula&&p.cedula.toLowerCase().includes(q))||(p.nombre&&p.nombre.toLowerCase().includes(q))).toArray();
  div.innerHTML=pacientes.map(p=>`<div class="search-result" onclick="seleccionarPaciente(${p.id})"><strong>${p.nombre}</strong> — C.I. ${p.cedula}<br><small style="color:#64748b">Tel: ${p.telefono||'N/A'} | Edad: ${obtenerEdadPaciente(p)}</small> <button class="btn-sm btn-outline" style="margin-left:10px" onclick="event.stopPropagation(); editarPaciente(${p.id})">✏️ Editar</button></div>`).join('');
}

async function seleccionarPaciente(id){
  const p=await db.pacientes.get(id);
  pacienteActualId=id;
  document.getElementById('resultadosBusqueda').innerHTML='';
  document.getElementById('pacienteEncontrado').classList.remove('hidden');
  document.getElementById('pacienteEncontrado').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px"><div><strong style="font-size:16px">${p.nombre}</strong><br><small>C.I. ${p.cedula} | Edad: ${obtenerEdadPaciente(p)} | Sexo: ${p.sexo||'N/A'} | Tel: ${p.telefono||'N/A'}</small></div><span class="badge badge-green">Paciente seleccionado</span></div>`;
  document.getElementById('entradaResultados').classList.remove('hidden');
  document.getElementById('pacienteSeleccionado').textContent=`Paciente: ${p.nombre}`;
  document.getElementById('registroPaciente').classList.add('hidden');
  
  if(labConfig.bioanalista && document.getElementById('bioanalista') && !document.getElementById('bioanalista').value){
    document.getElementById('bioanalista').value = labConfig.bioanalista;
  }
  
  await generarCodigoServicio();
}

function toggleRegistro(){
  limpiarFormularioPaciente();
  document.getElementById('registroPaciente').classList.toggle('hidden');
}

function toggleMenorSinCedula() {
  const esMenor = document.getElementById('esMenor').checked;
  const cedulaInput = document.getElementById('cedula');
  
  if (esMenor) {
    const timestamp = Date.now().toString().slice(-6);
    cedulaInput.value = `S/C-${timestamp}`;
    cedulaInput.readOnly = true;
  } else {
    cedulaInput.value = '';
    cedulaInput.readOnly = false;
  }
}

function actualizarEdadPorFecha(){
  const fNac = document.getElementById('fechaNac').value;
  if(fNac){
    document.getElementById('edad').value = calcularEdad(fNac);
    if(document.getElementById('unidadEdad')) document.getElementById('unidadEdad').value = 'años';
  }
}

function actualizarFechaPorEdad(){
  const edadVal = parseInt(document.getElementById('edad').value);
  const unidad = document.getElementById('unidadEdad')?.value || 'años';
  
  if(!isNaN(edadVal) && edadVal >= 0 && unidad === 'años'){
    const d = new Date();
    d.setFullYear(d.getFullYear() - edadVal);
    document.getElementById('fechaNac').value = d.toISOString().split('T')[0];
  }
}

async function editarPaciente(id) {
  try {
    const paciente = await db.pacientes.get(id);
    if (!paciente) {
      alert("Paciente no encontrado");
      return;
    }

    document.getElementById('cedula').value = paciente.cedula || '';
    document.getElementById('nombre').value = paciente.nombre || '';
    document.getElementById('edad').value = paciente.edad !== null && paciente.edad !== undefined ? paciente.edad : '';
    if(document.getElementById('unidadEdad')) document.getElementById('unidadEdad').value = paciente.unidad_edad || 'años';
    if(document.getElementById('esMenor')) document.getElementById('esMenor').checked = !!paciente.es_menor;
    if(document.getElementById('fechaNac')) document.getElementById('fechaNac').value = paciente.fecha_nacimiento || '';
    document.getElementById('sexo').value = paciente.sexo || '';
    document.getElementById('telefono').value = paciente.telefono || '';
    document.getElementById('direccion').value = paciente.direccion || '';

    pacienteEditandoId = id;

    const btnGuardar = document.getElementById('btnGuardarPaciente');
    if (btnGuardar) {
      btnGuardar.textContent = "🔄 Actualizar Paciente";
    }

    document.getElementById('registroPaciente').classList.remove('hidden');
    document.getElementById('registroPaciente').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error("Error al cargar paciente para edición:", error);
  }
}

async function guardarPaciente(event) {
  if (event) event.preventDefault();

  const cedula = document.getElementById('cedula').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const edadVal = document.getElementById('edad').value.trim();
  const unidadEdad = document.getElementById('unidadEdad')?.value || 'años';
  const esMenor = document.getElementById('esMenor')?.checked || false;

  if (!nombre) {
    alert('El nombre del paciente es obligatorio.');
    return;
  }

  if (!esMenor && !cedula) {
    alert('Ingresa la cédula del paciente o marca la opción "Menor sin cédula".');
    return;
  }

  const datosPaciente = {
    cedula: cedula,
    nombre: nombre,
    edad: edadVal !== '' ? parseInt(edadVal) : null,
    unidad_edad: unidadEdad,
    es_menor: esMenor,
    fecha_nacimiento: document.getElementById('fechaNac')?.value || null,
    sexo: document.getElementById('sexo').value,
    telefono: document.getElementById('telefono').value.trim(),
    direccion: document.getElementById('direccion').value.trim()
  };

  try {
    if (pacienteEditandoId) {
      const existe = await db.pacientes.where('cedula').equals(cedula).first();
      if (existe && existe.id !== pacienteEditandoId) {
        alert('Ya existe otro paciente registrado con esta cédula/código.');
        return;
      }
      await db.pacientes.update(pacienteEditandoId, datosPaciente);
      alert("✅ Datos del paciente actualizados correctamente");
      seleccionarPaciente(pacienteEditandoId);
    } else {
      const existe = await db.pacientes.where('cedula').equals(cedula).first();
      if (existe) {
        alert('Ya existe un paciente registrado con este documento/código.');
        return;
      }
      const id = await db.pacientes.add(datosPaciente);
      alert("✅ Paciente registrado con éxito");
      seleccionarPaciente(id);
    }

    limpiarFormularioPaciente();

  } catch (error) {
    console.error("Error al guardar paciente:", error);
    alert("❌ Error al guardar los datos del paciente");
  }
}

function limpiarFormularioPaciente() {
  document.getElementById('cedula').value = '';
  document.getElementById('cedula').readOnly = false;
  if(document.getElementById('esMenor')) document.getElementById('esMenor').checked = false;
  document.getElementById('nombre').value = '';
  document.getElementById('edad').value = '';
  if(document.getElementById('unidadEdad')) document.getElementById('unidadEdad').value = 'años';
  if(document.getElementById('fechaNac')) document.getElementById('fechaNac').value = '';
  document.getElementById('sexo').value = '';
  document.getElementById('telefono').value = '';
  document.getElementById('direccion').value = '';
  
  pacienteEditandoId = null;
  
  const btnGuardar = document.getElementById('btnGuardarPaciente');
  if (btnGuardar) {
    btnGuardar.textContent = "💾 Guardar Paciente";
  }
}

async function generarCodigoServicio(){
  const f=new Date();
  let codigo='';
  let existe=true;

  while(existe){
    const num=Math.floor(100000+Math.random()*900000);
    codigo='BIO-'+f.getFullYear().toString().slice(-2)+String(f.getMonth()+1).padStart(2,'0')+String(f.getDate()).padStart(2,'0')+'-'+num;
    const registro = await db.examenes.where('codigo_servicio').equals(codigo).first();
    if(!registro) existe = false;
  }

  document.getElementById('codigoServicio').textContent=codigo;
  return codigo;
}

function cargarParametros(){
  const tipo=document.getElementById('tipoExamen').value;
  const div=document.getElementById('parametrosExamen');
  if(!tipo){div.innerHTML='';return;}
  const config=examenesConfig[tipo];
  if(!config){div.innerHTML='<p style="color:var(--danger)">Examen no configurado</p>';return;}
  div.innerHTML=config.parametros.map((p,i)=>`
    <div class="param-row">
      <label>${p.param} <small style="color:#94a3b8">(${p.unidad})</small></label>
      <input type="text" id="val_${i}" data-param="${p.param}" placeholder="Valor" onkeydown="manejarEnter(event, ${i})" oninput="calcularIndices()">
      <span class="ref">Ref: ${p.ref}</span>
    </div>
  `).join('');
}

function manejarEnter(e, index) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const nextInput = document.getElementById(`val_${index + 1}`);
    if (nextInput) {
      nextInput.focus();
    } else {
      document.getElementById('observaciones').focus();
    }
  }
}

async function guardarExamen(){
  const tipo=document.getElementById('tipoExamen').value;
  if(!tipo){alert('Selecciona un tipo de examen');return;}
  const config=examenesConfig[tipo];
  const codigo=document.getElementById('codigoServicio').textContent;
  const examenId=await db.examenes.add({
    paciente_id:pacienteActualId,
    tipo_examen:tipo,
    fecha:new Date().toISOString().split('T')[0],
    codigo_servicio:codigo,
    bioanalista:document.getElementById('bioanalista').value||labConfig.bioanalista||'No especificado',
    observaciones:document.getElementById('observaciones').value||''
  });

  for(let i=0;i<config.parametros.length;i++){
    const valInput=document.getElementById(`val_${i}`);
    const val=valInput?valInput.value.trim():'';
    if(val !== ''){
      await db.resultados.add({
        examen_id:examenId,
        parametro:config.parametros[i].param,
        valor:val,
        unidad:config.parametros[i].unidad,
        referencia:config.parametros[i].ref
      });
    }
  }
  mostrarInforme(examenId);
  cargarHistorial();
  alert('✔ Examen guardado. Código: '+codigo);
}

function esValorFueraDeRango(valor, referencia) {
  const valNum = parseFloat(valor);
  if (isNaN(valNum)) return false;
  
  const partes = referencia.match(/^([\d.]+)\s*-\s*([\d.]+)$/);
  if (partes) {
    const min = parseFloat(partes[1]);
    const max = parseFloat(partes[2]);
    if (!isNaN(min) && !isNaN(max)) {
      return valNum < min || valNum > max;
    }
  }
  return false;
}

async function compartirInforme() {
  if (!examenActualId) return;

  const examen = await db.examenes.get(examenActualId);
  const paciente = await db.pacientes.get(examen.paciente_id);
  const resultados = await db.resultados.where('examen_id').equals(examenActualId).toArray();
  const lab = labConfig.nombre || 'Biomed Lab';

  let texto = `*${lab.toUpperCase()}*\n`;
  texto += `📋 *Informe de Resultados*\n\n`;
  texto += `*Paciente:* ${paciente?.nombre || 'N/A'}\n`;
  texto += `*C.I.:* ${paciente?.cedula || 'N/A'}\n`;
  texto += `*Código:* ${examen.codigo_servicio}\n`;
  texto += `*Examen:* ${examenesConfig[examen.tipo_examen]?.nombre || examen.tipo_examen}\n`;
  texto += `*Fecha:* ${examen.fecha}\n\n`;
  texto += `🧪 *Resultados:*\n`;

  resultados.forEach(r => {
    texto += `• *${r.parametro}:* ${r.valor || '-'} ${r.unidad} (Ref: ${r.referencia})\n`;
  });

  if (examen.observaciones) {
    texto += `\n*Obs:* ${examen.observaciones}`;
  }

  texto += `\n\n_Validado por: ${examen.bioanalista}_`;

  const shareData = {
    title: `Informe de Laboratorio - ${paciente?.nombre || 'Paciente'}`,
    text: texto
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error al compartir:', err);
      }
    }
  } else {
    copiarResumenTexto();
  }
}

async function mostrarInforme(examenId){
  examenActualId = examenId;
  const examen=await db.examenes.get(examenId);
  const paciente=await db.pacientes.get(examen.paciente_id);
  const resultados=await db.resultados.where('examen_id').equals(examenId).toArray();
  const lab=labConfig.nombre||'Biomed Lab';
  const edadPac = obtenerEdadPaciente(paciente);
  
  const html=`
    <div class="report-container">
      <div class="report-header">
        <h2>${lab}</h2>
        ${labConfig.direccion?`<p>${labConfig.direccion}</p>`:''}
        ${labConfig.telefono?`<p>Tel: ${labConfig.telefono}</p>`:''}
        ${labConfig.rif?`<p>RIF: ${labConfig.rif}</p>`:''}
        <p style="font-weight:bold;margin-top:4px;">INFORME DE RESULTADOS DE LABORATORIO</p>
      </div>
      <div class="report-info">
        <div>
          <p><strong>Paciente:</strong> ${paciente?.nombre||'N/A'}</p>
          <p><strong>C.I.:</strong> ${paciente?.cedula||'N/A'}</p>
          <p><strong>Edad:</strong> ${edadPac} | <strong>Sexo:</strong> ${paciente?.sexo||'N/A'}</p>
        </div>
        <div style="text-align:right">
          <p><strong>Código:</strong> ${examen.codigo_servicio}</p>
          <p><strong>Fecha:</strong> ${examen.fecha}</p>
          <p><strong>Examen:</strong> ${examenesConfig[examen.tipo_examen]?.nombre||examen.tipo_examen}</p>
        </div>
      </div>
      <table class="report-table">
        <thead>
          <tr>
            <th>Parámetro</th>
            <th style="text-align:center">Resultado</th>
            <th style="text-align:center">Unidad</th>
            <th style="text-align:center">Referencia</th>
          </tr>
        </thead>
        <tbody>
          ${resultados.map(r=>{
            const fueraRango = esValorFueraDeRango(r.valor, r.referencia);
            const claseResultado = fueraRango ? 'out-of-range' : '';
            return `
            <tr>
              <td>${r.parametro}</td>
              <td style="text-align:center" class="${claseResultado}">${r.valor||'-'}${fueraRango ? ' (!)' : ''}</td>
              <td style="text-align:center">${r.unidad}</td>
              <td style="text-align:center;color:#444;">${r.referencia}</td>
            </tr>
          `}).join('')}
        </tbody>
      </table>
      ${examen.observaciones?`<div class="report-obs"><strong>Observaciones:</strong> ${examen.observaciones}</div>`:''}
      <div style="margin-top:20px;display:flex;justify-content:space-between;align-items:flex-end;">
        <div style="font-size:9px;color:#555;">
          <p style="margin:0;">Este informe tiene validez médica.</p>
          <p style="margin:0;">Los valores de referencia pueden variar según el método.</p>
        </div>
        <div style="text-align:center">
          ${firmaBase64 ? `<img src="${firmaBase64}" style="max-height:50px;display:block;margin:0 auto 2px auto;">` : ''}
          <p style="border-top:1px solid #000;display:inline-block;padding-top:4px;width:160px;margin:0;font-size:11px;">
            <strong>${examen.bioanalista}</strong><br>
            <small>Bioanalista</small>
          </p>
        </div>
      </div>
    </div>
  `;
  document.getElementById('contenidoInforme').innerHTML=html;
  document.getElementById('informeImpresion').classList.remove('hidden');
  window.scrollTo({top:document.getElementById('informeImpresion').offsetTop-20,behavior:'smooth'});
}

async function enviarWhatsAppActual() {
  if (!examenActualId) return;
  await enviarWhatsApp(examenActualId);
}

async function enviarWhatsApp(examenId) {
  const examen = await db.examenes.get(examenId);
  const paciente = await db.pacientes.get(examen.paciente_id);
  const resultados = await db.resultados.where('examen_id').equals(examenId).toArray();
  const lab = labConfig.nombre || 'Biomed Lab';

  if (!paciente || !paciente.telefono) {
    alert('El paciente no tiene un número de teléfono registrado.');
    return;
  }

  let telefono = paciente.telefono.replace(/\D/g, '');
  if (telefono.length === 10) {
    telefono = '58' + telefono;
  }

  let mensaje = `*${lab.toUpperCase()}*\n`;
  mensaje += `📋 *Informe de Resultados*\n\n`;
  mensaje += `*Paciente:* ${paciente.nombre}\n`;
  mensaje += `*C.I.:* ${paciente.cedula}\n`;
  mensaje += `*Código:* ${examen.codigo_servicio}\n`;
  mensaje += `*Examen:* ${examenesConfig[examen.tipo_examen]?.nombre || examen.tipo_examen}\n`;
  mensaje += `*Fecha:* ${examen.fecha}\n\n`;
  mensaje += `🧪 *Resultados:*\n`;

  resultados.forEach(r => {
    mensaje += `• *${r.parametro}:* ${r.valor || '-'} ${r.unidad} (Ref: ${r.referencia})\n`;
  });

  if (examen.observaciones) {
    mensaje += `\n*Obs:* ${examen.observaciones}`;
  }

  mensaje += `\n\n_Validado por: ${examen.bioanalista}_`;

  const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

async function copiarResumenTexto() {
  if (!examenActualId) return;
  const examen = await db.examenes.get(examenActualId);
  const paciente = await db.pacientes.get(examen.paciente_id);
  const resultados = await db.resultados.where('examen_id').equals(examenActualId).toArray();
  const nombreLab = labConfig?.nombre || 'Biomed Lab';
  
  let texto = `${nombreLab}\n`;
  texto += `Paciente: ${paciente?.nombre} (CI: ${paciente?.cedula})\n`;
  texto += `Examen: ${examenesConfig[examen.tipo_examen]?.nombre}\n`;
  texto += `Fecha: ${examen.fecha} | Orden: ${examen.codigo_servicio}\n\n`;
  resultados.forEach(r => {
    texto += `${r.parametro}: ${r.valor || '-'} ${r.unidad} [Ref: ${r.referencia}]\n`;
  });
  
  navigator.clipboard.writeText(texto).then(() => {
    alert('📋 Resumen copiado al portapapeles');
  });
}

function nuevoExamen(){
  document.getElementById('tipoExamen').value='';
  document.getElementById('parametrosExamen').innerHTML='';
  document.getElementById('observaciones').value='';
  document.getElementById('bioanalista').value=labConfig.bioanalista||'';
  document.getElementById('informeImpresion').classList.add('hidden');
  generarCodigoServicio();
  window.scrollTo({top:0,behavior:'smooth'});
}

async function cargarHistorial() {
  const tbody = document.getElementById('tablaHistorial');
  if (!tbody) return;

  const filtroPac = document.getElementById('filtroPaciente')?.value.trim().toLowerCase() || '';
  const filtroExam = document.getElementById('filtroExamen')?.value || '';
  
  const filtroAno = document.getElementById('filtroAno')?.value || '';
  const filtroMes = document.getElementById('filtroMes')?.value || '';
  const filtroDia = document.getElementById('filtroDia')?.value || '';

  let examenes = await db.examenes.orderBy('fecha').reverse().toArray();

  if (filtroExam) {
    examenes = examenes.filter(e => e.tipo_examen === filtroExam);
  }

  if (filtroAno || filtroMes || filtroDia) {
    examenes = examenes.filter(e => {
      if (!e.fecha) return false;
      const [year, month, day] = e.fecha.split('-');
      
      const coincideAno = !filtroAno || year === filtroAno;
      const coincideMes = !filtroMes || month === filtroMes.padStart(2, '0');
      const coincideDia = !filtroDia || day === filtroDia.padStart(2, '0');
      
      return coincideAno && coincideMes && coincideDia;
    });
  }

  const totalPacientes = await db.pacientes.count();
  const totalExamenes = await db.examenes.count();
  const hoy = new Date().toISOString().split('T')[0];
  const examenesHoy = examenes.filter(e => e.fecha === hoy).length;

  const statsGrid = document.getElementById('statsGrid');
  if (statsGrid) {
    statsGrid.innerHTML = `
      <div class="stat-card"><div class="number">${totalPacientes}</div><div class="label">Pacientes</div></div>
      <div class="stat-card"><div class="number">${totalExamenes}</div><div class="label">Exámenes</div></div>
      <div class="stat-card"><div class="number">${examenesHoy}</div><div class="label">Hoy</div></div>
      <div class="stat-card"><div class="number">${Object.keys(examenesConfig).length}</div><div class="label">Tipos de examen</div></div>
    `;
  }

  let html = '';
  for (const e of examenes) {
    const p = await db.pacientes.get(e.paciente_id);
    if (filtroPac && p && !p.nombre.toLowerCase().includes(filtroPac) && !p.cedula.toLowerCase().includes(filtroPac)) {
      continue;
    }
    const nombreExamen = examenesConfig[e.tipo_examen]?.nombre || e.tipo_examen;
    html += `
      <tr>
        <td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px">${e.codigo_servicio}</code></td>
        <td><strong>${p?.nombre || 'N/A'}</strong><br><small style="color:#64748b">${p?.cedula || ''}</small></td>
        <td><span class="badge badge-blue">${nombreExamen}</span></td>
        <td>${e.fecha}</td>
        <td>${e.bioanalista}</td>
        <td><button class="btn-primary btn-sm" onclick="verExamenModal(${e.id})">👁️ Ver</button></td>
      </tr>
    `;
  }
  tbody.innerHTML = html || '<tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:20px">No se encontraron exámenes registrados</td></tr>';
}

async function verExamenModal(examenId){
  const examen=await db.examenes.get(examenId);
  const paciente=await db.pacientes.get(examen.paciente_id);
  const resultados=await db.resultados.where('examen_id').equals(examenId).toArray();
  const lab=labConfig.nombre||'Biomed Lab';
  document.getElementById('modalContent').innerHTML=`<div style="text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:16px"><h4 style="margin:0;color:#000">${lab}</h4><p style="margin:4px 0;font-size:12px;color:#000">Código: ${examen.codigo_servicio} | Fecha: ${examen.fecha}</p></div><p style="font-size:13px"><strong>Paciente:</strong> ${paciente?.nombre||'N/A'} (${paciente?.cedula||'N/A'})</p><p style="font-size:13px"><strong>Examen:</strong> ${examenesConfig[examen.tipo_examen]?.nombre||examen.tipo_examen}</p><p style="font-size:13px"><strong>Bioanalista:</strong> ${examen.bioanalista}</p><table style="margin-top:10px;font-size:12px"><thead><tr><th>Parámetro</th><th>Resultado</th><th>Unidad</th><th>Referencia</th></tr></thead><tbody>${resultados.map(r=>`<tr><td>${r.parametro}</td><td style="font-weight:700;text-align:center">${r.valor||'-'}</td><td style="text-align:center">${r.unidad}</td><td style="text-align:center;font-size:11px">${r.referencia}</td></tr>`).join('')}</tbody></table>${examen.observaciones?`<p style="font-size:12px;margin-top:10px"><strong>Obs:</strong> ${examen.observaciones}</p>`:''}`;
  document.getElementById('modalOverlay').classList.add('active');
}

function cerrarModal(){document.getElementById('modalOverlay').classList.remove('active');}

function agregarFilaParametro(){
  const div=document.getElementById('nuevosParametros');
  const row=document.createElement('div');row.className='np-row';
  row.innerHTML='<input type="text" placeholder="Parámetro" class="np-nombre"><input type="text" placeholder="Unidad" class="np-unidad"><input type="text" placeholder="Referencia" class="np-ref"><button onclick="this.parentElement.remove()">✖</button>';
  div.appendChild(row);
}

async function guardarNuevoExamen(){
  const nombre=document.getElementById('nuevoExamenNombre').value.trim();
  if(!nombre){alert('Escribe el nombre del examen');return;}
  const filas=document.querySelectorAll('.np-row');
  const parametros=[];
  filas.forEach(f=>{
    const nom=f.querySelector('.np-nombre')?.value.trim();
    const uni=f.querySelector('.np-unidad')?.value.trim()||'-';
    const ref=f.querySelector('.np-ref')?.value.trim()||'-';
    if(nom)parametros.push({param:nom,unidad:uni,ref:ref});
  });
  if(parametros.length===0){alert('Agrega al menos un parámetro');return;}
  const key='examen_'+Date.now();
  examenesConfig[key]={nombre,parametros};
  await db.config.put({clave:'examenes',valor:examenesConfig});
  document.getElementById('nuevoExamenNombre').value='';
  document.getElementById('nuevosParametros').innerHTML='<div class="np-row"><input type="text" placeholder="Parámetro" class="np-nombre"><input type="text" placeholder="Unidad" class="np-unidad"><input type="text" placeholder="Referencia" class="np-ref"></div>';
  cargarSelectExamenes();
  renderizarConfigExamenes();
  alert('✔ Examen "'+nombre+'" agregado correctamente');
}

async function sincronizarExamenesBase() {
  if (!confirm("¿Deseas sincronizar todos los perfiles y combos predeterminados con la base de datos? Tus exámenes personalizados se conservarán.")) {
    return;
  }

  let configGuardada = await db.config.get('examenes');
  let examenesActuales = configGuardada ? configGuardada.valor : {};

  for (const [clave, examenBase] of Object.entries(examenesDefault)) {
    if (!examenesActuales[clave]) {
      examenesActuales[clave] = JSON.parse(JSON.stringify(examenBase));
    } else {
      const parametrosExistentes = examenesActuales[clave].parametros.map(p => p.param);
      
      examenBase.parametros.forEach(paramBase => {
        if (!parametrosExistentes.includes(paramBase.param)) {
          examenesActuales[clave].parametros.push(paramBase);
        }
      });
    }
  }

  examenesConfig = examenesActuales;
  await db.config.put({ clave: 'examenes', valor: examenesConfig });

  cargarSelectExamenes();
  renderizarConfigExamenes();

  alert("✔ Catálogo sincronizado correctamente.");
}

function renderizarConfigExamenes(){
  const div=document.getElementById('listaExamenesConfig');
  if(!div) return;
  const total=Object.keys(examenesConfig).length;
  if(document.getElementById('totalExamenes')) document.getElementById('totalExamenes').textContent=total;
  div.innerHTML=Object.entries(examenesConfig).map(([key,val])=>`<div class="config-exam-item"><div><strong>${val.nombre}</strong> <small style="color:#64748b">(${val.parametros.length} parámetros)</small></div>${key.startsWith('examen_')?`<button class="btn-danger btn-sm" onclick="eliminarExamen('${key}')">Eliminar</button>`:'<span class="badge badge-green">Predeterminado</span>'}</div>`).join('');
}

async function eliminarExamen(key){
  if(!confirm('¿Eliminar este examen?'))return;
  delete examenesConfig[key];
  await db.config.put({clave:'examenes',valor:examenesConfig});
  cargarSelectExamenes();
  renderizarConfigExamenes();
}

function cargarImagenFirma(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      firmaBase64 = e.target.result;
      document.getElementById('firmaPreview').innerHTML = `<img src="${firmaBase64}" style="max-height:60px;border:1px solid #ccc;padding:2px;">`;
    };
    reader.readAsDataURL(file);
  }
}

async function guardarConfigLab(){
  labConfig={
    nombre:document.getElementById('labNombre').value,
    bioanalista:document.getElementById('labBioanalista').value,
    direccion:document.getElementById('labDireccion').value,
    telefono:document.getElementById('labTelefono').value,
    rif:document.getElementById('labRif').value,
    firma: firmaBase64
  };
  await db.config.put({clave:'laboratorio',valor:labConfig});
  
  if(document.getElementById('bioanalista')){
    document.getElementById('bioanalista').value=labConfig.bioanalista||'';
  }
  
  alert('✔ Datos del laboratorio y personal guardados');
}

async function exportarDB(){
  const data={
    pacientes:await db.pacientes.toArray(),
    examenes:await db.examenes.toArray(),
    resultados:await db.resultados.toArray(),
    config:await db.config.toArray(),
    users:await db.users.toArray(),
    exportado:new Date().toISOString(),
    version:'BiomedLab-v2'
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='biomed-backup-'+new Date().toISOString().split('T')[0]+'.json';
  a.click();
  URL.revokeObjectURL(url);
  document.getElementById('exportMsg').innerHTML='<div class="alert alert-success">✔ Respaldo exportado correctamente</div>';
  setTimeout(()=>document.getElementById('exportMsg').innerHTML='',3000);
}

async function importarDB(input){
  const file=input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=async(e)=>{
    try{
      const data=JSON.parse(e.target.result);
      if(!data.pacientes||!data.examenes||!data.resultados){alert('Archivo inválido');return;}
      if(!confirm('⚠️ Esto reemplazará TODOS los datos actuales. ¿Continuar?'))return;
      await db.pacientes.clear();
      await db.examenes.clear();
      await db.resultados.clear();
      await db.config.clear();
      if(data.users) await db.users.clear();

      await db.pacientes.bulkAdd(data.pacientes);
      await db.examenes.bulkAdd(data.examenes);
      await db.resultados.bulkAdd(data.resultados);
      if(data.config) await db.config.bulkAdd(data.config);
      if(data.users) await db.users.bulkAdd(data.users);

      document.getElementById('importMsg').innerHTML='<div class="alert alert-success">✔ Datos restaurados correctamente</div>';
      init();
    }catch(err){alert('Error al importar: '+err.message);}
  };
  reader.readAsText(file);
  input.value='';
}

async function guardarRespaldoEnDisco() {
  try {
    const datosLaboratorio = {
      pacientes: await db.pacientes.toArray(),
      examenes: await db.examenes.toArray(),
      resultados: await db.resultados.toArray(),
      config: await db.config.toArray(),
      users: await db.users.toArray(),
      exportado: new Date().toISOString(),
      version: 'BiomedLab-v2'
    };

    const opciones = {
      suggestedName: `respaldo_biomed_lab_${new Date().toISOString().slice(0, 10)}.json`,
      types: [{
        description: 'Copia de seguridad de laboratorio (*.json)',
        accept: { 'application/json': ['.json'] },
      }],
    };

    const fileHandle = await window.showSaveFilePicker(opciones);
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(JSON.stringify(datosLaboratorio, null, 2));
    await writableStream.close();

    alert('✅ Respaldo guardado con éxito en el disco duro.');
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error al guardar el respaldo:', err);
      alert('❌ Ocurrió un error al intentar guardar el archivo.');
    }
  }
}

async function cargarRespaldoDesdeDisco() {
  try {
    const opciones = {
      types: [{
        description: 'Copia de seguridad de laboratorio (*.json)',
        accept: { 'application/json': ['.json'] },
      }],
      multiple: false
    };

    const [fileHandle] = await window.showOpenFilePicker(opciones);
    const file = await fileHandle.getFile();
    const contenidoTexto = await file.text();
    const datosImportados = JSON.parse(contenidoTexto);

    if (!datosImportados || typeof datosImportados !== 'object') {
      throw new Error("El archivo seleccionado no es válido.");
    }

    if (!confirm('⚠️ Esto reemplazará TODOS los datos actuales. ¿Continuar?')) return;

    await db.pacientes.clear();
    await db.examenes.clear();
    await db.resultados.clear();
    await db.config.clear();
    if (datosImportados.users) await db.users.clear();

    if (datosImportados.pacientes) await db.pacientes.bulkAdd(datosImportados.pacientes);
    if (datosImportados.examenes) await db.examenes.bulkAdd(datosImportados.examenes);
    if (datosImportados.resultados) await db.resultados.bulkAdd(datosImportados.resultados);
    if (datosImportados.config) await db.config.bulkAdd(datosImportados.config);
    if (datosImportados.users) await db.users.bulkAdd(datosImportados.users);

    alert('✅ Base de datos importada y actualizada con éxito.');
    init();
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Error al importar el respaldo:', err);
      alert('❌ El archivo seleccionado no tiene un formato válido.');
    }
  }
}

async function limpiarDB(){
  if(!confirm('⚠️ ¿ESTÁS SEGURO? Se borrarán TODOS los pacientes, exámenes y resultados. Esta acción NO se puede deshacer.'))return;
  if(!confirm('ÚLTIMA CONFIRMACIÓN: ¿Borrar toda la base de datos?'))return;
  await db.pacientes.clear();
  await db.examenes.clear();
  await db.resultados.clear();
  await db.config.clear();
  examenesConfig=JSON.parse(JSON.stringify(examenesDefault));
  await db.config.put({clave:'examenes',valor:examenesConfig});
  alert('🗑️ Base de datos limpiada');
  init();
}

function calcularEdad(fechaNac){
  if(!fechaNac) return '?';
  const partes = fechaNac.split('-');
  if(partes.length !== 3) return '?';
  const nac = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
  if(isNaN(nac.getTime())) return '?';
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
    edad--;
  }
  return edad >= 0 ? edad : '?';
}

function obtenerEdadPaciente(paciente) {
  if (!paciente) return '?';
  if (paciente.edad !== null && paciente.edad !== undefined && paciente.edad !== '') {
    const unidad = paciente.unidad_edad || 'años';
    return `${paciente.edad} ${unidad}`;
  }
  if (paciente.fecha_nacimiento) {
    return `${calcularEdad(paciente.fecha_nacimiento)} años`;
  }
  return '?';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnExportarDirecto')?.addEventListener('click', guardarRespaldoEnDisco);
  document.getElementById('btnImportarDirecto')?.addEventListener('click', cargarRespaldoDesdeDisco);
  init();
});