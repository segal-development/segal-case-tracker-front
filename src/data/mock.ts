import type {
  Abogado, Causa, Plazo, Actuacion, Documento, ProdAbogado, TrendDay,
  Notificacion, Usuario, SemaforoSummary, ResumenPlazos, AdminData, FinancieroData,
} from "./types";

const TODAY = new Date("2026-05-15");

function offsetDate(d: number): string {
  const x = new Date(TODAY);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
}

export const ABOGADOS: Abogado[] = [
  { id: "a1", nombre: "Catalina Morales R.",   iniciales: "CM", color: "#9c6b4a" },
  { id: "a2", nombre: "Felipe Astorga V.",     iniciales: "FA", color: "#3a6e7a" },
  { id: "a3", nombre: "Javiera Soto L.",       iniciales: "JS", color: "#6c5b9c" },
  { id: "a4", nombre: "Rodrigo Bustamante O.", iniciales: "RB", color: "#8a5a4c" },
  { id: "a5", nombre: "Antonia Pizarro F.",    iniciales: "AP", color: "#5d7a4a" },
  { id: "a6", nombre: "Matías Cárcamo P.",     iniciales: "MC", color: "#7a5a3a" },
];

export const TRIBUNALES: string[] = [
  "1° Juzgado Civil de Santiago",
  "4° Juzgado Civil de Santiago",
  "21° Juzgado Civil de Santiago",
  "8° Juzgado de Letras del Trabajo de Santiago",
  "2° Juzgado de Letras del Trabajo de Santiago",
  "Juzgado de Familia de Pudahuel",
  "3° Juzgado de Familia de Santiago",
  "Corte de Apelaciones de Santiago",
  "2° Juzgado Civil de Valparaíso",
  "Juzgado de Letras de Puente Alto",
  "8° Juzgado de Garantía de Santiago",
  "1° Tribunal de Juicio Oral en lo Penal de Santiago",
];

export const MATERIAS: string[] = [
  "Civil — Cobranza ejecutiva",
  "Civil — Indemnización de perjuicios",
  "Laboral — Despido injustificado",
  "Laboral — Tutela de derechos fundamentales",
  "Familia — Pensión de alimentos",
  "Familia — Cuidado personal",
  "Comercial — Cumplimiento de contrato",
  "Tributario — Reclamación",
  "Penal — Querella",
  "Civil — Nulidad de derecho público",
];

export const CAUSAS: Causa[] = [
  {
    id: "c1", rol: "C-2847-2025", rit: null,
    caratula: "BANCO DEL ESTADO DE CHILE / MARTÍNEZ FUENTES",
    tribunal: TRIBUNALES[0], materia: MATERIAS[0], abogado: ABOGADOS[0],
    semaforo: "rojo", fechaIngreso: "2025-03-12", ultimaActuacion: "2026-05-13",
    cuantia: 24800000, diasUltima: 2,
  },
  {
    id: "c2", rol: "C-1924-2025", rit: null,
    caratula: "INMOBILIARIA DELTA SPA / CONSTRUCTORA SUR LTDA.",
    tribunal: TRIBUNALES[1], materia: MATERIAS[1], abogado: ABOGADOS[1],
    semaforo: "amarillo", fechaIngreso: "2025-04-22", ultimaActuacion: "2026-05-08",
    cuantia: 142500000, diasUltima: 7,
  },
  {
    id: "c3", rol: "T-1102-2025", rit: "O-512-2025",
    caratula: "GONZÁLEZ PARRA / RETAIL ANDINO S.A.",
    tribunal: TRIBUNALES[3], materia: MATERIAS[2], abogado: ABOGADOS[2],
    semaforo: "rojo", fechaIngreso: "2025-05-04", ultimaActuacion: "2026-05-14",
    cuantia: 18400000, diasUltima: 1,
  },
  {
    id: "c4", rol: "C-3401-2024", rit: null,
    caratula: "AGRÍCOLA LOS MAITENES / FISCO DE CHILE",
    tribunal: TRIBUNALES[8], materia: MATERIAS[9], abogado: ABOGADOS[3],
    semaforo: "verde", fechaIngreso: "2024-09-18", ultimaActuacion: "2026-04-29",
    cuantia: 312000000, diasUltima: 16,
  },
  {
    id: "c5", rol: "F-882-2025", rit: "C-201-2025",
    caratula: "VERA SILVA / ARANCIBIA TORRES",
    tribunal: TRIBUNALES[5], materia: MATERIAS[4], abogado: ABOGADOS[4],
    semaforo: "amarillo", fechaIngreso: "2025-02-11", ultimaActuacion: "2026-05-10",
    cuantia: null, diasUltima: 5,
  },
  {
    id: "c6", rol: "C-1578-2024", rit: null,
    caratula: "RAMÍREZ HOLDING SPA / BANCO ITAÚ CORPBANCA",
    tribunal: TRIBUNALES[2], materia: MATERIAS[6], abogado: ABOGADOS[5],
    semaforo: "verde", fechaIngreso: "2024-07-30", ultimaActuacion: "2026-05-02",
    cuantia: 89600000, diasUltima: 13,
  },
  {
    id: "c7", rol: "T-744-2025", rit: "T-118-2025",
    caratula: "MUÑOZ ALARCÓN / SUPERMERCADO CENTRAL S.A.",
    tribunal: TRIBUNALES[4], materia: MATERIAS[3], abogado: ABOGADOS[0],
    semaforo: "amarillo", fechaIngreso: "2025-06-01", ultimaActuacion: "2026-05-09",
    cuantia: 22100000, diasUltima: 6,
  },
  {
    id: "c8", rol: "C-2210-2025", rit: null,
    caratula: "LARRAÍN & CÍA LTDA. / EMPRESA CONSTRUCTORA NORTE",
    tribunal: TRIBUNALES[0], materia: MATERIAS[0], abogado: ABOGADOS[1],
    semaforo: "rojo", fechaIngreso: "2025-08-15", ultimaActuacion: "2026-05-14",
    cuantia: 67400000, diasUltima: 1,
  },
  {
    id: "c9", rol: "F-1290-2024", rit: "C-409-2024",
    caratula: "CONTRERAS LEIVA / CONTRERAS BRAVO",
    tribunal: TRIBUNALES[6], materia: MATERIAS[5], abogado: ABOGADOS[2],
    semaforo: "verde", fechaIngreso: "2024-11-04", ultimaActuacion: "2026-04-21",
    cuantia: null, diasUltima: 24,
  },
  {
    id: "c10", rol: "C-3812-2024", rit: null,
    caratula: "SERVIPAG S.A. / DISTRIBUIDORA CENTRAL SPA",
    tribunal: TRIBUNALES[1], materia: MATERIAS[6], abogado: ABOGADOS[3],
    semaforo: "amarillo", fechaIngreso: "2024-10-20", ultimaActuacion: "2026-05-06",
    cuantia: 41200000, diasUltima: 9,
  },
  {
    id: "c11", rol: "C-988-2025", rit: null,
    caratula: "PEÑA ROJAS / CLÍNICA SANTA ANA",
    tribunal: TRIBUNALES[2], materia: MATERIAS[1], abogado: ABOGADOS[4],
    semaforo: "verde", fechaIngreso: "2025-01-29", ultimaActuacion: "2026-04-30",
    cuantia: 58900000, diasUltima: 15,
  },
  {
    id: "c12", rol: "C-4421-2024", rit: null,
    caratula: "FUNDACIÓN MERCURIO / SII",
    tribunal: TRIBUNALES[7], materia: MATERIAS[7], abogado: ABOGADOS[5],
    semaforo: "amarillo", fechaIngreso: "2024-12-12", ultimaActuacion: "2026-05-07",
    cuantia: 195000000, diasUltima: 8,
  },
];

export const PLAZOS: Plazo[] = [
  { id: "p1",  causaId: "c3",  descripcion: "Contestación de demanda laboral",       dias: 5,  tipoDias: "habiles",  fechaInicio: offsetDate(-3),  fechaVencimiento: offsetDate(0),   estado: "proximo",   diasRestantes: 0,   semaforo: "rojo" },
  { id: "p2",  causaId: "c1",  descripcion: "Acompañar mandato judicial",            dias: 3,  tipoDias: "habiles",  fechaInicio: offsetDate(-2),  fechaVencimiento: offsetDate(1),   estado: "proximo",   diasRestantes: 1,   semaforo: "rojo" },
  { id: "p3",  causaId: "c8",  descripcion: "Réplica",                               dias: 6,  tipoDias: "habiles",  fechaInicio: offsetDate(-1),  fechaVencimiento: offsetDate(2),   estado: "proximo",   diasRestantes: 2,   semaforo: "amarillo" },
  { id: "p4",  causaId: "c7",  descripcion: "Observaciones a la prueba",             dias: 10, tipoDias: "habiles",  fechaInicio: offsetDate(-2),  fechaVencimiento: offsetDate(3),   estado: "proximo",   diasRestantes: 3,   semaforo: "amarillo" },
  { id: "p5",  causaId: "c2",  descripcion: "Lista de testigos",                     dias: 5,  tipoDias: "habiles",  fechaInicio: offsetDate(0),   fechaVencimiento: offsetDate(5),   estado: "proximo",   diasRestantes: 5,   semaforo: "amarillo" },
  { id: "p6",  causaId: "c5",  descripcion: "Audiencia preparatoria (preparación)",  dias: 7,  tipoDias: "corridos", fechaInicio: offsetDate(0),   fechaVencimiento: offsetDate(7),   estado: "pendiente", diasRestantes: 7,   semaforo: "amarillo" },
  { id: "p7",  causaId: "c10", descripcion: "Apelar sentencia",                      dias: 5,  tipoDias: "habiles",  fechaInicio: offsetDate(-5),  fechaVencimiento: offsetDate(-1),  estado: "vencido",   diasRestantes: -1,  semaforo: "rojo" },
  { id: "p8",  causaId: "c12", descripcion: "Reclamo tributario — antecedentes",     dias: 15, tipoDias: "habiles",  fechaInicio: offsetDate(-5),  fechaVencimiento: offsetDate(10),  estado: "pendiente", diasRestantes: 10,  semaforo: "verde" },
  { id: "p9",  causaId: "c4",  descripcion: "Alegato Corte de Apelaciones",          dias: 1,  tipoDias: "habiles",  fechaInicio: offsetDate(11),  fechaVencimiento: offsetDate(12),  estado: "pendiente", diasRestantes: 12,  semaforo: "verde" },
  { id: "p10", causaId: "c6",  descripcion: "Notificar resolución",                  dias: 5,  tipoDias: "habiles",  fechaInicio: offsetDate(-12), fechaVencimiento: offsetDate(-7),  estado: "cumplido",  diasRestantes: -7,  semaforo: "verde" },
  { id: "p11", causaId: "c11", descripcion: "Acompañar peritaje médico",             dias: 20, tipoDias: "corridos", fechaInicio: offsetDate(-8),  fechaVencimiento: offsetDate(12),  estado: "pendiente", diasRestantes: 12,  semaforo: "verde" },
  { id: "p12", causaId: "c9",  descripcion: "Audiencia juicio (preparar minuta)",    dias: 3,  tipoDias: "habiles",  fechaInicio: offsetDate(14),  fechaVencimiento: offsetDate(17),  estado: "pendiente", diasRestantes: 17,  semaforo: "verde" },
  { id: "p13", causaId: "c1",  descripcion: "Solicitar embargo",                     dias: 5,  tipoDias: "habiles",  fechaInicio: offsetDate(-15), fechaVencimiento: offsetDate(-10), estado: "cumplido",  diasRestantes: -10, semaforo: "verde" },
  { id: "p14", causaId: "c3",  descripcion: "Téngase por contestada",                dias: 5,  tipoDias: "habiles",  fechaInicio: offsetDate(-20), fechaVencimiento: offsetDate(-15), estado: "cumplido",  diasRestantes: -15, semaforo: "verde" },
];

export const ACTUACIONES_C1: Actuacion[] = [
  { fecha: offsetDate(-2),  tipo: "Resolución",   titulo: "Resolución: Téngase presente",         actor: "Tribunal",          adjuntos: 1 },
  { fecha: offsetDate(-9),  tipo: "Escrito",      titulo: "Demandante acompaña documentos",        actor: "Catalina Morales",  adjuntos: 4 },
  { fecha: offsetDate(-18), tipo: "Notificación", titulo: "Notificación por cédula al demandado",  actor: "Receptor Judicial", adjuntos: 1 },
  { fecha: offsetDate(-26), tipo: "Resolución",   titulo: "Provee demanda — Traslado",             actor: "Tribunal",          adjuntos: 1 },
  { fecha: offsetDate(-31), tipo: "Escrito",      titulo: "Interpone demanda ejecutiva",           actor: "Catalina Morales",  adjuntos: 7 },
  { fecha: "2025-03-12",   tipo: "Ingreso",      titulo: "Ingreso de causa al sistema",           actor: "Sistema",           adjuntos: 0 },
];

export const DOCUMENTOS_C1: Documento[] = [
  { id: "d1", nombre: "Demanda ejecutiva.pdf",       peso: "428 KB", fecha: "2025-03-12", autor: "Catalina M." },
  { id: "d2", nombre: "Pagaré protestado.pdf",       peso: "1.2 MB", fecha: "2025-03-12", autor: "Catalina M." },
  { id: "d3", nombre: "Mandato judicial.pdf",        peso: "184 KB", fecha: "2025-03-14", autor: "Catalina M." },
  { id: "d4", nombre: "Notificación por cédula.pdf", peso: "612 KB", fecha: "2026-04-27", autor: "Receptor"    },
  { id: "d5", nombre: "Escrito acompaña docs.pdf",   peso: "722 KB", fecha: "2026-05-06", autor: "Catalina M." },
];

export const PROD_ABOGADOS: ProdAbogado[] = [
  { abogadoId: "a1", nombre: "Catalina Morales R.",   causasActivas: 34, causasCerradas: 12, plazosVencidos: 1, plazosCumplidos: 58, tasaCumplimiento: 98 },
  { abogadoId: "a2", nombre: "Felipe Astorga V.",     causasActivas: 28, causasCerradas: 9,  plazosVencidos: 3, plazosCumplidos: 47, tasaCumplimiento: 94 },
  { abogadoId: "a3", nombre: "Javiera Soto L.",       causasActivas: 41, causasCerradas: 14, plazosVencidos: 0, plazosCumplidos: 72, tasaCumplimiento: 100 },
  { abogadoId: "a4", nombre: "Rodrigo Bustamante O.", causasActivas: 22, causasCerradas: 7,  plazosVencidos: 2, plazosCumplidos: 38, tasaCumplimiento: 95 },
  { abogadoId: "a5", nombre: "Antonia Pizarro F.",    causasActivas: 31, causasCerradas: 11, plazosVencidos: 4, plazosCumplidos: 51, tasaCumplimiento: 93 },
  { abogadoId: "a6", nombre: "Matías Cárcamo P.",     causasActivas: 19, causasCerradas: 6,  plazosVencidos: 1, plazosCumplidos: 29, tasaCumplimiento: 97 },
];

export const TENDENCIA: TrendDay[] = Array.from({ length: 30 }, (_, i) => {
  const seed = (i * 13 + 7) % 17;
  return {
    fecha:           offsetDate(-29 + i),
    causasNuevas:    2 + (seed % 4),
    causasCerradas:  1 + ((seed + 3) % 3),
    plazosCreados:   5 + (seed % 6),
    plazosCumplidos: 4 + ((seed + 2) % 5),
  };
});

export const NOTIFICACIONES: Notificacion[] = [
  { id: "n1", tipo: "vencimiento", texto: "Apelación vencida — SERVIPAG / DISTRIBUIDORA", tiempo: "hace 2 h", leido: false },
  { id: "n2", tipo: "nueva",       texto: "Nueva resolución en C-2847-2025",              tiempo: "hace 4 h", leido: false },
  { id: "n3", tipo: "plazo",       texto: "Plazo crítico mañana — Contestación T-1102",   tiempo: "hace 6 h", leido: false },
  { id: "n4", tipo: "asignacion",  texto: "Te asignaron una nueva causa: C-2210-2025",    tiempo: "ayer",     leido: true  },
  { id: "n5", tipo: "documento",   texto: "Receptor subió notificación por cédula",       tiempo: "ayer",     leido: true  },
];

export const USUARIOS: Record<"abogado" | "supervisor" | "admin", Usuario> = {
  abogado: {
    ...ABOGADOS[0],
    cargo: "Abogada Socia",
    contexto: "Mis causas",
    empresa: "Segal Deudores",
  },
  supervisor: {
    id: "u-sup",
    nombre: "Felipe Astorga V.",
    iniciales: "FA",
    color: "#1f3a5f",
    cargo: "Socio Director",
    contexto: "Vista de estudio",
    empresa: "Segal Deudores",
  },
  admin: {
    id: "u-adm",
    nombre: "Paula Riquelme S.",
    iniciales: "PR",
    color: "#8a5a3b",
    cargo: "Coordinadora operativa",
    contexto: "Centro operativo",
    empresa: "Segal Deudores",
  },
};

function computeSemaforo(): SemaforoSummary {
  const result: SemaforoSummary = { verde: 0, amarillo: 0, rojo: 0, total: 0 };
  for (const c of CAUSAS) {
    if (c.semaforo === "rojo") result.rojo++;
    else if (c.semaforo === "amarillo") result.amarillo++;
    else result.verde++;
    result.total++;
  }
  return result;
}

function computeResumenPlazos(): ResumenPlazos {
  const result: ResumenPlazos = { total: 0, pendientes: 0, proximos: 0, vencidos: 0, cumplidos: 0 };
  for (const p of PLAZOS) {
    result.total++;
    if (p.estado === "pendiente") result.pendientes++;
    else if (p.estado === "proximo") result.proximos++;
    else if (p.estado === "vencido") result.vencidos++;
    else if (p.estado === "cumplido") result.cumplidos++;
  }
  return result;
}

export const SEMAFORO: SemaforoSummary = computeSemaforo();
export const RESUMEN_PLAZOS: ResumenPlazos = computeResumenPlazos();

export const ADMIN: AdminData = {
  SYNC_EVENTS: [
    { hora: "09:42", origen: "PJUD",       evento: "23 actualizaciones recibidas",   estado: "ok"   },
    { hora: "09:31", origen: "PJUD",       evento: "Sincronización completa",         estado: "ok"   },
    { hora: "09:18", origen: "Boletín OJ", evento: "8 publicaciones procesadas",      estado: "ok"   },
    { hora: "08:51", origen: "PJUD",       evento: "3 causas con conflicto de datos", estado: "warn" },
    { hora: "08:30", origen: "Sistema",    evento: "Backup diario completado",        estado: "ok"   },
    { hora: "08:05", origen: "PJUD",       evento: "Reintento exitoso (tras error)",  estado: "warn" },
    { hora: "07:00", origen: "Sistema",    evento: "Inicio jornada operativa",        estado: "ok"   },
  ],
  SIN_ASIGNAR: [
    { rol: "C-4521-2026", caratula: "INVERSIONES NORTE SPA / RETAIL DEL SUR S.A.", tribunal: "4° Juzgado Civil de Stgo.",  ingreso: "hoy"  },
    { rol: "T-892-2026",  caratula: "GUERRA FUENTES / TRANSPORTES LITORAL LTDA.",  tribunal: "8° Juzgado Trabajo",         ingreso: "hoy"  },
    { rol: "C-4488-2026", caratula: "BANCO SECURITY / DISTRIBUIDORA ANDINA LTDA.", tribunal: "21° Juzgado Civil de Stgo.", ingreso: "ayer" },
    { rol: "F-1521-2026", caratula: "MORALES VIDAL / MORALES TAPIA",               tribunal: "Juzgado Familia Pudahuel",   ingreso: "ayer" },
  ],
  DATA_QUALITY: [
    { titulo: "Causas sin abogado asignado",    n: 4,  total: 122, severidad: "rojo"     },
    { titulo: "Causas sin materia clasificada", n: 2,  total: 122, severidad: "amarillo" },
    { titulo: "Plazos sin fecha de inicio",     n: 1,  total: 87,  severidad: "amarillo" },
    { titulo: "Documentos sin etiquetar",       n: 18, total: 412, severidad: "verde"    },
  ],
  OPERACIONES_HOY: {
    causasIngresadas: 7, documentosSubidos: 23,
    plazosCreados: 11,   notificacionesEnviadas: 38,
  },
};

export const FINANCIERO: FinancieroData = {
  cuantiaTotal: CAUSAS.reduce((a, c) => a + (c.cuantia ?? 0), 0),
  cuantiaRiesgo: CAUSAS.filter(c => c.semaforo !== "verde").reduce((a, c) => a + (c.cuantia ?? 0), 0),
  honorariosMes: 38_400_000,
  honorariosProyeccion: 142_800_000,
  facturacionTrimestre: [
    { mes: "Mar", v: 31_200_000 },
    { mes: "Abr", v: 34_500_000 },
    { mes: "May", v: 38_400_000 },
  ],
};
